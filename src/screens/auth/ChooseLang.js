import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../localization/localization";
import AppRoutes from "../../routes/RouteKeys/appRoutes";
import CustomBtn from "../components/CustomBtn";
import SolidView from "../components/SolidView";
import AppFonts from "../../constants/fonts";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../constants/variables";
import { setLanguageCode } from "../../redux/Reducers/userData";
import Loader from "../modals/Loader";

function ChooseLang({ navigation }) {
  const { initializeAppLanguage, setAppLanguage } =
    useContext(LocalizationContext);
  const { colors, images } = useTheme();
  const loader = useSelector((state) => state.userNewData.loader);
  const [value, setValue] = useState("English");
  const [isFocus, setIsFocus] = useState(false);
  const { localization } = useContext(LocalizationContext);
  const [language, setlanguage] = useState("");
  const dispatch = useDispatch();
  const data = [
    { label: "English", value: "English" },
    { label: "Spanish", value: "Spanish" },
    { label: "French", value: "French" },
  ];

  useEffect(() => {
    AsyncStorage.getItem("Langauge", (err, language) => {
      if (language == "Spanish") {
        setlanguage("sp");
        setValue("Spanish");
      } else if (language == "French") {
        setlanguage("fr");
        setValue("French");
      } else {
        setlanguage("en");
        setValue("English");
      }
    });
  }, []);

  const handlelanguage = (item) => {
    setValue(item.value);
    setIsFocus(false);
    if (item.value == "Spanish") {
      setAppLanguage(strings?.spanish);
      setlanguage("sp");
      dispatch(setLanguageCode("es"));
      AsyncStorage.setItem("Langauge", strings?.spanish);
    } else if (item.value == "French") {
      setAppLanguage(strings?.french);
      setlanguage("fr");
      dispatch(setLanguageCode("fr"));
      AsyncStorage.setItem("Langauge", strings?.french);
    } else {
      setAppLanguage(strings?.english);
      setlanguage("en");
      dispatch(setLanguageCode("en"));
      AsyncStorage.setItem("Langauge", strings?.english);
    }
  };

  return (
    <SolidView
      view={
        <View style={style.mainView}>
          {loader && <Loader />}
          <View>
            <Image source={images.darkLogo} style={style.img} />
            <Text style={[style.titleText, { color: colors.text }]}>
              {localization.appkeys.chooseLang}
            </Text>

            <Text style={[style.pleaseSelectLangTxt, { color: colors.text }]}>
              {localization.appkeys.pleaseSelectLang}
            </Text>
            <Dropdown
              style={[style.dropdown, { borderColor: colors.tabbordercolor }]}
              selectedTextStyle={[
                style.selectedTextStyle,
                { color: colors.text },
              ]}
              iconStyle={style.iconStyle}
              activeColor="#310B831A"
              containerStyle={[style.containerStyle]}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={value}
              dropdownPosition={"bottom"}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={handlelanguage}
              itemTextStyle={{ color: "black" }}
              renderLeftIcon={() => {
                if (value == "Spanish") {
                  return <Image source={images.spanish} style={style.flag} />;
                } else if (value == "French") {
                  return <Image source={images.french} style={style.flag} />;
                } else {
                  return <Image source={images.english} style={style.flag} />;
                }
              }}
              renderRightIcon={() => {
                return isFocus == true ? (
                  <Image
                    source={images.upArrow}
                    style={[style.arrow, { tintColor: colors.btnColor }]}
                  />
                ) : (
                  <Image
                    source={images.downArrow}
                    style={[style.arrow, , { tintColor: colors.btnColor }]}
                  />
                );
              }}
            />
          </View>
          <CustomBtn
            onPress={() => {
              navigation.navigate(AppRoutes.Walkthrough);
            }}
            titleTxt={localization.appkeys.next}
          />
        </View>
      }
    />
  );
}

const style = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  pleaseSelectLangTxt: {
    fontFamily: AppFonts.SemiBold,
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 22,
    marginTop: 20,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 30,
    fontFamily: AppFonts.Medium,
  },
  img: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    alignSelf: "center",
  },
  dropdown: {
    height: 60,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 4,
    width: "92%",
    alignSelf: "center",
  },
  iconStyle: {
    marginRight: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
    // color: "#202020",
    fontFamily: AppFonts.Medium,
  },
  containerStyle: {
    backgroundColor: "white",
    borderRadius: 10,
    // marginTop: 10,
    borderWidth: 2,
    borderColor: "grey",
  },
  flag: {
    height: 30,
    width: 30,
    // marginTop: 5,
    marginLeft: 10,
    marginRight: 20,
    resizeMode: "contain",
  },
  arrow: {
    width: 14,
    height: 14,
    resizeMode: "contain",
    marginRight: 8,
  },
});
export default ChooseLang;
