import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  Alert,
  Linking,
  AppState,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AppFonts from "../../constants/fonts";
import { wp } from "../../utils/dimension";
import SolidView from "../components/SolidView";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { LocalizationContext } from "../../localization/localization";
import Header from "../components/Header";
import SelectCategoriesModal from "../modals/SelectCategoriesModal";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import {
  getspecialization,
  savedCard,
  searchTherapist,
} from "../../api/Services/services";
import Loader from "../modals/Loader";
import AppUtils from "../../utils/appUtils";
import GetLocation from "react-native-get-location";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import messaging from "@react-native-firebase/messaging";
import { setIsNavigate, setappActiveState, setloading } from "../../redux/Reducers/userData";
import { setUserSearch, setloader } from "../../redux/Reducers/UserNewData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { promptForEnableLocationIfNeeded } from "react-native-android-location-enabler";
import BookAppointment from "../../screens/modals/BookAppointment";
export default function SelectCategories({ navigation }) {
  let focus = useIsFocused();
  let dispatch = useDispatch();
  const userData = useSelector((state) => state.userData.userData);
  const appActiveState = useSelector((state) => state.userData.appActiveState);
  console.log("appActiveState", appActiveState);
  const token = useSelector((state) => state.userData.token);
  const appState = React.useRef(AppState.currentState);
  //   console.log("SelectCategories", userData);
  const userSearch = useSelector((state) => state.userNewData.userSearch);
  const isNavigate = useSelector((state) => state.userData.isNavigate);
  const { colors } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const loader = useSelector((state) => state.userNewData.loader);

  const [arr, setarr] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState(null);
  const [lat, setlat] = useState("");
  const [long, setlong] = useState("");
  const [price, setprice] = useState("");
  const [appointmentID, setAppointmentID] = useState("");
  const currentDateTime = moment().utc();
  const [savedcard, setsavedcard] = useState([]);
  const userToken = useSelector((state) => state.userData.token);
  const [hasLocation, sethasLocation] = useState(false);
  const [active, setActive] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const showLocationPermissionAlert = () => {
    Alert.alert(
      "Location Permission Required",
      "Please enable location permissions to continue.",
      [
        // {
        //   text: "Cancel",
        //   onPress: () => console.log("Cancel Pressed"),
        //   style: "cancel",
        // },
        {
          text: "Enable",
          onPress: () => {
            Linking.openSettings();
            setHasLocationPermission(false);
            dispatch(setappActiveState(false))
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (active) {
      showLocationPermissionAlert();
    }
  }, [active]);
  useEffect(() => {
    console.log(hasLocationPermission,'haslocationpermission')
    if (hasLocationPermission) {
       getUserCurrentLocation();
    }
  }, [hasLocationPermission]);

  useEffect(() => {
    if (focus) {
      getSpecilization();
      getSavedCard();
    }
  }, [focus]);
  let haslocation = false;

  useEffect(() => {
    if (appActiveState) {
        setHasLocationPermission(true)
    }
  }, [appActiveState]);


  const getSavedCard = async () => {
    let res = null;
    res = await savedCard(userToken);
    if (res?.data?.status) {
      setsavedcard(res?.data?.data);
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
    } else {
      setsavedcard([]);
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };
  useEffect(() => {
    if (isNavigate) {
      dispatch(setIsNavigate(false));
      navigation.navigate(AppRoutes.Video, { from: "other" });
    }
  }, [isNavigate]);

  useEffect(() => {
    if (userData) {
      messaging()
        .subscribeToTopic(userData?._id)
        .then(() => {
          console.log("subscribedToTopic");
        });
    }
  }, []);

  function getUserCurrentLocation() {
    console.log("getUserCurrentLocation");
    try {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 1500,
      })
        .then((location) => {
          console.log("lati", location.latitude);
          console.log("longi", location.longitude);
          setlat(location.latitude);
          setlong(location.longitude);
  
        })
        .catch((error) => {
          console.log("error", error);
          const { code, message } = error;
          setActive(true);
        });
    } catch (error) {
      console.log("223", error);
    }
  }

  const getSpecilization = async () => {
    dispatch(setloader(true));

    let res = null;
    res = await getspecialization();
    // console.log("getspecialization res", res);
    if (res?.data?.status) {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      setarr(res?.data?.data);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  const postSearchTherapist = async () => {
    console.log("lat999999", lat);
    if (selectedSpecializations) {
      if (lat?.length == 0) {
        setActive(false);
        getUserCurrentLocation();
        return;
      }
      const hasNotificationPermission = await messaging().hasPermission();
      if (!hasNotificationPermission) {
        Alert.alert(
          "Notification Permission Required",
          "Please enable notification permissions to continue.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Enable",
              onPress: () => {
                // Request notification permission
                messaging()
                  .requestPermission()
                  .then(() => {
                    console.log("Notification permission granted");
                    Linking.openSettings();
                  })
                  .catch((error) => {
                    console.log("Notification permission rejected");
                  });
              },
            },
          ]
        );
        dispatch(setloader(false));
        return;
      }
      dispatch(setloader(true));
      console.log("lat",lat);
      console.log("long",long);
      console.log("currentDateTime",currentDateTime);
      console.log("token",token);
      console.log("JSON.stringify([selectedSpecializations])",JSON.stringify([selectedSpecializations]));
      let res = null;
    
      res = await searchTherapist(
        lat,
        long,
        JSON.stringify([selectedSpecializations]),
        currentDateTime,
        price,
        token
      );
      console.log("res777",res?.data);
      if (res?.data?.status) {
        setAppointmentID(res?.data?.data?._id);
        dispatch(setloader(false));
        setTimeout(() => {
          dispatch(setUserSearch(true));
        }, 500);
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(res?.data?.message);
      }
    } else {
      AppUtils.showToast("Please Select Categories!!");
    }
  };

  const Block = ({ item, index }) => {
    const toggleSpecializationSelection = (id) => {
      if (selectedSpecializations === id) {
        setSelectedSpecializations(null);
      } else {
        setSelectedSpecializations(id);
      }
    };
    return (
      <Pressable
        onPress={() => {
          setprice(item.price_per_hour);
          toggleSpecializationSelection(item._id);
        }}
        style={[
          style.mainContainer,
          {
            backgroundColor:
              selectedSpecializations === item._id
                ? colors.btnColor
                : colors.white,
          },
        ]}
      >
        <Text
          style={[
            style.nameTxt,
            {
              color:
                selectedSpecializations === item._id
                  ? colors.white
                  : colors.locationdiscription,
            },
          ]}
        >
          {item?.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <SolidView
      view={
        <View style={style.mainView}>
          {loader && <Loader />}
          <Header
            hidebackArrow
            title={localization?.appkeys?.SelectCategories}
            onPressBack={() => {
              navigation.goBack();
            }}
            skip={localization.appkeys.skip}
            handleSkip={() => {
              navigation.replace(AppRoutes.Home);
            }}
          />
          {/* <ScrollView
                        showsVerticalScrollIndicator={false}
                    > */}
          <View style={style.topView}>
            <View style={{}}>
              <FlatList
                style={{
                  height: "87%",
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                columnWrapperStyle={style.columnWrapStyle}
                contentContainerStyle={{}}
                numColumns={2}
                extraData={selectedCategories}
                data={arr}
                renderItem={({ item, index }) => (
                  <Block item={item} index={index} />
                )}
              />
            </View>
          </View>
          {/* </ScrollView> */}
          <View style={style.startCallButtonView}>
            <View style={style.priceTopView}>
              <Text
                style={[
                  style.price,
                  { color: colors.user_Select_Categories_HedingTitle },
                ]}
              >
                {localization?.appkeys?.price} :{" "}
              </Text>
              <Text
                style={[
                  style.priceTxt,
                  { color: colors.user_Select_Categories_HedingTitle },
                ]}
              >
                $40/hr
              </Text>
            </View>
            <Pressable
              onPress={() => {
                if (savedcard?.length > 0) {
                  postSearchTherapist();
                } else {
                  navigation.navigate(AppRoutes.AddCard);
                }
              }}
              style={[
                style.startCallView,
                {
                  backgroundColor: colors.btnColor,
                },
              ]}
            >
              <Text style={[style.btntxt]}>
                {localization?.appkeys?.startcall}
              </Text>
            </Pressable>
          </View>
          <View></View>
          { (
          //      <BookAppointment
          //      isVisible={true}
          //      onBackDropPress={() => { false }}
          //      handleBackHome={() => {
          //          navigation.navigate(AppRoutes.Home)
          //      }}
          //  />
            <SelectCategoriesModal
              appointmentID={appointmentID}
              handleOnpress={() => {}}
              isVisible={userSearch}
              onBackDropPress={() => {
                dispatch(setUserSearch(false));
              }}
            />
          )}
        </View>
      }
    />
  );
}
const style = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "white",
  },
  startCallButtonView: {
    position: "absolute",
    // top:"-12%",
    bottom: "1%",
    width: "100%",
    // backgroundColor:"green"
  },
  priceTopView: {
    flexDirection: "row",
    alignSelf: "center",
    // marginTop: 40
  },
  price: {
    fontSize: 20,
    fontFamily: AppFonts.Medium,
  },
  priceTxt: {
    fontFamily: AppFonts.SemiBoldItalic,
    fontSize: 20,
  },
  startCallView: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    padding: 12,
    borderRadius: 8,
    height: 56,
  },
  btntxt: {
    fontSize: 16,
    color: "white",
    fontFamily: AppFonts.Regular,
  },
  nameTxt: {
    fontSize: 14,
    fontFamily: AppFonts.Regular,
    marginLeft: 10,
  },
  columnWrapStyle: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  mainContainer: {
    height: heightPercentageToDP(9.5),
    width: widthPercentageToDP(41),
    marginBottom: 13,
    justifyContent: "center",
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    marginTop: 5,
  },
  topView: {
    width: wp(93),
    alignSelf: "center",
    marginTop: 20,
  },
});
