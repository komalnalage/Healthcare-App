import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { hp, wp } from "../../utils/dimension";
import FastImage from "react-native-fast-image";
import { useIsFocused, useTheme } from "@react-navigation/native";
import AppFonts from "../../constants/fonts";
import { Rating } from "react-native-ratings";
import SolidView from "../components/SolidView";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import CallComp from "../components/CallComp";
import { LocalizationContext } from "../../localization/localization";
import { useDispatch, useSelector } from "react-redux";
import getEnvVars from "../../../env";
import AppUtils from "../../utils/appUtils";
import Loader from "../modals/Loader";
import { getTherapistDetail } from "../../api/Services/services";
import moment from "moment";
import { setloader } from "../../redux/Reducers/UserNewData";

const Therapist = ({ navigation, route }) => {
  const loader = useSelector((state) => state.userNewData.loader);
  const { item } = route?.params;
  const token = useSelector((state) => state.userData.token);
  const userData = useSelector((state) => state.userData.userData);
  const focus = useIsFocused();
  let dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext);
  const { colors, images } = useTheme();
  const [callView, setcallView] = useState(false);
  const [therapistData, settherapistData] = useState();
  const [therapistFeedback, settherapistFeedback] = useState([]);
  const [specializationData, setspecializationData] = useState([]);
  console.log("therapistData", therapistData);

  useEffect(() => {
    if (focus) {
      TherapistDetail();
    }
  }, [focus]);

  const TherapistDetail = () => {
    return new Promise((resolve, reject) => {
      dispatch(setloader(true));
      getTherapistDetail(item?._id, token)
        .then((res) => {
          if (res?.data?.status) {
            settherapistData(res?.data?.data);
            settherapistFeedback(res?.data?.data?.feedback);
            setspecializationData(res?.data?.data?.specialization);
            // AppUtils.showToast(res?.data?.message);
            resolve(res?.data?.data);
          } else {
            AppUtils.showToast(res?.data?.message);
            reject(res?.data?.message);
          }
        })
        .catch((error) => {
          console.log("TherapistDetail error", error);
          reject(error);
        })
        .finally(() => {
          dispatch(setloader(false));
        });
    });
  };

  // useEffect(() => {
  //   dispatch(SetinitialRouteName("Home"));
  // }, []);

  const formattedDate = (dateString) => {
    const formatted = moment.utc(dateString).format("MM/DD/YYYY");
    return formatted;
  };
  return (
    <SolidView
      view={
        <View style={styles.mainView}>
          {loader && <Loader />}
          <Header
            title={localization?.appkeys?.therapist}
            onPressBack={() => {
              navigation.navigate(AppRoutes.Home);
            }}
          />
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.therapistBlock,
                { backgroundColor: colors.therapostblock },
              ]}
            >
              {therapistData?.profile_pic ? (
                <FastImage
                  style={styles.userImg}
                  source={{
                    uri: getEnvVars().fileUrl + therapistData?.profile_pic,
                  }}
                />
              ) : (
                <FastImage style={styles.userImg} source={images.defaultPic} />
              )}

              <Text style={[styles.userTxt, { color: colors.color_both_Side }]}>
                Dr. {therapistData?.name}
              </Text>
              <FlatList
                data={specializationData}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.userDetailView}>
                      <Text
                        style={[
                          styles.specializationTxt,
                          { color: colors.color_both_Side },
                        ]}
                      >
                        {item?.name}
                      </Text>
                    </View>
                  );
                }}
              />
              {therapistData?.education && (
                <Text
                  style={{ alignSelf: "center", color: colors.color_both_Side }}
                >
                  ({therapistData?.education})
                </Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Rating
                  type="custom"
                  startingValue={therapistData?.avg_rating}
                  minValue={0.5}
                  jumpValue={0.5}
                  readonly
                  ratingCount={5}
                  tintColor={colors.therapostblock}
                  style={{ paddingVertical: 5 }}
                  imageSize={20}
                />
                <Text
                  style={[styles.ratingTxt, { color: colors.color_both_Side }]}
                >
                  {Number(therapistData?.avg_rating)?.toFixed(1)} (
                  {therapistFeedback?.length})
                </Text>
              </View>
              {therapistData?.about && (
                <Text
                  style={[
                    styles.therapistdis,
                    { color: colors.therapistdiscription },
                  ]}
                >
                  {therapistData?.about}
                </Text>
              )}
            </View>
            <View style={styles.locationView}>
              <View style={styles.locationShadowView}>
                <View style={styles.locationTopView}>
                  <FastImage
                    resizeMode="contain"
                    style={styles.locationImg}
                    source={images.location}
                  />
                  <View style={styles.locationmainView}>
                    <Text
                      style={[styles.experienceTxt, { color: colors.location }]}
                    >
                      {localization?.appkeys?.Location}
                    </Text>
                    <Text
                      style={[
                        styles.addressTxt,
                        { color: colors.locationdiscription },
                      ]}
                    >
                      {therapistData?.location_name &&
                        therapistData?.location_name}
                      {therapistData?.location_name && therapistData?.state
                        ? ","
                        : null}
                      {therapistData?.state && therapistData?.state}
                      {(therapistData?.location_name || therapistData?.state) &&
                      therapistData?.city
                        ? ","
                        : null}
                      {therapistData?.city && therapistData?.city}
                    </Text>

                    {/* <Text style={[styles.addressTxt, { color: colors.locationdiscription }]}>{therapistData?.country}{","}{therapistData?.state}{","}{therapistData?.city}</Text> */}
                  </View>
                </View>
              </View>
              <View style={styles.locationShadowView}>
                <View style={styles.locationTopView}>
                  <FastImage
                    resizeMode="contain"
                    style={styles.locationImg}
                    source={images.experience}
                  />
                  <View style={styles.locationmainView}>
                    <Text
                      style={[styles.experienceTxt, { color: colors.location }]}
                    >
                      {localization?.appkeys?.Experience}
                    </Text>
                    <Text
                      style={[
                        styles.addressTxt,
                        { color: colors.locationdiscription },
                      ]}
                    >
                      {therapistData?.experience} Years of Experience
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.callTopView}>
              {/* <Pressable
                onPress={() => {
                  setcallView(true);
                }}
                style={[
                  styles.callMainView,
                  {
                    backgroundColor: colors.callview,
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <FastImage
                  resizeMode="contain"
                  style={styles.callImg}
                  source={images.call}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  navigation.navigate(AppRoutes.Video, { from: "profile" });
                }}
                style={[
                  styles.callMainView,
                  {
                    backgroundColor: colors.callview,
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <FastImage
                  resizeMode="contain"
                  style={styles.callImg}
                  source={images.video}
                />
              </Pressable> */}
              <Pressable
                onPress={() => {
                  navigation.navigate(AppRoutes.ChatScreen, {
                    otherUserId: item?._id,
                    otherUserName: item?.name,
                    otherUserProfile: item?.profile_pic
                      ? item?.profile_pic
                      : item?.profile,
                    appointmentID: item?.appointmentID,
                  });
                }}
                style={[
                  styles.callMainView,
                  {
                    backgroundColor: colors.callview,
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <FastImage
                  resizeMode="contain"
                  style={styles.callImg}
                  source={images.chat}
                />
              </Pressable>
            </View>
            <View style={styles.review}>
              <Text style={[styles.feedback, { color: colors.user_Color }]}>
                {localization?.appkeys?.Feedback}
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate(AppRoutes.Feedback, {
                    appointmentID: item?.appointmentID,
                    item,
                  });
                }}
              >
                <Text
                  style={[styles.writeReviewTxt, { color: colors.user_Color }]}
                >
                  {localization?.appkeys?.Writereview}
                </Text>
              </Pressable>
            </View>
            <View style={{ marginBottom: 60 }}>
              <FlatList
                data={therapistFeedback}
                renderItem={({ item, index }) => {
                  const feedbackUserName =
                    item?.rating > 3 ? item?.feedback_by[0]?.name : "Anonymous";
                  return (
                    <View style={styles.feedbackView}>
                      <View style={styles.feedbackBottomView}>
                        <Text
                          style={[
                            styles.username,
                            { color: colors.locationdiscription },
                          ]}
                        >
                          {feedbackUserName}
                        </Text>
                        <Text
                          style={[
                            styles.dateTxt,
                            { color: colors.locationdiscription },
                          ]}
                        >
                          {formattedDate(item?.created_at)}
                        </Text>
                      </View>
                      <Rating
                        type="custom"
                        startingValue={item?.rating}
                        jumpValue={1}
                        minValue={1}
                        ratingCount={5}
                        tintColor="white"
                        readonly={true}
                        style={{
                          alignSelf: "flex-start",
                          marginLeft: -5,
                          // marginTop: -5,
                          marginBottom: -5,
                        }}
                        ratingBackgroundColor="#c8c7c8"
                        imageSize={20}
                      />
                      {item?.feedback && (
                        <Text
                          style={[
                            styles.feedbackTxt,
                            { color: colors.therapistdiscription },
                          ]}
                        >
                          {item?.feedback}
                        </Text>
                      )}
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
          {callView && (
            <CallComp
              visible={callView}
              onEndPress={() => {
                setcallView(false);
                //   navigation.navigate(AppRoutes.Feedback)
              }}
            ></CallComp>
          )}
        </View>
      }
    />
  );
};

export default Therapist;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  userImg: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: "center",
    position: "absolute",
    top: -65,
  },
  locationmainView: {
    marginLeft: 5,
    width: wp(30),
  },
  ratingTxt: {
    fontFamily: AppFonts.Regular,
    marginLeft: 10,
    marginTop: 5,
  },
  userDetailView: {
    alignSelf: "center",
    flexDirection: "row",
    marginLeft: 10,
  },
  specializationTxt: {
    fontFamily: AppFonts.Regular,
    fontSize: 12,
  },
  userTxt: {
    fontFamily: AppFonts.Bold,
    fontSize: 16,
    marginTop: 15,
    alignSelf: "center",
    marginTop: 40,
  },
  mbbsTxt: {
    fontFamily: AppFonts.Medium,
    fontSize: 12,
    alignSelf: "center",
  },
  therapistBlock: {
    width: wp(90),
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 20,
    alignSelf: "center",
    marginTop: hp(12),
  },
  therapistdis: {
    fontFamily: AppFonts.Regular,
    fontSize: 12,
    marginTop: 5,
  },
  locationView: {
    flexDirection: "row",
    width: wp(90),
    alignSelf: "center",
    justifyContent: "space-between",
    marginTop: hp(3),
    marginBottom: hp(3),
  },
  locationShadowView: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
  },
  locationImg: {
    height: 22,
    width: 22,
    alignSelf: "flex-start",
  },
  locationTopView: {
    width: wp(35),
    flexDirection: "row",
    alignItems: "center",
  },
  addressTxt: {
    fontSize: 10,
    fontFamily: AppFonts.Regular,
    width: wp(30),
  },
  experienceTxt: {
    fontFamily: AppFonts.SemiBold,
  },
  callTopView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp(90),
    alignSelf: "center",
  },
  callMainView: {
    paddingHorizontal: 45,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 5,
    width: wp(28),
  },
  callImg: {
    height: hp(2.5),
    width: hp(2.5),
  },
  feedbackView: {
    padding: 15,
    width: wp(90),
    alignSelf: "center",
    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  feedbackBottomView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    fontSize: 16,
    fontFamily: AppFonts.Bold,
  },
  dateTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Regular,
  },
  feedbackTxt: {
    fontFamily: AppFonts.Regular,
    fontSize: 12,
    marginTop: 10,
  },
  review: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(90),
    alignItems: "center",
    alignSelf: "center",
    marginTop: hp(2.5),
  },
  feedback: {
    fontFamily: AppFonts.SemiBold,
    fontSize: 18,
  },
  writeReviewTxt: {
    fontFamily: AppFonts.Regular,
    fontSize: 14,
  },
});
