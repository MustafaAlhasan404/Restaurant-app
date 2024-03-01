import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome5";
import FloatingButton from "../Components/FloatingButton";
import { useRoute } from '@react-navigation/native';

const Bestellingen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const flatListRef = useRef(null);
  const route = useRoute();

  // Abstract the fetch logic into a function
  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://nl-app.onrender.com/orders");
      // Map products to new array with details
      const ordersWithDetails = await Promise.all(
        response.data.map(async (order) => {
          order.products = await Promise.all(
            order.products.map(async (product) => {
              const productDetails = await axios.get(
                `https://nl-app.onrender.com/products/${product.product}`
              );
              return {
                ...product,
                name: productDetails.data.name,
                price: productDetails.data.price,
              };
            })
          );
          return order;
        })
      );
      setOrders(ordersWithDetails);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  useEffect(() => {
    // Subscribe to the focus event to refresh orders whenever the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      // Call fetchOrders to refresh the list of orders
      fetchOrders();
    });
  
    // Return the function to unsubscribe from the event when the component unmounts
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.orderId) {
        const index = orders.findIndex(order => order._id === route.params.orderId);
        if (index !== -1 && flatListRef.current) {
          flatListRef.current.scrollToIndex({ animated: true, index: index });
        }
      }
    });

    return unsubscribe;
  }, [navigation, orders, route.params?.orderId]);

  const handleEditOrder = (order) => {
    // Navigate to the EditBestelling screen and pass the entire order object
    navigation.navigate('EditBestelling', { order: order });
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(`https://nl-app.onrender.com/orders/${orderId}`);
      if (response.status === 200) {
        // Call fetchOrders to refresh the list after deletion
        fetchOrders();
        Alert.alert("Success", "Order deleted successfully");
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete order");
    }
  };

  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      let patchUrl = `https://nl-app.onrender.com/orders/${orderId}/${newStatus}`;
      const response = await axios.patch(patchUrl);
      if (response.status === 200) {
        // Call fetchOrders to refresh the list after status change
        fetchOrders();
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };


  const showStatusOptions = (orderId, currentStatus) => {
    let newStatus = currentStatus === 'unprocessed' ? 'processed' : 'paid';
    Alert.alert(
      "Change Order Status",
      `Are you sure you want to mark this order as ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => changeOrderStatus(orderId, newStatus),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* SafeAreaView ensures that the content is displayed within the safe area boundaries of the device */}
      <SafeAreaView style={styles.safeArea}>
        {/* Header component is used to display the screen title */}
        <Header name="Bestellingen" />
      </SafeAreaView>

      {/* The main content area where the list of orders will be displayed */}
      <View style={styles.mainContent}>
        {/* FlatList is used to efficiently render a list of orders */}
        <FlatList
          ref={flatListRef} // Assign the ref created earlier to the FlatList for scrolling functionality
          data={orders} // The array of orders to be rendered
          keyExtractor={(item) => item._id} // Function to extract a unique key for each item
          renderItem={({ item }) => (
            // This function defines how each order item is rendered
            <View style={styles.orderItem}>
              {/* Container for the table number */}
              <View style={styles.centerSingleItem}>
                <Text style={styles.orderId}>
                  Table {item.table}
                </Text>
              </View>
              {/* Container for order date and status */}
              <View style={styles.spaceBetweenRow}>
                <Text style={styles.orderDetail}>
                  {/* Display the order date or time based on whether it's today's date */}
                  {new Date(item.orderDate).toDateString() ===
                    new Date().toDateString()
                    ? new Date(item.orderDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : new Date(item.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                </Text>
                <Text style={styles.orderDetail}>
                  {/* Display the order status in uppercase */}
                  {item.status.toUpperCase()}
                </Text>
              </View>
              {/* Container for the list of products in the order */}
              <View style={styles.productCards}>
                {item.products.map((product, index) => (
                  <View key={index} style={styles.productItem}>
                    <View style={styles.spaceBetweenRow}>
                      <Text style={styles.productDetail}>
                        {/* Display the product name and index */}
                        {index + 1}. {product.name}
                      </Text>
                      <Text style={styles.productDetail}>
                        {/* Display the product price */}
                        ${product.price}
                      </Text>
                    </View>
                    <Text style={styles.productDetail}>
                      {/* Display the selected options for the product */}
                      {product.selectedOptions.map((option) => option.name).join(", ")}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Container for the order management buttons and total price */}
              <View style={styles.spaceBetweenRow}>
                {/* Button group for status change and delete buttons */}
                <View style={styles.buttonGroup}>
                  {/* Status change button */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditOrder(item._id)}
                  >
                    <Icon name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => showStatusOptions(item._id, item.status)}
                  >
                    <Icon
                      name="arrow-right"
                      size={20}
                      color="#000"
                    />
                  </TouchableOpacity>
                  {/* Delete button */}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteOrder(item._id)}
                  >
                    <Icon name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                {/* Display the total price of the order */}
                <Text style={styles.price}>
                  ${item.totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
          // Prop to hide the vertical scroll indicator
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* FloatingButton component is used for an action button that floats above the content */}
      <FloatingButton />
    </View>
  );

};

export default Bestellingen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6",
  },
  safeArea: {
    backgroundColor: "#311213",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderDetail: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  productItem: {
    // marginTop: 10,
    // padding: 10,
    // backgroundColor: "#f2f2f2",
    // borderRadius: 5,
  },
  productDetail: {
    fontSize: 13,
  },
  statusButton: {
    padding: 10,
    backgroundColor: "#e27b00",
    borderRadius: 5,
    marginRight: 10,
    alignSelf: "flex-start", // Align button to the start of the flex container
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
  },
  spaceBetweenRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  centerSingleItem: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  productCards: {
    marginTop: 10,
    marginBottom: 20,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#dc3545",
    borderRadius: 5,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    width: 40,
    padding: 10,
    backgroundColor: "#007bff", // You can choose a different color
    borderRadius: 5,
    marginRight: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
  },
});