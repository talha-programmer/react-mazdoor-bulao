import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./context/AuthContext";

import Router from "./Router";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
