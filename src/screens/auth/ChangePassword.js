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
  change_Therapist_password,
  change_user_password,
} from "../../api/Services/services";
import AppUtils from "../../utils/appUtils";
import Loader from "../modals/Loader";
import { setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { widthPercentageToDP } from "react-native-responsive-screen";

function ChangePassword({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userData.token);
  const user = useSelector((state) => state.userData.user);
  const _id = route?.params?._id;
  const { colors, images } = useTheme();
  const loader = useSelector((state) => state.userNewData.loader);

  const { localization } = useContext(LocalizationContext);
  const [isSecure, setIsSecure] = useState(true);
  const [isSecure1, setIsSecure1] = useState(true);
  const [popup, showPopup] = useState(false);
  const [old_password, setold_password] = useState("");
  const [new_password, setnew_password] = useState("");

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

    setnew_password(t);
  }

  const isStrongPassword = (password) => {
    // Password validation criteria (you can adjust these as needed)
    const hasNumber = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      password
    );
    const isLongEnough = password.length >= 8;

    return (
      hasNumber &&
      hasLowercase &&
      hasUppercase &&
      hasSpecialChar &&
      isLongEnough
    );
  };

  const changeUserPass = async () => {
    // if (!isStrongPassword(new_password)) {
    //   dispatch(setloader(false));
    //   AppUtils.showToast("Please enter a strong password");
    //   return;
    // }
    dispatch(setloader(true));

    let res = null;
    res = await change_user_password(old_password, new_password, token);
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

  const changeTherapistPassword = async () => {
    dispatch(setloader(true));

    let res = null;
    res = await change_Therapist_password(old_password, new_password, token);
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
            title={localization.appkeys.changenew}
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
                  value={old_password}
                  onChangeText={setold_password}
                  title={localization?.appkeys?.oldpassword}
                  rightImg={isSecure ? images.eyeoff : images.eye}
                  isSecure={isSecure}
                  onEyePress={() => {
                    setIsSecure(!isSecure);
                  }}
                />
                <CustomInput
                  value={new_password}
                  onChangeText={(t) => checkvalidation(t)}
                  // onChangeText={setnew_password}
                  title={localization?.appkeys?.newpassword}
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
                btnStyle={{
                  marginTop: 80,
                  marginBottom: 40,
                }}
                // btnStyle={{ marginBottom: 40 }}
                onPress={() => {
                  if (old_password) {
                    if (new_password) {
                      if (
                        characterlength &&
                        capitalletter &&
                        smallletter &&
                        number &&
                        specialcharater
                      ) {
                        user?.type == "user"
                          ? changeUserPass()
                          : changeTherapistPassword();
                      } else {
                        // Show error message indicating validation criteria not met
                        AppUtils.showToast(
                          "Please ensure password meets all criteria"
                        );
                      }
                    } else {
                      AppUtils.showToast("Please Enter Your New Password");
                    }
                  } else {
                    AppUtils.showToast("Please Enter Your Old Password");
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
            title={localization?.appkeys?.backto}
            onLogin={() => {
              showPopup(false);
              navigation.navigate(
                user.type == "user"
                  ? AppRoutes.EditProfile
                  : AppRoutes.TherapistEditProfile
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
export default ChangePassword;
