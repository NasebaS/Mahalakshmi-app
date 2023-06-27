import { Provider } from 'react-redux';
import React from 'react';
import { View, ActivityIndicator, StyleSheet,ImageBackground,Dimensions } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './src/styles';

import { store, persistor } from './src/redux/store';

import AppView from './src/modules/AppViewContainer';
import AsyncStorage from '@react-native-community/async-storage';

const { width: screenWidth } = Dimensions.get('window');
import './global.js';
import reactNativeUiLib from 'react-native-ui-lib';
export default function App({navigation}) {
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <PersistGate
          loading={
            <View style={styles.container}>
               <ImageBackground
                source={require('./assets/images/dishanisplash.png')}
                style={styles.bgImage}
                resizeMode="cover"
                >
              <ActivityIndicator color={colors.red} />
              </ImageBackground>
            </View>
          }
          persistor={persistor}
        >
          <AppView />
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bgImage: {
    flex: 1,
    width:Dimensions.get('window').width,
    marginHorizontal: -20,
  },
});
