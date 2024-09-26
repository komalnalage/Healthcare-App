import {
  useFocusEffect,
  useIsFocused,
  useTheme,
} from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  FlatList,
  ScrollView,
  Keyboard,
  RefreshControl,
  Modal,
} from "react-native";
import SolidView from "../components/SolidView";
import CustomSwitch from "react-native-custom-switch";
import AppFonts from "../../constants/fonts";
import CancelAppointment from "../modals/CancelAppointment";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import UpcomingAppointment from "../components/UpcomingAppointment";
import PastAppointment from "../components/PastAppointment";
import { useDispatch, useSelector } from "react-redux";
import ServiceCall from "../modals/ServiceCall";
import CustomBtn from "../components/CustomBtn";
import {
  SetinitialRouteName,
  setlatitude,
  setlongitude,
  setuserData,
} from "../../redux/Reducers/userData";
import { LocalizationContext } from "../../localization/localization";
import {
  Update_onlineStatus,
  get_User_Profile,
  getspecialization,
  postAvailability,
  therapistAcceptCall,
  therapistCancelAppointment,
  therapistPastAppointment,
  therapistRejectCall,
  therapistUpcomingAppointment,
  therapist_get_Profile,
  update_Therapist_Profile,
  userCancelAppointment,
  userPastAppointment,
  userUpcomingAppointment,
} from "../../api/Services/services";
import moment from "moment";
import AppUtils from "../../utils/appUtils";
import messaging from "@react-native-firebase/messaging";
import getEnvVars from "../../../env";
import {
  setdrawerSelectedTab,
  setloader,
  settherapistSearchModal,
} from "../../redux/Reducers/UserNewData";
import FastImage from "react-native-fast-image";
import CustomInput from "../components/CustomInput";
import { Dropdown } from "react-native-element-dropdown";
import SelectedSpecializations from "../components/SelectedSpecializations";
import GetLocation from "react-native-get-location";
import * as RNLocalize from "react-native-localize";
import Loader from "../modals/Loader";

