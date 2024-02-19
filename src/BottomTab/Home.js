import { View, Text, StyleSheet, StatusBar } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import OrdersToDo from "../Components/OrdersToDo";
import FloatingButton from "../Components/FloatingButton";

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#311213" barStyle="light-content" />
      <SafeAreaView style={{ backgroundColor: "#311213" }}>
        <Header name="Home" />
      </SafeAreaView>

      <View style={styles.maincontent}>
        {/* <Text onPress={() => navigation.navigate("Nieuwe bestelling")}>
          Go to Details
        </Text> */}

        <View style={{ flexDirection: "row", gap: 5 }}>
          <View style={styles.badgenumber}>
            <Text style={styles.badgenumbertext}>6</Text>
          </View>
          <Text style={styles.contentheader}>Open bestellingen:</Text>
        </View>

        <OrdersToDo />

        <View style={{ flexDirection: "row", gap: 5, marginTop: 40 }}>
          <View style={styles.badgenumber}>
            <Text style={styles.badgenumbertext}>0</Text>
          </View>
          <Text style={styles.contentheader}>Reserveringen vandaag:</Text>
        </View>
      </View>
      <FloatingButton></FloatingButton>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6",
  },
  maincontent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  contentheader: {
    fontWeight: "bold",
    color: "black",
    fontSize: 14,
  },
  badgenumber: {
    backgroundColor: "#e27b00",
    width: 23,
    height: 23,
    padding: 0,
    borderRadius: 40,
  },
  badgenumbertext: {
    color: "white",
    zIndex: 99999,
    elevation: 100,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    fontWeight: "600",
  },
});
