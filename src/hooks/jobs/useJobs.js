import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useJobs() {
  return useQuery(queryKeys.jobs, () =>
    axios.post(api.jobs).then((result) => result.data)
  );
}

export default useJobs;
