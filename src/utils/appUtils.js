import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-simple-toast";
import checkVersion from "react-native-store-version";
import DeviceInfo from "react-native-device-info";
import { urls } from "../constants/urls";
import { config, Mode } from "../../config";
import { Text, TextInput } from "react-native";

const AppUtils = {
  //Phone validation
  validatePhone: (phone) => {
    var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  },

  //Email validation
  validateEmail: (email) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  },

  // Toast
  showToast: (text) => {
    if(text){
    Toast.show(text ?? "Something went wrong");
    }
  },

  // LOG
  showLog: (message, ...optionalParams) => {
    config.mode == Mode.DEV && console.log(message, ...optionalParams);
  },

  // FCM TOKEN
  getToken: async () => {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();
      return token;
    } else {
      return "";
    }
  },

  // Disable font size increase from phone settings
  disableFontScale: () => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
  },

  // Enable Ada compliance
  adaCompliance: () => {
    if (TextInput.defaultProps == null) {
      TextInput.defaultProps = {};
      TextInput.defaultProps.maxFontSizeMultiplier = 1.4;
    }
    if (Text.defaultProps == null) {
      Text.defaultProps = {};
      Text.defaultProps.maxFontSizeMultiplier = 1.2;
    }
  },

  // Check Update with live version's
  checkAppVersion: async () => {
    try {
      const check = await checkVersion({
        version: DeviceInfo.getVersion(), // app local version
        iosStoreURL: urls.iosAppLink,
        androidStoreURL: urls.androidAppLink,
      });
      if (check.result === "new") {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      AppUtils.showLog(e);
      return false;
    }
  },
};

export default AppUtils;
