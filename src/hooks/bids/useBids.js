import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useBids() {
  async function getBids() {
    let bids = null;
    try {
      await axios.post(api.bids).then((result) => (bids = result.data.bids));
      return bids;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return useQuery(queryKeys.bids, getBids);
}

export default useBids;
