import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Button,
	StyleSheet,
	Pressable,
	useWindowDimensions,
	TextInput,
	TouchableNativeFeedback,
	ScrollView,
	Modal,
	FlatList,
	Alert,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MenuItem from "./MenuItem";
import AddedItem from "./AddedItem";
import { useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem } from "../State/orderSlice";
import { emptyOrder } from "../State/orderSlice";
import { useNavigation } from "@react-navigation/native";

const renderTabBar = (props) => (
	<TabBar
		renderLabel={({ route, focused }) => (
			<Text
				style={{
					fontWeight: 400,
					color: focused ? "black" : "grey",
				}}
			>
				{route.title}
			</Text>
		)}
		{...props}
		indicatorStyle={{
			backgroundColor: "black",
		}}
		getLabelText={({ route }) => route.title}
		style={{
			marginTop: 0,
			backgroundColor: "white",
			elevation: 0,
			borderBottomWidth: 1,
			height: "auto",
		}}
	/>
);

const FirstRoute = () => {
	const [menuItems, setMenuItems] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://nl-app.onrender.com/products/categories/food"
				);
				const data = await response.json();
				// Filter out items with qty 0 or less
				const filteredData = data.filter((item) => item.qty > 0);
				setMenuItems(filteredData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				paddingTop: 0,
				paddingHorizontal: 0,
				height: 500,
			}}
		>
			<ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
				{menuItems.map((menuItem, index) => {
					return <MenuItem key={index} menuItem={menuItem} />;
				})}
			</ScrollView>
		</View>
	);
};

const SecondRoute = () => {
	const [menuItems, setMenuItems] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://nl-app.onrender.com/products/categories/drink"
				);
				const data = await response.json();
				// Filter out items with qty 0 or less
				const filteredData = data.filter((item) => item.qty > 0);
				setMenuItems(filteredData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				paddingTop: 0,
				paddingHorizontal: 0,
				height: 500,
			}}
		>
			<ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
				{menuItems.map((menuItem, index) => {
					return <MenuItem key={index} menuItem={menuItem} />;
				})}
			</ScrollView>
		</View>
	);
};

const ThirdRoute = () => {
	const [menuItems, setMenuItems] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://nl-app.onrender.com/products/categories/snack"
				);
				const data = await response.json();
				// Filter out items with qty 0 or less
				const filteredData = data.filter((item) => item.qty > 0);
				setMenuItems(filteredData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				paddingTop: 0,
				paddingHorizontal: 0,
				height: 500,
			}}
		>
			<ScrollView style={styles.menuItems} nestedScrollEnabled={true}>
				{menuItems.map((menuItem, index) => {
					return <MenuItem key={index} menuItem={menuItem} />;
				})}
			</ScrollView>
		</View>
	);
};

export function TabViewExample() {
	const layout = useWindowDimensions();

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: "first", title: "Gerechten" },
		{ key: "second", title: "Dranken" },
		{ key: "third", title: "Hapjes" },
	]);

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
		third: ThirdRoute,
	});

	return (
		<View style={styles.container}>
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				renderTabBar={renderTabBar}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
				style={styles.tabs}
			/>
		</View>
	);
}

