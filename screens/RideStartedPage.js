import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { MessageType, SocketClient } from "../services/SocketClient";
import { backend } from "../services/Backend";
import { locationService } from "../services/LocationService";

export default function RideStartedPage({ navigation, route }) {
  const rideId = route.params.rideId;
  const user = route.params.user;
  const isPassenger = route.params.isPassenger;
  const [ride, setRide] = useState(null);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user, navigation)
  );

  useEffect(() => {
    backend.getRide(rideId).then((ride) => {
      setRide(ride);

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

  return <View style={styles.container}></View>;
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
    height: "30%",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
