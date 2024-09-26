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
import EditTiming from "../modals/EditTiming";
import { LocalizationContext } from "../../localization/localization";
import { get_my_feedbacks, getspecialization } from "../../api/Services/services";
import AppUtils from "../../utils/appUtils";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../modals/Loader";
import getEnvVars from "../../../env";
import moment from "moment";
import {
  setdrawerSelectedTab,
  setloader,
} from "../../redux/Reducers/UserNewData";

const TherapistProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData.userData);
  const { colors, images } = useTheme();
  const loader = useSelector((state) => state.userNewData.loader);
  const { localization } = useContext(LocalizationContext);
  const [showCancel, setShowCancel] = useState(false);
  const [img, setImg] = useState(userData?.profile_pic?.includes("https") ? userData?.profile_pic : userData?.profile_pic ? getEnvVars().fileUrl + userData?.profile_pic : "");
  const [name, setname] = useState(userData?.name ? userData?.name : "");
  const [specialization, setspecialization] = useState(
    userData?.specialization ? userData?.specialization : ""
  );
  console.log("specialization77777",userData);
  const [education, seteducation] = useState(
    userData?.education ? userData?.education : ""
  );
  const [experience, setexperience] = useState(
    userData?.experience ? userData?.experience : ""
  );
  const [location, setlocation] = useState(
    userData?.location_name ? userData?.location_name : ""
  );
  const [about, setabout] = useState(userData?.about ? userData?.about : "");
  const [userDetail, setuserDetail] = useState([]);
  const token = useSelector((state) => state.userData.token);

  const [feedback, setfeedback] = useState([]);

  // useEffect(() => {
  //   if (focus && userData) {
  //     getSpecilization();
  //   }
  // }, [userData, focus]);

  useEffect(() => {
    therapist_feedbacks_Data();
    dispatch(setdrawerSelectedTab("Profile"));
  }, []);

  useEffect(() => {
    setabout(userData?.about ? userData?.about : "");
    setname(userData?.name ? userData?.name : "");
    setspecialization(userData?.specialization ? userData?.specialization : "");
    seteducation(userData?.education ? userData?.education : "");
    setexperience(userData?.experience ? userData?.experience : "");
    setlocation(userData?.location_name ? userData?.location_name : "");
    setImg(userData?.profile_pic?.includes("https") ? userData?.profile_pic : userData?.profile_pic ? getEnvVars().fileUrl + userData?.profile_pic : "")
  }, [userData]);

  const therapist_feedbacks_Data = async () => {
    try {
      // dispatch(setloader(true));
      let res = null;
      res = await get_my_feedbacks(token);
      if (res?.data?.status) {
        setfeedback(res?.data?.data ?? []);
      } else {
        // AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log("therapist_feedbacks_Data error", error);
    } finally {
      dispatch(setloader(false));
    }
  };


  const getSpecilization = async () => {
    try {
        dispatch(setloader(true));
      let res = null;
      res = await getspecialization();
      // console.log("getspecialization",res?.data);
      const userSpecialization = userData?.specialization.map((i) =>
        i?._id ? i?._id : i
      );
      if (res?.data?.status) {
        let aa = res?.data?.data ?? [];
        let filterdata_name = aa
          ?.filter((x) => {
            if (userSpecialization?.includes(x._id)) {
              return x;
            }
          })
          .map((x) => x.name);
        setuserDetail(filterdata_name);
          dispatch(setloader(false));
      } else {
          dispatch(setloader(false));
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatch(setloader(false));
    }
  };

  return (
    <SolidView
      view={
        <View style={styles.mainView}>
          {loader && <Loader />}
          <Header
            title={localization?.appkeys?.profile}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.therapistBlock,
                { backgroundColor: colors.therapostblock },
              ]}
            >
              {userData?.profile_pic ? (
                <FastImage
                  resizeMode="cover"
                  source={{ uri: img }}
                  style={[
                    styles.userImg,
                    { borderColor: colors.therapostblock },
                  ]}
                />
              ) : (
                <FastImage
                  resizeMode="cover"
                  source={images.defaultPic}
                  style={[
                    styles.userImg,
                    { borderColor: colors.therapostblock },
                  ]}
                />
              )}
              <Text style={[styles.userTxt, { color: colors.homePageTitle }]}>
                Dr. {name}
              </Text>

              <FlatList
                data={userData?.specialization}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.userDetailView}>
                      <Text
                        style={[
                          styles.specializationTxt,
                          { color: colors.homePageTitle },
                        ]}
                      >
                        {item?.name}
                      </Text>
                    </View>
                  );
                }}
              />

              {userData?.education && (
                <Text
                  style={[styles.educationTxt, { color: colors.homePageTitle }]}
                >
                  ({education})
                </Text>
              )}
              {feedback?.averageRating > 0 && (
                <View style={styles.ratingTopView}>
                  <Rating
                    type="custom"
                    startingValue={feedback?.averageRating ?? 0}
                    jumpValue={1}
                    minValue={1}
                    readonly
                    ratingCount={5}
                    imageSize={30}
                    tintColor={colors.therapostblock}
                    style={{ paddingVertical: 10 }}
                  />
                  <Text
                    style={[styles.ratingTxt, { color: colors.homePageTitle }]}
                  >
                    {feedback?.averageRating
                      ? Number(feedback?.averageRating)?.toFixed(1) +
                        " (" +
                        feedback?.feedback?.length +
                        ")"
                      : 0}
                  </Text>
                </View>
              )}

              {about && (
                <Text
                  style={[
                    styles.therapistdis,
                    { color: colors.therapistdiscription },
                  ]}
                >
                  {about}
                </Text>
              )}
            </View>

            <View style={styles.locationView}>
              {userData?.location_name && (
                <View style={styles.locationShadowView}>
                  <View style={styles.locationTopView}>
                    <FastImage
                      resizeMode="contain"
                      style={styles.locationImg}
                      source={images.location}
                    />
                    <View style={{ marginLeft: 5 }}>
                      <Text
                        style={[
                          styles.experienceTxt,
                          { color: colors.location },
                        ]}
                      >
                        {localization?.appkeys?.loc}
                      </Text>
                      <Text
                        style={[
                          styles.addressTxt,
                          { color: colors.locationdiscription },
                        ]}
                      >
                        {location}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {userData?.experience && (
                <View style={styles.locationShadowView}>
                  <View style={styles.locationTopView}>
                    <FastImage
                      resizeMode="contain"
                      style={styles.locationImg}
                      source={images.experience}
                    />
                    <View style={{ marginLeft: 5 }}>
                      <Text
                        style={[
                          styles.experienceTxt,
                          { color: colors.location },
                        ]}
                      >
                        {localization?.appkeys?.Experience}
                      </Text>
                      <Text
                        style={[
                          styles.addressTxt,
                          { color: colors.locationdiscription },
                        ]}
                      >
                        {experience} {localization?.appkeys?.YearsofExperience}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.buttonView}>
              <Pressable
                onPress={() => {
                  navigation.navigate(AppRoutes.Availability);
                }}
                style={[
                  styles.editAvailBtn,
                  { backgroundColor: colors.btnColor },
                ]}
              >
                <Text style={[styles.availabilityTxt, { color: colors.white }]}>
                  {localization?.appkeys?.EditAvailability}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  navigation.navigate(AppRoutes.TherapistEditProfile);
                }}
                style={[
                  styles.editProfileButton,
                  { backgroundColor: colors.locationdiscription },
                ]}
              >
                <Text style={[styles.availabilityTxt, { color: colors.white }]}>
                  {localization?.appkeys?.editProfile}
                </Text>
              </Pressable>
            </View>
            {feedback?.feedback?.length > 0 && (
              <View style={styles.review}>
                <Text
                  style={[
                    styles.feedback,
                    { color: colors.locationdiscription },
                  ]}
                >
                  {localization?.appkeys?.MyFeedback}
                </Text>
              </View>
            )}

            <View style={{ marginBottom: 60 }}>
              <FlatList
                data={feedback?.feedback}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.feedbackView}>
                      <View style={styles.feedbackBottomView}>
                        <Text
                          style={[
                            styles.username,
                            { color: colors.locationdiscription },
                          ]}
                        >
                          {item?.user_detail?.name ?? ""}
                        </Text>
                        <Text
                          style={[
                            styles.dateTxt,
                            { color: colors.locationdiscription },
                          ]}
                        >
                          {moment(item?.updated_at).format("DD/MM/YYYY")}
                        </Text>
                      </View>
                      <Rating
                        type="custom"
                        startingValue={item?.rating}
                        jumpValue={1}
                        minValue={1}
                        readonly
                        ratingCount={5}
                        tintColor="white"
                        style={{
                          alignSelf: "flex-start",
                          marginLeft: -5,
                          marginTop: 5,
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
                          {item?.feedback ?? ""}
                        </Text>
                      )}
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
          <EditTiming
            isVisible={showCancel}
            onBackDropPress={() => {
              setShowCancel(false);
            }}
          />
        </View>
      }
    />
  );
};

export default TherapistProfile;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
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
  ratingTopView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  educationTxt: {
    marginLeft: 10,
    fontFamily: AppFonts.Regular,
    alignSelf: "center",
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp(91),
    alignSelf: "center",
  },
  ratingTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Regular,
    marginTop: 5,
    marginLeft: 10,
  },
  editProfileButton: {
    alignItems: "center",
    justifyContent: "center",
    height: hp(8),
    width: wp(43.5),
    borderRadius: 5,
  },
  editAvailBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: hp(8),
    width: wp(43),
    borderRadius: 5,
  },
  userImg: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: "center",
    position: "absolute",
    top: -65,
    borderWidth: 5,
  },
  userTxt: {
    fontFamily: AppFonts.Bold,
    fontSize: 16,
    marginTop: 15,
    alignSelf: "center",
    marginTop: 40,
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
  availabilityTxt: {
    fontFamily: AppFonts.Regular,
    fontSize: 16,
  },
});
