function api() {
  const home = "http://127.0.0.1:8000/api";
  return {
    home: home,
    login: home + "/login",
    register: home + "/register",
    logout: home + "/logout",
    user: home + "/user",
    storeUserProfile: home + "/user/store_user_profile",
    bids: home + "/user/bids",
    appliedJobs: home + "/user/applied_jobs",
    postedJobs: home + "/user/posted_jobs",
    markJobAsCompleted: home + "/jobs/mark_as_completed",
    updateJobStatus: home + "/jobs/update_job_status",
    storeWorkerProfile: home + "/user/store_worker_profile",
    workerProfile: home + "/user/worker_profile",
    jobs: home + "/jobs",
    cities: home + "/jobs/cities",
    jobCategories: home + "/job_categories",
    storeJob: home + "/store_job",
    storeBid: home + "/store_job_bid",
    order: home + "/order",
    startOrder: home + "/start_order",
    completeBuyingOrder: home + "/complete_buying_order",
    completeSellingOrder: home + "/complete_selling_order",
    buyingOrders: home + "/buying_orders",
    sellingOrders: home + "/selling_orders",
    chatUsers: home + "/chat_users",
    addInChat: home + "/chat/add_in_chat",
    chatWithUser: home + "/chat/chat_with",
    recentChat: home + "/chat/recent_chat",
    sendMessage: home + "/chat/send_message",
    sendReview: home + "/send_review",
    orderReviews: home + "/order_reviews"
  };
}

export default api();
