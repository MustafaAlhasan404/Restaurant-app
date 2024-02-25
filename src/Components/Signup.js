// src/Components/Signup.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Switch } from "react-native";

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isManager, setIsManager] = useState(false); // Toggle state

  // Function to handle the signup action
  const handleSignup = () => {
    const signupUrl = 'https://nl-app.onrender.com/users'; // Replace with your backend's actual URL

    fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name: name,
        username: username,
        password: password,
        role: isManager ? 'manager' : 'employee', // Set role based on toggle
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      return response.json();
    })
    .then(data => {
      // Assuming the response contains the created user object
      console.log('Signup successful:', data);
      // Navigate to the login page or directly log the user in
      navigation.navigate('Login');
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert("Signup Error", "There was a problem creating your account.");
    });
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Employee</Text>
        <Switch
          trackColor={{ false: "#ddd", true: "#e27b00" }} // Adjusted to match the button color
          thumbColor={isManager ? "#fff" : "#bbb"} // Thumb color when off is grey, white when on
          ios_backgroundColor="#ddd" // Background color for iOS when the switch is off
          onValueChange={() => setIsManager(previousState => !previousState)}
          value={isManager}
          style={styles.switch}
        />
        <Text style={styles.toggleLabel}>Manager</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0d5d6', // Background color similar to Home.js
    paddingHorizontal: 20, // Horizontal padding similar to Home.js
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white', // Input background color
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the toggle switch container
    marginVertical: 10,
    padding: 10, // Add some padding around the toggle switch
    backgroundColor: '#fff', // Background color for the toggle container
    borderRadius: 20, // Rounded corners for the toggle container
    borderWidth: 1,
    borderColor: '#e27b00', // Border color similar to the button
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333', // Text color for the labels
    marginHorizontal: 10,
  },
  switch: {
    marginHorizontal: 10, // Space around the switch
  },
  button: {
    backgroundColor: '#e27b00', // Button background color similar to Home.js
    padding: 15,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center', // Center text horizontally
    marginTop: 20, // Margin top for button
  },
  buttonText: {
    color: 'white', // Button text color
    fontWeight: '600', // Font weight for button text
  },
});

export default Signup;
