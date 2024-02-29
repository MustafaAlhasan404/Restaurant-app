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

const Home = () => {
	const navigation = useNavigation();
	const isFocused = useIsFocused(); // Hook to check if the screen is focused
	const [reservations, setReservations] = useState([]);
	const [selectedReservationId, setSelectedReservationId] = useState(null);

const fetchReservations = useCallback(async () => {
  try {
    const response = await axios.get(
      "https://nl-app.onrender.com/reservations"
    );
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

	return (
		// The top-level View component acts as a container for the entire Home screen.
		<View style={styles.container}>
		
		  {/* StatusBar component to control the appearance of the status bar */}
		  <StatusBar backgroundColor="#311213" barStyle="light-content" />
		  
		  {/* SafeAreaView component to ensure that the content is displayed within the safe area boundaries of the device */}
		  <SafeAreaView style={{ backgroundColor: "#311213" }}>
			{/* Header component to display the name of the current screen */}
			<Header name="Home" />
		  </SafeAreaView>
		  
		  {/* Main content View that contains the rest of the Home screen's content */}
		  <View style={styles.maincontent}>
		  
			{/* OrdersToDo component, which contains the list of orders */}
			<OrdersToDo />
			
			{/* View component to contain the reservations section */}
			<View style={{ flexDirection: "row", alignItems: "center", marginTop: 40 }}>
			  {/* View component to display a badge with the number of today's reservations */}
			  <View style={styles.badgenumber}>
				{/* Text component to display the number of reservations */}
				<Text style={styles.badgenumbertext}>{reservations.length}</Text>
			  </View>
			  {/* Text component to serve as a header for the reservations section */}
			  <Text style={styles.contentheader}>Reserveringen vandaag:</Text>
			</View>
			
			{/* Mapping through the reservations array to display each reservation */}
			{reservations.map((reservation) => (
			  // TouchableOpacity component to allow each reservation item to be tappable
			  <TouchableOpacity
				key={reservation._id} // Unique key for each item
				onPress={() => toggleDropdown(reservation._id)} // Function to handle press action
			  >
				{/* Text component to display reservation time and name */}
				<Text style={styles.reservationItem}>
				  {new Date(reservation.dateTime).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				  })}{" "}
				  - {reservation.name}
				</Text>
				{/* Conditional rendering to display additional reservation details if selected */}
				{selectedReservationId === reservation._id && (
				  <View style={styles.dropdown}>
					{/* Text components to display reservation details */}
					<Text>Phone: {reservation.phone}</Text>
					<Text>Number of Guests: {reservation.numGuests}</Text>
					<Text>Notes: {reservation.notes}</Text>
				  </View>
				)}
			  </TouchableOpacity>
			))}
		  </View>
		  
		  {/* FloatingButton component, likely a button fixed over the screen for primary actions */}
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
		width: 300, // Set a fixed width
		height: 40, // Set a fixed height
		justifyContent: "center", // Center content vertically
		alignItems: "center", // Center content horizontally
		padding: 10,
		backgroundColor: "#fff",
		marginTop: 5,
		overflow: "hidden",
		borderRadius: 10,
		textAlign: "center",
		alignSelf: "center",
	},
	dropdown: {
		width: 300,
		marginTop: 10,
		alignSelf: "center",
		backgroundColor: "#f9f9f9",
		padding: 10,
		textAlign: "center",
		alignItems: "center",
		borderRadius: 5, // Optional: if you want rounded corners
	},
	// ... other styles you may have
});
