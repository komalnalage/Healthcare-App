import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image, BackHandler
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useTheme } from '@react-navigation/native';
import SolidView from '../components/SolidView';
import { hp } from '../../utils/dimension';
import FastImage from "react-native-fast-image";
import TimeEnd from '../modals/TimeEnd';
import AppRoutes from '../../routes/RouteKeys/appRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { therapistCompleteCall, userCompleteCall } from '../../api/Services/services';
import moment from 'moment';
import Loader from '../modals/Loader';
import AppUtils from '../../utils/appUtils';
import getEnvVars from '../../../env';
import { setIsCallCompleted, setloading } from '../../redux/Reducers/userData';
import { setloader } from '../../redux/Reducers/UserNewData';


const Video = ({ navigation, route }) => {
    let dispatch = useDispatch();
    const user = useSelector((state) => state.userData.user)
    const token = useSelector((state) => state.userData.token)
    const userDetail = useSelector((state) => state.userData.userDetail);
    const userData = useSelector((state) => state.userData.userData);
    const isCallCompleted = useSelector((state) => state.userData.isCallCompleted);
    const notificationType = useSelector((state) => state.userData.notificationType);
    const { images } = useTheme()
    const loader = useSelector((state) => state.userNewData.loader);

    const [showCancel, setShowCancel] = useState(false);
    const currentDateTime = moment().utc();

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => {
            navigation.reset({ index: 0, routes: [{ name: AppRoutes.Home }] })
            return true;
        })

    }, [])

    useEffect(() => {
        if (isCallCompleted) {
            if (user?.type == 'therapist') {
                dispatch(setIsCallCompleted(false))
                if (notificationType === 'appointment_call_complete') {
                    navigation.goBack()
                }
            } else {
                dispatch(setIsCallCompleted(false))
                if (notificationType === 'appointment_call_complete') {
                    navigation.navigate(AppRoutes.Feedback)
                }
            }
        }
        setTimeout(() => {
             dispatch(setloader(false))
        }, 2000);
       

    }, [isCallCompleted, user])







  

    const userCompletedCall = async () => {
        dispatch(setloader(true))
        let res = null;
        res = await userCompleteCall(currentDateTime, userDetail?.appointment_id, token)
        if (res?.data?.status) {
            dispatch(setloader(false))
            setTimeout(() => {
                navigation.navigate(AppRoutes.Feedback)
            }, 500);
            AppUtils.showToast(res?.data?.message)

        } else {
            setTimeout(() => {
                dispatch(setloader(false))

            }, 500);
            AppUtils.showToast(res?.data?.message)
        }
    }

    const therapistCompletedCall = async () => {
        dispatch(setloader(true))
        let res = null;
        res = await therapistCompleteCall(currentDateTime, userDetail?.appointment_id, token)
        if (res?.data?.status) {
            dispatch(setloader(false))
            setTimeout(() => {
                navigation.goBack()
            }, 500);

            AppUtils.showToast(res?.data?.message)
        } else {
            setTimeout(() => {
                dispatch(setloader(false))

            }, 500);
            AppUtils.showToast(res?.data?.message)
        }
    }

    return (
        <SolidView
            
            view={
                <View style={styles.mainView}>
                    {loader && <Loader />}
                    <ImageBackground
                        resizeMode='cover'
                        style={styles.ImageBackgroundView}
                        source={userDetail?.user_detail?.profile_pic ? (user?.type == 'therapist' ? (userDetail?.user_detail?.profile_pic?.includes("http") ? { uri: userDetail?.user_detail?.profile_pic } : { uri: getEnvVars().fileUrl + userDetail?.user_detail?.profile_pic }) :
                            userDetail?.therapist_detail?.profile_pic?.includes("http") ? { uri: userDetail?.therapist_detail?.profile_pic } : { uri: getEnvVars().fileUrl + userDetail?.therapist_detail?.profile_pic }) : images.w3}

                    >
                        <View style={styles.bottomView}>
                            <TouchableOpacity style={styles.callview}>
                                <FastImage
                                    resizeMode="contain"
                                    source={images.videocamera}
                                    style={styles.cameraImg}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.callview}>
                                <FastImage
                                    resizeMode="contain"
                                    source={images.videomute}
                                    style={styles.cameraImg}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.speakerVIEW}>
                                <FastImage
                                    resizeMode="contain"
                                    source={images.audiomute}
                                    style={styles.cameraImg}
                                ></FastImage>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.endViewStyle}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (route?.params?.from == "profile") {
                                        navigation.goBack()
                                    } else {
                                        user.type == 'therapist' ? therapistCompletedCall() : userCompletedCall()

                                    }
                                }}
                                style={styles.endView}>
                                <FastImage
                                    resizeMode="contain"
                                    source={images.end}
                                    style={styles.cameraImg}
                                ></FastImage>
                            </TouchableOpacity>
                        </View>
                        {
                            userData?.profile_pic ?
                                <Image
                                    style={styles.otheruserImg}
                                    source={userData?.profile_pic.includes("http") ? {
                                        uri: userData?.profile_pic
                                    } :
                                        {
                                            uri: getEnvVars().fileUrl + userData?.profile_pic
                                        }}
                                /> :
                                <Image
                                    style={styles.otheruserImg}
                                    source={images.otheruser}
                                />
                        }
                    </ImageBackground>
                    <TimeEnd
                        extendClick={() => {
                            setShowCancel(false)
                        }}
                        keepGoingClick={() => {
                            setShowCancel(false)
                            navigation.navigate(AppRoutes.Feedback)
                        }}
                        isVisible={showCancel}
                        onBackDropPress={() => { setShowCancel(false) }}
                    />
                </View>
            }
        />
    )
}

export default Video;

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    endViewStyle: {
        position: "absolute",
        bottom: 20,
        alignSelf: 'center'
    },
    otheruserImg: {
        height: 280,
        width: 200,
        position: 'absolute',
        right: 25,
        bottom: hp(30),
        resizeMode: 'contain',
        // height: hp(45),
        // width: wp(45),
    },
    cameraImg: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    ImageBackgroundView: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.7,
        width: "100%"
    },
    bottomView: {
        justifyContent: "space-around",
        flexDirection: "row",
        position: "absolute",
        bottom: 120,
        width: "100%",
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
})