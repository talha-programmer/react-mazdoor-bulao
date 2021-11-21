import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useRecentChat() {
  async function getChat() {
    let chat = null;
    try {
      await axios
        .post(api.recentChat)
        .then((result) => (chat = result.data.chat));

      return chat;
    } catch (error) {
      return null;
    }
  }

  return useQuery([queryKeys.recentChat], getChat);
}

export default useRecentChat;
