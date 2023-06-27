import * as React from 'react';
import {useState, createRef} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {StackActions} from '@react-navigation/native';
import { 
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import RNRestart from 'react-native-restart'; // Import package from node modules
import NavigatorView from './RootNavigation';
import AvailableInFullVersion from '../../modules/availableInFullVersion/AvailableInFullVersionViewContainer';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';

const iconHome = require('../../../assets/images/pages/home.png');
const iconCalendar = require('../../../assets/images/drawer/calendar.png');
const iconGrids = require('../../../assets/images/drawer/grids.png');
const iconPages = require('../../../assets/images/drawer/pages.png');
const iconShop = require('../../../assets/images/pages/shop.png');
const iconOrder = require('../../../assets/images/icons/orders.png');
const iconComponents = require('../../../assets/images/drawer/components.png');
const iconSettings = require('../../../assets/images/drawer/settings.png');
const iconBlog = require('../../../assets/images/drawer/blog.png')
const iconAccount = require('../../../assets/images/pages/profile.png');
const iconcate = require('../../../assets/images/pages/category.png');
const iconcart = require('../../../assets/images/pages/cart.png');
const iconresel = require('../../../assets/images/pages/reseller.png');

const drawerData = [
  {
    name: 'Home',
    icon: iconHome,
  },
  {
    name: 'Category',
    icon: iconPages,
  },{
    name: 'Shop',
    icon: iconShop,
  },
  {
    name: 'Become a Reseller',
    icon: iconPages,
  },
  {
    name: 'Login',
    icon: iconPages,
  },
  {
    name: 'Product',
    icon: iconGrids,
  }, 
  {
    name: 'Orders',
    icon: iconOrder,
  },
  // {
  //   name: 'Pages',
  //   icon: iconPages,
  // },
  {
    name: 'Account',
    icon: iconAccount,
  },
 
];

const Drawer = createDrawerNavigator();
function CustomDrawerContent(props) {
  const [userid, setUserId] = useState('');
  const [username, setUserName] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [usertype, setUserType] = useState('');
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem('user_id');
      const username = await AsyncStorage.getItem('user_name');
      const useremail = await AsyncStorage.getItem('user_email');
      const usertype = await AsyncStorage.getItem('user_type');
      if(id !== null) {
        //console.log(value);
        setUserId(id);
        setUserName(username);
        setUserEmail(useremail);
        setUserType(usertype);
      }
    } catch(e) {
      // error reading value
    }
  }
  getData();
  const deletedata = async () => {
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('user_name');
    await AsyncStorage.removeItem('user_email');
    await AsyncStorage.removeItem('user_type');
    setUserId('');
    setUserName('');
    setUserEmail('');
    setUserType('');
    props.navigation.navigate('Login');
  }
  return (
    
    <DrawerContentScrollView {...props} style={{padding: 0, backgroundColor:'#04a3d3'}}>
      {userid != '' ? (
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={require('../../../assets/images/drawer/user.png')}
        />
        <View style={{ paddingLeft: 15, width:'70%' }}>
          <Text style={styles.userName}>{username}</Text>
          <Text style={{ color: 'white', width:'100%' }}>{useremail}</Text>
        </View>
      </View>
      ): null}
    {userid != '' ? (
      <View style={styles.divider} />
      ): null}
      {/* {userid == '' ? (
      <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Image
                style={{ width: 20, height: 20}}
                source={iconPages}
              />
              <Text style={styles.menuTitle}>Login</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Login')}
        />
        ): null} */}
        <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Icon
                size={16}
                name='home'
                type='font-awesome'
                color='#fff'
                onPress={() => console.log('hello')} 
              />
              <Text style={styles.menuTitle}>Home</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Home')}
        />
        <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Icon
                size={16}
                name='list-alt'
                type='font-awesome'
                color='#fff'
                onPress={() => console.log('hello')} 
              />
              <Text style={styles.menuTitle}>Category</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Category')}
        />
        {/* <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Image
                style={{ width: 20, height: 20}}
                source={iconShop}
              />
              <Text style={styles.menuTitle}>Shop</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Shop')}
        /> */}
        {usertype != 'RESELLER' ? (
        <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Image
                style={{ width: 20, height: 20}}
                source={iconresel}
              />
              <Text style={styles.menuTitle}>Become a Reseller</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Become a Reseller')}
        />
        ): null}
        {usertype == 'RESELLER' ? (
        <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Icon
                size={16}
                name='sitemap'
                type='font-awesome'
                color='#fff'
                onPress={() => console.log('hello')} 
              />
              <Text style={styles.menuTitle}>My Wallet</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('My Wallet')}
        />
        ): null}
        {/* <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Image
                style={{ width: 20, height: 20}}
                source={iconGrids}
              />
              <Text style={styles.menuTitle}>Product</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Product')}
        /> */}
         <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Icon
                size={16}
                name='shopping-basket'
                type='font-awesome'
                color='#fff'
                onPress={() => console.log('hello')} 
              />
              <Text style={styles.menuTitle}>Orders</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Orders')}
         />
         <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Icon
                size={16}
                name='shopping-cart'
                type='font-awesome'
                color='#fff'
                onPress={() => console.log('hello')} 
              />
              <Text style={styles.menuTitle}>My Cart</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Cart')}
         />
        {userid != '' ? (
         <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              {/* <Image
                style={{ width: 20, height: 20}}
                source={iconAccount}
              /> */}
              <Icon
                size={16}
                name='user'
                type='font-awesome'
                color='#fff'
                onPress={() => console.log('hello')} 
              />
              <Text style={styles.menuTitle}>My Account</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('My Profile')}
        />
        ): null}
         <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              {/* <Image
                style={{ width: 20, height: 20}}
                source={iconcart}
              /> */}
              <Icon
                size={16}
                name='whatsapp'
                type='font-awesome'
                color='#fff'
                onPress={() => console.log('hello')} 
              />
              <Text style={styles.menuTitle}>Contact US</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Contact Us')}
         />
         {userid != '' ? (
         <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              {/* <Image
                style={{ width: 20, height: 20}}
                source={iconPages}
              /> */}
              <Icon
                size={16}
                name='sign-out'
                type='font-awesome'
                color='#fff'
                onPress={() => console.log('hello')} 
              />
              <Text style={styles.menuTitle}>Logout</Text>
            </View>
          )}
          onPress={deletedata}
        />
        ): null}
         {/* <DrawerItem
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Image
                style={{ width: 20, height: 20}}
                source={iconAccount}
              />
              <Text style={styles.menuTitle}>Test Image</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('testimage')}
        /> */}
      
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: '#01a3d4',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Homes" component={NavigatorView} options={{ swipeEnabled: false, headerShown:false }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuTitle: {
    marginLeft: 10,
    color: '#fff',
    fontFamily: "Poppins-Regular",
  },
  menuLabelFlex: {
    display: 'flex',
    flexDirection: 'row'
  },
  userName: {
    color: '#fff',
    fontSize: 18
  },
  divider: {
    borderBottomColor: 'white',
    opacity: 0.2,
    borderBottomWidth: 1,
    margin: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10
  },
});
