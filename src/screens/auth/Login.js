import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import {
  SetinitialRouteName,
  setAuth,
  setUser,
  setlastLoginDetails,
  settoken,
  setuserData,
} from "../../redux/Reducers/userData";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import CustomBtn from "../components/CustomBtn";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import CustomInput from "../components/CustomInput";
import Loader from "../modals/Loader";
import { login, therapist_login } from "../../api/Services/services";
import AppUtils from "../../utils/appUtils";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import auth from "@react-native-firebase/auth";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import * as RNLocalize from "react-native-localize";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { setlastLogin, setloader } from "../../redux/Reducers/UserNewData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function Login({ navigation }) {
  const dispatch = useDispatch();
  let langCode = useSelector((state) => state.userData.languageCode);
  const isVerificationEnabled = useSelector(
    (state) => state.userData.verificationEnabled
  );
  const lastLoginDetails = useSelector(
    (state) => state.userData.lastLoginDetails
  );
  const user = useSelector((state) => state.userData.user);
  const { colors, images } = useTheme();
  const loader = useSelector((state) => state.userNewData.loader);
  const lastLogin = useSelector((state) => state.userNewData.lastLogin);

  const [isUser, setIsUser] = useState(true);
  // console.log("isUser",isUser);
  const [isSecure, setIsSecure] = useState(true);
  const { localization } = useContext(LocalizationContext);
  const [loginType, setloginType] = useState("email");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [fcm_token, setfcm_Token] = useState("");
  const [loginemail, setloginemail] = useState("");
  const [loginpass, setloginpass] = useState("");

  const currentTimeZone = RNLocalize.getTimeZone();
  useEffect(() => {
    if (lastLogin == "user") {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [lastLogin]);

  useEffect(() => {
    console.log(lastLoginDetails, "hkj");
    if (lastLoginDetails?.email) {
      setemail(lastLoginDetails?.email);
      setpassword(lastLoginDetails?.pass);
      setIsUser(lastLoginDetails?.type == "user" ? true : false);
    }
  }, [lastLoginDetails]);

  useEffect(() => {
    getFCMToken();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("email", (err, item) => {
      setloginemail(item);
      AsyncStorage.getItem("pass", (err, item1) => {
        setloginpass(item1);
      });
    });
  }, []);

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  async function userandroidbiomatric() {
    if (loginemail && loginpass) {
      rnBiometrics.isSensorAvailable().then((resultObject) => {
        const { available, biometryType } = resultObject;
        if (available && biometryType === BiometryTypes.Biometrics) {
          rnBiometrics
            .simplePrompt({ promptMessage: "Confirm fingerprint" })
            .then((resultObject) => {
              const { success } = resultObject;
              if (resultObject.success) {
                AsyncStorage.setItem("IsBiometric", "true");
                dispatch(setloader(true));
                login(
                  "email",
                  loginemail,
                  loginpass,
                  langCode,
                  fcm_token,
                  "",
                  "",
                  "",
                  "",
                  ""
                ).then((response) => {
                  if (response?.data?.status == true) {
                    setTimeout(() => {
                      dispatch(setloader(false));
                    }, 500);
                    AppUtils.showToast(response?.data?.message);
                    let a = isUser ? "SelectCategories" : "Home";
                    dispatch(setUser({ type: isUser ? "user" : "therapist" }));
                    dispatch(SetinitialRouteName(a));
                    dispatch(setuserData(response?.data?.data));
                    dispatch(settoken(response?.data?.other?.token));
                    setTimeout(() => {
                      dispatch(setAuth(true));
                      navigation.navigate(AppRoutes.DrawerStack, {
                        screen: AppRoutes.NonAuthStack,
                        params: { screen: AppRoutes.SelectCategories },
                      });
                    }, 500);
                  } else {
                    setTimeout(() => {
                      dispatch(setloader(false));
                    }, 500);
                    AppUtils.showToast(response?.data?.message);
                  }
                });
              }
            })
            .catch(() => {
              console.log("biometrics failed");
            });
          console.log("TouchID is supported");
        } else if (available && biometryType === BiometryTypes.FaceID) {
          console.log("FaceID is supported");
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          console.log("Biometrics is supported");
        } else {
          console.log("Biometrics not supported");
        }
      });
    } else {
      AppUtils.showToast("You have to Login First to use this features");
    }
  }

  const getFCMToken = async () => {
    const token = "";
    setfcm_Token(token);
  };

  const user_login = async () => {
    AsyncStorage.setItem("email", email.trim().toLowerCase());
    AsyncStorage.setItem("pass", password);
    dispatch(setloader(true));
    let res = null;
    console.log("user_login",res);
    res = await login(
      loginType,
      email.trim().toLowerCase(),
      password,
      langCode,
      fcm_token,
      "",
      "",
      "",
      "",
      "",
      currentTimeZone
    );
    if (res?.data?.status) {
      setTimeout(() => {
        // AsyncStorage.setItem("BiometricDetails", {email:email.trim().toLowerCase(),pass:password,type:isUser?"user":"therapist"})
        dispatch(
          setlastLoginDetails({
            email: email.trim().toLowerCase(),
            pass: password,
            type: isUser ? "user" : "therapist",
          })
        );
        dispatch(setloader(false));
      }, 500);
      firestore().collection("users").doc(res?.data?.data?._id).set({
        onlineStatus: "Online",
        id: res?.data?.data?._id,
      });
      AppUtils.showToast(res?.data?.message);
      let a = isUser ? "SelectCategories" : "Home";
      dispatch(setUser({ type: isUser ? "user" : "therapist" }));
      dispatch(SetinitialRouteName(a));
      dispatch(setuserData(res?.data?.data));
      dispatch(settoken(res?.data?.other?.token));
      dispatch(setloader(false));
      setTimeout(() => {
        dispatch(setAuth(true));

        if (isVerificationEnabled) {
          AsyncStorage.setItem("IsBiometric", "true");
          navigation.navigate(AppRoutes.DrawerStack, {
            screen: AppRoutes.NonAuthStack,
            params: { screen: AppRoutes.SelectCategories },
          });
        } else {
          navigation.navigate(AppRoutes.DrawerStack, {
            screen: AppRoutes.NonAuthStack,
            params: { screen: AppRoutes.Bimetric },
          });
        }
      }, 500);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  const handleTherapistLogin = async () => {
    AsyncStorage.setItem("email", email.trim().toLocaleLowerCase());
    AsyncStorage.setItem("pass", password);
    dispatch(setloader(true));
    let res = null;
    res = await therapist_login(
      loginType,
      email.trim().toLowerCase(),
      password,
      langCode,
      fcm_token,
      "",
      "",
      "",
      "",
      "",
      currentTimeZone
    );

    if (res?.data?.status) {
      dispatch(setloader(false));

      firestore().collection("users").doc(res?.data?.data?._id).set({
        onlineStatus: "Online",
        id: res?.data?.data?._id,
      });
      AppUtils.showToast(res?.data?.message);
      let a = isUser ? "SelectCategories" : "Home";
      dispatch(
        setlastLoginDetails({
          email: email.trim().toLowerCase(),
          pass: password,
          type: isUser ? "user" : "therapist",
        })
      );

      dispatch(setUser({ type: isUser ? "user" : "therapist" }));
      dispatch(SetinitialRouteName(a));
      dispatch(setuserData(res?.data?.data));
      dispatch(settoken(res?.data?.other?.token));
      dispatch(setloader(false));
      setTimeout(() => {
        dispatch(setAuth(true));
        if (isVerificationEnabled) {
          AsyncStorage.setItem("IsBiometric", "true");
          navigation.navigate(AppRoutes.DrawerStack, {
            screen: AppRoutes.NonAuthStack,
          });
        } else {
          navigation.navigate(AppRoutes.DrawerStack, {
            screen: AppRoutes.NonAuthStack,
            params: { screen: AppRoutes.Bimetric },
          });
        }
      }, 500);
    } else {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      AppUtils.showToast(res?.data?.message);
    }
  };

  async function onAppleButtonPress() {
    // Start the sign-in request
    // dispatch(setloader(true));
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
        // See: https://github.com/invertase/react-native-apple-authentication#faqs
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error("Apple Sign-In failed - no identify token returned");
      }
      console.log(appleAuthRequestResponse);
      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );

      // Sign the user in with the credential
      console.log(appleCredential);
      let data = await auth().signInWithCredential(appleCredential);
      console.log("signInWithCredentialdata",data);
      // return
      let name = data?.user?.displayName
        ? data?.user?.displayName
        : data?.additionalUserInfo?.profile?.email?.split("@")?.[0];
      if (isUser) {
        login(
          "apple",
          data?.additionalUserInfo?.profile?.email?data.additionalUserInfo.profile.email:'',
          "",
          langCode,
          fcm_token,
          "",
          "",
          data?.user?.uid,
          name,
          "",
          currentTimeZone
        ).then((response) => {
          console.log("loginresponse88888",response);
          if (response?.data?.status == true) {
            AppUtils.showToast(response?.data?.message);
            firestore().collection("users").doc(response?.data?.data?._id).set({
              onlineStatus: "Online",
              id: response?.data?.data?._id,
            });
            let a = isUser ? "SelectCategories" : "Home";
            dispatch(setUser({ type: isUser ? "user" : "therapist" }));
            dispatch(SetinitialRouteName(a));
            dispatch(setuserData(response?.data?.data));
            dispatch(settoken(response?.data?.other?.token));
            dispatch(setloader(false));
            setTimeout(() => {
              dispatch(setAuth(true));
              if (isVerificationEnabled) {
                AsyncStorage.setItem("IsBiometric", "true");
                navigation.navigate(AppRoutes.DrawerStack, {
                  screen: AppRoutes.NonAuthStack,
                  params: { screen: AppRoutes.SelectCategories },
                });
              } else {
                navigation.navigate(AppRoutes.DrawerStack, {
                  screen: AppRoutes.NonAuthStack,
                  params: { screen: AppRoutes.Bimetric },
                });
              }
            }, 500);
          } else {
            setTimeout(() => {
              dispatch(setloader(false));
            }, 500);
            AppUtils.showToast(res?.data?.message);
          }
        });
      } else {
        therapist_login(
          "apple",
          data?.additionalUserInfo?.profile?.email?data.additionalUserInfo.profile.email:'',
          "",
          langCode,
          fcm_token,
          "",
          data?.user?.uid,
          "",
          name,
          "",
          currentTimeZone
        ).then((response) => {
          if (response?.data?.status == true) {
            setTimeout(() => {
              dispatch(setloader(false));
            }, 500);
            firestore().collection("users").doc(response?.data?.data?._id).set({
              onlineStatus: "Online",
              id: response?.data?.data?._id,
            });
            AppUtils.showToast(response?.data?.message);
            let a = isUser ? "SelectCategories" : "Home";
            dispatch(setUser({ type: isUser ? "user" : "therapist" }));
            dispatch(SetinitialRouteName(a));
            dispatch(setuserData(response?.data?.data));
            dispatch(settoken(response?.data?.other?.token));
            dispatch(setloader(false));
            setTimeout(() => {
              dispatch(setAuth(true));
              if (isVerificationEnabled) {
                AsyncStorage.setItem("IsBiometric", "true");
                navigation.navigate(AppRoutes.DrawerStack, {
                  screen: AppRoutes.NonAuthStack,
                });
              } else {
                navigation.navigate(AppRoutes.DrawerStack, {
                  screen: AppRoutes.NonAuthStack,
                  params: { screen: AppRoutes.Bimetric },
                });
              }
            }, 500);
          } else {
            setTimeout(() => {
              dispatch(setloader(false));
            }, 500);
            AppUtils.showToast(response?.data?.message);
          }
        });
      }
    } catch (error) {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      console.log("signinerrror", error);
    }

    console.log(data);
  }

  const validateEmail = (mail) => {
    return String(mail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  async function userFacebookButtonPress() {
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (result.isCancelled) {
      dispatch(setloader(false));
      throw "User cancelled the login process";
    }
    const data = await AccessToken.getCurrentAccessToken();
    console.log("data", data);
    if (!data) {
      throw "Something went wrong obtaining access token";
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );
    dispatch(setloader(true));
    let userFacebookData = await auth().signInWithCredential(
      facebookCredential
    );
    const fbProfileData = userFacebookData?.additionalUserInfo?.profile;
    login(
      "facebook",
      fbProfileData?.email,
      "",
      langCode,
      fcm_token,
      "",
      facebookCredential?.token,
      "",
      fbProfileData?.first_name,
      fbProfileData?.picture?.data?.url,
      currentTimeZone
    ).then((response) => {
      if (response?.data?.status) {
        dispatch(setloader(false));

        firestore().collection("users").doc(response?.data?.data?._id).set({
          onlineStatus: "Online",
          id: response?.data?.data?._id,
        });
        AppUtils.showToast(response?.data?.message);
        let a = isUser ? "SelectCategories" : "Home";
        dispatch(setUser({ type: isUser ? "user" : "therapist" }));
        dispatch(SetinitialRouteName(a));
        dispatch(setuserData(response?.data?.data));
        dispatch(settoken(response?.data?.other?.token));
        dispatch(setloader(false));
        if (isVerificationEnabled) {
          AsyncStorage.setItem("IsBiometric", "true");
          navigation.navigate(AppRoutes.DrawerStack, {
            screen: AppRoutes.NonAuthStack,
            params: { screen: AppRoutes.SelectCategories },
          });
        } else {
          navigation.navigate(AppRoutes.DrawerStack, {
            screen: AppRoutes.NonAuthStack,
            params: { screen: AppRoutes.Bimetric },
          });
        }
        setTimeout(() => {
          dispatch(setAuth(true));
          //                   navigation.navigate(AppRoutes.DrawerStack , { screen: AppRoutes.NonAuthStack,params:{screen:AppRoutes.SelectCategories} })
        }, 500);
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(response?.data?.message);
      }
    });
  }

  async function therapistFacebookButtonPress() {
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (result.isCancelled) {
      throw "User cancelled the login process";
      dispatch(setloader(false));
    }
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Something went wrong obtaining access token";
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );
    let userFacebookData = await auth().signInWithCredential(
      facebookCredential
    );
    const fbProfileData = userFacebookData?.additionalUserInfo?.profile;
    dispatch(setloader(true));
    therapist_login(
      "facebook",
      fbProfileData?.email,
      "",
      langCode,
      fcm_token,
      "",
      "",
      facebookCredential?.token,
      fbProfileData?.first_name,
      fbProfileData?.picture?.data?.url,
      currentTimeZone
    ).then((response) => {
      if (response?.data?.status) {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        firestore().collection("users").doc(response?.data?.data?._id).set({
          onlineStatus: "Online",
          id: response?.data?.data?._id,
        });
        AppUtils.showToast(response?.data?.message);
        let a = isUser ? "SelectCategories" : "Home";
        dispatch(setUser({ type: isUser ? "user" : "therapist" }));
        dispatch(SetinitialRouteName(a));
        dispatch(setuserData(response?.data?.data));
        dispatch(settoken(response?.data?.other?.token));
        dispatch(setloader(false));
        setTimeout(() => {
          dispatch(setAuth(true));
          if (isVerificationEnabled) {
            AsyncStorage.setItem("IsBiometric", "true");
            navigation.navigate(AppRoutes.DrawerStack, {
              screen: AppRoutes.NonAuthStack,
            });
          } else {
            navigation.navigate(AppRoutes.DrawerStack, {
              screen: AppRoutes.NonAuthStack,
              params: { screen: AppRoutes.Bimetric },
            });
          }
        }, 500);
      } else {
        setTimeout(() => {
          dispatch(setloader(false));
        }, 500);
        AppUtils.showToast(response?.data?.message);
      }
    });
  }

  async function userGoogleButtonPress() {
    try {
      dispatch(setloader(true));
      GoogleSignin.configure({
        webClientId:
          "814388898411-ci2ppcjlls774hrddivvbrv2q37ga8d6.apps.googleusercontent.com",
      });

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { idToken } = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const res = await auth().signInWithCredential(googleCredential);

      let googleProfile = res?.additionalUserInfo?.profile ?? "";
      console.log(currentTimeZone, "currentTimeZone");
      login(
        "google",
        googleProfile?.email,
        "",
        langCode,
        fcm_token,
        idToken,
        "",
        "",
        googleProfile?.name,
        googleProfile?.picture,
        currentTimeZone
      ).then((response) => {
        if (response?.data?.status == true) {
          console.log("response7777", response?.data);
          AppUtils.showToast(response?.data?.message);
          firestore().collection("users").doc(response?.data?.data?._id).set({
            onlineStatus: "Online",
            id: response?.data?.data?._id,
          });
          let a = isUser ? "SelectCategories" : "Home";
          dispatch(setUser({ type: isUser ? "user" : "therapist" }));
          dispatch(SetinitialRouteName(a));
          dispatch(setuserData(response?.data?.data));
          dispatch(settoken(response?.data?.other?.token));
          dispatch(setloader(false));
          setTimeout(() => {
            dispatch(setAuth(true));

            if (isVerificationEnabled) {
              AsyncStorage.setItem("IsBiometric", "true");
              navigation.navigate(AppRoutes.DrawerStack, {
                screen: AppRoutes.NonAuthStack,
                params: { screen: AppRoutes.SelectCategories },
              });
            } else {
              navigation.navigate(AppRoutes.DrawerStack, {
                screen: AppRoutes.NonAuthStack,
                params: { screen: AppRoutes.Bimetric },
              });
            }
          }, 500);
        } else {
          setTimeout(() => {
            dispatch(setloader(false));
          }, 500);
          AppUtils.showToast(res?.data?.message);
        }
      });
    } catch (error) {
      dispatch(setloader(false));

      console.log("signinerrror", error);
    }
  }

  async function therapistGoogleButtonPress() {
    try {
      dispatch(setloader(true));
      GoogleSignin.configure({
        webClientId:
          "814388898411-ci2ppcjlls774hrddivvbrv2q37ga8d6.apps.googleusercontent.com",
      });
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res = await auth().signInWithCredential(googleCredential);
      let googleProfile = res?.additionalUserInfo?.profile ?? "";
      therapist_login(
        "google",
        googleProfile?.email,
        "",
        langCode,
        fcm_token,
        idToken,
        "",
        "",
        googleProfile?.name,
        googleProfile?.picture,
        currentTimeZone
      ).then((response) => {
        if (response?.data?.status == true) {
          setTimeout(() => {
            dispatch(setloader(false));
          }, 500);
          firestore().collection("users").doc(response?.data?.data?._id).set({
            onlineStatus: "Online",
            id: response?.data?.data?._id,
          });
          AppUtils.showToast(response?.data?.message);
          let a = isUser ? "SelectCategories" : "Home";
          dispatch(setUser({ type: isUser ? "user" : "therapist" }));
          dispatch(SetinitialRouteName(a));
          dispatch(setuserData(response?.data?.data));
          dispatch(settoken(response?.data?.other?.token));
          dispatch(setloader(false));
          setTimeout(() => {
            dispatch(setAuth(true));
            if (isVerificationEnabled) {
              AsyncStorage.setItem("IsBiometric", "true");
              navigation.navigate(AppRoutes.DrawerStack, {
                screen: AppRoutes.NonAuthStack,
              });
            } else {
              navigation.navigate(AppRoutes.DrawerStack, {
                screen: AppRoutes.NonAuthStack,
                params: { screen: AppRoutes.Bimetric },
              });
            }
          }, 500);
        } else {
          setTimeout(() => {
            dispatch(setloader(false));
          }, 500);
          AppUtils.showToast(response?.data?.message);
        }
      });
    } catch (error) {
      setTimeout(() => {
        dispatch(setloader(false));
      }, 500);
      console.log("signinerrror", error);
    }
  }
  return (
    <KeyboardAwareScrollView
      bounces={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <SolidView
        view={
          <>
            {loader && <Loader />}
            <View style={style.mainView}>
              <Image source={images.darkLogo} style={style.img} />
              <Text
                style={[
                  style.titleText,
                  {
                    color: colors.text,
                    fontFamily: AppFonts.SemiBold,
                    marginTop: 20,
                  },
                ]}
              >
                {localization.appkeys.welcome}
              </Text>
              <Text
                style={[
                  style.titleText,
                  {
                    color: colors.text,
                    fontSize: 16,
                    fontFamily: AppFonts.Medium,
                    marginHorizontal: 40,
                  },
                ]}
              >
                {localization.appkeys.pleaseLogin}
              </Text>

              <View
                style={[style.tabView, { borderColor: colors.tabbordercolor }]}
              >
                <Pressable
                  onPress={() => {
                    setIsUser(true);
                    dispatch(setlastLogin("user"));
                    if (lastLoginDetails?.type == "user") {
                      setemail(lastLoginDetails?.email);
                      setpassword(lastLoginDetails?.pass);
                    } else {
                      setemail("");
                      setpassword("");
                    }
                  }}
                  style={[
                    style.viewHighlight,
                    {
                      backgroundColor: isUser
                        ? colors.locationdiscription
                        : "rgba(38,51,59,0.2)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      style.textHighlight,
                      { color: isUser ? "white" : colors.locationdiscription },
                    ]}
                  >
                    {localization.appkeys.user}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsUser(false);
                    dispatch(setlastLogin("therapist"));
                    if (lastLoginDetails?.type == "therapist") {
                      setemail(lastLoginDetails?.email);
                      setpassword(lastLoginDetails?.pass);
                    } else {
                      setemail("");
                      setpassword("");
                    }
                  }}
                  style={[
                    style.viewHighlight,
                    {
                      backgroundColor: isUser
                        ? "rgba(38,51,59,0.2)"
                        : colors.locationdiscription,
                    },
                  ]}
                >
                  <Text
                    style={[
                      style.textHighlight,
                      { color: isUser ? colors.locationdiscription : "white" },
                    ]}
                  >
                    {localization.appkeys.therapist}
                  </Text>
                </Pressable>
              </View>
              <CustomInput
                title={localization.appkeys.email}
                rightImg={images.mail}
                value={email}
                onChangeText={setemail}
              />
              <CustomInput
                value={password}
                onChangeText={setpassword}
                title={localization.appkeys.password}
                rightImg={isSecure ? images.eyeoff : images.eye}
                isSecure={isSecure}
                onEyePress={() => {
                  setIsSecure(!isSecure);
                }}
              />
              <Text
                onPress={() =>
                  navigation.navigate(AppRoutes.ForgotPwd, {
                    from: "login",
                    type: isUser ?? true,
                  })
                }
                style={[style.forgot_pwdTxt, { color: colors.text }]}
              >
                {localization.appkeys.forgot_pwd}?
              </Text>
              <CustomBtn
                onPress={() => {
                  // navigation.navigate(AppRoutes?.ResetPwd,{ from:"login", _id: "res?.data?.data?._id", type:"user" })
                  // return
                  if (email) {
                    if (validateEmail(email.trim().toLowerCase())) {
                      if (password) {
                        // Alert.alert(JSON.stringify(isUser))
                        isUser ? user_login() : handleTherapistLogin();
                      } else {
                        AppUtils.showToast("Please enter password!!");
                      }
                    } else {
                      AppUtils.showToast("Enter Valid Email!!");
                    }
                  } else {
                    AppUtils.showToast("Please Enter your Email");
                  }
                }}
                btnStyle={{ marginTop: 40 }}
                titleTxt={localization.appkeys.login}
              />

              <Text style={[style.dontHaveTxt, { color: colors.text }]}>
                {localization.appkeys.dontHave}
                <Text
                  onPress={() => {
                    navigation.navigate(AppRoutes.SignUp);
                  }}
                  style={[style.signupTxt, { color: colors.text }]}
                >
                  {localization.appkeys.signup}
                </Text>
              </Text>

              <View style={style.signInWithTopView}>
                <View
                  style={[style.lineView, { backgroundColor: colors.btnColor }]}
                />
                <Text style={[style.signInWithTxt, { color: colors.text }]}>
                  {localization.appkeys.signInWith}
                </Text>
                <View
                  style={[style.lineView, { backgroundColor: colors.btnColor }]}
                />
              </View>

              <View style={style.socialView}>
                <Pressable
                  onPress={() => {
                    isUser
                      ? userGoogleButtonPress()
                      : therapistGoogleButtonPress();
                  }}
                  style={style.socialBtn}
                >
                  <Image style={style.socialImg} source={images.google} />
                </Pressable>
                <Pressable
                  onPress={() => {
                    isUser
                      ? userFacebookButtonPress()
                      : therapistFacebookButtonPress();
                  }}
                  style={style.socialBtn}
                >
                  <Image style={style.socialImg} source={images.facebook} />
                </Pressable>
                {Platform.OS == "ios" && (
                  <Pressable
                    onPress={() => {
                      onAppleButtonPress();
                    }}
                    style={style.socialBtn}
                  >
                    <Image style={style.socialImg} source={images.apple} />
                  </Pressable>
                )}
              </View>

              <Text style={[style.creatingTxt]}>
                {localization.appkeys.byCreating}
              </Text>
              <View style={style.termsView}>
                <Text 
                  onPress={() => {
                    navigation.navigate(AppRoutes.TermsCondition);
                  }}
                style={[style.termsTxt, { color: colors.text }]}>
                  {localization.appkeys.TermsConditions}
                </Text>
                <Text style={style.andTxt}>and</Text>
                <Text 
                onPress={() => {
                  navigation.navigate(AppRoutes.PrivacyPolicy);
                }}style={[style.privacyTxt, { color: colors.text }]}>
                  {" "}
                  {localization.appkeys.privacy}
                </Text>
              </View>
            </View>
          </>
        }
      />
    </KeyboardAwareScrollView>
  );
}

const style = StyleSheet.create({
  forgot_pwdTxt: {
    fontSize: 12,
    fontFamily: AppFonts.SemiBoldItalic,
    alignSelf: "flex-end",
    marginTop: 5,
  },
  creatingTxt: {
    fontSize: 11,
    width: "80%",
    alignSelf: "center",
    textAlign: "center",
  },
  termsView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  privacyTxt: {
    fontSize: 10,
    fontFamily: AppFonts.Bold,
  },
  andTxt: {
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 3,
    fontSize: 10,
  },
  termsTxt: {
    fontSize: 10,
    fontFamily: AppFonts.Bold,
  },
  socialImg: {
    alignSelf: "center",
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  socialView: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    justifyContent: Platform.OS == "ios" ? "space-between" : "space-around",
    marginVertical: 20,
  },
  signInWithTopView: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 25,
  },
  signInWithTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Regular,
    alignSelf: "center",
    marginHorizontal: 15,
  },
  lineView: {
    width: "22%",
    height: 1.5,
    alignSelf: "center",
  },
  signupTxt: {
    fontSize: 12,
    fontFamily: AppFonts.SemiBold,
    alignSelf: "center",
  },
  dontHaveTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Regular,
    alignSelf: "center",
    marginTop: 8,
  },
  tabView: {
    width: "100%",
    padding: 4,
    height: 58,
    alignSelf: "center",
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1.5,
    backgroundColor: "white",
    flexDirection: "row",
  },
  mainView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 24,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 2,
    fontFamily: AppFonts.Medium,
  },
  img: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },
  viewHighlight: {
    justifyContent: "center",
    width: "50%",
    height: 50,
    alignSelf: "center",
    borderRadius: 4,
  },
  textHighlight: {
    fontFamily: AppFonts.Medium,
    alignSelf: "center",
    fontSize: 15,
  },
  socialBtn: {
    justifyContent: "center",
    width: "30%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "grey",
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: "#f2f2f2",
  },
});
export default Login;