function Home({ navigation }) {
  const userData = useSelector((state) => state.userData.userData);
  console.log("userData9999",JSON.stringify(userData));
  const userDetail = useSelector((state) => state.userData.userDetail);
  const token = useSelector((state) => state.userData.token);
  const user = useSelector((state) => state.userData.user);
  const loader = useSelector((state) => state.userNewData.loader);
  let dispatch = useDispatch();
  let focus = useIsFocused();
  const therapistSearchModal = useSelector(
    (state) => state.userNewData.therapistSearchModal
  );
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [therapistPast, settherapistPast] = useState([]);
  const [userPast, setuserPast] = useState([]);
  const [isSearching, setisSearching] = useState(false);
  const { colors, images } = useTheme();
  const currentDateTime = moment().utc();
  const [isEnabled, setIsEnabled] = useState(
    userData?.is_online ? true : false
  );
  const [serviceCall, setServiceCall] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const { localization } = useContext(LocalizationContext);
  const [userUpcoming, setuserUpcoming] = useState([]);
  const [therapistUpcoming, settherapistUpcoming] = useState([]);
  const [searchData, setsearchData] = useState([]);
  const [appointID, setappointID] = useState("");
  const [searchTxt, setsearchTxt] = useState("");
  const [resfresh, setRefresh] = useState(false);
  let lat = useSelector((state) => state.userData.lat);
  let long = useSelector((state) => state.userData.long);
  const [img, setImg] = useState(userData?.profile_pic?.includes("https") ? userData?.profile_pic : userData?.profile_pic ? getEnvVars().fileUrl + userData?.profile_pic : "");
  const [getListData, setgetListData] = useState([]);
  const [value, setValue] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [Education, setEducation] = useState("");
  const [Experience, setExperience] = useState("");
  const [showSpecialization, setshowSpecialization] = useState(false);
  const [read_count, setread_count] = useState(0);


  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    if (isEnabled) {
      check_OnlineStatus();
    }
  };

  useEffect(() => {
    if (userData?._id) {
      messaging()
        .subscribeToTopic(userData?._id)
        .then(() => {
          console.log("subscribedToTopic", userData?._id);
        });
    }
  }, [userData]);

  useEffect(() => {
    if (focus) {
      if (user?.type == "therapist") {
        getProfile();
      } else {
        getUserDetails();
      }
      getUserCurrentLocation();
      getSpecilization();
      
    }
  }, [focus, user]);


  async function getProfile() {
    try {
      let res = null;
      res = await therapist_get_Profile(token);
      if (res?.data?.status) {
        setread_count(res?.data?.other?.unread_count);
        dispatch(setuserData(res?.data?.data));
      } else {
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      AppUtils.showToast(error);
    }
  }

  // useEffect(() => {
  //   dispatch(setloader(true));
  //   setTimeout(() => {
  //     dispatch(setloader(false));
  //   }, 2000);
  // }, []);

  function getUserCurrentLocation() {
    try {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      })
        .then((location) => {
          dispatch(setlatitude(location.latitude));
          dispatch(setlongitude(location.longitude));
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

  const getSpecilization = async () => {
    let res = null;
    res = await getspecialization();
    if (res?.data?.status) {
      setgetListData(res?.data?.data);
    } else {
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
      <View style={style.dropdownItemView1}>
        <Text style={[style.itemTxt, { color: colors.text }]}>
          {item?.name}
        </Text>
        {value.some((val) => val._id === item._id) && (
          <Image source={images.checked} style={{ width: 20, height: 20 }} />
        )}
      </View>
    );
  };

  const [weekDays, setweekDays] = useState([
    {
      value: 1,
      day: "Sunday",
      days: "SUN",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 2,
      day: "Monday",
      days: "MON",
      selected: true,
      start_time: "_",
      end_time: "_",
      slots: [{ start_time: "09:00", end_time: "18:00" }],
    },
    {
      value: 3,
      day: "Tuesday",
      days: "TUE",
      selected: true,
      start_time: "_",
      end_time: "_",
      slots: [{ start_time: "09:00", end_time: "18:00" }],
    },
    {
      value: 4,
      day: "Wednesday",
      days: "WED",
      selected: true,
      start_time: "_",
      end_time: "_",
      slots: [{ start_time: "09:00", end_time: "18:00" }],
    },
    {
      value: 5,
      days: "THU",
      day: "Thursday",
      selected: true,
      start_time: "_",
      end_time: "_",
      slots: [{ start_time: "09:00", end_time: "18:00" }],
    },
    {
      value: 6,
      days: "FRI",
      day: "Friday",
      selected: true,
      start_time: "_",
      end_time: "_",
      slots: [{ start_time: "09:00", end_time: "18:00" }],
    },
    {
      value: 7,
      days: "SAT",
      day: "Saturday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
  ]);

  const postTherapistAvailability = async () => {
    var availData = weekDays;
    let isValid = true;
    let mappedData = availData?.map((i, j) => {
      if (i.slots?.length > 0) {
        return {
          day: i?.day,
          slots: i.slots.map((value) => {
            if (value.start_time !== "_" && value.end_time !== "_") {
              const startTime = moment(value.start_time, "HH:mm");
              const endTime = moment(value.end_time, "HH:mm");

              if (endTime.isBefore(startTime)) {
                isValid = false;
                AppUtils.showToast(
                  "Closing hour cannot be before opening hour."
                );
              } else if (endTime.isSame(startTime)) {
                isValid = false;
                AppUtils.showToast(
                  "Opening and closing hours cannot be the same."
                );
              }
            }
            let time = `${moment().format("YYYY-MM-DD")}T${
              value.start_time
            }:00`;
            const localMoment = moment(time).utc().format("HH:mm");

            let time2 = `${moment().format("YYYY-MM-DD")}T${value.end_time}:00`;
            const localMoment2 = moment(time2).utc().format("HH:mm");

            return { start_time: localMoment, end_time: localMoment2 };
          }),
        };
      } else {
        return { day: i?.day, slots: [] };
      }
    });
    res = await postAvailability(JSON.stringify(mappedData), token);
    if (res?.data?.status) {
      getProfile();
      // navigation.navigate(AppRoutes.TherapistProfile);
      // AppUtils.showToast(res?.data?.message);
    } else {
      //AppUtils.showToast(res?.data?.message);
    }
  };

  useEffect(() => {
    // getProfile()
    if (user?.type == "therapist" && userData?.specialization?.length == 0) {
      setTimeout(() => {
        setshowSpecialization(true);
      }, 1500);
    }
  }, [user, userData]);

  useEffect(() => {
    // getProfile()
    if (user?.type == "therapist" || user?.type == "user") {
      if (user?.type == "therapist") {
        messaging().subscribeToTopic("therapistTopic");
      } else {
        messaging().subscribeToTopic("userTopic");
      }
    }
  }, [user]);

  // useEffect(() => {
  //   if (user?.type == "therapist" && userData?.availability?.length == 0) {
  //     postTherapistAvailability();
  //   }
  // }, [user, userData]);

  const getUserDetails = async () => {
    try {
      let res = null;
      res = await get_User_Profile(token);
      if (res?.data?.status) {
        dispatch(setuserData(res?.data?.data));
        // console.log("AAAAAAAA",res?.data?.other?.unread_count);
        setread_count(res?.data?.other?.unread_count);
      } else {
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      AppUtils.showToast(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user?.type == "therapist") {
        theraPastAppointment();
        therapist_Up_Appointment();
        dispatch(setdrawerSelectedTab("Home"));
      } else {
        user_Past_Appointment();
        user_Up_Appointment();
        dispatch(setdrawerSelectedTab("Home"));
      }

      return () => {
        // setpaused(true)
        // stopTracking(); // Stop tracking when the screen is unfocused
      };
    }, [])
  );

  // useEffect(() => {

  //   console.log( user.type," user.type user.type user.type user.type user.type user.type user.type");
  //   if (focus && user.type == 'therapist') {

  //     theraPastAppointment()
  //     therapist_Up_Appointment()
  //     dispatch(setdrawerSelectedTab("Home"))
  //   } else {
  //     user_Past_Appointment()
  //     user_Up_Appointment()
  //     dispatch(setdrawerSelectedTab("Home"))
  //   }
  // }, [focus])

  useEffect(() => {
    setImg(userData?.profile_pic?.includes("https") ? userData?.profile_pic : userData?.profile_pic ? getEnvVars().fileUrl + userData?.profile_pic : "")
    dispatch(SetinitialRouteName("Home"));
  }, [userData]);

  useEffect(() => {
    if (therapistSearchModal) {
      setTimeout(() => {
        setServiceCall(true);
        dispatch(SetinitialRouteName("Home"));
      }, 3000);
    } else {
      dispatch(SetinitialRouteName("Home"));
    }
  }, [therapistSearchModal]);

  const theraPastAppointment = async () => {
    try {
      let res = null;
      res = await therapistPastAppointment(currentDateTime, page, limit, token);
      if (res?.data?.status) {
        settherapistPast(res?.data?.data);
      } else {
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const user_Past_Appointment = async () => {
    try {
      let res = null;
      res = await userPastAppointment(currentDateTime, page, limit, token);
      if (res?.data?.status) {
        setuserPast(res?.data?.data);
      } else {
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const user_Up_Appointment = async () => {
    try {
      let res = null;
      res = await userUpcomingAppointment(currentDateTime, 1, 2, token);
      if (res?.data?.status) {
        setuserUpcoming(res?.data?.data);
      } else {
        setuserUpcoming([]);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const therapist_Up_Appointment = async () => {
    try {
      let res = null;
      res = await therapistUpcomingAppointment(currentDateTime, 1, 2, token);
      if (res?.data?.status) {
        settherapistUpcoming(res?.data?.data);
      } else {
        settherapistUpcoming([]);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const user_Cancel_Appointment = async () => {
    try {
      dispatch(setloader(true));
      let res = null;
      res = await userCancelAppointment(currentDateTime, appointID, token);
      dispatch(setloader(false));
      if (res?.data?.status) {
        user_Up_Appointment();
      } else {
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const therapist_Cancel_Appointment = async () => {
    try {
      dispatch(setloader(true));
      let res = null;
      res = await therapistCancelAppointment(currentDateTime, appointID, token);
      dispatch(setloader(false));
      if (res?.data?.status) {
        therapist_Up_Appointment();
      } else {
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const check_OnlineStatus = async (val) => {
    try {
      // console.log(val);
      let res = null;
      let data = {
        is_online: val,
      };
      res = await Update_onlineStatus(data, token);
      if (res?.data?.status) {
        dispatch(setuserData(res?.data?.data));
      } else {
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const acceptCallRequest = async () => {
    try {
      let res = null;
      res = await therapistAcceptCall(
        currentDateTime,
        userDetail?.appointment_id,
        token
      );
      if (res?.data?.status) {
        dispatch(settherapistSearchModal(false));
        navigation?.navigate(AppRoutes.Video, { from: "other" });
      } else {
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const rejectCallRequest = async () => {
    try {
      let res = null;
      res = await therapistRejectCall(
        currentDateTime,
        userDetail?.appointment_id,
        token
      );
      if (res?.data?.status) {
        AppUtils.showToast(res?.data?.message);
        dispatch(settherapistSearchModal(false));
      } else {
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  function searchItemList(text) {
    const new_item =
      user?.type === "user"
        ? userPast.filter((item) => {
            const itemData = item?.therapist_detail?.name?.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          })
        : therapistPast.filter((item) => {
            const itemData = item?.user_detail?.name?.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });

    if (text.length !== 0) {
      setsearchData([...new_item]);
      setisSearching(true);
    } else {
      setsearchData([]);
      setisSearching(false);
    }
  }
  const currentTimeZone = RNLocalize.getTimeZone();

  const updateTherapistDetail = async () => {
    try {
      const specializationIds = value.map((item) => item._id);

      let formData = new FormData();
      formData.append("education", Education);
      formData.append("experience", Experience);
      formData.append("specialization", JSON.stringify(specializationIds));
      formData.append("timezone", currentTimeZone);
      formData.append("lat", lat);
      formData.append("long", long);
      let res = null;
      res = await update_Therapist_Profile(formData, token);
      if (res?.data?.status) {
        AppUtils.showToast(res?.data?.message);
        dispatch(setuserData(res?.data?.data));
        setshowSpecialization(false);
      } else {
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <SolidView
      view={
        <View style={{ flex: 1 }}>
          {loader && <Loader />}
          <View
            style={[
              style.mainView,
              { backgroundColor: colors.locationdiscription },
            ]}
          >
            <Pressable
              onPress={() => {
                Keyboard.dismiss(), navigation.openDrawer();
              }}
              style={{ padding: 8 }}
            >
              <Image source={images.menu} style={style.menuImg} />
            </Pressable>
            <View style={style.customSwitchView}>
              {user?.type == "therapist" && (
                <CustomSwitch
                  switchLeftText={"Online"}
                  switchRightText={"Offline"}
                  switchLeftTextStyle={style.switchleftTxt}
                  switchRightTextStyle={style.switchRightTxt}
                  switchWidth={75}
                  switchBackgroundColor={"#2EDDCC"}
                  onSwitch={() => {
                    check_OnlineStatus("1");
                  }}
                  onSwitchReverse={() => {
                    check_OnlineStatus("0");
                  }}
                  buttonWidth={30}
                  startOnLeft={isEnabled}
                />
              )}
              <View style={style.NotificationsView}>
                <Pressable
                  style={{
                    alignItems: "center",
                  }}
                  onPress={() => navigation.navigate(AppRoutes.Notifications)}
                >
                  <FastImage source={images.bell} style={style.ballImg} />
                  {read_count > 0 && (
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        backgroundColor: "red",
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: -15,
                        zIndex: 9999,
                        left: 20,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                        }}
                      >
                        {read_count}
                      </Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    user?.type === "user"
                      ? navigation.navigate(AppRoutes.Profile)
                      : navigation.navigate(AppRoutes.TherapistProfile);
                  }}
                >
                  {userData?.profile_pic ? (
                    <FastImage
                      resizeMode="contain"
                      source={{ uri: img }}
                      style={[
                        style.w3Img,
                        { borderColor: colors.therapostblock },
                      ]}
                    />
                  ) : (
                    <FastImage
                      resizeMode="contain"
                      source={images.defaultPic}
                      style={[
                        style.w3Img,
                        { borderColor: colors.therapostblock },
                      ]}
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </View>
          <View style={style.usrNameView}>
            <Text style={[style.userTxt, { color: colors.homePageTitle }]}>
              {user?.type == "user"
                ? "Hi, " + userData?.name
                : "Hi, " + userData?.name}
            </Text>
            <Text style={[style.welcomeTxt, { color: colors.homePageTitle }]}>
              {localization?.appkeys?.welcomeback}
            </Text>

            {/* <View style={style.searchInputView}>
              <TextInput
                value={searchTxt}
                ref={searchTextInputRef}
                placeholderTextColor={"black"}
                placeholder={localization?.appkeys?.search}
                style={style.searchTxtinputStyle}
                onChangeText={setsearchTxt}
              // onChangeText={(t) => {
              //   setsearchTxt(t)
              //   setisSearching(true);
              //   searchItemList(t)
              // }}
              />
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  searchTextInputRef?.current?.focus();
                }}
                style={[
                  style.searchImgView,
                  { backgroundColor: colors.btnColor },
                ]}
              >
                <Image source={images.search} style={style.srchImg} />
              </Pressable>
            </View> */}
            <ScrollView
              nestedScrollEnabled={true}
              refreshControl={
                <RefreshControl
                  refreshing={resfresh}
                  onRefresh={() => {
                    setRefresh(true);
                    if (user?.type == "user") {
                      user_Past_Appointment();
                      user_Up_Appointment();
                    } else {
                      theraPastAppointment();
                      therapist_Up_Appointment();
                    }
                    setRefresh(false);
                  }}
                />
              }
              showsVerticalScrollIndicator={false}
            >
              {user?.type == "user" && (
                <View style={{ marginVertical: 20 }}>
                  <CustomBtn
                    onPress={() => {
                      navigation.navigate(AppRoutes.SelectCategories);
                    }}
                    titleTxt={localization?.appkeys?.booknewtherapist}
                  />
                </View>
              )}
              {(userUpcoming?.length > 0 && user?.type=='user') && (
                <View style={style.appointmentView}>
                  <Text
                    style={[
                      style.upcomingTxt,
                      { color: colors.color_both_Side },
                    ]}
                  >
                    {localization?.appkeys?.upcomingAppointments}
                  </Text>
                  <Pressable
                    onPress={() => {
                      navigation.navigate(AppRoutes.Appointments);
                    }}
                  >
                    <Text
                      style={[
                        style.seeallTxt,
                        { color: colors.color_both_Side },
                      ]}
                    >
                      {localization?.appkeys?.seeall}
                    </Text>
                  </Pressable>
                </View>
              )}
              {(therapistUpcoming?.length > 0 && user?.type=='therapist') && (
                <View style={style.appointmentView}>
                  <Text
                    style={[
                      style.upcomingTxt,
                      { color: colors.color_both_Side },
                    ]}
                  >
                    {localization?.appkeys?.upcomingAppointments}
                  </Text>
                  <Pressable
                    onPress={() => {
                      navigation.navigate(AppRoutes.Appointments);
                    }}
                  >
                    <Text
                      style={[
                        style.seeallTxt,
                        { color: colors.color_both_Side },
                      ]}
                    >
                      {localization?.appkeys?.seeall}
                    </Text>
                  </Pressable>
                </View>
              )}

              <FlatList
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                data={
                  user?.type == "user"
                    ? userUpcoming?.filter((i) =>
                        i?.therapist_detail?.name
                          ?.toLowerCase()
                          .includes(searchTxt?.toLowerCase())
                      )
                    : therapistUpcoming?.filter((i) =>
                        i?.user_detail?.name
                          ?.toLowerCase()
                          .includes(searchTxt?.toLowerCase())
                      )
                }
                // ListEmptyComponent={() => {
                //   return !loading ? (
                //     <View style={style.loaderView}>
                //       <Text style={{ textAlign: 'center', marginTop: 20, fontFamily: AppFonts.SemiBold, color: colors.text }}> No Data Found</Text>
                //     </View>
                //   ) : null;
                // }}

                // scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <UpcomingAppointment
                    showCancel={() => setShowCancel(true)}
                    type={user?.type}
                    item={item}
                    index={index}
                    handleCancelAppointment={(i) => {
                      setappointID(i);
                      setShowCancel(true);
                    }}
                    handleupcomingAppointment={() => {
                      if (user?.type == "user") {
                        navigation.navigate(AppRoutes.Therapist, {
                          item: {
                            ...item,
                            _id: item?.therapist_detail?._id,
                            name: item?.therapist_detail?.name,
                            profile_pic: item?.therapist_detail?.profile_pic,
                            appointmentID: item?._id,
                          },
                        });
                      }
                    }}
                  />
                )}
              />
              {therapistPast?.length > 0 && user?.type == "therapist" && (
                <View style={style.PastAppointmentView}>
                  <Text
                    style={[
                      style.upcomingTxt,
                      { color: colors.color_both_Side },
                    ]}
                  >
                    {localization?.appkeys?.pastappointments}
                  </Text>
                  <Pressable
                    onPress={() => {
                      navigation.navigate(AppRoutes.Appointments,{
                        Upcoming:true
                      });
                    }}
                  >
                    <Text
                      style={[
                        style.seeallTxt,
                        { color: colors.color_both_Side },
                      ]}
                    >
                      {localization?.appkeys?.seeall}
                    </Text>
                  </Pressable>
                </View>
              )}
              {userPast?.length > 0 && user?.type == "user" && (
                <View style={style.PastAppointmentView}>
                  <Text
                    style={[
                      style.upcomingTxt,
                      { color: colors.color_both_Side },
                    ]}
                  >
                    {localization?.appkeys?.pastappointments}
                  </Text>
                  <Pressable
                    onPress={() => {
                      navigation.navigate(AppRoutes.Appointments,{
                        Upcoming:true
                      });
                    }}
                  >
                    <Text
                      style={[
                        style.seeallTxt,
                        { color: colors.color_both_Side },
                      ]}
                    >
                      {localization?.appkeys?.seeall}
                    </Text>
                  </Pressable>
                </View>
              )}

              <FlatList
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                data={
                  user?.type == "therapist"
                    ? therapistPast?.filter((i) =>
                        i?.user_detail?.name
                          ?.toLowerCase()
                          .includes(searchTxt?.toLowerCase())
                      )
                    : 
                    userPast?.filter((i) =>
                        i?.therapist_detail?.name
                          ?.toLowerCase()
                          .includes(searchTxt?.toLowerCase())
                      )
                }
                renderItem={({ item, index }) => (
                  (
                    <PastAppointment
                      onChat={() =>
                        navigation.navigate(AppRoutes.ChatScreen, {
                          otherUserId: item?.user_detail?._id,
                          otherUserName: item?.user_detail?.name,
                          otherUserProfile:
                            item?.user_detail?.profile_pic ?? "",
                          appointmentID: item?._id,
                        })
                      }
                      type={user?.type}
                      item={item}
                      index={index}
                      handleupcomingAppointment={() => {
                        if (user?.type == "user") {
                          navigation.navigate(AppRoutes.Therapist, {
                            item: {
                              ...item,
                              _id: item?.therapist_detail?._id,
                              name: item?.therapist_detail?.name,
                              profile_pic: item?.therapist_detail?.profile_pic,
                              appointmentID: item?._id,
                            },
                          });
                        }
                      }}
                      onvideoPress={() => {
                        navigation.navigate(AppRoutes.Video, {
                          from: "profile",
                        });
                      }}
                      onpressBookAgain={() => {
                        const specializationId = item?.specialization[0]?._id;
                        navigation.navigate(AppRoutes.SelectTimeAndDate, {
                          therapist_id: item?.therapist_detail?._id,
                          specializationId: specializationId,
                        });
                      }}
                    />
                  )
                )}
              />

              {isSearching && searchData?.length === 0 && (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    fontFamily: AppFonts.SemiBold,
                    color: colors.text,
                  }}
                >
                  No Data Found
                </Text>
              )}
            </ScrollView>
          </View>
          <Modal transparent visible={showSpecialization}>
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.8)",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  margin: 10,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={[
                    style.specializationTxt1,
                    {
                      color: colors.text,
                      alignSelf: "center",
                      fontSize: 16,
                      fontFamily: AppFonts.Bold,
                    },
                  ]}
                >
                  {"Complete your profile"}
                </Text>
                {
                  <View>
                    <CustomInput
                      marginTop={1}
                      value={Education}
                      onChangeText={setEducation}
                      title={localization?.appkeys?.Education}
                    />
                    <View style={{ marginTop: 10 }}>
                      <Text
                        style={[
                          style.specializationTxt1,
                          { color: colors.text },
                        ]}
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
                          style.dropdown1,
                          { borderColor: colors.tabbordercolor },
                        ]}
                        selectedTextStyle={style.selectedTextStyle1}
                        iconStyle={style.iconStyle1}
                        activeColor="#310B831A"
                        containerStyle={style.containerStyle1}
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
                              style={[
                                style.arrow1,
                                { tintColor: colors.btnColor },
                              ]}
                            />
                          ) : (
                            <Image
                              source={images.downArrow}
                              style={[
                                style.arrow1,
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
                      marginTop={1}
                      value={Experience}
                      onChangeText={setExperience}
                      title={localization?.appkeys?.Experience}
                      yearTxt={localization?.appkeys?.Yrs}
                      keyboardType={"decimal-pad"}
                    />
                  </View>
                }
                <CustomBtn
                  onPress={() => {
                    if (
                      Education?.trim() &&
                      Experience?.trim() &&
                      value?.length > 0
                    ) {
                      updateTherapistDetail();
                    } else {
                      AppUtils.showToast("Please fill all details!");
                    }
                  }}
                  btnStyle={{ marginTop: 20, marginBottom: 10 }}
                  titleTxt={"Save"}
                />
              </View>
            </View>
          </Modal>
          <CancelAppointment
            isVisible={showCancel}
            onBackDropPress={() => {
              setShowCancel(false);
            }}
            onPressYes={() => {
              if (user?.type == "user") {
                user_Cancel_Appointment();
                setShowCancel(false);
              } else {
                therapist_Cancel_Appointment();
                setShowCancel(false);
              }
            }}
          />
          {therapistSearchModal && (
            <ServiceCall
              appointmentID={userDetail?.appointment_id}
              serviceCallImg={userDetail?.user_detail?.profile_pic}
              isVisible={therapistSearchModal}
              onPressAccept={() => {
                acceptCallRequest();
              }}
              onBackDropPress={() => {
                rejectCallRequest();
              }}
            />
          )}
        </View>
      }
    />
  );
}
const style = StyleSheet.create({
  PastAppointmentView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },
  seeallTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Medium,
    alignSelf: "center",
  },
  loaderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataFoundText: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: AppFonts.SemiBold,
    alignSelf: "center",
  },
  appointmentView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  srchImg: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    alignSelf: "center",
  },
  upcomingTxt: {
    fontSize: 17,
    fontFamily: AppFonts.SemiBold,
  },
  searchImgView: {
    borderRadius: 4,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  searchTxtinputStyle: {
    height: 50,
    fontSize: 15,
    marginLeft: 8,
    fontFamily: AppFonts.Regular,
    width: "82%",
    alignSelf: "center",
    color: "black",
  },
  searchInputView: {
    width: "100%",
    height: 50,
    borderWidth: 1.5,
    borderColor: "#26333B26",
    borderRadius: 4,
    marginTop: 30,
    marginBottom: 20,
    padding: 4,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  welcomeTxt: {
    fontSize: 25,
    fontFamily: AppFonts.Bold,
  },
  userTxt: {
    fontSize: 22,
    fontFamily: AppFonts.Regular,
  },
  usrNameView: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 30,
    marginTop: -30,
    padding: 20,
  },
  ballImg: {
    width: 24,
    height: 24,
    marginHorizontal: 12,
    resizeMode: "contain",
    alignSelf: "center",
  },
  w3Img: {
    width: 30,
    borderWidth: 1.5,
    borderColor: "white",
    height: 30,
    borderRadius: 15,
    resizeMode: "cover",
    alignSelf: "center",
  },
  switchleftTxt: {
    color: "white",
    fontSize: 9,
    fontFamily: AppFonts.Medium,
    marginLeft: 5,
  },
  switchRightTxt: {
    color: "red",
    fontSize: 9,
    fontFamily: AppFonts.Medium,
    marginRight: 5,
  },
  NotificationsView: {
    alignItems: "center",
    flexDirection: "row",
  },
  customSwitchView: {
    flexDirection: "row",
    height: 32,
    marginTop: 2,
  },
  mainView: {
    padding: 16,
    width: "100%",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuImg: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },

  parent1: {
    flex: 1,
    justifyContent: "center",
  },
  iconStyle1: {
    marginRight: 5,
  },
  specializationTxt1: {
    fontFamily: AppFonts.SemiBold,
    fontSize: 12,
    marginLeft: 12,
    marginBottom: 4,
  },
  dropdown1: {
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
  acceptTopView1: {
    flexDirection: "row",
    margin: 8,
  },
  dropdownItemView1: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iAcceptTxt1: {
    fontSize: 12,
    fontFamily: AppFonts.Regular,
    marginTop: 2,
  },
  termsTxt1: {
    fontSize: 12,
    fontFamily: AppFonts.SemiBold,
    alignSelf: "center",
  },
  alreadyHaveTxt1: {
    fontSize: 12,
    fontFamily: AppFonts.Medium,
    alignSelf: "center",
    marginTop: 8,
  },
  flag1: {
    height: 30,
    width: 30,
    marginLeft: 10,
    marginRight: 20,
    resizeMode: "contain",
  },
  acceptImg1: {
    width: 20,
    height: 20,
    alignSelf: "center",
    marginRight: 8,
  },
  byCreatingTxt1: {
    fontSize: 11,
    width: "80%",
    alignSelf: "center",
    textAlign: "center",
  },
  emptyView1: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 25,
  },
  signInTxt1: {
    fontSize: 12,
    fontFamily: AppFonts.SemiBold,
    alignSelf: "center",
  },
  bottomView1: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  privacyTxt1: {
    fontSize: 10,
    fontFamily: AppFonts.Bold,
  },

  therapistView1: {
    alignSelf: "center",
    marginTop: 20,
  },

  mainView1: {
    flex: 1,
    paddingHorizontal: 16,
  },

  img1: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },

  selectedTextStyle1: {
    fontSize: 16,
    color: "#202020",
    fontFamily: AppFonts.Medium,
  },
  containerStyle1: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "grey",
  },

  arrow1: {
    width: 14,
    height: 14,
    resizeMode: "contain",
    marginRight: 8,
  },
});
export default Home;
