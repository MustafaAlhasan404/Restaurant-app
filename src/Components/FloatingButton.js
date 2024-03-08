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
import { FAB } from "react-native-paper";
import { useUser } from "../contexts/UserContext"; // Import useUser hook

const FloatingButton = () => {
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current; // Use useRef to persist the animated value
  const { user } = useUser(); // Use the useUser hook to access the user object
  const navigation = useNavigation();

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 5,
    }).start();

    setOpen(!open);
  };

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

  const NieuweEmployeeStyle = {
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
          outputRange: [0, -200],
        }),
      },
    ],
  };

  const NieuweProductStyle = {
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
          outputRange: [0, -260],
        }),
      },
    ],
  };

  return (
    <View style={[styles.container]}>
      {user && user.role === "manager" && (
        <TouchableWithoutFeedback>
          <Animated.View
            style={[styles.button, styles.secondary, NieuweProductStyle]}
          >
            <Pressable
              onPress={() => {
                toggleMenu(); // Close the menu when an option is selected
                navigation.navigate("Nieuw product"); // Navigate to AddVoorraad
              }}
            >
              <Text style={styles.text}>Nieuw product</Text>
            </Pressable>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}

      {user && user.role === "manager" && (
        <TouchableWithoutFeedback>
          <Animated.View
            style={[styles.button, styles.secondary, NieuweEmployeeStyle]}
          >
            <Pressable
              onPress={() => {
                toggleMenu(); // Close the menu when an option is selected
                navigation.navigate("Signup"); // Navigate to Signup
              }}
            >
              <Text style={styles.text}>Nieuwe medewerker</Text>
            </Pressable>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}

      <TouchableWithoutFeedback>
        <Animated.View
          style={[styles.button, styles.secondary, NweReserveringStyle]}
        >
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
        <Animated.View
          style={[styles.button, styles.secondary, NweBestellingStyle]}
        >
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
        color="white"
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
    borderRadius: 100,
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
    width: 190,
    height: "auto",
    borderRadius: 24,
    backgroundColor: "#fce9d2",
    borderWidth: 1,
    borderColor: "#dedede",
    paddingVertical: 15,
    paddingHorizontal: 5,
    position: "absolute",
    right: -90,
  },
  text: {
    color: "black",
  },
  fab: {
    backgroundColor: "#e27b00",
    borderRadius: 100,
    padding: 7,
  },
});
