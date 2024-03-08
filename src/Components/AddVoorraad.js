import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView,Platform,ScrollView,TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import the Picker component
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddVoorraad = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [category, setCategory] = useState('food'); // Default to 'food' as per schema
  const [stockable, setStockable] = useState(true); // Default to true as per schema
  const [qty, setQty] = useState('');
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
    setOptions([...options, { name: '', price: '' }]);
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
          style={styles.input}
          placeholder="Option Name"
          value={option.name}
          onChangeText={(text) => handleOptionNameChange(index, text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Option Price"
          value={option.price.toString()}
          onChangeText={(text) => handleOptionPriceChange(index, text)}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => removeOption(index)} style={styles.removeButton}>
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
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const product = {
        name,
        price: parseFloat(price),
        ingredients,
        category,
        stockable,  // Send the boolean value directly
        qty: stockable ? parseInt(qty, 10) : 0, // Set qty to 0 if stockable is false
        options,
      };

      const response = await fetch('https://nl-app.onrender.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as required, e.g., authorization headers
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Failed to add product: ' + (errorData.message || 'Unknown error'));
      }

      const responseData = await response.json();
      Alert.alert('Success', 'Product added successfully: ' + responseData.name);
      // Reset form fields
      setName('');
      setPrice('');
      setIngredients('');
      setCategory('food'); // Reset to default as per schema
      setStockable(true); // Reset stockable to true
      setQty('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "android" ? null : "padding"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Text style={styles.text}>Add Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Ingredients"
        value={ingredients}
        onChangeText={setIngredients}
      />
      <Picker
        selectedValue={category}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        style={styles.picker}
        mode="dropdown" // Android only
      >
        <Picker.Item label="Food" value="food" />
        <Picker.Item label="Drink" value="drink" />
        <Picker.Item label="Snack" value="snack" />
      </Picker>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Stockable:</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#767577" }}
          thumbColor={stockable ? "#e27b00" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setStockable}
          value={stockable}
        />
      </View>
      {stockable && (
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={qty}
          onChangeText={setQty}
          keyboardType="numeric"
        />
      )}
      {renderOptions()}
<TouchableOpacity style={styles.addButton} onPress={addOption}>
  <Text style={styles.addButtonText}>Add Option</Text>
</TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
          </ScrollView>
          </KeyboardAvoidingView>
  );
};

export default AddVoorraad;

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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#e27b00", // Adjust the color to match your app's theme if necessary
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 0,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    marginLeft: 10,
    marginBottom: 10,
    backgroundColor: "#dc3545", // Adjust the color to match your app's theme if necessary
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // If the input style is not already defined in AddVoorraad.js, add it as well
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
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
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 14,
    color: "#333",
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 18,
  },
  button: {
     marginBottom: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: "#e27b00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});