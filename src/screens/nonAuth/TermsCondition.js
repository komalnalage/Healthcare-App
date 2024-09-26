import {
    ScrollView,
    StyleSheet,
    View,
    useWindowDimensions
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { hp, wp } from '../../utils/dimension'
import RenderHtml from 'react-native-render-html';
import Header from '../components/Header'
import { LocalizationContext } from '../../localization/localization';
import SolidView from '../components/SolidView';
import { getTermsAndConditons } from '../../api/Services/services';
import Loader from '../modals/Loader';
import { useTheme } from '@react-navigation/native';
import { setdrawerSelectedTab, setloader } from '../../redux/Reducers/UserNewData';
import { useDispatch, useSelector } from 'react-redux';
import { setloading } from '../../redux/Reducers/userData';

const TermsCondition = ({ navigation }) => {
    let dispatch = useDispatch();
    const { colors } = useTheme()
    const { width } = useWindowDimensions();
    const { localization } = useContext(LocalizationContext);
    const [privacyPolicyData, setprivacyPolicyData] = useState({})
    const loader = useSelector((state) => state.userNewData.loader);


    useEffect(() => {
        getTerms();
        dispatch(setdrawerSelectedTab("Terms & Conditions"))
    }, []);


    const tagsStyles = {
        body: {
            color: colors.text
        },
        p: {
            margin: '0px',
            padding: '0px',
            lineHeight: '20px',
            fontSize: '14px',
            fontWeight: '400'
        },
        ul: {
            marginTop: '0px',
            marginBottom: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'baseline'
        },
        li: {
            display: 'inline-block',
            lineHeight: '20px',
            fontWeight: '400',
            paddingBottom: '0px',
            margin: '0px'
        }
    }
    const tagStyle = {
        li: {
            color: 'black',
            fontSize: 12
        },
    }


    const classesStyles = {
        'ql-indent-1': {
            marginLeft: '22px'
        },
        'ql-indent-2': {
            marginLeft: '44px'
        },
        'ql-indent-3': {
            marginLeft: '66px'
        },
        'ql-indent-4': {
            marginLeft: '88px'
        },
        'ql-indent-5': {
            marginLeft: '110px'
        },
        'ql-indent-6': {
            marginLeft: '132px'
        }
    }
    const getTerms = async () => {
       dispatch(setloader(true))
        const res = await getTermsAndConditons()
        if (res?.data?.status) {
             setTimeout(() => {
                dispatch(setloader(false))

      }, 500);
            setprivacyPolicyData(res?.data?.data?.text_data)
        }
        else {
             setTimeout(() => {
                dispatch(setloader(false))

      }, 500);
        }
    }

    const source = {
        html: privacyPolicyData
    };
    return (
        <SolidView
            
            view={
                <View style={{ flex: 1 }}>
                     {loader && <Loader/>}
                    <Header
                        title={localization?.appkeys?.TermsConditions}
                        onPressBack={() => { navigation.goBack() }}
                    />
                    <ScrollView
                    
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.mainView}>
                            <RenderHtml
                                contentWidth={width}
                                source={source}
                                baseStyle={styles.styleText}
                                tagsStyles={tagStyle}
                                classesStyles={classesStyles}

                            />
                        </View>
                    </ScrollView>
                </View>
            }
        />

    )
}

export default TermsCondition

const styles = StyleSheet.create({
    mainView: {
        width: wp(90),
        justifyContent: 'center',
        marginTop: hp(2),
        backgroundColor: "#F4FDFC",
        borderRadius: 10,
        marginVertical: 40,
        alignSelf: 'center',
        padding: 10
    },
    styleText: {
        fontSize: 14,
        color: "#000000",
        lineHeight: 24,

    }
})