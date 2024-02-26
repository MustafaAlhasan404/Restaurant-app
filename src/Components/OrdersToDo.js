import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AccordionItem = ({ item, index, details }) => {
  const [isOpened, setIsOpened] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  const toggleAccordion = () => {
    setIsOpened(!isOpened);
  };

  const heightAnimationInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 270],
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpened ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [isOpened]);

  return (
    <View>
      <TouchableWithoutFeedback onPress={toggleAccordion} style={styles.acco}>
        <View style={styles.header}>
          <Text style={styles.title}>Tafel: {item.table}</Text>
          <Text style={styles.orderdate}>Geplaatst: {item.orderDate}</Text>
          <MaterialIcons
            color="gray"
            size={22}
            name={isOpened ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            style={{ marginTop: 0 }}
          />
        </View>
      </TouchableWithoutFeedback>
      <Animated.View
        style={[styles.content, { height: heightAnimationInterpolation }]}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          {/* Details can be mapped here based on the item structure */}
        </View>
      </Animated.View>
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
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <View style={styles.badgenumber}>
          <Text style={styles.badgenumbertext}>{badgeNumber}</Text>
        </View>
        <Text style={styles.contentheader}>Open bestellingen:</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={({ item, index }) => (
          <AccordionItem item={item} index={index} />
        )}
        keyExtractor={(item) => item._id} // Assuming each order has a unique _id
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
  item: {
    padding: 10,
    fontSize: 13,
    height: 44,
    backgroundColor: "white",
    marginBottom: 10,
    lineHeight: 22,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#e27b00",
  },
  header: {
    padding: 10,
    backgroundColor: '#fff', // This is the background color of the item
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#e27b00',
    borderRadius: 10,
    overflow: 'hidden', // This is important for text to wrap
  },

  content: {
    marginTop: 8,
    overflow: "hidden",
  },
  orderdetails: {
    //flex: 1,
    fontWeight: "600",
    marginBottom: 10,
  },
  orderdetailstxt: {
    fontWeight: "300",
  },
  orderdate: {
    fontStyle: "italic",
    fontSize: 13,
    marginRight: 8,
  },
  title: {
    marginRight: "auto",
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
});

export default OrdersToDo;
