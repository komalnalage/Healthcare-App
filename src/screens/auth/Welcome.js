import { useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { LocalizationContext } from "../../localization/localization";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import CustomBtn from "../components/CustomBtn";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";

function Welcome({ navigation }) {
  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);
  return (
    <SolidView
      view={
        <View style={{ flex: 1 }}>
          <Image
            source={images.topBrain} style={style.topImg} />
          <Image source={images.darkLogo} style={style.img} />
          <Text
            style={[style.titleText, { color: colors.text, fontFamily: AppFonts.SemiBold, marginTop: 20 }]}
          >
            {localization.appkeys.welcome}
          </Text>
          <Text
            style={[style.titleText, { color: colors.text, fontSize: 16, fontFamily: AppFonts.Medium }]}
          >
            {localization.appkeys.readyToFix}
          </Text>
          <Image source={images.bottomBrain} style={style.bottomBrainImg} />
          <CustomBtn
            onPress={() => {
              navigation.navigate(AppRoutes.Login);
            }}
            btnStyle={{ marginTop: 20 }}
            titleTxt={localization.appkeys.login}
          />
          <CustomBtn
            onPress={() => {
              navigation.navigate(AppRoutes.SignUp);
            }}
            btnStyle={{ backgroundColor: colors.locationdiscription }}
            titleTxt={localization.appkeys.signup}
          />
        </View>
      }
    />
  );
}

const style = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBrainImg: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    resizeMode: 'contain',
    height: '25%'
  },
  topImg: {
    width: '100%',
    top: 0,
    resizeMode: 'contain',
    height: '25%',
  },
  titleText: {
    fontSize: 24,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 25, marginTop: 2,
    fontFamily: AppFonts.Medium
  },
  img: {
    width: 160, height: 160, resizeMode: 'contain', alignSelf: 'center'
  },
  dropdown: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 4, width: '92%', alignSelf: 'center'
  },
  iconStyle: {
    marginRight: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#202020",
    fontFamily: AppFonts.Medium,
  }, containerStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: 'grey'
  },
  flag: {
    height: 30,
    width: 30,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 20,
    resizeMode: 'contain'
  },
  arrow: {
    width: 14, height: 14, resizeMode: 'contain', marginRight: 8
  }
});
export default Welcome;
