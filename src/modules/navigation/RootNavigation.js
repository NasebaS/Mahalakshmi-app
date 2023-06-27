import 'react-native-gesture-handler';
import React from 'react';
import {useState, createRef} from 'react';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { Image, StyleSheet, TouchableOpacity, Button, View, Text } from 'react-native';
import { Card,Icon} from 'react-native-elements';
import StackNavigationData from './stackNavigationData';
import AsyncStorage from '@react-native-community/async-storage';
const Stack = createStackNavigator();
import { useNavigation } from '@react-navigation/native'

export default function NavigatorView(props) {
  // if (authState.isLoggedIn || authState.hasSkippedLogin) {
  //     return <AppNavigator />;
  // }
  // return <AuthScreen />;
  const [userid, setUserId] = useState(null);
  const [cartcount, setNotiCount] = useState(0);
  
  const headerLeftComponentMenu = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.toggleDrawer()}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Image
          source={require('../../../assets/images/drawer/menu.png')}
          resizeMode="contain"
          style={{
            height: 20,
          }}
        />
      </TouchableOpacity>    
    )
  }
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem('user_id');
      
      if(id !== null) {
        //console.log(value);
        setUserId(id);
        fetch(global.apiurl+'getcartdetailscount&id='+id,{
          method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.details);
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
  const headerRightComponentMenu = () => {
    return (
      <View style={{marginRight:15,padding:15}}>
      <Icon
        name='shopping-cart'
        type='feather'
        color='#fff'
        onPress={() => props.navigation.navigate('Cart') }
        />
        {(cartcount != null && cartcount!= 0) ? (
        <Text style={styles.HeaderRightBadge}> {cartcount !=null ? ( cartcount ) : 0}</Text>
        ) : null }
      </View>  
    )
  }
  function getHeaderTitle(route) {
    console.log(route);
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : route.params?.screen || route.name;
    return routeName;
  }
  
  return (
    <Stack.Navigator initialRouteName={(userid != null) ? "Home" : "Login"} >
      {StackNavigationData.map((item, idx) => (
        <Stack.Screen
          key={`stack_item-${idx+1}`}
          name={item.name} 
          component={item.component} 
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerShown: (item.name == 'Login') ? false : true,
            gesturesEnabled:false,
            headerLeft: item.headerLeft || headerLeftComponentMenu,
            headerRight: (item.headerRight != null) ?  headerRightComponentMenu :  null,
            headerBackground: () => (
              <Image style={styles.headerImage} source={item.headerBackground.source} />
            ),
            headerTitleStyle: item.headerTitleStyle,
          })} 
        />
      ))}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100 + '%',
    height: Header.height,
  },
  HeaderRightBadge: {
    backgroundColor:'red',
    color:'#fff',
    borderRadius:50,
    height:20,
    width:20,
    textAlign:'center',
    paddingRight:3,
    paddingLeft:3,
    position:'absolute',
    right:5,
    bottom:12
  }
});
