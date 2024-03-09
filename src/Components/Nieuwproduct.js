import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import the Picker component
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Nieuwproduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("food"); // Default to 'food' as per schema
  const [stockable, setStockable] = useState(false); // Default to true as per schema
  const [qty, setQty] = useState("");
  const [options, setOptions] = useState([]);
  const handleOptionNameChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].name = value;
    setOptions(newOptions);
  };

  const handleOptionPriceChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].price = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { name: "", price: "" }]);
  };

  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };
  const renderOptions = () => {
    return options.map((option, index) => (
      <View key={index} style={styles.optionContainer}>
        <TextInput
          style={[styles.input, styles.marginr]}
          placeholder="Optie naam"
          value={option.name}
          onChangeText={(text) => handleOptionNameChange(index, text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Optie prijs"
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

  const handleSubmit = async () => {
    // Basic front-end validation
    if (!name || !price || (stockable && !qty)) {
      Alert.alert("Fout", "Vul alle verplichte velden in.");
      return;
    }

    try {
      const product = {
        name,
        price: parseFloat(price),
        ingredients,
        category,
        stockable, // Send the boolean value directly
        qty: stockable ? parseInt(qty, 10) : 0, // Set qty to 0 if stockable is false
        options,
      };

      const response = await fetch("https://nl-app.onrender.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include other headers as required, e.g., authorization headers
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Product toevoegen niet gelukt: " +
            (errorData.message || "Unknown error")
        );
      }

      const responseData = await response.json();
      Alert.alert("Voltooid", "Product toegevoegd: " + responseData.name);
      // Reset form fields
      setName("");
      setPrice("");
      setIngredients("");
      setCategory("food"); // Reset to default as per schema
      setStockable(true); // Reset stockable to true
      setQty("");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, height: "auto" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? null : "padding"}
        style={styles.container}
      >
        <Text style={styles.screendescription}>
          Voeg hier een nieuw product toe aan het menu.
        </Text>

        {/* <Text style={styles.text}>Add Product</Text> */}
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
          <Picker.Item
            style={styles.pickeritem}
            label="Gerechten"
            value="food"
          />
          <Picker.Item
            style={styles.pickeritem}
            label="Dranken"
            value="drink"
          />
          <Picker.Item style={styles.pickeritem} label="Hapjes" value="snack" />
        </Picker>
        <Text style={styles.formlabel}>Voorraad bijhouden?</Text>
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={stockable ? "#e27b00" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setStockable}
            value={stockable}
          />
        </View>
        {stockable && (
          <View>
            <Text style={styles.formlabel}>Huidige voorraad:</Text>
            <TextInput
              style={styles.input}
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
            />
          </View>
        )}
        {renderOptions()}
        <TouchableOpacity style={styles.addButton} onPress={addOption}>
          <Text style={styles.addButtonText}>Opties toevoegen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Nieuw product toevoegen</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Nieuwproduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#e0d5d6",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  screendescription: {
    marginBottom: 40,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "transparent", // Adjust the color to match your app's theme if necessary
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#e27b00",
  },
  addButtonText: {
    color: "#e27b00",
    fontWeight: "600",
  },
  removeButton: {
    marginLeft: 10,
    marginBottom: 10,
    backgroundColor: "#dc3545", // Adjust the color to match your app's theme if necessary
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  // If the input style is not already defined in Nieuwproduct.js, add it as well
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
  // ... existing styles for input ...
  picker: {
    height: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 14,
    color: "#333",
  },
  formlabel: { fontWeight: "700", fontSize: 14, marginBottom: 7 },
  pickeritem: {
    fontSize: 14,
  },
  marginr: { marginRight: 10 },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 14,
  },
  button: {
    marginBottom: Platform.OS === "android" ? 60 : 0,
    backgroundColor: "#e27b00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
