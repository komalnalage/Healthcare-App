import {
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native'
import React, { useContext, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { LocalizationContext } from '../../localization/localization';
import AppFonts from '../../constants/fonts';

const Tab = ({ }) => {
    const { colors } = useTheme()
    const [isPast, setIsPast] = useState(true)
    const { localization } = useContext(LocalizationContext);
    return (
        <View style={[styles.tabTopView, { borderColor: colors.tabbordercolor }]}>
            <Pressable
                onPress={() => setIsPast(true)}
                style={[styles.viewHighlight,
                { backgroundColor: !isPast ? "rgba(38,51,59,0.2)" : colors.locationdiscription }]}>
                <Text
                    style={[styles.textHighlight, { color: !isPast ? colors.locationdiscription : 'white' }]}
                >
                    {localization.appkeys.Past}
                </Text>
            </Pressable>
            <Pressable
                onPress={() => setIsPast(false)}
                style={[
                    styles.viewHighlight,
                    { backgroundColor: !isPast ? colors.locationdiscription : "rgba(38,51,59,0.2)" }
                ]}>
                <Text
                    style={[styles.textHighlight, { color: !isPast ? "white" : colors.locationdiscription }]}
                >
                    {localization.appkeys.Upcoming}
                </Text>
            </Pressable>
        </View>
    )
}

export default Tab

const styles = StyleSheet.create({
    viewHighlight: {
        justifyContent: 'center',
        width: '50%',
        height: 50,
        alignSelf: 'center',
        borderRadius: 4
    },
    textHighlight: {
        fontFamily: AppFonts.Medium,
        alignSelf: 'center',
        fontSize: 15
    },
    tabTopView: {
        width: '92%',
        padding: 4,
        height: 58,
        alignSelf: 'center',
        borderRadius: 8,
        marginTop: 20,
        borderWidth: 1.5,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
})