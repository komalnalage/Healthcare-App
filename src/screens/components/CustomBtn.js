import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";

export default function CustomBtn({
  btnStyle,
  txtStyle,
  titleTxt,
  onPress,
  isLoading,
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[style.btn, { backgroundColor: colors.btnColor },btnStyle]}
    >
      {isLoading && <ActivityIndicator />}
      {!isLoading && (
        <Text style={[style.btntxt, { color: colors.signupText }, txtStyle]}>
          {titleTxt}
        </Text>
      )}
    </Pressable>
  );
}
const style = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,height:56
  },
  btntxt: {
    fontSize: 16,
    color: "white",
  },
});
