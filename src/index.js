const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// decode the JWT so we can get the user ID on each request
server.express.use((request, response, next) => {
  const { token } = request.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the request for future requests to access
    request.userId = userId;
  }
  next();
});

// Use express middleware to populate current user
// Create a middleware that populates the user on each request
server.express.use(async (request, response, next) => {
  // if not logged in, skip
  if (!request.userId) {
    next();
    return;
  }
  const user = await db.query.user(
    { where: { id: request.userId } },
    '{ id, permissions, email, name }',
  );
  request.user = user;
});

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  },
}, details => {
  console.log(`Server is now running on port http://localhost:${details.port}`);
});
