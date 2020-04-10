const { forwardTo } = require('prisma-binding');
// use forwardto if no custom logic (i.e just plain get or push data)

// Queries in here must match mutations defined in schema.graphql
const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  }
};

module.exports = Query;
