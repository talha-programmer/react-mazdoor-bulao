import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useJob(jobId) {
  async function getJob() {
    let job = null;
    try {
      await axios
        .post(api.jobs + `/${jobId}`)
        .then((result) => (job = result.data.job));
      return job;
    } catch (error) {
      return null;
    }
  }

  return useQuery([queryKeys.jobs, jobId], getJob);
}

export default useJob;
