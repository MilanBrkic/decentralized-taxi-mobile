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
      throw error;
    }
  };

  login = async (username, password) => {
    try {
      const response = await this.axios.post(`${this.url}/login`, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.warn("Error on user login", JSON.stringify(error.response.data));
      throw error;
    }
  };

  addWallet = async (username, mnemonic) => {
    try {
      const response = await this.axios.post(`${this.url}/wallet`, {
        username,
        mnemonic,
      });
      return response.data;
    } catch (error) {
      console.warn("Error on wallet creation", JSON.stringify(error));
      throw error;
    }
  };
}
export const backend = new Backend();
