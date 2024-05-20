import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Button, Alert } from "react-native";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

const Receipt = ({ route }) => {
  const { order } = route.params;
  const viewShotRef = useRef(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // State to store the current date and time

  const saveReceipt = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photo library to save the receipt."
        );
        return;
      }

      const uri = await viewShotRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Receipts", asset, false);
      Alert.alert("Success", "Receipt saved to your photo library.");
    } catch (error) {
      Alert.alert(
        "Error",
        `An error occurred while saving the receipt: ${error.message}`
      );
    }
  };

  useEffect(() => {
    setCurrentDateTime(new Date()); // Update the date and time when the component mounts
  }, []);

  const productMap = {};
  order.products.forEach((product) => {
    if (productMap[product.name]) {
      productMap[product.name].quantity += 1;
      productMap[product.name].subtotal += product.price;
    } else {
      productMap[product.name] = {
        price: product.price,
        quantity: 1,
        subtotal: product.price,
      };
    }
  });

  return (
    <View style={styles.container}>
      <Button
        style={styles.savebutton}
        title="Save Receipt"
        onPress={saveReceipt}
      />
      <ViewShot
        ref={viewShotRef}
        style={styles.viewShot}
        options={{ format: "jpg", quality: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.top}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 40,
              }}
            >
              <Image
                source={require("../../assets/AceLogo.png")}
                style={styles.logo}
              />
              <View>
                <Text style={styles.h2}>Ace Lounge Paramaribo</Text>
                <Text style={styles.adres}>
                  Anamoestraat 3 | Paramaribo | 020-2839723
                </Text>
              </View>
            </View>

            <View style={styles.space}></View>

            <View style={styles.headerRow}>
              <Text style={[styles.header, styles.itemHeader]}>Product</Text>
              <Text style={[styles.header, styles.qtyHeader]}>Qty</Text>
              <Text style={[styles.header, styles.subtotalHeader]}>
                Subtotal
              </Text>
            </View>
          </View>

          <View style={styles.bot}>
            {Object.keys(productMap).map((key) => (
              <View style={styles.tableRow} key={key}>
                <Text style={[styles.itemText, styles.itemData]}>{key}</Text>
                <Text style={[styles.itemText, styles.qtyData]}>
                  {productMap[key].quantity}
                </Text>
                <Text
                  style={[styles.itemText, styles.subtotalData]}
                >{`SRD ${productMap[key].subtotal.toFixed(2)}`}</Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.total}>Total</Text>
              <Text
                style={[styles.total, styles.totalAmount]}
              >{`SRD ${order.totalPrice.toFixed(2)}`}</Text>
            </View>
            <Text style={styles.date}>{currentDateTime.toLocaleString()}</Text>
            <Text style={styles.legal}>
              Thanks for visiting us. Scan below QR code and leave us a review!
            </Text>
            <Image
              source={require("../../assets/qrace.png")}
              style={styles.qrcode}
            />
          </View>
        </View>
      </ViewShot>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    padding: 0,
    width: "100%",
    height: "800",
  },
  viewShot: {
    padding: 0, // Add padding around the entire ViewShot
  },
  content: {
    backgroundColor: "#fff",
    padding: 0, // Add additional padding inside the content
  },
  top: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  logo: {
    height: 55,
    width: 55,
    marginBottom: 10,
    marginTop: 10,
  },
  h2: {
    fontSize: 27,
    fontWeight: "bold",
    marginLeft: 12,
    marginBottom: 2,
    marginTop: 0,
  },
  adres: {
    marginLeft: 12,
    textAlign: "center",
    fontSize: 15,
  },
  space: {
    height: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemHeader: {
    flex: 3,
    textAlign: "left",
    fontSize: 16,
  },
  qtyHeader: {
    flex: 1,
    textAlign: "center",
  },
  subtotalHeader: {
    flex: 2,
    textAlign: "right",
  },
  savebutton: {
    position: "absolute",
    zIndex: 100,
  },
  bot: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
  },
  itemData: {
    flex: 3,
    textAlign: "left",
  },
  qtyData: {
    flex: 1,
    textAlign: "center",
  },
  subtotalData: {
    flex: 2,
    textAlign: "right",
  },
  date: {
    marginTop: 70,
    fontSize: 16,
    // textAlign: 'center',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  qrcode: {
    marginTop: 20,
    marginBottom: 50,
  },
  legal: {
    fontSize: 16,
    marginTop: 50,
    marginBottom: 15,
  },
});

export default Receipt;
