/**
 * OnlineBadge — a small animated green dot with an "Online" / "Offline" label.
 *
 * Props:
 *   isOnline  boolean   whether the user is currently online
 *   showLabel boolean   render the text label (default: true)
 *   size      "sm"|"md" dot size (default: "sm")
 */
const OnlineBadge = ({ isOnline, showLabel = true, size = "sm" }) => {
  const dotSize = size === "md" ? "size-3" : "size-2.5";

  return (
    <span className="flex items-center gap-1.5">
      <span className="relative flex shrink-0">
        {isOnline && (
          <span
            className={`absolute inline-flex ${dotSize} rounded-full bg-success opacity-75 animate-ping`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full ${dotSize} ${
            isOnline ? "bg-success" : "bg-base-content/25"
          }`}
        />
      </span>

      {showLabel && (
        <span
          className={`text-xs font-medium ${
            isOnline ? "text-success" : "text-base-content/40"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      )}
    </span>
  );
};

export default OnlineBadge;
