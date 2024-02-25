// src/Components/Login.js
import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import UserContext from "../UserContext";

const Login = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  // Function to handle the login action
  const handleLogin = () => {
    // Assuming there's a /login endpoint for authentication
    const loginUrl = 'https://nl-app.onrender.com/users';

    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: inputUsername,
        password: inputPassword,
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
      if (data.user) {
        setUser(data.user);
        navigation.navigate('Main');
      } else {
        Alert.alert("Login Failed", "Invalid username or password.");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert("Login Error", "An error occurred during login.");
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={inputUsername}
        onChangeText={setInputUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={inputPassword}
        onChangeText={setInputPassword}
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
});

export default Login;
