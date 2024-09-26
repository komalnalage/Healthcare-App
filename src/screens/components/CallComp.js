import {
  View,
  Text,
  Modal,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import AppFonts from "../../constants/fonts";
import FastImage from "react-native-fast-image";

export default function CallComp({ visible, onEndPress }) {
  const { colors, images } = useTheme();
  return (
    <Modal visible={visible} transparent={true}>
      <ImageBackground
        blurRadius={70}
        imageStyle={{ opacity: 0.94 }}
        style={{
          flex: 1,
          overflow: "hidden",
        }}
        source={images.callbg}
      >
        <View
          style={{
            opacity: 1,
            overflow: "visible",
          }}
        >
          <Image
            source={{
              uri: "https://www.commport.com/wp-content/uploads/2016/03/testimonialimage4.jpg",
            }}
            style={styles.userImage}
          ></Image>
        </View>
        <Text
          style={[styles.userName, { color: colors.text, }]}
        >
          John Doe
        </Text>
        <Text
          style={[styles.timeTxt, { color: colors.text, }]}
        >
          6:20
        </Text>

        <View style={styles.bottomView}>
          <TouchableOpacity style={styles.callview}>
            <FastImage
              resizeMode="contain"
              source={images.mute}
              style={styles.muteImg}
            ></FastImage>
          </TouchableOpacity>
          <TouchableOpacity onPress={onEndPress} style={styles.endView}>
            <FastImage
              resizeMode="contain"
              source={images.end}
              style={styles.muteImg}
            ></FastImage>
          </TouchableOpacity>
          <TouchableOpacity style={styles.speakerVIEW}>
            <FastImage
              resizeMode="contain"
              source={images.speaker}
              style={styles.muteImg}
            ></FastImage>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bottomView: {
    justifyContent: "space-around",
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
    width: "100%",
  },
  muteImg: {
    height: 30,
    width: 30
  },
  timeTxt: {
    alignSelf: "center",
    fontSize: 16,
    fontFamily: AppFonts.Regular,
    marginTop: 10,
  },
  userName: {
    alignSelf: "center",
    fontSize: 20,
    fontFamily: AppFonts.SemiBold,
    marginTop: 20,
  },
  userImage: {
    height: 150,
    resizeMode: "cover",
    width: 150,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 100,
    borderWidth: 3,
    borderColor: "white",
  },
  speakerVIEW: {
    backgroundColor: "#2EDDCC",
    height: 65,
    width: 65,
    borderRadius: 100,
    shadowRadius: 10,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  endView: {
    backgroundColor: "#FF4747",
    height: 65,
    width: 65,
    borderRadius: 100,
    shadowRadius: 10,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  callview: {
    backgroundColor: "#2EDDCC",
    height: 65,
    width: 65,
    borderRadius: 100,
    shadowRadius: 10,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
  },
});
