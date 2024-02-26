import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Header from '../Components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const Bestellingen = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://nl-app.onrender.com/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      let patchUrl = `https://nl-app.onrender.com/orders/${orderId}/${newStatus}`;

      const response = await axios.patch(patchUrl);
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const showStatusOptions = (orderId, currentStatus) => {
    Alert.alert(
      'Change Order Status',
      'Select the new status for the order:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Processed',
          onPress: () => {
            if (currentStatus === 'processed') {
              Alert.alert('Status Update', 'This order is already processed.');
            } else {
              changeOrderStatus(orderId, 'processed');
            }
          },
        },
        {
          text: 'Mark as Paid',
          onPress: () => {
            if (user && user.isManager) { // Check if the user is a manager
              changeOrderStatus(orderId, 'paid');
            } else {
              Alert.alert('Permission Denied', 'No manager privilege.');
            }
          },
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
        <Text style={styles.welcomeText}>Welcome, {user ? user.Name : 'Guest'}!</Text>

        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderId}>Order ID: {item._id}</Text>
              <Text style={styles.orderDetail}>Table: {item.table}</Text>
              <Text style={styles.orderDetail}>Status: {item.status}</Text>
              <Text style={styles.orderDetail}>Total Price: ${item.totalPrice.toFixed(2)}</Text>
              <Text style={styles.orderDetail}>Order Date: {new Date(item.orderDate).toLocaleString()}</Text>
              {item.products.map((product, index) => (
                <View key={index} style={styles.productItem}>
                  <Text style={styles.productDetail}>Product ID: {product.product}</Text>
                  <Text style={styles.productDetail}>Selected Options: {product.selectedOptions.map(option => option.name).join(', ')}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => showStatusOptions(item._id, item.status)}
              >
                <Icon name="pencil" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Bestellingen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0d5d6',
  },
  safeArea: {
    backgroundColor: '#311213',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  productItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  productDetail: {
    fontSize: 13,
  },
  statusButton: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
    alignSelf: 'flex-start', // Align button to the start of the flex container
    flexDirection: 'row', // Align icon and text in a row
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
  },
});