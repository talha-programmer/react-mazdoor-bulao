import axios from "axios";
import { useQuery } from "react-query";
import api from "../config/api";
import queryKeys from "../config/queryKeys";

function useUser() {
  return useQuery(queryKeys.user, () =>
    axios.post(api.user).then((result) => result.data)
  );
}

export default useUser;
