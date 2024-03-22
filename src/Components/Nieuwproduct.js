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
  ActivityIndicator,
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Nieuwproduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("food");
  const [stockable, setStockable] = useState(false);
  const [qty, setQty] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!name || !price) {
      Alert.alert("Fout", "Vul alle verplichte velden in.");
      return;
    }

    try {
      setLoading(true);

      // Assuming you have a backend endpoint to handle the POST request
      const product = {
        name,
        price: parseFloat(price),
        ingredients,
        category,
        stockable,
        qty: stockable ? parseInt(qty || 0, 10) : 0,
        options,
      };

      const response = await fetch("http://yourapi.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      setName("");
      setPrice("");
      setIngredients("");
      setCategory("food");
      setStockable(false);
      setQty("");
      setOptions([]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
      setLoading(false);
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
        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: "Gerechten", value: "food" },
            { label: "Dranken", value: "drink" },
            { label: "Hapjes", value: "snack" },
          ]}
          style={pickerSelectStyles}
          value={category}
          useNativeAndroidPickerStyle={false}
          placeholder={{ label: "Selecteer een categorie...", value: null }}
        />

        <Text style={styles.formlabel}>Voorraad bijhouden?</Text>
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={stockable ? "#f5dd4b" : "#f4f3f4"}
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

        <View style={styles.optionsContainer}>
          {renderOptions()}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addOption}>
          <Text style={styles.addButtonText}>Optie toevoegen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Nieuw product toevoegen</Text>
          )}
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
  screendescription: {
    marginBottom: 40,
  },
  formlabel: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 7,
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
  optionsContainer: {
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#e27b00",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#e27b00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#dc3545",
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    marginBottom:12,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    backgroundColor: 'white', // Set background color to white
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white', // Set background color to white
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  placeholder: {
    color: 'gray', // Optional: change placeholder text color here
  },
  // Add any other style customization you need for the picker
});
