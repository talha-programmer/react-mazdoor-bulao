import axios from "axios";
import { useQuery } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useCities() {
  async function getCities() {
    let cities = null;
    try {
      await axios
        .post(api.cities)
        .then((result) => (cities = result.data.cities));
      return cities;
    } catch (error) {
      return null;
    }
  }

  return useQuery(queryKeys.cities, getCities);
}

export default useCities;
