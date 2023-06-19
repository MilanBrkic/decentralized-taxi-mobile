import { Config } from "../Config";
import axios from "axios";
class Backend {
  url = Config.SERVER_URL;
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
      alert(error.response?.data.message);
      console.warn(
        "Error when registering user",
        JSON.stringify(error.response.data)
      );
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
      alert(error.response?.data.message);
      console.warn("Error on user login", JSON.stringify(error.response.data));
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
      alert(error.response?.data.message);
      console.warn("Error on wallet creation", JSON.stringify(error));
    }
  };

  requestRide = async (username, fromCoordinates, toCoordinates) => {
    try {
      const response = await this.axios.post(`${this.url}/ride`, {
        username,
        from_coordinates: fromCoordinates,
        to_coordinates: toCoordinates,
      });
      return response.data;
    } catch (error) {
      alert(error.response?.data.message);
      console.warn("Error on ride request", JSON.stringify(error));
    }
  };

  getAllRequestedRides = async (username) => {
    try {
      const response = await this.axios.get(
        `${this.url}/ride/get-requested?username=${username}`
      );
      return response.data;
    } catch (error) {
      console.warn("Error on ride request", JSON.stringify(error));
      alert(error.response?.data.message);
    }
  };

  getRide = async (rideId) => {
    try {
      const response = await this.axios.get(`${this.url}/ride/${rideId}`);
      return response.data;
    } catch (error) {
      console.warn("Error on ride request", JSON.stringify(error));
      alert(error.response?.data.message);
    }
  };

  bid = async (rideId, username, amount) => {
    try {
      const response = await this.axios.post(`${this.url}/ride/${rideId}/bid`, {
        username,
        amount,
      });
      return response.data;
    } catch (error) {
      console.warn("Error on bid", JSON.stringify(error));
      alert(error.response?.data.message);
    }
  };

  getUser = async (username) => {
    try {
      const response = await this.axios.get(`${this.url}/user/${username}`);
      return response.data;
    } catch (error) {
      console.warn("Error on get user", JSON.stringify(error));
      alert(error.response?.data.message);
    }
  };

  cancelRide = async (rideId, username) => {
    try {
      const response = await this.axios.post(
        `${this.url}/ride/${rideId}/cancel`,
        {
          username,
        }
      );
      return response.data;
    } catch (error) {
      console.warn("Error on cancel ride", JSON.stringify(error));
      alert(error.response?.data.message);
    }
  };

  acceptRide = async (rideId, driverUsername, price) => {
    try {
      const response = await this.axios.post(
        `${this.url}/ride/${rideId}/accept`,
        {
          driver_username: driverUsername,
          price,
        }
      );
      return response.data;
    } catch (error) {
      console.warn("Error on accept ride", JSON.stringify(error));
      alert(error.response?.data.message);
    }
  };

  startRide = async (rideId, username) => {
    try {
      const response = await this.axios.post(
        `${this.url}/ride/${rideId}/start`,
        {
          username,
        }
      );
      return response.data;
    } catch (error) {
      console.warn("Error on start ride", JSON.stringify(error));
      alert(error.response?.data.message);
    }
  };
}
export const backend = new Backend();
