import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Kết nối thành công tới mongoDB");
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
