const { appLogger } = require('@app-core/logger');
const CreatorCard = require('@app/repository/creator-cards');
const serializeCreatorCard = require('@app/services/utils/serialize-creator-card');
const throwBusinessError = require('@app/services/utils/throw-business-error');
const { CreatorCardsMessages: Messages } = require('@app/messages');

async function getCreatorCard(serviceData, options = {}) {
  let result;

  try {
    const { slug, access_code: accessCode } = serviceData;

    const card = await CreatorCard.findOne({ query: { slug } });

    if (!card) {
      throwBusinessError(Messages.CARD_NOT_FOUND, 'NF01', 404);
    }

    if (card.status === 'draft') {
      throwBusinessError(Messages.DRAFT_NOT_FOUND, 'NF02', 404);
    }

    if (card.access_type === 'private') {
      if (!accessCode) {
        throwBusinessError(Messages.PRIVATE_ACCESS_REQUIRED, 'AC03', 403);
      }

      if (accessCode !== card.access_code) {
        throwBusinessError(Messages.INVALID_ACCESS_CODE, 'AC04', 403);
      }
    }

    result = serializeCreatorCard(card, { includeAccessCode: false });
  } catch (error) {
    appLogger.errorX(error, 'get-creator-card-error');
    throw error;
  }

  return result;
}

module.exports = getCreatorCard;