import * as React from "react";
import {
  View,
  useWindowDimensions,
  Text,
  StyleSheet,
  Pressable,
  Button,
  TouchableNativeFeedback,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const renderTabBar = (props) => (
  <TabBar
    renderLabel={({ route, focused }) => (
      <Text style={{ fontWeight: 400, color: focused ? "black" : "grey" }}>
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
      backgroundColor: "#ebcda9",
      elevation: 0,
      borderBottomWidth: 1,
      borderBottomColor: "#bababa",
    }}
  />
);

const FirstRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#e0d5d6",
      paddingTop: 30,
      paddingHorizontal: 20,
    }}
  >
    <View style={styles.menuItems}>
      <View style={styles.menuItem}>
        <View style={styles.menuItemGroup}>
          <Text style={styles.menuItemTitle}>Coca Cola (Blik 33cl)</Text>
          <Text style={styles.menuItemPrice}>$100</Text>
        </View>
      </View>
    </View>
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

export default function TabViewExample() {
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
      <SafeAreaView style={{ backgroundColor: "#311213" }}>
        <Header name="Menukaart" />
      </SafeAreaView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6",
  },
  maincontent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  tabs: {
    padding: 0,
    textTransform: "",
  },
  menuItems: {},
  menuItem: {
    flexDirection: "column",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,

    borderWidth: 1,
    borderColor: "#e27b00",
    borderRadius: 3,
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
  },
});
