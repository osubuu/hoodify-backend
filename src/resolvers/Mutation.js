// Mutations in here must match mutations defined in schema.graphql
const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in
    const data = { data: { ...args } };
    const item = await ctx.db.mutation.createItem(data, info);
    return item;
  }
};

module.exports = Mutations;
