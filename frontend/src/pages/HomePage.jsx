import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import useStreamPresence from "../hooks/useStreamPresence";
import FriendCardSkeleton from "../components/skeletons/FriendCardSkeleton";
import UserCardSkeleton from "../components/skeletons/UserCardSkeleton";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // Derive friend IDs for presence tracking
  const friendIds = friends.map((f) => f._id);
  const { isOnline } = useStreamPresence(friendIds);

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

  // Derive outgoing request IDs directly from data (no useState + useEffect needed)
  const outgoingRequestsIds = new Set(
    (outgoingFriendReqs || []).map((req) => req.recipient._id),
  );

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: async (userId) => {
      // Optimistically update outgoing requests
      await queryClient.cancelQueries({ queryKey: ["outgoingFriendReqs"] });
      const previous = queryClient.getQueryData(["outgoingFriendReqs"]);

      queryClient.setQueryData(["outgoingFriendReqs"], (old = []) => [
        ...old,
        { recipient: { _id: userId } },
      ]);

      return { previous };
    },
    onError: (_err, _userId, context) => {
      queryClient.setQueryData(["outgoingFriendReqs"], context.previous);
      toast.error("Failed to send friend request.");
    },
    onSuccess: () => {
      toast.success("Friend request sent!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

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

  const gridEmpty = (title, hint) => (
    <div className="panel p-8 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-base-content/60 mt-1">{hint}</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* WELCOME HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              {greeting}, <span className="text-primary">{firstName}!</span>
            </h1>
            <p className="text-base-content/60 mt-2 text-sm">
              {loadingFriends ? (
                "Here's what's happening with your network today."
              ) : (
                <>
                  You have <span className="font-semibold text-base-content tabular-nums">{friends.length}</span>{" "}
                  friend{friends.length !== 1 && "s"}
                  {pendingRequestsCount > 0 && (
                    <>
                      {" "}and{" "}
                      <Link to="/notifications" className="link link-primary font-semibold no-underline hover:underline underline-offset-4">
                        {pendingRequestsCount} pending request{pendingRequestsCount !== 1 && "s"}
                      </Link>
                    </>
                  )}
                  .
                </>
              )}
            </p>
          </div>

          <label className="input input-bordered flex items-center gap-2 w-full md:max-w-sm bg-base-200/60">
            <SearchIcon className="size-4 text-base-content/50" />
            <input
              id="home-search"
              type="search"
              placeholder="Search by name or location"
              aria-label="Search people"
              className="grow min-w-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </header>

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Your Friends</h2>
            {friends.length > 0 && (
              <Link to="/friends" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                See all
              </Link>
            )}
          </div>

          {loadingFriends ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <FriendCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredFriends.length === 0 ? (
            query ? (
              gridEmpty(`No friends match "${searchQuery}"`, "Try a different search term.")
            ) : (
              <NoFriendsFound />
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFriends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} isOnline={isOnline(friend._id)} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Meet New Users</h2>
            <p className="text-sm text-base-content/60 mt-1">
              Discover perfect friends based on your profile
            </p>
          </div>

          {loadingUsers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <UserCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredRecommendedUsers.length === 0 ? (
            query
              ? gridEmpty(`No users match "${searchQuery}"`, "Try a different search term.")
              : gridEmpty("No recommendations available", "Check back later for new friends!")
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div key={user._id} className="panel panel-interactive p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.profilePic} name={user.fullName} className="size-14" />
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{user.fullName}</h3>
                        {user.location && (
                          <p className="flex items-center gap-1 text-xs text-base-content/60 mt-0.5 truncate">
                            <MapPinIcon className="size-3 shrink-0" />
                            {user.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {user.bio && (
                      <p className="text-sm text-base-content/70 line-clamp-2">{user.bio}</p>
                    )}

                    <button
                      className={`btn btn-sm w-full mt-auto gap-1.5 ${
                        hasRequestBeenSent
                          ? "btn-ghost text-success !bg-success/10 disabled:!text-success"
                          : "bg-primary/10 text-primary border-transparent hover:bg-primary hover:text-primary-content hover:border-transparent"
                      }`}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4" />
                          Send Friend Request
                        </>
                      )}
                    </button>
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
