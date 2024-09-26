import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { SetinitialRouteName, setloading } from "../../redux/Reducers/userData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { savedCard } from "../../api/Services/services";
import Loader from "../modals/Loader";
import { setloader } from "../../redux/Reducers/UserNewData";
import CustomBtn from "../components/CustomBtn";

function BiometricVerification({ navigation }) {
    const user = useSelector((state) => state.userData.user);
    const userToken = useSelector((state) => state.userData.token);
    const isVerificationEnabled = useSelector((state) => state.userData.verificationEnabled);
    const { colors, images } = useTheme();
    const [loading, setLoading] = useState(false);
    const loader = useSelector((state) => state.userNewData.loader);

    const { localization } = useContext(LocalizationContext);
    const dispatch = useDispatch();
    const [savedCardData, setsavedCardData] = useState([])

    useEffect(() => {
        getSavedCard()
        androidbiomatric()
    }, [])

    const rnBiometrics = new ReactNativeBiometrics({
        allowDeviceCredentials: true,
    })


    const getSavedCard = async () => {
        let res = null;
        res = await savedCard(userToken);
        if (res?.data?.status) {
            setsavedCardData(res?.data?.data)
            dispatch(setloader(false))
        } else {
            setTimeout(() => {
                dispatch(setloader(false))

            }, 500);
        }
    }

    const handleNavigation = async () => {
        let res = null;
        res = await savedCard(userToken);
        if (res?.data?.status) {
            if (isVerificationEnabled) {
                navigation.replace(AppRoutes.Home)
                dispatch(SetinitialRouteName(AppRoutes.Home))

            } else {
                navigation.replace(AppRoutes.AddCard)
                dispatch(SetinitialRouteName(AppRoutes.AddCard))
            }
        } else {
            navigation.replace(AppRoutes.AddCard)
            dispatch(SetinitialRouteName(AppRoutes.AddCard))
        }
    }

    const handleTherapistClick = async () => {
        navigation.replace(AppRoutes.Home)
        dispatch(SetinitialRouteName(AppRoutes.Home))
    }

    async function androidbiomatric() {
        rnBiometrics.isSensorAvailable().then(resultObject => {
            const { available, biometryType } = resultObject

            if (available && biometryType === BiometryTypes.Biometrics) {
                rnBiometrics
                    .simplePrompt({ promptMessage: 'Confirm fingerprint' })
                    .then(resultObject => {
                        const { success } = resultObject
                        if (resultObject.success) {
                            AsyncStorage.setItem("IsBiometric", "true")
                            user?.type == 'user' ? handleNavigation() : handleTherapistClick()
                        }
                    })
                    .catch(() => {
                        console.log('biometrics failed')
                    })
                console.log('TouchID is supported')
            } else if (available && biometryType === BiometryTypes.FaceID) {
                console.log('FaceID is supported')
            } else if (available && biometryType === BiometryTypes.Biometrics) {
                console.log('Biometrics is supported')
            }
            else {
                console.log('Biometrics not supported')
            }
        })
    }
    return (
        <SolidView
            
            view={
                <View style={style.topView}>
                    {loader && <Loader />}
                    <Image source={images.darkLogo} style={style.img} />
                    <Text
                        style={[style.titleText, { color: colors.text, fontFamily: AppFonts.SemiBold, marginTop: 20 }]}
                    >
                        {localization?.appkeys?.Usebiometric}
                    </Text>
                    <Pressable onPress={() => androidbiomatric()}>
                        <Image source={images.scan} style={style.scanImg} />
                    </Pressable>
                    <CustomBtn  titleTxt={"Enable"}></CustomBtn>
                    <Text onPress={() => {
                        AsyncStorage.setItem("IsBiometric", "skip")

                    }}
                        style={[style.titleText, { color: colors.text, fontFamily: AppFonts.Medium, marginTop: 10 }]}
                    >
                        {localization?.appkeys?.skip}
                    </Text>


                </View>
            }
        />
    );
}

const style = StyleSheet.create({
    scanImg: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginVertical: 40
    },
    topView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 16,
        alignSelf: "center",
        textAlign: "center",
        lineHeight: 25, marginTop: 2,
        fontFamily: AppFonts.Medium
    },
    img: {
        width: 160,
        height: 160,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
});
export default BiometricVerification;
