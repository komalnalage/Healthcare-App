import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AppFonts from '../../constants/fonts';
import CallComp from '../components/CallComp';
import AppRoutes from '../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../localization/localization';

const IncomingCall = ({ navigation }) => {
    const { colors, images } = useTheme();
    const [callView, setcallView] = useState(false)
    const { localization } = useContext(LocalizationContext);

    return (
        <LinearGradient
            colors={[colors.btnColor, colors.incomingcall,]}
            style={styles.gradientView}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {
                !callView &&
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <ImageBackground
                        resizeMode='contain'
                        style={{
                            height: 180,
                            width: 180,
                            marginTop: 80,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        source={images.incomingcall}
                    >
                        <FastImage
                            resizeMode='contain'
                            style={{
                                height: 150,
                                width: 150
                            }}
                            source={images.usercalling}
                        />

                    </ImageBackground>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: AppFonts.Medium,
                        marginTop: 10,
                        color: colors.text
                    }}>{localization?.appkeys?.Incomingcall}</Text>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: AppFonts.SemiBold,
                        marginTop: 10,
                        color: colors.text
                    }}>John Doe</Text>
                    <Pressable
                        onPress={() => {
                            setcallView(true)
                        }}
                        style={{
                            position: 'absolute',
                            bottom: 50,
                            alignItems: 'center'
                        }}>
                        <FastImage
                            resizeMode='contain'
                            style={{
                                height: 100,
                                width: 100
                            }}
                            source={images.callbutton}
                        />
                        <Text style={{
                            fontSize: 12,
                            fontFamily: AppFonts.Medium,
                            color: colors.text
                        }}>{localization?.appkeys?.swipeup}</Text>
                    </Pressable>
                </View>
            }

            {callView && <CallComp visible={callView} onEndPress={() => {
                navigation.navigate(AppRoutes.ChatScreen)
                setcallView(false)
            }}></CallComp>}
        </LinearGradient>
    )
}

export default IncomingCall

const styles = StyleSheet.create({
    gradientView: { flex: 1, },
})