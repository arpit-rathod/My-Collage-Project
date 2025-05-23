import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DataBaseConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database connected to",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};
export default DataBaseConnection;
