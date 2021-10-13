import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useBuyingOrders() {
  async function getBuyingOrders() {
    let buyingOrders = null;
    try {
      await axios
        .post(api.buyingOrders)
        .then((result) => (buyingOrders = result.data.buying_orders));
      return buyingOrders;
    } catch (error) {
      return null;
    }
  }

  return useQuery(queryKeys.buyingOrders, getBuyingOrders);
}

export default useBuyingOrders;
