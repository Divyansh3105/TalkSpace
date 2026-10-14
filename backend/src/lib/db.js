import dns from "node:dns";
import mongoose from "mongoose";

const connect = () => mongoose.connect(process.env.MONGODB_URI);

export const connectDB = async () => {
  try {
    let conn;
    try {
      conn = await connect();
    } catch (error) {
      // Some Windows setups leave Node unable to read the system DNS config,
      // so it asks 127.0.0.1 and mongodb+srv lookups are refused.
      // Retry once with public resolvers.
      if (error.syscall !== "querySrv" || error.code !== "ECONNREFUSED") throw error;
      console.warn(
        `SRV lookup refused by ${dns.getServers().join(", ")}; retrying with public DNS`,
      );
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
      conn = await connect();
    }
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);
    process.exit(1);
  }
};
