import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useSaveWorkerProfile() {
  const queryClient = useQueryClient();
  return useMutation(
    (workerProfile) =>
      axios
        .post(api.storeWorkerProfile, workerProfile)
        .then((result) => result.data),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(queryKeys.workerProfile);
      }
    }
  );
}

export default useSaveWorkerProfile;
