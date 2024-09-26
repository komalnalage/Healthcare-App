// import {
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   View,
//   useWindowDimensions,
// } from "react-native";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { hp, wp } from "../../utils/dimension";
// import { LocalizationContext } from "../../localization/localization";
// import { useTheme } from "@react-navigation/native";
// import FastImage from "react-native-fast-image";
// import ChatHeader from "../components/ChatHeader";
// import { FlatList } from "react-native-gesture-handler";
// import ChatMessage from "../components/ChatMessage";
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from "react-native-responsive-screen";
// import AppFonts from "../../constants/fonts";
// import { SafeAreaView } from "react-native-safe-area-context";
// import CallComp from "../components/CallComp";
// import AppRoutes from "../../routes/RouteKeys/appRoutes";
// import { useSelector } from "react-redux";
// import storage from "@react-native-firebase/storage";
// import firestore from "@react-native-firebase/firestore";
// import ImageCropPicker from "react-native-image-crop-picker";
// import CustomImagePickerModal from "../modals/CustomImagePickerModal";

// const ChatScreen = ({ navigation, route }) => {
//   const { otherUserId, otherUserName, otherUserProfile, appointmentID } =
//     route?.params;
//     console.log("otherUserProfile",otherUserProfile);
//   const { width } = useWindowDimensions();
//   const { localization } = useContext(LocalizationContext);
//   const [loading, setLoading] = useState(false);
//   const loader = useSelector((state) => state.userNewData.loader);

//   const { colors, images } = useTheme();
//   const [callView, setcallView] = useState(false);
//   const [showPicker, setshowPicker] = useState(false);
//   const yourRef = useRef(null);
//   const [msg, setmsg] = useState("");
//   const user = useSelector((state) => state.userData.user);
//   const userData = useSelector((state) => state.userData.userData);
//   const [Messages, setMessage] = useState([]);
//   const messagesRef = useRef([]);

//   const setMessages = (newMessages) => {
//     setMessage(newMessages);
//     messagesRef.current = newMessages;
//   };

//   console.log(userData);
//   const defaultProfile =
//     "https://cdn.landesa.org/wp-content/uploads/default-user-image.png";
//   const [localimg, setlocalimg] = useState(
//     "https://pixy.org/src/5/thumbs350/55685.jpg"
//   );
//   function getRoomId(params) {
//     let user_id = userData?._id;
//     let otheruserId = otherUserId;
//     let x = [user_id, otheruserId, appointmentID].sort();
//     let k = x.join("_");

//     return k;
//   }

//   async function sendMessage(params) {
//     firestore()
//       .collection("Chats")
//       .doc(getRoomId())
//       .collection("message")
//       .add({
//         user_id: userData?._id,
//         profilePic: userData?.profile_pic ?? "",
//         message: msg,
//         id: Messages.length.toString(),
//         type: "text",
//         createdAt: firestore.Timestamp.now(),
//         read: false,
//       })
//       .then(async () => {
//         let x = await firestore().collection("Chats").doc(getRoomId()).get();

//         if (x._exists) {
//           firestore()
//             .collection("Chats")
//             .doc(getRoomId())
//             .update({
//               user_id: [otherUserId, userData._id],
//               [otherUserId]: {
//                 name: otherUserName,
//                 profile_pic: otherUserProfile ?? "",
//                 uid: otherUserId,
//               },
//               [userData._id]: {
//                 name: userData?.name,
//                 profile_pic: userData?.profile_pic ?? "",
//                 uid: userData?._id,
//               },
//               last_message: msg,
//               [userData._id + "_count"]: firestore.FieldValue.increment(1),
//               last_message_time: firestore.Timestamp.now(),
//               type: "text",
//               appointmentID: appointmentID,
//             })
//             .finally(() => {
//               yourRef?.current?.scrollToIndex({
//                 index: 0,
//               });
//             });
//         } else {
//           firestore()
//             .collection("Chats")
//             .doc(getRoomId())
//             .set({
//               user_id: [otherUserId, userData._id],
//               [otherUserId]: {
//                 name: otherUserName,
//                 profile_pic: otherUserProfile ?? "",
//                 uid: otherUserId,
//               },
//               [userData._id]: {
//                 name: userData?.name,
//                 profile_pic: userData?.profile ?? "",
//                 uid: userData?._id,
//               },
//               last_message: msg,
//               [userData._id + "_count"]: firestore.FieldValue.increment(1),
//               last_message_time: firestore.Timestamp.now(),
//               type: "text",
//               appointmentID: appointmentID,
//             })
//             .finally(() => {
//               yourRef?.current?.scrollToIndex({
//                 index: 0,
//               });
//             });
//         }
//       });

