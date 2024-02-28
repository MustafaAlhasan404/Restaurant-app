import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AccordionItem = ({ item }) => {
  const [isOpened, setIsOpened] = useState(false);
  const navigation = useNavigation();
  const animation = useState(new Animated.Value(0))[0];
  const orderTime = new Date(item.orderDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const toggleAccordion = () => {
    setIsOpened(!isOpened);
  };

  const heightAnimationInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 270], // Adjust this value to fit the content
  });

  const handlePress = () => {
    navigation.navigate('Bestellingen', { orderId: item._id });
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpened ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpened]);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.header}>
      <Text style={styles.title}>Tafel : {item.table}</Text>
      <View style={styles.dateContainer}>
        <Text style={styles.orderdate}>Geplaatst: {orderTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

const OrdersToDo = () => {
  const [orders, setOrders] = useState([]);
  const [badgeNumber, setBadgeNumber] = useState(0);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://nl-app.onrender.com/orders');
      const data = await response.json();
      const todaysOrders = data.filter(order => {
        const orderDate = new Date(order.orderDate);
        orderDate.setHours(0, 0, 0, 0);
        const isToday = orderDate.getTime() === new Date().setHours(0, 0, 0, 0);
        const isUnprocessed = order.status === 'unprocessed';
        return isToday && isUnprocessed;
      });
      setOrders(todaysOrders);
      setBadgeNumber(todaysOrders.length);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
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
        keyExtractor={(item) => item._id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 22,
  },
  header: {
    width: 250,
    height: 150,
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
    justifyContent: 'center',
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
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",

    flex: 1, // Take up all available space
  },
  orderdate: {
    // ... existing styles for orderdate ...
    textAlign: 'center',
    fontSize:16 // Center the text within the Text component
  },
  dateContainer: {
    // This container will ensure the date is centered
    flex: 1, // Take up all available space
    justifyContent: 'center', // Center content horizontally in the container
    alignItems: 'center', // Center content vertically in the container
  },

  // Add additional styles for the horizontal layout if necessary
});

export default OrdersToDo;
