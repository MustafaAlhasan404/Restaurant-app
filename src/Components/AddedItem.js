import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// State
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem } from "../State/orderSlice";

const AddedItem = ({ productID, selectedOptions }) => {
  const [menuItem, setMenuItem] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(productID);
        const response = await fetch(
          `https://nl-app.onrender.com/products/${productID}`
        );
        const data = await response.json();
        setMenuItem(data);
        let price = data.price;
        for (let i = 0; i < selectedOptions.length; i++) {
          price += selectedOptions[i].price;
        }
        setTotalPrice(price);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const dispatch = useDispatch();

  const handleRemoveProduct = (productID, selectedOptions) => {
    dispatch(
      removeItem({
        product: productID,
        selectedOptions: selectedOptions,
        price: totalPrice,
      })
    );
  };

  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemHeader}>
        <View style={styles.spaceBetweenRow}>
          <Text style={styles.menuItemName}>{menuItem.name}</Text>
          <Text style={styles.menuItemPrice}>€{menuItem.price}</Text>
        </View>
      </View>

      <View style={styles.menuItemOptions}>
        {selectedOptions.map((option, index) => {
          return (
            <View key={index} style={styles.menuItemOption}>
              <Text style={styles.menuItemOptionName}>{option.name}</Text>
              <Text style={styles.menuItemOptionPrice}>
                €{option.price.toFixed(2)}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.menuItemFooter}>
        <Text style={styles.menuItemPrice}>
          Productprijs: €{totalPrice.toFixed(2)}
        </Text>
        <Pressable
          style={styles.addButton}
          onPress={() => handleRemoveProduct(productID, selectedOptions)}
        >
          <MaterialCommunityIcons name="delete" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

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

  checkbox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
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
    marginVertical: 5,
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#bababa",
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
    fontWeight: "bold",
  },
  menuItemIngredients: {
    fontSize: 12,
    color: "#666",
  },
  menuItemPrice: {
    color: "black",
    fontWeight: "500",
    fontSize: 14,
  },

  menuItemOptions: {
    paddingVertical: 10,
  },

  menuItemOption: {
    flexDirection: "row",
    alignItems: "center", // Align items in the center vertically
    justifyContent: "space-between",
    // Add padding inside the option container
    borderRadius: 5, // Rounded corners for option items
    width: "100%",
  },

  menuItemOptionLabel: {
    display: "flex",
    flexDirection: "row",
  },

  menuItemOptionName: {
    fontSize: 14,
    color: "#bbb", // Text color for option name
  },

  menuItemOptionPrice: {
    fontSize: 14,
    color: "#bbb", // Text color for option price
    //fontWeight: "bold", // Make the option price bold
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
  menuItemOptionQuantity: {
    fontSize: 14,
    color: "#555", // Text color for option quantity
    fontWeight: "bold", // Make the option quantity bold
    marginLeft: 10, // Add some space between the price and quantity
  },
  spaceBetweenRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemFooter: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 3,
    backgroundColor: "#e27b00",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddedItem;
