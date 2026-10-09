import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import { SearchIcon, UsersIcon } from "lucide-react";
import FriendCardSkeleton from "../components/skeletons/FriendCardSkeleton";
import useStreamPresence from "../hooks/useStreamPresence";
import FriendCard from "../components/FriendCard";

const FriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const friendIds = friends.map((f) => f._id);
  const { isOnline } = useStreamPresence(friendIds);

  const query = searchQuery.toLowerCase().trim();

  const filteredFriends = query
    ? friends.filter(
        (f) =>
          f.fullName.toLowerCase().includes(query) ||
          (f.location && f.location.toLowerCase().includes(query)),
      )
    : friends;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Friends
            </h1>
            <p className="text-base-content/60 mt-1 text-sm">
              {isLoading
                ? "Loading..."
                : `${friends.length} friend${friends.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-xs bg-base-200/60">
            <SearchIcon className="size-4 text-base-content/50" />
            <input
              id="friends-search"
              type="search"
              placeholder="Search by name or location"
              aria-label="Search friends"
              className="grow min-w-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>

        {/* Friends List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <FriendCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="panel p-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-14 rounded-full bg-base-content/5 flex items-center justify-center">
                <UsersIcon className="size-7 text-base-content/40" />
              </div>
              <h3 className="font-semibold text-lg">
                {query ? `No friends match "${searchQuery}"` : "No friends yet"}
              </h3>
              <p className="text-base-content/60 text-sm max-w-md">
                {query
                  ? "Try a different search term."
                  : "Head to the Home page to discover and connect with new people!"}
              </p>
              {!query && (
                <Link to="/" className="btn btn-primary btn-sm mt-2">
                  Find Friends
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFriends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} isOnline={isOnline(friend._id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
