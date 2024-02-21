import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FAB } from 'react-native-paper';
import axios from 'axios'; // Make sure to install axios if you haven't already

const ReservationItem = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.reservationItem}>
      <Text style={styles.reservationText}>
        {item.name} - {item.date} {item.time}
      </Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NieuweReservering = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Replace with your backend server URL
        const response = await axios.get('https://nl-app.onrender.com/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        // Handle error, e.g., set an error state, show a message, etc.
      }
    };

    fetchReservations();
  }, []);

  const handleEdit = (item) => {
    // Handle edit action
    console.log('Edit item:', item);
  };

  const handleDelete = (id) => {
    // Handle delete action
    console.log('Delete item with id:', id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={({ item }) => (
          <ReservationItem
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => console.log('Add Reservation')} // Replace with your add action
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  reservationItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservationText: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#e27b00',
  },
});

export default NieuweReservering;
