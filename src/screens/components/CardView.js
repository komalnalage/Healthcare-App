import { useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import {
    Text,
    StyleSheet,
    View,
    Pressable,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AppFonts from "../../constants/fonts";
import FastImage from "react-native-fast-image";
import { LocalizationContext } from "../../localization/localization";

export default function CardView({
    item,
    btnStyle,
    pass,
    onPress, title,
    index,
    onPressDelete,
    onpressEdit
}) {
    const { colors, images } = useTheme();
    const { localization } = useContext(LocalizationContext);
    const styles = useStyles(colors);
    return (
        <LinearGradient
            colors={[colors.btnColor, colors.cardcolor,]}
            style={styles.gradientView}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <View>
                <View style={styles.topView}>
                    <FastImage source={images.masterIcon}
                        style={styles.cardImg} resizeMode="contain" />
                    <View style={styles.deleteItemView}>
                        <Pressable
                            onPress={onPressDelete}
                        >
                            <FastImage
                                source={images.deletecard}
                                style={styles.deleteImg}
                                resizeMode="contain" />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.cardNumberView}>
                    <Text style={[styles.cardNumberTxt, { color: colors.white, }]}>  <Text
                        maxFontSizeMultiplier={1}
                        style={{
                            fontSize: 16,
                            letterSpacing: -2,
                        }}
                    >
                        •••• •••• ••••{" "}
                    </Text>{item?.last4}</Text>
                </View>

                <View style={styles.expiryDateView}>
                    <Text style={[styles.expiryDateTxt, { color: colors.white }]}>
                        Expires {item?.exp_month.toString().padStart(2, '0')}-{item?.exp_year.toString().slice(-2).padStart(2, '0')}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    )
}
const useStyles = (colors) => StyleSheet.create({
    cardImg: {
        height: 35,
        width: 60,
        marginTop: 20,
        marginLeft: 20
    },
    expiryDateTxt: {
        fontFamily: AppFonts.Medium,
        fontSize: 12
    },
    deleteItemView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    expiryDateView: {
        width: "100%",
        justifyContent: "center",
        height: "50%",
        marginLeft: 20
    },
    gradientView: {
        flex: 1,
        borderWidth: 0,
        borderRadius: 10,

    },
    cardNumberTxt: {
        fontFamily: AppFonts.SemiBold,
        fontSize: 20
    },
    topView: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        height: "25%"
    },
    deleteImg: {
        height: 30,
        width: 30,
        marginRight: 15
    },
    editImg: {
        height: 18,
        width: 18,
    },
    cardNumberView: {
        width: "100%",
        marginLeft: 20,
        marginTop: 20,
        height: "25%"
    },
    editView: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginRight: 8
    }
})