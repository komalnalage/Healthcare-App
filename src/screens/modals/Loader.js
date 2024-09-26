import { useTheme } from '@react-navigation/native';
import React from 'react';
import {Modal, StyleSheet, View, ActivityIndicator} from 'react-native';


const Loader = props => {
    const { colors } = useTheme();
  return (
    <Modal
      visible={props.visible}
      animationType="fade"
      transparent={true}
      {...props}>
      <View style={styles.modalScreen}>
        <ActivityIndicator size={'large'} color={colors.text} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalScreen: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Loader;