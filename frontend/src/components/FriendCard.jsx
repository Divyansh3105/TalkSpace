import { useState } from "react";
import { Link } from "react-router";
import { MessageSquareIcon, UserMinusIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "../lib/api";
import Avatar from "./Avatar";
import toast from "react-hot-toast";

const FriendCard = ({ friend, isOnline = false }) => {
  const queryClient = useQueryClient();
  // Unfriending is destructive: first click arms the button, second click confirms.
  const [confirming, setConfirming] = useState(false);

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
    <div className="panel panel-interactive p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar
          src={friend.profilePic}
          name={friend.fullName}
          isOnline={isOnline}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
          <p className="text-xs text-base-content/60 truncate">
            <span className={isOnline ? "text-success font-medium" : ""}>
              {isOnline ? "Online" : "Offline"}
            </span>
            {friend.location && ` · ${friend.location}`}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-primary btn-sm flex-1 gap-1.5"
        >
          <MessageSquareIcon className="size-4" />
          Message
        </Link>
        <button
          className={`btn btn-sm ${
            confirming
              ? "btn-error"
              : "btn-ghost btn-square text-base-content/50 hover:text-error"
          }`}
          title={confirming ? "Click again to remove" : "Unfriend"}
          aria-label={confirming ? `Confirm removing ${friend.fullName}` : `Unfriend ${friend.fullName}`}
          onClick={() => (confirming ? unfriend() : setConfirming(true))}
          onBlur={() => setConfirming(false)}
          onMouseLeave={() => setConfirming(false)}
          disabled={isUnfriending}
        >
          {confirming ? "Remove" : <UserMinusIcon className="size-4" />}
        </button>
      </div>
    </div>
  );
};
export default FriendCard;
