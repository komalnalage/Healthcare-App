import { useIsFocused, useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import {
  setUser,
  setlatitude,
  setlongitude,
} from "../../redux/Reducers/userData";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import CustomBtn from "../components/CustomBtn";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import CustomInput from "../components/CustomInput";
import CustomImagePickerModal from "../modals/CustomImagePickerModal";
import FastImage from "react-native-fast-image";
import FeedbackInput from "../components/FeedbackInput";
import {
  getspecialization,
  register,
  therapistSignup,
} from "../../api/Services/services";
import AppUtils from "../../utils/appUtils";
import { CountryPicker } from "react-native-country-codes-picker";
import Loader from "../modals/Loader";
import GetLocation from "react-native-get-location";
import { Dropdown } from "react-native-element-dropdown";
import * as RNLocalize from "react-native-localize";
import SelectedSpecializations from "../components/SelectedSpecializations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { widthPercentageToDP } from "react-native-responsive-screen";

function SignUp({ navigation }) {
  const dispatch = useDispatch();
  let focus = useIsFocused();
  const user = useSelector((state) => state.userData.user);
  let langCode = useSelector((state) => state.userData.languageCode);
  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const loader = useSelector((state) => state.userNewData.loader);
  const [isUser, setIsUser] = useState(true);
  const [isSecure, setIsSecure] = useState(true);
  const [isSecure1, setIsSecure1] = useState(true);
  const [accept, setIsAccept] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [img, setImg] = useState("");
  const [message, setmessage] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [fcm_token, setfcm_Token] = useState("");
  const [lat, setlat] = useState("");
  const [long, setlong] = useState("");
  const [getListData, setgetListData] = useState([]);
  const [value, setValue] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const currentTimeZone = RNLocalize.getTimeZone();
  const [location, setlocation] = useState("");
  const [Education, setEducation] = useState("");
  const [Experience, setExperience] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");

  useEffect(() => {
    if (focus) {
      getFCMToken();
      getUserCurrentLocation();
      getSpecilization();
    }
  }, [focus]);

  function getUserCurrentLocation() {
    try {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      })
        .then((location) => {
          setlat(location.latitude);
          setlong(location.longitude);
          dispatch(setlatitude(location.latitude));
          dispatch(setlongitude(location.longitude));
          getPlaceFromLatLng(location.latitude, location.longitude);
        })
        .catch((error) => {
          console.log("error", error);
          const { code, message } = error;
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  const apiKey = "AIzaSyAbcVfeiTr0sdz1M8eCYzNeUKqyU4XDMIc";

  function getPlaceFromLatLng(lat, long) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK" && data?.results?.length > 0) {
          const formattedAddress = data?.results[9].formatted_address;
          const locationString = formattedAddress;
          const locationArray = locationString.split(", ");
          setcity(locationArray[0]);
          setstate(locationArray[1]);
          setlocation(locationArray[2]);
        } else {
          console.log("Geocoding API request failed or no results found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data from the Geocoding API:", error);
      });
  }

  const getSpecilization = async () => {
    let res = null;
    res = await getspecialization();
    // console.log("getSpecilization res",res?.data);
    if (res?.data?.status) {
      dispatch(setloader(false));
      setgetListData(res?.data?.data);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  const getFCMToken = async () => {
    const token = "";
    setfcm_Token(token);
  };

  const handleTherapistClick = () => {
    setIsUser(false);
    dispatch(setUser({ type: "therapist" }));
  };

  const handleUserClick = () => {
    setIsUser(true);
    dispatch(setUser({ type: "user" }));
  };

  const validateEmail = (mail) => {
    return String(mail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const verifyPhone = (phoneNumber) => {
    var pattern = new RegExp(/^[0-9\b]+$/);
    if (phoneNumber) {
      if (!pattern.test(phoneNumber)) {
        AppUtils.showToast("Please enter only number.");
      } else if (checkSameDigits(phoneNumber)) {
        AppUtils.showToast("All numbers should not be same.");
      } else if (phoneNumber.length < 10) {
        AppUtils.showToast("Please enter valid phone number.");
      } else {
        return true;
      }
    } else {
      return AppUtils.showToast("Please Enter your Phone Number");
    }
  };

  function checkSameDigits(N) {
    var digit = N % 10;
    while (N != 0) {
      var current_digit = N % 10;
      N = parseInt(N / 10);
      if (current_digit != digit) {
        return false;
      }
    }
    return true;
  }

  const handleUserSignUp = async () => {
    if (name.trim()) {
      if (validateEmail(email.trim().toLocaleLowerCase())) {
        if (verifyPhone(phoneNumber)) {
          if (password) {
            if (confirmPass) {
              if (password == confirmPass) {
                if (password.length >= 8) {
                  if (accept) {
                    if (
                      characterlength &&
                      capitalletter &&
                      smallletter &&
                      number &&
                      specialcharater
                    ) {
                      // Call your signup API here
                      userSignUp();
                    } else {
                      // Show error message indicating validation criteria not met
                      AppUtils.showToast(
                        "Please ensure password meets all criteria"
                      );
                    }
                  } else {
                    AppUtils.showToast("Please accept Terms & Conditions");
                  }
                } else {
                  AppUtils.showToast("Password must be atleast 8 characters!!");
                }
              } else {
                AppUtils.showToast("Password is not matching!!");
              }
            } else {
              AppUtils.showToast("Please enter confirm password!!");
            }
          } else {
            AppUtils.showToast("Password is required!!");
          }
        }
      } else {
        AppUtils.showToast("Enter Valid Email!!");
      }
    } else {
      AppUtils.showToast("Name is required!!");
    }
  };

  const userSignUp = async () => {
    try {
      AsyncStorage.setItem("email", email.trim().toLocaleLowerCase());
      AsyncStorage.setItem("pass", password);
      dispatch(setloader(true));
      let formData = new FormData();
      formData.append("name", name);
      formData.append("email", email.trim().toLocaleLowerCase());
      formData.append("country_code", countryCode);
      formData.append("phone_number", phoneNumber);
      formData.append("password", password);
      formData.append("lang_code", langCode);
      formData.append("fcm_token", fcm_token);
      formData.append("timezone", currentTimeZone);
      if (img?.path) {
        formData.append("profile_pic", {
          name: Date.now() + "." + img?.mime?.split("/")[1],
          uri: img?.path,
          type: img?.mime,
        });
      }
      let res = null;
      res = await register(formData);
      console.log("register", res?.data);
      if (res?.data?.status) {
        dispatch(setloader(false));
        dispatch(setUser({ type: isUser ? "user" : "therapist" }));
        AppUtils.showToast(res?.data?.message);
        navigation.navigate(AppRoutes.Verification, {
          from: "Signup",
          email,
          type: isUser ?? true,
          password,
        });
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleTherapistSignup = async () => {
    if (name.trim()) {
      // if (message) {
      if (city) {
        if (state) {
          if (location) {
            if (value.length > 0) {
              if (validateEmail(email.trim().toLocaleLowerCase())) {
                if (verifyPhone(phoneNumber)) {
                  if (password) {
                    if (password.length >= 8) {
                      if (confirmPass) {
                        if (password == confirmPass) {
                          if (accept) {
                            if (
                              characterlength &&
                              capitalletter &&
                              smallletter &&
                              number &&
                              specialcharater
                            ) {
                              // Call your signup API here
                              therapistSignUp();
                            } else {
                              // Show error message indicating validation criteria not met
                              AppUtils.showToast(
                                "Please ensure password meets all criteria"
                              );
                            }
                            // therapistSignUp();
                          } else {
                            AppUtils.showToast(
                              "Please accept Terms & Conditions"
                            );
                          }
                        } else {
                          AppUtils.showToast("Password is not matching!!");
                        }
                      } else {
                        AppUtils.showToast("Please enter confirm password!!");
                      }
                    } else {
                      AppUtils.showToast(
                        "Password must be atleast B characters!!"
                      );
                    }
                  } else {
                    AppUtils.showToast("Password is required!!");
                  }
                }
              } else {
                AppUtils.showToast("Enter Valid Email!!");
              }
            } else {
              AppUtils.showToast("Please Select Specialization!!");
            }
          } else {
            AppUtils.showToast("Please Select Location!!");
          }
        } else {
          AppUtils.showToast("Please Select State!!");
        }
      } else {
        AppUtils.showToast("Please Select City!!");
      }

      // } else {
      //     AppUtils.showToast("Please Enter About Me!!")
      // }
    } else {
      AppUtils.showToast("Name is required!!");
    }
  };

  const therapistSignUp = async () => {
    AsyncStorage.setItem("email", email.trim().toLocaleLowerCase());
    AsyncStorage.setItem("pass", password);
    const specializationIds = value.map((item) => item._id);
    dispatch(setloader(true));
    let formData = new FormData();
    formData.append("name", name);
    formData.append("email", email.trim().toLocaleLowerCase());
    formData.append("country_code", countryCode);
    formData.append("about", message);
    formData.append("phone_number", phoneNumber);
    formData.append("password", password);
    formData.append("lang_code", langCode);
    formData.append("fcm_token", fcm_token);
    formData.append("timezone", currentTimeZone);
    formData.append("location_name", location);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("lat", lat);
    formData.append("long", long);
    formData.append("education", Education);
    formData.append("experience", Experience);
    formData.append("specialization", JSON.stringify(specializationIds));
    if (img?.path) {
      formData.append("profile_pic", {
        name: Date.now() + "." + img?.mime?.split("/")[1],
        uri: img?.path,
        type: img?.mime,
      });
    }
    let res = null;
    res = await therapistSignup(formData);
    if (res?.data?.status) {
      dispatch(setloader(false));
      dispatch(setUser({ type: isUser ? "user" : "therapist" }));
      AppUtils.showToast(res?.data?.message);
      navigation.navigate(AppRoutes.Verification, {
        from: "Signup",
        email,
        type: isUser ?? true,
        password,
      });
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  const handleSpecializationChange = (item) => {
    const isSelected = value.some((val) => val._id === item._id);
    if (isSelected) {
      setValue((prevValue) => prevValue.filter((val) => val._id !== item._id));
    } else {
      setValue((prevValue) => [...prevValue, item]);
    }
  };

  const renderItem = (item) => {
    return (
      <View style={style.dropdownItemView}>
        <Text style={[style.itemTxt, { color: colors.text }]}>
          {item?.name}
        </Text>
        {value.some((val) => val._id === item._id) && (
          <Image source={images.checked} style={{ width: 20, height: 20 }} />
        )}
      </View>
    );
  };

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

  return (
    <SolidView
      view={
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {loader && <Loader />}
          <View style={style.mainView}>
            <CustomImagePickerModal
              visible={showPicker}
              pressHandler={() => {
                setShowPicker(false);
              }}
              attachments={(data) => {
                setImg(data);
              }}
            />
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
              {localization.appkeys.welcome}
            </Text>
            <Text
              style={[
                style.titleText,
                {
                  color: colors.text,
                  fontSize: 16,
                  fontFamily: AppFonts.Medium,
                  marginHorizontal: 20,
                },
              ]}
            >
              {localization.appkeys.weKeepPvt}
            </Text>

            <View
              style={[style.tabView, { borderColor: colors.tabbordercolor }]}
            >
              <Pressable
                onPress={() => handleUserClick()}
                style={[
                  style.viewHighlight,
                  {
                    backgroundColor: isUser
                      ? colors.locationdiscription
                      : "rgba(38,51,59,0.2)",
                  },
                ]}
              >
                <Text
                  style={[
                    style.textHighlight,
                    { color: isUser ? "white" : colors.locationdiscription },
                  ]}
                >
                  {localization.appkeys.user}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleTherapistClick()}
                style={[
                  style.viewHighlight,
                  {
                    backgroundColor: isUser
                      ? "rgba(38,51,59,0.2)"
                      : colors.locationdiscription,
                  },
                ]}
              >
                <Text
                  style={[
                    style.textHighlight,
                    { color: isUser ? colors.locationdiscription : "white" },
                  ]}
                >
                  {localization.appkeys.therapist}
                </Text>
              </Pressable>
            </View>
            <Pressable onPress={() => setShowPicker(true)}>
              <View
                style={[style.addprofilepicView, { borderColor: colors.text }]}
              >
                {img?.path ? (
                  <FastImage
                    source={{ uri: img?.path }}
                    style={style.profilePicView}
                  />
                ) : (
                  <Image
                    source={images.image}
                    style={[style.imageView, { tintColor: colors.text }]}
                  />
                )}
              </View>
              {img.path == null && (
                <Text
                  style={[
                    style.textHighlight,
                    {
                      color: colors.text,
                      fontSize: 12,
                      fontFamily: AppFonts.Medium,
                      marginTop: 8,
                    },
                  ]}
                >
                  {localization?.appkeys?.addprofilepic}
                </Text>
              )}
            </Pressable>
            <CustomInput
              title={localization.appkeys.name}
              rightImg={images.user}
              value={name}
              onChangeText={setname}
            />
            {!isUser && (
              <View>
                <View style={style.therapistView}>
                  <FeedbackInput
                    title={localization?.appkeys?.aboutus}
                    value={message}
                    onChangeText={setmessage}
                  />
                </View>
                <CustomInput
                  value={location}
                  onChangeText={setlocation}
                  title={localization?.appkeys?.country}
                  rightImg={images.location}
                />
                <CustomInput
                  value={state}
                  onChangeText={setstate}
                  title={localization?.appkeys?.statewithstar}
                  rightImg={images.state}
                />
                <CustomInput
                  value={city}
                  onChangeText={setcity}
                  title={localization?.appkeys?.citwithstar}
                  rightImg={images.city}
                />
                <CustomInput
                  value={Education}
                  onChangeText={setEducation}
                  title={localization?.appkeys?.Education}
                />
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={[style.specializationTxt, { color: colors.text }]}
                  >
                    {localization?.appkeys?.Specialization}
                  </Text>
                  <Dropdown
                    placeholder="Select Specialization"
                    placeholderStyle={{
                      color: colors.text,
                      marginLeft: 5,
                      fontFamily: AppFonts.Regular,
                    }}
                    style={[
                      style.dropdown,
                      { borderColor: colors.tabbordercolor },
                    ]}
                    selectedTextStyle={style.selectedTextStyle}
                    iconStyle={style.iconStyle}
                    activeColor="#310B831A"
                    containerStyle={style.containerStyle}
                    data={getListData}
                    itemTextStyle={{ color: "black" }}
                    maxHeight={300}
                    labelField="name"
                    valueField="name"
                    value={value}
                    dropdownPosition={"bottom"}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    renderItem={renderItem}
                    onChange={handleSpecializationChange}
                    renderRightIcon={() => {
                      return isFocus == true ? (
                        <Image
                          source={images.upArrow}
                          style={[style.arrow, { tintColor: colors.btnColor }]}
                        />
                      ) : (
                        <Image
                          source={images.downArrow}
                          style={[
                            style.arrow,
                            ,
                            { tintColor: colors.btnColor },
                          ]}
                        />
                      );
                    }}
                  />
                  <SelectedSpecializations selectedItems={value} />
                </View>
                <CustomInput
                  value={Experience}
                  onChangeText={setExperience}
                  title={localization?.appkeys?.Experience}
                  yearTxt={localization?.appkeys?.Yrs}
                  keyboardType={"decimal-pad"}
                />
              </View>
            )}
            <CustomInput
              title={localization.appkeys.emailwithstar}
              rightImg={images.mail}
              value={email}
              onChangeText={setemail}
            />
            <CustomInput
              isPhone={true}
              countryPickerPress={() => {
                setShow(true);
              }}
              maxLength={10}
              countryCode={countryCode}
              title={localization.appkeys.phone}
              rightImg={images.phone}
              value={phoneNumber}
              onChangeText={setphoneNumber}
            />
            <CustomInput
              maxLength={10}
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
              maxLength={10}
              value={confirmPass}
              onChangeText={(t) => checkvalidation(t)}
              // onChangeText={setconfirmPass}
              title={localization.appkeys.cnfrmpassword}
              rightImg={isSecure1 ? images.eyeoff : images.eye}
              isSecure={isSecure1}
              onEyePress={() => {
                setIsSecure1(!isSecure1);
              }}
            />
            <Pressable
              onPress={() => {
                setIsAccept(!accept);
              }}
              style={style.acceptTopView}
            >
              <Image
                source={accept ? images.checked : images.check}
                style={[style.acceptImg, { tintColor: colors.acceptImg }]}
              />
              <Text style={[style.iAcceptTxt, { color: colors.text }]}>
                {localization.appkeys.iAccept}
                <Text
                  onPress={() => {
                    navigation.navigate(AppRoutes.TermsCondition);
                  }}
                  style={[style.termsTxt, { color: colors.text }]}
                >
                  {localization.appkeys.TermsConditions}
                </Text>
              </Text>
            </Pressable>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: widthPercentageToDP(90),
                marginLeft: 10,
              }}
            >
              <Image
                source={characterlength ? images.checked : images.check}
                style={[
                  style.checkimageView,
                  { tintColor: characterlength ? "green" : "red", },
                ]}
              />
              <Text
                maxFontSizeMultiplier={1.7}
                style={{
                  fontFamily: AppFonts.Medium,
                  marginLeft: 10,
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
                marginLeft: 10,
              }}
            >
              <Image
                source={capitalletter ? images.checked : images.check}
                style={[
                  style.checkimageView,
                  { tintColor: capitalletter ?"green" : "red", },
                ]}
              />
              <Text
                maxFontSizeMultiplier={1.7}
                style={[style.letterTxt, { color: colors.text }]}
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
                marginLeft: 10,
              }}
            >
              <Image
                source={smallletter ? images.checked : images.check}
                style={[
                  style.checkimageView,
                  { tintColor: smallletter ? "green" : "red", },
                ]}
              />
              <Text
                maxFontSizeMultiplier={1.7}
                style={[style.letterTxt, { color: colors.text }]}
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
                marginLeft: 10,
              }}
            >
              <Image
                source={number ? images.checked : images.check}
                style={[
                  style.checkimageView,
                  { tintColor: number ?"green" : "red", },
                ]}
              />
              <Text
                maxFontSizeMultiplier={1.7}
                style={[style.letterTxt, { color: colors.text }]}
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
                marginLeft: 10,
              }}
            >
              <Image
                source={specialcharater ? images.checked : images.check}
                style={[
                  style.checkimageView,
                  { tintColor: specialcharater ?"green" : "red", },
                ]}
              />
              <Text
                maxFontSizeMultiplier={1.7}
                style={[style.letterTxt, { color: colors.text }]}
              >
                {localization?.appkeys?.Passwordcharacter}
              </Text>
            </View>

            <CustomBtn
              onPress={() => {
                if (isUser) {
                  handleUserSignUp();
                } else {
                  handleTherapistSignup();
                }
              }}
              btnStyle={{ marginTop: 40 }}
              titleTxt={localization.appkeys.signup}
            />
            <Text style={[style.alreadyHaveTxt, { color: colors.text }]}>
              {localization.appkeys.alreadyHave}
              <Text
                onPress={() => {
                  navigation.navigate(AppRoutes.Login);
                }}
                style={[style.signInTxt, { color: colors.text }]}
              >
                {localization?.appkeys?.SignIn}
              </Text>
            </Text>
            <View style={style.emptyView} />
            <Text style={[style.byCreatingTxt]}>
              {localization.appkeys.byCreating}
            </Text>
            <View style={style.bottomView}>
              <Pressable
                onPress={() => navigation.navigate(AppRoutes.TermsCondition)}
              >
                <Text style={[style.privacyTxt, { color: colors.text }]}>
                  {localization.appkeys.TermsConditions}
                </Text>
              </Pressable>
              <Text style={style.addTxt}>and</Text>
              <Pressable
                onPress={() => navigation.navigate(AppRoutes.PrivacyPolicy)}
              >
                <Text style={[style.privacyTxt, { color: colors.text }]}>
                  {" "}
                  {localization.appkeys.privacy}
                </Text>
              </Pressable>
            </View>
          </View>

          <CountryPicker
            androidWindowSoftInputMode="pan"
            style={{
              modal: {
                height: Platform.OS == "ios" ? 500 : "100%",
              },
              countryName: {
                color: colors.text,
              },
              dialCode: {
                color: colors.text,
              },
            }}
            onRequestClose={() => {
              setShow(false);
            }}
            onBackdropPress={() => {
              setShow(false);
            }}
            lang={"en"}
            enableModalAvoiding={Platform.OS == "ios" ? true : false}
            searchMessage="Search"
            show={show}
            // when picker button press you will get the country object with dial code
            pickerButtonOnPress={(item) => {
              setCountryCode(item.dial_code);
              setShow(false);
            }}
          />
        </KeyboardAwareScrollView>
      }
    />
  );
}

