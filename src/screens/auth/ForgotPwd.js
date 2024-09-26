import { useTheme } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import CustomBtn from "../components/CustomBtn";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import Header from "../components/Header";
import CustomInput from "../components/CustomInput";
import Loader from "../modals/Loader";
import {
  forgot_Password,
  therapist_forgot_Password,
} from "../../api/Services/services";
import AppUtils from "../../utils/appUtils";
import { setloading } from "../../redux/Reducers/userData";
import { setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function ForgotPwd({ navigation, route }) {
  const type = route?.params?.type;
  let langCode = useSelector((state) => state.userData.languageCode);
  const from = route?.params?.from;
  const { colors, images } = useTheme();
  const loader = useSelector((state) => state.userNewData.loader);

  const { localization } = useContext(LocalizationContext);
  const [email, setemail] = useState("");
  const dispatch = useDispatch();
  const forgotuserpassword = async () => {
    dispatch(setloader(true));

    let res = null;
    res = await forgot_Password(email.trim().toLowerCase());
    if (res?.data?.status) {
      dispatch(setloader(false));
      setTimeout(() => {
        navigation.navigate(AppRoutes.Verification, {
          from: "login",
          email,
          type,
        });
      }, 500);
      AppUtils.showToast(res?.data?.message);
    } else {
      dispatch(setloader(false));
      AppUtils.showToast(res?.data?.message);
    }
  };

  const therapistForgotPassword = async () => {
    dispatch(setloader(true));
    let res = null;
    res = await therapist_forgot_Password(email.trim().toLowerCase(), langCode);
    if (res?.data?.status) {
      dispatch(setloader(false));
      setTimeout(() => {
        navigation.navigate(AppRoutes.Verification, {
          from: "login",
          email,
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
  };

  const validateEmail = (mail) => {
    return String(mail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <SolidView
      view={
        <View style={{ flex: 1 }}>
          {loader && <Loader />}
          <Header
            title={localization?.appkeys?.forgotpass}
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
                <Text style={[style.enterEmailTxt, { color: colors.text }]}>
                  {localization.appkeys.enterEmail}
                </Text>
                <CustomInput
                  title={localization.appkeys.email}
                  rightImg={images.mail}
                  value={email}
                  keyboardType="email-address"
                  onChangeText={setemail}
                />
              </View>
              <View style={{ marginBottom: 40 }}>
                <CustomBtn
                  onPress={() => {
                    if (email) {
                      if (validateEmail(email.trim().toLowerCase())) {
                        type ? forgotuserpassword() : therapistForgotPassword();
                      } else {
                        AppUtils.showToast("Enter Valid Email!!");
                      }
                    } else {
                      AppUtils.showToast("Please enter E-mail!!");
                    }
                  }}
                  titleTxt={localization.appkeys.confirm}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
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
  enterEmailTxt: {
    fontFamily: AppFonts.Medium,
    fontSize: 15.5,
    alignSelf: "center",
    marginTop: 20,
    textAlign: "center",
    marginHorizontal: 30,
  },
});
export default ForgotPwd;
