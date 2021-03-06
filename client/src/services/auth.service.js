import axios from "axios";

const API_URL = "https://testpam123.herokuapp.com";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "/api/auth/signin", {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, first, last, email, password) {
    return axios.post(API_URL + "/api/auth/signup", {
      username, 
      first, 
      last, 
      email, 
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();