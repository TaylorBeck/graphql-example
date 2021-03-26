const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    hello(name: String!): String!
    user: User
  }

  type Error {
    field: String!
    message: String!
  }

  type User {
    id: ID!
    username: String!
    firstLetterOfUsername: String!
  }

  type RegisterResponse {
    errors: [Error!]!
    user: User
  }

  input UserInfo {
    username: String!
    password: String!
    age: Int
  }

  type Mutation {
    register(userInfo: UserInfo): RegisterResponse
    login(userInfo: UserInfo): String!
  }
`;

const resolvers = {
  User: {
    firstLetterOfUsername: parent => {
      return parent.username[0];
    },
    username: parent => {
      console.log(parent);
      return parent.username;
    }
  },
  Query: {
    hello: (parent, { name }) => `Hey ${name}!`,
    user: () => ({
      id: 1,
      username: 'Bobby'
    })
  },
  Mutation: {
    login: (_parent, args, _context, _info) => {
      const {
        userInfo: { username },
      } = args;

      return username;
    },
    register: () => ({
      errors: [
        {
          field: 'Username',
          message: 'Please enter a valid username.'
        },
        null,
      ],
      user: {
        id: 1,
        username: 'Bobby'
      }
    }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }) // available in resolvers
});

server.listen().then(({ url }) => console.log(`(☞ﾟ_ﾟ)☞ Server started at ${url}`));
