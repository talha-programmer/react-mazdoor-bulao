import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useJobs() {
  // return useQuery(queryKeys.jobs, () =>
  //   axios.post(api.jobs).then((result) => result.data.jobs)
  // );

  const queryClient = useQueryClient();
  return useMutation(
    (filters) =>
      axios.post(api.jobs, filters).then((result) => result.data.jobs),
    {
      // onSuccess: () => {
      //   // Invalidate and refetch
      //   queryClient.invalidateQueries(queryKeys.jobs);
      // }
    }
  );
}

export default useJobs;
