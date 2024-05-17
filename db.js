const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ilef:ilef@cluster0.wgxbfxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1); 
  }
};

module.exports = connectDB;
