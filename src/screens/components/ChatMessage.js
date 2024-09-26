import moment from "moment";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AppFonts from "../../constants/fonts";
import { useTheme } from "@react-navigation/native";
import getEnvVars from "../../../env";

function ChatMessage({ user_id, item, filePress, defaultPic, localimg }) {
  let user = item.user_id != user_id;
  const { colors } = useTheme();

  return (
    <View style={{}}>
      {!user && item?.type == "text" && (
        <View
          style={{
            marginTop: 15,
            left: 15,
          }}
        >
          <View
            style={{
              minWidth: widthPercentageToDP(20),
              minHeight: 45,
              alignSelf: "flex-start",
              flexDirection: "row"
            }}
          >
            <FastImage style={{
              height: 30, width: 30,
              borderRadius: 100
            }} source={{ uri: item?.profilePic ? item?.profilePic?.includes("https:")?item?.profilePic: getEnvVars().fileUrl + item?.profilePic : localimg }}></FastImage>
            <View style={{
              marginLeft: 5
            }}>
              <View
                style={{
                  maxWidth: widthPercentageToDP(80),
                  minWidth: widthPercentageToDP(20),
                  padding: 12,
                  minHeight: 40,
                  backgroundColor: "rgba(233, 252, 250, .5)",
                  borderTopRightRadius: 15,
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  maxFontSizeMultiplier={2.5}
                  style={{
                    fontFamily: AppFonts.Medium,
                    fontSize: 12,
                    color: "#26333B",
                  }}
                >
                  {item?.message}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  alignSelf: "flex-start",
                }}
              >
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    maxFontSizeMultiplier={2}
                    style={{
                      marginRight: 5,
                      color: "#000000",
                      fontSize: 10,
                      marginTop: 5,
                      fontFamily: AppFonts.MediumItalic,
                    }}
                  >
                    {moment(item?.createdAt?.seconds * 1000).format("hh:mm A")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
      {user && item?.type == "text" && (
        <View
          style={{
            marginTop: 15,
            right: 10,
          }}
        >
          <View
            style={{
              minWidth: widthPercentageToDP(20),
              minHeight: 45,
              alignContent: "center",
              alignSelf: "flex-end",
              flexDirection: "row"
            }}
          >
            <View>
              <View
                style={{
                  maxWidth: widthPercentageToDP(80),
                  minWidth: widthPercentageToDP(20),
                  padding: 12,
                  minHeight: 10,
                  backgroundColor: "rgba(233, 252, 250, 1)",
                  borderTopLeftRadius: 15,
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  marginRight: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "flex-end",
                }}
              >
                <Text
                  maxFontSizeMultiplier={2.5}
                  style={{
                    fontFamily: AppFonts.Medium,
                    fontWeight: "bold",
                    fontSize: 12,
                    color: "#26333B",
                  }}
                >
                  {item?.message}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  alignSelf: "flex-end",
                }}
              >
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    maxFontSizeMultiplier={2}
                    style={{
                      marginRight: 5,
                      color: "#000000",
                      fontSize: 10,
                      fontFamily: AppFonts.MediumItalic,
                      marginTop: 5,
                    }}
                  >
                    {moment(item?.createdAt?.seconds * 1000).format("hh:mm A")}  <Text style={{
                      color: item?.read ? "#2EDDCC" : "grey"
                    }}>✓✓</Text>
                  </Text>
                </View>
              </View>
            </View>
            <FastImage style={{
              height: 30, width: 30,
              borderRadius: 100
            }} source={{ uri: item?.profilePic ? item?.profilePic?.includes("https:")?item?.profilePic: getEnvVars().fileUrl + item?.profilePic : localimg }}></FastImage>
          </View>
        </View>
      )}
      {!user && item?.type == "image" && item?.url && (
        <View
          style={{
            marginTop: 15,
            left: 15,
            marginBottom: 17,
          }}
        >
          <View
            style={{
              minWidth: widthPercentageToDP(20),
              minHeight: 45,
              alignSelf: "flex-start",
              flexDirection: "row"
            }}
          >
            <FastImage style={{
              height: 30, width: 30,
              borderRadius: 100,
              alignSelf: "flex-end"
            }} source={{ uri: item?.profilePic ? item?.profilePic?.includes("https:")?item?.profilePic: getEnvVars().fileUrl + item?.profilePic : localimg }}></FastImage>
            <View style={{
              marginLeft: 5
            }}></View>
            <Pressable
              onPress={() => {
              }}
              style={style(colors).imageView}
            >
              <View>
                <FastImage
                  resizeMode="cover"
                  style={style(colors).imageViewContainer}
                  source={
                    {

                      uri: item?.url ? item?.url : localimg,
                      priority: FastImage.priority.high,
                    }
                  }
                >
                </FastImage>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    maxFontSizeMultiplier={2}
                    style={{
                      marginRight: 5,
                      color: "#000000",
                      fontSize: 10,
                      marginTop: 5,
                      fontFamily: AppFonts.MediumItalic,
                    }}
                  >
                    {moment(item?.createdAt?.seconds * 1000).format("hh:mm A")}
                  </Text>
                </View>
              </View>

            </Pressable>
          </View>
        </View>
      )}
      {user && item?.type == "image" && (
        <View
          style={{
            marginTop: 15,
            right: 10,
          }}
        >
          <Pressable
            onPress={() => {
            }}
            style={style(colors).imageViewRight}
          >
            <FastImage
              style={style(colors).imageViewRightContainer}
              source={{ uri: item?.url ? item?.url : localimg }}
            >
            </FastImage>
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              alignSelf: "flex-end",
            }}
          >
            <View
              style={{
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  alignSelf: "flex-end",
                }}
              >
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    maxFontSizeMultiplier={2}
                    style={{
                      marginRight: 5,
                      color: "#000000",
                      fontSize: 10,
                      fontFamily: AppFonts.MediumItalic,
                      marginTop: 5,
                    }}
                  >
                    {moment(item?.createdAt?.seconds * 1000).format("hh:mm A")}  <Text style={{
                      color: item?.read ? "#2EDDCC" : "grey"
                    }}>✓✓</Text>
                  </Text>
                </View>
              </View>
            </View>
            <FastImage style={{
              height: 30, width: 30,
              borderRadius: 100,
              top: -25
            }} source={{ uri: item?.profilePic ? item?.profilePic?.includes("https:")?item?.profilePic: getEnvVars().fileUrl + item?.profilePic : localimg }}></FastImage>
          </View>
        </View>
      )}
    </View>
  );
}
const style = (colors) =>
  StyleSheet.create({
    container: {
      width: widthPercentageToDP(70),
      marginTop: 20,
      flexDirection: "row",
      marginLeft: "3%",
    },
    containerRight: {
      marginTop: 20,
      flexDirection: "row",
      marginRight: "3%",
      alignSelf: "flex-end",
    },
    chatImage: {
      height: heightPercentageToDP(4.5),
      width: heightPercentageToDP(4.5),
      borderRadius: 100,
    },

    image: {
      width: widthPercentageToDP(12),
      height: widthPercentageToDP(12),
      borderRadius: widthPercentageToDP(6),
    },
    textView: {
      height: 30,
      justifyContent: "center",
      marginTop: 8,
    },
    messageView: {
      minWidth: 90,
      maxWidth: 300,
      backgroundColor: colors.black,
      padding: "3%",
    },
    textViewRight: {
      height: 30,
      justifyContent: "center",
      marginTop: 8,
      alignSelf: "flex-end",
    },
    messageViewRight: {
      minWidth: 90,
      maxWidth: 250,
      alignSelf: "flex-end",
      backgroundColor: colors.lightgrey,
      padding: "3%",
      marginRight: "2%",
    },
    imageRight: {
      width: widthPercentageToDP(12),
      height: widthPercentageToDP(12),
      borderRadius: widthPercentageToDP(6),
    },
    time: {
      width: widthPercentageToDP(25),
      height: heightPercentageToDP(3),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    texttime: {
      fontFamily: AppFonts.raleMedium,
      color: colors.black,
      fontSize: 10,
    },
    righttime: {
      width: widthPercentageToDP(25),
      height: heightPercentageToDP(3),
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    righttexttime: {
      fontFamily: AppFonts.raleMedium,
      color: colors.black,
      fontSize: 10,
      textAlign: "right",
    },
    textMessage: {
      color: colors.black,
    },
    imageView: {
      width: widthPercentageToDP(60),
      height: widthPercentageToDP(60),
      marginLeft: 1,
      marginTop: "-1%",
    },
    imageViewContainer: {
      width: widthPercentageToDP(60),
      height: widthPercentageToDP(60),
      borderRadius: 10,
    },
    imageViewRight: {
      width: widthPercentageToDP(60),
      height: widthPercentageToDP(60),
      marginRight: 33,
      alignSelf: "flex-end",
      marginTop: "-1%",
    },
    imageViewRightContainer: {
      width: widthPercentageToDP(60),
      height: widthPercentageToDP(60),
      borderRadius: 10,
    },
    imagetime: {
      width: widthPercentageToDP(12.5),
      height: heightPercentageToDP(3),
      marginTop: "1%",
      marginBottom: "20%",
    },
    imagetimeRight: {
      width: widthPercentageToDP(27),
      height: heightPercentageToDP(3),
      alignSelf: "flex-end",
      marginBottom: "5%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    fileViewContainer: {
      width: widthPercentageToDP(20.5),
      height: widthPercentageToDP(25),
    },
    fileViewRightContainer: {
      width: widthPercentageToDP(20.5),
      height: widthPercentageToDP(25),
      alignSelf: "flex-end",
    },
    fileView: {
      width: widthPercentageToDP(35),
      height: widthPercentageToDP(35),
      marginLeft: "3%",
      marginTop: "4%",
    },
    fileViewRight: {
      width: widthPercentageToDP(30),
      height: widthPercentageToDP(35),
      marginRight: "3%",
      alignSelf: "flex-end",
      marginTop: "3%",
    },
  });
export default ChatMessage;
