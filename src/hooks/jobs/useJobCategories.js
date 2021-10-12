import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useJobCategories() {
  async function getJobCategories() {
    let jobCategories = null;
    try {
      await axios
        .post(api.jobCategories)
        .then((result) => (jobCategories = result.data.job_categories));
      return jobCategories;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return useQuery(queryKeys.jobCategories, getJobCategories);
}

export default useJobCategories;
