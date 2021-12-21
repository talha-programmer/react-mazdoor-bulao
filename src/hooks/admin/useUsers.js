import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useUsers() {
  async function getUsers() {
    let users = null;
    try {
      await axios
        .post(api.admin.users)
        .then((result) => (users = result.data.users));
      return users;
    } catch (error) {
      return null;
    }
  }

  return useQuery(queryKeys.users, getUsers);
}

export default useUsers;
