import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useSaveUserProfile() {
  const queryClient = useQueryClient();
  return useMutation(
    (userProfile) =>
      axios
        .post(api.storeUserProfile, userProfile)
        .then((result) => result.data),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(queryKeys.userProfile);
      }
    }
  );
}

export default useSaveUserProfile;
