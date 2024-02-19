import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AccordionItem = ({ item, index, details }) => {
  const [isOpened, setIsOpened] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  const toggleAccordion = () => {
    setIsOpened(!isOpened);
  };

  const heightAnimationInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 270],
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpened ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [isOpened]);

  return (
    <View>
      <TouchableWithoutFeedback onPress={toggleAccordion} style={styles.acco}>
        <View style={styles.header}>
          <Text style={styles.title}>Tafel: {item.table}</Text>
          <Text style={styles.orderdate}>Geplaatst: 13-2 om 13:30u</Text>
          <MaterialIcons
            color="gray"
            size={22}
            name={isOpened ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            style={{ marginTop: 0 }}
          />
        </View>
      </TouchableWithoutFeedback>
      <Animated.View
        style={[styles.content, { height: heightAnimationInterpolation }]}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text style={styles.orderdetails}>
            Tafel:
            <Text style={styles.orderdetailstxt}> {item.table}</Text>
          </Text>
          <Text style={styles.orderdetails}>
            Totaalbedrag:{" "}
            <Text style={styles.orderdetailstxt}>€{item.total}</Text>
          </Text>
          <Text style={styles.orderdetails}>
            Producten:{" "}
            <Text style={styles.orderdetailstxt}>{item.products}</Text>
          </Text>
          <Text style={styles.orderdetails}>
            Notitie: <Text style={styles.orderdetailstxt}>{item.notes}</Text>
          </Text>
          <Text style={styles.orderdetails}>
            Betalen:{" "}
            <Text style={styles.orderdetailstxt}>{item.paymentmethod}</Text>
          </Text>
          <Text style={styles.orderdetails}>
            Betaald? <Text style={styles.orderdetailstxt}>{item.paid}</Text>
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const OrdersToDo = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          {
            table: "1",
            total: "99.22",
            products:
              "1x Loempia // 2x Cola // 1x Loempia // 1x Loempia // 1x Loempia // 1x Loempia",
            paymentmethod: "Contant",
            paid: "Nee",
            notes: "extra peper",
          },
          {
            table: "2",
            total: "11.22",
            products:
              "9x Loempia // 2x Cola // 1x Loempia // 1x Nasi // 1x Loempia // 97x Bara met kip // 39x Ajam pangang",
            paymentmethod: "Contant",
            paid: "Nee",
            notes: "extra peper",
          },
          { table: "3" },
          { table: "4" },
          { table: "5" },
          { table: "6" },
        ]}
        renderItem={({ item, index }) => (
          <AccordionItem item={item} index={index} />
        )}
        keyExtractor={(item) => item.table}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 22,
  },
  acco: {},
  item: {
    padding: 10,
    fontSize: 13,
    height: 44,
    backgroundColor: "white",
    marginBottom: 10,
    lineHeight: 22,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#e27b00",
  },
  header: {
    backgroundColor: "white",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#e27b00",
  },

  content: {
    marginTop: 8,
    overflow: "hidden",
  },
  orderdetails: {
    //flex: 1,
    fontWeight: "600",
    marginBottom: 10,
  },
  orderdetailstxt: {
    fontWeight: "300",
  },
  orderdate: {
    fontStyle: "italic",
    fontSize: 13,
    marginRight: 8,
  },
  title: {
    marginRight: "auto",
  },
});

export default OrdersToDo;
