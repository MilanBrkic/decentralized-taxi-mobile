import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import { Config } from "../Config";
class LocationService {
  constructor() {
    Geocoder.init(Config.GOOGLE_MAPS_API_KEY);
  }

  async getUsersCurrentPosition(locationAccuracy = Location.Accuracy.Balanced) {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: locationAccuracy,
    });
    const { latitude, longitude } = location.coords;
    const title = await this.getPlaceFromCoordinates({ latitude, longitude });
    return { latitude, longitude, title };
  }

  async getPlaceSuggestions(address) {
    return Geocoder.from(address);
  }

  async getPlaceFromCoordinates(coordinates) {
    try {
      const result = await Geocoder.from(coordinates);
      return result.results[0].formatted_address;
    } catch (error) {
      if (error?.origin?.status !== "ZERO_RESULTS") {
        console.log(error);
        throw error;
      }
    }
  }
}

export const locationService = new LocationService();
