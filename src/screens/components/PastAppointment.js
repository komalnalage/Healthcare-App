import { useTheme } from "@react-navigation/native";
import React, { memo } from "react";
import { Image, View, Text, Pressable, StyleSheet } from "react-native";
import AppFonts from "../../constants/fonts";
import { Rating } from "react-native-ratings";
import { localization } from "../../localization/localization";
import getEnvVars from "../../../env";
import moment from "moment";
import FastImage from "react-native-fast-image";

const PastAppointment = ({ item, index, type, onChat, handleupcomingAppointment, onvideoPress, onpressBookAgain }) => {
  const { colors, images } = useTheme();
  return (
    <Pressable
      onPress={handleupcomingAppointment}
      style={[styles.therapostblock, { backgroundColor: colors.therapostblock, }]}>
      <View style={styles.topView}>
        {
          type == 'therapist' ?
            <FastImage style={styles.w3Img}
              source={item?.user_detail?.profile_pic ? (item?.user_detail?.profile_pic?.includes("https") ? { uri: item?.user_detail?.profile_pic } : { uri: getEnvVars().fileUrl + item?.user_detail?.profile_pic }) : images.defaultPic} />
            :
            <FastImage style={styles.w3Img}
              source={item?.therapist_detail?.profile_pic ? (item?.therapist_detail?.profile_pic?.includes("https") ? { uri: item?.therapist_detail?.profile_pic } : { uri: getEnvVars().fileUrl + item?.therapist_detail?.profile_pic }) : images.defaultPic} />
        }

        <View style={styles.discriptionView}>
          <Text style={[styles.userName, { color: colors.color_both_Side, }]}>
            {type == 'therapist' ? item?.user_detail?.name : item?.therapist_detail?.name}
          </Text>
          <Text style={[styles.emailTxt, { color: colors.color_both_Side, }]}>
            {type == 'therapist' ? item?.user_detail?.email : item?.therapist_detail?.email}
          </Text>
          {type == 'user' ?
            <View style={styles.ratingView}>
              <Rating
                type="custom"
                startingValue={item?.feedback?.averageRating??0}
                jumpValue={1}
                minValue={1}
                readonly
                ratingCount={5}
                tintColor={colors.therapostblock}
                style={{ alignSelf: 'flex-start' }}
                ratingBackgroundColor='#c8c7c8'
                imageSize={18}
              />
             {item?.feedback?.averageRating &&<Text style={[styles.ratingTxt, { color: colors.color_both_Side, }]}>
              {Number(item?.feedback?.averageRating).toFixed(1)+' ('+item?.feedback?.totalFeedback+')'}
              </Text>}
            </View>
            :
            <Text style={[styles.numberTxt, { color: colors.color_both_Side, }]}>
              {item?.user_detail?.phone_number}
            </Text>}
        </View>
      </View>

      <View style={[styles.emptyView, { backgroundColor: colors.btnColor, }]} />

      <View style={styles.lineBottomView}>

        <View style={{ alignSelf: 'center' }}>
          <Text
            style={[styles.appointmentonTxt, { color: colors.color_both_Side, }]}>
            {localization?.appkeys?.appointmenton}
          </Text>

          <Text
            style={[styles.dateTxt, { color: colors.color_both_Side, }]}
          >
            {moment(item?.appointment_date_time).format("DD MMM, h:mm A")}
          </Text>
        </View>

        {
          type == 'user' ?
            <Pressable
              onPress={onpressBookAgain}
              style={[styles.bookingAgainView, { backgroundColor: colors.btnColor, }]}>
              <Text
                style={styles.bookingAgainTxt}
              >
                {localization?.appkeys?.bookagain}
              </Text>
            </Pressable>
            :
            <View style={styles.imageSection}>
              {/* <Pressable style={[styles.phoneView, { borderColor: colors.btnColor, }]}>
                <Image source={images.phone} style={[styles.phoneImg, { tintColor: colors.btnColor }]} />
              </Pressable>
              <Pressable
                onPress={onvideoPress}
                style={[styles.videoView, { borderColor: colors.btnColor, }]}>
                <Image source={images.video} style={[styles.phoneImg, { tintColor: colors.btnColor }]} />
              </Pressable> */}
              <Pressable onPress={onChat}
                style={[styles.phoneView, { borderColor: colors.btnColor, }]}>
                <Image source={images.chat} style={[styles.phoneImg, { tintColor: colors.btnColor }]} />
              </Pressable>
            </View>}

      </View>
    </Pressable>
  )
}

export default memo(PastAppointment)
const styles = StyleSheet.create({
  therapostblock: {
    width: '100%',
    borderRadius: 8,
    marginTop: 12,
    padding: 8,
   
  },
  topView: {
    width: '100%',
    flexDirection: 'row'
  },
  w3Img: {
    width: 80,
    height: 80,
    borderRadius: 8
  },
  discriptionView: {
    height: 80,
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  userName: {
    fontSize: 16,
    fontFamily: AppFonts.Bold,
    marginLeft: 8
  },
  emailTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Medium,
    marginLeft: 8
  },
  ratingView: {
    flexDirection: 'row',
    marginLeft: 8
  },
  ratingTxt: {
    fontSize: 10,
    fontFamily: AppFonts.Medium,
    marginLeft: 8,
    alignSelf: 'center'
  },
  numberTxt: {
    fontSize: 14,
    fontFamily: AppFonts.Medium,
    marginLeft: 8
  },
  emptyView: {
    width: '100%',
    height: 1,
    alignSelf: 'center',
    marginVertical: 16,
    opacity: 0.3
  },
  lineBottomView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 3
  },
  appointmentonTxt: {
    fontSize: 11.5,
    fontFamily: AppFonts.Light
  },
  dateTxt: {
    fontSize: 14,
    fontFamily: AppFonts.SemiBold,
    marginTop: 2
  },
  bookingAgainView: {
    height: 50,
    width: '50%',
    borderRadius: 8,
    justifyContent: 'center'
  },
  bookingAgainTxt: {
    color: 'white',
    fontSize: 15,
    fontFamily: AppFonts.Medium,
    alignSelf: 'center'
  },
  phoneImg: {
    width: 16,
    height: 16,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  phoneView: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center'
  },
  videoView: {
    width: 40,
    height: 40,
    marginHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center'
  },
  imageSection: {
    flexDirection: 'row'
  },
})