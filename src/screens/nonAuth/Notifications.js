import { Text, View, StyleSheet, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { useTheme } from "@react-navigation/native";
import { hp } from "../../utils/dimension";
import FastImage from "react-native-fast-image";
import AppFonts from "../../constants/fonts";
import { LocalizationContext } from "../../localization/localization";
import SolidView from "../components/SolidView";
import Loader from "../modals/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationsList } from "../../api/Services/services";
import { endpoints } from "../../api/Services/endpoints";
import { setloader } from "../../redux/Reducers/UserNewData";
import moment from "moment";
import getEnvVars from "../../../env";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Notifications = ({ navigation }) => {
  const loader = useSelector((state) => state.userNewData.loader);
  const user = useSelector((state) => state.userData.user);
  const token = useSelector((state) => state.userData.token);
  const { colors, images } = useTheme();
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext);
  const [notificationData, setNotificationData] = useState([]);

  useEffect(() => {
    if (token) {
      getNotifications();
    }
  }, [token]);

  async function getNotifications() {
    try {
      dispatch(setloader(true));
      let res = null;
      if (user?.type == "therapist") {
        res = await getNotificationsList(
          token,
          endpoints.get_therapist_notification_list
        );
      } else {
        res = await getNotificationsList(
          token,
          endpoints.get_user_notification_list
        );
      }
      if (res?.data?.status) {
        setNotificationData([...res?.data?.data]);
      } else {
        setNotificationData([]);
      }
    } catch (error) {
      console.log("getNotifications error", error);
    } finally {
      dispatch(setloader(false));
    }
  }

  return (
    <SolidView
      view={
        <View style={styles.mainView}>
          {loader && <Loader />}
          <Header
            title={localization?.appkeys?.Notifications}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
          <KeyboardAwareScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              contentContainerStyle={{
                flex: 1,
                paddingBottom:20
              }}
              data={notificationData}
              ListEmptyComponent={() => {
                return !loader ? (
                  <View style={styles.loaderView}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontFamily: AppFonts.SemiBold,
                        color: colors.text,
                      }}
                    >
                      {" "}
                     {localization?.appkeys?.NoNotifications}
                    </Text>
                  </View>
                ) : null;
              }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={[
                      styles.viewFlat,
                      { backgroundColor: colors.notification },
                    ]}
                  >
                    <View style={styles.notificationContentView}>
                      <FastImage
                        source={
                          item?.senderDetail?.profile_pic
                            ? {
                                uri: item?.senderDetail?.profile_pic?.includes(
                                  "https"
                                )
                                  ? item?.senderDetail?.profile_pic
                                  : getEnvVars().fileUrl +
                                    item?.senderDetail?.profile_pic,
                              }
                            : images.defaultPic
                        }
                        style={styles.userImg}
                      />
                      <View style={styles.haddingView}>
                        <Text
                          style={[
                            styles.discriptionTxt,
                            { color: colors.black },
                          ]}
                        >
                          {item?.senderDetail?.name}
                        </Text>

                        <Text
                          style={[
                            styles.discriptionTxt,
                            { color: colors.black },
                          ]}
                        >
                          {item?.body}
                        </Text>
                        <Text style={[styles.timeTxt, { color: colors.black }]}>
                          {moment(item?.created_at).fromNow()}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </KeyboardAwareScrollView>
        </View>
      }
    />
  );
};

export default Notifications;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  viewFlat: {
    alignSelf: "center",
    marginTop: hp(2),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    width: "90%",
    justifyContent: "center",
  },
  loaderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  discriptionTxt: {
    fontFamily: AppFonts.Regular,
    fontSize: 12,
  },
  timeTxt: {
    fontFamily: AppFonts.SemiBold,
    fontSize: 10,
  },
  notificationContentView: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 5,
    resizeMode: "contain",
  },
  haddingView: {
    marginLeft: 10,
    width: "80%",
  },
});
