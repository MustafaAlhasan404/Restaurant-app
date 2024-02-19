import { View, Text, StyleSheet } from "react-native";
import React from "react";
//import Header from "../Components/Header";

const NieuweReservering = () => {
  return (
    <View style={styles.container}>
      {/* <Header name="Detail" /> */}
      <Text>Nieuwe reservering</Text>
    </View>
  );
};

export default NieuweReservering;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6",
    alignItems: "center",
    justifyContent: "center",
  },
});
