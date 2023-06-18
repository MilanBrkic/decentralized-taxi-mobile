import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { MessageType, SocketClient } from "../services/SocketClient";
import { backend } from "../services/Backend";
import MapScreen from "./Maps";
import { locationService } from "../services/LocationService";

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
  const [currentMarker, setCurrentMarker] = useState(null);

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
          description: "Passenger location",
        });
      } else {
        socketClient.send({
          type: MessageType.SubscribeToDriverLocation,
          data: { ride },
        });
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

    socketClient.addEventHandler(
      MessageType.ReturnDriverLocation,
      async (data) => {
        console.log(
          `Received socket event: ${MessageType.ReturnDriverLocation}`
        );
        if (isPassenger) {
          const location = data.location;

          setCurrentMarker({
            latitude: location.latitude,
            longitude: location.longitude,
            title: location.title,
            description: "Driver location",
          });
        } else {
          const location = await locationService.getUsersCurrentPosition();
          const ride = data.ride;

          socketClient.send({
            type: MessageType.ReturnDriverLocation,
            data: { location, ride },
          });
        }
      }
    );

    return () => {
      socketClient.removeEventHandler(MessageType.RideDeployed);
      socketClient.removeEventHandler(MessageType.RideTimeout);
      socketClient.removeEventHandler(MessageType.GetLocation);
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
