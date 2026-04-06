import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
} from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  XCircleIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import NotificationSkeleton from "../components/skeletons/NotificationSkeleton";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending: isAccepting } =
    useMutation({
      mutationFn: acceptFriendRequest,
      onMutate: async (requestId) => {
        // Cancel any outgoing refetches so they don't overwrite our optimistic update
        await queryClient.cancelQueries({ queryKey: ["friendRequests"] });

        // Snapshot the previous value
        const previousRequests = queryClient.getQueryData(["friendRequests"]);

        // Optimistically remove from incoming list
        queryClient.setQueryData(["friendRequests"], (old) => {
          if (!old) return old;
          return {
            ...old,
            incomingReqs: old.incomingReqs.filter(
              (req) => req._id !== requestId,
            ),
          };
        });

        return { previousRequests };
      },
      onError: (_error, _requestId, context) => {
        // Roll back on error
        queryClient.setQueryData(
          ["friendRequests"],
          context.previousRequests,
        );
        toast.error("Failed to accept request. Please try again.");
      },
      onSuccess: () => {
        toast.success("Friend request accepted!");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
        queryClient.invalidateQueries({ queryKey: ["friends"] });
      },
    });

  const { mutate: declineRequestMutation, isPending: isDeclining } =
    useMutation({
      mutationFn: declineFriendRequest,
      onMutate: async (requestId) => {
        await queryClient.cancelQueries({ queryKey: ["friendRequests"] });

        const previousRequests = queryClient.getQueryData(["friendRequests"]);

        queryClient.setQueryData(["friendRequests"], (old) => {
          if (!old) return old;
          return {
            ...old,
            incomingReqs: old.incomingReqs.filter(
              (req) => req._id !== requestId,
            ),
          };
        });

        return { previousRequests };
      },
      onError: (_error, _requestId, context) => {
        queryClient.setQueryData(
          ["friendRequests"],
          context.previousRequests,
        );
        toast.error("Failed to decline request. Please try again.");
      },
      onSuccess: () => {
        toast.success("Friend request declined.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      },
    });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card glass-panel hover-lift border-l-4 border-l-primary"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request.sender.fullName}
                              </h3>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                acceptRequestMutation(request._id)
                              }
                              disabled={isAccepting || isDeclining}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-ghost btn-sm text-error"
                              onClick={() =>
                                declineRequestMutation(request._id)
                              }
                              disabled={isAccepting || isDeclining}
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATIONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card glass-panel hover-lift border-l-4 border-l-success"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.recipient.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
