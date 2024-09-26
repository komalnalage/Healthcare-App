import { useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import { Modal, View, Text, StyleSheet, Image } from "react-native";
import { LocalizationContext } from "../../localization/localization";
import CustomBtn from "../components/CustomBtn";
import AppFonts from "../../constants/fonts";

function DeleteCardModal({ isVisible, onBackDropPress,onYesPrss }) {
    const { colors, images } = useTheme();
    const { localization } = useContext(LocalizationContext);

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            style={{ borderWidth: 1, flex: 1 }}>
            <View style={style.parent}>
                <Image source={images.bgGrad}
                    blurRadius={5}
                    style={style.bgImg} />
                <View style={style.popup}>
                    <View style={style.mainView}>
                        <Image style={style.timeImgStyle} source={images.deletecard} />
                        <Text style={[style.txtStyle, { marginTop: 20, marginHorizontal: 16 }]}>Delete Card</Text>

                        <Text style={[style.txtStyle, { fontSize: 15, marginTop: 12 }]}>
                            Are you sure want to delete the card!!
                        </Text>
                        <View style={style.buttonView}>
                            <CustomBtn
                                btnStyle={style.yesButton}
                                onPress={onYesPrss}
                                titleTxt={localization.appkeys.yes}
                            />
                            <CustomBtn
                                btnStyle={[style.yesButton, { backgroundColor: colors.locationdiscription }]}
                                onPress={onBackDropPress}
                                titleTxt={localization.appkeys.no}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default DeleteCardModal;

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
    timeImgStyle: {
        marginTop: 8,
        alignSelf: 'center',
        width: 90,
        height: 90,
        resizeMode: 'contain'
    },
    yesButton: {
        width: '48%'
    },
    popup: {
        width: "90%",
        backgroundColor: "white",
        // maxHeight:hp(50),
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
});
