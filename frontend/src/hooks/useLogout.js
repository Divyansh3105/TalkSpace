import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
  const quiryClient = useQueryClient();
  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      quiryClient.invalidateQueries(["authUser"]);
    },
  });

  return { logoutMutation };
};

export default useLogout;
