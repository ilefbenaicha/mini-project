const { gql } = require("@apollo/server");


const typeDefs =`#graphql
  type User {
    id: String!
    name: String!
    email: String!
    password:String!
  }

  type Product {
    id: String!
    title: String!
    description: String!
    price:Float!
  }

  type Query {
    user(id: String!): User
    users: [User]
    product(id: String!): Product
    products: [Product]
  }
  type Mutation {
    createUser(id: String!, name: String!, email:String!,password:String!): User
  }
`;

module.exports = typeDefs;