const EditBestelling = () => {
	const [order, setOrder] = useState({});

	const route = useRoute();
	const orderId = route.params.order;

	// useEffect(() => {

	// 	const getProductDetails = async (productId) => {
	// 		const response = await fetch(
	// 			`https://nl-app.onrender.com/products/${productID}`
	// 		);
	// 		const data = await response.json();
	// 		return data;
	// 	};

	// 	const dispatch = useDispatch();

	// 	// Add order product details to redux
	// 	order.products.forEach((product) => {
	// 		const productDetails = getProductDetails(product.product);

	// 		const totalPrice = productDetails.price;
	// 		// for (let i = 0; i < product.selectedOptions.length; i++) {
	// 		// 	price += product.selectedOptions[i].price;
	// 		// }

	// 		product.dispatch(
	// 			addItem({
	// 				product: product.product,
	// 				selectedOptions: product.selectedOptions,
	// 				price: totalPrice,
	// 			})
	// 		);
	// 	});
	// }, []);

	const [table, setTable] = useState("");
	const [selectedProducts, setSelectedProducts] = useState([]);
	// const price = useSelector((state) => state.order.price);
	const price = 0;
	const [totalPrice, setTotalPrice] = useState(price);

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const response = await fetch(
					`https://nl-app.onrender.com/orders/${orderId}`
				);
				const data = await response.json();
				setOrder(data);
				setTable(data.table.toString());
				setSelectedProducts(data.products);
				setTotalPrice(data.totalPrice);
				console.log(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchOrder();
	}, []);

	const navigation = useNavigation();

	// // Sync local state with Redux on change
	// useEffect(() => {
	// 	setSelectedProducts(order.items);
	// 	setTotalPrice(price);
	// }, [order, price]);

	const dispatch = useDispatch();
	const handleSubmit = async (table, products) => {
		// Check if no products are selected
		if (products.length === 0) {
			Alert.alert(
				"Error",
				"Please select at least one product to place an order."
			);
			return; // Exit the function early if no products are selected
		}

		console.log("Submitting order...");
		const deleteResponse = await fetch(
			`https://nl-app.onrender.com/orders/${orderId}`,
			{
				method: "DELETE",
			}
		);

		const response = await fetch(`https://nl-app.onrender.com/orders`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				table: table,
				products: products,
			}),
		});
		const data = await response.json();
		console.log(data);
		if (response.status === 201) {
			console.log("Order Updated successfully!");
			dispatch(emptyOrder());
			Alert.alert("Success", "Order Updated successfully");
		}
		navigation.navigate("Home");
	};

	return (
		<ScrollView>
			<View style={styles.page}>
				<Text style={styles.label}>Table:</Text>
				<TextInput
					style={styles.input}
					placeholder={
						order.table ? order.table.toString() : "Table Number"
					}
					value={table}
					onChangeText={setTable}
					keyboardType="numeric"
				/>

				<View style={{ height: 600 }}>
					<Text style={styles.label}>Kies product(en):</Text>
					<TabViewExample />
				</View>

				<View style={styles.orderSummary}>
					<View>
						<View style={styles.spaceBetweenRow}>
							<Text style={styles.menuItemName}>
								Order Summary
							</Text>
							<Text style={styles.menuItemPrice}>
								{order.products && order.products.length} Items
							</Text>
						</View>

						{order.products &&
							order.products.map((item, index) => (
								<View key={index}>
									<AddedItem
										productID={item.product}
										selectedOptions={item.selectedOptions}
									/>
								</View>
							))}

						<View style={styles.spaceBetweenRow}>
							<Text style={styles.menuItemName}>Total</Text>
							<Text style={styles.menuItemPrice}>
								€{totalPrice.toFixed(2)}
							</Text>
						</View>
					</View>

					<Pressable
						style={styles.savebutton}
						onPress={() => handleSubmit(table, selectedProducts)}
					>
						<Text style={styles.buttontext}>Place order</Text>
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);

	// return (
	// 	<View style={styles.page}>
	// 		<Text>Table: {order.table}</Text>
	// 		<Text>{JSON.stringify(order)}</Text>
	// 	</View>
	// );
};

export default EditBestelling;

