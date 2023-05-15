import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SocketClient } from "../services/SocketClient";
import { backend } from "../services/Backend";
import MapScreen from "./Maps";
import { locationService } from "../services/LocationService";
import { BidsComponent } from "../components/BidsComponent";

export default function PassengerPage({ navigation, route }) {
  const [ride, setRide] = useState(
    route.params.ride ? route.params.ride : null
  );
  const [requestRideButton, setRequestRideButton] = useState(
    ride ? false : true
  );
  const [user, setUser] = useState(route.params.user);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user, navigation)
  );
  const [marker, setMarker] = useState(null);

  onMarkerChange = (marker) => {
    setMarker(marker);
  };

  onRequestRidePress = async () => {
    if (!marker) {
      Alert.alert("Request Ride", "Please select a destination");
    } else {
      Alert.alert(
        "Request Ride",
        `Are you sure you want to request a ride to ${marker.title} ?`,
        [
          {
            text: "Yes",
            onPress: async () => {
              requestRide();
            },
          },
          {
            text: "No",
          },
        ]
      );
    }
  };

  requestRide = async () => {
    if (!marker && !marker.latitude && !marker.longitude) {
      return;
    }

    const fromCoordinates = await locationService.getUsersCurrentPosition();

    const ride = await backend.requestRide(user.username, fromCoordinates, {
      latitude: marker.latitude,
      longitude: marker.longitude,
      title: marker.title,
    });

    setRide(ride);
    setRequestRideButton(false);
  };

  onCancelRide = async () => {
    await backend.cancelRide(ride._id, user.username);
    delete user.ridesAsPassenger;
    setRide(null);
    setRequestRideButton(true);
    navigation.navigate("MainMenu", { user });
  };

  useEffect(() => {
    if (!ride) {
      backend.getUser(user.username).then((user) => {
        setUser(user);
        const requestedRide = user.ridesAsPassenger.find(
          (ride) => ride.status === "requested"
        );
        if (!requestedRide) return;
        setRide(requestedRide);
        setRequestRideButton(!requestedRide);
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      {requestRideButton && (
        <>
          <View style={{ flex: 1, width: "100%" }}>
            <View style={{ marginTop: "10%", flex: 0.75 }}>
              <MapScreen onMarkerChange={onMarkerChange} isPassenger={true} />
            </View>
            <View
              style={{
                ...styles.buttonContainer,
                flex: 0.25,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={onRequestRidePress}
              >
                <Text style={styles.buttonText}>Request Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      {!requestRideButton && (
        <>
          <Text style={styles.heading}>Hello passenger {user.username}</Text>
          <Text style={styles.heading2}>
            Here are the bids on your ride request:
          </Text>
          <BidsComponent
            ride={ride}
            isPassenger={true}
            navigation={navigation}
            user={user}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancelRide}>
              <Text style={styles.buttonText}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    position: "absolute",
    top: "10%",
    fontSize: 20,
    fontWeight: "bold",
    zIndex: 1,
  },
  heading2: {
    position: "absolute",
    top: "15%",
    fontSize: 18,
    fontWeight: "bold",
    zIndex: 1,
  },
  requestRideContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2196F3",
    width: "30%",
    margin: "2%",
    height: "30%",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
