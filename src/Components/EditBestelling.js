import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditBestelling = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Order</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up all available space
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#fff', // Optional background color
  },
  text: {
    fontSize: 24, // Set font size
    fontWeight: 'bold', // Make the text bold
  },
});

export default EditBestelling;
