import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useSendReview() {
  const queryClient = useQueryClient();
  return useMutation(
    (review) =>
      axios.post(api.sendReview, review).then((result) => {
        queryClient.invalidateQueries([queryKeys.singleOrder, review.order_id]);
        queryClient.invalidateQueries([
          queryKeys.orderReviews,
          review.order_id
        ]);

        return result.data;
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch
      }
    }
  );
}

export default useSendReview;
