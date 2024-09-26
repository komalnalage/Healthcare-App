import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Switch
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SolidView from '../components/SolidView'
import { LocalizationContext } from '../../localization/localization'
import { useTheme } from '@react-navigation/native'
import Header from '../components/Header'
import AppFonts from '../../constants/fonts'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setdrawerSelectedTab } from '../../redux/Reducers/UserNewData'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../modals/Loader'

const Setting = ({ navigation }) => {
    let dispatch = useDispatch();
    const { colors } = useTheme()
    const { localization } = useContext(LocalizationContext);
    const [loading, setLoading] = useState(false);
    const loader = useSelector((state) => state.userNewData.loader);

    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('IsBiometric', (err, IsBiometric) => {
            if (IsBiometric == "true") {
                setIsEnabled(true)
            } else {
                setIsEnabled(false)
            }
        });
        dispatch(setdrawerSelectedTab("Setting"))
    }, [])

    const toggleSwitch = async () => {
        setIsEnabled(previousState => !previousState);
        if (!isEnabled) {
            androidbiomatric()
        } else {
            await AsyncStorage.setItem("IsBiometric", "false")
        }
    }

    const rnBiometrics = new ReactNativeBiometrics({
        allowDeviceCredentials: true,
    })

    async function androidbiomatric() {
        rnBiometrics.isSensorAvailable().then(resultObject => {
            const { available, biometryType } = resultObject
            if (available && biometryType === BiometryTypes.Biometrics) {
                rnBiometrics
                    .simplePrompt({ promptMessage: 'Confirm fingerprint' })
                    .then(async (resultObject) => {
                        const { success } = resultObject
                        if (resultObject.success) {
                            await AsyncStorage.setItem("IsBiometric", "true")
                        } else {
                            await AsyncStorage.setItem("IsBiometric", "false")
                            setIsEnabled(false)
                        }
                    })
                    .catch(() => {
                        console.log('biometrics failed')
                        setIsEnabled(false)
                    })
                console.log('TouchID is supported')
            } else if (available && biometryType === BiometryTypes.FaceID) {
                console.log('FaceID is supported')
            } else if (available && biometryType === BiometryTypes.Biometrics) {
                console.log('Biometrics is supported')
            }
            else {
                console.log('Biometrics not supported')
            }
        })
    }

    return (
        <SolidView
            
            view={
                <>
                 {loader && <Loader/>}
                    <Header
                        title={localization?.appkeys?.setting}
                        onPressBack={() => { navigation.goBack() }}
                    />
                    <ScrollView nestedScrollEnabled style={styles.mainView}>
                        <View style={styles.imageTopView}>
                            <Text
                                style={{
                                    fontFamily: AppFonts.SemiBold,
                                    color: colors.text,
                                    fontSize: 16
                                }}>{localization?.appkeys?.enablebio}</Text>
                            <Switch
                                value={isEnabled}
                                trackColor={{ false: '#00FFFF', true: '#00FFFF' }}
                                thumbColor={isEnabled ? '#00FFFF' : '#00FFFF'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                            />
                        </View>

                    </ScrollView>
                </>
            }
        />

    )
}

export default Setting

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    imageTopView: {
        flex: 1,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        justifyContent: 'space-between'
    },
})