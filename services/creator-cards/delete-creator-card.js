const { appLogger } = require('@app-core/logger');
const CreatorCard = require('@app/repository/creator-cards');
const serializeCreatorCard = require('@app/services/utils/serialize-creator-card');
const throwBusinessError = require('@app/services/utils/throw-business-error');
const { CreatorCardsMessages: Messages } = require('@app/messages');

async function deleteCreatorCard(serviceData) {
  let result;

  try {
    const { slug, creator_reference: creatorReference } = serviceData;

    const card = await CreatorCard.findOne({ query: { slug } });

    if (!card) {
      throwBusinessError(Messages.CARD_NOT_FOUND, 'NF01', 404);
    }

    if (card.creator_reference !== creatorReference) {
      throwBusinessError(Messages.CARD_NOT_FOUND, 'NF01', 404);
    }
    await CreatorCard.deleteOne({ query: { _id: card._id } });

    const now = Date.now();
    const deletedCard = {
      ...card,
      deleted: now,
    };

    result = serializeCreatorCard(deletedCard, { includeAccessCode: true });
  } catch (error) {
    appLogger.errorX(error, 'delete-creator-card-error');
    throw error;
  }

  return result;
}

module.exports = deleteCreatorCard;
