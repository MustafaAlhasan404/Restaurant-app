import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Text,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FAB } from 'react-native-paper';

const FloatingButton = () => {
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current; // Use useRef to persist the animated value

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 5,
    }).start();

    setOpen(!open);
  };

  const navigation = useNavigation();
  const NweBestellingStyle = {
    transform: [
      { scale: animation },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80], // Adjust the horizontal position
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
    ],
  };

  const NweReserveringStyle = {
    transform: [
      { scale: animation },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80], // Adjust the horizontal position
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -140],
        }),
      },
    ],
  };

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

  return (
    <View style={[styles.container]}>
      <TouchableWithoutFeedback>
        <Animated.View style={[styles.button, styles.secondary, NweReserveringStyle]}>
          <Pressable
            onPress={() => {
              toggleMenu(); // Close the menu when an option is selected
              navigation.navigate("Nieuwe reservering"); // Navigate to NieuweReservering
            }}
          >
            <Text style={styles.text}>Nieuwe reservering</Text>
          </Pressable>
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback>
        <Animated.View style={[styles.button, styles.secondary, NweBestellingStyle]}>
          <Pressable
            onPress={() => {
              toggleMenu(); // Close the menu when an option is selected
              navigation.navigate("Nieuwe bestelling"); // Navigate to NieuweBestelling
            }}
          >
            <Text style={styles.text}>Nieuwe bestelling</Text>
          </Pressable>
        </Animated.View>
      </TouchableWithoutFeedback>

      <FAB 
        style={[styles.fab, rotation]}
        icon="plus"
        onPress={toggleMenu} // Make sure this is correctly bound
      />
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  button: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: "#333",
    shadowOffset: { height: 3, width: 0 },
    elevation: 2,
  },
  secondary: {
    width: 150,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e27b00",
  },
  text: {
    color: "#555",
  },
  fab: {
    backgroundColor: '#e27b00',
  },
});
