import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Autocomplete from "react-native-autocomplete-input";
import { locationService } from "../services/LocationService";

const MapScreen = ({
  onMarkerChange,
  isPassenger,
  currentMarker,
  destinationMarker,
}) => {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const mapRef = useRef();

  const getLocation = async () => {
    const { latitude, longitude, title } =
      await locationService.getUsersCurrentPosition();

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setUserCoordinates({ latitude, longitude, title });
    setMarker(null);
    Keyboard.dismiss();
  };

  const fitToCoordinates = (ref) => {
    if (ref.current && (currentMarker || destinationMarker)) {
      const coords = [userCoordinates];

      if (currentMarker) {
        coords.push(currentMarker);
      }

      if (destinationMarker) {
        coords.push(destinationMarker);
      }
      ref.current.fitToCoordinates(coords, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (marker) {
      onMarkerChange(marker);
    }
  }, [marker]);

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

    setSuggestions([]);
  };

  const handleTextChange = async (text) => {
    setAddress(text);
    try {
      if (text.length > 5) {
        const result = await locationService.getPlaceSuggestions(text);
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
      }
    }
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          onMapReady={() => fitToCoordinates(mapRef)}
        >
          {marker && (
            <Marker coordinate={marker} title={marker.title} pinColor="red" />
          )}
          {!isPassenger && currentMarker && (
            <Marker
              coordinate={currentMarker}
              title={currentMarker.title}
              description={currentMarker.description}
              pinColor="red"
            />
          )}

          {!isPassenger && destinationMarker && (
            <Marker
              coordinate={destinationMarker}
              title={destinationMarker.title}
              description={"Destination location"}
              pinColor="blue"
            />
          )}
        </MapView>
      )}
      {isPassenger && (
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
      )}

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
