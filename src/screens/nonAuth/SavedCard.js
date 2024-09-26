import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    useColorScheme,
    SafeAreaView
} from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { LocalizationContext } from '../../localization/localization';
import Header from '../components/Header';
import AppFonts from '../../constants/fonts';
import CustomBtn from '../components/CustomBtn';
import Carousel from 'react-native-reanimated-carousel';
import CardView from '../components/CardView';
import AppRoutes from '../../routes/RouteKeys/appRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { savedCard, deleteUserCard } from '../../api/Services/services';
import Loader from '../modals/Loader';
import AppUtils from '../../utils/appUtils';
import { useStripe } from '@stripe/stripe-react-native';
import PaymentScreen from '../components/PaymentScreen';
import DeleteCardModal from '../modals/DeleteCardModal';
import { hp, wp } from '../../utils/dimension';
import { SetinitialRouteName, setloading } from '../../redux/Reducers/userData';
import { setloader } from '../../redux/Reducers/UserNewData';


const SavedCard = ({ navigation }) => {
    let dispatch = useDispatch();
    const colorScheme = useColorScheme();
    const userData = useSelector((state) => state.userData.userData);
    const userToken = useSelector((state) => state.userData.token);
    const { colors } = useTheme()
    const { localization } = useContext(LocalizationContext);
    const loader = useSelector((state) => state.userNewData.loader);

    const styles = useStyles(colors, colorScheme);
    const [flag, setflag] = useState(false)
    const width = Dimensions.get('window').width;
    const [savedCardData, setsavedCardData] = useState([])
    const [showCancel, setShowCancel] = useState(false);
    const [selectedID, setselectedID] = useState("")

    useEffect(() => {
        getSavedCard(userToken)
    }, [])

    useEffect(() => {
        dispatch(SetinitialRouteName('Home'))
    }, [])

    const getSavedCard = async () => {
        dispatch(setloader(true))
        let res = null;
        res = await savedCard(userToken);
        if (res?.data?.status) {
            setsavedCardData(res?.data?.data)
            dispatch(setloader(false))
        } else {
            setTimeout(() => {
                dispatch(setloader(false))

            }, 500);
            AppUtils.showToast(res?.data?.message)
        }
    }

    const userDeleteCard = async (userToken, card_token) => {
        dispatch(setloader(true))
        let res = null;
        res = await deleteUserCard(userToken, card_token);
        if (res?.data?.status) {
            getSavedCard()
            setTimeout(() => {
                dispatch(setloader(false))

            }, 500);
            AppUtils.showToast(res?.data?.message)
        } else {
            setTimeout(() => {
                dispatch(setloader(false))

            }, 500);
            AppUtils.showToast(res?.data?.message)
        }
    }
    const { createToken } = useStripe();
    const handleCardAdded = () => {
        getSavedCard(userToken);
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                hidebackArrow={true}
                title={localization?.appkeys?.AddCard}
                onPressBack={() => { navigation.navigate(AppRoutes.AddCard) }}
            />
            <PaymentScreen>
                {
                    savedCardData?.length > 0 ? (
                        <View style={styles.cardTopView}>
                            <Text style={[styles.saveCardstyle, { color: colors.text, }]}>{localization?.appkeys?.savedcards}</Text>
                            {
                                savedCardData.length === 1 ? (
                                    <View style={{ alignSelf: 'center', width: wp(90), height: wp(50), marginTop: 15 }}>
                                        <CardView
                                            index={0}
                                            item={savedCardData[0]}
                                            onpressCancel={() => {
                                                setShowCancel(false);
                                            }}
                                            onpressEdit={() => {
                                                navigation.navigate(AppRoutes.AddCard);
                                            }}
                                            onPressDelete={() => {
                                                setShowCancel(true);
                                                setselectedID(savedCardData[0]?.id);
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <Carousel
                                        loop={false}
                                        width={width - 32}
                                        height={width / 1.8}
                                        data={savedCardData}
                                        scrollAnimationDuration={1000}
                                        onSnapToItem={(index) => console.log('current index:', index)}
                                        mode="parallax"
                                        modeConfig={{
                                            parallaxScrollingScale: 0.8,
                                            parallaxScrollingOffset: 100,
                                        }}
                                        renderItem={({ item, index }) => (
                                            <CardView index={index}
                                                item={item}
                                                onpressCancel={() => {
                                                    setShowCancel(false)
                                                }}
                                                onpressEdit={() => {
                                                    navigation.navigate(AppRoutes.AddCard)
                                                }}
                                                onPressDelete={() => {
                                                    setShowCancel(true)
                                                    setselectedID(item?.id)
                                                }} />
                                        )}
                                    />
                                )
                            }

                        </View>
                    ) : (
                        <View style={styles.noCardView}>
                            <Text style={[styles.noCardTxt, { color: colors.text }]}>{localization?.appkeys?.NoCard}</Text>
                        </View>
                    )
                }
            </PaymentScreen>
            <View style={[styles.continueButtonView, { bottom: savedCardData?.length == 0 ? 40 : 120 }]}>
                <CustomBtn
                    onPress={() => {
                        navigation.navigate(AppRoutes.AddCard)
                    }}
                    titleTxt={localization?.appkeys?.AddNewCard}
                />
            </View>
            {
                savedCardData?.length > 0 &&
                <View style={styles.continueButtonView}>
                    <CustomBtn
                        onPress={() => {
                            navigation.navigate(AppRoutes.SelectCategories)
                        }}
                        titleTxt={localization?.appkeys?.continue}
                    />
                </View>
            }
            <DeleteCardModal
                isVisible={showCancel}
                onBackDropPress={() => { setShowCancel(false) }}
                onYesPrss={() => {
                    setShowCancel(false)
                    userDeleteCard(userToken, selectedID)
                }}
                onpressDeleteCard={userDeleteCard}
            />
        </SafeAreaView>
    )
}

export default SavedCard

const useStyles = () => StyleSheet.create({
    cardTopView: {
        marginHorizontal: 24,
        alignSelf: 'center'
    },
    noCardView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: hp(35)
    },
    noCardTxt: {
        fontFamily: AppFonts.SemiBold,
        fontSize: 24
    },
    addButtonView: {
        bottom: 120,
        position: 'absolute',
        width: "100%"
    },
    continueButtonView: {
        bottom: 40,
        position: 'absolute',
        width: "100%"
    },
    saveCardstyle: {
        fontSize: 18,
        fontFamily: AppFonts.SemiBold,
        marginBottom: -10
    },
    saveCardTxt: {
        fontSize: 14,
        fontFamily: AppFonts.Medium,
        marginTop: 2
    },
})