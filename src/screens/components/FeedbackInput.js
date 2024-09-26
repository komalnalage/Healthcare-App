import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import React, { useRef } from 'react'
import { hp, wp } from '../../utils/dimension';
import AppFonts from '../../constants/fonts';
import { useTheme } from '@react-navigation/native';

const FeedbackInput = ({ title, value, onChangeText, isErr, customWidth }) => {
  const { colors } = useTheme()
  const textInputRef = useRef(null);
  const handleFocus = () => {
    textInputRef?.current?.focus()
  }
  return (
    <View>
      <Text style={[styles.titleTxt, {
        color: colors.text
      }]}>{title}</Text>
      <Pressable
        onPress={() => handleFocus()}
        style={[styles.textBriefView, { borderColor: isErr ? 'red' : colors.tabbordercolor, borderWidth: 2, width: customWidth ?? wp(92), backgroundColor: colors.feedbackTxtinputColor, }]}>
        <TextInput
          ref={textInputRef}
          value={value}
          style={{
            textAlignVertical: 'top',
            padding: 0,
            paddingVertical: 5,colors:"black"
          }}
          multiline={true}
          onChangeText={onChangeText}
        />
      </Pressable>
    </View>
  )
}

export default FeedbackInput

const styles = StyleSheet.create({
  textBriefView: {
    marginHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 2,
    height: hp(18),
    paddingVertical: Platform.OS == "ios" ? 10 : 0,
  },
  titleTxt: {
    fontSize: 12,
    fontFamily: AppFonts.SemiBold,
    marginLeft: 28,
    marginBottom: 4,
  },
})