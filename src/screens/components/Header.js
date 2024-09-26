import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@react-navigation/native'
import { hp, wp } from '../../utils/dimension'
import AppFonts from '../../constants/fonts'

const Header = ({ title, onPressBack, hidebackArrow, skip, handleSkip }) => {
    const { colors, images } = useTheme()
    return (
        <View style={[styles.topView, { backgroundColor: colors.header_background }]}>
            {
                hidebackArrow ? <View style={styles.CommonSTYLE}></View> : <TouchableOpacity
                style={styles.CommonSTYLE}
                    onPress={onPressBack}>
                    <FastImage
                        tintColor={colors.backarrow}
                        style={styles.imageView}
                        resizeMode="contain"
                        source={images.backarrow} />
                </TouchableOpacity>
            }

            <Text style={[styles.titleTxt, { color: colors.user_Select_Categories_HedingTitle }]}>{title}</Text>
            {
                skip ?
                    <TouchableOpacity
                    style={styles.CommonSTYLE}
                        onPress={handleSkip}>
                        <Text maxFontSizeMultiplier={1} style={[styles.skipTxt, { color: colors.user_Select_Categories_HedingTitle }]}>{skip}</Text>
                    </TouchableOpacity>
                    : <View style={styles.CommonSTYLE}></View>
            }
            {/* <View style={styles.imageView}></View> */}
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
  CommonSTYLE: {height: hp(5),
                         width: wp(10),
     alignSelf: "center",
     justifyContent: "center"
                ,  },
    topView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%",
        alignSelf: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: "#2EDDCC26",
        paddingHorizontal: 24,
        paddingVertical: 16,

    },
    imageView: {
        height: hp(3),
        width: wp(3),
    },
    titleTxt: {
        fontFamily: AppFonts.Medium,
        fontSize: 20,
    },
    skipTxt: {
        fontSize: 16,
        lineHeight: 25,
        fontFamily: AppFonts.Medium,
    }
})