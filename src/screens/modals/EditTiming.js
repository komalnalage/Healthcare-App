import { useTheme } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from "react-native";
import { LocalizationContext } from "../../localization/localization";
import CustomBtn from "../components/CustomBtn";
import AppFonts from "../../constants/fonts";
import { hp, wp } from "../../utils/dimension";

function EditTiming({ isVisible, onBackDropPress }) {
    const { colors, images } = useTheme();
    const { localization } = useContext(LocalizationContext);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [period, setPeriod] = useState('AM');

    const incrementHour = () => {
        setHours((prevHours) => (prevHours + 1) % 24);
    };

    const decrementHour = () => {
        setHours((prevHours) => (prevHours - 1 + 24) % 24);
    };

    const incrementMinute = () => {
        setMinutes((prevMinutes) => (prevMinutes + 1) % 60);
    };

    const decrementMinute = () => {
        setMinutes((prevMinutes) => (prevMinutes - 1 + 60) % 60);
    };

    const togglePeriod = () => {
        setPeriod(period === 'AM' ? 'PM' : 'AM');
    };


    return (
        <Modal
            transparent={true}
            visible={isVisible}
            style={{ borderWidth: 1, flex: 1 }}
        >
            <View style={style.parent}>
                <Image source={images.bgGrad} blurRadius={5}
                    style={style.bgImg} />
                <View style={style.popup}>
                    <View style={style.mainView}>
                        <Text style={[style.dateTxt, { color: colors.text }]}>{localization?.appkeys?.SelectTime}</Text>
                        <View style={style.topView}>
                            <View style={style.hourView}>
                                <TouchableOpacity
                                    onPress={decrementHour}>
                                    <Image
                                        style={style.arrowImg}
                                        source={images.timearrowup}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={[style.hourTxt, { color: colors.locationdiscription }]}>{hours.toString().padStart(2, '0')}{" "}{"h"}</Text>
                                <TouchableOpacity
                                    onPress={incrementHour}>
                                    <Image
                                        style={style.arrowImg}
                                        source={images.timearrowdown}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={style.hourView}>
                                <TouchableOpacity
                                    onPress={decrementMinute}>
                                    <Image
                                        style={style.arrowImg}
                                        source={images.timearrowup}
                                    />
                                </TouchableOpacity>
                                <Text style={[style.hourTxt, { color: colors.locationdiscription }]}>{minutes.toString().padStart(2, '0')}{" "}{"m"}</Text>
                                <TouchableOpacity
                                    onPress={incrementMinute}>
                                    <Image
                                        style={style.arrowImg}
                                        source={images.timearrowdown}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={style.hourView}>
                                <TouchableOpacity
                                    onPress={togglePeriod}>
                                    <Image
                                        style={style.arrowImg}
                                        source={images.timearrowup}
                                    />
                                </TouchableOpacity>
                                <Text style={[style.hourTxt, { color: colors.locationdiscription }]}
                                    onPress={togglePeriod}>
                                    {period}
                                </Text>
                                <TouchableOpacity
                                    onPress={togglePeriod}>
                                    <Image
                                        style={style.arrowImg}
                                        source={images.timearrowdown}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={style.bottomButtonView}>
                            <CustomBtn
                                btnStyle={{ width: '90%' }}
                                onPress={onBackDropPress}
                                titleTxt={localization.appkeys.AddTime}
                            />

                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default EditTiming;

const style = StyleSheet.create({
    parent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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
    periodText: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    hourView: {
        backgroundColor: "#E7FAF8",
        borderRadius: 5,
        height: hp(10),
        minWidth: wp(20),
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        paddingVertical: 20

    },
    hourTxt: {
        fontFamily: AppFonts.SemiBold,
        fontSize: 22
    },
    dateTxt: {
        alignSelf: 'center',
        fontSize: 20,
        fontFamily: AppFonts.Medium,
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        justifyContent: 'space-around'
    },
    popup: {
        width: "90%",
        backgroundColor: "white",
        // maxHeight:hp(45),
        // maxHeight: 360,
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
    arrowImg: {
        height: hp(2),
        width: wp(2),
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
    bottomButtonView: {
        flexDirection: 'row',
        marginTop: 12,
        alignItems: 'center',
        alignSelf: 'center',
    }
});
