import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { backend } from "../services/Backend";
import { SocketClient } from "../services/SocketClient";
import moment from "moment";

export default function DriverPage({ navigation, route }) {
  const [user, setUser] = useState(route.params.user);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user.username)
  );
  const [rides, setRides] = useState([]);

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
      .catch((err) => {});
  };

  useEffect(() => {
    backend.getAllRequestedRides(user.username).then((rides) => {
      setRides(rides);
    });

    socketClient.socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "ride_requested") {
        setRides((rides) => [data.data, ...rides]);
      } else if (data.type === "ride_canceled") {
        setRides((rides) => rides.filter((ride) => ride._id !== data.data._id));
      }
    };
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.rowContainer} onPress={() => {}}>
        <View style={styles.row}>
          <Text style={styles.column}>{item.passenger.username}</Text>
          <Text style={styles.column}>{moment(item.createdAt).fromNow()}</Text>
          <TouchableOpacity style={styles.button}>
            <Text
              onPress={() =>
                Alert.prompt(
                  "Bid:",
                  "Enter your bid in ALGO",
                  (msg) => bid(item._id, msg),
                  undefined,
                  undefined,
                  "numeric"
                )
              }
            >
              Bid
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Drives Available</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={rides}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.list}
        />
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
