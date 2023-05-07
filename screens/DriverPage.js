import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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

  useEffect(() => {
    backend.getAllRequestedRides(user.username).then((rides) => {
      setRides(rides);
    });
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.rowContainer} onPress={() => {}}>
        <View style={styles.row}>
          <Text style={styles.column}>{item.passenger.username}</Text>
          <Text style={styles.column}>{moment(item.createdAt).fromNow()}</Text>
          <TouchableOpacity style={styles.button}>
            <Text>Show More</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Placeholder Page</Text>
      <FlatList
        data={rides}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={styles.list}
      />
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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