//     setmsg("");
//   }

//   useEffect(() => {
//     getOnlineOffline();
//   }, [otherUserId]);

//   const [status, setstatus] = useState("");
//   console.log("status",status);
//   async function getOnlineOffline() {
//     const subscriber = firestore()
//       .collection("users")
//       .doc(otherUserId)
//       .onSnapshot((documentSnapshot) => {
//         const data = documentSnapshot?.data();
//         console.log("data8888",data);
//         // setonlineStatus(documentSnapshot?.data()?.onlineStatus);
//         setstatus(documentSnapshot?.data()?.onlineStatus);
//         //setPage(data.msgPage)
//       });
//   }

//   async function readMessage() {
//     let result = await firestore()
//       .collection("Chats")
//       .doc(getRoomId())
//       .collection("message")
//       .where("user_id", "!=", userData?._id)
//       .where("read", "==", false)
//       .get();
//     let documents = result.docs.map((i) => i.id);

//     for (let index = 0; index < documents?.length; index++) {
//       const element = documents[index];
//       firestore()
//         .collection("Chats")
//         .doc(getRoomId())
//         .collection("message")
//         .doc(element)
//         .update({
//           read: true,
//           // updatedat: firestore.Timestamp.now(),
//         });
//     }
//   }

//   useEffect(() => {
//     readMessage();
//   }, [Messages]);

//   useEffect(() => {
//     getMessage();
//     return () => global.listner();
//   }, []);

//   function getMessage(params) {
//     global.listner = firestore()
//       .collection("Chats")
//       .doc(getRoomId())
//       .collection("message")
//       .onSnapshot((chatdata) => {
//         messagesRef.current.length > 0 &&
//           chatdata.docChanges().forEach(async (change) => {
//             const doc = change.doc;

//             if (change.type === "added") {
//               // Handle added document
//               const addedDoc = doc.data();
//               setMessages(
//                 [addedDoc, ...messagesRef.current].sort(function (a, b) {
//                   return b.id - a.id;
//                 })
//               );
//               console.log("Added document:", addedDoc);
//             } else if (change.type === "modified") {
//               // Handle modified document
//               const modifiedDoc = doc.data();
//               console.log(modifiedDoc);
//               if (modifiedDoc.type == "image") {
//                 if (modifiedDoc.url?.length > 0) {
//                   await FastImage.preload([{ uri: modifiedDoc.url }]);
//                 }
//                 //
//               }
//               let oldArray = [...messagesRef.current];
//               let index = oldArray.findIndex((i) => i.id == modifiedDoc?.id);
//               oldArray[index] = modifiedDoc;
//               setMessages(
//                 oldArray.sort(function (a, b) {
//                   return b.id - a.id;
//                 })
//               );
//               console.log("Modified document:", modifiedDoc);
//             }
//             //  else if (change.type === "removed") {
//             //   // Handle removed document
//             //   const removedDoc = doc.data();
//             //   console.log("Removed document:", removedDoc);
//             // }
//           });
//         if (messagesRef.current.length == 0) {
//           let arr = [];
//           chatdata?.docs?.forEach((element) => {
//             arr.push(element.data());
//           });
//           let newArr = arr.sort(function (a, b) {
//             return b.id - a.id;
//           });

//           setMessages(newArr);
//         }
//       });
//   }

//   function UploadImage(image) {
//     try {
//       let x = image;
//       console.log(image);

