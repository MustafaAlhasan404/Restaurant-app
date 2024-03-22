import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  badgeNumber,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import OrdersToDo from "../Components/OrdersToDo";
import FloatingButton from "../Components/FloatingButton";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Home = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook to check if the screen is focused
  const [reservations, setReservations] = useState([]);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const fetchLowStockProducts = useCallback(async () => {
    try {
      const response = await axios.get("http://208.109.231.135/products"); // Replace with your actual API endpoint
      const lowStock = response.data.filter(
        (product) => product.stockable && product.qty < 10
      );
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchLowStockProducts();
    }
  }, [isFocused, fetchLowStockProducts]);

  const fetchReservations = useCallback(async () => {
    try {
      const response = await axios.get("http://208.109.231.135/reservations");
      const today = new Date();
      let todaysReservations = response.data.filter((reservation) => {
        const reservationDate = new Date(reservation.dateTime);
        return reservationDate.toDateString() === today.toDateString();
      });

      // Sort todaysReservations by dateTime from closest to furthest
      todaysReservations = todaysReservations.sort((a, b) => {
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);
        return dateA - dateB; // Ascending order
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
    setSelectedReservationId(
      selectedReservationId === reservationId ? null : reservationId
    );
  };

  // The return statement begins, indicating the start of the JSX that will be rendered by this component.
  return (
    // A View component is used as the root container for the Home screen.
    <View style={styles.container}>
      <StatusBar backgroundColor="#311213" barStyle="light-content" />

      <SafeAreaView style={{ backgroundColor: "#311213" }}>
        <Header name="Home" />
      </SafeAreaView>
      <View style={styles.maincontent}>
        {lowStockProducts.length > 0 && (
          <View>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <MaterialIcons
                color="#e27b00"
                size={24}
                name="warning"
                style={{ marginTop: -2 }}
              />
              <Text style={styles.contentheader}>Voorraad bijna op:</Text>
            </View>
            <View style={styles.lowStockContainer}>
              {lowStockProducts.map((product) => (
                <View key={product._id} style={styles.lowStockItem}>
                  <Text style={styles.lowStockText}>{product.name}</Text>
                  <Text style={styles.lowStockText}>
                    Huidige voorraad: {product.qty}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <OrdersToDo />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 40,
            marginBottom: 10,
          }}
        >
          <View style={styles.badgenumber}>
            <Text style={styles.badgenumbertext}>{reservations.length}</Text>
          </View>
          <Text style={styles.contentheader}>Reserveringen vandaag:</Text>
        </View>
        <ScrollView style={styles.reservationsList}>
          {reservations.map((reservation) => (
            // TouchableOpacity component allows each reservation item to be tappable and perform an action when pressed.
            <TouchableOpacity
              key={reservation._id} // Unique key for each item, required for items in a list.
              onPress={() => toggleDropdown(reservation._id)} // Function to handle press action.
              style={styles.reservationItem} // Styling for the reservation item.
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "left",
                  flex: 0,
                }}
              >
                {new Date(reservation.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false, // Add this option to use 24-hour format
                })}
              </Text>
              {selectedReservationId === reservation._id && (
                <View style={styles.dropdown}>
                  <Text>Naam: {reservation.name}</Text>
                  <Text>Telefoonnummer: {reservation.phone}</Text>
                  <Text>Gasten: {reservation.numGuests}</Text>
                  <Text>Notities: {reservation.notes}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FloatingButton />
    </View>
    // The return statement ends here, and the JSX is compiled into elements that React Native understands and can render on the screen.
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
    paddingVertical: 10,
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
    justifyContent: "center", // Center the text vertically
    borderRadius: 40,
  },
  badgenumbertext: {
    color: "white",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  reservationItem: {
    width: "100%", // Set a fixed width
    height: "auto", // Set a fixed height
    justifyContent: "center", // Center content vertically
    padding: 13,
    backgroundColor: "#fff",
    marginTop: 5,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // ... other styles you may have
  lowStockContainer: {
    marginTop: 15,
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  lowStockHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#e27b00",
  },
  lowStockItem: {
    paddingVertical: 5,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lowStockText: {
    fontSize: 14,
    fontWeight: "400",
  },
});
