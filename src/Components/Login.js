import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { BASE_URL } from '../../config';
import { Ionicons } from '@expo/vector-icons';

const Login = ({ navigation }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleInputChange = useCallback((field) => (value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLogin = useCallback(() => {
    setLoading(true);
    fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Login failed");
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        setUser(data.user);
        navigation.navigate("Main");
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [credentials, setUser, navigation]);

  return (
    <SafeAreaView className={`flex-1 ${theme.background}`}>
      <StatusBar backgroundColor={theme.statusBar.backgroundColor} barStyle={theme.statusBar.barStyle} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <View className={`${theme.surface} p-6 rounded-3xl shadow-md`}>
          <Text className={`text-2xl font-bold ${theme.text.primary} mb-6`}>Login</Text>

          <View className="space-y-4 mb-6">
            <View className={`${theme.input.background} rounded-full flex-row items-center px-4 py-3`}>
              <Ionicons name="person-outline" size={20} color={isDark ? "white" : "gray"} />
              <TextInput
                className={`flex-1 ml-2 ${theme.text.primary}`}
                placeholder="Username or Email"
                placeholderTextColor={theme.text.tertiary}
                value={credentials.username}
                onChangeText={handleInputChange("username")}
                autoCapitalize="none"
              />
            </View>
            <View className={`${theme.input.background} rounded-full flex-row items-center px-4 py-3`}>
              <Ionicons name="lock-closed-outline" size={20} color={isDark ? "white" : "gray"} />
              <TextInput
                className={`flex-1 ml-2 ${theme.text.primary}`}
                placeholder="Password"
                placeholderTextColor={theme.text.tertiary}
                value={credentials.password}
                onChangeText={handleInputChange("password")}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            className={`${theme.primary} rounded-full items-center py-4 mb-4`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className={`${isDark ? 'text-black' : 'text-white'} font-bold text-lg`}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mb-4">
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text className={`${theme.text.secondary} underline mx-2`}>Sign Up</Text>
            </TouchableOpacity>
            <Text className={theme.text.secondary}>|</Text>
            <TouchableOpacity>
              <Text className={`${theme.text.secondary} underline ml-2`}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`${theme.input.background} rounded-full flex-row items-center justify-center py-3`}
            onPress={toggleTheme}
          >
            <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color={isDark ? "white" : "black"} />
            <Text className={`ml-2 ${theme.text.primary}`}>
              {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default React.memo(Login);