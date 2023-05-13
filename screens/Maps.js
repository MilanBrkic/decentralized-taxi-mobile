import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import { Config } from "../Config";
import Autocomplete from "react-native-autocomplete-input";

Geocoder.init(Config.GOOGLE_MAPS_API_KEY);

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setCoordinates([{ latitude, longitude }]);
      Keyboard.dismiss();
    };
    getLocation();
  }, []);

  const onSuggestionPress = async (suggestion) => {
    setAddress(suggestion.address);
    const lat = suggestion.lat;
    const lng = suggestion.lng;
    setMarker({
      latitude: lat,
      longitude: lng,
      title: suggestion.address,
    });
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    coordinates[1] = { latitude: lat, longitude: lng };
    setCoordinates(coordinates);
    setSuggestions([]);
  };

  const handleTextChange = async (text) => {
    setAddress(text);
    try {
      if (text.length > 3) {
        const result = await Geocoder.from(text);
        console.log(JSON.stringify(result));
        const suggestions = [];
        for (let i = 0; i < 3; i++) {
          if (result.results[i]) {
            suggestions.push({
              address: result.results[i].formatted_address,
              lat: result.results[i].geometry.location.lat,
              lng: result.results[i].geometry.location.lng,
            });
          }
        }

        setSuggestions(suggestions);
      }
    } catch (error) {
      if (error?.origin?.status !== "ZERO_RESULTS") {
        console.log(error);
        throw error;
        // setSuggestions([])
      }
    }
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} region={region} showsUserLocation={true}>
          {marker && (
            <Marker coordinate={marker} title={marker.title} pinColor="red" />
          )}
        </MapView>
      )}
      <View style={styles.inputContainer}>
        <Autocomplete
          style={styles.textInput}
          placeholder="Enter address"
          value={address}
          onChangeText={handleTextChange}
          data={suggestions}
          flatListProps={{
            keyExtractor: (_, idx) => idx,
            renderItem: ({ item }) => (
              <TouchableOpacity onPress={() => onSuggestionPress(item)}>
                <Text>{item.address}</Text>
              </TouchableOpacity>
            ),
          }}
        />
      </View>
      {keyboardVisible && (
        <Text style={styles.hintText}>
          Tap outside the input to dismiss keyboard
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  inputContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: "90%",
    left: "5%",
    right: "5%",
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    width: "95%",
  },

  hintText: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default MapScreen;
