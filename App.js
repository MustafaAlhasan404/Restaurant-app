import "react-native-gesture-handler";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import FloatingButton from "./src/Components/FloatingButton";

import Home from "./src/BottomTab/Home";
import Menukaart from "./src/BottomTab/Menukaart";
import Bestellingen from "./src/BottomTab/Bestellingen";
import NieuweBestelling from "./src/Stack/NieuweBestelling";
import NieuweReservering from "./src/Stack/NieuweReservering";
import Voorraad from "./src/BottomTab/Voorraad";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      backBehavior="history"
      activeColor="#e27b00"
      inactiveColor="#e0d5d6"
      barStyle={{
        backgroundColor: "#311213",
        height: 75,
      }}
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let iconColor;
          let rn = route.name;

          if (rn == "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (rn == "Menukaart") {
            iconName = focused ? "food" : "food-outline";
          } else if (rn == "Bestellingen") {
            iconName = focused
              ? "order-bool-descending-variant"
              : "order-bool-descending-variant";
          } else if (rn == "Voorraad") {
            iconName = focused ? "equalizer" : "equalizer-outline";
          } else if (rn == "Nieuwe bestelling") {
            iconName = focused ? null : null;
          }

          if (rn == "Home") {
            iconColor = focused ? "#e27b00" : "#e0d5d6";
          } else if (rn == "Menukaart") {
            iconColor = focused ? "#e27b00" : "#e0d5d6";
          } else if (rn == "Bestellingen") {
            iconColor = focused ? "#e27b00" : "#e0d5d6";
          } else if (rn == "Voorraad") {
            iconColor = focused ? "#e27b00" : "#e0d5d6";
          } else if (rn == "Nieuwe bestelling") {
            iconColor = focused ? "#e0d5d6" : "#e0d5d6";
          }

          return (
            <MaterialCommunityIcons
              color={iconColor}
              size={22}
              name={iconName}
              style={{ marginTop: 0 }}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={StackNavigator}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Menukaart"
        component={Menukaart}
        options={{
          tabBarLabel: "Menukaart",
        }}
      />
      <Tab.Screen
        name="Bestellingen"
        component={Bestellingen}
        options={{
          tabBarLabel: "Bestellingen",
        }}
      />
      <Tab.Screen
        name="Voorraad"
        component={Voorraad}
        options={{
          tabBarLabel: "Voorraad",
        }}
      />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Nieuwe bestelling"
        component={NieuweBestelling}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#311213",
          },
          headerTintColor: "#e27b00",
        }}
      />

      <Stack.Screen
        name="Nieuwe reservering"
        component={NieuweReservering}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#311213",
          },
          headerTintColor: "#e27b00",
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transparent";
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
