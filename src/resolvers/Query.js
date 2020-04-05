const { forwardTo } = require('prisma-binding');
// use forwardto if no custom logic (i.e just plain get or push data)

// Queries in here must match mutations defined in schema.graphql
const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
};

module.exports = Query;
