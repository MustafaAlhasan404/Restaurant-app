// src/Components/Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

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
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.signupPrompt}>
        Don't have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>Sign up</Text>
      </Text>
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
  signupPrompt: {
    marginTop: 20,
    fontSize: 16,
  },
  signupLink: {
    color: '#0000FF',
    fontWeight: 'bold',
  },
  // Add other styles if needed
});

export default Login;
