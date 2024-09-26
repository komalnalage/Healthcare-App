import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AppFonts from "../../constants/fonts";
import { useTheme } from "@react-navigation/native";
import SolidView from "../components/SolidView";
import Header from "../components/Header";
import { LocalizationContext } from "../../localization/localization";
import CustomBtn from "../components/CustomBtn";
import EditTiming from "../modals/EditTiming";
import { wp } from "../../utils/dimension";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import { getAvailability, postAvailability } from "../../api/Services/services";
import { useDispatch, useSelector } from "react-redux";
import AppUtils from "../../utils/appUtils";
import DropBox from "../components/DropBox";
import * as RNLocalize from "react-native-localize";
import moment from "moment";
import moment2 from "moment-timezone";
import FastImage from "react-native-fast-image";
import Loader from "../modals/Loader";
import { setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const Availability = ({ navigation }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userData.token);
  const [loading, setLoading] = useState(false);
  const loader = useSelector((state) => state.userNewData.loader);

  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const [showCancel, setShowCancel] = useState(false);
  const [availabilityData, setavailabilityData] = useState([]);
  const [checked, setchecked] = useState(false);
  const currentTimeZone = RNLocalize.getTimeZone();

  useEffect(() => {
    getTherapistAvailability();
  }, []);

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
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 3,
      day: "Tuesday",
      days: "TUE",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 4,
      day: "Wednesday",
      days: "WED",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 5,
      days: "THU",
      day: "Thursday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 6,
      days: "FRI",
      day: "Friday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
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

  const getTherapistAvailability = async () => {
    let res = null;
    res = await getAvailability(token);
    console.log("getTherapistAvailability res", res?.data);
    if (res?.data?.status) {
      let availableData = res?.data?.data.map((i, j) => {
        if (i?.slots?.length > 0) {
          return {
            day: i?.day,
            selected: true,
            slots: i.slots.map((value) => {
              const currentTimeZone1 = moment2.tz.guess();
              const gmtMoment1 = moment2.tz(value.start_time, "HH:mm", "UTC");
              const localTime1 = gmtMoment1.clone().tz(currentTimeZone1);

              const currentTimeZone = moment2.tz.guess();
              const gmtMoment = moment2.tz(value.end_time, "HH:mm", "UTC");
              const localTime = gmtMoment.clone().tz(currentTimeZone);

              return {
                start_time: localTime1.format("HH:mm"),
                end_time: localTime.format("HH:mm"),
              };
            }),
          };
        } else {
          return { day: i?.day, slots: [], selected: false };
        }
      });
      setweekDays(availableData);
    } else {
      setavailabilityData([
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
          selected: false,
          start_time: "_",
          end_time: "_",
          slots: [],
        },
        {
          value: 3,
          day: "Tuesday",
          days: "TUE",
          selected: false,
          start_time: "_",
          end_time: "_",
          slots: [],
        },
        {
          value: 4,
          day: "Wednesday",
          days: "WED",
          selected: false,
          start_time: "_",
          end_time: "_",
          slots: [],
        },
        {
          value: 5,
          days: "THU",
          day: "Thursday",
          selected: false,
          start_time: "_",
          end_time: "_",
          slots: [],
        },
        {
          value: 6,
          days: "FRI",
          day: "Friday",
          selected: false,
          start_time: "_",
          end_time: "_",
          slots: [],
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
    }
  };
  const [check, setcheck] = useState(false);

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
    console.log("postAvailability response", res?.data);
    if (res?.data?.status) {
      dispatch(setloader(false));
      setTimeout(() => {
        navigation.navigate(AppRoutes.TherapistProfile);
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
        <>
          {loader && <Loader />}
          <Header
            title={localization?.appkeys?.EditTiming}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
        <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            style={style.mainView}
          >
            <FlatList
              contentContainerStyle={{}}
              style={{
                height: heightPercentageToDP(75),
              }}
              data={weekDays}
              renderItem={({ item, index }) => {
                console.log("item", item);
                let ind = index;
                return (
                  <View
                    style={{
                      marginTop: 5,
                      marginHorizontal: 25,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          onPress={() => {
                            if (item?.selected) {
                              let data = [...weekDays];
                              data[index] = {
                                ...data[index],
                                selected: false,
                                slots: [],
                              };
                              setweekDays(data);
                            } else {
                              let data = [...weekDays];
                              data[index] = {
                                ...data[index],
                                selected: true,
                                slots: [
                                  { start_time: "09:00", end_time: "18:00" },
                                ],
                              };
                              setweekDays(data);
                            }
                          }}
                        >
                          <FastImage
                            //   tintColor={!item?.selected ? "#d7d7d7" : null}
                            source={
                              !item?.selected
                                ? require("../../assets/uncheck.png")
                                : require("../../assets/tick1.png")
                            }
                            style={{ height: 16, width: 16, top: 4 }}
                          ></FastImage>
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: 10,
                            color: colors.text,
                            fontSize: 14,
                            fontFamily: AppFonts.Bold,
                          }}
                        >
                          {item.day}
                        </Text>
                      </View>
                      {!item?.selected && (
                        <View
                          style={{
                            marginLeft: -10,
                            position: "absolute",
                            left: "45%",
                          }}
                        >
                          <Text
                            style={{
                              color: colors.border,
                              fontSize: 15,
                              fontFamily: AppFonts.Medium,
                            }}
                          >
                            Unavailable
                          </Text>
                        </View>
                      )}
                      <View
                        style={{
                          width: 45,
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            let data = [...weekDays];
                            data[index] = {
                              ...data[index],
                              selected: true,
                              slots: [
                                ...data[index].slots,
                                { start_time: "09:00", end_time: "18:00" },
                              ],
                            };
                            setweekDays(data);
                          }}
                        >
                          <FastImage
                            source={require("../../assets/add1.png")}
                            style={{
                              height: 20,
                              width: 20,
                            }}
                          ></FastImage>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={
                        {
                          // position: "absolute",
                          //  marginLeft: 90,
                          // backgroundColor:"red",
                        }
                      }
                    >
                      {item?.selected && (
                        <View style={{}}>
                          <FlatList
                            style={
                              {
                                // flex: 1,
                              }
                            }
                            contentContainerStyle={{ flex: 1 }}
                            renderItem={({ item, index }) => {
                              return (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 10,
                                    // backgroundColor:"red",
                                  }}
                                >
                                  <DropBox
                                    onSelect={(i) => {
                                      let data = [...weekDays];
                                      data[ind].slots[index] = {
                                        ...data[ind].slots[index],
                                        start_time: i,
                                      };
                                      setweekDays([...data]);
                                    }}
                                    onSelect1={(i) => {
                                      let data = [...weekDays];
                                      data[ind].slots[index] = {
                                        ...data[ind].slots[index],
                                        end_time: i,
                                      };
                                      setweekDays([...data]);
                                    }}
                                    defaultValue={moment(
                                      item?.start_time,
                                      "HH:mm"
                                    ).format("hh:mm A")}
                                    defaultValue1={moment(
                                      item?.end_time,
                                      "HH:mm"
                                    ).format("hh:mm A")}
                                    availabilityData={availabilityData}
                                    onChange={(i) => {
                                      setavailabilityData(i);
                                    }}
                                  ></DropBox>

                                  <TouchableOpacity
                                    onPress={() => {
                                      if (weekDays[ind]?.slots?.length == 1) {
                                        let data = [...weekDays];
                                        data[ind].slots.splice(index, 1);
                                        data[ind] = {
                                          ...data[ind],
                                          selected: false,
                                        };
                                        setweekDays([...data]);
                                      } else {
                                        let data = [...weekDays];
                                        data[ind].slots.splice(index, 1);
                                        setweekDays([...data]);
                                      }
                                    }}
                                    style={{
                                      marginLeft: 15,
                                      backgroundColor: "white",
                                      shadowColor: "#000",
                                      shadowOffset: {
                                        width: 0,
                                        height: 2,
                                      },
                                      shadowOpacity: 0.25,
                                      shadowRadius: 3.84,

                                      elevation: 5,
                                      height: 45,
                                      top: -5,
                                      width: 45,
                                      borderRadius: 5,
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <FastImage
                                      resizeMode="contain"
                                      source={require("../../assets/delete.png")}
                                      style={{ height: 20, width: 20 }}
                                    ></FastImage>
                                  </TouchableOpacity>
                                </View>
                              );
                            }}
                            data={item?.slots}
                          ></FlatList>
                        </View>
                      )}
                    </View>
                  </View>
                );
              }}
            ></FlatList>
            <View style={{
              flex:1
            }}></View>
            <View
              style={{
                // marginBottom:10
                // bottom: 40,
                // marginBottom:20,
                // backgroundColor:'red',
                // paddingBottom:20
              }}
            >
              <CustomBtn
                onPress={() => {
                  postTherapistAvailability();
                }}
                titleTxt={localization?.appkeys?.Addavailability}
              />
            </View>
            <EditTiming
              isVisible={showCancel}
              onBackDropPress={() => {
                setShowCancel(false);
              }}
            />
          </ScrollView>
        </>
      }
    />
  );
};
const style = StyleSheet.create({
  textStyle: {
    fontSize: 18,
    fontFamily: AppFonts.SemiBold,
    marginTop: 30,
  },
  selectAllTxt: {
    fontFamily: AppFonts.SemiBold,
    fontSize: 14,
    marginLeft: 10,
  },
  checkImage: {
    height: heightPercentageToDP(7),
    width: widthPercentageToDP(7),
    resizeMode: "contain",
  },
  timeTxt: {
    fontFamily: AppFonts.Medium,
    fontSize: 16,
  },
  hourView: {
    height: 60,
    width: wp(43),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  checkView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 5,
  },
  arrowImg: {
    height: heightPercentageToDP(4),
    width: widthPercentageToDP(4),
    resizeMode: "contain",
  },
  updateButtonView: {
    paddingBottom: 40,
    marginTop: 40,
  },
  dropdownInnerView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownView: {
    paddingHorizontal: 20,
  },
  topView: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  dayTxt: {
    fontSize: 15,
    fontFamily: AppFonts.Medium,
    marginLeft: 15,
  },
  emptyImg: {
    height: heightPercentageToDP(1.7),
    width: heightPercentageToDP(1.7),
  },
  availabletxt: {
    fontSize: 18,
    fontFamily: AppFonts.SemiBold,
    marginTop: 30,
  },
  mainView: {
    flex: 1,
    // backgroundColor: "red",
  },
  dropdown: {
    height: 40,
    width: "100%",
    paddingHorizontal: 15,
    marginTop: -5,
  },
  parentView: {
    width: "100%",
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: "#000",
    backgroundColor: "white",
    padding: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  clickableStyle: {
    height: heightPercentageToDP(4),
    width: heightPercentageToDP(4),
    borderRadius: 10,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Availability;
