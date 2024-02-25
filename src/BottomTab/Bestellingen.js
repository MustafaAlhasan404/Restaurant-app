import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../Components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../contexts/UserContext'; // Import useUser hook

const Bestellingen = () => {
  const { user } = useUser(); // Use the useUser hook to access the user object

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#311213' }}>
        <Header name="Bestellingen" />
      </SafeAreaView>

      <View style={styles.maincontent}>
        {/* Display the user's name if available */}
        <Text>Welcome, {user ? user.Name : 'Guest'}!</Text>
      </View>
    </View>
  );
};

export default Bestellingen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0d5d6',
  },
  maincontent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
