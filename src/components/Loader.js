// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import {StyleSheet, View, Modal, Image, ActivityIndicator} from 'react-native';

const Loader = (props) => {
  const {loading, ...attributes} = props;

  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      visible={loading}
      onRequestClose={() => {
        //console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <Image source={require('../../assets/images/pages/loader.gif')} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    // height: 100,
    // width: 100,
    marginTop:53,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    // height: 100,
    // width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});