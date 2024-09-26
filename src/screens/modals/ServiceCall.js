import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";
import { LocalizationContext } from "../../localization/localization";
import CustomBtn from "../components/CustomBtn";
import AppFonts from "../../constants/fonts";
import getEnvVars from "../../../env";
import AppUtils from "../../utils/appUtils";
import { useDispatch, useSelector } from "react-redux";
import { therapistRejectCall } from "../../api/Services/services";
import moment from "moment";
import { settherapistSearchModal } from "../../redux/Reducers/UserNewData";

function ServiceCall({ isVisible, onBackDropPress, onPressAccept, serviceCallImg, appointmentID }) {
    const token = useSelector((state) => state.userData.token);
    const userDetail = useSelector((state) => state.userData.userDetail);
    let dispatch = useDispatch();
    const { colors, images } = useTheme();
    const { localization } = useContext(LocalizationContext);
    const [timer, setTimer] = useState(15)
    const currentDateTime = moment().utc()
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
        } else {
            rejectCallRequest();
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [timer]);

    const convert_time_formate = (timer) => {
        const formattedTime = `${(Math.floor(timer / 60) % 60)
            .toString()
            .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`;
        return formattedTime;
    }

    const rejectCallRequest = async () => {
        let res = null;
        res = await therapistRejectCall(currentDateTime, userDetail?.appointment_id, token)
        if (res?.data?.status) {
            AppUtils.showToast(res?.data?.message);
            dispatch(settherapistSearchModal(false))
        } else {
            dispatch(settherapistSearchModal(false))
            AppUtils.showToast(res?.data?.message);
        }
    };

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            style={{ borderWidth: 1, flex: 1 }}
        >
            <View style={style.parent}>
                <Image source={images.bgGrad}
                    blurRadius={5}
                    style={style.bgImg} />
                <View style={style.popup}>
                    <View
                        style={style.mainView}>
                        <Text style={[style.serviceCallTxt, { color: colors.servicecall }]}>{localization.appkeys.serviceCall}</Text>
                        <Text style={[style.txtStyle, { color: colors.walkthrough }]}>
                            {localization.appkeys.newRequest}
                        </Text>
                        {
                            serviceCallImg ?
                                <Image style={[style.newUserImg, { borderColor: colors.btnColor }]} source={serviceCallImg?.includes("http") ? {
                                    uri: serviceCallImg
                                } :
                                    {
                                        uri: getEnvVars().fileUrl + serviceCallImg
                                    }} /> :
                                <Image style={[style.newUserImg, { borderColor: colors.btnColor }]} source={images.newuser} />
                        }
                        <View style={style.buttonView}>
                            <CustomBtn
                                btnStyle={style.acceptBtn}
                                onPress={onPressAccept}
                                titleTxt={localization.appkeys.accept}
                            />
                            <CustomBtn
                                btnStyle={[style.acceptBtn, { backgroundColor: colors.locationdiscription }]}
                                onPress={onBackDropPress}
                                titleTxt={localization.appkeys.decline}
                            />
                        </View>
                        <Text style={[style.timeTxt, { color: colors.text, }]}>{localization?.appkeys?.EstimatedTime} {convert_time_formate(timer)}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default ServiceCall;

const style = StyleSheet.create({
    parent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    timeTxt: {
        fontFamily: AppFonts.Regular,
        fontSize: 16,
        marginTop: 10,
        alignSelf: 'center'
    },
    popup: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        elevation: 7,
        alignSelf: "center",
        shadowColor: "grey",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 4,
    },
    newUserImg: {
        marginTop: 15,
        alignSelf: 'center',
        width: 150,
        height: 150,
        resizeMode: 'stretch',
        borderRadius: 80,
        borderWidth: 4,
    },
    mainView: {
        width: "90%",
        paddingVertical: 30
    },
    bgImg: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.7
    },
    txtStyle: {
        alignSelf: "center",
        textAlign: "center",
        fontSize: 16.5,
        fontFamily: AppFonts.Regular
    },
    serviceCallTxt: {
        alignSelf: "center",
        fontSize: 23.5,
        textAlign: "center",
        fontFamily: AppFonts.Bold,
        marginTop: 8,
        marginHorizontal: 16
    },
    btnStyle: {
        alignSelf: "center",
        marginTop: 30,
        backgroundColor: "green",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    btnTxt: {
        alignSelf: "center",
        fontSize: 18,
        textAlign: "center",
        color: "white",
        fontWeight: 600,
    },
    buttonView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 12
    },
    acceptBtn: {
        width: '48%'
    },
});
