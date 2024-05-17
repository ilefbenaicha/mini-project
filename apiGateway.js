const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require('./db');
const bodyParser = require("body-parser");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const userProtoPath = "user.proto";
const productProtoPath = "product.proto";

const resolvers = require("./resolvers");
const typeDefs = require("./schema");
connectDB();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;

const clientUsers = new userProto.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
const clientProducts = new productProto.ProductService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

// Define REST endpoints for users and products
app.get("/users", (req, res) => {
  clientUsers.searchUsers({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.users);
    }
  });
});

app.post("/user", (req, res) => {
  const { id, name, email, password } = req.body;
  clientUsers.createUser(
    { user_id: id, name: name, email: email, password: password },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.user);
      }
    }
  );
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  clientUsers.getUser({ userId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.user);
    }
  });
});

app.get("/products", (req, res) => {
  clientProducts.searchProducts({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.products);
    }
  });
});

app.get("/products/:id", (req, res) => {
  const id = req.params.id;
  clientProducts.getProduct({ productId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.product);
    }
  });
});

// Apollo Server setup and starting Express server
async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const port = 3000;
  app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
    console.log(`GraphQL endpoint available at http://localhost:${port}${server.graphqlPath}`);
  });
}

startApolloServer();