//       setlocalimg(x.path);
//       // setuploadImage(x)
//       firestore()
//         .collection("Chats")
//         .doc(getRoomId())
//         .collection("message")
//         .add({
//           user_id: userData?._id,
//           profilePic: userData?.profile_pic ?? "",
//           message: "",
//           id: Messages.length.toString(),
//           type: "image",
//           url: "",
//           createdAt: firestore.Timestamp.now(),
//           read: false,
//         })
//         .then(async (i) => {
//           console.log(i?._documentPath?._parts[3]);
//           uploadImageToFirebase(x, i?._documentPath?._parts[3]);
//         });
//       // setpickerVisible(false);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async function sendImage({ url, type, filename, docpath }) {
//     try {
//       firestore()
//         .collection("Chats")
//         .doc(getRoomId())
//         .collection("message")
//         .doc(docpath)
//         .update({
//           url: url,
//         })
//         .then(async () => {
//           let x = await firestore().collection("Chats").doc(getRoomId()).get();
//           setlocalimg("https://pixy.org/src/5/thumbs350/55685.jpg");
//           if (x._exists) {
//             firestore()
//               .collection("Chats")
//               .doc(getRoomId())
//               .update({
//                 user_id: [otherUserId, userData._id],
//                 [otherUserId]: {
//                   name: otherUserName,
//                   profile_pic: otherUserProfile ?? "",
//                   uid: otherUserId,
//                 },
//                 [userData._id]: {
//                   name: userData?.name,
//                   profile_pic: userData?.profile_pic ?? "",
//                   uid: userData?._id,
//                 },
//                 last_message: msg,
//                 [userData._id + "_count"]: firestore.FieldValue.increment(1),
//                 last_message_time: firestore.Timestamp.now(),
//                 type: "image",
//                 appointmentID: appointmentID,
//               });
//           } else {
//             firestore()
//               .collection("Chats")
//               .doc(getRoomId())
//               .set({
//                 user_id: [otherUserId, userData._id],
//                 [otherUserId]: {
//                   name: otherUserName,
//                   profile_pic: otherUserProfile ?? "",
//                   uid: otherUserId,
//                 },
//                 [userData._id]: {
//                   name: userData?.name,
//                   profile_pic: userData?.profile_pic ?? "",
//                   uid: userData?._id,
//                 },
//                 last_message: msg,
//                 [userData._id + "_count"]: firestore.FieldValue.increment(1),
//                 last_message_time: firestore.Timestamp.now(),
//                 type: "iamge",
//                 appointmentID: appointmentID,
//               });
//           }
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const uploadImageToFirebase = async (image, docpath) => {
//     try {
//       // setloading(true);
//       if (image) {
//         let filename = image.path.split("/").pop();
//         const uploadUri = image.path;
//         await storage().ref(filename).putFile(uploadUri);
//         const url = await storage().ref(filename).getDownloadURL();
//         console.log(url, ":::::::::");
//         //   let type = filename.split('.').pop()
//         // let types = ["WEBM", "MPG, MP2, MPEG, MPE, MPV", "OGG", "MP4, M4P, M4V", "AVI, WMV", "MOV, QT", "FLV, SWF"]
//         let messageType = "image";
//         //await FastImage.preload([{ uri: url }]);
//         sendImage({ url: url, type: messageType, filename: "", docpath });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//     // setloading(false);
//   };
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ChatHeader
//         oncallPress={() => {
//           setcallView(true);
//         }}
//         onPressVideo={() => {
//           navigation.navigate(AppRoutes.Video, { from: "profile" });
//         }}
//         backPress={() => {
//           navigation.navigate(AppRoutes.Home);
//         }}
//         profile={otherUserProfile ?? ""}
//         name={otherUserName}
//         status={status ? status : "Online"}
//       ></ChatHeader>
//       <KeyboardAvoidingView
//         keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 30}
//         behavior={Platform.OS == "ios" ? "padding" : "null"}
//         style={{ flex: 1 }}
//       >
//         <FlatList
//           style={{
//             marginBottom: "22%",
//             width: widthPercentageToDP(100),
//             height: "100%",
//           }}
//           ref={yourRef}
//           keyExtractor={(i, index) => index?.toString()}
//           data={Messages}
//           // onContentSizeChange={() => yourRef.current.scrollToEnd()}
//           // onLayout={() => yourRef.current.scrollToEnd()}
//           // data={[
//           //   {
//           //     message: "Lorem ipsum dolor sit amet.",
//           //     user_id: "12",
//           //     type: "text",
//           //     createdAt: {
//           //       seconds: "1689669327",
//           //     },
//           //   },
//           //   {
//           //     message:
//           //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
//           //     user_id: "123",
//           //     type: "text",
//           //     createdAt: {
//           //       seconds: "1689669327",
//           //     },
//           //   },
//           //   {
//           //     message:
//           //       "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor.",
//           //     user_id: "12",
//           //     type: "text",
//           //     createdAt: {
//           //       seconds: "1689669327",
//           //     },
//           //   },
//           //   {
//           //     message:
//           //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
//           //     user_id: "123",
//           //     type: "text",
//           //     createdAt: {
//           //       seconds: "1689669327",
//           //     },
//           //   },
//           // ]}
//           inverted
//           renderItem={({ item, index }) => {
//             return (
//               <ChatMessage
//                 defaultPic={defaultProfile}
//                 user_id={otherUserId}
//                 item={item}
//                 localimg={localimg}
//               />
//             );
//           }}
//         />

//         <View style={{ justifyContent: "flex-end", flex: 1 }}>
//           <View
//             style={{
//               // marginBottom: Platform.OS == 'android' ? 10 : 20,
//               flexDirection: "row",
//               width: "100%",
//               //  backgroundColor:"red",
//               height: 80,
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 height: "100%",
//                 backgroundColor: "white",
//                 //borderRadius: 50,
//                 alignItems: "center",
//                 // backgroundColor:"red",
//                 shadowRadius: 2,
//                 shadowColor: "#000",
//                 top: 10,
//                 shadowOffset: {
//                   width: 0,
//                   height: -5,
//                 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 2.0,

//                 elevation: 6,
//               }}
//             >
//               <TextInput
//                 // maxFontSizeMultiplier={2}
//                 blurOnSubmit
//                 value={msg}
//                 onChangeText={(value) => {
//                   setmsg(value);
//                 }}
//                 style={[
//                   {
//                     marginLeft: 20,
//                     fontSize: 14,
//                     top: -5,
//                     color: colors.text,
//                     width: "60%",
//                     fontFamily: AppFonts.Medium,
//                   },
//                 ]}
//                 placeholder={localization?.appkeys?.SendMessage}
//                 placeholderTextColor={colors.color_both_Side}
//               />
//               <TouchableOpacity
//                 style={{
//                   width: heightPercentageToDP(5.5),
//                   height: heightPercentageToDP(5.5),
//                   backgroundColor: "rgba(46, 221, 204, .2)",
//                   // marginRight: 5,
//                   right: -5,
//                   borderWidth: 0.5,
//                   borderColor: "#e4e6eb",
//                   borderRadius: 100,
//                   alignItems: "center",
//                   justifyContent: "center",
//                   shadowColor: "#000",
//                   marginBottom: 10,
//                   // shadowOffset: {
//                   //   width: 0,
//                   //   height: 2,
//                   // },
//                   // shadowOpacity: 0.25,
//                   // shadowRadius: 3.84,

//                   // elevation: 5,
//                 }}
//                 onPress={() => {
//                   setshowPicker(true);
//                 }}
//               >
//                 <FastImage
//                   resizeMode="contain"
//                   tintColor={"#2EDDCC"}
//                   source={images.media}
//                   style={{
//                     width: heightPercentageToDP(3),
//                     height: heightPercentageToDP(3),

//                     //  marginTop: heightPercentageToDP(0.5),
//                     resizeMode: "contain",
//                   }}
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{
//                   width: heightPercentageToDP(5.5),
//                   height: heightPercentageToDP(5.5),
//                   backgroundColor: "#2EDDCC",
//                   marginRight: 15,
//                   borderRadius: 100,
//                   alignItems: "center",
//                   justifyContent: "center",
//                   shadowColor: "#000",
//                   shadowOffset: {
//                     width: 0,
//                     height: 2,
//                   },
//                   shadowOpacity: 0.25,
//                   shadowRadius: 3.84,
//                   marginBottom: 10,
//                   elevation: 5,
//                 }}
//                 onPress={() => {
//                   if (msg.length == 0) {
//                     //Toast.show("please enter message")
//                   } else {
//                     sendMessage();
//                   }
//                 }}
//               >
//                 <FastImage
//                   resizeMode="contain"
//                   tintColor={"white"}
//                   source={images.send}
//                   style={{
//                     width: heightPercentageToDP(3),
//                     height: heightPercentageToDP(3),

//                     //  marginTop: heightPercentageToDP(0.5),
//                     resizeMode: "contain",
//                   }}
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
//           {/* <CameraModal /> */}
//         </View>
//       </KeyboardAvoidingView>
//       {callView && (
//         <CallComp
//           visible={callView}
//           onEndPress={() => {
//             user.type == "user"
//               ? navigation.navigate(AppRoutes.Feedback)
//               : setcallView(false);

//             // setcallView(false)
//           }}
//         ></CallComp>
//       )}
//       {showPicker && (
//         <CustomImagePickerModal
//           visible={showPicker}
//           pressHandler={() => {
//             setshowPicker(false);
//           }}
//           attachments={(data) => {
//             UploadImage(data);
//             setshowPicker(false);
//             //setImg(data)
//           }}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   mainView: {
//     width: "100%",
//     height: 80,
//     borderBottomWidth: 1,
//     flexDirection: "row",
//     padding: 8,
//     justifyContent: "space-between",
//   },
//   styleText: {
//     fontSize: 14,
//     color: "#000000",
//     lineHeight: 24,
//   },
//   imageView: {
//     height: hp(3),
//     width: wp(3),
//   },
// });
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { hp, wp } from "../../utils/dimension";
import { LocalizationContext } from "../../localization/localization";
import { useTheme } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import ChatHeader from "../components/ChatHeader";
import { FlatList } from "react-native-gesture-handler";
import ChatMessage from "../components/ChatMessage";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AppFonts from "../../constants/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import CallComp from "../components/CallComp";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import { useDispatch, useSelector } from "react-redux";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import ImageCropPicker from "react-native-image-crop-picker";
import CustomImagePickerModal from "../modals/CustomImagePickerModal";
import { setIsChatScreenOpened } from "../../redux/Reducers/UserNewData";

const ChatScreen = ({ navigation, route }) => {
  const { otherUserId, otherUserName, otherUserProfile, appointmentID } =
    route?.params;
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext);
  const [loading, setLoading] = useState(false);
  const loader = useSelector((state) => state.userNewData.loader);

  const { colors, images } = useTheme();
  const [callView, setcallView] = useState(false);
  const [showPicker, setshowPicker] = useState(false);
  const yourRef = useRef(null);
  const [msg, setmsg] = useState("");
  const user = useSelector((state) => state.userData.user);
  const userData = useSelector((state) => state.userData.userData);
  const [Messages, setMessage] = useState([]);
  const messagesRef = useRef([]);

  const setMessages = (newMessages) => {
    setMessage(newMessages);
    messagesRef.current = newMessages;
  };

  useEffect(() => {
    dispatch(setIsChatScreenOpened(true));
    return () => {
      dispatch(setIsChatScreenOpened(false));
    };
  }, []);

  const defaultProfile =
    "https://cdn.landesa.org/wp-content/uploads/default-user-image.png";
  const [localimg, setlocalimg] = useState(
    "https://pixy.org/src/5/thumbs350/55685.jpg"
  );
  function getRoomId(params) {
    let user_id = userData?._id;
    let otheruserId = otherUserId;
    let x = [user_id, otheruserId, appointmentID].sort();
    let k = x.join("_");

    return k;
  }

  async function sendMessage(params) {
    firestore()
      .collection("Chats")
      .doc(getRoomId())
      .collection("message")
      .add({
        user_id: userData?._id,
        profilePic: userData?.profile_pic ?? "",
        message: msg,
        id: Messages.length.toString(),
        type: "text",
        createdAt: firestore.Timestamp.now(),
        read: false,
      })
      .then(async () => {
        let x = await firestore().collection("Chats").doc(getRoomId()).get();

        if (x._exists) {
          firestore()
            .collection("Chats")
            .doc(getRoomId())
            .update({
              user_id: [otherUserId, userData._id],
              [otherUserId]: {
                name: otherUserName,
                profile_pic: otherUserProfile ?? "",
                uid: otherUserId,
              },
              [userData._id]: {
                name: userData?.name,
                profile_pic: userData?.profile_pic ?? "",
                uid: userData?._id,
              },
              last_message: msg,
              [userData._id + "_count"]: firestore.FieldValue.increment(1),
              last_message_time: firestore.Timestamp.now(),
              type: "text",
              appointmentID: appointmentID,
            })
            .finally(() => {
              yourRef?.current?.scrollToIndex({
                index: 0,
              });
            });
        } else {
          firestore()
            .collection("Chats")
            .doc(getRoomId())
            .set({
              user_id: [otherUserId, userData._id],
              [otherUserId]: {
                name: otherUserName,
                profile_pic: otherUserProfile ?? "",
                uid: otherUserId,
              },
              [userData._id]: {
                name: userData?.name,
                profile_pic: userData?.profile ?? "",
                uid: userData?._id,
              },
              last_message: msg,
              [userData._id + "_count"]: firestore.FieldValue.increment(1),
              last_message_time: firestore.Timestamp.now(),
              type: "text",
              appointmentID: appointmentID,
            })
            .finally(() => {
              yourRef?.current?.scrollToIndex({
                index: 0,
              });
            });
        }
        send_notification();
      });

    setmsg("");
  }

  useEffect(() => {
    getOnlineOffline();
  }, [otherUserId]);

  async function send_notification() {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "key=AAAAvZ1cams:APA91bFYI70txzsWpCBY6t6-i4U-DgiUSXYnvE7HmLdxj2z9LVNTvlair4mDV_lxUDbdke6peFjX2ui9hDYqLQJJtwavceSpES1hD-Nn0BCereBUxPJgYRVfjOM44Vshl-EJMnLN4UFR"
    );
    myHeaders.append("Content-Type", "application/json");
    let data = {
      profile_pic: userData?.profile_pic,
      full_name: userData?.name,
      _id: userData._id,
      send_by: "user",
      appointmentID: appointmentID,
    };

    var raw = null;

    raw = JSON.stringify({
      to: "/topics/" + otherUserId,
      notification: {
        body: msg,
        title: userData?.name + " " + "sent a message",
        sound: "customSound.wav",
      },
      data: {
        channelId: "channel-id",
        type: "single",
        data: JSON.stringify(data),
      },
      priority: 10,
      soundName: "customSound.wav",
      sound: "customSound.wav",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result, "notification result"))
      .catch((error) => console.log("error", error));
  }

  const [status, setstatus] = useState("");
  async function getOnlineOffline() {
    const subscriber = firestore()
      .collection("users")
      .doc(otherUserId)
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot?.data();
        // setonlineStatus(documentSnapshot?.data()?.onlineStatus);
        setstatus(documentSnapshot?.data()?.onlineStatus);
        //setPage(data.msgPage)
      });
  }

  async function readMessage() {
    let result = await firestore()
      .collection("Chats")
      .doc(getRoomId())
      .collection("message")
      .where("user_id", "!=", userData?._id)
      .where("read", "==", false)
      .get();
    let documents = result.docs.map((i) => i.id);

    for (let index = 0; index < documents?.length; index++) {
      const element = documents[index];
      firestore()
        .collection("Chats")
        .doc(getRoomId())
        .collection("message")
        .doc(element)
        .update({
          read: true,
          // updatedat: firestore.Timestamp.now(),
        });
    }
  }

  useEffect(() => {
    readMessage();
  }, [Messages]);

  useEffect(() => {
    getMessage();
    return () => global.listner();
  }, []);

  function getMessage(params) {
    global.listner = firestore()
      .collection("Chats")
      .doc(getRoomId())
      .collection("message")
      .onSnapshot((chatdata) => {
        messagesRef.current.length > 0 &&
          chatdata.docChanges().forEach(async (change) => {
            const doc = change.doc;

            if (change.type === "added") {
              // Handle added document
              const addedDoc = doc.data();
              setMessages(
                [addedDoc, ...messagesRef.current].sort(function (a, b) {
                  return b.id - a.id;
                })
              );
            } else if (change.type === "modified") {
              const modifiedDoc = doc.data();
              if (modifiedDoc.type == "image") {
                if (modifiedDoc.url?.length > 0) {
                  await FastImage.preload([{ uri: modifiedDoc.url }]);
                }
                //
              }
              let oldArray = [...messagesRef.current];
              let index = oldArray.findIndex((i) => i.id == modifiedDoc?.id);
              oldArray[index] = modifiedDoc;
              setMessages(
                oldArray.sort(function (a, b) {
                  return b.id - a.id;
                })
              );
            }
          });
        if (messagesRef.current.length == 0) {
          let arr = [];
          chatdata?.docs?.forEach((element) => {
            arr.push(element.data());
          });
          let newArr = arr.sort(function (a, b) {
            return b.id - a.id;
          });

          setMessages(newArr);
        }
      });
  }

  function UploadImage(image) {
    try {
      let x = image;
      setlocalimg(x.path);
      firestore()
        .collection("Chats")
        .doc(getRoomId())
        .collection("message")
        .add({
          user_id: userData?._id,
          profilePic: userData?.profile_pic ?? "",
          message: "",
          id: Messages.length.toString(),
          type: "image",
          url: "",
          createdAt: firestore.Timestamp.now(),
          read: false,
        })
        .then(async (i) => {
          uploadImageToFirebase(x, i?._documentPath?._parts[3]);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function sendImage({ url, type, filename, docpath }) {
    try {
      firestore()
        .collection("Chats")
        .doc(getRoomId())
        .collection("message")
        .doc(docpath)
        .update({
          url: url,
        })
        .then(async () => {
          let x = await firestore().collection("Chats").doc(getRoomId()).get();
          setlocalimg("https://pixy.org/src/5/thumbs350/55685.jpg");
          if (x._exists) {
            firestore()
              .collection("Chats")
              .doc(getRoomId())
              .update({
                user_id: [otherUserId, userData._id],
                [otherUserId]: {
                  name: otherUserName,
                  profile_pic: otherUserProfile ?? "",
                  uid: otherUserId,
                },
                [userData._id]: {
                  name: userData?.name,
                  profile_pic: userData?.profile_pic ?? "",
                  uid: userData?._id,
                },
                last_message: msg,
                [userData._id + "_count"]: firestore.FieldValue.increment(1),
                last_message_time: firestore.Timestamp.now(),
                type: "image",
                appointmentID: appointmentID,
              });
          } else {
            firestore()
              .collection("Chats")
              .doc(getRoomId())
              .set({
                user_id: [otherUserId, userData._id],
                [otherUserId]: {
                  name: otherUserName,
                  profile_pic: otherUserProfile ?? "",
                  uid: otherUserId,
                },
                [userData._id]: {
                  name: userData?.name,
                  profile_pic: userData?.profile_pic ?? "",
                  uid: userData?._id,
                },
                last_message: msg,
                [userData._id + "_count"]: firestore.FieldValue.increment(1),
                last_message_time: firestore.Timestamp.now(),
                type: "iamge",
                appointmentID: appointmentID,
              });
          }
          send_notification();
        });
    } catch (error) {
      console.log(error);
    }
  }

  const uploadImageToFirebase = async (image, docpath) => {
    try {
      if (image) {
        let filename = image.path.split("/").pop();
        const uploadUri = image.path;
        await storage().ref(filename).putFile(uploadUri);
        const url = await storage().ref(filename).getDownloadURL();
        let messageType = "image";
        sendImage({ url: url, type: messageType, filename: "", docpath });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatHeader
        oncallPress={() => {
          setcallView(true);
        }}
        onPressVideo={() => {
          navigation.navigate(AppRoutes.Video, { from: "profile" });
        }}
        backPress={() => {
          navigation.navigate(AppRoutes.Home);
        }}
        profile={otherUserProfile ?? ""}
        name={otherUserName}
        status={status ? status : "Online"}
      ></ChatHeader>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 30}
        behavior={Platform.OS == "ios" ? "padding" : "null"}
        style={{ flex: 1 }}
      >
        <FlatList
          style={{
            marginBottom: "22%",
            width: widthPercentageToDP(100),
            height: "100%",
          }}
          ref={yourRef}
          keyExtractor={(i, index) => index?.toString()}
          data={Messages}
          // onContentSizeChange={() => yourRef.current.scrollToEnd()}
          // onLayout={() => yourRef.current.scrollToEnd()}
          // data={[
          //   {
          //     message: "Lorem ipsum dolor sit amet.",
          //     user_id: "12",
          //     type: "text",
          //     createdAt: {
          //       seconds: "1689669327",
          //     },
          //   },
          //   {
          //     message:
          //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
          //     user_id: "123",
          //     type: "text",
          //     createdAt: {
          //       seconds: "1689669327",
          //     },
          //   },
          //   {
          //     message:
          //       "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor.",
          //     user_id: "12",
          //     type: "text",
          //     createdAt: {
          //       seconds: "1689669327",
          //     },
          //   },
          //   {
          //     message:
          //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
          //     user_id: "123",
          //     type: "text",
          //     createdAt: {
          //       seconds: "1689669327",
          //     },
          //   },
          // ]}
          inverted
          renderItem={({ item, index }) => {
            return (
              <ChatMessage
                defaultPic={defaultProfile}
                user_id={otherUserId}
                item={item}
                localimg={localimg}
              />
            );
          }}
        />

        <View style={{ justifyContent: "flex-end", flex: 1 }}>
          <View
            style={{
              // marginBottom: Platform.OS == 'android' ? 10 : 20,
              flexDirection: "row",
              width: "100%",
              //  backgroundColor:"red",
              height: 80,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
                backgroundColor: "white",
                //borderRadius: 50,
                alignItems: "center",
                // backgroundColor:"red",
                shadowRadius: 2,
                shadowColor: "#000",
                top: 10,
                shadowOffset: {
                  width: 0,
                  height: -5,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2.0,

                elevation: 6,
              }}
            >
              <TextInput
                // maxFontSizeMultiplier={2}
                blurOnSubmit
                value={msg}
                onChangeText={(value) => {
                  setmsg(value);
                }}
                style={[
                  {
                    marginLeft: 20,
                    fontSize: 14,
                    top: -5,
                    color: colors.text,
                    width: "60%",
                    fontFamily: AppFonts.Medium,
                  },
                ]}
                placeholder={localization?.appkeys?.SendMessage}
                placeholderTextColor={colors.color_both_Side}
              />
              <TouchableOpacity
                style={{
                  width: heightPercentageToDP(5.5),
                  height: heightPercentageToDP(5.5),
                  backgroundColor: "rgba(46, 221, 204, .2)",
                  // marginRight: 5,
                  right: -5,
                  borderWidth: 0.5,
                  borderColor: "#e4e6eb",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  marginBottom: 10,
                  // shadowOffset: {
                  //   width: 0,
                  //   height: 2,
                  // },
                  // shadowOpacity: 0.25,
                  // shadowRadius: 3.84,

                  // elevation: 5,
                }}
                onPress={() => {
                  setshowPicker(true);
                }}
              >
                <FastImage
                  resizeMode="contain"
                  tintColor={"#2EDDCC"}
                  source={images.media}
                  style={{
                    width: heightPercentageToDP(3),
                    height: heightPercentageToDP(3),

                    //  marginTop: heightPercentageToDP(0.5),
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: heightPercentageToDP(5.5),
                  height: heightPercentageToDP(5.5),
                  backgroundColor: "#2EDDCC",
                  marginRight: 15,
                  justifyContent: "center",
                  shadowColor: "#000",
                  // shadowOffset: {
                  //   width: 0,
                  //   height: 2,
                  // },
                  // shadowOpacity: 0.25,
                  // shadowRadius: 3.84,
                  marginBottom: 10,
                  alignItems: "center",
                  borderRadius: 100,
                  // elevation: 5,
                }}
                onPress={() => {
                  if (msg.length == 0) {
                    //Toast.show("please enter message")
                  } else {
                    sendMessage();
                  }
                }}
              >
                <FastImage
                  resizeMode="contain"
                  tintColor={"white"}
                  source={images.send}
                  style={{
                    width: heightPercentageToDP(3),
                    height: heightPercentageToDP(3),

                    //  marginTop: heightPercentageToDP(0.5),
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* {/ <CameraModal /> /} */}
        </View>
      </KeyboardAvoidingView>
      {callView && (
        <CallComp
          visible={callView}
          onEndPress={() => {
            user.type == "user"
              ? navigation.navigate(AppRoutes.Feedback)
              : setcallView(false);

            // setcallView(false)
          }}
        ></CallComp>
      )}
      {showPicker && (
        <CustomImagePickerModal
          visible={showPicker}
          pressHandler={() => {
            setshowPicker(false);
          }}
          attachments={(data) => {
            UploadImage(data);
            setshowPicker(false);
            //setImg(data)
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    height: 80,
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between",
  },
  styleText: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 24,
  },
  imageView: {
    height: hp(3),
    width: wp(3),
  },
});
