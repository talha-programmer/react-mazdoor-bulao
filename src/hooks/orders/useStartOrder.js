import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useStartOrder() {
  const queryClient = useQueryClient();
  return useMutation(
    (order) => axios.post(api.startOrder, order).then((result) => result.data),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(queryKeys.buyingOrders);
      }
    }
  );
}

export default useStartOrder;
