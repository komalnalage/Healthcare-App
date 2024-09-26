import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { hp, wp } from "../../utils/dimension";
import { useTheme } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import AppFonts from "../../constants/fonts";
import getEnvVars from "../../../env";

export default function ChatHeader({ backPress, name, status, oncallPress, onPressVideo, profile }) {
  const { colors, images } = useTheme();
  return (
    <View style={[styles(colors).mainView, { borderColor: colors.btnColor }]}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={backPress}>
          <FastImage
            tintColor={colors.backarrow}
            style={styles(colors).imageView}
            resizeMode="contain"
            source={images.backarrow}
          />
        </TouchableOpacity>
        <FastImage style={styles(colors).userView} source={profile ? { uri: profile?.includes("https:")?profile: getEnvVars().fileUrl + profile } : images.defaultPic} />
        <View
          style={{
            marginLeft: 5,
            justifyContent: "space-evenly",
          }}
        >
          <Text style={[styles(colors).title, { textTransform: "capitalize" }]}>{name}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              top: -2,
            }}
          >
            <View style={[styles((colors)).dot, { backgroundColor: status == "Online" ? colors.green : "grey", }]}></View>
            <Text style={styles(colors).status}>{status}</Text>
          </View>
        </View>
      </View>
      {/* <View style={{ flexDirection: "row" }}>
        <Pressable onPress={oncallPress} style={styles(colors).callView}>
          <FastImage source={images.call} style={styles(colors).call} />
        </Pressable>
        <Pressable
          onPress={onPressVideo}
          style={styles(colors).videoView}>
          <FastImage
            resizeMode="contain"
            source={images.video}
            style={styles(colors).video}
          />
        </Pressable>
      </View> */}
    </View>
  );
}
const styles = (colors) => StyleSheet.create({
  dot: {
    height: 8,
    width: 8,
    backgroundColor: colors.green,
    borderRadius: 100,
  },
  status: {
    fontSize: 12,
    marginLeft: 5,
    fontFamily: AppFonts.Regular,
    color: colors.text,
  },
  title: { fontSize: 16, fontFamily: AppFonts.Medium, color: colors.text },
  userView: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginLeft: 12,
    alignSelf: "center",
  },
  callView: {
    width: 40,
    backgroundColor: colors.callview,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    justifyContent: "center",
  },
  videoView: {
    width: 40,
    backgroundColor: colors.callview,
    height: 40,
    marginHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    justifyContent: "center",
  },
  video: {
    width: 20,
    height: 20,
    alignSelf: "center",
    tintColor: colors.btnColor,
  },
  call: {
    width: 16,
    height: 16,
    alignSelf: "center",
    resizeMode: "center",
    tintColor: colors.btnColor,
  },
  mainView: {
    width: "100%",
    height: 80,
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  styleText: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 24,
  },
  imageView: {
    height: hp(3),
    width: wp(3),
    margin: 5
  },
});
