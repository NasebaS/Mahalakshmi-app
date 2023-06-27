import React, { useState } from 'react';
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
  Pressable,
  Alert,
  Modal,
  TextInput,
  Linking
} from 'react-native';
import { SearchBar, Icon, Button, Card } from 'react-native-elements';
import { colors, fonts } from '../../styles';
import { GridRow } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { RadioButton } from 'react-native-paper';
const { width: screenWidth } = Dimensions.get('window');
const iconSort = require('../../../assets/images/icons/sort.png');
const iconFilter = require('../../../assets/images/icons/filter.png');
// const iconFilter = require('../../../assets/images/icons/star.png');
const iconWishtlist = require('../../../assets/images/icons/wishlist.png');
const iconCart = require('../../../assets/images/icons/cart.png');
import Loader from '../../components/Loader';
export default class OrdersScreen extends React.Component {
  state = {
    modalVisible: false,
    modalVisibleSort: false,
    userid: 0,
    reasonorderid: 0,
    cartdetails: '',
    actualCartDetails: '',
    orderlength: 'tt',
    loader: false,
    reasonmodal: false,
    returncomment: '',
    searchNew: "",
  }


  componentDidMount = () => {
    this.getuser();
    this.setState({ loader: true })
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getuser();
      this.setState({ loader: true })
    });

  }
  componentDidUpdate = (prevProps, prevState) => {

    if (prevProps.isFocused !== this.props.isFocused) {
      this.getuser();
    }
  }

  async getuser() {
    var userid = await AsyncStorage.getItem('user_id');
    this.setState({ userid, userid });
    if (this.state.userid === null) {
      console.log("No User Found");
      alert("Please Login to See Order Details");
      this.setState({
        loader: false
      })
    }
    else {
      fetch(global.apiurl + 'getorderdetails&id=' + this.state.userid, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson.details);
          //  alert(responseJson.details);
          // this.refs._scrollView.scrollTo({});
          // var sizearray = responseJson.productdetails[0].sizes.split(',');
          if (responseJson.success == true) {
            this.setState({
              cartdetails: responseJson.details.sort(function (a, b) {
                return parseFloat(b.order_id) - parseFloat(a.order_id);
              }),
              actualCartDetails: responseJson.details,
              orderlength: this.state.cartdetails.length,
              loader: false
            })

            //alert(this.state.orderlength);
            //console.log(this.state.cartdetails);
          }
          else {
            alert(responseJson.details);
            this.setState({
              loader: false
            })
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  cancelorder(orderid) {
    Alert.alert(
      "Cancel Confirmation",
      "Are You Sure Want to Cancel this Order?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => this.cancelorder_conf(orderid) }
      ]
    );
  }
  cancelorder_conf(orderid) {
    this.setState({
      loader: true
    })
    fetch(global.apiurl + 'cancelorder&id=' + orderid, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.success == true) {
          this.getuser();
          alert(responseJson.details);
        }
        else {
          this.getuser();
          alert(responseJson.details);
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }
  returnorder(orderid) {
    var order_id = orderid
    this.setState({ reasonorderid: order_id, reasonmodal: true })
  }
  returnorder_conf = () => {
    Alert.alert(
      "Return Confirmation",
      "Are You Sure Want to Return this Order?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => this.returnorder_conf_com() }
      ]
    );
  }
  returnorder_conf_com = () => {
    this.setState({
      loader: true
    })
    fetch(global.apiurl + 'returnorder&id=' + this.state.reasonorderid + '&comment=' + this.state.returncomment, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.success == true) {
          this.getuser();
          alert(responseJson.details);
        }
        else {
          this.getuser();
          alert(responseJson.details);
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }
  _getRenderItemFunctions = () =>
    [this.renderRowThree][
    0
    ];
  renderRowThree = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itemThreeContainer}
    >
      <View style={styles.itemThreeSubContainer}>
        <Image source={{ uri: global.apiurl + 'image/' + item.image }} style={styles.itemThreeImages} />
        <View style={styles.itemThreeContent}>
          <Text style={styles.itemThreeBrand}>{item.producttitle}</Text>
          <View>
            <Text style={styles.itemThreeSubtitle} numberOfLines={1}>
              {item.productname}
            </Text>
            <Text style={styles.itemfiveSubtitle} numberOfLines={1}>
              Order Number : {item.order_number}
            </Text>
            <Text style={styles.itemfiveSubtitle} numberOfLines={1}>
              Size : {item.size}
            </Text>
            <Text style={styles.itemfiveSubtitle} numberOfLines={1}>
              Product Code : {item.productcode}
            </Text>
            <Text style={styles.itemfiveSubtitle} numberOfLines={1}>
              Delivery Partner: {item.delivery_partner}
            </Text>
            <Text style={styles.itemfiveSubtitle} numberOfLines={1}>
              Tracking Id : {item.tracking_id}
            </Text>
            <Text style={styles.itemfiveSubtitle} numberOfLines={1}>
              Payment Type : {item.payment_type}
            </Text>
            {item.order_status == 'Pending' ? (
              <Text style={styles.itemfiveSubtitle} numberOfLines={1}>
                Status : {item.order_status}
              </Text>
            ) : null}

            {item.order_status == 'Approved' ? (
              <Text style={styles.itemfiveSubtitle} numberOfLines={1}>
                Status : Packed
              </Text>
            ) : null}

            {item.order_status == 'Disapproved' ? (
              <Text style={styles.itemfiveSubtitle} numberOfLines={1}>
                Status : Cancelled / Rejected
              </Text>
            ) : null}
            {/* <Text style={styles.itemfourSubtitle} numberOfLines={1}>
                Color : {item.color}
              </Text> */}
            <Text style={styles.Amounttext}> Rs. {item.price} /-</Text>
            {item.order_status == 'Approved' ? (
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Linking.openURL(item.tracking_url)}>
                <Icon
                  size={16}
                  name='truck'
                  type='font-awesome'
                  color='red'
                />
                <Text style={styles.TrackOrderTxt}>Track Order</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

      </View>

      <View style={styles.itemThreeHr} />
    </TouchableOpacity>
  );

  search_function = (text) => {
    console.log(text);
    var cartDetails = this.state.actualCartDetails.filter((item) => item.order_number === text.toUpperCase().toString());

    if (cartDetails.length > 0) {
      this.setState({
        cartdetails: cartDetails
      })
    }
    else {
      cartDetails = this.state.actualCartDetails.filter((item) => item.productcode === text.toString());
      if (cartDetails.length > 0) {
        this.setState({
          cartdetails: cartDetails
        })
      }
      else {
        this.setState({
          cartdetails: this.state.actualCartDetails
        })
      }
    }
    console.log(cartDetails);
  }

  render() {


    const groupedData =
      this.props.tabIndex === 0
        ? GridRow.groupByRows(this.props.data, 2)
        : this.props.data;
    const groupedDatas = this.props.data;
    return (
      <View>
        <Loader loading={this.state.loader} />
        <View style={styles.demoButtonsContainer}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
          >
            <View style={styles.PaymentcenteredView} onPress={() => this.setState({ modalVisible: false })}>
              <View style={styles.PaymentmodalView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.PaymentmodalText}>Filter</Text>
                  <Icon name="close" type='font-awesome' color='#f43397' onPress={() => this.setState({ modalVisible: false })} />
                </View>
                <View style={styles.divider} />
                <View>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                         Status - Pending</Text>
                      </View>
                      <RadioButton
                        value={"pending"}
                        status={this.state.filterSortValue === "pending" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "pending" });
                          this.setState({ cartdetails: this.state.actualCartDetails.filter((a) =>  a.order_status === "Pending" ) });
                          this.setState({ modalVisible: false })
                          
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                         Status - Approved</Text>
                      </View>
                      <RadioButton
                        value={"Approved"}
                        status={this.state.filterSortValue === "Approved" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "Approved" });
                          this.setState({ cartdetails: this.state.actualCartDetails.filter((a) =>  a.order_status === "Approved" ) });
                          this.setState({ modalVisible: false })
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                         Status - Disapproved</Text>
                      </View>
                      <RadioButton
                        value={"Disapproved"}
                        status={this.state.filterSortValue === "Disapproved" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "Disapproved" });
                          this.setState({ cartdetails: this.state.actualCartDetails.filter((a) =>  a.order_status === "Disapproved" ) });
                          this.setState({ modalVisible: false })
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                         Payment - Prepaid</Text>
                      </View>
                      <RadioButton
                        value={"prepaid"}
                        status={this.state.filterSortValue === "prepaid" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "prepaid" });
                          this.setState({ cartdetails: this.state.actualCartDetails.filter((a) =>  a.payment_type === "Prepaid" ) });
                          this.setState({ modalVisible: false })
                        }}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                         Payment - COD</Text>
                      </View>
                      <RadioButton
                        value={"cod"}
                        status={this.state.filterSortValue === "cod" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "cod" });
                          this.setState({ cartdetails: this.state.actualCartDetails.filter((a) =>  a.payment_type === "COD" ) });
                          this.setState({ modalVisible: false })
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => this.setState({ cartdetails : this.state.actualCartDetails})}>
                    <Text style={styles.clearBtn}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisibleSort}
          >
            <View style={styles.PaymentcenteredView} onPress={() => this.setState({ modalVisibleSort: false })}>
              <View style={styles.PaymentmodalView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.PaymentmodalText}>Sort</Text>
                  <Icon name="close" type='font-awesome' color='#f43397' onPress={() => this.setState({ modalVisibleSort: false })} />
                </View>
                <View style={styles.divider} />
                <View>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                          Price (Low to High)</Text>
                      </View>
                      <RadioButton
                        value={"pricelth"}
                        status={this.state.filterSortValue === "pricelth" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "pricelth" });
                          this.state.cartdetails.sort(function (a, b) {
                            return parseFloat(a.price) - parseFloat(b.price);
                          });
                          this.setState({ modalVisibleSort: false })
                        }}

                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                          Price (High to Low)</Text>
                      </View>
                      <RadioButton
                        value={"pricehtl"}
                        status={this.state.filterSortValue === "pricehtl" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "pricehtl" });
                          this.state.cartdetails.sort(function (a, b) {
                            return parseFloat(b.price) - parseFloat(a.price);
                          });
                          this.setState({ modalVisibleSort: false })
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                          Order Id Desc</Text>
                      </View>
                      <RadioButton
                        value={"orderidDesc"}
                        status={this.state.filterSortValue === "orderidDesc" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "orderidDesc" });
                          this.state.cartdetails.sort(function (a, b) {
                            return parseFloat(b.order_id) - parseFloat(a.order_id);
                          });
                          this.setState({ modalVisibleSort: false })
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                          Order Id Asc</Text>
                      </View>
                      <RadioButton
                        value={"orderidAsc"}
                        status={this.state.filterSortValue === "orderidAsc" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "orderidAsc" });
                          this.state.cartdetails.sort(function (a, b) {
                            return parseFloat(a.order_id) - parseFloat(b.order_id);
                          });
                          this.setState({ modalVisibleSort: false })
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                          Order Date Desc</Text>
                      </View>
                      <RadioButton
                        value={"orderdateDesc"}
                        status={this.state.filterSortValue === "orderdateDesc" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "orderdateDesc" });
                          this.state.cartdetails.sort(function (a, b) {
                            var dateA = new Date(a.created_on).getTime();
                            var dateB = new Date(b.created_on).getTime();
                            return dateA < dateB ? 1 : -1;  
                            // return new Date(a.created_on) - new Date(b.created_on);
                          });
                          this.setState({ modalVisibleSort: false })
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>
                      <View style={styles.textwidth}>
                        <Text style={[styles.itemOneTitle, { color: '#858585' }]}
                          numberOfLines={1}>
                          Order Date Asc</Text>
                      </View>
                      <RadioButton
                        value={"orderdateAsc"}
                        status={this.state.filterSortValue === "orderdateAsc" ? 'checked' : 'unchecked'}
                        onPress={() => {
                          this.setState({ filterSortValue: "orderdateAsc" });
                          this.state.cartdetails.sort(function (a, b) {
                            var dateA = new Date(a.created_on).getTime();
                            var dateB = new Date(b.created_on).getTime();
                            return dateA > dateB ? 1 : -1;  
                            // return new Date(a.created_on) - new Date(b.created_on);
                          });
                          this.setState({ modalVisibleSort: false })
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => this.setState({ cartdetails : this.state.actualCartDetails})}>
                    <Text style={styles.clearBtn}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <TouchableOpacity style={styles.opbutton} onPress={() => { this.setState({ modalVisibleSort: true }) }}>
            <View style={styles.searchImageContainer}>
              <Image style={styles.searchImage}
                source={iconSort} />
              <Text style={styles.itemOneTitle}
                numberOfLines={1}>
                Sort</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.opbutton} onPress={() => { this.setState({ modalVisible: true }) }}>
            <View style={styles.searchImageContainer}>
              <Image style={styles.searchImage}
                source={iconFilter} />
              <Text style={styles.itemOneTitle}
                numberOfLines={1}>
                Filter</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}>
          <View>
            <SearchBar
              placeholder="Search by Keywords or Product ID..."
              lightTheme={true}
              // onChangeText={(value) => setsearch(value)}
              onChangeText={(text) => {
                console.log(text);
                this.setState({
                  searchNew: text
                });
                this.search_function(text)
              }}
              value={this.state.searchNew}
              containerStyle={{ backgroundColor: '#fff', width: '100%', paddingHorizontal: '6%' }}
            />
              {/* <Text style={styles.headersection}>Order History</Text> */}
              <View style={[styles.itemThreeHr]} />
              <FlatList
                keyExtractor={item =>
                  item.id
                    ? `${this.props.tabIndex}-${item.id}`
                    : `${item[0] && item[0].id}`
                }
                style={{ backgroundColor: colors.white, paddingHorizontal: 10,marginBottom:50 }}
                data={this.state.cartdetails}
                renderItem={this._getRenderItemFunctions()}
              />
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.reasonmodal}
        >
          <View style={styles.centeredView} onPress={() => this.setState({ reasonmodal: false })}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.modalText}>Return Comment</Text>
                <Icon name="close" type='font-awesome' color='#f43397' onPress={() => this.setState({ reasonmodal: false })} />
              </View>
              <View style={styles.divider} />
              <Card style={styles.cardwidthmodal}>
                <Text style={{ fontSize: 14 }}>Return Comment</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(value) => this.setState({
                    returncomment: value
                  })}
                  underlineColorAndroid="#f000"
                  placeholder="Enter Return Message"
                  placeholderTextColor="#8b9cb5"
                  keyboardType="default"
                  // ref={emailInputRef}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    passwordInputRef.current &&
                    passwordInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                />
              </Card>
              <View style={{ marginTop: 30, flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => this.setState({ reasonmodal: false })}
                >
                  <Text style={styles.textStyle}> Close </Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={this.returnorder_conf}
                >
                  <Text style={styles.textStyle}> Return</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

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
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    color: 'black'
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
    width: 150,
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
  itemfiveSubtitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 10,
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
    borderWidth: 0.5,
    borderColor: 'grey',
    padding: 5
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
    marginTop: 8
  },
  TrackOrderTxt: {
    marginLeft: 5,
    color: 'red',
    fontFamily: 'Poppins-SemiBold',
  },
  priceLink: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  PaymentmodalText: {
    marginBottom: 2,
    textAlign: "left",
    fontSize: 14
  },
  PaymentcenteredView: {
    flex: 1,
    width: '100%',
    // justifyContent: "center",
    // alignItems: "center",
    // marginTop: 22
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  divider: {
    borderBottomColor: 'black',
    opacity: 0.2,
    borderBottomWidth: 1,
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
    textAlign: "left",
  },
  PaymentmodalView: {
    // margin: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    // alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  Paymentbutton: {
    // borderRadius:
    padding: 10,
    width: '45%',
    marginHorizontal: 10
  },
  PaymentbuttonOpen: {
    backgroundColor: "#F194FF",
    // marginTop:10
  },
  PaymentbuttonClose: {
    backgroundColor: "#2196F3",
  },
  addaddressbtn: {
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  demoButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  demoButtonsContainer: {   
   
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
    
  },
  textwidth: {   
    marginLeft:10,
    width: Dimensions.get('window').width -80, 
  },
  demoItem: {
    marginVertical: 15,
  },
  gridcontainer: {
    flex: 1,
    marginHorizontal: 20,
   
  },
  bgImage: {
    flex: 1,
    marginHorizontal: -20,
  },
  opbutton: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    width: Dimensions.get('window').width / 2,
    borderBottomWidth:0.3,
    borderTopWidth:0.3
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headersection: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontFamily: fonts.primaryRegular,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
  },
  searchImageContainer1: {    
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
    padding:2,
  },
  searchImageContainer: {    
    overflow: 'hidden',
    width: Dimensions.get('window').width / 2,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchImage: {
    height: 20,
    width: 20,
    marginLeft:Dimensions.get('window').width / 6,
  },
  clearBtn: {backgroundColor:colors.blue, fontFamily:'Poppins-SemiBold', padding:10, marginHorizontal:20, color:'#fff', textAlign:'center'},
});