const styles = StyleSheet.create({
	savebutton: {
		backgroundColor: "#e27b00",
		padding: 15,
		position: "relative",
		borderRadius: 3,
		//top: 870,
		elevation: 0,
		zIndex: -10,
		width: "100%",
		marginTop: 30,
	},
	buttontext: {
		color: "white",
		textAlign: "center",
		fontWeight: "500",
		fontSize: 15,
	},
	select: {
		borderWidth: 1,
		borderColor: "#000", // Change border color
		borderRadius: 10, // Add border radius for rounded corners
		backgroundColor: "#f0f0f0", // Change background color
		marginBottom: 25,
		height: 50, // Adjust height as needed
		justifyContent: "center", // Center the picker content
	},

	checkbox: {
		width: 20,
		height: 20,
		marginRight: 10,
		borderWidth: 1,
		borderColor: "#000",
		justifyContent: "center",
		alignItems: "center",
	},

	selectt: {
		//width: 200,
		height: 65,
		// backgroundColor: "green",
	},
	selectoption: {},
	label: {
		marginBottom: 7,
		fontWeight: "600",
	},
	textinput: {
		borderWidth: 1,
		backgroundColor: "white",
		marginBottom: 0,
		height: 58,
		padding: 15,
	},
	addeditems: {
		paddingVertical: 10,
	},
	container: {
		flex: 1,
		backgroundColor: "white",
		height: 1000,
	},
	maincontent: {
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	tabs: {
		paddingVertical: 0,
		textTransform: "",
		borderWidth: 1,
	},
	menuItems: {},
	menuItem: {
		flexDirection: "column",
		paddingHorizontal: 15,
		paddingVertical: 17,
		borderBottomWidth: 1,
		borderBottomColor: "#bababa",
		backgroundColor: "#f9f9f9", // Example background color for menu items
	},
	menuItemGroup: {
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center", // Align items in the center vertically
	},
	menuItemTitle: {
		fontWeight: "bold",
		fontSize: 16,
		color: "#333", // Darker text color for the title
	},
	menuItemName: {
		fontSize: 18,
		fontWeight: "bold",
	},
	menuItemIngredients: {
		fontSize: 12,
		color: "#666",
	},
	menuItemPrice: {
		color: "#e27b00",
		fontWeight: "bold",
		fontSize: 18,
	},

	menuItemOption: {
		flexDirection: "row",
		alignItems: "center", // Align items in the center vertically
		justifyContent: "space-between",
		paddingVertical: 5, // Add padding inside the option container
		paddingHorizontal: 20, // Add padding inside the option container
		borderRadius: 5, // Rounded corners for option items
	},

	menuItemOptionLabel: {
		display: "flex",
		flexDirection: "row",
	},

	menuItemOptionName: {
		fontSize: 14,
		color: "#555", // Text color for option name
	},

	menuItemOptionPrice: {
		fontSize: 14,
		color: "#555", // Text color for option price
		fontWeight: "bold", // Make the option price bold
	},
	buybutton: {
		//borderWidth: 1,
		borderColor: "grey",
		padding: 10,
		position: "relative",
		top: 5,
		borderRadius: 3,
		backgroundColor: "#e27b00",
	},
	submitbutton: {
		//borderWidth: 1,
		borderColor: "grey",
		padding: 15,
		margin: 15,
		position: "absolute",
		borderRadius: 3,
		backgroundColor: "#e27b00",
		justifyContent: "center",
		alignItems: "center",
		bottom: 10, //Here is the trick
		width: "100%",
	},
	centeredView: {
		flex: 1,
		//justifyContent: "center",
		//alignItems: "center",
		position: "relative",
		top: 70,
	},
	modalView: {
		width: "90%",
		height: "60%",
		position: "relative",
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 15,
		//alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	backbutton: { flexDirection: "row", marginBottom: 50 },
	backbuttontext: {
		fontSize: 15,
	},
	menuItemOptionQuantity: {
		fontSize: 14,
		color: "#555", // Text color for option quantity
		fontWeight: "bold", // Make the option quantity bold
		marginLeft: 10, // Add some space between the price and quantity
	},
	spaceBetweenRow: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	menuItemHeader: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	MenuItemOptions: {
		paddingVertical: 10,
	},
	menuItemFooter: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 10,
	},
	addButton: {
		paddingVertical: 5,
		paddingHorizontal: 15,
		borderRadius: 3,
		backgroundColor: "#e27b00",
		justifyContent: "center",
		alignItems: "center",
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
	orderSummary: {
		backgroundColor: "white",
		padding: 15,
		marginVertical: 10,
	},
	page: {
		padding: 20,
	},
	spaceBetweenRow: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
