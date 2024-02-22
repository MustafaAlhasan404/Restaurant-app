import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const AddReservation = ({ navigation }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [numGuests, setNumGuests] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // Hide picker after selection
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(false); // Hide picker after selection
    setTime(currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const handleSubmit = async () => {
    if (!name || !time || !numGuests) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Construct the dateTime from the date and time inputs
    const dateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    dateTime.setHours(parseInt(hours, 10));
    dateTime.setMinutes(parseInt(minutes, 10));

    try {
      const response = await axios.post('https://nl-app.onrender.com/reservations', {
        name,
        dateTime,
        numGuests: parseInt(numGuests, 10),
        notes, // Include the notes in the API request
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Reservation added successfully');
        navigation.goBack(); // Or navigate to another screen if necessary
      } else {
        Alert.alert('Error', 'Failed to add reservation');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not submit the reservation');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter guest name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of Guests:</Text>
        <TextInput
          style={styles.input}
          value={numGuests}
          onChangeText={setNumGuests}
          placeholder="Enter number of guests"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display={Platform.OS === 'android' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time:</Text>
        <TouchableOpacity onPress={showTimepicker} style={styles.input}>
          <Text style={styles.input}>{time}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            testID="timePicker"
            value={date}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'android' ? 'spinner' : 'default'}
            onChange={onChangeTime}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter any notes"
          multiline
          numberOfLines={4} // Adjust the number of lines as needed
        />
      </View>

      <Button title="Submit Reservation" onPress={handleSubmit} />
    </ScrollView>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
      },
      inputContainer: {
        marginBottom: 20,
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 16,
        borderRadius: 6,
      },
      dateInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 6,
        justifyContent: 'center',
      },
      dateText: {
        fontSize: 16,
      },
      // Add any additional styles you may need here
    });
    
    export default AddReservation;
    