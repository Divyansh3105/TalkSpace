const NotificationSkeleton = () => {
  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <div className="skeleton size-14 rounded-full shrink-0" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-36 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          </div>

          {/* Action button */}
          <div className="skeleton h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  );
};

export default NotificationSkeleton;
