import React, { useContext, useEffect, useState } from "react";
import AppRoutes from "../RouteKeys/appRoutes";
import NonAuthStack from "../NoAuth/NonAuthStack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { hp, wp } from "../../utils/dimension";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppFonts from "../../constants/fonts";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { LocalizationContext } from "../../localization/localization";
import {
  setAuth,
  setloading,
  setuserData,
} from "../../redux/Reducers/userData";
import TherapistProfile from "../../screens/nonAuth/TherapistProfile";
import Profile from "../../screens/nonAuth/Profile";
import Home from "../../screens/nonAuth/Home";
import {
  therapist_get_Profile,
  therapist_user_Logout,
  user_Logout,
} from "../../api/Services/services";
import AppUtils from "../../utils/appUtils";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import getEnvVars from "../../../env";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import {
  setdrawerSelectedTab,
  setloader,
} from "../../redux/Reducers/UserNewData";
import Video from "../../screens/nonAuth/Video";
import FastImage from "react-native-fast-image";
import Loader from "../../screens/modals/Loader";

const Drawer = createDrawerNavigator();

export default function DrawerStack({ navigation }) {
  const user = useSelector((state) => state.userData.user);
  const userData = useSelector((state) => state.userData.userData);
  const loader = useSelector((state) => state.userNewData.loader);
  const dispatch = useDispatch();
  const drawerSelectedTab = useSelector(
    (state) => state.userNewData.drawerSelectedTab
  );
  const token = useSelector((state) => state.userData.token);
  const { colors, images } = useTheme();
  const select = drawerSelectedTab;
  const { localization } = useContext(LocalizationContext);
  const [img, setImg] = useState(
    userData?.profile_pic?.includes("https")
      ? userData?.profile_pic
      : userData?.profile_pic
      ? getEnvVars().fileUrl + userData?.profile_pic
      : ""
  );

  useEffect(() => {
    setImg(
      userData?.profile_pic?.includes("https")
        ? userData?.profile_pic
        : userData?.profile_pic
        ? getEnvVars().fileUrl + userData?.profile_pic
        : ""
    );
  }, [userData]);

  useEffect(() => {
    if (user?.type == "therapist") {
      getProfile();
    }
  }, [user]);

  async function getProfile() {
    try {
      let res = null;
      res = await therapist_get_Profile(token);
      if (res?.data?.status) {
        // setread_count(res?.data?.other?.unread_count);
        dispatch(setuserData(res?.data?.data));
      } else {
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      AppUtils.showToast(error);
    }
  }

  const i = [
    {
      name: "Home",
      img: images.home,
      onPress: () => {
        navigation.navigate(Home);
        // navigation.dispatch(DrawerActions.closeDrawer());
        dispatch(setdrawerSelectedTab("Home"));
      },
    },
    {
      name: "Profile",
      img: images.userIcon,
      onPress: () => {
        // navigation.dispatch(DrawerActions.closeDrawer());
        navigation.navigate(user?.type == "user" ? Profile : TherapistProfile);
        dispatch(setdrawerSelectedTab("Profile"));
      },
    },
    {
      name: user?.type == "user" ? "My Appointments" : "Appointments",
      img: images.cal,
      onPress: () => {
        // navigation.dispatch(DrawerActions.closeDrawer());
        navigation.navigate(AppRoutes.Appointments);
        // dispatch(
        //   setdrawerSelectedTab(
        //     user?.type == "user" ? "My Appointments" : "Appointments"
        //   )
        // );
      },
    },
    {
      name: "Calendar",
      img: images.cal,
      onPress: () => {
        // navigation.dispatch(DrawerActions.closeDrawer());
        navigation.navigate(AppRoutes.Calender);
        // dispatch(setdrawerSelectedTab("Calender"));
      },
    },
    {
      name: "Contact Us",
      img: images.contact,
      onPress: () => {
        // navigation.dispatch(DrawerActions.closeDrawer());
        navigation.navigate(AppRoutes.ContactUs);
        // dispatch(setdrawerSelectedTab("Contact us"));
      },
    },
    {
      name: "Terms & Conditions",
      img: images.terms,
      onPress: () => {
        // navigation.dispatch(DrawerActions.closeDrawer());
        navigation.navigate(AppRoutes.TermsCondition);
        // dispatch(setdrawerSelectedTab("Terms & Conditions"));
      },
    },
    {
      name: "Privacy Policy",
      img: images.privacy,
      onPress: () => {
        // navigation.dispatch(DrawerActions.closeDrawer());
        navigation.navigate(AppRoutes.PrivacyPolicy);
        // dispatch(setdrawerSelectedTab("Privacy Policy"));
      },
    },
    {
        name: 'Settings', img: images.setting, onPress: () => {
            (DrawerActions.closeDrawer());
            navigation.navigate(AppRoutes.Setting);
            dispatch(setdrawerSelectedTab("Setting"))
        }
    }
  ];

  const logout = async () => {
    try {
      dispatch(setloader(true));
      let res = null;
      res = await user_Logout(token);
      // console.log(res?.data?.status, "hjfhjfjhf");
      if (res?.data?.status) {
        messaging().unsubscribeFromTopic(userData?._id);
        messaging().unsubscribeFromTopic("therapistTopic");
        messaging().unsubscribeFromTopic("userTopic");
        firestore().collection("users").doc(userData?._id).set({
          onlineStatus: "Offline",
          id: userData?._id,
        });
        AppUtils.showToast(res?.data?.message);
        //    localStore.removeData('IsBiometric')
        auth().signOut();
        GoogleSignin.signOut();
        dispatch(setAuth(false));
        dispatch(setuserData({}));
        setTimeout(() => {
          navigation.replace(AppRoutes.AuthStack, {
            screen: AppRoutes.Login,
          });
        }, 500);
      } else {
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error, "UserLogoutError");
    } finally {
      dispatch(setloader(false));
    }
  };

  const therapistlogout = async () => {
    try {
      dispatch(setloader(true));
      let res = null;
      res = await therapist_user_Logout(token);
      if (res?.data?.status) {
        firestore().collection("users").doc(userData?._id).set({
          onlineStatus: "Offline",
          id: userData?._id,
        });
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        messaging().unsubscribeFromTopic(userData?._id);
        messaging().unsubscribeFromTopic("therapistTopic");
        messaging().unsubscribeFromTopic("userTopic");
        AppUtils.showToast(res?.data?.message);
        // localStore.removeData('IsBiometric')
        auth().signOut();
        GoogleSignin.signOut();

        // dispatch(setVerificationEnabled(false))
        dispatch(setAuth(false));
        dispatch(setuserData({}));
        dispatch(setloader(false));
        setTimeout(() => {
          navigation.replace(AppRoutes.AuthStack, {
            screen: AppRoutes.Login,
          });
        }, 500);
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error, "therapistlogout");
    } finally {
      dispatch(setloader(false));
    }
  };

  function LogoutAll(params) {
    console.log(user?.type);
    if (user?.type == "user") {
      logout();
    } else {
      therapistlogout();
    }
  }

  const Custom = () => {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View
          style={[
            styles.topView,
            { backgroundColor: colors.locationdiscription },
          ]}
        >
          <Pressable
            onPress={() => {
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
            style={styles.crossTopView}
          >
            <Image style={styles.crossImg} source={images.crosswhite} />
          </Pressable>
          {userData?.profile_pic ? (
            <FastImage
              resizeMode="cover"
              source={{ uri: img }}
              // source={{uri:getEnvVars().fileUrl + userData?.profile_pic}}
              // source={(getEnvVars().fileUrl + userData?.profile_pic ?? '') == '' ? images.w3 : { uri: userData?.profile_pic.includes("https") ? userData?.profile_pic : getEnvVars().fileUrl + userData?.profile_pic }}
              style={styles.userImg}
            />
          ) : (
            <FastImage
              resizeMode="cover"
              source={images.defaultPic}
              style={styles.userImg}
            />
          )}
          <Text style={styles.userName}>{userData?.name}</Text>
        </View>
        <FlatList
          data={i}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                onPress={item.onPress}
                style={[
                  styles.bottomView,
                  {
                    backgroundColor:
                      select == item.name ? colors.btnColor : "transparent",
                  },
                ]}
              >
                <Image
                  source={item.img}
                  style={[
                    styles.leftIconImg,
                    {
                      tintColor:
                        select == item.name ? "white" : colors.btnColor,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.nameTxt,
                    { color: select == item.name ? "white" : "black" },
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />
        <Pressable
          onPress={() => {
            LogoutAll();
          }}
          style={styles.logoutView}
        >
          <Image source={images.logout} style={styles.logoutImg} />
          <Text style={styles.logoutTxt}>{localization?.appkeys?.logout}</Text>
        </Pressable>
        {loader && <Loader />}
      </SafeAreaView>
    );
  };

  return (
    <>
      {/* {loader && <Loader />} */}
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: { width: wp(80) },
          swipeEdgeWidth: 0,
        }}
        drawerContent={(props) => <Custom {...props} />}
      >
        <Drawer.Screen
          options={{ gestureEnabled: false }}
          name={AppRoutes.NonAuthStack}
          component={NonAuthStack}
        />
        <Drawer.Screen
          options={{ gestureEnabled: false }}
          name={AppRoutes.Video}
          component={Video}
        />
      </Drawer.Navigator>
    </>
  );
}
const styles = StyleSheet.create({
  topView: {
    height: hp(25),
    width: "100%",
    alignItems: "center",
  },
  switchleftTxt: {
    color: "white",
    fontSize: 11,
    fontFamily: AppFonts.Medium,
    marginLeft: 5,
  },
  switchRightTxt: {
    color: "red",
    fontSize: 11,
    fontFamily: AppFonts.Medium,
    marginRight: 5,
  },
  crossImg: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  crossTopView: {
    alignSelf: "flex-end",
    top: 5,
    right: 5,
  },
  userImg: {
    height: 90,
    width: 90,
    borderRadius: 45,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: "white",
    marginTop: hp(2),
  },
  userName: {
    fontFamily: AppFonts.SemiBold,
    color: "white",
    marginTop: 8,
    fontSize: 15,
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    minHeight: 50,
    paddingHorizontal: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: "rgba(46, 221, 204, .5)",
  },
  leftIconImg: {
    height: 18,
    width: 24,
    resizeMode: "contain",
    marginRight: 10,
  },
  nameTxt: {
    fontFamily: AppFonts.Regular,
    fontSize: 15.5,
  },
  logoutView: {
    bottom: 0,
    backgroundColor: "black",
    width: "100%",
    height: 56,
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  logoutImg: {
    height: "50%",
    width: "16%",
    resizeMode: "contain",
  },
  logoutTxt: {
    color: "white",
    fontSize: 14,
    fontFamily: AppFonts.Regular,
    marginLeft: 10,
  },
});
