import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Alert,
} from "react-native";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

const Bestellingen = () => {
	const { user } = useUser();
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await axios.get(
					"https://nl-app.onrender.com/orders"
				);

				// Map products to new array with details
				const ordersWithDetails = await Promise.all(
					response.data.map(async (order) => {
						order.products = await Promise.all(
							order.products.map(async (product) => {
								const productDetails = await axios.get(
									`https://nl-app.onrender.com/products/${product.product}`
								);

								return {
									...product,
									name: productDetails.data.name,
									price: productDetails.data.price,
								};
							})
						);

						return order;
					})
				);

				setOrders(ordersWithDetails);
			} catch (error) {
				console.error("Error fetching orders", error);
			}
		};

		fetchOrders();
	}, []);

	const changeOrderStatus = async (orderId, newStatus) => {
		try {
			let patchUrl = `https://nl-app.onrender.com/orders/${orderId}/${newStatus}`;

			const response = await axios.patch(patchUrl);
			setOrders(
				orders.map((order) =>
					order._id === orderId
						? { ...order, status: newStatus }
						: order
				)
			);
		} catch (error) {
			console.error("Error updating order status:", error);
		}
	};

	const showStatusOptions = (orderId, currentStatus) => {
		Alert.alert(
			"Change Order Status",
			"Select the new status for the order:",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Mark as Processed",
					onPress: () => {
						if (currentStatus === "processed") {
							Alert.alert(
								"Status Update",
								"This order is already processed."
							);
						} else {
							changeOrderStatus(orderId, "processed");
						}
					},
				},
				{
					text: "Mark as Paid",
					onPress: () => {
						if (user && user.isManager) {
							// Check if the user is a manager
							changeOrderStatus(orderId, "paid");
						} else {
							Alert.alert(
								"Permission Denied",
								"No manager privilege."
							);
						}
					},
				},
			],
			{ cancelable: true }
		);
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<Header name="Bestellingen" />
			</SafeAreaView>

			<View style={styles.mainContent}>
				{/* <Text style={styles.welcomeText}>
					Welcome, {user ? user.Name : "Guest"}!
				</Text> */}

				<FlatList
					data={orders}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => (
						<View style={styles.orderItem}>
							<View style={styles.centerSingleItem}>
								<Text style={styles.orderId}>
									Table {item.table}
								</Text>
							</View>
							<View style={styles.spaceBetweenRow}>
								<Text style={styles.orderDetail}>
									{new Date(item.orderDate).toDateString() ===
									new Date().toDateString()
										? new Date(
												item.orderDate
										  ).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
										  })
										: new Date(
												item.orderDate
										  ).toLocaleDateString("en-US", {
												year: "numeric",
												month: "2-digit",
												day: "2-digit",
										  })}
								</Text>
								<Text style={styles.orderDetail}>
									{item.status.toUpperCase()}
								</Text>
							</View>
							<View style={styles.productCards}>
								{console.log(item.products)}
								{item.products.map((product, index) => (
									<View
										key={index}
										style={styles.productItem}
									>
										<View style={styles.spaceBetweenRow}>
											<Text style={styles.productDetail}>
												{index + 1}.{" " + product.name}
											</Text>
											<Text style={styles.productDetail}>
												${product.price}
											</Text>
										</View>
										<Text style={styles.productDetail}>
											{product.selectedOptions
												.map((option) => option.name)
												.join(", ")}
										</Text>
									</View>
								))}
							</View>
							<View style={styles.spaceBetweenRow}>
								<TouchableOpacity
									style={styles.statusButton}
									onPress={() =>
										showStatusOptions(item._id, item.status)
									}
								>
									<Icon
										name="pencil"
										size={20}
										color="#000"
									/>
								</TouchableOpacity>
								<Text style={styles.price}>
									${item.totalPrice.toFixed(2)}
								</Text>
							</View>
						</View>
					)}
				/>
			</View>
		</View>
	);
};

export default Bestellingen;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e0d5d6",
	},
	safeArea: {
		backgroundColor: "#311213",
	},
	mainContent: {
		flex: 1,
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	welcomeText: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 20,
	},
	orderItem: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	orderId: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 5,
	},
	orderDetail: {
		fontSize: 14,
		marginBottom: 5,
		fontWeight: "bold",
	},
	productItem: {
		marginTop: 10,
		padding: 10,
		backgroundColor: "#f2f2f2",
		borderRadius: 5,
	},
	productDetail: {
		fontSize: 13,
	},
	statusButton: {
		padding: 10,
		// marginTop: 10,
		backgroundColor: "#e7e7e7",
		borderRadius: 5,
		alignSelf: "flex-start", // Align button to the start of the flex container
		flexDirection: "row", // Align icon and text in a row
		alignItems: "center", // Center items vertically
		justifyContent: "center", // Center items horizontally
	},
	spaceBetweenRow: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	price: {
		fontSize: 24,
		fontWeight: "bold",
	},
	centerSingleItem: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	productCards: {
		marginVertical: 10,
	},
});
