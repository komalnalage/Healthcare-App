import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import SolidView from "../components/SolidView";
import Header from "../components/Header";
import { LocalizationContext } from "../../localization/localization";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useTheme } from "@react-navigation/native";
import { user_get_calander_appointment } from "../../api/Services/services";
import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../api/Services/endpoints";
import moment from "moment";
import UpcomingAppointment from "../components/UpcomingAppointment";
import AppFonts from "../../constants/fonts";
import Loader from "../modals/Loader";
import { setloading } from "../../redux/Reducers/userData";
import { setloader } from "../../redux/Reducers/UserNewData";

export default function Calender({ navigation }) {
  const loader = useSelector((state) => state.userNewData.loader);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext);
  const { colors, images } = useTheme();
  const token = useSelector((state) => state.userData.token);
  const user = useSelector((state) => state.userData.user);
  const [upcomingApp, setupcomingApp] = useState({});
  const [data, setdata] = useState([]);
  const [todayData, settodayData] = useState([]);

  const [date, setDate] = useState('');

  useEffect(() => {
    if (user.type == "therapist") {
      get_appointments(endpoints.get_calander_appointment);
    } else {
      get_appointments(endpoints.user_get_calander_appointment);
    }
  }, [user]);

  async function get_appointments(endpoint) {
    try {
      dispatch(setloader(true));
      let res = null;
      console.log("tokenkkkk", token);
      res = await user_get_calander_appointment(token, endpoint);
      console.log("user_get_calander_appointment", res?.data);

      if (res?.data?.status) {
        // console.log("11");
        setdata(res?.data?.data);
        // dispatch(setloader(false));
        let objj = {};
        let UpcomingArray = [];
        res?.data?.data.map((item) => {
          let obj = {};
          obj = {
            [moment(item.appointment_date_time).format("YYYY-MM-DD")]: {
              selected: true,
              selectedColor: colors.btnColor,
              dots: [{ color: 'white', key: 'selectedDot' }],

            },
          };
          objj = { ...objj, ...obj };
        });

        UpcomingArray = res?.data?.data.filter((item) => {
          return (
            moment(item.appointment_date_time).format("YYYY-MM-DD") ==
            moment().format("YYYY-MM-DD")
          );
        });
        settodayData(UpcomingArray);
        setupcomingApp({ ...objj });
      } else {
        // console.log("22");
        setupcomingApp({});
        setdata([]);
        // dispatch(setloader(false));
      }
    } catch (error) {
      console.log("get_appointments error", error);
    } finally {
      dispatch(setloader(false));
    }
  }

  
  return (
    <SolidView
      view={
        <>
          {loader && <Loader />}
          <Header
            title={"Calendar"}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
          <Calendar
            style={styles.calender}
            onDayPress={(day) => {
              setDate(day.dateString);
              let UpcomingArray = data.filter((item) => {
                return (
                  moment(item.appointment_date_time).format("YYYY-MM-DD") ==
                  day.dateString
                );
              });
              if (UpcomingArray?.length > 0) {
                settodayData(UpcomingArray);
              } else {
                settodayData([]);
              }
            }}
            markingType="multi-dot"
            // markingType="multi-dot"
            // markedDates={{
            //   [date]: {
            //     selected: true,
            //     // dots: [{ color: 'blue', key: 'selectedDot', selected: true }],
            //     selectedColor: "lightgreen",
            //     selectedTextColor: "black",
            //     activeOpacity: 0,
            //   },
            //   '2024-02-10': {
            //     dots: [{ color: 'red' }, { color: "green" }, { color: "blue" }],
            //     selected: true, // Set to false to ensure dots are not shown when the date is not selected
            //     dotColor: "blue",
            //     marked: true,
            //     activeOpacity: 0,
            //   },
              
            // }}
            // markedDates={{
            //  '2024-02-10':{dots:[{color:'red'},{color:"green"},{color:"blue"}],
            // selected:true,selectedColor:"lightgreen",selectedTextColor:"black",dotColor:"blue",marked:true, activeOpacity: 0,}
            // }}
            markedDates={{
              [date]: {
                selected: true,
                dotColor: 'white',
                activeOpacity: 0,
                selectedTextColor: "white",
                selectedColor: "red",
                marked: true,
                // dots: [{ color: 'white', key: 'selectedDot' }],
              },
              ...upcomingApp,
              ...todayData.reduce((acc, item) => {
                const dateString = moment(item.appointment_date_time).format("YYYY-MM-DD");
                return {
                  ...acc,
                  [dateString]: {
                    selected: true,
                    selectedColor: "red", // Change background color to black
                    dots: [{ color: 'white', key: 'selectedDot' }],
                  }
                };
              }, {}),
              [moment().format("YYYY-MM-DD")]: {
                selected: true,
                dotColor: 'black', // Dot color for today's date
                activeOpacity: 0,
              }
            }}
            
          />
          {todayData?.length > 0 && (
            <Text
              style={[
                styles.upcomingTxt,
                {
                  color: colors.color_both_Side,
                  fontSize: 17,
                  fontFamily: AppFonts.SemiBold,
                  margin: 10,
                },
              ]}
            >
              {localization?.appkeys?.upcomingAppointments}
            </Text>
          )}

          <FlatList
            style={{
              marginHorizontal: 10,
              marginBottom: 10,
              borderRadius: 10,
            }}
            data={todayData}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => {
              return !loading ? (
                <View style={styles.loaderView}>
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      fontFamily: AppFonts.SemiBold,
                      color: colors.text,
                    }}
                  >
                    {" "}
                    No Appointment Found
                  </Text>
                </View>
              ) : null;
            }}
            renderItem={({ item, index }) => (
              <UpcomingAppointment
                hide
                showCancel={() => setShowCancel(true)}
                type={user?.type}
                item={item}
                index={index}
              />
            )}
          />
        </>
      }
    />
  );
}
const styles = StyleSheet.create({
  calender: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  loaderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
