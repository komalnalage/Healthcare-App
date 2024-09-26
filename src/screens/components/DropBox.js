import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useCallback, useContext, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AppFonts from "../../constants/fonts";
import { LocalizationContext } from "../../localization/localization";
import ModalDropdown from "react-native-modal-dropdown";

export default function DropBox({ onChange, availabilityData,defaultValue,defaultValue1,onSelect,onSelect1 }) {
  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);

  useEffect(
    () => {
      setweekDays(availabilityData);
      onChange(availabilityData);
    }, [availabilityData]
  );

  const data = [
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "24:00",
  ];
  const [weekDays, setweekDays] = useState([
    {
      value: 1,
      day: "Sunday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 2,
      day: "Monday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 3,
      day: "Tuesday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 4,
      day: "Wednesday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 5,
      day: "Thursday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 6,
      day: "Friday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
    {
      value: 7,
      day: "Saturday",
      selected: false,
      start_time: "_",
      end_time: "_",
      slots: [],
    },
  ]);

  const Item = ({ item, indexx, onPress }) => {
    const [isFocus, setIsFocus] = useState(false);
    return (
      // <View>
        <View style={styles.openingView}>
          {/* <View> */}
            <ModalDropdown
            
            onSelect={(i,j)=>{ onSelect(j),console.log(i,j);}}
              dropdownTextStyle={[
                styles.placeholderStyle,
                { color: colors.text, width: widthPercentageToDP(22) },
              ]}
              defaultValue={defaultValue}
              textStyle={[
                styles.placeholderStyle,
                {
                  color: colors.text,
                  fontSize: 12,
                  fontFamily: AppFonts.Medium,
                },
              ]}
              defaultTextStyle={[
                styles.selectedTextStyle,
                {
                  color: colors.text,
                  height: "100%",
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                },
              ]}
              style={[
                styles.dropdown,
                isFocus && { borderColor: colors.tabbordercolor },
                { backgroundColor: colors.btnColor },
              ]}
              options={data}
            />
          {/* </View> */}
      
          {/* <View style={{}}> */}
            <ModalDropdown
            
              onSelect={(i,j)=>{ onSelect1(j),console.log(i,j);}}
              dropdownTextStyle={[
                styles.placeholderStyle,
                { color: colors.text, width: widthPercentageToDP(22) },
              ]}
              defaultValue={defaultValue1}
              textStyle={[
                styles.placeholderStyle,
                {
                  color: colors.text,
                  fontSize: 13,
                  fontFamily: AppFonts.Medium,
                },
              ]}
              defaultTextStyle={[
                styles.selectedTextStyle,
                {
                  color: colors.text,
                  height: "100%",
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                },
              ]}
              style={[
                styles.dropdown,
                isFocus && { borderColor: colors.tabbordercolor },
                { backgroundColor: colors.btnColor,marginLeft:20 },
              ]}
              options={data}
            />
          {/* </View> */}
        </View>
      // </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.dropMainView}>
        <Item item={"item.item"} indexx={1} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dayTxt: {
    fontSize: 14,
    fontFamily: AppFonts.SemiBold,
  },
  openingView: {
    // justifyContent: "space-between",
    //marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor:"white"
  },
  arrowdownImage: {
    height: heightPercentageToDP(3),
    width: widthPercentageToDP(3),
    resizeMode: "contain",
  },
  containerStyle: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "grey",
  },
  dropdown: {
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    width: widthPercentageToDP(30),
   // alignItems: "center",
    justifyContent: "center",
    // marginTop: 5
  },
  icon: {
    marginRight: 5,
  },
  weekView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 12,
    fontFamily: AppFonts.Regular,
  },
  selectedTextStyle: {
    fontSize: 11,
    fontFamily: AppFonts.Medium,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  hourTxt: {
    fontSize: 12,
    fontFamily: AppFonts.Medium,
  },
  dropMainView: {
    //  marginTop: 15,
    // paddingHorizontal: 18,
    //   paddingVertical: 14,
    // backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
    width: "99%",
    alignSelf: "center",
    marginBottom: 10,
  },
});
