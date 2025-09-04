import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}/sarahah-app`);
    console.log("The database connection successful.");
  } catch (error) {
    console.error("Database connection failed", error);
  }
};

export default connectDB;