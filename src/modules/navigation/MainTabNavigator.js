import * as React from 'react';
import {useState, createRef} from 'react';
import { Text, View, Image, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../styles';

import tabNavigationData from './tabNavigationData';
import NotificationScreen from '../notifications/NotificationView';
import AsyncStorage from '@react-native-community/async-storage';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const [userid, setUserId] = useState('');
  const [noticount, setNotiCount] = useState('');
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem('user_id');
      
      if(id !== null) {
        //console.log(value);
        setUserId(id);
        fetch(global.apiurl+'getnoticount&id='+userid,{
          method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson.details);
        setNotiCount(responseJson.details);
      })
      .catch((error) => {
          console.error(error);
      });
        
      }
    } catch(e) {
      // error reading value
    }
  }
  getData();

  return (
    <Tab.Navigator tabBarOptions={{style: {height: Platform.OS === 'ios' ? 90 : 60}}}>
      {tabNavigationData.map((item, idx) => (
        <Tab.Screen 
          key={`tab_item${idx+1}`}
          name={item.name}
          component={item.component}
          options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarItemContainer}>
              <Image
                resizeMode="contain"
                source={item.icon}
                style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}
              />
            </View>
          ),
          tabBarLabel: ({ focused }) => <Text style={{ fontSize: 12, fontFamily:'Poppins-Regular',color: focused ? colors.primary : colors.gray }}>{item.name}</Text>,     
          tabBarBadge: ((item.name == "Notifications" && noticount != 0) ? noticount : undefined),
          headerShown: false 
          
        }}
        />        
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomWidth: 2,
    borderBottomColor: colors.white,
    // paddingHorizontal: 10,
    // bottom: Platform.OS === 'ios' ? -5 : 0,
    marginTop:10
  },
  tabBarIcon: {
    width: 23,
    // height: 23,
  },
  tabBarIconFocused: {
    tintColor: colors.primary,
  },
});
