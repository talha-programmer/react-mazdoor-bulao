import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useSaveJob() {
  const queryClient = useQueryClient();
  return useMutation(
    (job) => axios.post(api.storeJob, job).then((result) => result.data),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(queryKeys.jobs);
      }
    }
  );
}

export default useSaveJob;
