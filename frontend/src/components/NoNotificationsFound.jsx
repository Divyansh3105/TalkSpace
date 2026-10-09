import { BellIcon } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="panel flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="size-14 rounded-full bg-base-content/5 flex items-center justify-center mb-4">
        <BellIcon className="size-7 text-base-content/40" />
      </div>
      <h3 className="font-semibold">No notifications yet</h3>
      <p className="text-sm text-base-content/60 max-w-sm mt-1">
        When you receive friend requests or messages, they'll appear here.
      </p>
    </div>
  );
}

export default NoNotificationsFound;
