import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  Modal,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
// import { Dropdown } from 'react-native-material-dropdown';
import { Card, Icon } from 'react-native-elements'
import { colors, fonts } from '../../styles';
import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from '@react-native-community/async-storage';
import HTMLView from 'react-native-htmlview';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Loader from '../../components/Loader';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const BuyNowScreenCartReseller = (props) => {
  const [userName, setUserName] = useState('');
  const [UserAddress, setUserAddress] = useState('');
  const [UserAddress2, setUserAddress2] = useState('');
  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [UserCity, setUserCity] = useState('');
  const [UserPin, setUserPin] = useState('');
  const [UserState, setUserState] = useState('');
  const [userDeliveryPartner, setDeliveryPartner] = useState(null);
  const [userPaymentMethod, setPaymentMethod] = useState(null);
  const [userMarginAmount, setMarginAmount] = useState(null);
  const [FromName, setFromName] = useState(null);
  const [FromMobile, setFromMobile] = useState(null);
  const [FromAddCheck, setFromAddCheck] = useState(false);
  const [CompanyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);
  const [userOption, setAddressOption] = useState(null);
  const selectHandler = (value) => {
    setAddressOption(value);

  };
  const [testcart, Settestcart] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [PaymentmodalVisible, setPaymentModalVisible] = useState(false);
  const [productname, setProductName] = useState('');
  //const [productrate, setProductRate] = useState('');
  const [productimage, setProductImage] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [user_id, setUserId] = useState('');
  const [user_type, setUsertype] = useState('');
  const [addresscount, setaddresscount] = useState('');
  const [addressdata, setaddressdata] = useState('');
  const [deliverypartners, setdeliverypartners] = useState('');
  const [Subtotal, setSubtotal] = useState('');
  const [ActualSubtotal, setActualSubtotal] = useState('');
  const addressInputRef = createRef();
  const [countries, setcountries] = useState('');
  const [productdata, setProductdata] = useState('')
  const [productShow, setproductShow] = useState(true);
  const [TotalQuantity, setTotalQuantity] = useState(0);
  const [DeliveryCharge, setDeliveryCharge] = useState(0);
  const paymentmethods = ["Prepaid", "COD"];

  const [WalletCheck, setWalletCheck] = useState(false);
  const [WalletDeductAmount, setWalletDeductAmount] = useState(0);
  const [WalletBalance, setWalletBalance] = useState(0);

  const [discountFrom, setdiscountFrom] = useState(null);
  const [discountTo, setdiscountTo] = useState(null);
  const [discountPrice, setdiscountPrice] = useState(null);

  const [TotalWeight, setTotalWeight] = useState(0);

  //const addressdata = [{name:"welcome"},{name:"hello"}];

  const { cartid } = props.route.params

  React.useEffect(() => {

    // getdeliverypartnerdetails = () => {
    //   fetch(global.apiurl+'getdeliverypartnerdetails', {
    //     method: 'GET'
    //   })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //       //console.log(responseJson.details);
    //       var details = responseJson.details;
    //       var deliverypartner = [];
    //       details.forEach(function (item, index) {
    //         // console.log(item.name);
    //         deliverypartner.push(item.name);
    //       });
    //       //console.log(deliverypartner);
    //       setdeliverypartners(deliverypartner)
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }

    getuser = async () => {
      var userid = await AsyncStorage.getItem('user_id');
      var usertype = await AsyncStorage.getItem('user_type');
      setUserId(userid);
      setUsertype(usertype);

      if (user_id === null) {
        console.log("No User Found");
        alert("Please Login to See Cart");
      }
      else {
        fetch(global.apiurl+"buynowreseller_getproductdetails", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "cartid": cartid
          })
        })
          .then(res => res.json())
          .then(data => {
            console.log("CARTDETAILS",data)
            var productdata_temp = data.action;
            setProductdata(data.action);
            var totalamount = 0;
            var margin = 0;
            productdata_temp.forEach(function (item) {
              var each_value = Number(item.reseller_price) + Number(item.margin) + Number(item.product_total_price);
              each_value = Number(each_value) * Number(item.quantity);
              totalamount = Number(totalamount) + Number(each_value);
              margin = Number(margin) + (Number(item.margin) * Number(item.quantity));
            });
            var total_quantity = 0;
            productdata_temp.forEach(function (item) {
              total_quantity = Number(total_quantity) + Number(item.quantity);  
            });

            var weight = 0;
            productdata_temp.forEach(function (item) {
              weight = Number(weight) + Number(Number(item.quantity) * Number(item.weight));  
            });
            // alert(weight);
            setTotalWeight(weight);
            setActualSubtotal(totalamount);
            setSubtotal(totalamount);
            setTotalQuantity(total_quantity);
            setMarginAmount(margin);
          })

      }
    }

    getuseraddress = async () => {
      var userid = await AsyncStorage.getItem('user_id');
      fetch(global.apiurl+'getaddressdetails&id=' + userid, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson);
          if (responseJson.details != "No Address Listed") {
            setaddressdata(responseJson.details)
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    getstatelists = () => {
      fetch(global.apiurl+'getstatelists',{
           method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson.details);
          setcountries(responseJson.details)
        })
        .catch((error) => {
           console.error(error);
        });
    }

    getCompanyDetails = () => {
      fetch(global.apiurl+'getcompanydetails',{
           method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson.details);
          // setcountries(responseJson.details)
          setCompanyDetails(responseJson.details);
          setFromName(CompanyDetails[0].name);
          setFromMobile(CompanyDetails[0].mobile);
        })
        .catch((error) => {
           console.error(error);
        });
    }
    getwalletamount = async () => {
      var userid = await AsyncStorage.getItem('user_id');
      fetch(global.apiurl+'getwalletamount&id=' + userid, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson);
          if (responseJson.success == true) {
            // alert(responseJson.walletamount);
            setWalletBalance(responseJson.walletamount);
          }
          else
          {
            setWalletBalance(0);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    getDiscountPrice = () => {
      fetch(global.apiurl+'get_discount_value',{
           method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          setdiscountFrom(responseJson.details.qty_from);
          setdiscountTo(responseJson.details.qty_to);
          setdiscountPrice(responseJson.details.amount);
          console.log(responseJson);
        })
        .catch((error) => {
           console.error(error);
        });
    }

    getstatelists();
    getuser();
    getuseraddress();
    // getdeliverypartnerdetails();
    getCompanyDetails();
    getwalletamount();
    //getsubtotal();
    getDiscountPrice();
  }, [props]);


  increment = () => setQuantity(quantity + 1);
  decrement = () => setQuantity(quantity - 1);
  // getuser();
  // getuseraddress(user_id);
  const adduseraddress = () => {

    setErrortext('');
    if (!userName) {
      alert('Please fill Name');
      return;
    }
    if (!userMobileNumber) {
      alert('Please fill Mobile Number');
      return;
    }
    if (typeof userMobileNumber !== "undefined") {

      var pattern = new RegExp(/^[0-9\b]+$/);
      if (!pattern.test(userMobileNumber)) {
        alert("Please Enter only Number.");
        return;
      } else if (userMobileNumber.length != 10) {
        alert("Please Enter 10 Digits Phone Number");
        return;
      }
    }
    if (!UserAddress) {
      alert('Please fill Address');
      return;
    }
    if (!UserState) {
      alert('Please fill City');
      return;
    }
    if (!UserCity) {
      alert('Please fill City');
      return;
    }
    if (!UserPin) {
      alert('Please fill City');
      return;
    }
    if (!FromName) {
      alert('Please fill From Address Name');
      return;
    }
    if (!FromMobile) {
      alert('Please fill From Address Mobile');
      return;
    }
    setLoading(true);
    fetch(global.apiurl+"addaddress", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "customerid": user_id,
        "name": userName,
        "address": UserAddress,
        "address2":UserAddress2,
        "mobile": userMobileNumber,
        "city": UserCity,
        "quantity": quantity,
        "state": UserState,
        "pincode": UserPin,
        "fromname":FromName,
        "frommobile":FromMobile
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.success === true) {
          setModalVisible(false);
          setLoading(false);
          getuseraddress();
        } else {
          setErrortext(data.action);
        }
      })
  }
  
  FromAddressCheck = async() => {
    console.log(CompanyDetails);
    setLoading(true);
    // console.log(FromAddCheck);
    setFromAddCheck(!FromAddCheck);
    // console.log(FromAddCheck);
    if(FromAddCheck == true)
    {
      setFromName(CompanyDetails[0].name);
      setFromMobile(CompanyDetails[0].mobile);
    }
    else if(FromAddCheck == false)
    {
      setFromName(null);
      setFromMobile(null);
    }
    setLoading(false);
  }
  WalletCheckChange = () => {
    setWalletCheck(!WalletCheck); 
    if(WalletCheck == true)
    {
      setWalletDeductAmount(0);
    }
    else if (WalletCheck == false)
    {
      setWalletDeductAmount(WalletBalance);
    }
  }

  
  getdeliverypartnerdetails = (value) => {
    setLoading(true);
    fetch(global.apiurl+'getdeliverypartnerdetails', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson.details);
        var details = responseJson.details;
        var deliverypartner = [];
        details.forEach(function (item, index) {
          // console.log(item.name);
          if(value == 'COD' && item.cod == 1) {
            deliverypartner.push(item.name);
          }
          else if(value == 'Prepaid' && item.prepaid == 1) {
            deliverypartner.push(item.name);
          }
          setLoading(false);
        });
        //console.log(deliverypartner);
        setdeliverypartners(deliverypartner);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getDeliveryCharge= (delivery) => {
    setLoading(true);
    fetch(global.apiurl+"getdeliverycharge", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "addressid": userOption,
        "deliverypartner": delivery,
        "paymentmethod": userPaymentMethod,
        "quantity": TotalQuantity,
        "weight":TotalWeight
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      setLoading(false);
      console.log(responseJson)
      if (responseJson.success === true) {
        setDeliveryCharge(responseJson.deliverycharge);
      } else {
        setdeliverypartners(''); 
        getdeliverypartnerdetails(userPaymentMethod); 
        setDeliveryPartner(null);
        alert(responseJson.action);
      }
    })
  }

  paymodalfunction = (value) => {
    if (!userOption) {
      alert("Please Choose Address");
      return;
    }
    setPaymentModalVisible(true);
  }
  const handleSubmitButton = () => {
    if (!userPaymentMethod) {
      alert("Please Select Payment Method");
      return;
    }
    if (!userDeliveryPartner) {
      alert("Please Choose Delivery Partner")
      return;
    }
    // if (userPaymentMethod == 'COD' && !userMarginAmount) {
    //   alert("Please Enter Margin Amount")
    //   return;
    // }
    
    setLoading(true);
    //setIsRegistraionSuccess(true);
    fetch(global.apiurl+"createresellercartorder", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "customerid": user_id,
        "addressid": userOption,
        "usertype": user_type,
        "deliverypartner": userDeliveryPartner,
        "paymentmethod": userPaymentMethod,
        "cartid": cartid,
        "wallet_used":WalletCheck,
        "wallet_deduct":WalletDeductAmount,
        "deliveryCharges": DeliveryCharge,
        "discountPrice": TotalQuantity >= discountFrom ? (Number(discountPrice) * Number(TotalQuantity)) : 0
      })
    })
    .then(res => res.json())
    .then(data => {
      setLoading(false);
      console.log(data)
      if (data.success === true) {
        setIsRegistraionSuccess(true);
      } else {
        setErrortext(data.action);
      }
    })
  };
  const getStateCity = (pincode) => {
    fetch(global.apiurl+"get_state_city_by_pincode&pincode=" + pincode, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if (data.success === true) {
          setUserState(data.state);
          setUserCity(data.city);
        }
    })

  };



  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../../assets/images/favicon-maha.png')}
          style={{
            height: 250,
            resizeMode: 'contain',
            alignSelf: 'center'
          }}
        />
        <Text style={styles.successTextStyle}>
          Order Placed!!! Happy Shopping
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('Home')}>
          <Text style={styles.buttonTextStyle}>Shop More</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (

    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 7, backgroundColor: '#e4e4e4' }} onPress={() => setproductShow(!productShow)}>
          <Text style={styles.productdetailhead}>Product Details</Text>
          {productShow == true ? (
            <Icon
              name='chevron-up'
              type='feather'
              color='#000'
              onPress={() => setproductShow(!productShow)} />
          ) : null}
          {productShow == false ? (
            <Icon
              name='chevron-down'
              type='feather'
              color='#000'
              onPress={() => setproductShow(!productShow)} />
          ) : null}
        </TouchableOpacity>

        {productdata != '' && productShow == true ? (
          <View style={styles.productlist}>
              <Text style={styles.productdetailcustomer}>Customer Name : {productdata[0].customername}</Text>
            {productdata.map((item) => {
              return (
                <View style={styles.productview}>
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
                        <Text style={styles.itemfourSubtitle} numberOfLines={1}>
                          Quantity : {item.quantity}
                        </Text>
                        <Text style={styles.Amounttext}> Rs. {Number(item.reseller_price) + Number(item.product_total_price)} /-</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
        <Pressable
          style={styles.addaddressbtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle} > + Add Address</Text>
        </Pressable>
        {addressdata != '' ? (
          <View style={styles.addresslist}>
            <RadioGroup
              onSelect={(index, value) => selectHandler(value)}
              highlightColor='#dbdbdb'
              style={{ marginHorizontal:10}}
            >
              {addressdata.map((item) => {

                return (
                  
                  <RadioButton value={item.address_id}>
                    <Text style={styles.option}>
                      <Text style={styles.listadd}>Name : {item.name} </Text> {"\n"}
                      <Text style={styles.listadd}>Address : {item.address}</Text>{"\n"}
                      <Text style={styles.listadd}>State : {item.state}</Text>{"\n"}
                      <Text style={styles.listadd}>City : {item.city}</Text>{"\n"}
                      <Text style={styles.listadd}>Pincode : {item.pincode}</Text>{"\n"}
                      <Text style={styles.listadd}>{item.mobile}</Text>
                    </Text>
                  </RadioButton>

                );

              })}
            </RadioGroup>
          </View>
        ) : null}





        {errortext != '' ? (
          <Text style={styles.errorTextStyle}>
            {errortext}
          </Text>
        ) : null}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.PaymentcenteredView} onPress={() => setModalVisible(false)}>
            <View style={[styles.PaymentmodalView,{height:'90%'}]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.PaymentmodalText}>Enter Your Address Details</Text>
                <Icon name="close" type='font-awesome' color='#f43397' onPress={() => setModalVisible(false)} />
              </View>
              <View style={styles.divider} />
              
              <View style={{height: windowHeight/100 *75}}>
              <ScrollView>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserName) => setUserName(UserName)}
                  underlineColorAndroid="#f000"
                  placeholder="Enter Name"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    emailInputRef.current && emailInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserMobileNumebr) =>
                    setUserMobileNumber(UserMobileNumebr)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Phone Number"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  ref={addressInputRef}
                  returnKeyType="next"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  maxLength={10}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserAddress) =>
                    setUserAddress(UserAddress)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Address Line 1"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  ref={addressInputRef}
                  returnKeyType="next"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserAddress) =>
                    // setUserAddress(UserAddress)
                    setUserAddress2(UserAddress)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Address Line 2 (Optional)"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  ref={addressInputRef}
                  returnKeyType="next"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserPin) => {
                    setUserPin(UserPin);
                    getStateCity(UserPin);
                  }}
                  underlineColorAndroid="#f000"
                  placeholder="Enter Pincode"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  ref={addressInputRef}
                  returnKeyType="next"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <SelectDropdown
                  data={countries}
                  dropdownIconPosition="right"
                  defaultButtonText="Select State"
                  onSelect={(selectedItem, index) => {
                    setUserState(selectedItem)
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <FontAwesome name="chevron-down" color={"#444"} size={18} />
                    );
                  }}
                  buttonStyle={styles.dropdownaddBtnStyle}
                  buttonTextStyle={styles.dropdownaddBtnTxtStyle}
                  dropdownStyle={styles.dropdown1DropdownStyle}
                  rowStyle={styles.dropdown1RowStyle}
                  rowTextStyle={styles.dropdown1RowTxtStyle}
                  defaultValue={UserState}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserCity) =>
                    setUserCity(UserCity)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter City"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  ref={addressInputRef}
                  returnKeyType="next"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  value={UserCity}
                />
              </View>
              <Text style={styles.PaymentmodalText}>Enter From Address Details</Text>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(FromName) =>
                    setFromName(FromName)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Name"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  ref={addressInputRef}
                  returnKeyType="next"
                  value={FromName}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(FromMobile) =>
                    setFromMobile(FromMobile)
                  }
                  underlineColorAndroid="#f000"
                  placeholder="Enter Mobile"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  ref={addressInputRef}
                  returnKeyType="next"
                  value={FromMobile}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
              </View>
              <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5, marginBottom:30 }}>
                <CheckBox
                  value={FromAddCheck}
                  onValueChange={FromAddressCheck}
                  style={styles.checkbox}
                  tintColors="#000"
                  // disabled={item.stock >= 1 ? true : false}
                />
                <Text style={[styles.itemCustName,{marginTop:5,color:'black'}]}>Use My From Address</Text>
              </View>
              </ScrollView>
              </View>
              <View>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={adduseraddress}
                >
                  <Text style={styles.textStyle}> Add Address</Text>
                </Pressable>
                {/* <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle} >Close</Text>
                </Pressable> */}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <View style={styles.demoButtonsContainer}>
        <TouchableOpacity style={styles.opbuttons} onPress={() =>
          paymodalfunction(true)
        }>
          <View style={styles.searchbtnImageContainer}>

            <Text style={styles.itemOnebtnTitle}
              numberOfLines={1}>
              Place Order</Text>
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={PaymentmodalVisible}
        >
          <View style={styles.PaymentcenteredView} onPress={() => setPaymentModalVisible(false)}>
            <View style={styles.PaymentmodalView}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.PaymentmodalText}>Payments and Delivery Partner</Text>
                <Icon name="close" type='font-awesome' color='#f43397' onPress={() => setPaymentModalVisible(false)} />
              </View>
              <View style={styles.divider} />
              <View>
                  <Card style={styles.cardwidthmodal}>
                    <Text style={{ fontSize: 14, color:'black' }}>Payment Method</Text>  
                    <RadioGroup
                        onSelect={(index, value) => {
                          if(value == "COD"){
                            setSubtotal(ActualSubtotal);
                            if(userMarginAmount == 0 || userMarginAmount == null){
                              alert("Margin Amount Not Set");
                              setdeliverypartners('');
                              setDeliveryPartner(null);
                              return;
                            }
                          }
                          else if(value == "Prepaid") {
                            setSubtotal(Subtotal - userMarginAmount);
                          }
                          setPaymentMethod(value); setdeliverypartners(''); getdeliverypartnerdetails(value); setDeliveryPartner(null);
                        }}
                        
                        style={{ flexDirection:'row'}}
                      >
                        {paymentmethods.map((item) => {

                          return (
                            <RadioButton value={item}>
                              <Text style={styles.option}>{item}</Text>
                            </RadioButton>


                          );
                        })}
                      </RadioGroup>
                  </Card>
                
                  <Card style={styles.cardwidthmodal}>
                    <Text style={{ fontSize: 14, color:'black' }}>Select the Delivery Partner</Text>
                    <SelectDropdown
                      data={deliverypartners}
                      onSelect={(selectedItem, index) => {
                        
                        setDeliveryPartner(selectedItem);
                        getDeliveryCharge(selectedItem);
                      }}
                      defaultButtonText="Select Delivery Partner"
                      buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                      }}
                      rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                      }}
                      renderDropdownIcon={() => {
                        return (
                          <FontAwesome name="chevron-down" color={"#444"} size={18} />
                        );
                      }}
                      buttonStyle={styles.dropdown1BtnStyle}
                      buttonTextStyle={styles.dropdown1BtnTxtStyle}
                      dropdownIconPosition={"right"}
                      dropdownStyle={styles.dropdown1DropdownStyle}
                      rowStyle={styles.dropdown1RowStyle}
                      rowTextStyle={styles.dropdown1RowTxtStyle}
                    />
                  </Card>

                  {userOption != null && userPaymentMethod != null && userDeliveryPartner != null ? (
                    <View style={{ flexDirection: 'row', paddingTop: 0, paddingBottom: 0, marginTop:12, marginLeft:10 }}>
                    <CheckBox
                      value={WalletCheck}
                      onValueChange={() => WalletCheckChange()}
                      style={styles.checkbox}
                      tintColors="#000"
                    />
                    <Text style={[styles.itemCustName,{marginTop:5, color:'black'}]}>Use Wallet</Text>
                  </View>
                  ):null}
                  {WalletCheck == true ? (
                    <Card style={styles.cardwidthmodal}>
                    <Text style={{ fontSize: 14 }}>Wallet Balance - <Text style={{ color: 'red'}}>Rs. {WalletBalance}/-</Text></Text>  
                    <TextInput 
                      style={styles.inputStyle}
                      onChangeText={(value) => {
                        if(value > WalletBalance ) {
                          alert("Wallet Balance is Low");
                          setWalletDeductAmount(WalletBalance);
                        }
                        else
                        {
                          setWalletDeductAmount(value);
                        }
                        
                      }
                      }
                      underlineColorAndroid="#f000"
                      placeholder="Enter Wallet Deduction Amount"
                      placeholderTextColor="#8b9cb5"
                      autoCapitalize="sentences"
                      ref={addressInputRef}
                      returnKeyType="next"
                      value={WalletDeductAmount}
                      onSubmitEditing={Keyboard.dismiss}
                      blurOnSubmit={false}
                    />
                  </Card>
                  ):null}
                {userOption != null && userPaymentMethod != null && userDeliveryPartner != null ? (
                  <View style={styles.subtotbg}>
                    <View style={styles.subtotcont}>
                      <Text style={styles.pricetitle}>Sub Total</Text>
                      {userPaymentMethod == "Prepaid" ? (
                      <Text style={styles.pricerate}> Rs. {Subtotal}/- </Text>
                      ): null}
                      {userPaymentMethod == "COD" ? (
                      <Text style={styles.pricerate}> Rs. {Subtotal - userMarginAmount}/- </Text>
                      ): null}
                    </View>
                    {userPaymentMethod == "COD" ? (
                    <View style={styles.subtotcont}>
                      <Text style={styles.pricetitle}>Margin Amount</Text>
                      <Text style={styles.pricerate}> Rs. {userMarginAmount * quantity}/- </Text>
                    </View>
                    ): null}
                    <View style={styles.subtotcont}>
                      <Text style={styles.pricetitle}>Delivery Charges</Text>
                      <Text style={styles.pricerate}> Rs. {DeliveryCharge}/- </Text>
                    </View>
                    {WalletCheck == true ? (
                    <View style={styles.subtotcont}>
                      <Text style={styles.pricetitle}>Wallet Deduction</Text>
                      <Text style={styles.pricerate}> Rs. - {WalletDeductAmount}/- </Text>
                    </View>
                      ):null}

                    {(TotalQuantity >= discountFrom) ? (
                      <View style={styles.subtotcont}>
                          <Text style={styles.pricetitle}>Discount (Rs.{discountPrice} / Piece)</Text>
                          <Text style={styles.pricerate}> Rs. {Number(discountPrice) * Number(TotalQuantity)} /- </Text>
                        </View>
                    ): null}
                    <View style={styles.divtot} />
                    {/* <View style={styles.subtotcont}>
                      <Text style={styles.pricetitle}>Total</Text>
                      <Text style={styles.pricerate}> Rs. {Number(Subtotal) + Number(DeliveryCharge) - Number(WalletDeductAmount)}/- </Text>
                    </View> */}
                    <View style={styles.subtotcont}>
                      <Text style={styles.pricetitle}>Total</Text>
                      {/* <Text style={styles.pricerate}> Rs.{Number(total) + Number(deliverycharges)}/- </Text> */}
                      {(TotalQuantity >= discountFrom) ? (
                        <Text style={styles.pricerate}> Rs.{Number(Number(Subtotal) + Number(DeliveryCharge) - (Number(discountPrice) * Number(TotalQuantity))) - Number(WalletDeductAmount)}/- </Text>
                        ): <Text style={styles.pricerate}> Rs.{Number(Number(Subtotal) + Number(DeliveryCharge)) - Number(WalletDeductAmount)}/- </Text> }
                    </View>
                  </View>
                ):null}
                <View style={styles.divider} />
                <View style={{ marginTop: 30, flexDirection: 'row' }}>
                  <Pressable
                    style={[styles.Paymentbutton, styles.PaymentbuttonOpen]}
                    onPress={() => setPaymentModalVisible(false)}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.Paymentbutton, styles.PaymentbuttonClose]}
                    onPress={handleSubmitButton}
                  >
                    <Text style={styles.textStyle}> Place Order</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};
