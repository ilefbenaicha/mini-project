const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const userProtoPath = "user.proto";
const productProtoPath = "product.proto";
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
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

const resolvers = {
  Query: {
    user: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientUsers.getUser({ userId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.user);
          }
        });
      });
    },
    users: () => {
      return new Promise((resolve, reject) => {
        clientUsers.searchUsers({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.users);
          }
        });
      });
    },
    product: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientProducts.getProduct({ productId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.product);
          }
        });
      });
    },
    products: () => {
      return new Promise((resolve, reject) => {
        clientProducts.searchProducts({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.products);
          }
        });
      });
    },
  },
  Mutation: {
    createUser: (_, { id, name, email, password }) => {
      return new Promise((resolve, reject) => {
        clientUsers.createUser(
          { user_id: id, name: name, email: email, password: password },
          (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.user);
            }
          }
        );
      });
    },
  },
};

module.exports = resolvers;
