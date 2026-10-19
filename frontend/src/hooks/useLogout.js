import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logout } from "../lib/api";

const useLogout = () => {
  const queryClient = useQueryClient();
  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authData"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Couldn't log out. Please try again."),
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;
