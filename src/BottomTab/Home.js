import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import OrdersToDo from "../Components/OrdersToDo";
import FloatingButton from "../Components/FloatingButton";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Home = () => {
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
      // Updated to use the new /today endpoint
      const response = await axios.get("http://208.109.231.135/reservations/today");
      setReservations(response.data);
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

  return (
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
        <ScrollView  style={{height: '34%'}}>
        {reservations.map((reservation) => {
              // Simplify the dateTime display without specifying a time zone
              const [datePart, timePart] = reservation.dateTime.split('T');
              const dateTimeDisplay = `${datePart} ${timePart.substring(0, 5)}`; // Assuming you want to cut off seconds and timezone info

              return (
                <TouchableOpacity
                  key={reservation._id}
                  onPress={() => toggleDropdown(reservation._id)}
                  style={styles.reservationItem}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "left",
                      flex: 1,
                    }}
                  >
                    {dateTimeDisplay} uur
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
              );
            })}
        </ScrollView>
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
    justifyContent: "center", // Center content vertically
    padding: 13,
    backgroundColor: "#fff",
    marginTop: 5,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    alignSelf: "center",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdown: {
    marginTop: 5,
  },
  lowStockContainer: {
    marginTop: 15,
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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