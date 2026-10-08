import { app } from "./app.js";
import { connectDB } from "./lib/db.js";
import { env } from "./lib/env.js";

const startServer = async () => {
  try {
    await connectDB(); // connect first

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
