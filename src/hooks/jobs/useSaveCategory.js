import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../config/api";
import queryKeys from "../../config/queryKeys";

function useSaveCategory() {
  const queryClient = useQueryClient();
  return useMutation(
    (category) =>
      axios.post(api.saveCategory, category).then((result) => result.data),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(queryKeys.jobCategories);
      }
    }
  );
}

export default useSaveCategory;
