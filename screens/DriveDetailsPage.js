import { backend } from "../services/Backend";
import { SocketClient, MessageType } from "../services/SocketClient";
import { useEffect, useState } from "react";
import { Text, Alert, StyleSheet, View, TouchableOpacity } from "react-native";
import { BidsComponent } from "../components/BidsComponent";
import MapScreen from "./Maps";

export default function DriveDetailsPage({ navigation, route }) {
  const [user, setUser] = useState(route.params.user);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user, navigation)
  );
  const [ride, setRide] = useState(route.params.ride);

  useEffect(() => {
    socketClient.addEventHandler(MessageType.RideCanceled, (data) => {
      if (ride && ride._id === data._id) {
        navigation.navigate("MainMenu", { user });
      }
    });

    return () => {
      socketClient.removeEventHandler(MessageType.RideCanceled);
    };
  }, []);

  const bid = (rideId, amount) => {
    if (amount.length === 0) {
      alert("can't be empty");
      return;
    }

    if (isNaN(amount)) {
      alert("must be a number");
      return;
    }

    backend.bid(rideId, user.username, amount).catch((err) => {
      Alert.prompt(
        "Bid:",
        "Enter your bid in ALGO",
        (msg) => bid(ride._id, msg),
        undefined,
        undefined,
        "numeric"
      );
    });
  };

  const onBidPress = () => {
    Alert.prompt(
      "Bid:",
      "Enter your bid in ALGO",
      (msg) => bid(ride._id, msg),
      undefined,
      undefined,
      "numeric"
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Requesting ride: {ride.passenger.username}
      </Text>
      <Text style={styles.heading2}>Here are the bids on this ride:</Text>
      <BidsComponent ride={ride} isPassenger={false} user={user} />
      <View style={{ flex: 1, width: "80%", marginTop: 0 }}>
        <MapScreen
          isPassenger={false}
          currentMarker={{
            latitude: ride.fromCoordinates.latitude,
            longitude: ride.fromCoordinates.longitude,
            title: ride.fromCoordinates.title,
            description: "Passenger location",
          }}
          destinationMarker={{
            latitude: ride.toCoordinates.latitude,
            longitude: ride.toCoordinates.longitude,
            title: ride.toCoordinates.title,
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onBidPress}>
          <Text style={styles.buttonText}>Bid</Text>
        </TouchableOpacity>
      </View>
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
    top: "5%",
    fontSize: 24,
    fontWeight: "bold",
    zIndex: 1,
  },
  listContainer: {
    flex: 1,
    alignSelf: "stretch",
    marginHorizontal: 10, // adjust as needed
    marginTop: "40%",
  },
  list: {
    flex: 1,
    alignSelf: "stretch",
  },
  rowContainer: {
    alignSelf: "stretch",
  },
  heading2: {
    position: "absolute",
    top: "10%",
    fontSize: 18,
    fontWeight: "bold",
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  column: {
    flex: 1,
  },
  button: {
    backgroundColor: "#2196F3",
    width: 200,
    height: 50,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
});
