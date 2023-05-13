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
    return { latitude, longitude };
  }

  async getPlaceSuggestions(address) {
    return Geocoder.from(address);
  }
}

export const locationService = new LocationService();
