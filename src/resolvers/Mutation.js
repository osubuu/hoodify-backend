// Mutations in here must match mutations defined in schema.graphql
// info refers to what we want back in our response
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
      where: { id: args.id }
    };
    const item = await ctx.db.mutation.updateItem(params, info);
    return item;
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. Find item
    const item = await ctx.db.query.item({ where }, '{ id title }');
    // 2. TODO: check if they own that item or have the permissions
    // 3. Delete it
    return ctx.db.mutation.deleteItem({ where }, info);;
  }
};

module.exports = Mutations;
