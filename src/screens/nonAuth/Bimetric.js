import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import CustomBtn from "../components/CustomBtn";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import { wp } from "../../utils/dimension";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SetinitialRouteName,
  setVerificationEnabled,
} from "../../redux/Reducers/userData";
import Loader from "../modals/Loader";
import { setloader } from "../../redux/Reducers/UserNewData";
import firestore from "@react-native-firebase/firestore";

function Bimetric({ navigation }) {
  const userData = useSelector((state) => state.userData.userData);
  const { colors, images } = useTheme();
  const [loading, setLoading] = useState(false);
  const loader = useSelector((state) => state.userNewData.loader);
  console.log("userData90909090", userData);
  const user = useSelector((state) => state.userData.user);
  const { localization } = useContext(LocalizationContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setloader(false));
  }, []);

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const navigateToNext = () => {
    dispatch(setVerificationEnabled(true));
    AsyncStorage.setItem("IsBiometric", "true");
    firestore().collection("users").doc(userData?._id).set({
      onlineStatus: "Online",
      id: userData?._id,
    });
    console.log("OKAKY")

    if (user?.type == "user") {
      navigation.navigate(AppRoutes.SelectCategories);
      dispatch(SetinitialRouteName(AppRoutes.SelectCategories));
    } else {
      navigation.navigate(AppRoutes.Home);
      dispatch(SetinitialRouteName(AppRoutes.Home));
    }
  };

  const onpressSkip = () => {
    dispatch(setVerificationEnabled(false));
    AsyncStorage.setItem("IsBiometric", "skip");
    firestore().collection("users").doc(userData?._id).set({
      onlineStatus: "Online",
      id: userData?._id,
    });
    if (user?.type == "user") {
      navigation.replace(AppRoutes.SelectCategories);
      dispatch(SetinitialRouteName(AppRoutes.SelectCategories));
    } else {
      navigation.navigate(AppRoutes.Home);
      dispatch(SetinitialRouteName(AppRoutes.Home));
    }
  };

  async function androidbiomatric() {
    console.log("TEST");
    rnBiometrics.isSensorAvailable().then((resultObject) => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === BiometryTypes.Biometrics) {
        rnBiometrics
          .simplePrompt({ promptMessage: "Confirm fingerprint" })
          .then((resultObject) => {
            const { success } = resultObject;
            if (resultObject.success) {
              AsyncStorage.setItem("IsBiometric","true");
              navigateToNext();
            }
          })
          .catch(() => {
            AsyncStorage.setItem("IsBiometric","false");
            console.log("biometrics failed");
          });
        console.log("TouchID is supported");
      } else if (available && biometryType === BiometryTypes.FaceID) {
        console.log("FaceID is supported");
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        console.log("Biometrics is supported");
      } else {
        console.log("Biometrics not supported");
      }
    });
  }
  async function iosbiomatric() {
    rnBiometrics
      .isSensorAvailable()
      .then((resultObject) => {
        const { available, biometryType } = resultObject;

        if (
          (available && biometryType === BiometryTypes.TouchID) ||
          (available && biometryType === BiometryTypes.FaceID)
        ) {
          rnBiometrics
            .simplePrompt({ promptMessage: "Confirm fingerprint" })
            .then((resultObject) => {
              const { success } = resultObject;

              if (success) {
                navigateToNext();
                rnBiometrics.createKeys().then((resultObject) => {
                  const { publicKey } = resultObject;
                  console.log(publicKey);
                  // sendPublicKeyToServer(publicKey)
                });
                console.log("successful biometrics provided", success);
              } else {
                console.log("user cancelled biometric prompt");
              }
            })
            .catch(() => {
              // BackHandler.exitApp();
              console.log("biometrics failed");
            });
          console.log("TouchID is supported");
        } else if (available && biometryType === BiometryTypes.FaceID) {
          console.log("FaceID is supported");
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          console.log("Biometrics is supported");
        } else {
        }
      })
      .catch(() => {});
  }

  return (
    <SolidView
      view={
        <View style={style.topView}>
          {/* {loader && <Loader/>} */}
          <Image source={images.darkLogo} style={style.img} />
          <Text
            style={[
              style.titleText,
              {
                color: colors.text,
                fontFamily: AppFonts.SemiBold,
                marginTop: 20,
              },
            ]}
          >
            {localization?.appkeys?.Usebiometric}
          </Text>
          <View style={{ width: wp(90) }}>
            <Text
              style={[
                style.titleText,
                {
                  color: colors.text,
                  fontSize: 16,
                  fontFamily: AppFonts.Medium,
                },
              ]}
            >
              {localization?.appkeys?.Usebiometriclogin}
            </Text>
          </View>
          <CustomBtn
            onPress={() => {
              console.log("PRESSSS");
              if (Platform.OS == "android") {
                androidbiomatric();
              } else {
                iosbiomatric();
              }
            }}
            btnStyle={{ marginTop: 60 }}
            titleTxt={localization?.appkeys?.enablebiometric}
          />
          <CustomBtn
            onPress={() => {
              onpressSkip();
            }}
            btnStyle={{ backgroundColor: colors.locationdiscription }}
            titleTxt={localization?.appkeys?.skipfornow}
          />
        </View>
      }
    />
  );
}

const style = StyleSheet.create({
  topView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 2,
    fontFamily: AppFonts.Medium,
  },
  img: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    alignSelf: "center",
  },
  scanImg: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 40,
  },
});
export default Bimetric;
