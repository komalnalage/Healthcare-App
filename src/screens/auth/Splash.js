import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground
} from "react-native";
import { useTheme } from "@react-navigation/native";

function Splash({ navigation }) {
  const { colors, images } = useTheme();

  return (
    <View style={[style.parent, { backgroundColor: colors.locationdiscription }]}>
      <ImageBackground style={style.parent} source={images.transBg}>
        <Image source={images.logo} style={style.image} />
      </ImageBackground>
    </View>
  );
}
const style = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: "53%",
    resizeMode: "contain",
    alignSelf: "center",
  },
});
export default Splash;
