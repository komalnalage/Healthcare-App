import {
    Text,
    View,
    StyleSheet,
    Pressable,
    Image,
    useColorScheme,
    Platform, SafeAreaView,
    Alert,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { LocalizationContext } from '../../localization/localization';
import Header from '../components/Header';
import { hp, wp } from '../../utils/dimension';
import AppFonts from '../../constants/fonts';
import CustomBtn from '../components/CustomBtn';
import AppRoutes from '../../routes/RouteKeys/appRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { addCard, savedCard, setDefault, deleteUserCard } from '../../api/Services/services';
import Loader from '../modals/Loader';
import AppUtils from '../../utils/appUtils';
import { CardForm, useStripe } from '@stripe/stripe-react-native';
import PaymentScreen from '../components/PaymentScreen';
import DeleteCardModal from '../modals/DeleteCardModal';
import { SetinitialRouteName, setloading } from '../../redux/Reducers/userData';
import { setloader } from '../../redux/Reducers/UserNewData';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const AddCard = ({ navigation }) => {
    const dispatch = useDispatch()
    const colorScheme = useColorScheme();
    const userData = useSelector((state) => state.userData.userData);
    const userToken = useSelector((state) => state.userData.token);
    const { colors } = useTheme()
    const { localization } = useContext(LocalizationContext);
    const [loading, setLoading] = useState(false);
    const loader = useSelector((state) => state.userNewData.loader);

    const styles = useStyles(colors, colorScheme);
    const [stripetoken, setStripeToken] = useState("")

    const [savedCardData, setsavedCardData] = useState([])
    const [showCancel, setShowCancel] = useState(false);
    const [selectedID, setselectedID] = useState("")


    useEffect(()=>{
            dispatch(SetinitialRouteName(AppRoutes.AddCard))
    },[])


    const getSavedCard = async () => {
        dispatch(setloader(true))
        let res = null;
        res = await savedCard(userToken);
        if (res?.data?.status) {
            setsavedCardData(res?.data?.data)
            setTimeout(() => {
                dispatch(setloader(false))

            }, 500);
        } else {
            setTimeout(() => {
                dispatch(setloader(false))

            }, 500);
            AppUtils.showToast(res?.data?.message)
        }
    }

    const setAsDetailtCard = async () => {
        setLoading(true)
        let res = null;
        res = await setDefault(token);
        if (res?.data?.status) {
            setLoading(false)
            AppUtils.showToast(res?.data?.message)
        } else {
            setLoading(false)
            AppUtils.showToast(res?.data?.message)
        }
    }


    const userDeleteCard = async (userToken, card_token) => {
        dispatch(setloader(true))
        let res = null;
        res = await deleteUserCard(userToken, card_token);
        if (res?.data?.status) {
            getSavedCard()
            dispatch(setloader(false))
            AppUtils.showToast(res?.data?.message)
        } else {
           
                dispatch(setloader(false))

            AppUtils.showToast(res?.data?.message)
        }
    }

    const buildTestTokenParams = (type) => {
        switch (type) {
            case 'Pii':
                return {
                    type: 'Pii',
                    personalId: '000000000',
                };
            case 'Card':
                return {
                    type: 'Card',
                    name: userData?.name ?? "",
                    currency: 'usd',
                };
            case 'BankAccount':
                return {
                    type: 'BankAccount',
                    accountNumber: '000123456789',
                    routingNumber: '110000000', // Routing number is REQUIRED for US bank accounts
                    country: 'US',
                    currency: 'usd',
                };
            default:
                throw new Error(`Unsupported token type`);
        }
    };

    const { createToken } = useStripe();
    const _createToken = async (type) => {
        dispatch(setloader(true))
        try {
            const { error, token } = await createToken(buildTestTokenParams(type));
            if (token) {
                setStripeToken(token)
                userAddCards(token?.id, userToken);

            }
            if (error) {
                dispatch(setloader(false))
                Alert.alert(`Error code: ${error.code}`, error.message);
            } else if (token) {
                dispatch(setloader(false))
                // Alert.alert(
                //   'Success',
                //   `The token was created successfully! token: ${token.id}`
                // );
            }
        } catch (error) {
            dispatch(setloader(false))
            console.log('Error creating token:', error.message);
        }
    };

    const userAddCards = async (cardToken, userToken) => {
      //  dispatch(setloader(true))
        let res = null;
        res = await addCard(cardToken, userToken);
        if (res?.data?.status) {
            dispatch(setloader(false))
            setTimeout(() => {
                navigation.navigate(AppRoutes.SavedCard)
            }, 100);

            AppUtils.showToast(res?.data?.message)
        } else {
            setTimeout(() => {
                dispatch(setloader(false))

            }, 100);
            AppUtils.showToast(res?.data?.message)
        }
    }



    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loader && <Loader />}
            <Header
            onPressBack={()=>{navigation.navigate(AppRoutes.SelectCategories)}}
                hidebackArrow={false}
                title={localization?.appkeys?.AddCard}
            />
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

            <KeyboardAwareScrollView >
         
                <View onTouchEnd={()=>{Keyboard.dismiss()}} style={styles.container}>
                    <View onTouchEnd={()=>{Keyboard.dismiss()}} style={styles.cardFormContainer}>
                        <CardForm
                        
                            style={{ flex: 1 }}
                            cardStyle={{
                                textColor: colorScheme === 'dark' ? "white" : "black",
                                placeholderColor: colorScheme === 'dark' ? "white" : "black",
                                borderRadius: 8,
                                backgroundColor: colorScheme === 'dark' ? "black" : null,

                            }}
                            onCardChange={(cardDetails) => {
                            }}
                        />
                    </View>

                </View>
                
                <View style={styles.updateButtonView}>
                    <CustomBtn
                        onPress={() => {
                                _createToken('Card')
                        }}
                        titleTxt={localization.appkeys.Add}
                    />
                </View>
           
            </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
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

export default AddCard

const useStyles = (colors, colorScheme) => StyleSheet.create({
    iAcceptTxt: {
        fontSize: 12,
        fontFamily: AppFonts.Regular,
        marginTop: 2
    },
    acceptTopView: {
        flexDirection: 'row',
        margin: 8,
        marginTop: 0,
        marginHorizontal: 24,
        width:"30%"
    },
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 0,
        justifyContent: 'center',
    },
    updateButtonView: {
        marginTop: hp(10),
        bottom: 40
    },
    acceptImg: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        marginRight: 8
    },
    cardFormContainer: {
        height: Platform.OS == "ios" ? 210 : 300,
        width: '100%',
        backgroundColor: colorScheme === 'dark' ? "black" : "white",
        borderRadius: 15,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        padding: 20,
        marginBottom: 20,
    },
})