import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { SocketClient } from "../services/SocketClient";

export const BidsComponent = ({ ride, username, isPassenger }) => {
  const [bids, setBids] = useState(ride ? ride.bids : []);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(username)
  );
  useEffect(() => {
    setSocketListener();
  }, []);

  const setSocketListener = () => {
    socketClient.socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "bid" && ride && ride._id === data.data.rideId) {
        setBids(data.data.bids);
      }
    };
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.rowContainer}>
        <View style={styles.row}>
          <Text style={styles.column}>{item.username}</Text>
          <Text style={styles.column}>{item.amount / 1000000} ALGO</Text>
          {isPassenger ? (
            <TouchableOpacity style={styles.buttonColumn}>
              <Text>Accept</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={bids || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.username}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});
