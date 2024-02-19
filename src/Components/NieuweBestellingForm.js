import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  TextInput,
  TouchableNativeFeedback,
  ScrollView,
  Modal,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Formik } from "formik";
import * as yup from "yup";
import { Picker } from "@react-native-picker/picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const renderTabBar = (props) => (
  <TabBar
    renderLabel={({ route, focused }) => (
      <Text
        style={{
          fontWeight: 400,
          color: focused ? "black" : "grey",
        }}
      >
        {route.title}
      </Text>
    )}
    {...props}
    indicatorStyle={{
      backgroundColor: "black",
    }}
    getLabelText={({ route }) => route.title}
    style={{
      marginTop: 0,
      backgroundColor: "white",
      elevation: 0,
      borderBottomWidth: 1,
      height: "auto",
    }}
  />
);

const FirstRoute = () => (
  <View
    style={{
      flex: 1,
      paddingTop: 0,
      paddingHorizontal: 0,
      height: 500,
    }}
  >
    <ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <TouchableNativeFeedback>
            <View style={styles.buybutton}>
              <MaterialCommunityIcons
                color="white"
                size={25}
                name="plus"
                style={{ marginTop: 0 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.menuItemPrice}>$100</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <TouchableNativeFeedback>
            <View style={styles.buybutton}>
              <MaterialCommunityIcons
                color="white"
                size={25}
                name="plus"
                style={{ marginTop: 0 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.menuItemPrice}>$100</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <TouchableNativeFeedback>
            <View style={styles.buybutton}>
              <MaterialCommunityIcons
                color="white"
                size={25}
                name="plus"
                style={{ marginTop: 0 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.menuItemPrice}>$100</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <TouchableNativeFeedback>
            <View style={styles.buybutton}>
              <MaterialCommunityIcons
                color="white"
                size={25}
                name="plus"
                style={{ marginTop: 0 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.menuItemPrice}>$100</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <TouchableNativeFeedback>
            <View style={styles.buybutton}>
              <MaterialCommunityIcons
                color="white"
                size={25}
                name="plus"
                style={{ marginTop: 0 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.menuItemPrice}>$100</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <TouchableNativeFeedback>
            <View style={styles.buybutton}>
              <MaterialCommunityIcons
                color="white"
                size={25}
                name="plus"
                style={{ marginTop: 0 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.menuItemPrice}>$100</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <TouchableNativeFeedback>
            <View style={styles.buybutton}>
              <MaterialCommunityIcons
                color="white"
                size={25}
                name="plus"
                style={{ marginTop: 0 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.menuItemPrice}>$100</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <TouchableNativeFeedback>
            <View style={styles.buybutton}>
              <MaterialCommunityIcons
                color="white"
                size={25}
                name="plus"
                style={{ marginTop: 0 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.menuItemPrice}>$100</Text>
      </View>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <TouchableNativeFeedback>
            <View style={styles.buybutton}>
              <MaterialCommunityIcons
                color="white"
                size={25}
                name="plus"
                style={{ marginTop: 0 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.menuItemPrice}>$100</Text>
      </View>
    </ScrollView>
  </View>
);

const SecondRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#e0d5d6",
      paddingTop: 30,
      paddingHorizontal: 20,
    }}
  >
    <Text>Tab 2</Text>
  </View>
);

const ThirdRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#e0d5d6",
      paddingTop: 30,
      paddingHorizontal: 20,
    }}
  >
    <Text>Tab 3</Text>
  </View>
);

export function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Gerechten" },
    { key: "second", title: "Dranken" },
    { key: "third", title: "Hapjes" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={styles.tabs}
      />
    </View>
  );
}

const NieuweBestellingForm = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Formik
        initialValues={{ selectValue: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <View>
            <Text style={styles.label}>Kies een tafel:</Text>
            <View style={styles.select}>
              <Picker
                selectedValue={values.selectValue}
                onValueChange={handleChange("selectValue")}
                style={styles.selectt}
                itemStyle={{ width: 200, height: 64 }}
              >
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="6" value="6" />
                <Picker.Item label="7" value="7" />
                <Picker.Item label="8" value="8" />
                <Picker.Item label="9" value="9" />
                <Picker.Item label="10" value="10" />
                <Picker.Item label="11" value="11" />
              </Picker>
            </View>

            <View style={{ height: 600 }}>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: "600" }}>Geselecteerd:</Text>
              </View>
              <Text style={styles.label}>Kies product(en):</Text>

              <TabViewExample />
            </View>

            {/* <Pressable style={styles.savebutton} onPress={handleSubmit}> */}
            <Pressable
              style={styles.savebutton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttontext}>Check order</Text>
            </Pressable>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                console.log("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Pressable
                    style={styles.backbutton}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <MaterialCommunityIcons
                      color="black"
                      size={25}
                      name="arrow-left"
                      style={{ marginTop: 0 }}
                    />
                    <Text style={styles.backbuttontext}>Back</Text>
                  </Pressable>
                  <Text style={styles.modalText}>
                    SHOW ORDER SUMMARY HERE. PRODUCTS + OPTIONS + PRICE PER
                    PRODUCT + TOTAL PRICE + PAYMENT METHOD
                  </Text>

                  <Pressable style={styles.submitbutton} onPress={handleSubmit}>
                    <Text style={styles.buttontext}>Send order</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default NieuweBestellingForm;

const styles = StyleSheet.create({
  savebutton: {
    backgroundColor: "#e27b00",
    padding: 15,
    position: "relative",
    borderRadius: 3,
    //top: 870,
    elevation: 0,
    zIndex: -10,
    width: "100%",
    marginTop: 30,
  },
  buttontext: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
  },
  select: {
    borderWidth: 1,
    backgroundColor: "white",
    marginBottom: 25,
    height: 58,
    lineHeight: 10,
  },
  selectt: {
    //width: 200,
    height: 44,
    // backgroundColor: "green",
  },
  selectoption: {},
  label: {
    marginBottom: 7,
    fontWeight: "600",
  },
  textinput: {
    borderWidth: 1,
    backgroundColor: "white",
    marginBottom: 0,
    height: 58,
    padding: 15,
  },
  addeditems: {
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    height: 1000,
  },
  maincontent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  tabs: {
    paddingVertical: 0,
    textTransform: "",
    borderWidth: 1,
  },
  menuItems: {},
  menuItem: {
    flexDirection: "column",
    paddingHorizontal: 15,
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#bababa",
  },
  menuItemGroup: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  menuItemTitle: {
    fontWeight: "500",
    fontSize: 14,
  },
  menuItemPrice: {
    color: "#e27b00",
    marginTop: -10,
  },
  buybutton: {
    //borderWidth: 1,
    borderColor: "grey",
    padding: 10,
    position: "relative",
    top: 5,
    borderRadius: 3,
    backgroundColor: "#e27b00",
  },
  submitbutton: {
    //borderWidth: 1,
    borderColor: "grey",
    padding: 15,
    margin: 15,
    position: "absolute",
    borderRadius: 3,
    backgroundColor: "#e27b00",
    justifyContent: "center",
    alignItems: "center",
    bottom: 10, //Here is the trick
    width: "100%",
  },
  centeredView: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    position: "relative",
    top: 70,
  },
  modalView: {
    width: "90%",
    height: "60%",
    position: "relative",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backbutton: { flexDirection: "row", marginBottom: 50 },
  backbuttontext: {
    fontSize: 15,
  },
});
