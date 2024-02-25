// src/Components/Login.js
import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";
import UserContext from "../UserContext";

const Login = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [inputUsername, setInputUsername] = useState('');
  const [inputRole, setInputRole] = useState('');

  // Function to handle the login action
  const handleLogin = () => {
    setUser({ username: inputUsername, role: inputRole });
    // Navigate to the Home screen after setting the user
    navigation.navigate('Main');
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
        placeholder="Role"
        value={inputRole}
        onChangeText={setInputRole}
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
