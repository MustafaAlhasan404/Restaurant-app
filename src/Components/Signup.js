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
  Alert,
  Switch,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { BASE_URL } from '../../config';
import { Ionicons } from '@expo/vector-icons';

const Signup = ({ navigation }) => {
  const [credentials, setCredentials] = useState({ name: "", username: "", password: "" });
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();

  const handleInputChange = useCallback((field) => (value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSignup = useCallback(() => {
    if (credentials.password.length < 8) {
      Alert.alert("Fout", "Wachtwoord moet minimaal 8 tekens zijn.");
      return;
    }

    setLoading(true);
    fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: credentials.name,
        username: credentials.username,
        password: credentials.password,
        role: isManager ? "manager" : "employee",
      }),
    })
      .then((response) => {
        if (!response.ok) {
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
        console.log("Accountregistratie gelukt:", data);
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Fout:", error);
        Alert.alert(
          "Accountregistatie fout",
          "Er was een probleem met de accountregistratie. Controleer alle velden."
        );
      })
      .finally(() => setLoading(false));
  }, [credentials, isManager, navigation]);

  return (
    <SafeAreaView className={`flex-1 ${theme.background}`}>
      <StatusBar backgroundColor={theme.statusBar.backgroundColor} barStyle={theme.statusBar.barStyle} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <View className={`${theme.surface} p-6 rounded-3xl shadow-md`}>
          <Text className={`text-2xl font-bold ${theme.text.primary} mb-6`}>Sign Up</Text>

          <View className="space-y-4 mb-6">
            <View className={`${theme.input.background} rounded-full flex-row items-center px-4 py-3`}>
              <Ionicons name="person-outline" size={20} color={isDark ? "white" : "gray"} />
              <TextInput
                className={`flex-1 ml-2 ${theme.text.primary}`}
                placeholder="Name"
                placeholderTextColor={theme.text.tertiary}
                value={credentials.name}
                onChangeText={handleInputChange("name")}
              />
            </View>
            <View className={`${theme.input.background} rounded-full flex-row items-center px-4 py-3`}>
              <Ionicons name="at-outline" size={20} color={isDark ? "white" : "gray"} />
              <TextInput
                className={`flex-1 ml-2 ${theme.text.primary}`}
                placeholder="Username"
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
            <View className="flex-row items-center justify-between mx-3">
              <Text className={theme.text.secondary}>Role:</Text>
              <View className="flex-row items-center">
                <Text className={theme.text.secondary}>Employee</Text>
                <Switch
                  trackColor={{ false: theme.accent, true: theme.accent }}
                  thumbColor={isManager ? theme.primary : theme.surface}
                  onValueChange={() => setIsManager(prev => !prev)}
                  value={isManager}
                  className="mx-2"
                />
                <Text className={theme.text.secondary}>Manager</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className={`${theme.primary} rounded-full items-center py-4 mb-4`}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text className={`${isDark ? 'text-black' : 'text-white'} font-bold text-lg`}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mb-4">
            <Text className={theme.text.secondary}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className={`${theme.text.secondary} underline ml-2`}>Login</Text>
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

export default React.memo(Signup);