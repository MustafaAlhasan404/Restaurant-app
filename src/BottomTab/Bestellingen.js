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


const Bestellingen = ({ route }) => {
  const [orders, setOrders] = useState([]);
  const flatListRef = useRef();
  const initialLoad = useRef(true);
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(`https://nl-app.onrender.com/orders/${orderId}`);
      if (response.status === 200) {
        // Update the local state to remove the deleted order
        setOrders(orders.filter((order) => order._id !== orderId));
        Alert.alert("Success", "Order deleted successfully");
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete order");
    }
  };

  // Function to fetch orders from the server
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

  // Polling mechanism to fetch new orders at regular intervals
  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
    const interval = setInterval(fetchOrders, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    // Reset initialLoad when navigating away
    return () => {
      initialLoad.current = true;
    };
  }, []);


  useEffect(() => {
    if (route.params?.orderId) {
      const index = orders.findIndex((order) => order._id === route.params.orderId);
      console.log(`Scrolling to order ID: ${route.params.orderId} at index: ${index}`);
      if (index !== -1) {
        flatListRef.current?.scrollToIndex({ animated: true, index: index });
      }
    }
  }, [route.params?.orderId, orders]);

  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      let patchUrl = `https://nl-app.onrender.com/orders/${orderId}/${newStatus}`;
      await axios.patch(patchUrl);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
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
      <SafeAreaView style={styles.safeArea}>
        <Header name="Bestellingen" />
      </SafeAreaView>
  
      <View style={styles.mainContent}>
        <FlatList
          ref={flatListRef} // Assign the ref to the FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <View style={styles.centerSingleItem}>
                <Text style={styles.orderId}>
                  Table {item.table}
                </Text>
              </View>
              <View style={styles.spaceBetweenRow}>
                <Text style={styles.orderDetail}>
                  {new Date(item.orderDate).toDateString() ===
                    new Date().toDateString()
                    ? new Date(
                      item.orderDate
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : new Date(
                      item.orderDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                </Text>
                <Text style={styles.orderDetail}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
              <View style={styles.productCards}>
                {item.products.map((product, index) => (
                  <View key={index} style={styles.productItem}>
                    <View style={styles.spaceBetweenRow}>
                      <Text style={styles.productDetail}>
                        {index + 1}. {product.name}
                      </Text>
                      <Text style={styles.productDetail}>
                        ${product.price}
                      </Text>
                    </View>
                    <Text style={styles.productDetail}>
                      {product.selectedOptions.map((option) => option.name).join(", ")}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.spaceBetweenRow}>
                {/* Button group for status and delete buttons */}
                <View style={styles.buttonGroup}>
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
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteOrder(item._id)}
                  >
                    <Icon name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.price}>
                  ${item.totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
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
    marginRight: 10,
    backgroundColor: "#e27b00",
    borderRadius: 5,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
});
