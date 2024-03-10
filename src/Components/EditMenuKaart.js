import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import the Picker component
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const EditMenuKaart = () => {
  const route = useRoute();
  const product = route.params.product; // Get the product data passed from Menukaart.js

  // Set the initial state using the product data
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [ingredients, setIngredients] = useState(product.ingredients);
  const [category, setCategory] = useState(product.category);
  const [stockable, setStockable] = useState(product.stockable);
  const [qty, setQty] = useState(product.qty.toString());
  const [options, setOptions] = useState(product.options || []); // New state for options

  // Function to handle option name change
  const handleOptionNameChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].name = value;
    setOptions(newOptions);
  };

  const handleOptionPriceChange = (index, value) => {
    const newOptions = [...options];
    // Assuming option.price is a number, convert it to a string
    newOptions[index].price = value;
    setOptions(newOptions);
  };

  // Function to add a new option
  const addOption = () => {
    setOptions([...options, { name: "", price: "" }]);
  };

  // Function to remove an option
  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!name || !price || (stockable && !qty)) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const updatedProduct = {
        name,
        price: parseFloat(price),
        ingredients,
        category,
        stockable,
        qty: stockable ? parseInt(qty, 10) : 0,
        options,
      };

      const response = await fetch(
        `https://nl-app.onrender.com/products/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Failed to update product: " + (errorData.message || "Unknown error")
        );
      }

      const responseData = await response.json();
      Alert.alert("Voltooid", "Product gewijzigd: " + responseData.name);

      // Invoke the callback function if provided
      if (route.params.onProductUpdated) {
        route.params.onProductUpdated(responseData);
      }

      // Optionally, navigate back or update the state to reflect the changes
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const renderOptions = () => {
    return options.map((option, index) => (
      <View key={index} style={styles.optionContainer}>
        <TextInput
          style={[styles.input, { width: 150 }]}
          placeholder="Option Name"
          value={option.name}
          onChangeText={(text) => handleOptionNameChange(index, text)}
        />
        <TextInput
          style={[styles.input, { marginLeft: 7 }]}
          placeholder="Option Price"
          value={option.price.toString()}
          onChangeText={(text) => handleOptionPriceChange(index, text)}
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={() => removeOption(index)}
          style={styles.removeButton}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screendescription}>
        Pas hier een bestaand product aan.
      </Text>

      <Text style={styles.formlabel}>Naam product:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.formlabel}>Prijs:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.formlabel}>Omschrijving:</Text>
      <TextInput
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
      />

      <Text style={styles.formlabel}>Productcategorie:</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        style={styles.picker}
        mode="dropdown" // Android only
      >
        <Picker.Item style={styles.pickeritem} label="Gerechten" value="food" />
        <Picker.Item style={styles.pickeritem} label="Drank" value="drink" />
        <Picker.Item style={styles.pickeritem} label="Hapjes" value="snack" />
      </Picker>
      {stockable && (
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={qty}
          onChangeText={setQty}
          keyboardType="numeric"
        />
      )}
      <Text style={styles.formlabel}>Opties:</Text>
      {renderOptions()}
      <TouchableOpacity style={styles.addButton} onPress={addOption}>
        <Text style={[styles.addButtonText, { fontWeight: 600 }]}>
          Optie toevoegen
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { fontWeight: 600 }]}>
          Wijzingen opslaan
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditMenuKaart;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#e0d5d6",
    height: "100%",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 14,
    color: "#333",
  },
  picker: {
    height: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
  },
  screendescription: {
    marginBottom: 40,
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#e27b00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 100,
  },
  pickeritem: {
    fontSize: 14,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  formlabel: { fontWeight: "700", fontSize: 14, marginBottom: 7 },
  // Additional styles for options
  optionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#333",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#e27b00",
  },
  addButtonText: {
    color: "#e27b00",
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#e27b60",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 10,
    marginBottom: 10,
    backgroundColor: "#dc3545", // Use the same color as in Voorraad.js
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
