import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';

const AccordionItem = ({ item }) => {
  const [isOpened, setIsOpened] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

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

  return (
    <View style={styles.accordionContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Tafel: {item.table}</Text>
          <Text style={styles.orderdate}>Geplaatst: {new Date(item.orderDate).toLocaleString()}</Text>
          <Text style={styles.status}>Status: {item.status}</Text>
        </View>
    </View>
  );
};

const OrdersToDo = () => {
  const [orders, setOrders] = useState([]);
  const [badgeNumber, setBadgeNumber] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://nl-app.onrender.com/orders');
        const data = await response.json();
        setOrders(data);
        setBadgeNumber(data.length); // Assuming the data is an array of orders
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <View style={styles.badgenumber}>
          <Text style={styles.badgenumbertext}>{badgeNumber}</Text>
        </View>
        <Text style={styles.contentheader}>Open bestellingen:</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={({ item }) => <AccordionItem item={item} />}
        keyExtractor={(item) => item._id} // Assuming each order has a unique _id
        horizontal={true} // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false} // Optionally hide the horizontal scroll indicator
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 22,
  },
  acco: {},
  header: {
    marginLeft: 10,
    marginTop: 30,
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
  badgenumber: {
    backgroundColor: "#e27b00",
    width: 23,
    height: 23,
    justifyContent: 'center', // Center the text vertically
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
  // Add additional styles for the horizontal layout if necessary
});

export default OrdersToDo;
