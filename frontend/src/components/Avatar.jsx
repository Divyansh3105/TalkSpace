import { useState } from "react";

/**
 * Avatar — round profile image that falls back to initials when the
 * image is missing or fails to load. Pass `isOnline` (true/false) to
 * overlay a presence dot; omit it to show none.
 */
const Avatar = ({ src, name = "", className = "size-12", isOnline }) => {
  // Track which src failed, so a new src gets a fresh attempt
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = failedSrc === src;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <div className={`relative shrink-0 [container-type:size] ${className}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          onError={() => setFailedSrc(src)}
          className="size-full rounded-full object-cover bg-base-300"
        />
      ) : (
        <div
          aria-label={name}
          className="size-full rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center text-[38cqw]"
        >
          {initials}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-base-100 ${
            isOnline ? "bg-success" : "bg-base-content/30"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
