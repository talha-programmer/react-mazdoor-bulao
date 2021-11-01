import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useWorkerProfile() {
  async function getWorkerProfile() {
    let workerProfile = null;
    try {
      await axios
        .post(api.workerProfile)
        .then((result) => (workerProfile = result.data.worker_profile));
      return workerProfile;
    } catch (error) {
      return null;
    }
  }

  return useQuery(queryKeys.workerProfile, getWorkerProfile);
}

export default useWorkerProfile;
