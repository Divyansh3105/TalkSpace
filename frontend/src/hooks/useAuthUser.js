import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api.js";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authData"],
    queryFn: getAuthUser,
    retry: 1, // Retry once to handle brief network blips / server restarts
    retryDelay: 1000, // Wait 1 second before retrying
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthUser;
