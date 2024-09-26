import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import SolidView from "../components/SolidView";
import { LocalizationContext } from "../../localization/localization";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import Header from "../components/Header";
import FastImage from "react-native-fast-image";
import AppFonts from "../../constants/fonts";
import CustomImagePickerModal from "../modals/CustomImagePickerModal";
import CustomInput from "../components/CustomInput";
import CustomBtn from "../components/CustomBtn";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import { useDispatch, useSelector } from "react-redux";
import getEnvVars from "../../../env";
import { setdrawerSelectedTab } from "../../redux/Reducers/UserNewData";
import Loader from "../modals/Loader";

const Profile = ({ navigation }) => {
  let dispatch = useDispatch();
  const userData = useSelector((state) => state.userData.userData);
  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const [loading, setLoading] = useState(false);
  const loader = useSelector((state) => state.userNewData.loader);

  const [showPicker, setShowPicker] = useState(false);
  const [img, setImg] = useState(userData?.profile_pic?.includes("https") ? userData?.profile_pic : userData?.profile_pic ? getEnvVars().fileUrl + userData?.profile_pic : "");
  // const [img, setImg] = useState();
  console.log("immgggg", img);
  const [email, setemail] = useState(userData?.email ? userData?.email : "");
  const [phoneNumber, setphoneNumber] = useState(
    userData?.phone_number ? userData?.phone_number : ""
  );

  useEffect(() => {
    setemail(userData?.email ? userData?.email : "");
    setphoneNumber(userData?.phone_number ? userData?.phone_number : "");
    setImg(userData?.profile_pic?.includes("https") ? userData?.profile_pic : userData?.profile_pic ? getEnvVars().fileUrl + userData?.profile_pic : "")
  }, [userData]);

  //   useEffect(() => {
  //     dispatch(setdrawerSelectedTab("Profile"));
  //   }, []);

  useEffect(() => {
    dispatch(setdrawerSelectedTab("Profile"));
  }, []);

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
              setImg(data);
            }}
          />
          <Header
            title={localization?.appkeys?.profile}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
          {/* <ScrollView nestedScrollEnabled style={styles.mainView}> */}
          <View style={styles.imageTopView}>
            <View style={styles.topView}>
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
            </View>
            <Text style={[styles.userName, { color: colors.user_Color }]}>
              {userData?.name}
            </Text>
            <View
              style={{
                paddingHorizontal: 16,
              }}
            >
              <Text style={[styles.accountTxt, { color: colors.user_Color }]}>
                {localization?.appkeys?.accountInfo}
              </Text>

              <CustomInput
                isEditable={false}
                title={localization.appkeys.email}
                rightImg={images.mail}
                value={email}
                onChangeText={setemail}
              />
              <CustomInput
                isEditable={false}
                title={localization.appkeys.phonewithoutstar}
                rightImg={images.phone}
                value={phoneNumber}
                onChangeText={setphoneNumber}
              />
            </View>
            <View style={styles.buttonView}>
              <CustomBtn
                onPress={() => {
                  navigation.navigate(AppRoutes.EditProfile);
                }}
                titleTxt={localization.appkeys.editProfile}
              />
            </View>
          </View>
          {/* </ScrollView> */}
        </>
      }
    />
  );
};

export default Profile;

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
    position: "absolute",
    bottom: 60,
    width: "100%",
    marginTop: 100,
    // bottom: 30,
  },
  userName: {
    alignSelf: "center",
    fontFamily: AppFonts.SemiBold,
    fontSize: 20,
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
    // paddingHorizontal: 16,
    // backgroundColor:"red",
    // height:"100%"
  },
});
