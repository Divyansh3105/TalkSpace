import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import { ArrowLeftIcon, VideoIcon } from "lucide-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import Avatar from "../components/Avatar";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Replaces Stream's ChannelHeader so the header follows the app theme and
// carries the call action inline instead of floating over it.
const ChatHeader = ({ onVideoCall }) => {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const other = Object.values(channel.state.members).find(
    (m) => m.user?.id !== client.userID,
  )?.user;

  return (
    <div className="flex items-center gap-3 h-16 px-3 sm:px-5 border-b border-base-content/[0.06] bg-base-100">
      <Link
        to="/friends"
        className="btn btn-ghost btn-sm btn-circle lg:hidden"
        aria-label="Back to friends"
      >
        <ArrowLeftIcon className="size-5" />
      </Link>
      <Avatar src={other?.image} name={other?.name} className="size-10" isOnline={!!other?.online} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold truncate">{other?.name}</p>
        <p className={`text-xs ${other?.online ? "text-success" : "text-base-content/50"}`}>
          {other?.online ? "Online" : "Offline"}
        </p>
      </div>
      <button
        onClick={onVideoCall}
        className="btn btn-sm bg-primary/10 text-primary border-transparent hover:bg-primary hover:text-primary-content hover:border-transparent gap-1.5"
        title="Start a video call"
      >
        <VideoIcon className="size-4" />
        <span className="hidden sm:inline">Video call</span>
      </button>
    </div>
  );
};

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken", authUser?._id],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    let clientInstance = null;

    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {


        clientInstance = StreamChat.getInstance(STREAM_API_KEY);

        await clientInstance.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token,
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = clientInstance.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(clientInstance);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (clientInstance) clientInstance.disconnectUser().catch(console.error);
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="w-full h-[calc(100dvh-8rem)] lg:h-[calc(100dvh-4rem)] flex flex-col">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <Window>
            <ChatHeader onVideoCall={handleVideoCall} />
            <MessageList />
            <MessageInput focus />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
