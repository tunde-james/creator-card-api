const { createHandler } = require('@app-core/server');
const createCreatorCard = require('@app/services/creator-cards/create-creator-card');
const { CreatorCardsMessages: Messages } = require('@app/messages');

module.exports = createHandler({
  path: '/creator-cards',
  method: 'post',
  middlewares: [],
  async handler(rc, helpers) {
    const payload = rc.body;

    const responseData = await createCreatorCard(payload);

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: Messages.CREATOR_CARD_CREATED,
      data: responseData,
    };
  },
});
