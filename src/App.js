import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";

import Router from "./Router";
import Echo from "laravel-echo";
import pusherJs from "pusher-js";

const queryClient = new QueryClient();

function App() {
  axios.defaults.withCredentials = true;

  window.Pusher = pusherJs;

  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "2222",
    wsHost: "localhost",
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    //authEndPoint: "http://localhost:8000/broadcasting/auth"
    authorizer: (channel, options) => {
      return {
        authorize: (socketId, callback) => {
          axios
            .post("http://localhost:8000/broadcasting/auth", {
              socket_id: socketId,
              channel_name: channel.name
            })
            .then((response) => {
              callback(false, response.data);
            })
            .catch((error) => {
              callback(true, error);
            });
        }
      };
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
