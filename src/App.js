import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";

import Router from "./Router";

const queryClient = new QueryClient();

function App() {
  axios.defaults.withCredentials = true;

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
