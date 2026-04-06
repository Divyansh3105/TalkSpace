import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import {
  MessageSquareIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import FriendCardSkeleton from "../components/skeletons/FriendCardSkeleton";

const FriendsPage = () => {
  const { authUser } = useAuthUser();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

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
      <div className="container mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <UsersIcon className="size-7 text-primary" />
              Friends
            </h1>
            <p className="text-base-content/60 mt-1 text-sm">
              {isLoading
                ? "Loading..."
                : `${friends.length} friend${friends.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-50" />
          <input
            id="friends-search"
            type="text"
            placeholder="Search friends by name or location..."
            className="input input-bordered w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Friends List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <FriendCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="card bg-base-200 p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <UsersIcon className="size-12 opacity-30" />
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
              <div
                key={friend._id}
                className="card bg-base-200 hover:shadow-md transition-all duration-200"
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-14 rounded-full">
                      <img
                        src={friend.profilePic}
                        alt={friend.fullName}
                        className="rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">
                        {friend.fullName}
                      </h3>
                      {friend.location && (
                        <p className="text-xs opacity-60 truncate">
                          {friend.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/chat/${friend._id}`}
                    className="btn btn-primary btn-sm w-full gap-2"
                  >
                    <MessageSquareIcon className="size-4" />
                    Send Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
