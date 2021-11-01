import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useAddInChat() {
  const queryClient = useQueryClient();
  return useMutation(
    (userId) =>
      axios
        .post(api.addInChat, { user_id: userId })
        .then((result) => result.data),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(queryKeys.chatUsers);
      }
    }
  );
}

export default useAddInChat;
