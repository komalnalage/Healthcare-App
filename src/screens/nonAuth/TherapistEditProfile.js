import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import SolidView from "../components/SolidView";
import { LocalizationContext } from "../../localization/localization";
import { useTheme } from "@react-navigation/native";
import Header from "../components/Header";
import FastImage from "react-native-fast-image";
import AppFonts from "../../constants/fonts";
import CustomImagePickerModal from "../modals/CustomImagePickerModal";
import CustomInput from "../components/CustomInput";
import CustomBtn from "../components/CustomBtn";
import FeedbackInput from "../components/FeedbackInput";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import { useDispatch, useSelector } from "react-redux";
import {
  update_Therapist_Profile,
  getspecialization,
} from "../../api/Services/services";
import AppUtils from "../../utils/appUtils";
import Loader from "../modals/Loader";
import { setuserData } from "../../redux/Reducers/userData";
import messaging from "@react-native-firebase/messaging";
import * as RNLocalize from "react-native-localize";
import getEnvVars from "../../../env";
import { endpoints } from "../../api/Services/endpoints";
import RnFetch from "rn-fetch-blob";
import moment from "moment";
import { setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const TherapistEditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData.userData);
  const token = useSelector((state) => state.userData.token);
  let langCode = useSelector((state) => state.userData.languageCode);
  let lat = useSelector((state) => state.userData.lat);
  let long = useSelector((state) => state.userData.long);
  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const loader = useSelector((state) => state.userNewData.loader);

  const [showPicker, setShowPicker] = useState(false);
  const currentTimeZone = RNLocalize.getTimeZone();
  const [Message, setMessage] = useState(
    userData?.about ? userData?.about : ""
  );
  const [name, setname] = useState(userData?.name ? userData?.name : "");
  const [email, setemail] = useState(userData?.email ? userData?.email : "");
  const [phoneNumber, setphoneNumber] = useState(
    userData?.phone_number ? userData?.phone_number : ""
  );
  const [experience, setexperience] = useState(
    userData?.experience ? userData?.experience : ""
  );
  const [education, seteducation] = useState(
    userData?.education ? userData?.education : ""
  );
  const [img, setImg] = useState(userData?.profile_pic?.includes("https") ? userData?.profile_pic : userData?.profile_pic ? getEnvVars().fileUrl + userData?.profile_pic : "");
  // const [img, setImg] = useState(getEnvVars().fileUrl + userData?.profile_pic);
  const [location, setlocation] = useState(
    userData?.location_name ? userData?.location_name : ""
  );
  const [fcm_Token, setfcm_Token] = useState("");
  const [country_code, setcountry_code] = useState(
    userData?.country_code ? userData?.country_code : ""
  );
  const [getListData, setgetListData] = useState([]);
  const [city, setcity] = useState(userData?.city ? userData?.city : "");
  const [state, setstate] = useState(userData?.state ? userData?.state : "");
  const [selectedSpecializations, setSelectedSpecializations] = useState(
    userData?.specialization || []
  );

  useEffect(() => {
    getFCMToken();
    getSpecilization();
  }, []);

  const getSpecilization = async () => {
    let res = null;
    res = await getspecialization();
    const b = userData?.specialization.map((i) => (i?._id ? i?._id : i));
    if (res?.data?.status) {
      setgetListData(res?.data?.data);
      let cc = res?.data?.data ?? [];
      let filterdata_name = cc
        ?.filter((x) => {
          if (b.includes(x._id)) {
            return x;
          }
        })
        .map((x) => x._id);
      setSelectedSpecializations(filterdata_name);
    } else {
      AppUtils.showToast(res?.data?.message);
    }
  };

  const toggleSpecializationSelection = (id) => {
    setSelectedSpecializations((prevSpecializations) =>
      prevSpecializations.includes(id)
        ? prevSpecializations.filter((specId) => specId !== id)
        : [...prevSpecializations, id]
    );
  };

  const getFCMToken = async () => {
    const fcmtoken = await messaging().getToken();
    setfcm_Token(fcmtoken);
  };

  const updateTherapistProfile = async (data) => {
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
        getEnvVars().apiUrl + endpoints.therapistupdate_profile,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        arr
      )
        .then((response) => response.json())
        .then((RetrivedData) => {
          if (RetrivedData?.status) {
            dispatch(setloader(false));

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

  const updateTherapistDetail = async () => {
    try {
      const specializationIds = selectedSpecializations;
      dispatch(setloader(true));
      let formData = new FormData();
      formData.append("name", name);
      formData.append("country_code", country_code);
      formData.append("phone_number", phoneNumber);
      formData.append("lang_code", langCode);
      formData.append("about", Message);
      formData.append("fcm_token", fcm_Token);
      formData.append("timezone", currentTimeZone);
      formData.append("location_name", location);
      formData.append("lat", lat);
      formData.append("long", long);
      formData.append("education", education);
      formData.append("experience", experience);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("specialization", JSON.stringify(specializationIds));
      let res = null;
      res = await update_Therapist_Profile(formData, token);
      if (res?.data?.status) {
        dispatch(setuserData(res?.data?.data));
        // dispatch(setloader(false));
        // setTimeout(() => {
        AppUtils.showToast(res?.data?.message);
        navigation.navigate(AppRoutes.TherapistProfile);
        // }, 500);

        //   dispatch(setuserData(res?.data?.data));
      } else {
        //   dispatch(setloader(false));
        AppUtils.showToast(res?.data?.message);
        // setTimeout(() => {
        //   dispatch(setloader(false));
        // }, 500);
      }
    } catch (error) {
      console.log("update_Therapist_Profile error", error);
    } finally {
      dispatch(setloader(false));
    }
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
                updateTherapistProfile([img]);
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
              <Pressable onPress={() => setShowPicker(true)}>
                <Text style={[styles.userName, { color: colors.btnColor }]}>
                  {localization?.appkeys?.changepic}
                </Text>
              </Pressable>
              <Text
                style={[
                  styles.accountTxt,
                  { color: colors.threrapist_EditProfile_Account_Information },
                ]}
              >
                {localization?.appkeys?.accountInfo}
              </Text>

              <CustomInput
                title={localization.appkeys.namewithoutstar}
                rightImg={images.user}
                value={name}
                onChangeText={setname}
              />
              <View style={styles.aboutUsView}>
                <FeedbackInput
                  title={localization?.appkeys?.aboutus}
                  value={Message}
                  onChangeText={setMessage}
                />
              </View>
              <CustomInput
                title={localization.appkeys.countrywithoutstar}
                rightImg={images.location}
                value={location}
                onChangeText={setlocation}
              />
              <CustomInput
                value={state}
                onChangeText={setstate}
                title={localization?.appkeys?.state}
                rightImg={images.state}
              />
              <CustomInput
                value={city}
                onChangeText={setcity}
                title={localization?.appkeys?.city}
                rightImg={images.city}
              />
              <CustomInput
                title={localization.appkeys.Education}
                value={education}
                onChangeText={seteducation}
              />
              <View style={{ marginTop: 20 }}>
                <Text
                  style={[styles.specializationTxt, { color: colors.text }]}
                >
                  {localization?.appkeys?.Specialization}
                </Text>
                <View style={styles.specializationContainer}>
                  {getListData.map((specializationItem) => (
                    <Pressable
                      key={specializationItem._id}
                      style={[
                        styles.specializationItem,
                        selectedSpecializations?.includes(
                          specializationItem._id
                        ) && styles.selectedSpecializationItem,
                      ]}
                      onPress={() =>
                        toggleSpecializationSelection(specializationItem._id)
                      }
                    >
                      <Text
                        style={[
                          styles.specializationItemText,
                          {
                            fontFamily: selectedSpecializations?.includes(
                              specializationItem._id
                            )
                              ? AppFonts.Medium
                              : AppFonts.Light,
                          },
                        ]}
                      >
                        {specializationItem?.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <CustomInput
                yearTxt={"Yrs"}
                title={localization.appkeys.Experience}
                value={experience}
                onChangeText={setexperience}
                keyboardType={"decimal-pad"}
              />
              <CustomInput
                isEditable={false}
                title={localization.appkeys.email}
                rightImg={images.mail}
                value={email}
                onChangeText={setemail}
              />
              <CustomInput
                maxLength={10}
                title={localization.appkeys.phonewithoutstar}
                rightImg={images.phone}
                value={phoneNumber}
                onChangeText={setphoneNumber}
                keyboardType={"decimal-pad"}
              />
            </View>
            <View style={styles.buttonView}>
              <CustomBtn
                btnStyle={{
                  backgroundColor: colors.locationdiscription,
                }}
                onPress={() => {
                  navigation.navigate(AppRoutes.ChangePassword);
                }}
                titleTxt={localization.appkeys.Changepassword}
              />
            </View>
            <View style={styles.updateButtonView}>
              <CustomBtn
                onPress={() => {
                  updateTherapistDetail();
                }}
                titleTxt={localization.appkeys.update}
              />
            </View>
          </KeyboardAwareScrollView>
        </>
      }
    />
  );
};

export default TherapistEditProfile;

const styles = StyleSheet.create({
  specializationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  specializationItem: {
    backgroundColor: "#EFEFEF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    margin: 4,
  },
  selectedSpecializationItem: {
    backgroundColor: "#310B831A",
  },
  specializationItemText: {
    color: "black",
  },
  iconStyle: {
    marginRight: 5,
  },
  textHighlight: {
    fontFamily: AppFonts.Medium,
    alignSelf: "center",
    fontSize: 15,
  },
  aboutUsView: {
    alignSelf: "center",
    marginTop: 20,
  },
  itemTxt: {
    fontSize: 16,
    fontFamily: AppFonts.Light,
  },
  arrow: {
    width: 14,
    height: 14,
    resizeMode: "contain",
    marginRight: 8,
  },
  accountTxt: {
    fontSize: 18,
    fontFamily: AppFonts.SemiBold,
    marginTop: 30,
  },
  containerStyle: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "grey",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#202020",
    fontFamily: AppFonts.Medium,
  },
  specializationTxt: {
    fontFamily: AppFonts.SemiBold,
    fontSize: 12,
    marginLeft: 12,
    marginBottom: 4,
  },
  dropdownItemView: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    height: 60,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 4,
    width: "100%",
    alignSelf: "center",
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
    marginBottom: 120,
    marginTop: 10,
  },
});
