import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useOrder(orderId) {
  async function getJob() {
    let order = null;
    try {
      await axios
        .post(api.order + `/${orderId}`)
        .then((result) => (order = result.data.order));
      return order;
    } catch (error) {
      return null;
    }
  }

  return useQuery([queryKeys.singleOrder, orderId], getJob);
}

export default useOrder;
