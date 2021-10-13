import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useSellingOrders() {
  async function getSellingOrders() {
    let sellingOrders = null;
    try {
      await axios
        .post(api.sellingOrders)
        .then((result) => (sellingOrders = result.data.selling_orders));
      return sellingOrders;
    } catch (error) {
      return null;
    }
  }

  return useQuery(queryKeys.sellingOrders, getSellingOrders);
}

export default useSellingOrders;
