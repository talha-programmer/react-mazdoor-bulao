import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useMarkAsCompleted() {
  const queryClient = useQueryClient();
  return useMutation(
    (jobId) =>
      axios.post(api.markJobAsCompleted + `/${jobId}`).then((result) => {
        queryClient.invalidateQueries([queryKeys.postedJobs, jobId]);
        return result.data.status;
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch
        //queryClient.invalidateQueries([queryKeys.postedJobs, jobId]);
      }
    }
  );
}

export default useMarkAsCompleted;
