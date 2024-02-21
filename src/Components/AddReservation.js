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
  const [numGuests, setNumGuests] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(Platform.OS === 'ios');
    setDate(currentTime);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const handleSubmit = async () => {
    if (!name || !numGuests) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('https://your-api-endpoint.com/reservations', {
        name,
        date: date.toISOString(),
        numGuests: parseInt(numGuests, 10),
        // Include any other fields that your API expects
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
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time:</Text>
        <TouchableOpacity onPress={showTimepicker} style={styles.dateInput}>
          <Text style={styles.dateText}>{date.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            testID="timePicker"
            value={date}
            mode="time"
            display="spinner" // This will show the scroll wheel on Android
            is24Hour={true} // Use 24-hour format, set to false for AM/PM
            onChange={onChangeTime}
          />
        )}
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
});
export default AddReservation;
