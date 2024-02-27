import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Header from '../Components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../contexts/UserContext'; // Import useUser hook
import { FAB } from 'react-native-paper'; // Import FAB from react-native-paper
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const Voorraad = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  const { user } = useUser(); // Use the useUser hook to access the user object
  const navigation = useNavigation(); // Use the useNavigation hook for navigation

  const closePrompt = () => {
    setEditProductId(null);
    setNewQuantity('');
  };

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

  const handleEditPress = (productId) => {
    setEditProductId(productId);
    // Find the current quantity of the product to prefill the prompt
    const product = products.find(p => p._id === productId);
    setNewQuantity(product.qty.toString());
  };

  const handleUpdateQuantity = async () => {
    try {
      const response = await fetch(`https://nl-app.onrender.com/products/stock/${editProductId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as required, e.g., authorization headers
        },
        body: JSON.stringify({ qty: newQuantity }),
      });
      const updatedProduct = await response.json();
      // Update the local state to reflect the new quantity
      setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      closePrompt(); // Close the prompt
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

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
            <View style={styles.productDetails}>
              <Text style={styles.menuItemTitle}>{product.name}</Text>
              <Text style={styles.menuItemPrice}>Quantity: {product.qty}</Text>
            </View>
            {/* Render the edit button only if the user is a manager */}
            {user && user.role === 'manager' && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress(product._id)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Render the prompt only if the user is a manager */}
      {user && user.role === 'manager' && editProductId && (
        <View style={styles.prompt}>
          <TextInput
            style={styles.input}
            value={newQuantity}
            onChangeText={setNewQuantity}
            keyboardType="numeric"
          />
          <View style={styles.promptButtons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={closePrompt}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleUpdateQuantity}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* FAB button */}
      {user && user.role === 'manager' && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('AddVoorraad')} // Replace 'AddProduct' with the actual route name you want to navigate to
        />
      )}
    </View>
  );
};

export default Voorraad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  menuItems: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuItems: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productDetails: {
    flex: 1,
  },
  menuItemTitle: {
    fontWeight: "600",
    fontSize: 18,
    color: "#333",
  },
  menuItemPrice: {
    color: "#666",
    marginTop: 4,
    fontSize: 14,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e27b00',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  prompt: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    height: 200,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  promptButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  updateButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom:0,
    backgroundColor: '#e27b00', }
});

