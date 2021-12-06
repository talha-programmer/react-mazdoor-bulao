import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  return useMutation(
    (job) =>
      axios.post(api.updateJobStatus, { ...job }).then((result) => {
        queryClient.invalidateQueries([queryKeys.postedJobs, job?.job_id]);
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

export default useUpdateJobStatus;
