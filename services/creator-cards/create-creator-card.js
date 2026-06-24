const validator = require('@app-core/validator');
const { ulid } = require('@app-core/randomness');
const { appLogger } = require('@app-core/logger');
const CreatorCard = require('@app/repository/creator-cards');
const serializeCreatorCard = require('@app/services/utils/serialize-creator-card');
const throwBusinessError = require('@app/services/utils/throw-business-error');
const { CreatorCardsMessages: Messages } = require('@app/messages');

const spec = `root {
  title string<minLength:3|maxLength:100>
  description? string<maxLength:500>
  slug? string<lengthBetween:5,50>
  creator_reference string<length:20>
  links[]? {
    title string<minLength:1|maxLength:100>
    url string<maxLength:200>
  }
  service_rates? {
    currency string
    rates[] {
      name string<minLength:3|maxLength:100>
      description string<maxLength:250>
      amount number<min:1>
    }
  }
  status string(draft|published)
  access_type? string(public|private)
  access_code? string<length:6>
}`;

const parsedSpec = validator.parse(spec);

async function generateSlug(title, existingSlug = null) {
  if (existingSlug) return existingSlug;

  let slug = title.toLowerCase();

  let result = '';
  for (let i = 0; i < slug.length; i += 1) {
    const char = slug[i];
    if (char === ' ') {
      result += '-';
    } else {
      result += char;
    }
  }
  slug = result;

  let cleaned = '';
  for (let i = 0; i < slug.length; i += 1) {
    const char = slug[i];
    const code = char.charCodeAt(0);

    const isLowercaseLetter = code >= 97 && code <= 122;
    const isDigit = code >= 48 && code <= 57;
    const isHyphen = char === '-';
    const isUnderscore = char === '_';

    if (isLowercaseLetter || isDigit || isHyphen || isUnderscore) {
      cleaned += char;
    }
  }
  slug = cleaned;

  let isTaken = false;
  if (slug.length >= 5) {
    const existing = await CreatorCard.findOne({ query: { slug } });
    isTaken = !!existing;
  }

  if (slug.length < 5 || isTaken) {
    const suffix = ulid().toLowerCase().slice(0, 6);
    slug = `${slug}-${suffix}`;
  }

  return slug;
}

function validateUrl(url) {
  const httpPrefix = 'http://';
  const httpsPrefix = 'https://';

  return (
    (url.length >= httpPrefix.length && url.substring(0, httpPrefix.length) === httpPrefix) ||
    (url.length >= httpsPrefix.length && url.substring(0, httpsPrefix.length) === httpsPrefix)
  );
}

async function createCreatorCard(serviceData) {
  let result;

  try {
    const data = validator.validate(serviceData, parsedSpec);

    if (data.access_type === 'private' && !data.access_code) {
      throwBusinessError(Messages.ACCESS_CODE_REQUIRED, 'AC01', 400);
    }

    if (data.access_code && data.access_type !== 'private') {
      throwBusinessError(Messages.ACCESS_CODE_ON_PUBLIC, 'AC05', 400);
    }

    if (data.links && data.links.length > 0) {
      for (let i = 0; i < data.links.length; i += 1) {
        const link = data.links[i];
        if (!validateUrl(link.url)) {
          throwBusinessError(Messages.INVALID_URL, 'VALIDATIONERR', 400);
        }
      }
    }

    if (data.service_rates) {
      if (!data.service_rates.rates || data.service_rates.rates.length === 0) {
        throwBusinessError(Messages.RATES_REQUIRED, 'VALIDATIONERR', 400);
      }
    }

    const { slug: providedSlug } = data;
    let slug = providedSlug;

    if (!slug) {
      slug = await generateSlug(data.title);
    } else {
      const existing = await CreatorCard.findOne({ query: { slug } });
      if (existing) {
        throwBusinessError(Messages.SLUG_ALREADY_TAKEN, 'SL02', 400);
      }
    }

    const now = Date.now();
    const cardData = {
      _id: ulid(),
      title: data.title,
      description: data.description,
      slug,
      creator_reference: data.creator_reference,
      links: data.links || [],
      service_rates: data.service_rates,
      status: data.status,
      access_type: data.access_type || 'public',
      access_code: data.access_code || null,
      created: now,
      updated: now,
      deleted: 0,
    };

    const created = await CreatorCard.create(cardData);

    result = serializeCreatorCard(created, { includeAccessCode: true });
  } catch (error) {
    appLogger.errorX(error, 'create-creator-card-error');
    throw error;
  }

  return result;
}

module.exports = createCreatorCard;
