function api() {
  const home = "http://127.0.0.1:8000/api";
  return {
    home: home,
    login: home + "/login",
    register: home + "/register",
    logout: home + "/logout",
    user: home + "/user",
    jobs: home + "/jobs",
    bids: home + "/bids",
    storeJob: home + "/store_job",
    storeBid: home + "/store_job_bid"
  };
}

export default api();
