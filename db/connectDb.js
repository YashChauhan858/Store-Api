import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(connect.connection.name, connect.connection.host);
  } catch (error) {
    console.log("error while connecting mongoose to mongodb", error);
    process.exit(1);
  }
};

export default connectDb;
