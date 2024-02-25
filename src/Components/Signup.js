// src/Components/Signup.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Switch } from "react-native";

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
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isManager ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={() => setIsManager(previousState => !previousState)}
          value={isManager}
        />
        <Text style={styles.toggleLabel}>Manager</Text>
      </View>
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  toggleLabel: {
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default Signup;
