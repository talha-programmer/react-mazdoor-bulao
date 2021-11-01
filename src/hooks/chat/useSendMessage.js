import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation(
    (message) =>
      axios.post(api.sendMessage, message).then((result) => {
        const messageReturned = result.data.message;
        queryClient.setQueryData(
          [queryKeys.chatWithUser, messageReturned.to],
          (oldData) => [...oldData, messageReturned]
        );
        return result.data;
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch
        // queryClient.invalidateQueries([
        //   queryKeys.chatWithUser,
        //   globalMessage.to
        // ]);
      }
    }
  );
}

export default useSendMessage;
