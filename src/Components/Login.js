// src/Components/Login.js
import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Alert,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { useUser } from "../contexts/UserContext"; // Import useUser hook

const Login = ({ navigation }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { setUser } = useUser(); // Use the useUser hook to access setUser

	const handleLogin = () => {
		setLoading(true);
		const loginUrl = "https://nl-app.onrender.com/users/login";

		fetch(loginUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Login failed");
					setLoading(false);
				}
				return response.json();
			})
			.then((data) => {
				// Assuming the response contains the user object on successful login
				console.log("Login successful:", data.user);
				setLoading(false);
				setUser(data.user); // Set the user globally using the context
				navigation.navigate("Main"); // Navigate to the main screen or dashboard after login
			})
			.catch((error) => {
				console.error("Error:", error);
				Alert.alert("Login Error", "Invalid username or password.");
				setLoading(false);
			});
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Username"
				value={username}
				onChangeText={setUsername}
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				autoCapitalize="none"
				secureTextEntry
			/>
			<TouchableOpacity
				disabled={loading}
				// style={styles.button}
				style={[styles.button, loading && styles.buttonLoading ]}
				onPress={handleLogin}
			>
				{!loading && <Text style={styles.buttonText}>Login</Text>}
				{/* {loading && <Text style={styles.buttonText}>Logging in</Text>} */}
				{loading && <ActivityIndicator size="small" color="#000000" />}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e0d5d6",
		paddingHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	input: {
		width: "100%",
		marginVertical: 10,
		padding: 15,
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 5,
		backgroundColor: "white",
	},
	button: {
		backgroundColor: "#e27b00",
		padding: 15,
		width: "100%",
		borderRadius: 5,
		alignItems: "center",
		marginTop: 20,
	},
	buttonLoading: {
		backgroundColor: "#e27b00",
	},
	buttonText: {
		color: "white",
		fontWeight: "600",
	},
	signupPrompt: {
		marginTop: 20,
		fontSize: 16,
	},
	signupLink: {
		color: "#e27b00",
		fontWeight: "bold",
	},
});

export default Login;
