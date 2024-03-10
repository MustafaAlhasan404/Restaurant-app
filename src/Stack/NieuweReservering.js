import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FAB } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../contexts/UserContext"; // Import useUser hook
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const ReservationItem = ({ item, onEdit, onDelete, canEdit }) => {
  // Function to format the date and time
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(dateTimeString).toLocaleDateString("nl", options);
  };

  return (
    <View style={styles.reservationItem}>
      <View style={styles.reservationInfo}>
        <Text style={styles.reservationText}>
          Datum: {formatDateTime(item.dateTime)} uur
        </Text>
        <Text>Naam: {item.name}</Text>
        <Text>Aantal gasten: {item.numGuests}</Text>
        {/* Display phone number if it exists */}
        {item.phone ? (
          <Text style={styles.reservationPhone}>
            Telefoonnummer: {item.phone}
          </Text>
        ) : null}
        {/* Display notes if they exist */}
        {item.notes ? (
          <Text style={styles.reservationNotes}>Notities: {item.notes}</Text>
        ) : null}
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={() => onEdit(item)}
          style={styles.editButton}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item._id)}
          style={styles.deleteButton}
        >
          <MaterialCommunityIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NieuweReservering = () => {
  const [reservations, setReservations] = useState([]);
  const navigation = useNavigation();
  const { user } = useUser(); // Use the useUser hook to access the user object

  const handleEdit = (item) => {
    navigation.navigate("EditReservation", { reservation: item });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://nl-app.onrender.com/reservations/${id}`);
      setReservations(
        reservations.filter((reservation) => reservation._id !== id)
      );
      Alert.alert("Voltooid", "Reservering verwijderd.");
    } catch (error) {
      Alert.alert("Fout", "Kan reservering niet verwijderen.");
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        "http://nl-app.onrender.com/reservations"
      );
      const sortedReservations = response.data.sort((a, b) => {
        // Convert dateTime strings to Date objects
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

        // Check if dates are in the past, present, or future
        const isPastA = dateA < today;
        const isPastB = dateB < today;
        const isTodayA = dateA.toDateString() === today.toDateString();
        const isTodayB = dateB.toDateString() === today.toDateString();

        // Today's reservations come first
        if (isTodayA && !isTodayB) return -1;
        if (!isTodayA && isTodayB) return 1;

        // Future reservations come next, sorted by closest date first
        if (!isPastA && !isPastB) return dateA - dateB;

        // Past reservations come last, sorted by most recent first
        if (isPastA && isPastB) return dateB - dateA;

        // If one is past and the other is future, the future one comes first
        return isPastA ? 1 : -1;
      });
      setReservations(sortedReservations);
    } catch (error) {
      Alert.alert("Error", "Could not fetch reservations");
    }
  };

  useEffect(() => {
    fetchReservations();

    // Add a focus listener
    const unsubscribe = navigation.addListener("focus", fetchReservations);

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // Determine if the user can edit or delete reservations
  const canEdit = user && user.role === "manager";

  return (
    <View style={styles.container}>
      <Text style={styles.screendescription}>
        Bekijk hier alle geplaatste reserveringen. Klik op de "+" rechtsonderin
        om een nieuwe reservering te plaatsen.
      </Text>

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
        color="white"
        onPress={() => navigation.navigate("AddReservation")}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d5d6", // Changed to match Bestellingen.js
    padding: 20, // Existing padding from NieuweReservering.js
    paddingTop: 30,
  },
  reservationItem: {
    backgroundColor: "#fff",
    borderRadius: 10, // Rounded corners like orderItem in Bestellingen.js
    marginBottom: 10, // Spacing between items like orderItem in Bestellingen.js
    padding: 15, // Padding like orderItem in Bestellingen.js
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000", // Shadow like orderItem in Bestellingen.js
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Elevation like orderItem in Bestellingen.js
  },
  reservationInfo: {
    flex: 1,
    marginRight: 10, // Keep existing marginRight
  },
  reservationText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "bold", // Bold like orderId in Bestellingen.js
  },
  reservationNotes: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: "column",
    alignItems: "center",
  },
  editButton: {
    padding: 10,
    backgroundColor: "#e27b00",
    borderRadius: 5, // Increased rounded corners
    color: "#fff",
    fontWeight: "500",
    marginRight: 0,
    marginBottom: 10,
  },
  screendescription: {
    marginBottom: 40,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#dc3545",
    borderRadius: 5, // Increased rounded corners
    color: "#fff",
    fontWeight: "500",
  },
  reservationPhone: {
    fontSize: 14,
    color: "#333",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#e27b00",
    borderRadius: 100,
    padding: 7,
  },
  buttonText: {
    color: "#fff", // Set text color to white
    fontWeight: "500",
  },
});

export default NieuweReservering;
