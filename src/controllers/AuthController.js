import Cookies from "js-cookie";

export default class AuthController {
  static saveLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  }

  static deleteLoggedInUser() {
    localStorage.removeItem("loggedInUser");
  }

  static loggedInUser() {
    if (Cookies.get("loginToken")) {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user) {
        return user;
      }
    } else {
      // Remove the loggedin user details if cookie expired
      localStorage.removeItem("loggedInUser");
    }
    return false;
  }
}
