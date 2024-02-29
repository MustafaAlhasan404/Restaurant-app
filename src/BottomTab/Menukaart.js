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
import Header from "../Components/Header";
import FloatingButton from "../Components/FloatingButton"; // Import the FloatingButton component
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

  const handleDelete = async (itemId) => {
    try {
      // First, we need to check if the product is part of any open (unpaid) orders.
      // We make a GET request to the backend endpoint that will perform this check.
      // Replace `http://localhost:3000` with your actual backend server's URL.
      const checkUrl = `https://nl-app.onrender.com/orders/check-product/${itemId}`;
      const checkResponse = await fetch(checkUrl);
  
      // Parse the JSON response from the server.
      const checkData = await checkResponse.json();
  
      // If the server response indicates that the product is in open orders, we stop the deletion process.
      if (checkData.isInOpenOrder) {
        // You can replace this alert with a more sophisticated error handling mechanism if needed.
        alert('Cannot delete product as it is part of an open order.');
        return; // Exit the function early as we do not want to proceed with deletion.
      }
  
      // If the product is not in any open orders, we proceed with the deletion.
      // We make a DELETE request to the backend endpoint that will delete the product.
      const deleteUrl = `https://nl-app.onrender.com/products/${itemId}`;
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers your API requires, such as authorization tokens.
        },
      });
  
      // Check if the DELETE operation was successful by examining the HTTP response status code.
      if (response.ok) {
        // If the delete was successful, we update the state to remove the item from the list.
        setMenuItems(prevItems => prevItems.filter(item => item._id !== itemId));
        console.log("Deleted item with id:", itemId);
      } else {
        // If the server responded with an error, we handle it here.
        // We parse the error message from the server's response.
        const errorData = await response.json();
        console.error("Failed to delete item:", errorData.message);
        // Again, you can replace this alert with a more sophisticated error handling mechanism.
        alert(`Failed to delete item: ${errorData.message}`);
      }
    } catch (error) {
      // If there was an error sending the request or receiving the response, we handle it here.
      console.error("Error deleting item:", error);
      // Display an error message to the user.
      alert(`Error deleting item: ${error.message}`);
    }
  };
  
  const renderMenuItemOptions = (menuItem) => {
    return menuItem.options.map((option, optionIndex) => (
      <View key={optionIndex}>
        <View style={styles.menuItemOption}>
          <Text style={styles.menuItemOptionName}>{option.name}</Text>
          <Text style={styles.menuItemOptionPrice}>€{option.price}</Text>
        </View>
        {optionIndex < menuItem.options.length - 1 && (
          <View style={styles.menuItemOptionDivider} />
        )}
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
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemPrice}>€{menuItem.price.toFixed(2)}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPress(menuItem._id)}
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
            </View>
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
          "https://nl-app.onrender.com/products/categories/drink"
        );
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`https://nl-app.onrender.com/products/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers your API requires, such as authorization tokens
        },
      });
  
      if (response.ok) {
        // If the delete was successful, remove the item from the state
        setMenuItems(prevItems => prevItems.filter(item => item._id !== itemId));
        console.log("Deleted item with id:", itemId);
      } else {
        // If the server responded with an error, handle it here
        const errorData = await response.json();
        console.error("Failed to delete item:", errorData.message);
      }
    } catch (error) {
      // If there was an error sending the request, handle it here
      console.error("Error deleting item:", error);
    }
  };

  const renderMenuItemOptions = (menuItem) => {
    return menuItem.options.map((option, optionIndex) => (
      <View key={optionIndex}>
        <View style={styles.menuItemOption}>
          <Text style={styles.menuItemOptionName}>{option.name}</Text>
          <Text style={styles.menuItemOptionPrice}>€{option.price}</Text>
        </View>
        {optionIndex < menuItem.options.length - 1 && (
          <View style={styles.menuItemOptionDivider} />
        )}
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
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemPrice}>€{menuItem.price.toFixed(2)}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPress(menuItem._id)}
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
            </View>
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
          "https://nl-app.onrender.com/products/categories/snack"
        );
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`https://nl-app.onrender.com/products/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers your API requires, such as authorization tokens
        },
      });
  
      if (response.ok) {
        // If the delete was successful, remove the item from the state
        setMenuItems(prevItems => prevItems.filter(item => item._id !== itemId));
        console.log("Deleted item with id:", itemId);
      } else {
        // If the server responded with an error, handle it here
        const errorData = await response.json();
        console.error("Failed to delete item:", errorData.message);
      }
    } catch (error) {
      // If there was an error sending the request, handle it here
      console.error("Error deleting item:", error);
    }
  };

  const renderMenuItemOptions = (menuItem) => {
    return menuItem.options.map((option, optionIndex) => (
      <View key={optionIndex}>
        <View style={styles.menuItemOption}>
          <Text style={styles.menuItemOptionName}>{option.name}</Text>
          <Text style={styles.menuItemOptionPrice}>€{option.price}</Text>
        </View>
        {optionIndex < menuItem.options.length - 1 && (
          <View style={styles.menuItemOptionDivider} />
        )}
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
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemPrice}>€{menuItem.price.toFixed(2)}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPress(menuItem._id)}
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
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10, // Add some space between the title and name
  },
  menuItemPrice: {
    color: "#e27b00",
    marginTop: 15, // Add some space between the options and price
    fontWeight: "bold", // Make the price bold
    fontSize: 20, // Increase font size for the price
  },
  menuItemOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    marginVertical: 2,
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