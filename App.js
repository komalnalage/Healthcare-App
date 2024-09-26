import React, { useEffect, useState } from "react";
import {
  useColorScheme,
  PermissionsAndroid,
  AppState,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/Store/store";
import { LightTheme, DarkTheme } from "./src/constants/colors";
import MainStack from "./src/routes/mainStack/mainStack";
import AppUtils from "./src/utils/appUtils";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import UpdatePopup from "./src/screens/modals/UpdatePopup";
import { useNetInfo } from "@react-native-community/netinfo";
import NetInfo from "./src/screens/modals/NetInfo";
import { PersistGate } from "redux-persist/integration/react";
import { LocalizationProvider } from "./src/localization/localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

import {
  SetAppLanguage,
  setIsCallCompleted,
  setIsNavigate,
  setUserDetail,
  setVerificationEnabled,
  setappActiveState,
  setloading,
  setnotificationType,
} from "./src/redux/Reducers/userData";
import { strings } from "./src/constants/variables";
import Splash from "./src/screens/auth/Splash";
import { StripeProvider } from "@stripe/stripe-react-native";
import {
  setUserSearch,
  setloader,
  settherapistSearchModal,
} from "./src/redux/Reducers/UserNewData";
import { navigationRef } from "./navigation";
import ReactNativeCalendarEvents from "react-native-calendar-events";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import { requestNotifications } from "react-native-permissions";

const App = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [load, setLoad] = useState(false);
  const netInfo = useNetInfo();
  const theme = useColorScheme();
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const save = async (data) => {
    ReactNativeCalendarEvents?.checkPermissions()
      .then((res) => {
        if (res == "authorized") {
          addeventcalendar(data);
        } else {
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const addeventcalendar = async (data) => {
    let t = await ReactNativeCalendarEvents.findCalendars();

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

      ReactNativeCalendarEvents.saveEvent("Hopehelpline", {
        title: "Hopehelpline",
        startDate: startdate,
        endDate: enddate,

        description: data?.description,

        // calendarId: calenderid?.id,
        notes: data?.description,
        location: data?.category_name,
        alarms: [{ date: Platform.OS === "ios" ? -time : time }],
      })

        .then((res) => {
          console.log("res", res);
          // postUserEvents(data?.appointment_id, res);
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
    }
  };

  useEffect(() => {
    store.dispatch(setloader(false));
    AsyncStorage.getItem("IsBiometric", (err, IsBiometric) => {
      if (IsBiometric == "true") {
        Platform.OS == "android" ? androidbiomatric() : iosbiomatric();
        store.dispatch(setVerificationEnabled(true));
      } else if (IsBiometric == "skip") {
        setTimeout(() => {
          setLoad(true);
        }, 2000);
        store.dispatch(setVerificationEnabled(false));
      } else {
        setTimeout(() => {
          setLoad(true);
        }, 2000);
        store.dispatch(setVerificationEnabled(false));
      }
    });
  }, []);

  async function androidbiomatric() {
    rnBiometrics.isSensorAvailable().then((resultObject) => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === BiometryTypes.Biometrics) {
        rnBiometrics
          .simplePrompt({ promptMessage: "Confirm fingerprint" })
          .then((resultObject) => {
            const { success } = resultObject;
            if (resultObject.success) {
              setTimeout(() => {
                setLoad(true);
              }, 2000);
              // navigateToNext()
            }
          })
          .catch(() => {
            console.log("biometrics failed");
          });
        console.log("TouchID is supported");
      } else if (available && biometryType === BiometryTypes.FaceID) {
        console.log("FaceID is supported");
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        console.log("Biometrics is supported");
      } else {
        console.log("Biometrics not supported");
      }
    });
  }
  async function iosbiomatric() {
    rnBiometrics
      .isSensorAvailable()
      .then((resultObject) => {
        const { available, biometryType } = resultObject;

        if (
          (available && biometryType === BiometryTypes.TouchID) ||
          (available && biometryType === BiometryTypes.FaceID)
        ) {
          rnBiometrics
            .simplePrompt({ promptMessage: "Confirm fingerprint" })
            .then((resultObject) => {
              const { success } = resultObject;

              if (success) {
                // navigateToNext()
                setTimeout(() => {
                  setLoad(true);
                }, 2000);
                rnBiometrics.createKeys().then((resultObject) => {
                  const { publicKey } = resultObject;
                  console.log(publicKey);
                  // sendPublicKeyToServer(publicKey)
                });
                console.log("successful biometrics provided", success);
              } else {
                console.log("user cancelled biometric prompt");
              }
            })
            .catch(() => {
              // BackHandler.exitApp();
              console.log("biometrics failed");
            });
          console.log("TouchID is supported");
        } else if (available && biometryType === BiometryTypes.FaceID) {
          console.log("FaceID is supported");
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          console.log("Biometrics is supported");
        } else {
        }
      })
      .catch(() => {});
  }
  useEffect(() => {
    requestNotifications(["alert", "sound"]).then(({ status, settings }) => {});
    AppUtils.adaCompliance();
    getFcm();
    notifee.setBadgeCount(0).then(() => console.log("Badge count removed!"));
    checkUpdate();
    getLanguage();
    const unsubscribe = messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);
    return unsubscribe;
  }, []);

  useEffect(() => {
    Platform.OS == "android" && requestLocationPermission();
    Platform.OS == "ios" && ReactNativeCalendarEvents.requestPermissions();
  }, []);

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Your app needs access to your location for some features.",
          buttonPositive: "OK",
          buttonNegative: "Cancel",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted.");
        ReactNativeCalendarEvents.requestPermissions();
      } else {
        console.log("Location permission denied.");
        ReactNativeCalendarEvents.requestPermissions();
      }
    } catch (err) {
      console.warn(err);
      ReactNativeCalendarEvents.requestPermissions();
    }
  }

  useEffect(() => {
    if (netInfo.isConnected != null) {
      setIsConnected(netInfo.isConnected);
    }
  }, [netInfo.isConnected]);

  const getLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem(strings.appLanguage);
      if (value !== null) {
        const result = JSON.parse(value);
        store.dispatch(SetAppLanguage(result.appLanguage));
      } else {
      }
    } catch (e) {
    } finally {
    }
  };

  async function bootstrap() {
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log(
        "Notification caused application to open",
        initialNotification.data
      );
    }
  }

  React.useEffect(() => {
    bootstrap()
      .then((x) => {})
      .catch((err) => {
        console.warn("log", err);
      });
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      // console.log("onForegroundEvent detail",detail);
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          if (detail?.notification?.data?.type == "single") {
            setTimeout(() => {
              navigationRef.navigate("ChatScreen", {
                otherUserId: JSON.parse(detail?.notification?.data?.data)?._id,
                otherUserName: JSON.parse(detail?.notification?.data?.data)
                  ?.full_name,
                otherUserProfile: JSON.parse(detail?.notification?.data?.data)
                  ?.profile_pic,
                appointmentID: JSON.parse(detail?.notification?.data?.data)
                  ?.appointmentID,
              });
            }, 2100);
          }
          break;
      }
    });
    return unsubscribe;
  }, []);

  const getFcm = async () => {
    let fcm = await AppUtils.getToken();
  };

  const checkUpdate = async () => {
    let isNew = await AppUtils.checkAppVersion();
    setIsUpdateAvailable(isNew);
  };

  async function onMessageReceived(message) {
    // console.log("here",message);
    if (
      store.getState()?.userNewData?.isChatScreenOpened &&
      message?.data?.type == "single"
    ) {
      return;
    }
    const appointment_request = JSON.parse(message?.data?.data).type;
    store.dispatch(setUserDetail(JSON.parse(message?.data?.data)));
    if (appointment_request == "appointment_call_request") {
      store.dispatch(settherapistSearchModal(true));
    } else if (appointment_request == "appointment_cancelled") {
      store.dispatch(settherapistSearchModal(false));
    } else if (appointment_request == "appointment_call_accept") {
      store.dispatch(setUserSearch(false));
      store.dispatch(setIsNavigate(true));
    } else if (appointment_request == "appointment_call_complete") {
      store.dispatch(setnotificationType(appointment_request));
      store.dispatch(setIsCallCompleted(true));
    } else if (appointment_request == "call_auto_reject_by_user") {
      store.dispatch(settherapistSearchModal(false));
    }
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default",
      importance: AndroidImportance.HIGH,
    });
    notifee.displayNotification({
      title: message?.notification?.title,
      body: message?.notification?.body,
      android: {
        channelId,
      },
      data: message?.data,
      ios: {
        sound: "default",
      },
    });
  }

  const appState = React.useRef(AppState.currentState);
  React.useEffect(() => {
    AsyncStorage.getItem("myid", (err, item) => {});
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log(nextAppState)
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        store.dispatch(setappActiveState(true))
        
      }
      appState.current = nextAppState;
      if (store.getState().userData.userData?._id) {
        firestore()
          .collection("users")
          .doc(store.getState().userData.userData?._id)
          .set({
            onlineStatus: appState.current == "active" ? "Online" : "Offline",
            id: store.getState().userData.userData?._id,
          });
      }
    });
    return () => {
      // subscription.remove();
    };
  }, []);
  return (
    <>
      <NetInfo isVisible={!isConnected} />
      <UpdatePopup
        onBackDropPress={() => setIsUpdateAvailable(false)}
        isVisible={isUpdateAvailable}
      />

      <LocalizationProvider>
        <Provider store={store}>
          <StripeProvider publishableKey="pk_test_51NZrS8G1gSgjoP5m8fcD0OsQYx5YWkclDqudHslhpKXW9w1q8mUVOwfBoaoc8jWEaycnbnsLYrqZecaYYj5RTqLY00yV9SIF1B">
            <PersistGate loading={null} persistor={persistor}>
              <NavigationContainer
                ref={navigationRef}
                theme={theme == "dark" ? DarkTheme : LightTheme}
              >
                {load ? <MainStack /> : <Splash />}
              </NavigationContainer>
            </PersistGate>
          </StripeProvider>
        </Provider>
      </LocalizationProvider>
    </>
  );
};

export default App;
