import axios from "axios";
import { useQuery } from "react-query";
import api from "../config/api";
import queryKeys from "../config/queryKeys";

function useUser() {
  async function getUser() {
    let user = null;
    try {
      await axios.post(api.user).then((result) => (user = result.data.user));
      return user;
    } catch (error) {
      return null;
    }
  }

  return useQuery(queryKeys.user, getUser);
}

export default useUser;
