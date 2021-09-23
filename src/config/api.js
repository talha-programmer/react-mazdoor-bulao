function api() {
  const home = "http://127.0.0.1:8000/api";
  return {
    home: home,
    login: home + "/login",
    register: home + "/register",
    logout: home + "/logout",
    jobs: home + "/jobs"
  };
}

export default api();
