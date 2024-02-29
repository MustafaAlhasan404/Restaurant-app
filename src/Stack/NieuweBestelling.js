import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import React from "react";
//import Header from "../Components/Header";
import NieuweBestellingForm from "../Components/NieuweBestellingForm";

const NieuweBestelling = () => {
  return (
    <View style={styles.container}>
      {/* <Header name="Detail" /> */}
      <ScrollView nestedScrollEnabled={true}>
        <View style={{ padding: 20 }}>
          {/* <Text style={styles.descriptiontext}>
            Voeg een nieuwe bestelling toe. Selecteer een tafel, kies de
            producten en voeg een notitie toe. Het totaalbedrag wordt onderaan
            getoond.
          </Text> */}
          <View style={styles.form}>
            <NieuweBestellingForm />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NieuweBestelling;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
    padding: 0,
    backgroundColor: "#e0d5d6",
    //alignItems: "center",
    // justifyContent: "center",
  },
  descriptiontext: {
    marginBottom: 40,
  },
  form: {
    flexDirection: "column",
    // height: 1000,
  },
});
