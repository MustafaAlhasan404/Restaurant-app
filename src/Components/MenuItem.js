import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// State
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem } from "../State/orderSlice";

const MenuItem = ({ menuItem }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(menuItem.price);

  const resetItem = () => {
    setSelectedOptions([]);
    setTotalPrice(menuItem.price);
  };

  const handleSelectOption = (optionName, optionPrice) => {
    setSelectedOptions((prevOptions) => {
      if (
        prevOptions.findIndex((option) => option.name === optionName) !== -1
      ) {
        // option already exists, remove it
        setTotalPrice((currPrice) => currPrice - optionPrice);
        return prevOptions.filter((option) => option.name !== optionName);
      } else {
        // option does not exist, add it
        setTotalPrice((currPrice) => currPrice + optionPrice);
        return [...prevOptions, { name: optionName, price: optionPrice }];
      }
    });
  };

  const dispatch = useDispatch();

  const handleSelectProduct = () => {
    dispatch(
      addItem({
        product: menuItem._id,
        selectedOptions: selectedOptions,
        price: totalPrice,
      })
    );
    resetItem();
  };

  const renderOptions = () => {
    return menuItem.options.map((option, index) => {
      const isSelected =
        selectedOptions.findIndex(
          (selectedOption) => selectedOption.name === option.name
        ) !== -1;

      return (
        <Pressable
          key={index}
          onPress={() => handleSelectOption(option.name, option.price)}
        >
          <View style={styles.menuItemOption}>
            <View style={styles.menuItemOptionLabel}>
              <View style={styles.checkbox}>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="black"
                  />
                )}
              </View>
              <Text style={styles.menuItemOptionName}>{option.name}</Text>
            </View>
            <Text>€{option.price.toFixed(2)}</Text>
          </View>
        </Pressable>
      );
    });
  };

  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemHeader}>
        <View>
          <Text style={styles.menuItemName}>{menuItem.name}</Text>
          <Text style={styles.menuItemIngredients}>{menuItem.ingredients}</Text>
        </View>
        <Text style={styles.menuItemPrice}>€{menuItem.price.toFixed(2)}</Text>
      </View>

      <View style={styles.menuItemOptions}>{renderOptions()}</View>

      <View style={styles.menuItemFooter}>
        <Text style={styles.menuItemPrice}>
          Total: €{totalPrice.toFixed(2)}
        </Text>
        <Pressable
          style={styles.addButton}
          onPress={() => handleSelectProduct()}
        >
          <MaterialCommunityIcons name="plus" size={20} color="white" />
          {/* <Text style={styles.buttontext}>Add</Text> */}
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
    fontSize: 15,
    fontWeight: "bold",
  },
  menuItemIngredients: {
    fontSize: 13,
    color: "#666",
  },
  menuItemPrice: {
    color: "#e27b00",
    fontWeight: "bold",
    fontSize: 18,
  },

  menuItemOptions: {
    paddingVertical: 10,
  },

  menuItemOption: {
    flexDirection: "row",
    alignItems: "center", // Align items in the center vertically
    justifyContent: "space-between",
    paddingVertical: 5, // Add padding inside the option container
    paddingHorizontal: 0, // Add padding inside the option container
    borderRadius: 5, // Rounded corners for option items
    width: "100%",
  },

  menuItemOptionLabel: {
    display: "flex",
    flexDirection: "row",
  },

  menuItemOptionName: {
    fontSize: 14,
    color: "#555", // Text color for option name
  },

  menuItemOptionPrice: {
    fontSize: 14,
    color: "#555", // Text color for option price
    fontWeight: "bold", // Make the option price bold
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

export default MenuItem;
