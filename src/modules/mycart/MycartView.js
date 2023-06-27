import React from 'react';
import { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Card, Icon } from 'react-native-elements';
import { colors, fonts } from '../../styles';
import { GridRow } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const { width: screenWidth } = Dimensions.get('window');
const iconFilter = require('../../../assets/images/icons/star.png');
const iconWishtlist = require('../../../assets/images/icons/wishlist.png');
const iconCart = require('../../../assets/images/icons/cart.png');
import Loader from '../../components/Loader';

var count = 1;
export default class MycartScreen extends React.Component {
  state = {
    userid: 0,
    cartdetails: '',
    cartdetailcount: '',
    checkouttotal: 0,
    loader: false,
    usertype: '',
    selectedproduct: []
  }


  componentDidMount = () => {
    this.getuser();
    this.setState({ loader: true })
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ loader: true })
      this.getuser();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate = (prevProps, prevState) => {
    // alert(prevProps.isFocused);
    if (prevProps.isFocused !== this.props.isFocused) {
      this.getuser();
    }
    // alert("Hii");
    // if(prevState.cartdetailcount == this.state.cartdetailcount)
    // {
    //   if(count == 1)
    //   {
    //     this.getcartdetails();
    //     count++;
    //   }
    //   return;
    // }
  }

  async getuser() {
    var userid = await AsyncStorage.getItem('user_id');
    var usertype = await AsyncStorage.getItem('user_type');
    this.setState({ userid: userid, usertype: usertype });
    this.getcartdetails();
  }
  increment = (cartid, quantity) => {
    var quantity = Number(quantity) + 1;
    fetch(global.apiurl+'quantityadder&cartid=' + cartid + '&quan=' + quantity, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson.success);
        if (responseJson.success == true) {
          this.getcartdetails();
        }

      })
      .catch((error) => {
        console.error(error);
      });

  }
  decrement = (cartid, quantity) => {
    var quantity = Number(quantity) - 1;
    console.log("CARTID",cartid);
    console.log("quantity",quantity);
    fetch(global.apiurl+'quantityadder&cartid=' + cartid + '&quan=' + quantity, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.action);
        if (responseJson.success == true) {
          this.getcartdetails();
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }
  getcartdetails() {
    if (this.state.userid === null) {
      console.log("No User Found");
      alert("Please Login to See Cart");
      this.setState({
        loader: false
      })
    }
    else {
      fetch(global.apiurl+'getcartdetails&id=' + this.state.userid, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson.details);
          // this.refs._scrollView.scrollTo({});
          // var sizearray = responseJson.productdetails[0].sizes.split(',');
          if (responseJson.success == true) {

            this.setState({
              cartdetails: responseJson.details,
              cartdetailcount: responseJson.details.length
            })
            let count = 0;
            for (i = 0; i < this.state.cartdetailcount; i++) {
              count += Number((this.state.usertype == 'RESELLER') ? (Number(this.state.cartdetails[i].reseller_price) + Number(this.state.cartdetails[i].product_total_price)) : ((Number(this.state.cartdetails[i].customer_price) + Number(this.state.cartdetails[i].product_total_price)) * Number(this.state.cartdetails[i].quantity)));
              // this.setState({ checkouttotal: this.state.checkouttotal + count})
            }
            this.setState({ checkouttotal: count, loader: false })
          }
          else {
            //alert(responseJson.details);
            this.setState({
              loader: false
            })
          }

          //console.log(this.state.cartdetails);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  _getRenderItemFunctions = () =>
    [this.renderRowThree][
    0
    ];

  _getRenderResellerItemFunctions = () =>
    [this.renderResellerRowThree][
    0
    ];
  deletecartproduct(cartid) {
    this.setState({ loader: true })
    fetch(global.apiurl+'deletecartdetails&id=' + this.state.userid + '&cartid=' + cartid, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.action);
        if (responseJson.success == true) {
          if(this.state.cartdetailcount == 1) {
            this.props.navigation.navigate('Home')
          }
          this.getuser();
          this.getcartdetails();
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderRowThree = ({ item }) => (

    <View
      key={item.id}
      style={styles.itemThreeContainer}
    >
      <View style={styles.itemThreeSubContainer}>
        <Image source={{ uri: global.apiurl+'image/' + item.image }} style={styles.itemThreeImages} />
        <View style={styles.itemThreeContent}>
          <Text style={styles.itemThreeBrand}>{item.producttitle}</Text>
          <View>
            <Text style={styles.itemThreeSubtitle} numberOfLines={1}>
              {item.productname}
            </Text>
            <Text style={styles.itemfourSubtitle} numberOfLines={1}>
              Size : {item.size}
            </Text>
            <Text style={styles.itemfourSubtitle} numberOfLines={1}>
              Product Code : {item.productcode}
            </Text>
            {/* <Text style={styles.itemfourSubtitle} numberOfLines={1}>
              Color : {item.color}
            </Text> */}
            
            <Text style={styles.Amounttext}> Rs. {(this.state.usertype == 'RESELLER') ? (Number(item.reseller_price) + Number(item.product_total_price)) : (Number(item.customer_price) + Number(item.product_total_price))} /-</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity onPress={() => this.decrement(item.cartid, item.quantity)} disabled={item.quantity > 1 ? false : true}>
                    <Text style={styles.countersleft}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.text}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => this.increment(item.cartid, item.quantity)} disabled={item.quantity < item.stock  ? false : true}>
                    <Text style={styles.counters}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.deletebutton}>
                  <Icon
                    // raised
                    name='trash'
                    type='font-awesome'
                    color='#f50'
                    size={26}
                    onPress={() => this.deletecartproduct(item.cartid)} />
                </TouchableOpacity>
            </View>
          </View>
        </View>
        
      </View>
      <View style={styles.itemThreeHr} />
    </View>
  );
  Onchecked(id) {
    console.log(id);
    const selectedarray = this.state.selectedproduct;
    if (selectedarray.includes(id) == true) {
      for (var i = 0; i < selectedarray.length; i++) {
        if (selectedarray[i] === id) {
          selectedarray.splice(i, 1);
        }
      }
    }
    else {
      selectedarray.push(id);
    }
    // selectedarray.push(id);
    console.log(selectedarray.includes(id));
    this.setState({ selectedproduct: selectedarray })
    console.log(this.state.selectedproduct);
  }
  renderResellerRowThree = ({ item }) => (

    <View
      key={item.id} r
      style={styles.itemThreeContainer}
    >
      <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5,}}>
        <CheckBox
          value={this.state.selectedproduct.includes(item.cartid)}
          onValueChange={() => this.Onchecked(item.cartid)}
          style={styles.checkbox}
          tintColors="#000"
          // disabled={item.stock >= 1 ? true : false}
        />
        <Text style={styles.itemCustName}>Customer Name : {item.customername}</Text>
      </View>
      <View style={styles.itemThreeSubContainer}>
        <Image source={{ uri: global.apiurl+'image/' + item.image }} style={styles.itemThreeImages} />
        <View style={styles.itemThreeContent}>
          <Text style={styles.itemThreeBrand}>{item.producttitle}</Text>
          <View>
            <Text style={styles.itemThreeSubtitle} numberOfLines={1}>
              {item.productname}
            </Text>
            <Text style={styles.itemfourSubtitle} numberOfLines={1}>
              Size : {item.size}
            </Text>
            <Text style={styles.itemfourSubtitle} numberOfLines={1}>
              Product Code : {item.productcode}
            </Text>
            {/* <Text style={styles.itemfourSubtitle} numberOfLines={1}>
              Color : {item.color}
            </Text> */}
            <Text style={styles.Amounttext}> Rs. {(this.state.usertype == 'RESELLER') ? (Number(item.reseller_price) + Number(item.product_total_price)) : (Number(item.customer_price) + Number(item.product_total_price))} /-</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity onPress={() => this.decrement(item.cartid, item.quantity)} disabled={item.quantity > 1 ? false : true}>
                    <Text style={styles.countersleft}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.text}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => this.increment(item.cartid, item.quantity)} disabled={item.quantity <= item.stock ? false : true}>
                    <Text style={styles.counters}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.deletebutton}>
                  <Icon
                    // raised
                    name='trash'
                    type='font-awesome'
                    color='#f50'
                    size={26}
                    onPress={() => this.deletecartproduct(item.cartid)} />
                </TouchableOpacity>
            </View>
          </View>
        </View>
        
      </View>
      
      <View style={styles.itemThreeHr} />
    </View>
  );

  resellercheckout = () => {
    const selectedarray = this.state.selectedproduct;
    // console.log(selectedarray.length);
    if (selectedarray.length == '0') {
      alert("Please Select Product to Checkout");
      return;
    }
    this.props.navigation.navigate('Buy Now - Cart Reseller', {
      cartid: this.state.selectedproduct
    })
  }

  checkStockValidationsCustomer = () => {
    var stockCheck = true;
    this.state.cartdetails.map((item,index) => {
      if(item.quantity <= item.stock) {
        //alert("Stock Available")
      }
      else {
        alert("Stock Not Available for the Product Code "+item.productcode+" Available Stock = "+item.stock);
        stockCheck = false;
        return;
      }
    })
    if(this.state.cartdetails.length < 1) {
      alert(" No Products Listed in Cart");
      return;
    }

    if(stockCheck == false) {
      return;
    }
    this.props.navigation.navigate('Buy Now - Cart Products', {
      total: this.state.checkouttotal
    })
  }

  render() {

    const groupedData =
      this.props.tabIndex === 0
        ? GridRow.groupByRows(this.props.data, 2)
        : this.props.data;
    const groupedDatas = this.props.data;
    //console.log(groupedDatas);
    //console.log(this.state.cartdetails);
    return (

      <View>
        <Loader loading={this.state.loader} />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 70 }}>
          <View>
            <Card style={styles.cardwidth}>
              {/* <Text style={styles.headersection}>Cart History</Text> */}
              <View style={styles.itemThreeHr} />
              <FlatList
                keyExtractor={item =>
                  item.id
                    ? `${this.props.tabIndex}-${item.id}`
                    : `${item[0] && item[0].id}`
                }
                style={{ backgroundColor: colors.white, paddingHorizontal: 15 }}
                data={this.state.cartdetails}
                extraData={true}
                renderItem={this.state.usertype == "RESELLER" ? this._getRenderResellerItemFunctions() : this._getRenderItemFunctions()}
              />
            </Card>
          </View>
        </ScrollView>
        {this.state.usertype != 'RESELLER' ? (
          <View style={styles.demoButtonsContainer}>
            <TouchableOpacity style={styles.opbuttons}
              onPress={() => {
                this.checkStockValidationsCustomer();
              }}
            >
              <Text style={styles.itemOnebtnTitle}
                numberOfLines={1}  >
                Check Out (Rs. {this.state.checkouttotal} )</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.usertype == 'RESELLER' ? (
          <View style={styles.demoButtonsContainer}>
            <TouchableOpacity style={styles.opbuttons}
              onPress={this.resellercheckout}>
              <Text style={styles.itemOnebtnTitle}
                numberOfLines={1}  >
                Check Out</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  cardwidth: {
    // flex: 1, 
    // width: 100,
    marginLeft: 0, marginRight: 0
  },
  tabsContainer: {
    alignSelf: 'stretch',
    marginTop: 30,
  },
  Amounttext: {
    paddingVertical: 10,
    fontFamily: fonts.primaryRegular,
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    color:'black',
  },
  searchImage: {
    height: 15,
    width: 15,
  },
  headersection: {
    paddingVertical: 10,
    fontFamily: fonts.primaryRegular,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  itemThreeContainer: {
    backgroundColor: 'white',
  },
  itemThreeSubContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  itemThreeImage: {
    height: 100,
    width: 100,
  },
  itemThreeImages: {
    borderRadius: 5,
    width: 125,
    // resizeMode:"contain",

  },
  itemThreeContent: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  itemThreeBrand: {
    fontFamily: fonts.primaryRegular,
    fontSize: 14,
    color: '#617ae1',
  },
  itemThreeSubtitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 12,
    color: '#a4a4a4',
  },
  itemfourSubtitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 14,
    color: '#a4a4a4',
  },
  itemThreeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemThreeHr: {
    flex: 1,
    height: 1,
    backgroundColor: '#e3e3e3',
    marginRight: -15,
  },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  demoButtonsContainer: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    position: 'absolute',
    bottom: 0
  },
  searchbtnImage: {
    height: 30,
    width: 30,
    marginLeft: Dimensions.get('window').width / 20,
  },
  itemOnebtnTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    //marginLeft:50
  },
  opbuttons: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01a3d4",
    padding: 15,
    width: Dimensions.get('window').width,
  },
  deletebutton:
  {
    // backgroundColor: "#01a3d4",
    // marginVertical: 25,
    // padding: 5,
    // height:40
    // fontSize: 12
    // borderWidth:0.5,
    // borderColor:'grey',
    padding:5
  },
  counters: {
    color: '#015169',
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 7,
    // marginRight:50,
    paddingVertical: 1,
    backgroundColor: '#03a9f3',
    flex: 0
  },
  countersleft: {
    color: '#015169',
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 7,
    alignItems: 'flex-end',
    paddingVertical: 1,
    backgroundColor: '#03a9f3',
    flex: 0
  },
  text: {
    color: '#015169',
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 7,
    paddingVertical: 1,
    // backgroundColor:'#03a9f3'
  },
  itemCustName: {
    fontFamily: fonts.primaryRegular,
    fontSize: 16,
    color: '#000',
    marginTop: 8,
    width:windowWidth/100 * 75
  }
});
