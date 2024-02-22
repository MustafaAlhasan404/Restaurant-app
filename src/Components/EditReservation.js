















//ddddddddddddddddosent worrrrrrrrrrrrrrrk
















// src/Components/EditReservation.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const EditReservation = ({ route, navigation }) => {
  const { reservation } = route.params;

  // Set up local state for form fields using reservation data
  const [name, setName] = useState(reservation.name);
  const [phone, setPhone] = useState(reservation.phone);
  const [dateTime, setDateTime] = useState(reservation.dateTime);
  const [numGuests, setNumGuests] = useState(reservation.numGuests.toString());
  const [notes, setNotes] = useState(reservation.notes || '');

  const handleSave = async () => {
    try {
      // Replace with your API endpoint to update a reservation
      const response = await axios.put(`https://nl-app.onrender.com/reservations/${reservation._id}`, {
        name,
        phone,
        dateTime,
        numGuests: parseInt(numGuests, 10),
        notes,
      });
      Alert.alert('Success', 'Reservation updated successfully');
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      Alert.alert('Error', 'Failed to update reservation');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Reservation</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={dateTime}
        onChangeText={setDateTime}
        placeholder="Date and Time"
      />
      <TextInput
        style={styles.input}
        value={numGuests}
        onChangeText={setNumGuests}
        placeholder="Number of Guests"
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        multiline
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
});

export default EditReservation;
