import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
} from "../lib/api";
import { Link } from "react-router";
import { ClockIcon, MessageSquareIcon, XIcon } from "lucide-react";
import Avatar from "../components/Avatar";
import NoNotificationsFound from "../components/NoNotificationsFound";
import NotificationSkeleton from "../components/skeletons/NotificationSkeleton";
import toast from "react-hot-toast";

const Section = ({ title, count, children }) => (
  <section>
    <h2 className="flex items-baseline gap-2 text-sm font-semibold text-base-content/70 mb-3">
      {title}
      {count > 0 && <span className="tabular-nums text-base-content/40">{count}</span>}
    </h2>
    <ul className="panel divide-y divide-base-content/[0.06]">{children}</ul>
  </section>
);

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: outgoingReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });
  const pendingOutgoing = outgoingReqs.filter((r) => r.status === "pending");

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

  const { mutate: cancelRequestMutation, isPending: isCancelling } =
    useMutation({
      mutationFn: cancelFriendRequest,
      onMutate: async (requestId) => {
        await queryClient.cancelQueries({ queryKey: ["outgoingFriendReqs"] });
        const prev = queryClient.getQueryData(["outgoingFriendReqs"]);
        queryClient.setQueryData(["outgoingFriendReqs"], (old = []) =>
          old.filter((r) => r._id !== requestId),
        );
        return { prev };
      },
      onError: (_err, _id, ctx) => {
        queryClient.setQueryData(["outgoingFriendReqs"], ctx.prev);
        toast.error("Failed to cancel request.");
      },
      onSuccess: () => toast.success("Friend request cancelled."),
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
    });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
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
              <Section title="Friend Requests" count={incomingRequests.length}>
                {incomingRequests.map((request) => (
                  <li key={request._id} className="flex flex-wrap items-center gap-3 p-4">
                    <Avatar src={request.sender.profilePic} name={request.sender.fullName} className="size-11" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        <span className="font-semibold">{request.sender.fullName}</span> wants to be friends
                      </p>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => declineRequestMutation(request._id)}
                        disabled={isAccepting || isDeclining}
                      >
                        Decline
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => acceptRequestMutation(request._id)}
                        disabled={isAccepting || isDeclining}
                      >
                        Accept
                      </button>
                    </div>
                  </li>
                ))}
              </Section>
            )}

            {/* ACCEPTED REQS NOTIFICATIONS */}
            {acceptedRequests.length > 0 && (
              <Section title="New Connections">
                {acceptedRequests.map((notification) => (
                  <li key={notification._id} className="flex items-center gap-3 p-4">
                    <Avatar src={notification.recipient.profilePic} name={notification.recipient.fullName} className="size-11" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        <span className="font-semibold">{notification.recipient.fullName}</span> accepted your
                        friend request
                      </p>
                      <p className="text-xs text-base-content/50 mt-0.5 flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        Recently
                      </p>
                    </div>
                    <Link
                      to={`/chat/${notification.recipient._id}`}
                      className="btn btn-sm bg-primary/10 text-primary border-transparent hover:bg-primary hover:text-primary-content hover:border-transparent gap-1.5"
                    >
                      <MessageSquareIcon className="size-4" />
                      Message
                    </Link>
                  </li>
                ))}
              </Section>
            )}

            {/* OUTGOING / SENT REQUESTS */}
            {pendingOutgoing.length > 0 && (
              <Section title="Sent Requests" count={pendingOutgoing.length}>
                {pendingOutgoing.map((req) => (
                  <li key={req._id} className="flex items-center gap-3 p-4">
                    <Avatar src={req.recipient.profilePic} name={req.recipient.fullName} className="size-11" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{req.recipient.fullName}</p>
                      <p className="text-xs text-base-content/50 mt-0.5">Pending</p>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm text-base-content/70 hover:text-error gap-1"
                      onClick={() => cancelRequestMutation(req._id)}
                      disabled={isCancelling}
                    >
                      <XIcon className="size-4" />
                      Cancel
                    </button>
                  </li>
                ))}
              </Section>
            )}

            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 &&
              pendingOutgoing.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
