import React, { useState, useEffect } from "react";
import {
  View,
  useWindowDimensions,
  Text,
  StyleSheet,
  Pressable,
  Button,
  ScrollView,
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

const FirstRoute = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://nl-app.onrender.com/products/categories/food"
        );
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderMenuItemOptions = (menuItem) => {
    return menuItem.options.map((option, optionIndex) => (
      <View key={optionIndex} style={styles.menuItemOption}>
        <Text style={styles.menuItemOptionName}>{option.name}</Text>
        <Text style={styles.menuItemOptionPrice}>{option.price}</Text>
      </View>
    ));
  };

  return (
    <View style={{ flex: 1, paddingTop: 0, paddingHorizontal: 0, height: 500 }}>
      <ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
        {menuItems.map((menuItem, index) => (
          <View key={index} style={styles.menuItem}>
            <View style={styles.menuItemGroup}>
              <Text style={styles.menuItemTitle}>{menuItem.title}</Text>
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
            <Text style={styles.menuItemName}>{menuItem.name}</Text>
            <Text style={styles.menuItemName}>{menuItem.ingredients}</Text>
            {menuItem.options && renderMenuItemOptions(menuItem)}
            <Text style={styles.menuItemPrice}>{menuItem.price.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


  const SecondRoute = () => {
    const [menuItems, setMenuItems] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            "https://nl-app.onrender.com/products/categories/food"
          );
          const data = await response.json();
          setMenuItems(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);
  
    const renderMenuItemOptions = (menuItem) => {
      return menuItem.options.map((option, optionIndex) => (
        <View key={optionIndex} style={styles.menuItemOption}>
          <Text style={styles.menuItemOptionName}>{option.name}</Text>
          <Text style={styles.menuItemOptionPrice}>{option.price}</Text>
        </View>
      ));
    };
  
    return (
      <View style={{ flex: 1, paddingTop: 0, paddingHorizontal: 0, height: 500 }}>
        <ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
          {menuItems.map((menuItem, index) => (
            <View key={index} style={styles.menuItem}>
              <View style={styles.menuItemGroup}>
                <Text style={styles.menuItemTitle}>{menuItem.title}</Text>
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
              <Text style={styles.menuItemName}>{menuItem.name}</Text>
              <Text style={styles.menuItemName}>{menuItem.ingredients}</Text>
              {menuItem.options && renderMenuItemOptions(menuItem)}
              <Text style={styles.menuItemPrice}>{menuItem.price.toFixed(2)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

    const ThirdRoute = () => {
      const [menuItems, setMenuItems] = useState([]);
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(
              "https://nl-app.onrender.com/products/categories/food"
            );
            const data = await response.json();
            setMenuItems(data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, []);
    
      const renderMenuItemOptions = (menuItem) => {
        return menuItem.options.map((option, optionIndex) => (
          <View key={optionIndex} style={styles.menuItemOption}>
            <Text style={styles.menuItemOptionName}>{option.name}</Text>
            <Text style={styles.menuItemOptionPrice}>{option.price}</Text>
          </View>
        ));
      };
    
      return (
        <View style={{ flex: 1, paddingTop: 0, paddingHorizontal: 0, height: 500 }}>
          <ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
            {menuItems.map((menuItem, index) => (
              <View key={index} style={styles.menuItem}>
                <View style={styles.menuItemGroup}>
                  <Text style={styles.menuItemTitle}>{menuItem.title}</Text>
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
                <Text style={styles.menuItemName}>{menuItem.name}</Text>
                <Text style={styles.menuItemName}>{menuItem.ingredients}</Text>
                {menuItem.options && renderMenuItemOptions(menuItem)}
                <Text style={styles.menuItemPrice}>{menuItem.price.toFixed(2)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    };
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
		borderColor: '#000', // Change border color
		borderRadius: 10, // Add border radius for rounded corners
		backgroundColor: '#f0f0f0', // Change background color
		marginBottom: 25,
		height: 50, // Adjust height as needed
		justifyContent: 'center', // Center the picker content
	},
	selectt: {
		//width: 200,
		height: 65,
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
		backgroundColor: "#f9f9f9", // Example background color for menu items
	},
	menuItemGroup: {
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center", // Align items in the center vertically
	},
	menuItemTitle: {
		fontWeight: "bold",
		fontSize: 16,
		color: "#333", // Darker text color for the title
	},
	menuItemName: {
		fontSize: 14,
		color: "#666", // Lighter text color for the name
		marginTop: 5, // Add some space between the title and name
	  },
	menuItemPrice: {
		color: "#e27b00",
		marginTop: 5, // Add some space between the options and price
		fontWeight: "bold", // Make the price bold
		fontSize: 16, // Increase font size for the price
	},

	menuItemOption: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 5, // Add some space between each option
		paddingVertical: 5, // Add padding inside the option container
		paddingHorizontal: 10, // Add padding inside the option container
		backgroundColor: "#fff", // Background color for option items
		borderRadius: 5, // Rounded corners for option items
		borderWidth: 1,
		borderColor: "#ddd", // Border color for option items
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
});