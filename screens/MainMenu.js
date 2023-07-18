import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { backend } from "../services/Backend";
import { SocketClient, MessageType } from "../services/SocketClient";
import { convertAlgoToReadable } from "../services/Utils";

export default function MainMenu({ navigation, route }) {
  const [user, setUser] = useState(route.params.user);
  const [socketClient, setSocketClient] = useState(
    SocketClient.getInstance(user, navigation)
  );
  const [addingWallet, setAddingWallet] = useState(false);
  const [mnemonic, setMnemonic] = useState("");

  const handleAddWallet = () => {
    setAddingWallet(true);
  };

  const handleLogout = () => {
    socketClient.close();
    navigation.navigate("Registration");
  };

  const handleRoleSelection = async (isPassenger) => {
    if (isPassenger) {
      navigation.navigate("PassengerPage", {
        user,
      });
    } else {
      navigation.navigate("DriverPage", { user });
    }
  };

  const handleConfirmMnemonic = async () => {
    if (!mnemonic) {
      alert("Please enter your Mnemonic");
      return;
    }
    const userResponse = await backend.addWallet(user.username, mnemonic);
    setAddingWallet(false);
    setUser(userResponse);
  };

  useEffect(() => {
    socketClient.addEventHandler(MessageType.RideEnded, async (data) => {
      const algoPrice = convertAlgoToReadable(
        data.ride.passenger.username === user.username
          ? data.ride.paymentInfo.passengerNet
          : data.ride.paymentInfo.driverNet
      );

      const secondText =
        algoPrice > 0
          ? `You earned ${Math.abs(algoPrice)} ALGO.`
          : `It cost you ${Math.abs(algoPrice)} ALGO.`;
      Alert.alert("Your ride has ended", secondText);

      const gottenUser = await backend.getUser(user.username);
      setUser(gottenUser);
    });

    return () => {
      socketClient.removeEventHandler(MessageType.RideEnded);
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Welcome {user.username}</Text>
      <Text>
        {user.address
          ? "Your address is " +
            user.address.substring(0, 5) +
            "..." +
            user.address.substring(user.address.length - 5)
          : "No address yet"}
      </Text>
      <Text>
        {user.address ? "The balance is " + user.balance + " ALGO " : ""}
      </Text>
      {user.address && (
        <>
          <Text style={styles.label}>Choose your role:</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleRoleSelection(true)}
            >
              <Text style={styles.buttonText}>Passenger</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleRoleSelection(false)}
            >
              <Text style={styles.buttonText}>Driver</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {!user.address && !addingWallet && (
        <TouchableOpacity style={styles.button} onPress={handleAddWallet}>
          <Text style={styles.buttonText}>Add Wallet</Text>
        </TouchableOpacity>
      )}
      {addingWallet && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your Mnemonic here"
            multiline={true}
            numberOfLines={3}
            value={mnemonic}
            returnKeyType="done"
            onChangeText={setMnemonic}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirmMnemonic}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "100%",
  },
  logoutButton: {
    marginTop: "10%",
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#2196F3",
    width: "15%",
    height: "3%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2196F3",
    width: "30%",
    margin: "2%",
    height: 50,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  inputContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#f2f2f2",
    width: 300,
    height: 100,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  label: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
});
