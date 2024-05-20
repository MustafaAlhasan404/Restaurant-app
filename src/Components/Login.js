// src/Components/Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useUser } from "../contexts/UserContext"; // Import useUser hook

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser(); // Use the useUser hook to access setUser

  const handleLogin = () => {
    setLoading(true);
    const loginUrl = "http://208.109.231.135/users/login";

    fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
          setLoading(false);
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the response contains the user object on successful login
        console.log("Login successful:", data.user);
        setLoading(false);
        setUser(data.user); // Set the user globally using the context
        navigation.navigate("Main"); // Navigate to the main screen or dashboard after login
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Login Error", "Ongeldige gebruikersnaam/wachtwoord.");
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logocontainer}>
        <Image
          style={{ width: 70, height: 70 }}
          source={require("../../assets/AceLogo.png")}
        />
        <Text style={[styles.logo, { color: "#311213", marginLeft: 20 }]}>
          Ace Lounge
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Gebruikersnaam"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Wachtwoord"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
      />
      <TouchableOpacity
        disabled={loading}
        // style={styles.button}
        style={[styles.button, loading && styles.buttonLoading]}
        onPress={handleLogin}
      >
        {!loading && <Text style={styles.buttonText}>Inloggen</Text>}
        {/* {loading && <Text style={styles.buttonText}>Logging in</Text>} */}
        {loading && <ActivityIndicator size="small" color="#000000" />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6",
    paddingHorizontal: 20,
    paddingTop: 100,
    //justifyContent: "center",
    //alignItems: "center",
  },
  logocontainer: {
    flexDirection: "row",
    marginBottom: 100,
  },
  logo: {
    fontSize: 35,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#e27b00",
    padding: 15,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonLoading: {
    backgroundColor: "#e27b00",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  signupPrompt: {
    marginTop: 20,
    fontSize: 16,
  },
  signupLink: {
    color: "#e27b00",
    fontWeight: "bold",
  },
});

export default Login;
