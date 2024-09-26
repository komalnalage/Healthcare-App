import { useTheme } from "@react-navigation/native";
import React from "react";
import {  StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SolidView({ viewStyle, isLoading,view }) {
  const { colors } = useTheme();
  return (
    <View
      style={[style.parent, { backgroundColor: colors.background }, viewStyle]}>
      <SafeAreaView  style={{ flex: 1 }}>
        {view}
      </SafeAreaView>
    </View>
  );
}
const style = StyleSheet.create({
  parent: {
    flex: 1,
  },
});
