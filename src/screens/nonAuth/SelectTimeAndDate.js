import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import AppFonts from "../../constants/fonts";
import { useTheme } from "@react-navigation/native";
import SolidView from "../components/SolidView";
import { LocalizationContext } from "../../localization/localization";
import Header from "../components/Header";
import CustomBtn from "../components/CustomBtn";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import Loader from "../modals/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getTimeSlot, scheduleAppointment } from "../../api/Services/services";
import { hp } from "../../utils/dimension";
import AppUtils from "../../utils/appUtils";
import BookAppointment from "../modals/BookAppointment";
import RNCalendarEvents from "react-native-calendar-events";
import moment from "moment-timezone";
import moment1 from "moment-timezone";
import { setloading } from "../../redux/Reducers/userData";
import { setloader } from "../../redux/Reducers/UserNewData";

const currentDate = moment1();
const daysOfWeek = [];
for (let i = 0; i < 7; i++) {
  const nextDay = currentDate.clone().add(i, "days");
  console.log(nextDay);
  daysOfWeek.push({
    day: nextDay.format("ddd"),
    number: nextDay.date().toString(),
  });
}

export default function SelectTimeAndDate({ navigation, route }) {
  const token = useSelector((state) => state.userData.token);
  const currentMonth = moment().format("MMMM YYYY");
  const therapist_id = route?.params?.therapist_id;
  const specialization_ids = route?.params?.specializationId;
  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const loader = useSelector((state) => state.userNewData.loader);
  const [select, setselect] = useState("0");
  const [timing, settiming] = useState([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(-1);
  const [showCancel, setShowCancel] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const currentDateTime = moment().startOf("day");
    const currentDateTimeFormatted = currentDateTime
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    getTherapistTimeSlot(currentDateTimeFormatted);
    let current_momment = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    setSelectedDate(current_momment);
  }, []);

  const save = async (data) => {
    RNCalendarEvents?.checkPermissions()
      .then((res) => {
        if (res == "authorized") {
          addeventcalendar(data);
        } else {
          setTimeout(() => {
            dispatch(setloader(false));
          }, 500);
        }
      })
      .catch((err) => {
        // props.navigation.goBack();
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        console.log("err", err);
      });
  };

  const addeventcalendar = async (data) => {
    let t = await RNCalendarEvents.findCalendars();

    setTimeout(() => {
      dispatch(setloader(false));
    }, 500);
    if (t?.length > 0) {
      let calenderid = t?.find((i) => {
        return i.isPrimary === true;
      });

      let startdate =
        Platform.OS == "android"
          ? new Date(data?.dateTime).toISOString()
          : moment(data?.dateTime).toISOString();
      let enddate =
        Platform.OS == "android"
          ? new Date(data?.endDateTime).toISOString()
          : moment(data?.endDateTime).toISOString();
      let time = 30;

      RNCalendarEvents.saveEvent("Hopehelpline", {
        title: "Hopehelpline",
        startDate: startdate,
        endDate: enddate,
        description: "You have scheduled an appointment ",
        // description:
        //   route?.params?.name +
        //   '\n' +
        //   route?.params?.phone +
        //   '\n' +
        //   route?.params?.email,
        calendarId: calenderid?.id,
        // notes:
        //   route?.params?.name +
        //   '\n' +
        //   route?.params?.phone +
        //   '\n' +
        //   route?.params?.email,
        alarms: [{ date: Platform.OS === "ios" ? -time : time }],
        // location: route?.params?.category_name,
      })
        .then((res) => {})
        .catch((err) => {
          console.log("err", err);
        });
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
    }
    setTimeout(() => {
      dispatch(setloader(false));
    }, 500);
  };

  const scheduleRequest = async () => {
    if (!selectedDate) {
      AppUtils.showToast("Please select a date");
      return;
    }
    if (selectedSlotIndex === -1) {
      AppUtils.showToast("Please select a time slot");
      return;
    }
    dispatch(setloader(true));
    const selectedTimeSlot = timing[selectedSlotIndex];
    if (!selectedTimeSlot.is_available) {
      AppUtils.showToast("Selected time slot is not available");
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      return;
    }
    const selectedTime = moment(selectedTimeSlot.slot_date).format("HH:mm:ss");
    const selectedDateTime = moment(`${selectedDate}T${selectedTime}`);
    const selectedDateTimeUTC = selectedDateTime
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const endDateTime = moment(selectedTimeSlot.slot_date).add(30, "minutes");
    const endDateTimeUTC = endDateTime
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    let res = null;

    const data = {
      appointment_date_time: selectedTimeSlot.slot_date,
      therapist_id: therapist_id,
      specialization_ids: specialization_ids,
    };

    res = await scheduleAppointment(data, token);
    console.log("scheduleAppointment res", res);
    if (res?.data?.status) {
      dispatch(setloader(false));

      save({
        dateTime: selectedTimeSlot.slot_date,
        endDateTime: endDateTimeUTC,
        _id: res?.data?.data?._id,
      });
      setTimeout(() => {
        setShowCancel(true);
      }, 500);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  const getTherapistTimeSlot = async (selectedDate) => {
    dispatch(setloader(true));
    let res = null;
    const data = {
      current_date_time: selectedDate,
      therapist_id: therapist_id,
    };
    res = await getTimeSlot(data, token);
    if (res?.data?.status) {
      if (res?.data?.data.length > 0) {
        const currentTime = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const filteredSlots = res?.data?.data.filter((item) => {
          let slotDateUTC = moment(item.slot_date).tz("UTC");
          const slotDateIST = slotDateUTC.clone().tz("Asia/Kolkata");
          // Check if the slot is available and in the future
          return slotDateIST.isAfter(moment());
          // moment(item.slot_date).isSameOrAfter(currentTime)
        });
        //filteredSlots.pop();
        settiming(filteredSlots);
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
      } else {
        settiming([]);
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
      }
    } else {
      settiming([]);
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
    }
  };

  const Block = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          setselect(index);
          let selectedDate;
          if (index === 0) {
            selectedDate = moment();
          } else {
            selectedDate = moment().add(index, "days").startOf("day");
          }
          const selectedDateFormatted = selectedDate
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
          setSelectedDate(selectedDateFormatted);
          getTherapistTimeSlot(
            index === -1
              ? moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
              : selectedDateFormatted
          );
        }}
        style={[
          styles.mainContainer,
          {
            backgroundColor: index == select ? colors.btnColor : colors.white,
            marginLeft: index == 0 ? 2 : 0,
            marginRight: index == index.length - 1 ? 0 : 20,
          },
        ]}
      >
        <Text
          style={[
            styles.dayTxt,
            { color: index == select ? colors.white : colors.daycolor },
          ]}
        >
          {item?.day}
        </Text>
        <Text
          style={[
            styles.numberTxt,
            { color: index == select ? colors.white : colors.daycolor },
          ]}
        >
          {item?.number}
        </Text>
      </Pressable>
    );
  };

  const Block4 = ({ item, index }) => {
    const formattedTime = moment(item.slot_date).format("hh:mm a");
    const isSelected = index === selectedSlotIndex;
    const isAvailable = item.is_available;
    let backgroundColor = isSelected ? colors.btnColor : colors.white;
    let textColor = isSelected ? colors.white : colors.daycolor;
    if (!isAvailable) {
      backgroundColor = "red";
      textColor = "white";
    }
    if (item.is_available) {
      return (
        <Pressable
          onPress={() => {
            if (isAvailable) {
              setSelectedSlotIndex(index);
            }
          }}
          style={[
            styles.morningShiftContainer,
            { backgroundColor, marginRight: 2, marginLeft: 15 },
          ]}
          disabled={!isAvailable}
        >
          <View>
            <Text style={[styles.timeTxt, { color: textColor }]}>
              {formattedTime}
            </Text>
          </View>
        </Pressable>
      );
    }
  };
  return (
    <SolidView
      view={
        <View style={styles.mainView}>
          {loader && <Loader />}
          <Header
            title={localization?.appkeys?.SelectTimeDate}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
          {/* <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}> */}
          <View style={styles.topView}>
            <Text
              style={[styles.mainText, { color: colors.locationdiscription }]}
            >
              {currentMonth}
            </Text>
            <View style={styles.dateView}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={daysOfWeek}
                renderItem={({ item, index }) => (
                  <Block item={item} index={index} />
                )}
              />
            </View>
            <View style={[styles.timingflatView]}>
              <FlatList
                bounces={false}
                style={{ width: "100%" }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                numColumns={3}
                contentContainerStyle={{
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                }}
                data={timing}
                ListEmptyComponent={() => {
                  return !loader ? (
                    <View style={styles.loaderView}>
                      <Text
                        style={[styles.noDataFoundText, { color: colors.text }]}
                      >
                        {localization?.appkeys?.NoSlotAvailable}
                      </Text>
                    </View>
                  ) : null;
                }}
                renderItem={({ item, index }) => (
                  <Block4 item={item} index={index} />
                )}
              />
            </View>
          </View>
          {timing?.length > 0 && (
            <View style={styles.buttonView}>
              <CustomBtn
                onPress={() => {
                  scheduleRequest();
                }}
                titleTxt={localization.appkeys.BookNow}
              />
            </View>
          )}

          {/* </ScrollView> */}
          <BookAppointment
            isVisible={showCancel}
            onBackDropPress={() => {
              setShowCancel(false);
            }}
            handleBackHome={() => {
              navigation.navigate(AppRoutes.Home);
            }}
          />
        </View>
      }
    />
  );
}
const styles = StyleSheet.create({
  timingcontainer: {
    flexDirection: "row",
    flex: 1,
  },
  timingflatView: {
    width: widthPercentageToDP(99),
    alignSelf: "center",
    marginTop: 10,
  },
  mainView: {
    flex: 1,
  },
  mainText: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: AppFonts.SemiBold,
    marginHorizontal: 24,
  },
  buttonView: {
    paddingBottom: 40,
  },
  timeTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Medium,
    marginLeft: 5,
  },
  dayTxt: {
    fontSize: 14,
    fontFamily: AppFonts.Bold,
    marginTop: 13,
  },
  topView: {
    flex: 1,
  },
  watchImg: {
    height: heightPercentageToDP(2.5),
    width: heightPercentageToDP(2.5),
  },
  numberTxt: {
    fontSize: 14,
    fontFamily: AppFonts.Medium,
    paddingBottom: 8,
    marginTop: 5,
  },
  mainContainer: {
    width: widthPercentageToDP(17),
    borderRadius: 7,
    shadowColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 3,
  },
  morningShiftContainer: {
    height: heightPercentageToDP(6),
    paddingHorizontal: 14,
    width: "27%",
    // width: "30%",
    marginBottom: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    // marginRight: "4%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  dateView: {
    marginTop: 10,
    alignItems: "center",
    marginHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  morningTxt: {
    fontFamily: AppFonts.SemiBold,
    marginLeft: 8,
    marginTop: 20,
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
});
