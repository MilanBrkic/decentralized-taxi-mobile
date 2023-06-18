import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { MessageType, SocketClient } from "../services/SocketClient";
import { backend } from "../services/Backend";
import MapScreen from "./Maps";

export default function RideArrangedPage({ navigation, route }) {
  const rideId = route.params.rideId;
  const user = route.params.user;
  const deployed = route.params.deployed;
  const isPassenger = route.params.isPassenger;
  const [ride, setRide] = useState(null);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user, navigation)
  );
  const [rideDeploying, setRideDeploying] = useState(deployed ? false : true);
  const [text, setText] = useState(
    deployed ? "Ride deployed successfully" : ""
  );
  const [currentMarker, setCurrentMarker] = useState({});

  const deployingText =
    "Ride is being deployed, this should take around 30 seconds...";

  useEffect(() => {
    backend.getRide(rideId).then((ride) => {
      setRide(ride);
      if (!isPassenger) {
        setCurrentMarker({
          latitude: ride.fromCoordinates.latitude,
          longitude: ride.fromCoordinates.longitude,
          title: ride.fromCoordinates.title,
        });
        console.log(currentMarker);
      }
    });

    socketClient.addEventHandler(MessageType.RideDeployed, (data) => {
      if (data.success === true) {
        setText("Ride deployed successfully");
      } else {
        setText("Ride deployment failed");
      }
      setRideDeploying(false);
    });

    socketClient.addEventHandler(MessageType.RideTimeout, (data) => {
      if (rideId === data.ride._id) {
        Alert.alert("Ride timeout", "The ride has timed out.");
        navigation.navigate("MainMenu", { user });
      }
    });

    return () => {
      socketClient.removeEventHandler(MessageType.RideDeployed);
      socketClient.removeEventHandler(MessageType.RideTimeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      {rideDeploying ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loaderText}>{deployingText}</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.rideDeployedText}>{text}</Text>
          <Text style={styles.currentUserStatus}>
            Current user status: {isPassenger ? "Passenger" : "Driver"}
          </Text>
          {ride && (
            <View style={[styles.mapContainer]}>
              <MapScreen
                style={styles.mapScreen}
                isPassenger={false}
                currentMarker={currentMarker}
              />
            </View>
          )}
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
    fontSize: 20,
    fontWeight: "bold",
  },
  currentUserStatus: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "10%",
  },
  mapContainer: {
    height: "70%",
  },
});
