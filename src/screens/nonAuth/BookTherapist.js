import {
    Text,
    View,
    StyleSheet,
} from 'react-native'
import React, { useContext, useState } from 'react'
import SolidView from '../components/SolidView'
import { useTheme } from '@react-navigation/native'
import { LocalizationContext } from '../../localization/localization'
import Header from '../components/Header'
import { hp, wp } from '../../utils/dimension'
import FastImage from 'react-native-fast-image'
import AppFonts from '../../constants/fonts'
import CustomBtn from '../components/CustomBtn'
import BookAppointment from '../modals/BookAppointment'
import AppRoutes from '../../routes/RouteKeys/appRoutes'
import Loader from '../modals/Loader'
import { useSelector } from 'react-redux'

const BookTherapist = ({ navigation }) => {
    const { colors, images } = useTheme()
    const { localization } = useContext(LocalizationContext);
    const [loading, setLoading] = useState(false);
    const loader = useSelector((state) => state.userNewData.loader);

    const [showCancel, setShowCancel] = useState(false);
    return (
        <SolidView
            
            view={
                <View style={styles.mainView}>
                     {loader && <Loader/>}
                    <Header
                        title={localization?.appkeys?.BookTherapist}
                        onPressBack={() => { navigation.goBack() }}
                    />
                    <View style={styles.topView}>
                        <Text style={[styles.bookingDetailTxt, {
                            color: colors.locationdiscription,
                        }]}>{localization?.appkeys?.Bookingdetails}</Text>

                        <View style={[styles.mainContainer]}>

                            <View style={[styles.childContainer,]}>
                                <Text style={[styles.textStyle, { color: colors.bookingdetail },]} >{localization?.appkeys?.BookingPrice}</Text>
                                <Text style={[styles.textPrice, { color: colors.bookingdetail }]}>$ 25.00</Text>
                            </View>

                            <View style={styles.childContainer}>
                                <Text style={[styles.textStyle, { color: colors.bookingdetail }]} >{localization?.appkeys?.Tax}</Text>
                                <Text style={[styles.textPrice, { color: colors.bookingdetail }]}>$ 05.00</Text>
                            </View>

                            <View style={styles.lineStyle}></View>

                            <View style={styles.totalPriceContainer}>
                                <Text style={[styles.textTotal, { color: colors.bookingdetail }]} >{localization?.appkeys?.Total}</Text>
                                <Text style={[styles.textTotalPrice, { color: colors.pricecolor }]}>$30.00</Text>
                            </View>

                        </View>

                        <Text style={[styles.paymentOptionTxt, { color: colors.locationdiscription }]}>{localization?.appkeys?.PaymentOption}</Text>

                        <View style={[styles.cardView]}>
                            <Text style={[styles.cardTxt, { color: colors.locationdiscription, }]}>**** **** **** 1234</Text>
                            <View
                                style={styles.mastercardView}>
                                <FastImage
                                    resizeMode='contain'
                                    style={styles.cardImg}
                                    source={images.masterIcon} />
                                <FastImage
                                    resizeMode='contain'
                                    style={styles.arrowImg}
                                    source={images.greaterthenIcon} />
                            </View>
                            <Text style={[styles.cardYearTxt, { color: colors.bookingdetail, }]}>2021-09</Text>
                        </View>
                        <View style={styles.buttonView}>
                            <CustomBtn
                                onPress={() => {
                                    setShowCancel(true)
                                }}
                                titleTxt={localization.appkeys.PayNow}
                            />
                        </View>
                    </View>
                    <BookAppointment
                        isVisible={showCancel}
                        onBackDropPress={() => { setShowCancel(false) }}
                        handleBackHome={() => {
                            navigation.navigate(AppRoutes.Home)
                        }}
                    />
                </View>
            }

        />
    )
}

export default BookTherapist

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    bookingDetailTxt: {
        fontSize: 18,
        marginTop: hp(3),
        fontFamily: AppFonts.SemiBold
    },
    cardImg: {
        height: 24,
        width: 36,
        marginLeft: 5
    },
    topView: {
        flex: 1,
        marginBottom: 40,
        width: wp(90),
        alignSelf: 'center'
    },
    cardYearTxt: {
        fontSize: 18,
        marginLeft: wp(14),
        fontFamily: AppFonts.SemiBold,
        marginBottom: -5,
        marginTop: -5
    },
    arrowImg: {
        height: hp(2),
        width: hp(2),
    },
    mainContainer: {
        width: "100%",
        borderRadius: 15,
        shadowColor: "#000",
        alignSelf: "center",
        marginTop: 20,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        backgroundColor: "#FFFFFF",
        elevation: 3,
    },
    childContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginTop: 10,
    },
    textStyle: {
        fontSize: 16,
        fontFamily: AppFonts.Medium
    },
    textPrice: {
        fontSize: 16,
        fontFamily: AppFonts.Regular
    },
    lineStyle: {
        width: "92%",
        backgroundColor: "#0000800A",
        height: 2,
        marginTop: 10,
        alignSelf: "center"
    },
    textTotal: {
        fontSize: 18,
        fontFamily: AppFonts.Bold
    },
    textTotalPrice: {
        fontSize: 18,
        fontFamily: AppFonts.Bold
    },
    totalPriceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginBottom: 20,
        marginTop: 20
    },
    cardView: {
        width: "100%",
        borderRadius: 5,
        shadowColor: "#000",
        alignSelf: "center",
        marginTop: 20,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        backgroundColor: "#FFFFFF",
        padding: 10
    },
    paymentOptionTxt: {
        fontSize: 18,
        fontFamily: AppFonts.SemiBold,
        marginTop: hp(3)
    },
    cardTxt: {
        fontSize: 18,
        fontFamily: AppFonts.Medium,
        marginLeft: wp(14),
        marginBottom: -10
    },
    mastercardView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    buttonView: {
        position: 'absolute',
        width: "100%",
        bottom: 10
    },
})