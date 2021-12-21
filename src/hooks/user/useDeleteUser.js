import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation(
    (user) => axios.post(api.deleteUser, user).then((result) => result.data),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(queryKeys.users);
      }
    }
  );
}

export default useDeleteUser;
