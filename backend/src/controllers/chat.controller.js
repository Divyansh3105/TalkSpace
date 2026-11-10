import { generateStreamToken, openDirectChannel } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken controller:", error);
    res.status(500).json({ message: "Failed to generate Stream token" });
  }
}

// The only way to start a 1:1 chat: the server checks the friendship, then creates the channel
export async function openChannel(req, res) {
  const { id: otherId } = req.params;
  const isFriend = (req.user.friends ?? []).some((f) => f.toString() === otherId);
  if (!isFriend) {
    return res.status(403).json({ message: "You can only chat with friends" });
  }

  try {
    const channelId = await openDirectChannel(req.user.id, otherId);
    res.status(200).json({ channelId });
  } catch (error) {
    console.error("Error in openChannel controller:", error);
    res.status(500).json({ message: "Could not open the chat" });
  }
}
