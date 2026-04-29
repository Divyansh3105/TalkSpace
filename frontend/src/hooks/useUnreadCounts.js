/**
 * useUnreadCounts.js
 *
 * Tracks total unread message count across all Stream Chat channels.
 * Subscribes to notification.message_new (new message in unwatched channel)
 * and message.new (new message in an active channel the user hasn't read).
 *
 * Returns: { totalUnread: number }
 */

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { getStreamToken } from "../lib/api";
import useAuthUser from "./useAuthUser";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const useUnreadCounts = () => {
  const { authUser } = useAuthUser();
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!authUser) return;

    let mounted = true;
    const handlers = [];

    const setup = async () => {
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        if (!client.userID) {
          const { token } = await getStreamToken();
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            token,
          );
        }

        // Seed from current connection state
        if (mounted) {
          setTotalUnread(client.user?.total_unread_count ?? 0);
        }

        // Stream fires this event whenever unread counts change globally
        handlers.push(
          client.on("notification.message_new", (event) => {
            if (!mounted) return;
            setTotalUnread(event.total_unread_count ?? 0);
          }),
        );

        handlers.push(
          client.on("notification.mark_read", (event) => {
            if (!mounted) return;
            setTotalUnread(event.total_unread_count ?? 0);
          }),
        );

        // Fired when the user opens a channel and messages are marked read
        handlers.push(
          client.on("message.read", () => {
            if (!mounted) return;
            setTotalUnread(client.user?.total_unread_count ?? 0);
          }),
        );
      } catch (err) {
        console.error("[useUnreadCounts] setup error:", err);
      }
    };

    setup();

    return () => {
      mounted = false;
      handlers.forEach((h) => h?.unsubscribe?.());
    };
  }, [authUser]);

  return { totalUnread };
};

export default useUnreadCounts;
