import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

const EditReservation = ({ route, navigation }) => {
  const reservation = route.params?.reservation;

  if (!reservation) {
    Alert.alert("Error", "No reservation data provided.");
    navigation.goBack();
    return null;
  }

  const [name, setName] = useState(reservation.name);
  const [phone, setPhone] = useState(reservation.phone);
  const [date, setDate] = useState(new Date(reservation.dateTime));
  const [time, setTime] = useState(
    new Date(reservation.dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
  const [numGuests, setNumGuests] = useState(reservation.numGuests.toString());
  const [notes, setNotes] = useState(reservation.notes);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(
      currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const handleSave = async () => {
    console.log("Save button pressed");
    try {
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(":");
      dateTime.setHours(parseInt(hours, 10));
      dateTime.setMinutes(parseInt(minutes, 10));

      const updatedReservation = {
        name,
        phone,
        dateTime,
        numGuests: parseInt(numGuests, 10),
        notes,
      };

      console.log("Attempting to save:", updatedReservation);

      const response = await axios.patch(
        `http://208.109.231.135/reservations/${reservation._id}`,
        updatedReservation
      );

      console.log("Save successful:", response.data);
      Alert.alert("Success", "Reservation updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save changes:", error);
      Alert.alert("Error", "Could not update the reservation");
    }
  };
  // Render the form with the state variables and handleSave function
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screendescription}>
        Bewerk hier een bestaande reservering.
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.formlabel}>Naam:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.formlabel}>Gasten:</Text>
        <TextInput
          style={styles.input}
          value={numGuests}
          onChangeText={setNumGuests}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.formlabel}>Notities:</Text>
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.formlabel}>Telefoonnummer:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.formlabel}>Datum:</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display={Platform.OS === "android" ? "spinner" : "default"}
            onChange={onChangeDate}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.formlabel}>Tijdstip:</Text>
        <TouchableOpacity onPress={showTimepicker} style={styles.dateInput}>
          <Text style={styles.dateText}>{time}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            testID="timePicker"
            value={new Date()}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "android" ? "spinner" : "default"}
            onChange={onChangeTime}
          />
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Reservering toevoegen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#e0d5d6",
    paddingTop: 30,
  },
  formlabel: { fontWeight: "700", fontSize: 14, marginBottom: 7 },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 14,
    color: "#333",
  },
  dateInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#e27b00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 50,
  },
  screendescription: {
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  // Add any additional styles you may need here
});

export default EditReservation;
