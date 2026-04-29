/**
 * useStreamPresence.js
 *
 * Connects a lightweight Stream Chat client (reusing the singleton created by
 * ChatPage via StreamChat.getInstance) and tracks which friend user-IDs are
 * currently online.
 *
 * Usage:
 *   const { isOnline } = useStreamPresence(friendIds);
 *   isOnline("507f1f77bcf86cd799439011") // → true | false
 *
 * The hook watches the "user.presence.changed" event emitted by Stream and
 * keeps a local Set in sync.  It also performs an initial query to seed the
 * presence state before any events arrive.
 */

import { useEffect, useState, useCallback } from "react";
import { StreamChat } from "stream-chat";
import { getStreamToken } from "../lib/api";
import useAuthUser from "./useAuthUser";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

/**
 * @param {string[]} friendIds - Array of MongoDB user IDs to watch
 * @returns {{ isOnline: (userId: string) => boolean, ready: boolean }}
 */
const useStreamPresence = (friendIds = []) => {
  const { authUser } = useAuthUser();
  const [onlineIds, setOnlineIds] = useState(new Set());
  const [ready, setReady] = useState(false);

  const isOnline = useCallback(
    (userId) => onlineIds.has(userId),
    [onlineIds],
  );

  useEffect(() => {
    if (!authUser || friendIds.length === 0) return;

    let client = null;
    let handler = null;
    let mounted = true;

    const setup = async () => {
      try {
        // Reuse the singleton so we don't open a second WS connection
        client = StreamChat.getInstance(STREAM_API_KEY);

        // Connect only if not already connected
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

        // Seed initial presence by querying the users we care about.
        // Stream returns each user with an `online` boolean.
        const streamIds = friendIds; // Stream user IDs == our MongoDB _ids
        const { users } = await client.queryUsers(
          { id: { $in: streamIds } },
          {},
          { presence: true },
        );

        if (!mounted) return;

        const initialOnline = new Set(
          users.filter((u) => u.online).map((u) => u.id),
        );
        setOnlineIds(initialOnline);
        setReady(true);

        // Subscribe to real-time presence changes
        handler = client.on("user.presence.changed", (event) => {
          if (!mounted) return;
          const { user } = event;
          if (!friendIds.includes(user.id)) return; // only care about friends

          setOnlineIds((prev) => {
            const next = new Set(prev);
            if (user.online) {
              next.add(user.id);
            } else {
              next.delete(user.id);
            }
            return next;
          });
        });
      } catch (err) {
        console.error("[useStreamPresence] setup error:", err);
      }
    };

    setup();

    return () => {
      mounted = false;
      handler?.unsubscribe?.();
      // Do NOT disconnect the client here — ChatPage owns the connection
    };
  }, [authUser, JSON.stringify(friendIds)]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isOnline, ready };
};

export default useStreamPresence;