export default BuyNowScreenCartReseller;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    // height: 40,
    marginTop: 20,
    // marginLeft: 35,
    // marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#35baf5',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#f44db8',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    // paddingLeft: 15,
    // paddingRight: 15,
    // borderWidth: 1,
    // borderRadius: 30,
    borderBottomWidth: 1,
    borderColor: '#e4e4e4',
  },
  SelectStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'grey',
    maxHeight: 40,
  },
  SelectText: {
    fontSize: 16,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
    fontWeight: 'bold',
  },
  heading: {
    color: '#FC6CE4',
    textAlign: 'left',
    fontSize: 20,
    padding: 5,
    fontWeight: "bold",
  },
  userName: {
    color: 'black',
    fontSize: 18
  },
  pricetitle: {
    color: 'black',
    fontSize: 16,
    marginRight: 70,
  },
  pricerate: {
    color: 'black',
    fontSize: 16,
  },
  rate: {
    color: 'black',
    fontSize: 18,
    // marginTop: 8,
  },
  quantity: {
    color: 'black',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    flex: 1,
  },
  container: {
    // flex: 1,
    // marginTop: 10,
  },
  quantiitem: {
    width: '50%',
  },
  divider: {
    borderBottomColor: 'grey',
    //opacity: 0.2,
    borderBottomWidth: 1,
    margin: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    resizeMode: 'contain',

  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
    marginBottom: 5,
    padding: 10,
    overflow: 'hidden',
    // backgroundColor:'#DBEFF3'
    borderWidth: 1,
    borderColor: 'grey'


  },
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#1a91b8',
    padding: 5,
    // backgroundColor: '#eaf7fd',
    height: 45,
  },
  counters: {
    color: '#015169',
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    // marginRight:50,
    paddingVertical: 2,
    backgroundColor: '#03a9f3',
    flex: 0
  },
  countersleft: {
    color: '#015169',
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    paddingVertical: 2,
    backgroundColor: '#03a9f3',
    flex: 0
  },
  text: {
    color: '#015169',
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    // backgroundColor:'#03a9f3'
  },
  searchbtnImageContainer: {
    overflow: 'hidden',
    width: Dimensions.get('window').width / 2 - 10,
    alignItems: 'center',
    flexDirection: 'row'
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
    marginLeft: 50
  },
  opbuttons: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01a3d4",
    padding: 15,
    width: Dimensions.get('window').width,
  },
  subtotbg: {
    alignItems: 'flex-end',
    margin: 10,
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#F1EFF0',
  },
  subtotcont: {
    marginBottom: 7,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',

    overflow: 'hidden',
    // fontFamily:'Poppins'
  },
  divtot: {
    borderBottomColor: 'red',
    opacity: 0.8,
    borderBottomWidth: 3,
    margin: 4,
  },
  modalView: {
    margin: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18
  },
  // centeredView: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   // marginTop: 22
  //   backgroundColor: 'rgba(52, 52, 52, 0.8)'
  // },
  centeredView: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // marginTop: 22
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  addaddress: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 40,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  dropdown1BtnTxtStyle: { color: "#8b9cb5", textAlign: "left", fontSize: 12 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  option: {
    fontSize: 14,
    color: 'black',
    textAlign: 'left',
    marginLeft: 10,
    fontFamily: 'Poppins-Regular'
  },
  unselected: {
    backgroundColor: 'white',
    margin: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  selected: {
    backgroundColor: '#ECEAEB',
    margin: 6,
    padding: 20,
    borderRadius: 10,
  },
  addresslist: {
    paddingBottom: 300,
  },
  listadd: {
    margin: 10,
  },
  productlist: {
    padding: 5,
    // borderWidth:1,
    // borderColor:'grey'
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
  button: {
    // borderRadius:
    padding: 10,
    elevation: 2,
    marginHorizontal: 10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
    marginTop: 10
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  productview: {
    padding: 10,
    borderColor: "#e4e4e4",
    borderWidth: 1
  },
  productdetailhead: {
    fontSize: 16,
    fontFamily: fonts.primarySemiBold,
    padding: 5,
    color: '#000'
  },
  productdetailcustomer: {
    fontSize: 14,
    fontFamily: fonts.primaryRegular,
    padding: 5,
    color: '#000'
  },
  addaddressbtn: {
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#2196F3",
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
  PaymentmodalText: {
    marginBottom: 2,
    textAlign: "left",
    fontSize: 14, color:'black'
  },
  PaymentcenteredView: {
    flex: 1,
    width: '100%',
    // justifyContent: "center",
    // alignItems: "center",
    // marginTop: 22
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  dropdownaddBtnStyle: {
    width: '100%',
    height: 40,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
  },
  dropdownaddBtnTxtStyle: { color: "#8b9cb5", textAlign: "left", fontSize: 14 },
  Amounttext: { color:'black'}
});