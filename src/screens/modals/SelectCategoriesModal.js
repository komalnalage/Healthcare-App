import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Pressable } from "react-native";
import { LocalizationContext } from "../../localization/localization";
import CustomBtn from "../components/CustomBtn";
import AppFonts from "../../constants/fonts";
import { hp } from "../../utils/dimension";
import { userCancelledAppointment } from "../../api/Services/services";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import AppUtils from "../../utils/appUtils";
import { setUserSearch, settherapistSearchModal } from "../../redux/Reducers/UserNewData";

function SelectCategoriesModal({ isVisible, onBackDropPress, handleOnpress, appointmentID }) {
    const userDetail = useSelector((state) => state.userData.userDetail);
    // console.log("SelectCategoriesModal appointmentID",appointmentID)
    const token = useSelector((state) => state.userData.token);
    let dispatch = useDispatch();
    const { colors, images } = useTheme();
    const { localization } = useContext(LocalizationContext);
    const [timer, setTimer] = useState(180)
    const currentDateTime = moment().utc();
    // const currentDateTime = moment().format('YYYY-MM-DD HH:mm');

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
        } else {
            CancelAppointment();
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [timer]);

    const CancelAppointment = async () => {
        console.log("appointmentID",appointmentID);
        let res = null;
        res = await userCancelledAppointment(currentDateTime, appointmentID, token)
        console.log("userCancelledAppointment res", res);
        if (res?.data?.status) {
            dispatch(setUserSearch(false))
            dispatch(settherapistSearchModal(false))
        } else {
            AppUtils.showToast(res?.data?.message);
        }
    };


    const convert_time_formate = (timer) => {
        const formattedTime = `${(Math.floor(timer / 60) % 60)
            .toString()
            .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`;
        return formattedTime;
    }

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            style={{ flex: 1 }}
        >
            <Pressable
                onPress={handleOnpress}
                style={style.parent}>
                <Image source={images.bgGrad} blurRadius={5} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: 0.7
                }} />
                <View style={style.topView}>
                    <Image style={style.gifImage}
                        source={images.searching}
                    />
                    <Text style={[style.therapistTxt, { color: colors.addAvailbility_Color, }]}>{localization?.appkeys?.SearchingTherapist}</Text>
                    <Text style={[style.timeTxt, { color: colors.addAvailbility_Color, }]}>{localization?.appkeys?.EstimatedTime} {convert_time_formate(timer)}</Text>
                    <CustomBtn onPress={()=>{CancelAppointment()}}  titleTxt={"Cancel"}></CustomBtn>
                    <View style={{
                        height:20
                    }}></View>
                </View>
            </Pressable>
        </Modal>
    );
}

export default SelectCategoriesModal;

const style = StyleSheet.create({
    parent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    therapistTxt: {
        fontFamily: AppFonts.SemiBold,
        fontSize: 16
    },
    topView: {
       // height: hp(36),
        width: "90%",
        alignItems: 'center',
        paddingVertical: 10,
        // justifyContent: 'center',
        backgroundColor: "white",
        borderRadius: 10
    },
    timeTxt: {
        fontFamily: AppFonts.Regular,
        fontSize: 16,
        marginTop: 10
    },
    gifImage: {
        width: "90%",
        height: hp(20),
        // borderRadius: 20,
        resizeMode: 'contain'
    },
    popup: {
        width: "90%",
        backgroundColor: "white",
        maxHeight: 300,
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
    txtStyle: {
        alignSelf: "center",
        fontSize: 19,
        textAlign: "center",
        color: "#363636",
        fontFamily: AppFonts.Medium
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
});
