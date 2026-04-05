const UserCardSkeleton = () => {
  return (
    <div className="card bg-base-200">
      <div className="card-body p-5 space-y-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className="skeleton size-16 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>

        {/* Bio lines */}
        <div className="space-y-1.5">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-4/5 rounded" />
        </div>

        {/* Action button */}
        <div className="skeleton h-10 w-full rounded" />
      </div>
    </div>
  );
};

export default UserCardSkeleton;
