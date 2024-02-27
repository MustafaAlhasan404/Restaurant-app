import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Switch } from 'react-native';

const AddVoorraad = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [category, setCategory] = useState('food'); // Default to 'food' as per schema
  const [stockable, setStockable] = useState(true); // Default to true as per schema
  const [qty, setQty] = useState('');

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
      };

      const response = await fetch('https://nl-app.onrender.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as required, e.g., authorization headers
        },
        body: JSON.stringify(product),
      });
      console.log("Type of stockable:", typeof stockable);
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
    <View style={styles.container}>
      <Text style={styles.text}>Add Product to Inventory</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <View style={styles.switchContainer}>
        <Text>Stockable:</Text>
        <Switch
          value={stockable}
          onValueChange={setStockable}
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
      <Button title="Add Product" onPress={handleSubmit} />
    </View>
  );
};

export default AddVoorraad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
