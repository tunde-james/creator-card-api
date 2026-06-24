const { createHandler } = require('@app-core/server');
const getCreatorCard = require('@app/services/creator-cards/get-creator-card');
const { CreatorCardsMessages: Messages } = require('@app/messages');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',
  middlewares: [],
  async handler(rc, helpers) {
    const payload = {
      slug: rc.params.slug,
      access_code: rc.query.access_code,
    };

    const responseData = await getCreatorCard(payload);

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: Messages.CREATOR_CARD_RETRIEVED,
      data: responseData,
    };
  },
});
