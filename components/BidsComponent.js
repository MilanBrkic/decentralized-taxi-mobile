import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { backend } from "../services/Backend";
import { MessageType, SocketClient } from "../services/SocketClient";
import { convertAlgoToReadable } from "../services/Utils";

export const BidsComponent = ({ navigation, ride, user, isPassenger }) => {
  const [bids, setBids] = useState(ride ? ride.bids : []);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user, navigation)
  );

  onAcceptPress = (bid) => {
    Alert.alert(
      "Accept Bid",
      `Are you sure you want to accept bid from ${
        bid.username
      } with amount ${convertAlgoToReadable(bid.amount)} ?`,
      [
        {
          text: "Yes",
          onPress: async () => {
            await backend.acceptRide(ride._id, bid.username, bid.amount);
            navigation.navigate("RideArrangedPage", {
              user,
              rideId: ride._id,
              deployed: false,
              isPassenger,
            });
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  useEffect(() => {
    backend.getRide(ride._id).then((ride) => {
      setBids(ride.bids);
    });

    socketClient.addEventHandler(MessageType.Bid, (data) => {
      if (ride && ride._id === data.rideId) {
        setBids(data.bids);
      }
    });

    return () => {
      socketClient.removeEventHandler(MessageType.Bid);
    };
  }, []);

  useEffect(() => {
    setBids(ride ? ride.bids : []);
  }, [ride]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.rowContainer}>
        <View style={styles.row}>
          <Text style={styles.column}>{item.username}</Text>
          <Text style={styles.column}>
            {convertAlgoToReadable(item.amount)}
          </Text>
          {isPassenger ? (
            <TouchableOpacity
              style={styles.buttonColumn}
              onPress={() => onAcceptPress(item)}
            >
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
