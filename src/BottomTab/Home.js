import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import OrdersToDo from "../Components/OrdersToDo";
import FloatingButton from "../Components/FloatingButton";
import axios from "axios";

const Home = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook to check if the screen is focused
  const [reservations, setReservations] = useState([]);
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      const response = await axios.get('https://nl-app.onrender.com/reservations');
      const today = new Date();
      const todaysReservations = response.data.filter(reservation => {
        const reservationDate = new Date(reservation.dateTime);
        return reservationDate.toDateString() === today.toDateString();
      });
      setReservations(todaysReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchReservations();
    }
  }, [isFocused, fetchReservations]);

  const toggleDropdown = (reservationId) => {
    setSelectedReservationId(selectedReservationId === reservationId ? null : reservationId);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#311213" barStyle="light-content" />
      <SafeAreaView style={{ backgroundColor: "#311213" }}>
        <Header name="Home" />
      </SafeAreaView>

      <View style={styles.maincontent}>
        <OrdersToDo />

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 40 }}>
          <View style={styles.badgenumber}>
            <Text style={styles.badgenumbertext}>{reservations.length}</Text>
          </View>
          <Text style={styles.contentheader}>Reserveringen vandaag:</Text>
        </View>

        {reservations.map((reservation) => (
          <TouchableOpacity key={reservation._id} onPress={() => toggleDropdown(reservation._id)}>
            <Text style={styles.reservationItem}>
              {new Date(reservation.dateTime).toLocaleTimeString()} - {reservation.name}
            </Text>
            {selectedReservationId === reservation._id && (
              <View style={styles.dropdown}>
                <Text>Phone: {reservation.phone}</Text>
                <Text>Number of Guests: {reservation.numGuests}</Text>
                <Text>Notes: {reservation.notes}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <FloatingButton />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6",
  },
  maincontent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentheader: {
    fontWeight: "bold",
    color: "black",
    fontSize: 14,
    marginLeft: 5, // Adjusted for alignment
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
  reservationItem: {
    width: 300, // Set a fixed width
    height: 40, // Set a fixed height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    overflow: 'hidden',
    borderRadius: 10,
    textAlign: 'center',
    alignSelf: 'center',
  },
  dropdown: {
    width: 300,
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 5, // Optional: if you want rounded corners
  },
  // ... other styles you may have
});
