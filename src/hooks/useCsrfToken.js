import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

export default function useCsrfToken() {
  return useQuery("csrf", () =>
    axios
      .get("http://localhost:8000/sanctum/csrf-cookie")
      .then((res) => res.data)
  );
}
