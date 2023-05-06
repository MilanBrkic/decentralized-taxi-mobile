import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MainMenu({ navigation, route }) {
  const { user } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome {user.username}
        {user.address ? " with balance of " + user.balance + " ALGO" : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
