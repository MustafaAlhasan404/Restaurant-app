// src/Components/Signup.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
} from "react-native";

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isManager, setIsManager] = useState(false); // Toggle state

  // Function to handle the signup action
  const handleSignup = () => {
    // Check if the password length is less than 8 characters
    if (password.length < 8) {
      Alert.alert("Fout", "Wachtwoord moet minimaal 8 tekens zijn.");
      return;
    }

    const signupUrl = "https://nl-app.onrender.com/users"; // Replace with your backend's actual URL

    fetch(signupUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        username: username,
        password: password,
        role: isManager ? "manager" : "employee", // Set role based on toggle
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response status code is 400, it could be a validation error like duplicate username
          if (response.status === 400) {
            return response.json().then((data) => {
              throw new Error(data.message || "Accountregistratie mislukt");
            });
          } else {
            throw new Error("Accountregistratie mislukt");
          }
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the response contains the created user object
        console.log("Accountregistratie gelukt:", data);
        // Navigate to the login page after successful signup
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Fout:", error);
        Alert.alert(
          "Accountregistatie fout",
          "Er was een probleem met de accountregistratie. Controleer alle velden."
        );
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screendescription}>
        Voeg hier een nieuwe medewerker toe. Noteer de gebruikersnaam en het
        wachtwoord ergens.
      </Text>

      <Text style={styles.formlabel}>Voornaam medewerker:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.formlabel}>Gebruikersnaam:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.formlabel}>Wachtwoord:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.formlabel}>Rol:</Text>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Personeel</Text>
        <Switch
          trackColor={{ false: "#e27b00", true: "#e27b00" }} // Adjusted to match the button color
          thumbColor={isManager ? "#fff" : "#fff"} // Thumb color when off is grey, white when on
          ios_backgroundColor="#ddd" // Background color for iOS when the switch is off
          onValueChange={() => setIsManager((previousState) => !previousState)}
          value={isManager}
          style={styles.switch}
        />
        <Text style={styles.toggleLabel}>Manager</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Nieuwe medewerker toevoegen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6", // Background color similar to Home.js
    paddingHorizontal: 20, // Horizontal padding similar to Home.js
    paddingTop: 30,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 14,
    color: "#333",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 14,
    color: "#333", // Text color for the labels
  },
  switch: {
    marginHorizontal: 10, // Space around the switch
  },
  button: {
    backgroundColor: "#e27b00", // Button background color similar to Home.js
    padding: 15,
    width: "100%",
    borderRadius: 5,
    alignItems: "center", // Center text horizontally
    marginTop: 20, // Margin top for button
  },
  screendescription: {
    marginBottom: 40,
  },
  formlabel: { fontWeight: "700", fontSize: 14, marginBottom: 7 },
  buttonText: {
    color: "white", // Button text color
    fontWeight: "600", // Font weight for button text
  },
});

export default Signup;
