import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key and secret are required");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Both throw on failure; callers turn that into a 500 rather than carrying on half-synced
export const upsertStreamUser = async (userData) => {
  await streamClient.upsertUser(userData);
  return userData;
};

export const generateStreamToken = (userId) => streamClient.createToken(userId.toString());
