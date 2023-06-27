import HomeScreen from '../home/HomeViewContainer';
import CategoryScreen from '../category/CategoryViewContainer';
import SearchProductScreen from '../searchproduct/SearchProductViewContainer';
import ProductScreen from '../product/ProductViewContainer';
import CalendarScreen from '../calendar/CalendarViewContainer';
import GridsScreen from '../grids/GridsViewContainer';
import PagesScreen from '../pages/PagesViewContainer';
import ComponentsScreen from '../components/ComponentsViewContainer';
import OrdersScreen from '../orders/OrdersViewContainer';
import MycartScreen from '../mycart/MycartViewContainer';
import LoginScreen from '../login/LoginViewContainer';
import NotificationScreen from '../notifications/NotificationViewContainer';

const iconHome = require('../../../assets/images/pages/home.png');
const iconShop = require('../../../assets/images/pages/shop.png');
const iconGrids = require('../../../assets/images/tabbar/grids.png');
const iconOrder = require('../../../assets/images/icons/orders.png');
const iconPages = require('../../../assets/images/tabbar/pages.png');
const iconcate = require('../../../assets/images/pages/category.png');
const iconcart = require('../../../assets/images/pages/cart.png');
const iconnoti = require('../../../assets/images/pages/noti_icon.png');
const iconComponents = require('../../../assets/images/pages/profile.png');

const tabNavigationData = [{
        name: 'Home',
        component: HomeScreen,
        icon: iconHome,
    },
    {
        name: 'Categories',
        component: CategoryScreen,
        icon: iconcate,
    },
    // {
    //   name: 'Shop',
    //   component: SearchProductScreen,
    //   icon: iconShop,
    // },
    // {
    //   name: 'Cart',
    //   component: MycartScreen,
    //   icon: iconcart,
    // },
    {
        name: 'Orders',
        component: OrdersScreen,
        icon: iconOrder,
    },
    {
        name: 'Notifications',
        component: NotificationScreen,
        icon: iconnoti,
    }
    // {
    //   name: 'Product',
    //   component: ProductScreen,
    //   icon: iconGrids,
    // },

    // {
    //   name: 'Account',
    //   component: ComponentsScreen,
    //   icon: iconComponents,
    // },
];

export default tabNavigationData;