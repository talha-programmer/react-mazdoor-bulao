import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useSaveBid() {
  const queryClient = useQueryClient();
  return useMutation(
    (bid) => axios.post(api.storeBid, bid).then((result) => result.data),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(queryKeys.bids);
      }
    }
  );
}

export default useSaveBid;
