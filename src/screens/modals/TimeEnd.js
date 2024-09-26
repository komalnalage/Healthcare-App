import { useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
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
import { hp } from "../../utils/dimension";

function TimeEnd({ isVisible, onBackDropPress, extendClick, keepGoingClick }) {
    const { colors, images } = useTheme();
    const { localization } = useContext(LocalizationContext);

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
                        <Image style={style.timeImgStyle} source={images.timeimg} />
                        <Text style={[style.txtStyle, { marginTop: 11, }]}>{localization?.appkeys?.timeends}</Text>

                        <Text style={[style.txtStyle, { fontSize: 15, marginTop: 10 }]}>
                            5 Minutes left for your current therapy
                        </Text>
                        <View style={style.buttonView}>
                            <CustomBtn
                                btnStyle={[style.keepgoingButton, { backgroundColor: colors.locationdiscription }]}
                                onPress={extendClick}
                                titleTxt={localization?.appkeys?.extendtime}
                            />
                            <CustomBtn
                                btnStyle={style.keepgoingButton}
                                onPress={keepGoingClick}
                                titleTxt={localization?.appkeys?.keepgoing}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default TimeEnd;

const style = StyleSheet.create({
    parent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 12
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
    txtStyle: {
        alignSelf: "center",
        fontSize: 20,
        textAlign: "center",
        color: "#363636",
        fontFamily: AppFonts.Medium
    },
    keepgoingButton: {
        width: '48%',
        height: hp(10)
    },
    btnStyle: {
        alignSelf: "center",
        marginTop: 30,
        backgroundColor: "green",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    bgImg: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.7
    },
    mainView: {
        width: "90%",
        paddingVertical: 30
    },
    timeImgStyle: {
        marginTop: 8,
        alignSelf: 'center',
        width: 90,
        height: 90,
        resizeMode: 'contain'
    },
});
