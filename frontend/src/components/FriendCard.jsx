import { Link } from "react-router";
import { MessageSquareIcon, UserMinusIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "../lib/api";
import OnlineBadge from "./OnlineBadge";
import toast from "react-hot-toast";

const FriendCard = ({ friend, isOnline = false }) => {
  const queryClient = useQueryClient();

  const { mutate: unfriend, isPending: isUnfriending } = useMutation({
    mutationFn: () => removeFriend(friend._id),
    onMutate: async () => {
      // Optimistically remove from cache
      await queryClient.cancelQueries({ queryKey: ["friends"] });
      const prev = queryClient.getQueryData(["friends"]);
      queryClient.setQueryData(["friends"], (old = []) =>
        old.filter((f) => f._id !== friend._id),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["friends"], ctx.prev);
      toast.error("Failed to unfriend. Please try again.");
    },
    onSuccess: () => toast.success(`${friend.fullName} removed from friends.`),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["friends"] }),
  });

  return (
    <div className="card glass-panel hover-lift">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar with online indicator dot overlaid on the corner */}
          <div className="relative shrink-0">
            <div className="avatar size-12">
              <img
                src={friend.profilePic}
                alt={friend.fullName}
                className="rounded-full"
              />
            </div>
            {/* Corner presence dot */}
            <span className="absolute bottom-0 right-0">
              <OnlineBadge isOnline={isOnline} showLabel={false} size="sm" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
            {friend.location && (
              <p className="text-xs opacity-60 truncate">{friend.location}</p>
            )}
            {/* Inline Online / Offline label */}
            <OnlineBadge isOnline={isOnline} showLabel size="sm" />
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex gap-2">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-outline btn-sm flex-1 gap-1"
            title="Chat"
          >
            <MessageSquareIcon className="size-4" />
            Chat
          </Link>
          <button
            className="btn btn-ghost btn-sm text-error px-2"
            title="Unfriend"
            onClick={() => unfriend()}
            disabled={isUnfriending}
          >
            <UserMinusIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default FriendCard;
