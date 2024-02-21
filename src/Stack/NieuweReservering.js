import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TouchableNativeFeedback  
} from "react-native";
import { FAB } from 'react-native-paper'; // Import FAB

const reservations = [ 
  { id: '1', name: 'John Doe', date: '2024-02-21', time: '18:00' },
  { id: '2', name: 'Jane Smith', date: '2024-02-22', time: '12:30' },
  // ...more reservations
];

const ReservationItem = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.reservationItem}>
      <Text style={styles.reservationText}>
        {item.name} - {item.date} {item.time}
      </Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  ); 
};

const NieuweReservering = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={({ item }) => (
          <ReservationItem item={item} onEdit={() => alert('Edit')} onDelete={() => alert('Delete')} />
        )}
        keyExtractor={(item) => item.id}
      />

      <FAB 
        style={styles.fab}
        icon="plus"
        onPress={() => alert('Add Reservation')} // Replace with your add action
      /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  reservationItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservationText: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
  // No changes needed for addButton styles 
  addButton: {
    backgroundColor: '#f0f0f0', 
    padding: 15,
    borderRadius: 5,
  },
  addButtonText: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20, 
    right: 20, 
    backgroundColor: '#e27b00',
  },
});

export default NieuweReservering;