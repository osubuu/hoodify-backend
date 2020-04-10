const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // hash password
    const password = await bcrpyt.hash(args.password, 10);
    // create user in DB
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] }
      }
    }, info);
    // create the JWT token for user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // we set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // return user to browser
    return user;
  },
  async signin(parent, args, ctx, info) {
    // 1. Check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2. Check if password is correct
    const valid = await bcrpyt.compare(args.password, user.password);
    if (!valid) {
      throw new Error('Invalid password!');
    }
    // 3. Generate the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // 5. Return the user
    return user;
  }
};

module.exports = Mutations;
