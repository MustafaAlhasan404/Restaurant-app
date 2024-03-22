import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // Import axios
import Icon from "react-native-vector-icons/FontAwesome"; // Import Icon
const AccordionItem = ({ item, fetchOrders }) => {
  const [isOpened, setIsOpened] = useState(false);
  const navigation = useNavigation();
  const animation = useState(new Animated.Value(0))[0];
  const orderTime = new Date(item.orderDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Add this option to use 24-hour format
  });

  const navigateToBestellingen = () => {
    // Navigate to the Bestellingen screen with the orderId as a parameter
    navigation.navigate("Bestellingen", { orderId: item._id });
  };

  const toggleAccordion = () => {
    setIsOpened(!isOpened);
  };

  const heightAnimationInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 270], // Adjust this value to fit the content
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpened ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpened]);

  // Function to change the order status
  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      let patchUrl = `http://208.109.231.135/orders/${orderId}/${newStatus}`;
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

  const handleStatusChangePress = () => {
    // Define the new status you want to set when the arrow is clicked
    const newStatus = "processed"; // Example status
    changeOrderStatus(item._id, newStatus);
  };

  return (
    <TouchableOpacity onPress={navigateToBestellingen}>
      <View style={styles.accordionContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Tafel {item.table}</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.orderdate}>Geplaatst: {orderTime}</Text>
          </View>
          {/* Arrow Icon Button */}
          {/* <TouchableOpacity
            onPress={handleStatusChangePress}
            style={styles.statusChangeButton}
          >
            <Icon name="arrow-right" size={24} color="#000" style={{}} />
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const OrdersToDo = () => {
  const [orders, setOrders] = useState([]);
  const [badgeNumber, setBadgeNumber] = useState(0);
  const fetchOrders = async () => {
    try {
      // Fetch all orders from the backend
      const response = await fetch("http://208.109.231.135/orders");
      const data = await response.json();

      // Filter out only unprocessed orders
      const unprocessedOrders = data.filter(
        (order) => order.status === "unprocessed"
      );

      // Optionally, filter for today's unprocessed orders if needed
      const todaysUnprocessedOrders = unprocessedOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === new Date().setHours(0, 0, 0, 0);
      });

      // Update state with the filtered unprocessed orders
      setOrders(todaysUnprocessedOrders);
      setBadgeNumber(todaysUnprocessedOrders.length);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);
  return (
    // The main container for the OrdersToDo component, styled with styles.container.
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 15,
        }}
      >
        <View style={styles.badgenumber}>
          <Text style={styles.badgenumbertext}>{badgeNumber}</Text>
        </View>

        <Text style={styles.contentheader}>Open bestellingen:</Text>
      </View>
      <View style={styles.fixedSizeContainer}>
        <FlatList
          // Array of orders to be rendered.
          data={orders}
          // Function to render each item using the AccordionItem component.
          renderItem={({ item }) => (
            <AccordionItem item={item} fetchOrders={fetchOrders} />
          )}
          // Function to extract a unique key for each item.
          keyExtractor={(item) => item._id}
          // Prop to hide the vertical scroll indicator.
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  fixedSizeContainer: {
    height: "auto", // Set a fixed height for the FlatList container
    width: "100%", // Set the width to take up 100% of the parent container
  },
  container: {
    container: {
      flex: 1, // The container will fill the entire screen.
      justifyContent: "center", // Centers content vertically in the container.
      alignItems: "center", // Centers content horizontally in the container.
    },
  },
  acco: {},
  header: {
    width: "100%", // Set a fixed width for each item
    height: "auto", // Set a fixed height for each item (optional, depending on your design)
    marginTop: 0,
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 13,
    borderRadius: 10,
    shadowColor: "#000",
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgenumber: {
    backgroundColor: "#e27b00",
    width: 23,
    height: 23,
    justifyContent: "center", // Center the text vertically
    borderRadius: 40,
  },
  badgenumbertext: {
    color: "white",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  contentheader: {
    fontWeight: "bold",
    color: "black",
    fontSize: 14,
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    flex: 0, // Take up all available space
  },
  orderdate: {
    // ... existing styles for orderdate ...
    textAlign: "left",
    fontSize: 14, // Center the text within the Text component
  },
  dateContainer: {
    // This container will ensure the date is centered
    flex: 0.5, // Take up all available space
    justifyContent: "flex-start", // Center content horizontally in the container
    alignItems: "flex-start", // Center content vertically in the container
  },
  statusChangeButton: {
    position: "absolute", // Position the button absolutely within its parent
    right: 10, // Position it 10 pixels from the right
    top: "50%", // Center it vertically
  },

  // Add additional styles for the horizontal layout if necessary
});

export default OrdersToDo;
