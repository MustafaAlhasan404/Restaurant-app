import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const AddVoorraad = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productIngredients, setProductIngredients] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productQty, setProductQty] = useState('');
  const [isStockable, setIsStockable] = useState('true'); // Changed to string to allow manual entry
  const [options, setOptions] = useState([{ name: '', price: '' }]);

  const handleAddOption = () => {
    setOptions([...options, { name: '', price: '' }]);
  };

  const handleOptionNameChange = (text, index) => {
    const newOptions = [...options];
    newOptions[index].name = text;
    setOptions(newOptions);
  };

  const handleOptionPriceChange = (text, index) => {
    const newOptions = [...options];
    newOptions[index].price = text;
    setOptions(newOptions);
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: productName,
        price: parseFloat(productPrice),
        ingredients: productIngredients,
        category: productCategory,
        qty: parseInt(productQty, 10),
        stockable: isStockable.trim().toLowerCase() === 'true', // Convert string input to boolean
        options: options.map(option => ({
          name: option.name,
          price: parseFloat(option.price),
        })),
      };

      const response = await fetch('https://nl-app.onrender.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as required, e.g., authorization headers
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const result = await response.json();
      Alert.alert('Success', 'Product added successfully');
      // Reset form or navigate back
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text>Name:</Text>
      <TextInput
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />
      <Text>Price:</Text>
      <TextInput
        value={productPrice}
        onChangeText={setProductPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text>Ingredients:</Text>
      <TextInput
        value={productIngredients}
        onChangeText={setProductIngredients}
        style={styles.input}
      />
      <Text>Category:</Text>
      <TextInput
        value={productCategory}
        onChangeText={setProductCategory}
        style={styles.input}
      />
      <Text>Quantity:</Text>
      <TextInput
        value={productQty}
        onChangeText={setProductQty}
        style={styles.input}
        keyboardType="numeric"
      />
      <View style={styles.inputContainer}>
        <Text>Stockable (true/false):</Text>
        <TextInput
          value={isStockable}
          onChangeText={setIsStockable}
          style={styles.input}
          autoCapitalize="none" // Ensure lowercase input for consistency
        />
      </View>
      <Text>Options:</Text>
      {options.map((option, index) => (
        <View key={index} style={styles.optionContainer}>
          <TextInput
            value={option.name}
            onChangeText={(text) => handleOptionNameChange(text, index)}
            placeholder="Option Name"
            style={styles.input}
          />
          <TextInput
            value={option.price}
            onChangeText={(text) => handleOptionPriceChange(text, index)}
            placeholder="Option Price"
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleAddOption}>
        <Text style={styles.buttonText}>Add Option</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddVoorraad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

