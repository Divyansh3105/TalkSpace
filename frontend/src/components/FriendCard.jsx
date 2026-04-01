import { Link } from "react-router";
import { MessageSquareIcon, PhoneCallIcon, UserIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img
              src={friend.profilePic}
              alt={friend.fullName}
              className="rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
            {friend.location && (
              <p className="text-xs opacity-60 truncate">{friend.location}</p>
            )}
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
          <Link
            to={`/call?friendId=${friend._id}`}
            className="btn btn-outline btn-sm flex-1 gap-1"
            title="Call"
          >
            <PhoneCallIcon className="size-4" />
            Call
          </Link>
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-ghost btn-sm btn-square"
            title="View Profile"
          >
            <UserIcon className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default FriendCard;
