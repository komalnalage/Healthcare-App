import { useTheme } from "@react-navigation/native";
import React, { useContext, useRef, useState } from "react";
import { View, StyleSheet, Text, Image, FlatList, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import { hp, wp } from "../../utils/dimension";
import PageControl from "react-native-page-control";
import Loader from "../modals/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setIntro } from "../../redux/Reducers/userData";

function Walkthrough({ navigation }) {
  const dispatch = useDispatch();
  const { colors, images } = useTheme();
  const [loading, setLoading] = useState(false);
  const loader = useSelector((state) => state.userNewData.loader);

  const { localization } = useContext(LocalizationContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  let flatRef = useRef(null)

  let data = [
    { title: localization?.appkeys?.welcome, subtitle: localization?.appkeys?.toHopeHelpline, descrip: localization?.appkeys?.lorem, img: images.w1 },
    { title: localization?.appkeys?.Ask, subtitle: localization?.appkeys?.aTherapistOnline, descrip: localization?.appkeys?.lorem, img: images.w2 },
    { title: localization?.appkeys?.Health, subtitle: localization?.appkeys?.InYourHands, descrip: localization?.appkeys?.lorem, img: images.w3 }
  ]

  let onScrollEnd = (e) => {
    let pageNumber = Math.min(Math.max(Math.floor(e.nativeEvent.contentOffset.x / Dimensions.get('window').width + 0.5), 0), 3);
    setCurrentIndex(pageNumber)
  }

  return (
    <SolidView
      
      view={
        <View style={style.mainView}>
           {loader && <Loader/>}
          <Text
            onPress={() => {
              dispatch(setIntro("done"))
              // AsyncStorage.setItem("intro","done")
              navigation.navigate(AppRoutes.Welcome)}}
            style={[style.titleText, { color: colors.text, marginRight: 16 }]}>
            {localization.appkeys.skip}
          </Text>
          <View style={style.flatlistView}>
            <FlatList
              ref={flatRef}
              onMomentumScrollEnd={onScrollEnd}
              keyExtractor={(item, index) => index.toString()}
              data={data}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <View style={style.topView} >
                    <View style={{ marginTop: 12 }}>
                      <Text
                        style={[style.firstTxt, { color: colors.btnColor, }]}>
                        {item.title}
                      </Text>
                      <Text
                        style={[style.subtitleTxt, { color: colors.text, }]}>
                        {item.subtitle}
                      </Text>

                      <Text
                        style={[style.discriptionTxt, {
                          color: colors.text,
                          // color: colors.walkthrough,
                        }]}>
                        {item.descrip}
                      </Text>
                    </View>
                    <Image style={style.imageView} source={item.img} />
                  </View>
                )
              }}
            />
          </View>
          <View style={[style.pagecontrolView, { borderColor: colors.btnColor, }]}>
            <PageControl
              indicatorSize={{ width: 15, height: 15 }}
              style={{ alignSelf: "center" }}
              numberOfPages={3}
              currentPage={currentIndex}
              hidesForSinglePage
              pageIndicatorTintColor={colors.indicatorColor}
              currentPageIndicatorTintColor="#26333B"
            />

            <Text
              onPress={() => {
                if (currentIndex < 2) {
                  setCurrentIndex(currentIndex + 1)
                  flatRef?.current?.scrollToIndex({ index: currentIndex + 1, animated: true })
                }
                else {
                  // AsyncStorage.setItem("intro","done")
                  dispatch(setIntro("done"))
                  navigation.navigate(AppRoutes.Welcome)
                }
              }}
              style={[style.titleText, { color: colors.text, alignSelf: 'center' }]}>
              {localization.appkeys.next}
            </Text>
          </View>
        </View>
      }
    />
  );
}

const style = StyleSheet.create({
  subtitleTxt: {
    fontSize: 26,
    fontFamily: AppFonts.SemiBold
  },
  pagecontrolView: {
    width: '90%',
    alignSelf: 'center',
    height: '10%',
    borderTopWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  imageView: {
    width: '100%',
    height: '68%',
    alignSelf: 'center',
    borderRadius: 12,
    resizeMode: 'stretch',
    marginBottom: 32
  },
  discriptionTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Regular,
    marginVertical: 12
  },
  topView: {
    width: wp(100),
    height: hp(80),
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  firstTxt: {
    fontSize: 26,
    fontFamily: AppFonts.SemiBold
  },
  flatlistView: {
    width: '100%',
    height: '85%'
  },
  mainView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  titleText: {
    fontSize: 16,
    alignSelf: "flex-end",
    lineHeight: 25,
    fontFamily: AppFonts.SemiBold,
    marginTop: 10
  },
  img: {
    width: 160, height: 160, resizeMode: 'contain', alignSelf: 'center'
  },
});
export default Walkthrough;
