import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import SolidView from "../components/SolidView";
import { LocalizationContext } from "../../localization/localization";
import { useTheme } from "@react-navigation/native";
import Header from "../components/Header";
import FastImage from "react-native-fast-image";
import AppFonts from "../../constants/fonts";
import CustomImagePickerModal from "../modals/CustomImagePickerModal";
import CustomInput from "../components/CustomInput";
import CustomBtn from "../components/CustomBtn";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../modals/Loader";
import { update_User_Profile } from "../../api/Services/services";
import * as RNLocalize from "react-native-localize";
import { setloading, setuserData } from "../../redux/Reducers/userData";
import AppUtils from "../../utils/appUtils";
import getEnvVars from "../../../env";
import { endpoints } from "../../api/Services/endpoints";
import moment from "moment";
import RnFetch from "rn-fetch-blob";
import { setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const EditProfile = ({ navigation }) => {
  const userData = useSelector((state) => state.userData.userData);
  console.log("EditProfile userData", userData);
  const token = useSelector((state) => state.userData.token);
  const dispatch = useDispatch();
  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const [loading, setLoading] = useState(false);
  const loader = useSelector((state) => state.userNewData.loader);

  const [showPicker, setShowPicker] = useState(false);
  const [img, setImg] = useState(
    userData?.profile_pic?.includes("https")
      ? userData?.profile_pic
      : userData?.profile_pic
      ? getEnvVars().fileUrl + userData?.profile_pic
      : ""
  );
  const [email, setemail] = useState(userData?.email ? userData?.email : "");
  const [phoneNumber, setphoneNumber] = useState(
    userData?.phone_number ? userData?.phone_number : ""
  );
  const [name, setname] = useState(userData?.name ? userData?.name : "");
  const [country_code, setcountry_code] = useState(
    userData?.country_code ? userData?.country_code : ""
  );
  const currentTimeZone = RNLocalize.getTimeZone();
  const [isDataChanged, setDataChanged] = useState(false);

  const handleNameChange = (text) => {
    setname(text);
    setDataChanged(true);
  };

  const handleEmailChange = (text) => {
    setemail(text);
    setDataChanged(true);
  };

  const handlePhoneNumberChange = (text) => {
    setphoneNumber(text);
    setDataChanged(true);
  };

  const updateUserProfile = async (data) => {
    try {
      dispatch(setloader(true));
      let arr = [{ name: "profile_pic", data: img }];
      for (let index = 0; index < data.length; index++) {
        const i = data[index];
        let obj = {
          filename: moment().unix() + "." + i?.type?.split("/")[1],
          data: RnFetch.wrap(i?.path),
          type: i?.type,
        };
        arr.push({ ...obj, name: "profile_pic" });
      }
      RnFetch.fetch(
        "POST",
        getEnvVars().apiUrl + endpoints.updateUserProfile,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        arr
      )
        .then((response) => response.json())
        .then((RetrivedData) => {
          if (RetrivedData?.status) {
            setTimeout(() => {
              dispatch(setloader(false));
            }, 500);
            AppUtils.showToast(RetrivedData?.message ?? "true");
            dispatch(setuserData(RetrivedData?.data));
          } else {
            setTimeout(() => {
              dispatch(setloader(false));
            }, 500);
            AppUtils.showToast(RetrivedData?.message ?? "false");
          }
        })
        .catch((err) => {
          setTimeout(() => {
            dispatch(setloader(false));
          }, 500);
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserDetail = async (data) => {
    const isProfileDataChanged =
      name !== userData?.name || phoneNumber !== userData?.phone_number;
    if (!isProfileDataChanged) {
      setDataChanged(false);
      navigation.goBack();
      return;
    }
    if (phoneNumber.length < 10) {
      AppUtils.showToast("Phone number is not correct");
      return; // Stop further execution
    }
    dispatch(setloader(true));

    let formData = new FormData();
    formData.append("name", name);
    formData.append("country_code", country_code);
    formData.append("phone_number", phoneNumber);
    formData.append("timezone", currentTimeZone);
    let res = null;
    res = await update_User_Profile(formData, token);
    if (res?.data?.status) {
      dispatch(setloader(false));
      setTimeout(() => {
        navigation.goBack();
      }, 500);
      AppUtils.showToast(res?.data?.message);
      dispatch(setuserData(res?.data?.data));
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
    setDataChanged(false);
  };

  return (
    <SolidView
      view={
        <>
          {loader && <Loader />}
          <CustomImagePickerModal
            visible={showPicker}
            pressHandler={() => {
              setShowPicker(false);
            }}
            attachments={(data) => {
              if (data) {
                const img = { path: data.path, type: data.mime };
                setImg(data.path);
                updateUserProfile([img]);
              }
            }}
          />
          <Header
            title={localization?.appkeys?.editProfile}
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
            <View style={styles.imageTopView}>
              <Pressable 
              onPress={() => setShowPicker(true)}
              style={styles.topView}>
                {userData?.profile_pic ? (
                  <FastImage
                    resizeMode="cover"
                    source={{ uri: img }}
                    style={[
                      styles.userImg,
                      { borderColor: colors.therapostblock },
                    ]}
                  />
                ) : (
                  <FastImage
                    resizeMode="cover"
                    source={images.defaultPic}
                    style={[
                      styles.userImg,
                      { borderColor: colors.therapostblock },
                    ]}
                  />
                )}
              </Pressable>
              <Pressable 
              onPress={() => setShowPicker(true)}
              >
                <Text style={[styles.userName, { color: colors.btnColor }]}>
                  {localization?.appkeys?.changepic}
                </Text>
              </Pressable>

              <Text style={[styles.accountTxt, { color: colors.user_Color }]}>
                {localization?.appkeys?.accountInfo}
              </Text>

              <CustomInput
                title={localization.appkeys.namewithoutstar}
                rightImg={images.user}
                value={name}
                onChangeText={handleNameChange}
              />
              <CustomInput
                isEditable={false}
                title={localization.appkeys.email}
                rightImg={images.mail}
                value={email}
                onChangeText={handleEmailChange}
              />
              <CustomInput
                maxLength={10}
                keyboardType={"phone-pad"}
                title={localization.appkeys.phonewithoutstar}
                rightImg={images.phone}
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
              />
            </View>
          
            <View style={styles.updateButtonView}>
              {userData?.login_source == "email" && (
                <CustomBtn
                  btnStyle={{ backgroundColor: colors.locationdiscription }}
                  onPress={() => {
                    navigation.navigate(AppRoutes.ChangePassword);
                  }}
                  titleTxt={localization?.appkeys?.Changepassword}
                />
              )}

              <View
                style={{
                  marginTop: 10,
                }}
              >
                <CustomBtn
                  onPress={() => {
                    updateUserDetail();
                  }}
                  titleTxt={localization?.appkeys?.update}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
         
        </>
      }
    />
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  accountTxt: {
    fontSize: 18,
    fontFamily: AppFonts.SemiBold,
    marginTop: 20,
  },
  buttonView: {
    width: "100%",
    marginTop: 40,
  },
  userName: {
    alignSelf: "center",
    fontFamily: AppFonts.SemiBold,
    fontSize: 16,
    marginTop: 10,
  },
  dummyImg: {
    width: 30,
    height: 30,
    alignSelf: "center",
    resizeMode: "contain",
  },
  userImg: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 50,
  },
  topView: {
    marginTop: 25,
    justifyContent: "center",
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "black",
  },
  imageTopView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  updateButtonView: {
    paddingBottom: 40,
    marginTop: 80,
  },
});
