import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { getUserFromToken } from './auth.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    // Custom error formatting
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code,
      path: error.path
    };
  },
  introspection: true, // Enable GraphQL Playground in production
  playground: true
});

// Start server
async function startServer() {
  await server.start();

  // Middleware
  app.use(cors({
    origin: '*', // Allow all origins for testing
    credentials: true
  }));
  
  app.use(bodyParser.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'TMS GraphQL API is running',
      timestamp: new Date().toISOString()
    });
  });

  // GraphQL endpoint with authentication context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Extract token from Authorization header
        const token = req.headers.authorization || '';
        const user = getUserFromToken(token);
        
        return {
          user,
          token
        };
      }
    })
  );

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to TMS GraphQL API',
      endpoints: {
        graphql: '/graphql',
        health: '/health'
      },
      documentation: 'Visit /graphql for GraphQL Playground',
      defaultCredentials: {
        admin: {
          email: 'admin@tms.com',
          password: 'admin@123'
        },
        employee: {
          email: 'employee@tms.com',
          password: 'employee@123'
        }
      }
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 TMS GraphQL API Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 Health check at http://localhost:${PORT}/health`);
    console.log(`\n📝 Default Login Credentials:`);
    console.log(`   Admin: admin@tms.com / admin@123`);
    console.log(`   Employee: employee@tms.com / employee@123`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
