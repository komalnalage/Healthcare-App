import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { LocalizationContext } from "../../localization/localization";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import { useIsFocused, useTheme } from "@react-navigation/native";
import CancelAppointment from "../modals/CancelAppointment";
import UpcomingAppointment from "../components/UpcomingAppointment";
import PastAppointment from "../components/PastAppointment";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import {
  therapistCancelAppointment,
  therapistPastAppointment,
  therapistUpcomingAppointment,
  userCancelAppointment,
  userPastAppointment,
  userUpcomingAppointment,
} from "../../api/Services/services";
import moment from "moment";
import Loader from "../modals/Loader";
import {
  setdrawerSelectedTab,
  setloader,
} from "../../redux/Reducers/UserNewData";

const Appointments = ({ navigation, route }) => {
  const loader = useSelector((state) => state.userNewData.loader);
  const user = useSelector((state) => state.userData.user);
  const token = useSelector((state) => state.userData.token);
  const routeData = route?.params?.Upcoming;
  let dispatch = useDispatch();
  let focus = useIsFocused();

  const userDetail = useSelector((state) => state.userData.userDetail);
  const { localization } = useContext(LocalizationContext);
  const [isUpcoming, setIsUpcoming] = useState(true);
  const { colors, images } = useTheme();
  const [showCancel, setShowCancel] = useState(false);
  const [therapistPast, settherapistPast] = useState([]);
  const currentDateTime = moment().utc();
  const [userUpcoming, setuserUpcoming] = useState([]);
  const [therapistUpcoming, settherapistUpcoming] = useState([]);
  const [userPast, setuserPast] = useState([]);
  const [appointID, setappointID] = useState("");
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [resfresh, setRefresh] = useState(false);

  useEffect(() => {
    dispatch(setloader(true));
    setTimeout(() => {
      dispatch(setloader(false));
    }, 2000);
  }, []);

  useEffect(() => {
    if (routeData) {
      setIsUpcoming(false);
    } else {
      setIsUpcoming(true);
    }
  }, [routeData]);

  useEffect(() => {
    if (focus && user?.type == "therapist") {
      theraPastAppointment();
      therapist_Up_Appointment();
    } else {
      user_Past_Appointment();
      user_Up_Appointment();
    }
  }, [focus]);

  useEffect(() => {
    dispatch(
      setdrawerSelectedTab(
        user?.type == "user" ? "My Appointments" : "Appointments"
      )
    );
  }, [user]);

  const user_Up_Appointment = async () => {
    let res = null;
    res = await userUpcomingAppointment(currentDateTime, page, "", token);
    if (res?.data?.status) {
      setuserUpcoming(res?.data?.data);
    } else {
      setuserUpcoming([]);
    }
  };

  const therapist_Up_Appointment = async () => {
    let res = null;
    res = await therapistUpcomingAppointment(currentDateTime, page, "", token);
    if (res?.data?.status) {
      settherapistUpcoming(res?.data?.data);
    } else {
      settherapistUpcoming([]);
    }
  };

  const user_Past_Appointment = async () => {
    let res = null;
    res = await userPastAppointment(currentDateTime, page, "", token);
    if (res?.data?.status) {
      setuserPast(res?.data?.data);
    } else {
      setuserPast([]);
    }
  };

  const theraPastAppointment = async () => {
    let res = null;
    res = await therapistPastAppointment(currentDateTime, page, "", token);
    if (res?.data?.status) {
      settherapistPast(res?.data?.data);
    } else {
      settherapistPast([]);
    }
  };

  const user_Cancel_Appointment = async () => {
    let res = null;
    res = await userCancelAppointment(currentDateTime, appointID, token);
    if (res?.data?.status) {
      user_Up_Appointment();
    } else {
    }
  };

  const therapist_Cancel_Appointment = async () => {
    let res = null;
    res = await therapistCancelAppointment(currentDateTime, appointID, token);
    if (res?.data?.status) {
      therapist_Up_Appointment();
    } else {
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (user?.type == "user") {
      user_Past_Appointment();
      user_Up_Appointment();
    } else {
      theraPastAppointment();
      therapist_Up_Appointment();
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SolidView
      view={
        <>
          {loader && <Loader />}
          <Header
            title={localization?.appkeys?.appointments}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
          <View style={[style.topView, { borderColor: colors.tabbordercolor }]}>
            <Pressable
              onPress={() => setIsUpcoming(true)}
              style={[
                style.viewHighlight,
                {
                  backgroundColor: isUpcoming
                    ? colors.locationdiscription
                    : "rgba(38,51,59,0.05)",
                },
              ]}
            >
              <Text
                style={[
                  style.textHighlight,
                  { color: isUpcoming ? "white" : colors.locationdiscription },
                ]}
              >
                {localization.appkeys.upcoming}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsUpcoming(false)}
              style={[
                style.viewHighlight,
                {
                  backgroundColor: isUpcoming
                    ? "rgba(38,51,59,0.05)"
                    : colors.locationdiscription,
                },
              ]}
            >
              <Text
                style={[
                  style.textHighlight,
                  { color: isUpcoming ? colors.locationdiscription : "white" },
                ]}
              >
                {localization.appkeys.past}
              </Text>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignContent: "center",
              justifyContent: "center",
            }}
            nestedScrollEnabled
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  onRefresh();
                }}
              />
            }
            style={{ flex: 1 }}
          >
            <View style={{ marginHorizontal: 16,flex:1 }}>
              {isUpcoming && (
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  // data={[]}
                  data={user?.type == "user" ? userUpcoming : therapistUpcoming}
                  contentContainerStyle={{
                    marginBottom: 20,
                    flex:1
                  }}
                  ListEmptyComponent={() => {
                    return !loader ? (
                      <View style={style.loaderView}>
                        <Text
                          style={{
                            textAlign: "center",
                            fontFamily: AppFonts.SemiBold,
                            color: colors.text,
                          }}
                        >
                          {" "}
                          {localization?.appkeys?.NoAppointment}
                        </Text>
                      </View>
                    ) : null;
                  }}
                  scrollEnabled={false}
                  renderItem={({ item, index }) =>
                    isUpcoming && (
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
                                profile_pic:
                                  item?.therapist_detail?.profile_pic,
                                appointmentID: item?._id,
                              },
                            });
                          } else {
                          }
                        }}
                      />
                    )
                  }
                />
              )}
              {!isUpcoming && (
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={user?.type == "therapist" ? therapistPast : userPast}
                  contentContainerStyle={{
                    marginBottom: 20,
                    flex:1
                  }}
                  ListEmptyComponent={() => {
                    return !loader ? (
                      <View style={style.loaderView}>
                        <Text
                          style={{
                            textAlign: "center",
                            fontFamily: AppFonts.SemiBold,
                            color: colors.text,
                          }}
                        >
                          {" "}
                          {localization?.appkeys?.NoAppointment}
                        </Text>
                      </View>
                    ) : null;
                  }}
                  scrollEnabled={false}
                  renderItem={({ item, index }) =>
                    !isUpcoming && (
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
                                profile_pic:
                                  item?.therapist_detail?.profile_pic,
                                appointmentID: item?._id,
                              },
                            });
                          } else {
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
                  }
                />
              )}
            </View>

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
          </ScrollView>
        </>
      }
    />
  );
};

export default Appointments;

const style = StyleSheet.create({
  loaderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topView: {
    width: "92%",
    padding: 4,
    height: 58,
    alignSelf: "center",
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1.5,
    backgroundColor: "white",
    flexDirection: "row",
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
});
