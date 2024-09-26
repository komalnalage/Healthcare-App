import { View, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { LocalizationContext } from "../../localization/localization";
import SolidView from "../components/SolidView";
import Header from "../components/Header";
import CustomInput from "../components/CustomInput";
import { wp } from "../../utils/dimension";
import FeedbackInput from "../components/FeedbackInput";
import CustomBtn from "../components/CustomBtn";
import Loader from "../modals/Loader";
import AppUtils from "../../utils/appUtils";
import { useDispatch, useSelector } from "react-redux";
import { contactUs } from "../../api/Services/services";
import {
  setdrawerSelectedTab,
  setloader,
} from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ContactUs = ({ navigation }) => {
  let dispatch = useDispatch();
  const user = useSelector((state) => state.userData.user);
  const userData = useSelector((state) => state.userData.userData);
  const { images } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const loader = useSelector((state) => state.userNewData.loader);
  const [Message, setMessage] = useState("");
  const [name, setname] = useState(userData?.name ? userData?.name : "");
  const [email, setemail] = useState(userData?.email ? userData?.email : "");

  const contact = async () => {
    try {
      dispatch(setloader(true));
      let res = null;
      let usertype = user?.type == "user" ? "user" : "therapist";
      res = await contactUs(name, email, Message, userData?._id, usertype);
      if (res?.data?.status) {
        dispatch(setloader(false));
        navigation.goBack();
        setTimeout(() => {
          AppUtils.showToast(res?.data?.message);
        }, 500);
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(setdrawerSelectedTab("Contact us"));
  }, []);

  return (
    <SolidView
      view={
        <>
          {loader && <Loader />}
          <Header
            title={localization?.appkeys?.ContactUs}
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
            <View style={styles.topview}>
              <CustomInput
                value={name}
                onChangeText={setname}
                title={localization.appkeys.name}
                rightImg={images.user}
                isEditable={false}
              />
              <CustomInput
                title={localization.appkeys.emailwithstar}
                rightImg={images.mail}
                value={email}
                onChangeText={setemail}
                isEditable={false}
              />
              <View style={{ alignSelf: "center", paddingVertical: 20 }}>
                <FeedbackInput
                  customWidth={wp(90)}
                  title={localization?.appkeys?.messagewithstar}
                  value={Message}
                  onChangeText={setMessage}
                />
              </View>
              <CustomBtn
                onPress={() => {
                  if (name.trim() && email.trim() && Message.trim()) {
                    contact();
                  } else {
                    AppUtils.showToast("All Fields are required!!");
                  }
                }}
                btnStyle={{ marginTop: 120, marginBottom: 20 }}
                titleTxt={localization.appkeys.SendMessage}
              />
            </View>
          </KeyboardAwareScrollView>
        </>
      }
    />
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  topview: {
    width: wp(90),
    alignSelf: "center",
  },
});
