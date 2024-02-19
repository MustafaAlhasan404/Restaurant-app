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

        <TouchableWithoutFeedback onPress={this.toggleMenu}>
          <Animated.View style={[styles.button, styles.menu, rotation]}>
            <MaterialCommunityIcons
              color="white"
              size={22}
              name="plus"
              style={{ marginTop: 0 }}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
};

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 670,
    left: 330,
  },
  button: {
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
});
