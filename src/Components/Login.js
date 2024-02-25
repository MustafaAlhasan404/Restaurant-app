// src/Components/Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet,TouchableOpacity } from 'react-native';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const loginUrl = 'https://nl-app.onrender.com/users/login';

    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(data => {
      // Assuming the response contains the user object on successful login
      // You might want to store the user data in context or state
      console.log('Login successful:', data.user);
      // Navigate to the main screen or dashboard after login
      navigation.navigate('Main');
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert("Login Error", "Invalid username or password.");
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.signupPrompt}>
        Don't have an account?{' '}
        <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
          Sign up
        </Text>
      </Text>
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
  signupPrompt: {
    marginTop: 20,
    fontSize: 16,
  },
  signupLink: {
    color: '#e27b00',
    fontWeight: 'bold',
  },
});

export default Login;