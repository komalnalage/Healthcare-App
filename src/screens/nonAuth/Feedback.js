import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { hp, wp } from "../../utils/dimension";
import FastImage from "react-native-fast-image";
import { useIsFocused, useTheme } from "@react-navigation/native";
import AppFonts from "../../constants/fonts";
import { Rating } from "react-native-ratings";
import { LocalizationContext } from "../../localization/localization";
import SolidView from "../components/SolidView";
import FeedbackInput from "../components/FeedbackInput";
import CustomBtn from "../components/CustomBtn";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import { useDispatch, useSelector } from "react-redux";
import getEnvVars from "../../../env";
import {
  getTherapistDetail,
  userPostFeedback,
} from "../../api/Services/services";
import Loader from "../modals/Loader";
import AppUtils from "../../utils/appUtils";
import { setloading } from "../../redux/Reducers/userData";
import { setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Feedback = ({ navigation, route }) => {
  console.log(route?.params);
  let focus = useIsFocused();
  const userDetail = useSelector((state) => state.userData.userDetail);
  const token = useSelector((state) => state.userData.token);
  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);
  const loader = useSelector((state) => state.userNewData.loader);

  const [Message, setMessage] = useState("");
  const [ratings, setratings] = useState(1);
  const [therapistDetail, settherapistDetail] = useState();
  const [specialization, setspecialization] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (focus) {
      TherapistDetail();
    }
  }, [focus]);

  const TherapistDetail = async () => {
    dispatch(setloader(true));
    let res = null;
    res = await getTherapistDetail(userDetail?.therapist_detail?._id, token);
    if (res?.data?.status) {
      settherapistDetail(res?.data?.data);
      let aa = res?.data?.data?.specialization ?? [];
      let filterdata_name = aa?.map((x) => {
        return x.name;
      });
      setspecialization(filterdata_name);

      dispatch(setloader(false));
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
    }
  };

  const [img, setImg] = useState();

  useEffect(() => {
    setImg(
      therapistDetail?.profile_pic?.includes("https")
        ? therapistDetail?.profile_pic
        : therapistDetail?.profile_pic
        ? getEnvVars().fileUrl + therapistDetail?.profile_pic
        : ""
    );
  }, [therapistDetail]);

  const postFeedback = async () => {
    if (ratings === 1 && Message.trim() === "") {
      AppUtils.showToast("Please Enter your feedback...");
      return;
    }
    if (Message.trim() === "") {
      // Show a message indicating that the feedback is required
      AppUtils.showToast("Please Enter your feedback...");
      return;
    }
    dispatch(setloader(true));
    let res = null;
    res = await userPostFeedback(
      userDetail?.appointment_id
        ? userDetail?.appointment_id
        : route?.params?.appointmentID,
      ratings,
      Message,
      token
    );
    if (res?.data?.status) {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      navigation.navigate(AppRoutes.Therapist, {
        item: {
          _id: userDetail?.therapist_detail?._id
            ? userDetail?.therapist_detail?._id
            : route?.params?.item?._id,
          name: userDetail?.therapist_detail?.name,
          profile: userDetail?.therapist_detail?.profile_pic,
          appointmentID: userDetail?.appointment_id
            ? userDetail?.appointment_id
            : route?.params?.appointmentID,
        },
      });
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
            title={localization?.appkeys?.LeaveYourFeedback}
            onPressBack={() => {
              navigation.navigate(AppRoutes.Therapist, {
                item: {
                  _id: userDetail?.therapist_detail?._id,
                  name: userDetail?.therapist_detail?.name,
                  profile: userDetail?.therapist_detail?.profile_pic,
                },
              });
            }}
          />
          <KeyboardAwareScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.ratingView}>
              {therapistDetail?.profile_pic ? (
                <FastImage
                  resizeMode="contain"
                  source={{ uri: img }}
                  style={[styles.userImg]}
                />
              ) : (
                <FastImage
                  resizeMode="contain"
                  source={images.defaultPic}
                  style={[styles.userImg]}
                />
              )}
              {/* <FastImage
                                style={styles.userImg}
                                source={therapistDetail?.profile_pic?.includes("https") ? therapistDetail?.profile_pic : therapistDetail?.profile_pic ? getEnvVars().fileUrl + therapistDetail?.profile_pic : "" }
                                // source={userDetail?.therapist_detail?.profile_pic ? { uri: getEnvVars().fileUrl + userDetail?.therapist_detail?.profile_pic } : images.feedback}
                            /> */}
              <Text style={[styles.userTxt, { color: colors.text }]}>
                Dr.{therapistDetail?.name ? therapistDetail?.name : "Fred Mask"}
              </Text>

              <FlatList
                data={specialization}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.userDetailView}>
                      <Text
                        style={[
                          styles.specializationTxt,
                          { color: colors.text },
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  );
                }}
              />
              {therapistDetail?.education && (
                <Text
                  style={{
                    fontFamily: AppFonts.Regular,
                    color: colors.text,
                  }}
                >
                  ({therapistDetail?.education})
                </Text>
              )}

              <Rating
                type="custom"
                startingValue={1}
                jumpValue={1}
                minValue={1}
                ratingCount={5}
                onFinishRating={(e) => setratings(e)}
                style={{ paddingVertical: 20, paddingHorizontal: 20 }}
              />
              <View style={{ paddingBottom: 20 }}>
                <FeedbackInput
                  title={localization?.appkeys?.Feedback}
                  value={Message}
                  onChangeText={setMessage}
                />
              </View>
              <View style={{ width: wp(90) }}>
                <CustomBtn
                  onPress={() => {
                    postFeedback();
                  }}
                  btnStyle={{ marginTop: 70, marginBottom: 30 }}
                  titleTxt={localization?.appkeys?.Submit}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </>
      }
    />
  );
};

export default Feedback;

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
  ratingView: {
    alignSelf: "center",
    marginTop: hp(3),
    alignItems: "center",
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 100,
  },
  userTxt: {
    fontFamily: AppFonts.Bold,
    fontSize: 16,
    marginTop: 15,
  },
  mbbsTxt: {
    fontFamily: AppFonts.Medium,
    fontSize: 12,
  },
});
