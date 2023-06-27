import React from 'react';
import {useState, createRef} from 'react';
import { TouchableOpacity, Image ,View} from 'react-native';

import TabNavigator from './MainTabNavigator';
import GalleryScreen from '../gallery/GalleryViewContainer';
import CategoryScreen from '../category/CategoryViewContainer';
import GridView from '../grids/GridsViewContainer';
import ProductScreen from '../product/ProductViewContainer';
import SearchProductScreen from '../searchproduct/SearchProductViewContainer';
import AvailableInFullVersion from '../../modules/availableInFullVersion/AvailableInFullVersionViewContainer';
import AddResellerScreen from '../addreseller/AddResellerViewContainer';

// import ProfileScreen from '../profile/ProfileViewContainer';
// import ArticleScreen from '../article/ArticleViewContainer';
// import ChatScreen from '../chat/ChatViewContainer';
// import MessagesScreen from '../chat/MessagesViewContainer';
// import ChartsScreen from '../charts/ChartsViewContainer';
// import AuthScreen from '../auth/AuthViewContainer';
const iconHome = require('../../../assets/images/drawer/home.png');
import { colors, fonts } from '../../styles';
import OrdersScreen from '../orders/OrdersViewContainer';
import HomeScreen from '../home/HomeViewContainer';
import PagesScreen from '../pages/PagesViewContainer';
import LoginScreen from '../login/LoginViewContainer';
import SignupScreen from '../signup/SignupViewContainer';
import Buynowscreen from '../buy now/BuynowContainer';
import BuyNowScreenCart from '../buy-now-cart/BuynowcartContainer';
import MycartScreen from '../mycart/MycartViewContainer';
import BuyNowScreenReseller from '../buy-now-reseller/BuynowresellerContainer';
import MyProfileScreen from '../myprofile/MyprofileView';
import ForgotPasswordScreen from '../forgotpassword/ForgotPasswordViewContainer';
import AsyncStorage from '@react-native-community/async-storage';
import BuyNowScreenCartReseller from '../buy-now-cart-reseller/BuynowcartResellerContainer';
import MyWalletScreen from '../mywallet/MywalletView';
import ContactUsScreen from '../contact-us/ContactUs';
import TestScreen from '../testimage/TestImageViewContainer';

import { Icon } from 'react-native-elements';

const headerLeftComponent = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      
      <Image
        source={require('../../../assets/images/icons/arrow-back.png')}
        resizeMode="contain"
        style={{
          height: 20,
        }}
      />
      
    </TouchableOpacity>    
  )
}


const headerRightComponent = () => {
  return (
    <View style={{marginRight:10}}>
    <Icon
      name='shopping-cart'
      type='feather'
      color='#fff'
      onPress={() => props.navigation.navigate('Cart') }
      />
    </View>  
  )
}

const headerBackground = require('../../../assets/images/topBarBg.png');

const StackNavigationData = [
  {
    name: 'Login',
    component: LoginScreen,
    headerLeft: null,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  // {
  //   name: 'Mahalakshmi',
  //   component: TabNavigator,
  //   headerLeft: null,
  //   headerBackground: { source: headerBackground },
  //   headerTitleStyle: {
  //     fontFamily: fonts.primaryRegular,
  //     color: colors.white,
  //     fontSize: 18,
  //   },
  // },
  {
    name: 'Home',
    component: TabNavigator,
    headerLeft: null,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Charts',
    component: AvailableInFullVersion,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },{
    name: 'Category',
    component: CategoryScreen,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Pages',
    component: PagesScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Shop',
    component: SearchProductScreen,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },{
    name: 'Product',
    component: ProductScreen,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Grid',
    component: GridView,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Become a Reseller',
    component: AddResellerScreen,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Sign Up',
    component: SignupScreen,
    headerLeft: headerLeftComponent,
    headerRight: null,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Buy Now',
    component: Buynowscreen,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Buy Now - Cart Products',
    component: BuyNowScreenCart,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Buy Now - Cart Reseller',
    component: BuyNowScreenCartReseller,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Buy Now - Reseller',
    component: BuyNowScreenReseller,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },

  {
    name: 'Blog',
    component: AvailableInFullVersion,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Gallery',
    component: GalleryScreen,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Profile',
    component: AvailableInFullVersion,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
 /* {
    name: 'Login',
    component: LoginScreen,
    // headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  }, */
  {
    name: 'Article',
    component: AvailableInFullVersion,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },{
    name: 'Orders',
    component: OrdersScreen,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Cart',
    component: MycartScreen,
    headerLeft: headerLeftComponent,
    headerRight: null,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Chat',
    component: AvailableInFullVersion,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Messages',
    component: AvailableInFullVersion,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Auth',
    component: AvailableInFullVersion,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'My Profile',
    component: MyProfileScreen,
    headerLeft: headerLeftComponent,
    headerRight: headerRightComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Forgot Password',
    component: ForgotPasswordScreen,
    headerLeft: headerLeftComponent,
    headerRight: null,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    }
  },
  {
    name: 'My Wallet',
    component: MyWalletScreen,
    headerLeft: headerLeftComponent,
    headerRight: null,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    }
  },
  {
    name: 'testimage',
    component: TestScreen,
    headerLeft: headerLeftComponent,
    headerRight: null,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    }
  },
  {
    name: 'Contact Us',
    component: ContactUsScreen,
    headerLeft: headerLeftComponent,
    headerRight: null,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    }
  },
  
  
]

export default StackNavigationData;
