import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";

export default function App() {
  const [showRegisterInputs, setShowRegisterInputs] = useState(false);
  const [showSignInInputs, setShowSignInInputs] = useState(false);

  const handleRegister = () => {
    setShowRegisterInputs(true);
    setShowSignInInputs(false);
  };

  const handleSignIn = () => {
    setShowSignInInputs(true);
    setShowRegisterInputs(false);
  };

  const handleBack = () => {
    setShowRegisterInputs(false);
    setShowSignInInputs(false);
  };

  return (
    <View style={styles.container}>
      {showRegisterInputs || showSignInInputs ? (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
      ) : null}

      {!showRegisterInputs && !showSignInInputs && (
        <Text>Decentralized Taxi App!</Text>
      )}

      {showRegisterInputs && (
        <>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} placeholder="Enter username" />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry={true}
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      )}

      {showSignInInputs && (
        <>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} placeholder="Enter username" />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </>
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
    width: "80%",
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
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
