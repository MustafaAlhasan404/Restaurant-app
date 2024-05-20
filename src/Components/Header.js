import { View, Text } from "react-native";
import React from "react";

const Header = (props) => {
  return (
    <View
      style={{
        margin: 0,
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: "100%",
        backgroundColor: "#311213",
      }}
    >
      <Text
        style={{
          fontWeight: 600,
          fontSize: 20,
          alignSelf: "flex-start",
          color: "#e27b00",
        }}
      >
        {props.name}
      </Text>
    </View>
  );
};

export default Header;
