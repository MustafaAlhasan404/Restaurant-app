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
import Icon from 'react-native-vector-icons/FontAwesome';

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

  const handleInfoPress = () => {
    navigation.navigate('Bestellingen', { table: item.table });
  };

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
        <Text style={styles.title}>Tafel : {item.table}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.orderdate}>Geplaatst: {orderTime}</Text>
        </View>
        <Text style={styles.status}>{item.status}</Text>
        <TouchableOpacity onPress={handleInfoPress} style={styles.infoIcon}>
          <Icon name="info-circle" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
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
        return orderDate.getTime() === new Date().setHours(0, 0, 0, 0);
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
  acco: {},
  header: {
    width: 250, // Set a fixed width for each item
    height: 150, // Set a fixed height for each item (optional, depending on your design)
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
  infoIcon: {
    // Style for the touchable info icon
    padding: 10,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  title: {
    fontSize:42,
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
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e27b00', // Set the text color
    alignSelf: 'center', // Center the status horizontally
    textAlign: 'center', // Center the text within the Text component
    textTransform: 'uppercase', // Set the text to uppercase
  },

  // Add additional styles for the horizontal layout if necessary
});

export default OrdersToDo;
