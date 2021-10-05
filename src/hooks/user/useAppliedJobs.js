import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useAppliedJobs() {
  async function getUser() {
    let appliedJobs = null;
    try {
      await axios
        .post(api.appliedJobs)
        .then((result) => (appliedJobs = result.data.applied_jobs));
      return appliedJobs;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return useQuery(queryKeys.appliedJobs, getUser);
}

export default useAppliedJobs;
