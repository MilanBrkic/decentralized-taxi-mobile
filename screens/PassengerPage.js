import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SocketClient } from "../services/SocketClient";
import { backend } from "../services/Backend";

export default function PassengerPage({ navigation, route }) {
  const [ride, setRide] = useState(
    route.params.ride ? route.params.ride : null
  );
  const [requestRideButton, setRequestRideButton] = useState(
    ride ? false : true
  );
  const [user, setUser] = useState(route.params.user);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user.username)
  );
  const [bids, setBids] = useState(ride ? ride.bids : []);
  onRequestRide = async () => {
    const ride = await backend.requestRide(user.username);

    setRide(ride);
    setBids(ride.bids);
    setRequestRideButton(false);
    setSocketListener();
  };

  onCancelRide = async () => {
    await backend.cancelRide(ride._id, user.username);
    delete user.ridesAsPassenger;
    setRide(null);
    setRequestRideButton(true);
    setBids([]);
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
        setBids(requestedRide.bids);
        setRequestRideButton(!requestedRide);
        setSocketListener();
      });
    } else {
      setSocketListener();
    }
  }, []);

  const setSocketListener = () => {
    socketClient.socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "bid") {
        setBids(data.data);
      }
    };
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.rowContainer} onPress={() => {}}>
        <View style={styles.row}>
          <Text style={styles.column}>{item.username}</Text>
          <Text style={styles.column}>{item.amount / 1000000} ALGO</Text>
          <TouchableOpacity style={styles.buttonColumn}>
            <Text>Accept</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {requestRideButton && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onRequestRide}>
            <Text style={styles.buttonText}>Request{"\n"} Ride</Text>
          </TouchableOpacity>
        </View>
      )}
      {!requestRideButton && (
        <>
          <Text style={styles.heading}>Hello passenger {user.username}</Text>
          <Text style={styles.heading2}>
            Here are the bids on your ride request:
          </Text>
          <View style={styles.listContainer}>
            <FlatList
              data={bids || []}
              renderItem={renderItem}
              keyExtractor={(item) => item.username}
              style={styles.list}
            />
          </View>
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
  buttonColumn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
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
