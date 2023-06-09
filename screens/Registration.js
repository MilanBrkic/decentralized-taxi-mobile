import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { backend } from "../services/Backend";

export default function Registration({ navigation }) {
  const [showRegisterInputs, setShowRegisterInputs] = useState(false);
  const [showSignInInputs, setShowSignInInputs] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = () => {
    if (!showRegisterInputs || showSignInInputs) {
      setShowRegisterInputs(true);
      setShowSignInInputs(false);
      setUsername("");
      setPassword("");
      setPhone("");
    } else {
      registerUser();
    }
  };

  const registerUser = async () => {
    if (!username || !password || !phone) {
      alert("Please enter all fields");
      return;
    }

    if (username.length < 4) {
      alert("Username must be at least 4 characters long");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const pattern = new RegExp(/^[0-9\b]+$/);
    if (pattern.test(phone)) {
      alert("Phone number is not valid");
      return;
    }

    try {
      const user = await backend.registerUser(username, password, phone);
      navigation.navigate("MainMenu", { user });
    } catch (error) {
      alert("Error when registering user: " + error.response.data.message);
    }
  };

  const handleSignIn = async () => {
    if (showRegisterInputs || !showSignInInputs) {
      setShowSignInInputs(true);
      setShowRegisterInputs(false);
      setUsername("");
      setPassword("");
      setPhone("");
    } else {
      if (!username || !password) {
        alert("Please enter all fields");
        return;
      }

      try {
        const user = await backend.login(username, password);
        const rides = [...user.ridesAsDriver, ...user.ridesAsPassenger];
        const startedRide = rides.find((ride) => ride.status === "started");
        if (startedRide) {
          const isPassenger = startedRide.passenger.username === user.username;

          const hasUserEndedTheRide = isPassenger
            ? startedRide.passengerStats.ended
            : startedRide.driverStats.ended;

          if (!hasUserEndedTheRide) {
            navigation.navigate("RideStartedPage", {
              user,
              rideId: startedRide._id,
              isPassenger,
            });
            return;
          }

          navigation.navigate("MainMenu", { user });
        }

        const deployedRide = rides.find(
          (ride) => ride.status === "deployed" || ride.status === "created"
        );
        if (deployedRide) {
          navigation.navigate("RideArrangedPage", {
            user,
            rideId: deployedRide._id,
            deployed: deployedRide.status === "deployed",
            isPassenger: deployedRide.passenger.username === user.username,
          });
          return;
        }

        const requestedRide = user.ridesAsPassenger.find(
          (ride) => ride.status === "requested"
        );
        if (requestedRide) {
          navigation.navigate("PassengerPage", {
            user,
            ride: requestedRide,
          });
          return;
        }
        navigation.navigate("MainMenu", { user });
      } catch (error) {
        alert("Error when logging in: " + error.response.data.message);
      }
    }
  };

  const handleBack = () => {
    setShowRegisterInputs(false);
    setShowSignInInputs(false);
  };

  return (
    <View style={styles.container}>
      {showRegisterInputs || showSignInInputs ? (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>{"<<<"}</Text>
        </TouchableOpacity>
      ) : null}

      {!showRegisterInputs && !showSignInInputs && (
        <Text>Decentralized Taxi App!</Text>
      )}

      {(showRegisterInputs || showSignInInputs) && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            autoCapitalize="none"
            returnKeyType="done"
            onChangeText={(text) => setUsername(text)}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry={true}
            returnKeyType="done"
            onChangeText={(text) => setPassword(text)}
          />

          {showRegisterInputs && (
            <>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                returnKeyType="done"
                onChangeText={(text) => setPhone(text)}
              />

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}

          {showSignInInputs && (
            <>
              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {!showRegisterInputs && !showSignInInputs && (
        <>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginBottom: "50%",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    width: "70%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    width: 200,
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
  backButton: {
    position: "absolute",
    top: "6%",
    left: "7%",
    width: "18%",
    height: "4%",
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#2196F3",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999, // set a higher value for zIndex
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
