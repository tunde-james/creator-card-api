const { createHandler } = require('@app-core/server');
const deleteCreatorCard = require('@app/services/creator-cards/delete-creator-card');
const { CreatorCardsMessages: Messages } = require('@app/messages');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  middlewares: [],
  async handler(rc, helpers) {
    const payload = {
      slug: rc.params.slug,
      creator_reference: rc.body.creator_reference,
    };

    const responseData = await deleteCreatorCard(payload);

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: Messages.CREATOR_CARD_DELETED,
      data: responseData,
    };
  },
});
