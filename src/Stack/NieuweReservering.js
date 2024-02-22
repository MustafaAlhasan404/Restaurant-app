import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from "react-native";
import { FAB } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ReservationItem = ({ item, onEdit, onDelete }) => {
  // Function to format the date and time
  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.reservationItem}>
      <View style={styles.reservationInfo}>
        <Text style={styles.reservationText}>
          {item.name} - {formatDateTime(item.dateTime)} - {item.numGuests} guests
        </Text>
        {/* Display phone number if it exists */}
        {item.phone ? (
          <Text style={styles.reservationPhone}>{item.phone}</Text>
        ) : null}
        {/* Display notes if they exist */}
        {item.notes ? (
          <Text style={styles.reservationNotes}>{item.notes}</Text>
        ) : null}
      </View>
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

  const handleEdit = (item) => {
      navigation.navigate('EditReservation', { reservation: item });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://nl-app.onrender.com/reservations/${id}`);
      setReservations(reservations.filter((reservation) => reservation._id !== id));
      Alert.alert('Success', 'Reservation deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Could not delete the reservation');
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://nl-app.onrender.com/reservations');
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
        onPress={() => navigation.navigate('AddReservation')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  reservationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reservationInfo: {
    flex: 1,
    marginRight: 10,
  },
  reservationText: {
    fontSize: 18,
    color: '#333',
  },
  reservationNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    color: '#007bff',
    fontWeight: '500',
    marginRight: 10,
  },
  deleteButton: {
    color: '#dc3545',
    fontWeight: '500',
  },
  reservationPhone: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom:0,
    backgroundColor: '#e27b00', },});

export default NieuweReservering;