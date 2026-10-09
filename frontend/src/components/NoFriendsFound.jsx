import { UsersIcon } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="panel p-8 flex flex-col items-center text-center gap-3">
      <div className="size-12 rounded-full bg-base-content/5 flex items-center justify-center">
        <UsersIcon className="size-6 text-base-content/40" />
      </div>
      <div>
        <h3 className="font-semibold">No friends yet</h3>
        <p className="text-sm text-base-content/60 mt-1">
          Connect with users below to start chatting together!
        </p>
      </div>
    </div>
  );
};

export default NoFriendsFound;
