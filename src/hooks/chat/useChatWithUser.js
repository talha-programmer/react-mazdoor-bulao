import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

// Get messages b/w logged in user and the userId passed
function useChatWithUser(userId) {
  async function getChat() {
    let chat = null;
    try {
      if (userId > 0) {
        await axios
          .post(api.chatWithUser + `/${userId}`)
          .then((result) => (chat = result.data.chat));
      }
      return chat;
    } catch (error) {
      return null;
    }
  }

  return useQuery([queryKeys.chatWithUser, userId], getChat);
}

export default useChatWithUser;
