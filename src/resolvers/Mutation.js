// Mutations in here must match mutations defined in schema.graphql
const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in
    const params = { data: { ...args } };
    const item = await ctx.db.mutation.createItem(params, info);
    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id; // remove id from the updates because not updating ID
    const params = {
      data: updates,
      where: args.id
    };
    const item = await ctx.db.mutation.updateItem(params, info);
    return item;
  }
};

module.exports = Mutations;
