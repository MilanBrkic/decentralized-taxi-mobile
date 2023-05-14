import { backend } from "../services/Backend";
import { SocketClient } from "../services/SocketClient";
import { useState } from "react";
import { Text, Alert, StyleSheet, View } from "react-native";
import { BidsComponent } from "../components/BidsComponent";

export default function DriveDetailsPage({ navigation, route }) {
  const [user, setUser] = useState(route.params.user);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user.username)
  );
  const [ride, setRide] = useState(route.params.ride);

  const bid = (rideId, amount) => {
    if (amount.length === 0) {
      alert("can't be empty");
      return;
    }

    if (isNaN(amount)) {
      alert("must be a number");
      return;
    }

    backend
      .bid(rideId, user.username, amount)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        Alert.prompt(
          "Bid:",
          "Enter your bid in ALGO",
          (msg) => bid(item._id, msg),
          undefined,
          undefined,
          "numeric"
        );
      });
  };

  const onPromptPress = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Requesting ride: {ride.passenger.username}
      </Text>
      <Text style={styles.heading2}>Here are the bids on this ride:</Text>
      <BidsComponent ride={ride} isPassenger={false} username={user.username} />
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
    top: "15%",
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
});
