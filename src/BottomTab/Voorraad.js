import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../Components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

const Voorraad = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockableProducts = async () => {
      try {
        const response = await fetch('https://nl-app.onrender.com/products/stock');
        const data = await response.json();
        setProducts(data.filter(product => product.stockable)); // Assuming 'stockable' is a property
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockableProducts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#311213' }}>
        <Header name="Voorraad" />
      </SafeAreaView>

      <ScrollView style={styles.menuItems}>
        {products.map((product, index) => (
          <View key={index} style={styles.menuItem}>
            <Text style={styles.menuItemTitle}>{product.name}</Text>
            <Text style={styles.menuItemPrice}>Quantity: {product.qty}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Voorraad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  menuItems: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: "column",
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#bababa",
    backgroundColor: "#f9f9f9",
  },
  menuItemTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  menuItemPrice: {
    color: "#e27b00",
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  // Add other styles from Menukaart.js as needed
});
