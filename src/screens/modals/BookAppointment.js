import { useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import { Modal, View, Text, StyleSheet, Image } from "react-native";
import { LocalizationContext } from "../../localization/localization";
import CustomBtn from "../components/CustomBtn";
import AppFonts from "../../constants/fonts";
import { BlurView } from "@react-native-community/blur";

function BookAppointment({ isVisible, onBackDropPress, handleBackHome }) {
    const { images } = useTheme();
    const { localization } = useContext(LocalizationContext);

    return (
        <BlurView
        style={style.absolute}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      >
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
                        <Image style={style.timeImgStyle} source={images.calculator} />
                        <Text style={[style.txtStyle, { marginTop: 20, marginHorizontal: 16 }]}>{localization?.appkeys?.appointmentbooked}</Text>
                        <Text style={[style.txtStyle, { fontSize: 15, marginTop: 12 }]}>
                            {localization?.appkeys?.youcanbook}
                        </Text>
                        <View style={style.bottomButtonView}>
                            <CustomBtn
                                btnStyle={{ width: '90%' }}
                                onPress={handleBackHome}
                                titleTxt={localization?.appkeys?.backtohome}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
        </BlurView>
    );
}

export default BookAppointment;

const style = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
    parent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    popup: {
        width: "80%",
        backgroundColor: "white",
        // maxHeight: 380,
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
    timeImgStyle: {
        marginTop: 8,
        alignSelf: 'center',
        width: 90,
        height: 90,
        resizeMode: 'contain'
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
    bottomButtonView: {
        width: '100%'
    }
});
