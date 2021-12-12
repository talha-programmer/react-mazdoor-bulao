import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useUserProfile() {
  async function getUserProfile() {
    let userProfile = null;
    try {
      await axios
        .post(api.userProfile)
        .then((result) => (userProfile = result.data.user_profile));
      return userProfile;
    } catch (error) {
      return null;
    }
  }

  return useQuery(queryKeys.userProfile, getUserProfile);
}

export default useUserProfile;
