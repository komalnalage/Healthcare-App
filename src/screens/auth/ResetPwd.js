import { useTheme } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import CustomBtn from "../components/CustomBtn";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import Header from "../components/Header";
import CustomInput from "../components/CustomInput";
import PwdUpdated from "../modals/PwdUpdated";
import {
  reset_Password,
  therapist_reset_Password,
} from "../../api/Services/services";
import AppUtils from "../../utils/appUtils";
import Loader from "../modals/Loader";
import { setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { widthPercentageToDP } from "react-native-responsive-screen";

function ResetPwd({ navigation, route }) {
  const type = route?.params?.type;
  const dispatch = useDispatch();
  let langCode = useSelector((state) => state.userData.languageCode);
  const _id = route?.params?._id;
  const { colors, images } = useTheme();
  const loader = useSelector((state) => state.userNewData.loader);
  const { localization } = useContext(LocalizationContext);
  const [isSecure, setIsSecure] = useState(true);
  const [isSecure1, setIsSecure1] = useState(true);
  const [popup, showPopup] = useState(false);
  const [password, setpassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");

  const [characterlength, setcharaterlength] = useState(false);
  const [capitalletter, setcapitalletter] = useState(false);
  const [smallletter, setsmallletter] = useState(false);
  const [number, setnumber] = useState(false);
  const [specialcharater, setspecialcharater] = useState(false);

  const lowerCaseReg = /(?=.*[a-z])/;
  const upperCaseReg = /(?=.*[A-Z])/;
  const specialReg = /(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/;
  const numReg = /((?=.*[0-9]))/;

  async function checkvalidation(t) {
    if (t.length == 0) {
      setcapitalletter(false);
      setsmallletter(false);
      setnumber(false);
      setspecialcharater(false);
      setcharaterlength(false);
    }

    if (upperCaseReg.test(t)) {
      setcapitalletter(true);
    }
    if (!upperCaseReg.test(t)) {
      setcapitalletter(false);
    }
    if (lowerCaseReg.test(t)) {
      setsmallletter(true);
    }
    if (!lowerCaseReg.test(t)) {
      setsmallletter(false);
    }
    if (numReg.test(t)) {
      setnumber(true);
    }
    if (!numReg.test(t)) {
      setnumber(false);
    }
    if (specialReg.test(t)) {
      setspecialcharater(true);
    }
    if (!specialReg.test(t)) {
      setspecialcharater(false);
    }
    if (t.length >= 8) {
      setcharaterlength(true);
    }
    if (t.length < 8) {
      setcharaterlength(false);
    }

    setconfirmPass(t);
  }


  const resetPassword = async () => {
    dispatch(setloader(true));
    let res = null;
    res = await reset_Password(_id, password);
    if (res?.data?.status) {
      dispatch(setloader(false));
      setTimeout(() => {
        showPopup(true);
      }, 500);
      AppUtils.showToast(res?.data?.message);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  const therapistresetPassword = async () => {
    dispatch(setloader(true));

    let res = null;
    res = await therapist_reset_Password(_id, password, langCode);
    if (res?.data?.status) {
      dispatch(setloader(false));
      setTimeout(() => {
        showPopup(true);
      }, 500);
      AppUtils.showToast(res?.data?.message);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  return (
    <SolidView
      view={
        <View style={{ flex: 1 }}>
          {loader && <Loader />}
          <Header
            title={localization.appkeys.newPwd}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
          <KeyboardAwareScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={style.mainView}>
              <View style={{ paddingHorizontal: 20 }}>
                <Text style={[style.createPwdTxt, { color: colors.text }]}>
                  {localization.appkeys.createPwd}
                </Text>
                <CustomInput
                  value={password}
                  onChangeText={setpassword}
                  title={localization.appkeys.password}
                  rightImg={isSecure ? images.eyeoff : images.eye}
                  isSecure={isSecure}
                  onEyePress={() => {
                    setIsSecure(!isSecure);
                  }}
                />
                <CustomInput
                  value={confirmPass}
                  // onChangeText={setconfirmPass}
                  onChangeText={(t) => checkvalidation(t)}
                  title={localization.appkeys.cnfrmpassword}
                  rightImg={isSecure1 ? images.eyeoff : images.eye}
                  isSecure={isSecure1}
                  onEyePress={() => {
                    setIsSecure1(!isSecure1);
                  }}
                />

<View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: widthPercentageToDP(90),
                    marginTop: 10,
                    marginLeft: 5,
                  }}
                >
                  <Image
                    source={characterlength ? images.checked : images.check}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: characterlength ? "green" : "red",
                    }}
                  />
                  <Text
                    maxFontSizeMultiplier={1.7}
                    style={{
                      fontFamily: AppFonts.Medium,
                      marginLeft: 5,
                      fontSize: 12,
                      color: colors.text,
                    }}
                  >
                    {localization?.appkeys?.Passwordlength}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: widthPercentageToDP(90),
                    marginTop: 10,
                    marginLeft: 5,
                  }}
                >
                  <Image
                    source={capitalletter ? images.checked : images.check}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: capitalletter ? "green" : "red",
                    }}
                  />
                  <Text
                    maxFontSizeMultiplier={1.7}
                    style={{
                      fontFamily: AppFonts.Medium,
                      marginLeft: 5,
                      fontSize: 12,
                      color: colors.text,
                    }}
                  >
                    {localization?.appkeys?.Passworduppercase}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: widthPercentageToDP(90),
                    marginTop: 10,
                    marginLeft: 5,
                  }}
                >
                  <Image
                    source={smallletter ? images.checked : images.check}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: smallletter ?"green" : "red",
                    }}
                  />
                  <Text
                    maxFontSizeMultiplier={1.7}
                    style={{
                      fontFamily: AppFonts.Medium,
                      marginLeft: 5,
                      fontSize: 12,
                      color: colors.text,
                      width:"90%"
                    }}
                  >
                    {localization?.appkeys?.Passwordlowercase}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: widthPercentageToDP(90),
                    marginTop: 10,
                    marginLeft: 5,
                  }}
                >
                  <Image
                    source={number ? images.checked : images.check}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: number ? "green" : "red",
                    }}
                  />
                  <Text
                    maxFontSizeMultiplier={1.7}
                    style={{
                      fontFamily: AppFonts.Medium,
                      marginLeft: 5,
                      fontSize: 12,
                      color: colors.text,
                    }}
                  >
                    {localization?.appkeys?.Passwordnumber}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: widthPercentageToDP(90),
                    marginTop: 10,
                    marginLeft: 5,
                  }}
                >
                  <Image
                    source={specialcharater ? images.checked : images.check}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: specialcharater ?"green" : "red",
                    }}
                  />
                  <Text
                    maxFontSizeMultiplier={1.7}
                    style={{
                      fontFamily: AppFonts.Medium,
                      marginLeft: 5,
                      fontSize: 12,
                      color: colors.text,
                    }}
                  >
                    {localization?.appkeys?.Passwordcharacter}
                  </Text>
                </View>

              </View>

             


              <CustomBtn
                btnStyle={{ marginBottom: 40, marginTop: 60 }}
                onPress={() => {
                  if (password) {
                    if (password.length >= 6) {
                      if (confirmPass) {
                        if (password == confirmPass) {
                          if (
                            characterlength &&
                            capitalletter &&
                            smallletter &&
                            number &&
                            specialcharater
                          ) {
                            type ? resetPassword() : therapistresetPassword();
                          } else {
                            // Show error message indicating validation criteria not met
                            AppUtils.showToast(
                              "Please ensure password meets all criteria"
                            );
                          }
                          // type ? resetPassword() : therapistresetPassword();
                        } else {
                          AppUtils.showToast("Password is not matching!!");
                        }
                      } else {
                        AppUtils.showToast("Please enter confirm password!!");
                      }
                    } else {
                      AppUtils.showToast(
                        "Password must be atleast 8 characters!!"
                      );
                    }
                  } else {
                    AppUtils.showToast("Please enter Password!!");
                  }
                }}
                titleTxt={localization.appkeys.confirm}
              />
            </View>
          </KeyboardAwareScrollView>
          <PwdUpdated
            isVisible={popup}
            onBackDropPress={() => {
              showPopup(false);
            }}
            title={localization?.appkeys?.login}
            onLogin={() => {
              showPopup(false);
              navigation.navigate(
                route?.params?.from == "EditProfile"
                  ? AppRoutes.EditProfile
                  : route?.params?.from == "TherapistEditProfile"
                  ? AppRoutes.TherapistEditProfile
                  : AppRoutes.Login
              );
            }}
          />
        </View>
      }
    />
  );
}

const style = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  createPwdTxt: {
    fontFamily: AppFonts.Medium,
    fontSize: 15.5,
    alignSelf: "center",
    marginBottom: 8,
    marginTop: 20,
    textAlign: "center",
    marginHorizontal: 30,
  },
});
export default ResetPwd;
