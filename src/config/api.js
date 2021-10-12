function api() {
  const home = "http://127.0.0.1:8000/api";
  return {
    home: home,
    login: home + "/login",
    register: home + "/register",
    logout: home + "/logout",
    user: home + "/user",
    bids: home + "/user/bids",
    appliedJobs: home + "/user/applied_jobs",
    postedJobs: home + "/user/posted_jobs",
    jobs: home + "/jobs",
    jobCategories: home + "/job_categories",
    storeJob: home + "/store_job",
    storeBid: home + "/store_job_bid"
  };
}

export default api();
