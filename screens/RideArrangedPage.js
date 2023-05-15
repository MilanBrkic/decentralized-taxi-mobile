import { useEffect, useState } from "react";
import { Text } from "react-native";
import { MessageType, SocketClient } from "../services/SocketClient";
import { backend } from "../services/Backend";

export default function RideArrangedPage({ navigation, route }) {
  const rideId = route.params.rideId;
  const user = route.params.user;
  const [ride, setRide] = useState(null);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user, navigation)
  );

  useEffect(() => {
    backend.getRide(rideId).then((ride) => {
      setRide(ride);
    });

    socketClient.addEventHandler(MessageType.RideDeployed, (data) => {
      if (data.success === true) {
        console.log("Ride deployed successfully");
      } else {
        console.log("Ride deployment failed");
      }
    });

    return () => {
      socketClient.removeEventHandler(MessageType.RideDeployed);
    };
  }, []);

  return <Text>da</Text>;
}
