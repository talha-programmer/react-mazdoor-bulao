import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useOrderReviews(orderId, reviewType = null) {
  async function getOrderReviews() {
    let reviews = null;
    try {
      const data = {
        order_id: orderId
      };
      if (reviewType) {
        data["review_type"] = reviewType;
      }
      await axios
        .post(api.orderReviews, data)
        .then((result) => (reviews = result.data.order_reviews));
      return reviews;
    } catch (error) {
      return null;
    }
  }

  return useQuery([queryKeys.orderReviews, orderId], getOrderReviews);
}

export default useOrderReviews;
