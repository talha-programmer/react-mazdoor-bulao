import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function useAppliedJobs() {
  const { token } = useContext(AuthContext);
  async function getUser() {
    let appliedJobs = null;
    try {
      if (!token) {
        return null;
      }
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
