import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useCompleteSellingOrder() {
  const queryClient = useQueryClient();
  return useMutation(
    (order) =>
      axios.post(api.completeSellingOrder, order).then((result) => {
        queryClient.invalidateQueries([queryKeys.singleOrder, order.order_id]);
        return result.data;
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch
      }
    }
  );
}

export default useCompleteSellingOrder;
