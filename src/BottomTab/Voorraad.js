import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../contexts/UserContext";
import FloatingButton from "../Components/FloatingButton";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Voorraad = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [editProductName, setEditProductName] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");

  const { user } = useUser(); // Use the useUser hook to access the user object

  const closePrompt = () => {
    setEditProductId(null);
    setEditProductName(null);
    setNewQuantity("");
  };

  const fetchStockableProducts = async () => {
    try {
      const response = await fetch(
        "https://nl-app.onrender.com/products/stock"
      );
      const data = await response.json();
      setProducts(data.filter((product) => product.stockable));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to trigger a refresh whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchStockableProducts();
    }, [])
  );

  const handleEditPress = (productId) => {
    setEditProductId(productId);
    const product = products.find((p) => p._id === productId);
    setNewQuantity(product.qty.toString());
    setEditProductName(product.name);
  };

  const handleUpdateQuantity = async () => {
    try {
      const response = await fetch(
        `https://nl-app.onrender.com/products/stock/${editProductId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Include other headers as required, e.g., authorization headers
          },
          body: JSON.stringify({ qty: parseInt(newQuantity, 10) }), // Parse the newQuantity to ensure it's a number
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
      const updatedProduct = await response.json();
      // Update the local state to reflect the new quantity
      setProducts(
        products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
      closePrompt(); // Close the prompt
    } catch (error) {
      Alert.alert("Fout", error.message || "Voorraad bijwerken mislukt.");
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `https://nl-app.onrender.com/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            // Include other headers as required, e.g., authorization headers
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      // Update the local state to remove the deleted product
      setProducts(products.filter((p) => p._id !== productId));
      Alert.alert("Success", "Product deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#e27b00" />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: "#311213" }}>
        <Header name="Voorraad" />
      </SafeAreaView>

      <Text style={[styles.screendescription, { marginTop: 25 }]}>
        Bekijk hier de voorraad van producten en pas deze eventueel aan. Alleen
        als "Voorraad bijhouden?" is aangevinkt bij het aanmaken van het
        product, wordt deze hier getoond.
      </Text>

      <ScrollView style={styles.menuItems}>
        {products.map((product, index) => (
          <View key={index} style={styles.menuItem}>
            <View style={styles.productDetails}>
              <Text style={styles.menuItemTitle}>{product.name}</Text>
              <Text style={styles.menuItemPrice}>Voorraad: {product.qty}</Text>
            </View>
            {user && user.role === "manager" && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPress(product._id)}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={20}
                    color="white"
                  />
                  {/* <Text style={styles.editButtonText}>
										Edit
									</Text> */}
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(product._id)}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={20}
                    color="white"
                  />
                
                </TouchableOpacity> */}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {user && user.role === "manager" && editProductId && (
        <View style={styles.prompt}>
          <Text style={[styles.promptTitle, { fontWeight: 600 }]}>
            Voorraad aanpassen
          </Text>
          <Text style={styles.editItemName}>{editProductName}</Text>
          <TextInput
            style={styles.input}
            value={newQuantity}
            onChangeText={setNewQuantity}
            keyboardType="numeric"
          />
          <View style={styles.promptButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={closePrompt}
            >
              <Text style={styles.buttonText}>Annuleren</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdateQuantity}
            >
              <Text style={styles.buttonText}>Opslaan</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <FloatingButton />
    </View>
  );
};

export default Voorraad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    padding: 10,
    backgroundColor: "#e27b00",
    borderRadius: 5, // Increased rounded corners
    color: "#fff",
    fontWeight: "500",
    marginRight: 10,
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#dc3545",
    borderRadius: 10, // Increased rounded corners
    color: "#fff",
    fontWeight: "500",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  screendescription: {
    marginBottom: 40,
    marginHorizontal: 25,
  },
  prompt: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    height: 200,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: "center",
    // alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  promptButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
    backgroundColor: "#6c757d",
  },
  updateButton: {
    backgroundColor: "#e27b00",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  editItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  promptTitle: {
    fontSize: 18,
  },
  centerScreen: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  // Additional styles can be added here if needed
});
