import { backend } from "../services/Backend";
import { SocketClient } from "../services/SocketClient";
import { useState, useEffect } from "react";
import { Text, Alert, StyleSheet } from "react-native";
export default function DriveDetailsPage({ navigation, route }) {
  const [user, setUser] = useState(route.params.user);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user.username)
  );
  const [rides, setRides] = useState(route.params.ride);

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

  return <Text>Cao</Text>;
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