const style = StyleSheet.create({
  checkimageView: {
    height: 15,
    width: 15,
  },
  letterTxt: {
    fontFamily: AppFonts.Medium,
    marginLeft: 10,
    fontSize: 12,
  },
  checkImage: {
    height: 15,
    width: 15,
  },
  parent: {
    flex: 1,
    justifyContent: "center",
  },
  iconStyle: {
    marginRight: 5,
  },
  specializationTxt: {
    fontFamily: AppFonts.SemiBold,
    fontSize: 12,
    marginLeft: 12,
    marginBottom: 4,
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
  itemTxt: {
    fontSize: 16,
    fontFamily: AppFonts.Light,
  },
  acceptTopView: {
    flexDirection: "row",
    margin: 8,
  },
  dropdownItemView: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iAcceptTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Regular,
    marginTop: 2,
  },
  termsTxt: {
    fontSize: 12,
    fontFamily: AppFonts.SemiBold,
    alignSelf: "center",
  },
  alreadyHaveTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Medium,
    alignSelf: "center",
    marginTop: 8,
  },
  flag: {
    height: 30,
    width: 30,
    marginLeft: 10,
    marginRight: 20,
    resizeMode: "contain",
  },
  acceptImg: {
    width: 20,
    height: 20,
    alignSelf: "center",
    marginRight: 8,
  },
  byCreatingTxt: {
    fontSize: 11,
    width: "80%",
    alignSelf: "center",
    textAlign: "center",
  },
  emptyView: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 25,
  },
  signInTxt: {
    fontSize: 12,
    fontFamily: AppFonts.SemiBold,
    alignSelf: "center",
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  privacyTxt: {
    fontSize: 10,
    fontFamily: AppFonts.Bold,
  },
  addTxt: {
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 3,
    fontSize: 10,
  },
  imageView: {
    width: 30,
    height: 30,
    alignSelf: "center",
    resizeMode: "contain",
  },
  therapistView: {
    alignSelf: "center",
    marginTop: 20,
  },
  profilePicView: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 50,
  },
  addprofilepicView: {
    marginTop: 25,
    justifyContent: "center",
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "black",
  },
  tabView: {
    width: "100%",
    padding: 4,
    height: 58,
    alignSelf: "center",
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1.5,
    backgroundColor: "white",
    flexDirection: "row",
  },
  mainView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 24,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 2,
    fontFamily: AppFonts.Medium,
  },
  img: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },
  viewHighlight: {
    justifyContent: "center",
    width: "50%",
    height: 50,
    alignSelf: "center",
    borderRadius: 4,
  },
  textHighlight: {
    fontFamily: AppFonts.Medium,
    alignSelf: "center",
    fontSize: 15,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#202020",
    fontFamily: AppFonts.Medium,
  },
  containerStyle: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "grey",
  },
  socialBtn: {
    justifyContent: "center",
    width: "30%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "grey",
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  arrow: {
    width: 14,
    height: 14,
    resizeMode: "contain",
    marginRight: 8,
  },
});
export default SignUp;
