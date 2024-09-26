import React, { useContext } from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AppUtils from '../../utils/appUtils';
import { LocalizationContext } from '../../localization/localization';
import { useTheme } from '@react-navigation/native';
import AppFonts from '../../constants/fonts';

const CustomImagePickerModal = props => {
  const { colors, images } = useTheme();
  const { localization } = useContext(LocalizationContext);

  const openGallery = () => {
    try {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        mediaType: "photo",
      }).then(image => {
        props.attachments(image);
        props.pressHandler();
      });
    } catch (error) {
      AppUtils.showToast(error?.message ?? "Error")
    }
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: false,
    }).then(image => {
      props.attachments(image);
      props.pressHandler();
    });
  };

  return (
    <Modal
      visible={props.visible}
      animationType="fade"
      transparent={true}
      {...props}>
      <View style={styles.modalScreen}>
        <Image source={images.bgGrad}  style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: 0.7 }} />
        <View style={styles.modalContanier}>
          <View style={styles.pickerContanier}>
            <Text style={[styles.chooseMedia,{color:colors.text}]}>{localization.appkeys.uploadPic}</Text>
          </View>
          <Pressable onPress={props.pressHandler} style={{position:'absolute',top:8,right:8,width:24,height:24}}>
          <Image style={{width:24,height:24}} source={images.cancel}/>
          </Pressable>
          <View style={styles.optionsContanier}>
            <TouchableOpacity onPress={() => openCamera()}>
              <View style={{width:60,height:60,borderWidth:2,borderColor:'black',borderRadius:30,justifyContent:'center'}}>
                <Image source={images.camera} style={{width:24,height:24,alignSelf:'center',resizeMode:'contain'}}/>
                </View>
              <Text style={[styles.options,{color:colors.text}]}>{localization.appkeys.camera}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openGallery()}>
              <View style={{width:60,height:60,borderWidth:2,borderColor:'black',borderRadius:30,justifyContent:'center'}}>
                <Image source={images.image} style={{width:24,height:24,alignSelf:'center',resizeMode:'contain'}}/>
                </View>
              <Text style={[styles.options,{color:colors.text}]}>{localization.appkeys.gallery}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContanier: {
    backgroundColor: 'white',
    height: 180,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,borderRadius:12
  },
  chooseMedia: {
    fontSize: 20,
    fontFamily: AppFonts.Medium, alignSelf: 'center'
  },
  options: {
    fontSize: 12,
    fontFamily:AppFonts.Medium,
    // color: '#2F6A98',
    alignSelf:'center',marginTop:4
  },
  optionsContanier: {
    flexDirection: 'row',
    width:'70%',alignSelf:'center',marginTop:12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerContanier: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomImagePickerModal;
