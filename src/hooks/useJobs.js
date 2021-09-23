import axios from "axios";
import { useQuery } from "react-query";
import api from "../config/api";

function useJobs() {
  return useQuery("jobs", () =>
    axios.post(api.jobs).then((result) => result.data)
  );
}

export default useJobs;
