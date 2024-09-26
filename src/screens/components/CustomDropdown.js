import {
    View,
    StyleSheet
} from 'react-native'
import React, { useState } from 'react'
import FastImage from 'react-native-fast-image';
import { Dropdown } from 'react-native-element-dropdown';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import AppFonts from '../../constants/fonts';
import { useTheme } from '@react-navigation/native';

export default function CustomDropdown({ title, onChange, placeholder, data, tintColor, marginTop }) {
    const { images } = useTheme();
    const [isFocus, setIsFocus] = useState(false);
    return (
        <View style={[style.parentView, { backgroundColor: "white", }]}>
            <View style={style.container}>
                <Dropdown
                    style={style.dropdown}
                    itemTextStyle={{
                        color: "black"
                    }}
                    textColor="black"
                    placeholderStyle={[style.placeholderStyle, { color: "black" }]}
                    selectedTextStyle={[style.selectedTextStyle, { color: "black" }]}
                    showsVerticalScrollIndicator={false}
                    maxHeight={Platform.OS == 'ios' ? 150 : 180}
                    labelField="label"
                    valueField="value"
                    placeholder={placeholder}
                    searchPlaceholder="Search..."
                    data={data}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={onChange}
                    renderRightIcon={() => (
                        !isFocus ?
                            <FastImage tintColor={'#2EDDCC'} resizeMode='contain' source={images.downArrow} style={{ height: heightPercentageToDP(4), width: widthPercentageToDP(4), }} />
                            :
                            <FastImage tintColor={'#2EDDCC'} resizeMode='contain' source={images.downArrow} style={{ height: heightPercentageToDP(4), width: widthPercentageToDP(4), resizeMode: "contain", transform: [{ rotate: '180deg' }] }} />
                    )}
                />
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    parentView: {
        width: "47%",
        borderWidth: 1.5,
        borderColor: "#2EDDCC33",
        alignSelf: "center",
        borderRadius: 10,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
        elevation: 4,
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'

    },
    textNameStyle: {
        fontFamily: AppFonts.Regular,
        fontSize: 12,
        marginLeft: 5,
    },
    placeholderStyle: {
        fontFamily: AppFonts.SemiBold,
        fontSize: 16,
    },
    selectedTextStyle: {
        fontFamily: AppFonts.SemiBold,
        fontSize: 16,
    },
    dropdown: {
        height: 60,
        width: "100%",
        paddingHorizontal: 15,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})