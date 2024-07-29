import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { BASE_URL } from '../../config';
import { useTheme } from "../contexts/ThemeContext";

const Login = ({ navigation }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const { theme, isDark, toggleTheme } = useTheme();
  const passwordInputRef = useRef(null);

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
        Alert.alert("Login Error", "Invalid username/password.");
        setLoading(false);
      });
  }, [credentials, setUser, navigation]);

  const handleUsernameSubmit = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 50);
  }, []);

  return (
    <SafeAreaView className={`flex-1 ${theme.background}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={Keyboard.dismiss} 
          className="flex-1 px-8 justify-center"
        >
          <View className="items-center my-8">
            <Text className={`text-5xl font-bold ${theme.text.primary} tracking-wide mb-2`}>
              AceLounge
            </Text>
          </View>
  
          <View className={`${theme.surface} p-8 rounded-3xl shadow-xl`}>
            <View className="mb-4">
              <Text className={`${theme.text.secondary} text-sm font-semibold mb-2`}>Username</Text>
              <TextInput
                className={`w-full p-4 ${theme.input.border} rounded-xl ${theme.input.background} ${theme.text.primary}`}
                placeholder="Enter your username"
                placeholderTextColor={theme.text.tertiary}
                value={credentials.username}
                onChangeText={handleInputChange("username")}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={handleUsernameSubmit}
                blurOnSubmit={false}
              />
            </View>
            
            <View className="mb-6">
              <Text className={`${theme.text.secondary} text-sm font-semibold mb-2`}>Password</Text>
              <TextInput
                ref={passwordInputRef}
                className={`w-full p-4 ${theme.input.border} rounded-xl ${theme.input.background} ${theme.text.primary}`}
                placeholder="Enter your password"
                placeholderTextColor={theme.text.tertiary}
                value={credentials.password}
                onChangeText={handleInputChange("password")}
                autoCapitalize="none"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>
            
            <TouchableOpacity
              disabled={loading}
              className={`w-full p-4 rounded-xl items-center ${
                loading ? theme.primaryVariant : theme.primary
              }`}
              onPress={handleLogin}
            >
              {!loading && <Text className="text-white font-bold text-lg">Login</Text>}
              {loading && <ActivityIndicator size="small" color="#ffffff" />}
            </TouchableOpacity>
          </View>
  
          <TouchableOpacity className="mt-4 items-center" onPress={toggleTheme}>
            <Text className={`${theme.text.secondary} text-base font-semibold`}>Toggle Theme</Text>
          </TouchableOpacity>
  
          <TouchableOpacity className="mt-4 items-center">
            <Text className={`${theme.text.secondary} text-base font-semibold`}>Forgot Password?</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default React.memo(Login);
