import { useTheme } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import CustomBtn from "../components/CustomBtn";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import Header from "../components/Header";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { hp, wp } from "../../utils/dimension";
import {
  SetinitialRouteName,
  setAuth,
  setNavigateFrom,
  setlastLoginDetails,
  settoken,
  setuserData,
} from "../../redux/Reducers/userData";
import Loader from "../modals/Loader";
import {
  resendOtp,
  therapistresendOtp,
  therapistverifyOtp,
  verifyOtp,
} from "../../api/Services/services";
import AppUtils from "../../utils/appUtils";
import firestore from "@react-native-firebase/firestore";
import { setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function Verification({ navigation, route }) {
  const dispatch = useDispatch();
  const type = route?.params?.type;
  const user = useSelector((state) => state.userData.user);
  let langCode = useSelector((state) => state.userData.languageCode);
  const from = route?.params?.from;
  const email = route?.params?.email;
  const { colors, images } = useTheme();
  const loader = useSelector((state) => state.userNewData.loader);
  const [otp, setotp] = useState("");
  const { localization } = useContext(LocalizationContext);
  const isVerificationEnabled = useSelector(
    (state) => state.userData.verificationEnabled
  );

  const verify_Otp = async () => {
    if (otp) {
      dispatch(setloader(true));
      let res = null;
      res = await verifyOtp(email, otp, langCode);
      console.log("verifyOtp res",res?.data);
      if (res?.data?.status) {
        dispatch(setloader(false));

        firestore().collection("users").doc(res?.data?.data?._id).set({
          onlineStatus: "Online",
          id: res?.data?.data?._id,
        });
        AppUtils.showToast(res?.data?.message);
        dispatch(SetinitialRouteName(AppRoutes.Bimetric));
        dispatch(setuserData(res?.data?.data));
        dispatch(settoken(res?.data?.other?.token));
        dispatch(setNavigateFrom(from));
        dispatch(setAuth(true));
        dispatch(setloader(false));
        dispatch(
          setlastLoginDetails({
            email: email.trim().toLowerCase(),
            pass: route?.params?.password,
            type: route?.params?.type ? "user" : "therapist",
          })
        );

        setTimeout(() => {
          if (isVerificationEnabled) {
            navigation.navigate(AppRoutes.DrawerStack, {
              screen: AppRoutes.NonAuthStack,
              params: { screen: AppRoutes.SelectCategories },
            });
          } else {
            navigation.navigate(AppRoutes.DrawerStack, {
              screen: AppRoutes.NonAuthStack,
              params: { screen: AppRoutes.Bimetric },
            });
          }
        }, 500);
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(res?.data?.message);
      }
    } else {
      AppUtils.showToast("Please enter OTP!!");
    }
  };

  const resend_Otp = async () => {
    setotp();
    dispatch(setloader(true));
    let res = null;
    res = await resendOtp(email);
    if (res?.data?.status) {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  const handleForgotPass = async () => {
    if (otp) {
      dispatch(setloader(true));
      let res = null;
      res = await verifyOtp(email, otp, langCode);
      if (res?.data?.status) {
        dispatch(setloader(false));
        setTimeout(() => {
          navigation.replace(AppRoutes.ResetPwd, {
            from,
            _id: res?.data?.data?._id,
            type,
          });
        }, 500);
        AppUtils.showToast(res?.data?.message);
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(res?.data?.message);
      }
    } else {
      AppUtils.showToast("Please enter OTP!!");
    }
  };

  const therapist_verify_Otp = async () => {
    if (otp) {
      dispatch(setloader(true));
      let res = null;
      res = await therapistverifyOtp(email, otp, langCode);
      if (res?.data?.status) {
        dispatch(setloader(false));

        AppUtils.showToast(res?.data?.message);
        firestore().collection("users").doc(res?.data?.data?._id).set({
          onlineStatus: "Online",
          id: res?.data?.data?._id,
        });
        dispatch(SetinitialRouteName(AppRoutes.Bimetric));
        dispatch(setuserData(res?.data?.data));
        dispatch(settoken(res?.data?.other?.token));
        dispatch(setAuth(true));
        dispatch(
          setlastLoginDetails({
            email: email.trim().toLowerCase(),
            pass: route?.params?.password,
            type: route?.params?.type ? "user" : "therapist",
          })
        );
        setTimeout(() => {
          if (isVerificationEnabled) {
            navigation.navigate(AppRoutes.DrawerStack, {
              screen: AppRoutes.NonAuthStack,
            });
          } else {
            navigation.navigate(AppRoutes.DrawerStack, {
              screen: AppRoutes.NonAuthStack,
              params: { screen: AppRoutes.Bimetric },
            });
          }
        }, 500);
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(res?.data?.message);
      }
    } else {
      AppUtils.showToast("Please enter OTP!!");
    }
  };

  const handleTherapistResendOtp = async () => {
    setotp();
    dispatch(setloader(true));
    let res = null;
    res = await therapistresendOtp(email, langCode);
    if (res?.data?.status) {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  const handleTherapistForgot = async () => {
    if (otp) {
      dispatch(setloader(true));
      let res = null;
      res = await therapistverifyOtp(email, otp, langCode);
      if (res?.data?.status) {
        dispatch(setloader(false));
        setTimeout(() => {
          navigation.navigate(AppRoutes.ResetPwd, {
            from,
            _id: res?.data?.data?._id,
            type,
          });
        }, 500);
        AppUtils.showToast(res?.data?.message);
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(res?.data?.message);
      }
    } else {
      AppUtils.showToast("Please enter OTP!!");
    }
  };
  return (
    <SolidView
      view={
        <View style={{ flex: 1 }}>
          {loader && <Loader />}
          <Header
            title={localization.appkeys.verification}
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
                <Text style={[style.we_sentTxt, { color: colors.text }]}>
                  {localization.appkeys.we_sent}
                </Text>

                <View style={style.otpTopView}>
                  <Text style={[style.enterOtpTxt, { color: colors.text }]}>
                    {localization.appkeys.enterOtp}
                  </Text>
                  <View>
                    <OTPInputView
                      style={style.otpInputStyle}
                      pinCount={4}
                      onCodeChanged={(i) => setotp(i)}
                      autoFocusOnLoad={false}
                      onCodeFilled={(code) => {
                        setotp(code);
                      }}
                      code={otp}
                      codeInputFieldStyle={style.underlineStyleBase}
                      keyboardType="number-pad"
                      editable={true}
                    />
                  </View>
                  <Pressable
                    onPress={() => {
                      if (type) {
                        resend_Otp();
                      } else {
                        handleTherapistResendOtp();
                      }
                    }}
                    style={style.resendView}
                  >
                    <Text
                      style={[style.codeNotRecievedTxt, { color: colors.text }]}
                    >
                      {localization.appkeys.codeNotRecieved}
                    </Text>
                    <Text style={[style.resendTxt, { color: colors.text }]}>
                      {localization.appkeys.resend}
                    </Text>
                  </Pressable>
                </View>
              </View>
              <CustomBtn
                btnStyle={style.buttonView}
                onPress={() => {
                  from == "Signup" && type
                    ? verify_Otp()
                    : from == "Signup" && !type
                    ? therapist_verify_Otp()
                    : from == "login" && !type
                    ? handleTherapistForgot()
                    : handleForgotPass();
                }}
                titleTxt={localization.appkeys.verifyContinue}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      }
    />
  );
}

const style = StyleSheet.create({
  buttonView: {
    marginBottom: 40,
  },
  enterOtpTxt: {
    fontSize: 12,
    fontFamily: AppFonts.SemiBold,
    marginBottom: 4,
  },
  resendTxt: {
    fontSize: 14,
    fontFamily: AppFonts.BoldItalic,
  },
  codeNotRecievedTxt: {
    fontSize: 14,
    fontFamily: AppFonts.Regular,
  },
  otpInputStyle: {
    width: "100%",
    height: hp(10),
    alignSelf: "center",
  },
  resendView: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  we_sentTxt: {
    fontFamily: AppFonts.Medium,
    fontSize: 15.5,
    alignSelf: "center",
    marginTop: 20,
    textAlign: "center",
    marginHorizontal: 30,
  },
  mainView: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  otpTopView: {
    width: "92%",
    alignSelf: "center",
    marginTop: 32,
  },
  underlineStyleBase: {
    width: wp(18),
    height: hp(10),
    backgroundColor: "white",
    borderRadius: 5,
    color: "black",
    fontFamily: AppFonts.Regular,
    fontSize: 28,
    borderWidth: 1.5,
    borderColor: "#26333B26",
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
export default Verification;
