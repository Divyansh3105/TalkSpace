import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getFriendRequests,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  SearchIcon,
  UserPlusIcon,
} from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import useAuthUser from "../hooks/useAuthUser";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const pendingRequestsCount = friendRequests?.incomingReqs?.length ?? 0;

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    if (outgoingFriendReqs) {
      const outgoingIds = new Set(
        outgoingFriendReqs.map((req) => req.recipient._id),
      );
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = authUser?.fullName?.split(" ")[0] ?? "";

  const query = searchQuery.toLowerCase().trim();

  const filteredFriends = query
    ? friends.filter((f) => f.fullName.toLowerCase().includes(query))
    : friends;

  const filteredRecommendedUsers = query
    ? recommendedUsers.filter(
        (u) =>
          u.fullName.toLowerCase().includes(query) ||
          (u.location && u.location.toLowerCase().includes(query)),
      )
    : recommendedUsers;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* WELCOME HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-base-300">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {greeting}, <span className="text-primary">{firstName}!</span>
            </h1>
            <p className="text-base-content/60 mt-1 text-sm">
              Here's what's happening with your network today.
            </p>
          </div>

          {/* QUICK STATS */}
          <div className="flex gap-3">
            <div className="stat bg-base-200 rounded-box p-3 min-w-24">
              <div className="stat-title text-xs">Friends</div>
              <div className="stat-value text-2xl text-primary">
                {loadingFriends ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  friends.length
                )}
              </div>
            </div>

            <Link
              to="/notifications"
              className="stat bg-base-200 rounded-box p-3 min-w-24 cursor-pointer hover:bg-base-300 transition-colors"
            >
              <div className="stat-title text-xs">Requests</div>
              <div className="stat-value text-2xl flex items-center gap-1">
                {pendingRequestsCount}
                {pendingRequestsCount > 0 && (
                  <span className="badge badge-error badge-sm align-middle">
                    new
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-50" />
          <input
            id="home-search"
            type="text"
            placeholder="Search by name or location..."
            className="input input-bordered w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : filteredFriends.length === 0 ? (
          query ? (
            <div className="card bg-base-200 p-6 text-center">
              <p className="text-base-content opacity-70">
                No friends match "{searchQuery}"
              </p>
            </div>
          ) : (
            <NoFriendsFound />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFriends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Users
                </h2>
                <p className="opacity-70">
                  Discover perfect friends based on your profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : filteredRecommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                {query
                  ? `No users match "${searchQuery}"`
                  : "No recommendations available"}
              </h3>
              <p className="text-base-content opacity-70">
                {query
                  ? "Try a different search term."
                  : "Check back later for new friends!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
