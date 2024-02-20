import React from "react";
import {
  StyleSheet,
  View,
  Animated,
  Text,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { FAB } from 'react-native-paper'; // Import FAB 

const FloatingButton = () => {
  animation = new Animated.Value(0);

  toggleMenu = () => {
    const toValue = this.open ? 0 : 1;

    Animated.spring(this.animation, {
      toValue,
      useNativeDriver: true,
      friction: 100,
    }).start();

    this.open = !this.open;
  };

  {
    const navigation = useNavigation();
    const NweBestellingStyle = {
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -80],
          }),
        },
      ],
    };

    const NweReserveringStyle = {
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -140],
          }),
        },
      ],
    };

    const rotation = {
      transform: [
        {
          rotate: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "45deg"],
          }),
        },
      ],
    };

    return (
      <View style={[styles.container]}>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.secondary, NweReserveringStyle]}>
            <Pressable
              android_ripple={{ color: "#e27b00", borderless: false }}
              style={styles.Pbutton}
              onPress={() => navigation.navigate("Nieuwe reservering")}
            >
              <Text>Nieuwe reservering</Text>
            </Pressable>
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.secondary, NweBestellingStyle]}>
            <Pressable
              android_ripple={{ color: "#e27b00", borderless: false }}
              style={styles.Pbutton}
              onPress={() => navigation.navigate("Nieuwe bestelling")}
            >
              <Text>Nieuwe bestelling</Text>
            </Pressable>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* Replace the toggle button with FAB */}
        <FAB 
            style={styles.fab} // Add a 'fab' style
            icon="plus"
            onPress={this.toggleMenu}
        /> 
      </View>
    );
  }
};

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    // Adjust for positioning in your specific layout
    position: "absolute", 
    top: 670, 
    left: 330,  
  },
   button: { 
    // Modify if needed for FAB appearance
    position: "absolute",
    width: 65,
    height: 65,
    borderRadius: 100 / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
    zIndex: 999999999,
  },
  menu: {
    backgroundColor: "#e27b00",
  },
  secondary: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    right: -60,
    top: 25,
  },
  Pbutton: {
    borderRadius: 2,
    borderColor: "#e27b00",
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#ebcda9",
  },
  fab: {
    position: 'absolute',
    bottom: -85, // Adjust placement to match other code
    right: -40,    // Adjust placement to match other code
    backgroundColor: '#e27b00',
  },
});
