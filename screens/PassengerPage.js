import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SocketClient } from "../services/SocketClient";

export default function PassengerPage({ navigation, route }) {
  const [user, setUser] = useState(route.params.user);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user.username)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Placeholder Page </Text>
      <Text style={styles.text}>This is a placeholder page.</Text>
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
  text: {
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
