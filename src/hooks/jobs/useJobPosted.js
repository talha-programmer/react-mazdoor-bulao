import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useJobPosted(jobId) {
  async function getJob() {
    let job = null;
    try {
      await axios
        .post(api.postedJobs + `/${jobId}`)
        .then((result) => (job = result.data.job));
      return job;
    } catch (error) {
      return null;
    }
  }

  return useQuery([queryKeys.postedJobs, jobId], getJob);
}

export default useJobPosted;
