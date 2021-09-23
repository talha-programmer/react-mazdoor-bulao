import axios from "axios";
import { useQuery } from "react-query";
import api from "../config/api";

function useUser() {
  return useQuery("loggedIn", () =>
    axios.post(api.user).then((result) => result.data)
  );
}

export default useUser;
