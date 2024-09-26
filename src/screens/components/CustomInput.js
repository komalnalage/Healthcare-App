import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import AppFonts from "../../constants/fonts";

export default function CustomInput({
  title,
  placeholder,
  rightImg,
  multiline,
  numberOfLines,
  textinputstyle,
  onEyePress,
  isSecure,
  keyboardType,
  onChangeText,
  value,
  countryCode,
  isPhone,
  countryPickerPress,
  onBlur,
  isErr,
  allCaptital,
  cardImg,
  yearTxt,
  maxLength,
  isEditable,
  marginTop
}) {
  const { colors, images } = useTheme();
  const theme = useColorScheme();
  return (
    <View>
      <Text style={[styles.title, { color: isErr ? 'red' : colors.text, marginTop:marginTop?marginTop: 20, }]}>{title}</Text>

      <View style={[styles.phoneView, { borderColor: isErr ? 'red' : colors.tabbordercolor }]}>
        {isPhone &&
          <Pressable
            onPress={countryPickerPress}
            style={styles.countryPickerPressView}>
            <Text
              style={[styles.countryCodeTxt, { color: colors.text }]}>
              {countryCode}
            </Text>
          </Pressable>
        }
        <TextInput
          multiline={multiline}
          value={value}
          autoCapitalize={allCaptital ? 'characters' : 'none'}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          onBlur={onBlur}
          numberOfLines={numberOfLines}
          keyboardType={isPhone ? 'phone-pad' : keyboardType}
          placeholderTextColor={"white"}
          placeholder={placeholder}
          maxLength={maxLength}
          editable={isEditable}
          style={[
            styles.textinput,
            { color: colors.text, paddingHorizontal: 12, width: isPhone ? "80%" : "90%" },
            textinputstyle,
          ]}
        />

        <Pressable
          onPress={onEyePress}
          style={{ alignSelf: 'center' }}
        >

          {
            cardImg ?
              <Image
                source={cardImg}
                style={styles.cardimage}
              /> :
              yearTxt ?
                <Text style={[styles.yearTxtStyle, { color: colors.text }]}>Yrs</Text> :
                <Image
                  source={rightImg}
                  style={[styles.eyeimage,{tintColor:colors.text}]}
                />
          }

        </Pressable>

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
   
    fontFamily: AppFonts.SemiBold,
    fontSize: 12,
    marginLeft: 12,
    marginBottom: 4,
  },
  countryCodeTxt: {
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: AppFonts.Regular,
  },
  countryPickerPressView: {
    width: '10%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderColor: 'white'
  },
  phoneView: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
    // marginTop: 2
  },
  textinput: {
    fontSize: 14,
    fontFamily: AppFonts.Regular,
    height: 50,
    // width: '90%'

  },
  eyeimage: { height: 18, width: 18, resizeMode: "contain", tintColor: 'black' },
  cardimage: { height: 24, width: 24, resizeMode: 'contain' },
  yearTxtStyle: {
    fontFamily: AppFonts.Medium,
    fontSize: 15
  },
});
