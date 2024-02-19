import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const Bestellingen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: "#311213" }}>
        <Header name="Bestellingen" />
      </SafeAreaView>

      <View style={styles.maincontent}>
        <Text>Bestellingen</Text>
      </View>
    </View>
  );
};

export default Bestellingen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6",
  },
  maincontent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
