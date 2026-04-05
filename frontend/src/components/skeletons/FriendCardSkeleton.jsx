const FriendCardSkeleton = () => {
  return (
    <div className="card bg-base-200">
      <div className="card-body p-4">
        {/* Avatar + name row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="skeleton size-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>

        {/* Chat button */}
        <div className="skeleton h-8 w-full rounded" />
      </div>
    </div>
  );
};

export default FriendCardSkeleton;
