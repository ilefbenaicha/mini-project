const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const connectDB = require ('./db')
const userProtoPath = "user.proto";
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;

const userService = {
  getUser: (call, callback) => {
    const user = {
      id: call.request.user_id,
      name: "user1",
      email: "user@gmail.com",
      password: "user123",
    };
    callback(null, { user });
  },
  searchUsers: (call, callback) => {
    const { query } = call.request;

    const users = [
      {
        id: "1",
        name: "User 1",
        email: "user1@gmail.com",
        password: "user123",
      },
      {
        id: "2",
        name: "User 2 ",
        email: "user2@gmail.com",
        password: "user1234",
      },
    ];
    callback(null, { users });
  },
  createUser: (call, callback) => {
    const { query } = call.request;
    const user = {
      id: call.request.user_id,
      name: call.request.name,
      email: call.request.email,
      password: call.request.password,
    };
    callback(null, { user });
  },
};

const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);
const port = 50051;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind server:", err);
      return;
    }

    console.log(`Server is running on port ${port}`);
    server.start();
  }
);
console.log(`User microservice running on port ${port}`);
connectDB();