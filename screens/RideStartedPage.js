import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MessageType, SocketClient } from "../services/SocketClient";
import { backend } from "../services/Backend";
import { locationService } from "../services/LocationService";
import MapScreen from "./Maps";

export default function RideStartedPage({ navigation, route }) {
  const rideId = route.params.rideId;
  const user = route.params.user;
  const isPassenger = route.params.isPassenger;
  const [ride, setRide] = useState(null);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user, navigation)
  );
  const [rideEnding, setRideEnding] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);

  useEffect(() => {
    backend.getRide(rideId).then((ride) => {
      setRide(ride);

      setCurrentMarker(ride.toCoordinates);

      socketClient.send({
        type: MessageType.SubscribeToLocationSharing,
        data: { ride },
      });
    });

    socketClient.addEventHandler(
      MessageType.SubscribeToLocationSharing,
      async (data) => {
        const location = await locationService.getUsersCurrentPosition();
        const ride = data.ride;

        socketClient.send({
          type: MessageType.ShareLocation,
          data: { location, username: user.username, ride },
        });
      }
    );

    return () => {
      socketClient.removeEventHandler(MessageType.SubscribeToLocationSharing);
      socketClient.send({
        type: MessageType.ClearSubscriptions,
        data: { ride },
      });
    };
  }, []);

  onRideEnd = async () => {
    Alert.alert(
      "End ride",
      `Are you sure you want to end the ride? ${
        !isPassenger
          ? "Did you arrive at your location?"
          : "Is the passenger at his location?"
      }`,
      [
        {
          text: "Yes",
          onPress: () => {
            backend.endRide(rideId, user.username).then(() => {
              navigation.navigate("MainMenu", { user });
            });
            setRideEnding(true);
            socketClient.send({
              type: MessageType.ClearSubscriptions,
              data: { ride },
            });
          },
        },
        { text: "No" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {rideEnding ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loaderText}>Ride is ending, please wait</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.rideDeployedText}>Ride has started</Text>
          {ride && (
            <View style={[styles.mapContainer]}>
              <MapScreen
                style={styles.mapScreen}
                currentMarker={currentMarker}
                isPassenger={false}
              />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onRideEnd}>
              <Text style={styles.buttonText}>Confirm Ride End</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {}}>
              <Text style={styles.buttonText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  loaderContainer: {
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
  },
  rideDeployedText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  currentUserStatus: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "10%",
    textAlign: "center",
  },
  contentContainer: {
    marginTop: "15%",
  },
  mapContainer: {
    height: "60%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
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
    height: "35%",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
