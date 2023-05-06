import { Config } from "../Config";
import axios from "axios";
class Backend {
  url = Config.BACKEND_URL;
  axios = axios;

  registerUser = async (username, password, phone) => {
    try {
      const response = await this.axios.post(`${this.url}/register`, {
        username,
        password,
        phone_number: phone,
      });
      return response.data;
    } catch (error) {
      console.warn(
        "Error when registering user",
        JSON.stringify(error.response.data)
      );
    }
  };

  login = async (username, password, phone) => {
    try {
      const response = await this.axios.post(`${this.url}/login`, {
        username,
        password,
        phone_number: phone,
      });
      return response.data;
    } catch (error) {
      console.warn(
        "Error when registering user",
        JSON.stringify(error.response.data)
      );
    }
  };
}
export const backend = new Backend();
