import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

// Get jobs posted by the current logged in user
function usePostedJobs() {
  async function getPostedJobs() {
    let appliedJobs = null;
    try {
      await axios
        .post(api.postedJobs)
        .then((result) => (appliedJobs = result.data.posted_jobs));
      return appliedJobs;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return useQuery(queryKeys.postedJobs, getPostedJobs);
}

export default usePostedJobs;
