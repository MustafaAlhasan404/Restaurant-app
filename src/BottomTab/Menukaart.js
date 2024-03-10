import React, { useState, useEffect } from "react";
import {
  View,
  useWindowDimensions,
  Text,
  StyleSheet,
  Pressable,
  Button,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../contexts/UserContext"; // Import useUser hook
import Header from "../Components/Header";
import FloatingButton from "../Components/FloatingButton"; // Import the FloatingButton component
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const renderTabBar = (props) => (
  <TabBar
    renderLabel={({ route, focused }) => (
      <Text style={{ fontWeight: 500, color: focused ? "black" : "grey" }}>
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
      borderBottomColor: "#bababa",
    }}
  />
);

const FirstRoute = () => {
  // Set up navigation so we can navigate to different screens
  const navigation = useNavigation();
  const { user } = useUser(); // Use the useUser hook to access the user object

  // Create state variables to store the menu items
  const [menuItems, setMenuItems] = useState([]);

  // Define a function to fetch menu items from the server
  const fetchMenuItems = async () => {
    try {
      // Make a GET request to the server to fetch food category products
      const response = await fetch(
        "https://nl-app.onrender.com/products/categories/food"
      );
      const data = await response.json();

      // Filter out products that have been marked as deleted
      const activeProducts = data.filter((product) => !product.deleted);

      // Update the state with the active products
      setMenuItems(activeProducts);
    } catch (error) {
      // If there is an error during fetching, log it to the console
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused, fetch menu items again
      fetchMenuItems();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const handleEditPress = (product) => {
    navigation.navigate("EditMenuKaart", {
      product: product,
      onProductUpdated: fetchMenuItems, // Pass fetchMenuItems as a callback
    });
  };

  // Define a function to handle the deletion of a menu item
  const handleDelete = async (productId) => {
    try {
      // Make a DELETE request to the server to soft delete the product
      const response = await fetch(
        `https://nl-app.onrender.com/products/${productId}`,
        {
          method: "DELETE",
          // If needed, include headers for authorization or other information
          // headers: {
          //   'Authorization': 'Bearer your-token-here',
          // },
        }
      );

      // Check if the response is successful
      if (response.ok) {
        console.log("Product soft deleted successfully");
        // Refresh the menu items to reflect the deletion
        fetchMenuItems();
      } else {
        console.error("Failed to delete the product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Define a function to render options for a menu item
  const renderMenuItemOptions = (menuItem) => {
    return menuItem.options.map((option, optionIndex) => (
      <View key={optionIndex} style={styles.menuItemOption}>
        <Text style={styles.menuItemOptionName}>{option.name}</Text>
        <Text style={styles.menuItemOptionPrice}>€{option.price}</Text>
        {optionIndex < menuItem.options.length && (
          <View style={styles.menuItemOptionDivider} />
        )}
      </View>
    ));
  };
  const canEdit = user && user.role === "manager";

  return (
    <View style={{ flex: 1, paddingTop: 0, paddingHorizontal: 0, height: 500 }}>
      <ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
        {menuItems.map((menuItem, index) => (
          <View key={index} style={styles.menuItem}>
            <View style={styles.menuItemGroup}>
              <Text style={styles.menuItemTitle}>{menuItem.title}</Text>
              {/* The buy button is not functional in the provided snippet */}
              {/* You may want to add onPress functionality to it */}
            </View>
            <Text style={styles.menuItemName}>{menuItem.name}</Text>
            {menuItem.ingredients && (
              <Text style={styles.menuItemIngredients}>
                {menuItem.ingredients}
              </Text>
            )}
            {menuItem.options && renderMenuItemOptions(menuItem)}
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemPrice}>
                €{menuItem.price.toFixed(2)}
              </Text>
              {canEdit && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditPress(menuItem)}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(menuItem._id)}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const SecondRoute = () => {
  // Set up navigation so we can navigate to different screens
  const navigation = useNavigation();
  const { user } = useUser(); // Use the useUser hook to access the user object

  // Create state variables to store the menu items
  const [menuItems, setMenuItems] = useState([]);

  // Define a function to fetch menu items from the server
  const fetchMenuItems = async () => {
    try {
      // Make a GET request to the server to fetch food category products
      const response = await fetch(
        "https://nl-app.onrender.com/products/categories/drink"
      );
      const data = await response.json();

      // Filter out products that have been marked as deleted
      const activeProducts = data.filter((product) => !product.deleted);

      // Update the state with the active products
      setMenuItems(activeProducts);
    } catch (error) {
      // If there is an error during fetching, log it to the console
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused, fetch menu items again
      fetchMenuItems();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // Define a function to handle the deletion of a menu item
  const handleDelete = async (productId) => {
    try {
      // Make a DELETE request to the server to soft delete the product
      const response = await fetch(
        `https://nl-app.onrender.com/products/${productId}`,
        {
          method: "DELETE",
          // If needed, include headers for authorization or other information
          // headers: {
          //   'Authorization': 'Bearer your-token-here',
          // },
        }
      );

      // Check if the response is successful
      if (response.ok) {
        console.log("Product soft deleted successfully");
        // Refresh the menu items to reflect the deletion
        fetchMenuItems();
      } else {
        console.error("Product verwijderen mislukt.");
      }
    } catch (error) {
      console.error("Fout:", error);
    }
  };

  const handleEditPress = (product) => {
    navigation.navigate("EditMenuKaart", { product: product });
  };

  // Define a function to render options for a menu item
  const renderMenuItemOptions = (menuItem) => {
    return menuItem.options.map((option, optionIndex) => (
      <View key={optionIndex} style={styles.menuItemOption}>
        <Text style={styles.menuItemOptionName}>{option.name}</Text>
        <Text style={styles.menuItemOptionPrice}>€{option.price}</Text>
        {optionIndex < menuItem.options.length - 1 && (
          <View style={styles.menuItemOptionDivider} />
        )}
      </View>
    ));
  };

  const canEdit = user && user.role === "manager";

  // Render the FirstRoute component
  return (
    <View style={{ flex: 1, paddingTop: 0, paddingHorizontal: 0, height: 500 }}>
      <ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
        {menuItems.map((menuItem, index) => (
          <View key={index} style={styles.menuItem}>
            <View style={styles.menuItemGroup}>
              <Text style={styles.menuItemTitle}>{menuItem.title}</Text>
              {/* The buy button is not functional in the provided snippet */}
              {/* You may want to add onPress functionality to it */}
            </View>
            <Text style={styles.menuItemName}>{menuItem.name}</Text>
            <Text style={styles.menuItemIngredients}>
              {menuItem.ingredients}
            </Text>
            {menuItem.options && renderMenuItemOptions(menuItem)}
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemPrice}>
                €{menuItem.price.toFixed(2)}
              </Text>

              {canEdit && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditPress(menuItem)}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(menuItem._id)}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const ThirdRoute = () => {
  // Set up navigation so we can navigate to different screens
  const navigation = useNavigation();
  const { user } = useUser(); // Use the useUser hook to access the user object

  // Create state variables to store the menu items
  const [menuItems, setMenuItems] = useState([]);

  // Define a function to fetch menu items from the server
  const fetchMenuItems = async () => {
    try {
      // Make a GET request to the server to fetch food category products
      const response = await fetch(
        "https://nl-app.onrender.com/products/categories/snack"
      );
      const data = await response.json();

      // Filter out products that have been marked as deleted
      const activeProducts = data.filter((product) => !product.deleted);

      // Update the state with the active products
      setMenuItems(activeProducts);
    } catch (error) {
      // If there is an error during fetching, log it to the console
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused, fetch menu items again
      fetchMenuItems();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // Define a function to handle the deletion of a menu item
  const handleDelete = async (productId) => {
    try {
      // Make a DELETE request to the server to soft delete the product
      const response = await fetch(
        `https://nl-app.onrender.com/products/${productId}`,
        {
          method: "DELETE",
          // If needed, include headers for authorization or other information
          // headers: {
          //   'Authorization': 'Bearer your-token-here',
          // },
        }
      );

      // Check if the response is successful
      if (response.ok) {
        console.log("Product soft deleted successfully");
        // Refresh the menu items to reflect the deletion
        fetchMenuItems();
      } else {
        console.error("Failed to delete the product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleEditPress = (product) => {
    navigation.navigate("EditMenuKaart", { product: product });
  };

  // Define a function to render options for a menu item
  const renderMenuItemOptions = (menuItem) => {
    return menuItem.options.map((option, optionIndex) => (
      <View key={optionIndex} style={styles.menuItemOption}>
        <Text style={styles.menuItemOptionName}>{option.name}</Text>
        <Text style={styles.menuItemOptionPrice}>€{option.price}</Text>
        {optionIndex < menuItem.options.length - 1 && (
          <View style={styles.menuItemOptionDivider} />
        )}
      </View>
    ));
  };

  const canEdit = user && user.role === "manager";

  // Render the FirstRoute component
  return (
    <View style={{ flex: 1, paddingTop: 0, paddingHorizontal: 0, height: 500 }}>
      <ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
        {menuItems.map((menuItem, index) => (
          <View key={index} style={styles.menuItem}>
            <View style={styles.menuItemGroup}>
              <Text style={styles.menuItemTitle}>{menuItem.title}</Text>
              {/* The buy button is not functional in the provided snippet */}
              {/* You may want to add onPress functionality to it */}
            </View>
            <Text style={styles.menuItemName}>{menuItem.name}</Text>
            <Text style={styles.menuItemIngredients}>
              {menuItem.ingredients}
            </Text>
            {menuItem.options && renderMenuItemOptions(menuItem)}
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemPrice}>
                €{menuItem.price.toFixed(2)}
              </Text>
              {canEdit && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditPress(menuItem)}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(menuItem._id)}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
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

      <View style={{ marginHorizontal: 20 }}>
        <Text style={[styles.screendescription, { marginTop: 25 }]}>
          Bekijk hier alle producten van de menukaart.
        </Text>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={styles.tabs}
      />

      <FloatingButton />
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
    borderColor: "#000", // Change border color
    borderRadius: 10, // Add border radius for rounded corners
    backgroundColor: "#f0f0f0", // Change background color
    marginBottom: 25,
    height: 50, // Adjust height as needed
    justifyContent: "center", // Center the picker content
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
  menuItemIngredients: {
    color: "#bbb",
    marginBottom: 8,
  },
  addeditems: {
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6",
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
    marginHorizontal: 20,
    marginVertical: 50,
    height: 3000,
  },
  menuItems: {},
  menuItem: {
    flexDirection: "column",
    paddingHorizontal: 15,
    paddingVertical: 15,
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
    marginTop: -20,
  },
  menuItemName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4, // Add some space between the title and name
  },
  menuItemNameIngredients: {
    textAlign: "center",
    fontWeight: 100,
    fontSize: 14,
    marginBottom: 10, // Add some space between the title and name
  },
  menuItemPrice: {
    color: "#e27b00",
    marginTop: 5, // Add some space between the options and price
    fontWeight: "bold", // Make the price bold
    fontSize: 16, // Increase font size for the price
  },
  menuItemOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2.5,
    paddingHorizontal: 0,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    marginVertical: 0,
  },

  menuItemOptionDivider: {
    height: 1, // Height of the divider line
    backgroundColor: "#ddd", // Color of the divider line
    marginHorizontal: 40, // Horizontal margin to make the line narrower
    // You can adjust marginHorizontal to increase or decrease the line length
  },
  menuItemOptionName: {
    fontSize: 14,
    color: "#333", // Dark color for the option name
  },

  menuItemOptionPrice: {
    fontSize: 14,
    color: "#333", // Dark color for the option price
  },

  buttonContainer: {
    flexDirection: "row",
  },
  editButton: {
    padding: 5,
    backgroundColor: "#e27b00",
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: "#dc3545",
    borderRadius: 5,
    marginLeft: 10,
  },
  menuItemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5, // Adjust as needed for spacing
  },
  // ... other styles
});

// this is a test
