// These are the keys used for react query. All keys
// are written here so that they don't need to remember
function queryKeys() {
  return {
    jobs: "jobs",
    jobCategories: "jobCategories",
    user: "user",
    workerProfile: "workerProfile",
    workerSkills: "workerSkills",
    appliedJobs: "appliedJobs",
    postedJobs: "postedJobs",
    bids: "bids",
    buyingOrders: "buyingOrders",
    sellingOrders: "sellingOrders",
    chatUsers: "chatUsers",
    chatWithUser: "chatWithUser",
    orderReviews: "orderReviews"
  };
}

export default queryKeys();
