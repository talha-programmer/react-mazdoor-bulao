import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

// Get the allowed chats of currently logged-in user
function useChatUsers() {
  async function getChatUsers() {
    let chatUsers = null;
    try {
      await axios
        .post(api.chatUsers)
        .then((result) => (chatUsers = result.data.chat_users));
      return chatUsers;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return useQuery(queryKeys.chatUsers, getChatUsers);
}

export default useChatUsers;
