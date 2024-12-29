// src/Components/Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { BASE_URL } from '../../config';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleLogin = () => {
    setLoading(true);
    const loginUrl =`${BASE_URL}/users/login`;

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
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login successful:", data.user);
        setLoading(false);
        setUser(data.user);
        navigation.navigate("Main");
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Login Error", "Ongeldige gebruikersnaam/wachtwoord.");
        setLoading(false);
      });
  };

  return (
    <View className="flex-1 bg-[#e0d5d6] px-5 pt-24">
      <View className="flex-row mb-24">
        <Image
          className="w-[70px] h-[70px]"
          source={require("../../assets/AceLogo.png")}
        />
        <Text className="text-[35px] font-bold text-[#311213] ml-5">
          Ace Lounge
        </Text>
      </View>

      <TextInput
        className="w-full my-2.5 p-4 border border-gray-400 rounded bg-white"
        placeholder="Gebruikersnaam"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        className="w-full my-2.5 p-4 border border-gray-400 rounded bg-white"
        placeholder="Wachtwoord"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
      />
      <TouchableOpacity
        disabled={loading}
        className={`bg-[#e27b00] p-4 w-full rounded items-center mt-5 ${loading ? 'opacity-70' : ''}`}
        onPress={handleLogin}
      >
        {!loading && <Text className="text-white font-semibold">Inloggen</Text>}
        {loading && <ActivityIndicator size="small" color="#000000" />}
      </TouchableOpacity>
    </View>
  );
};

export default Login;
