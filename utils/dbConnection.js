import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Database connected succesfully");
  } catch (error) {
    console.log(error.message);
  }
};
