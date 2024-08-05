import React, { useState, useRef } from "react";
import { View, Animated, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FAB } from "react-native-paper";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';

const FloatingButton = () => {
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { user } = useUser();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const toggleMenu = () => {
    if (open) {
      // Close the menu
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
        friction: 5,
      }).start();
      setOpen(false);
      setIsMenuOpen(false);
    } else {
      // Open the menu
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
      setOpen(true);
      setIsMenuOpen(true);
    }
  };

  const getAnimatedStyle = (index) => ({
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -65 * (index + 1)],
        }),
      },
    ],
    opacity: animation,
  });

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
  };

  const renderButton = (title, icon, onPress, index) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.button, getAnimatedStyle(index)]}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={24} color="#FFF" />
        </View>
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );

  const BlurredOverlay = () => (
    <TouchableWithoutFeedback onPress={toggleMenu}>
      <BlurView 
        intensity={200} 
        style={StyleSheet.absoluteFill} 
        tint="Dark"
      />
    </TouchableWithoutFeedback>
  );

  return (
    <TouchableWithoutFeedback onPress={isMenuOpen ? toggleMenu : null}>
      <View style={styles.container}>
        {isMenuOpen && <BlurredOverlay />}
        {user && user.role === "manager" && (
          <>
            {renderButton("Add product", "hamburger-plus", () => {
              toggleMenu();
              navigation.navigate("Nieuw product");
            }, 4)}
            {renderButton("Add Employee", "account-plus", () => {
              toggleMenu();
              navigation.navigate("Signup");
            }, 3)}
            {renderButton("Statistics", "chart-line", () => {
              toggleMenu();
              navigation.navigate("Omzetcijfers");
            }, 2)}
          </>
        )}
        {renderButton("Reservations", "calendar-check", () => {
          toggleMenu();
          navigation.navigate("Nieuwe reservering");
        }, 1)}
        {renderButton("Add Order", "cart-plus", () => {
          toggleMenu();
          navigation.navigate("Nieuwe bestelling");
        }, 0)}
        <FAB
          style={[styles.fab, rotation]}
          icon="plus"
          color="#FFF"
          onPress={toggleMenu}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  button: {
    position: 'absolute',
    right: 10,
    bottom: 110,
    backgroundColor: '#e27b00',
    borderRadius: 30,
    width: 220,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 10,
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 10,
    bottom: 110,
    backgroundColor: '#e27b00',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default FloatingButton;
