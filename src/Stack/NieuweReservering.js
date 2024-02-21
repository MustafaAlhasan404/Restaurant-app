import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert
} from "react-native";
import { FAB } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ReservationItem = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.reservationItem}>
      <Text style={styles.reservationText}>
        {item.name} - {item.dateTime} {item.numGuests} guests
      </Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item._id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NieuweReservering = () => {
  const [reservations, setReservations] = useState([]);
  const navigation = useNavigation();
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http:/nl-app.onrender.com/reservations/${id}`);
      // Filter out the deleted reservation from the state
      setReservations(reservations.filter((reservation) => reservation._id !== id));
      Alert.alert('Success', 'Reservation deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Could not delete the reservation');
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('https://nl-app.onrender.com/reservations');
        setReservations(response.data);
      } catch (error) {
        Alert.alert('Error', 'Could not fetch reservations');
      }
    };

    fetchReservations();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={({ item }) => (
          <ReservationItem
            item={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item._id)}
          />
        )}
        keyExtractor={(item) => item._id.toString()}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddReservation')} // Use the correct screen name as registered in the stack navigator
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7', // Set a background color for the container
  },
  reservationItem: {
    backgroundColor: '#fff', // Use a light background for the item
    borderRadius: 8, // Rounded corners
    borderWidth: 1,
    borderColor: '#ddd', // Light border color for a subtle outline
    padding: 20, // Spacing inside the item
    marginBottom: 15, // Space between items
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2, // Slight shadow on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow position for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow blur radius for iOS
  },
  reservationText: {
    fontSize: 18, // Larger font size for better readability
    color: '#333', // Darker font color for contrast
    flex: 1, // Take up available space
    marginRight: 10, // Space between text and buttons
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    color: '#007bff', // Bootstrap primary color for edit button
    fontWeight: '500', // Slightly bolder font
    marginRight: 10, // Space between edit and delete buttons
  },
  deleteButton: {
    color: '#dc3545', // Bootstrap danger color for delete button
    fontWeight: '500', // Slightly bolder font
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#e27b00', // A vibrant color for the FAB
  },
  // Add any additional styles you may need below
});

export default NieuweReservering;
