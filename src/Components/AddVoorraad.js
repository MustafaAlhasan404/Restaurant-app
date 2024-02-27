import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddVoorraad = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ADD voorraad !</Text>
    </View>
  );
};

export default AddVoorraad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // You can change the background color if you want
  },
  text: {
    fontSize: 24, // You can adjust the font size if you want
    fontWeight: 'bold',
    // Any other styling you want to apply to the text
  },
});
