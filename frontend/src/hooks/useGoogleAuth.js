import { useMutation, useQueryClient } from "@tanstack/react-query";
import { googleLogin } from "../lib/api";

const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: googleLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authData"] });
    },
  });

  return { error, isPending, googleAuthMutation: mutate };
};

export default useGoogleAuth;
