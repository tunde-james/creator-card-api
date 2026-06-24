function serializeCreatorCard(doc, options = {}) {
  const { includeAccessCode = false } = options;

  const serialized = {
    id: doc._id || doc.id,
    title: doc.title,
    description: doc.description,
    slug: doc.slug,
    creator_reference: doc.creator_reference,
    links: (doc.links || []).map((link) => ({
      title: link.title,
      url: link.url,
    })),
    service_rates: doc.service_rates
      ? {
          currency: doc.service_rates.currency,
          rates: (doc.service_rates.rates || []).map((rate) => ({
            name: rate.name,
            description: rate.description,
            amount: rate.amount,
          })),
        }
      : undefined,
    status: doc.status,
    access_type: doc.access_type || 'public',
    created: doc.created,
    updated: doc.updated,
    deleted: doc.deleted || null,
  };

  if (includeAccessCode) {
    serialized.access_code = doc.access_code || null;
  }

  return serialized;
}

module.exports = serializeCreatorCard;
