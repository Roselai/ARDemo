import React from "react";
import { Text, TouchableOpacity } from "react-native";

const Button = ({ onPress, children, disabled, style }) => {
  const { textStyle } = styles;
  return (
    <TouchableOpacity onPress={onPress} style={style} disabled={disabled}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: "center",
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    paddingTop: 10,
    paddingBottom: 10
  }
};

export { Button };
