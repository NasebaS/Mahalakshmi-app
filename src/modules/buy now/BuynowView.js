import React, {useState, createRef} from 'react';
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
  Modal
} from 'react-native';
// import { Dropdown } from 'react-native-material-dropdown';
import { colors, fonts } from '../../styles';
import { CheckBox,Icon,Card } from 'react-native-elements'
import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from '@react-native-community/async-storage';
import HTMLView from 'react-native-htmlview';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Loader from '../../components/Loader';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
const RegisterScreen = (props) => {
  const [userName, setUserName] = useState('');
  const [UserAddress, setUserAddress] = useState('');
  const [UserAddress2, setUserAddress2] = useState('');
  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [UserCity, setUserCity] = useState('');
  const [UserPin, setUserPin] = useState('');
  const [UserState, setUserState] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);
  const [userOption, setAddressOption] = useState(null);
  const [userDeliveryPartner, setDeliveryPartner] = useState(null);
  const [userPaymentMethod, setPaymentMethod] = useState(null);
  const selectHandler = (value) => {
    // setLoading(true);
    setAddressOption(value);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [PaymentmodalVisible, setPaymentModalVisible] = useState(false);
  const [productname, setProductName] = useState('');
  //const [productrate, setProductRate] = useState('');
  const [productimage, setProductImage] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [user_id, setUserId] = useState('');
  const [addresscount, setaddresscount] = useState('');
  const [addressdata, setaddressdata] = useState('');
  const [deliverypartners, setdeliverypartners] = useState('');
  const [deliverycharges, setdeliverycharges] = useState(null);
  const [productdata, setproductdata] = useState(null);
  const [productShow, setproductShow] = useState(true);

  // const [defaultCity, setdefaultCity] = useState(null);
  // const [defaultState, setdefaultState] = useState(true);

  const [discountFrom, setdiscountFrom] = useState(null);
  const [discountTo, setdiscountTo] = useState(null);
  const [discountPrice, setdiscountPrice] = useState(null);

  const [ProductWeight, setProductWeight] = useState(0);

  const addressInputRef = createRef();
  // const countries = ["TamilNadu", "Kerala", "Karnataka", "Maharastra"];
  const [countries, setcountries] = useState('');
  const paymentmethods = ["Prepaid", "COD"];

  const { actionbuy } = props.route.params;
  const { productid } = props.route.params;
  const { productprice } = props.route.params;
  const { productsize } = props.route.params;
  const { productcolor } = props.route.params;
  const { productcode } = props.route.params;
  const { productquantity } = props.route.params;
  //const addressdata = [{name:"welcome"},{name:"hello"}];
  fetchprouctdetails = () => {
    fetch(global.apiurl+'getsingleproductdetails&id='+productid,{
       method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
       console.log(responseJson);

       setProductWeight(responseJson.weight);
       setProductName(responseJson.productdetails[0]['producttitle']);
       //setProductRate(responseJson.productdetails[0]['mrp_price']);
       setProductImage(responseJson.productimages[0]['image_path']);
       setproductdata(responseJson.productdetails);
       const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('user_id')
          // console.log(value);
          if(value !== null) {
            //console.log(value);
            setUserId(value);
          }
        } catch(e) {
          // error reading value
        }
        //getuseraddress(user_id);
      }
      getData();
    })
    .catch((error) => {
       console.error(error);
    });
  }
  
  React.useEffect(() => {
    
    
    
    
     getuseraddress = async () => {
      var userid = await AsyncStorage.getItem('user_id');
      fetch(global.apiurl+'getaddressdetails&id='+userid,{
           method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson);
          if(responseJson.details != "No Address Listed")
          {
            console.log(responseJson);
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

    getdiscountprice = () => {
      fetch(global.apiurl+'get_discount_value',{
           method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
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
    //getdeliverypartnerdetails();
    getuseraddress();
    fetchprouctdetails();
    getdiscountprice();
     
   },[props]);
  
    increment = () => setQuantity(Number(quantity) + 1);
    decrement = () => setQuantity(Number(quantity) - 1);
    
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
      }else if(userMobileNumber.length != 10){
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
    setLoading(true);
    fetch(global.apiurl+"addaddress", {
      method: "POST",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "customerid": user_id,
        "name":userName,
        "address":UserAddress,
        "address2":UserAddress2,
        "mobile":userMobileNumber,
        "city":UserCity,
        "quantity":quantity,
        "state":UserState,
        "pincode":UserPin
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
  paymodalfunction = (value) => {
    if(!userOption)
    {
      alert("Please Choose Address");
      return;
    }
    setPaymentModalVisible(true);
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
        "quantity": productquantity,
        "weight":productquantity * ProductWeight
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(JSON.stringify({
        "addressid": userOption,
        "deliverypartner": delivery,
        "paymentmethod": userPaymentMethod,
        "quantity": productquantity,
        "weight":ProductWeight
      }))
      setLoading(false);
      console.log(responseJson)
      if (responseJson.success === true) {
        setdeliverycharges(responseJson.deliverycharge);
      } else {
        setdeliverypartners(''); 
        getdeliverypartnerdetails(userPaymentMethod); 
        setDeliveryPartner(null);
        alert(responseJson.action);
      }
    })
  }
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

  }

  const handleSubmitButton = () => {
    if(!userPaymentMethod)
    {
      alert("Please Select Payment Method");
      return;
    }
    if(userPaymentMethod != 'Cash on Delivery' && !userDeliveryPartner)
    {
      alert("Please Choose Delivery Partner")
      return;
    }
    //Show Loader
    setLoading(true);
    //setIsRegistraionSuccess(true);
    var totalprice = Number(Number(productprice) * Number(productquantity)); 

    if(productquantity >= discountFrom) {
      totalprice = Number(totalprice) - Number(Number(productquantity) * Number(discountPrice));
    }

    fetch(global.apiurl+"createorder", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "productid": productid,
          "customerid": user_id,
          "addressid": userOption,
          "price":totalprice,
          "size":productsize,
          "quantity":productquantity,
          "color":productcolor,
          "productcode":productcode,
          "deliverypartner":userDeliveryPartner,
          "paymentmethod":userPaymentMethod,
          "discountPrice": productquantity >= discountFrom ? Number(Number(productquantity) * Number(discountPrice)) : 0,
          "deliveryCharge":deliverycharges
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.success === true) {
              setIsRegistraionSuccess(true);
            } else {
              setErrortext(data.action);
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
    
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
        {/* <Text h1 style={styles.heading} >Please Enter Details</Text> */}
          {/* <Image
            source={require('../../../assets/images/favicon-maha.png')}
            style={{
              width: '50%',
              height: 100,
              resizeMode: 'contain',
              margin: 30,
            }}
          /> */}
        </View>
        {/* <Text style={styles.heading}>Product Details</Text> */}
        {/* <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{uri : global.apiurl+'image/'+productimage}}
          />
          <View style={{ paddingLeft: 15 }}>
            <Text style={styles.userName}>{productname}</Text>
              <View style={styles.container}>
                  <Text style={styles.quantity}>Size : {productsize} </Text>
                  <Text style={styles.quantity}></Text>
                  <TouchableOpacity onPress={this.decrement}>
                      <Text style={styles.countersleft}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.text}>{quantity}</Text>
                  <TouchableOpacity onPress={this.increment}>
                      <Text style={styles.counters}>+</Text>
                  </TouchableOpacity>
              </View>
            <Text style={styles.rate}>Rs. {productprice}/- </Text>
          </View>
        </View> */}
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
        {productdata != null && productShow == true ? (
          <View style={styles.productlist}>
            {productdata.map((item) => {
              return (
                <View style={styles.productview}>
                  <View style={styles.itemThreeSubContainer}>
                    <Image source={{ uri: global.apiurl+'image/' + productimage }} style={styles.itemThreeImages} />
                    <View style={styles.itemThreeContent}>
                      <Text style={styles.itemThreeBrand}>{item.producttitle}</Text>
                      <View>
                        <Text style={styles.itemThreeSubtitle} numberOfLines={1}>
                          {item.productname}
                        </Text>
                        <Text style={styles.itemfourSubtitle} numberOfLines={1}>
                          Size : {productsize}
                        </Text>
                        <Text style={styles.itemfourSubtitle} numberOfLines={1}>
                          Product Code : {item.productcode}
                        </Text>
                        {/* <Text style={styles.itemfourSubtitle} numberOfLines={1}>
                          Color : {item.color}
                        </Text> */}
                        <Text style={styles.itemfourSubtitle} numberOfLines={1}>
                          Quantity : {productquantity}
                        </Text>
                        <Text style={styles.Amounttext}> Rs. {Number(productprice)} /-</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
        {/* <View style={styles.divider} /> */}
        {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
         <Pressable
        style={styles.addaddressbtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle} > + Add Address</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.PaymentcenteredView}>
          <View style={[styles.PaymentmodalView,{height:'90%'}]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.PaymentmodalText}>Enter Your Address Details</Text>
                <Icon name="close" type='font-awesome' color='#f43397' onPress={() => setModalVisible(false)} />
              </View>
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
            dropdownIconPosition={"right"}
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
          <View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={adduseraddress}
            >
              <Text style={styles.addaddress}> Add Address</Text>
            </Pressable>
            
          </View>
          </View>
        </View>
      </Modal>
      <ScrollView>
      {addressdata != '' ? (
      <View style={styles.addresslist}>
        <RadioGroup
        onSelect = {(index, value) =>  selectHandler(value)}
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
     </ScrollView>
      </ScrollView>
      <View style={styles.demoButtonsContainer}>
        
      <TouchableOpacity style={styles.opbuttons} onPress={ ()=> paymodalfunction(true)}>
        <View style={styles.searchbtnImageContainer}>        
          
            <Text style={styles.itemOnebtnTitle}
            numberOfLines={1}  > 
              Place Order</Text>
        </View>
      </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={PaymentmodalVisible}
      >
        <View style={styles.PaymentcenteredView} onPress={() => setPaymentModalVisible(false)}>
          <View style={styles.PaymentmodalView}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.PaymentmodalText}>Payments and Delivery Partner</Text>
            <Icon name="close"  type='font-awesome' color='#f43397' onPress={() => setPaymentModalVisible(false)} />
            </View>
            <View style={styles.divider} />
              <View>
              
              <Card style={styles.cardwidthmodal}>
                <Text style={{ fontSize: 14, color:'black' }}>Payment Method</Text>  
                <RadioGroup
                    onSelect={(index, value) => {setPaymentMethod(value); setdeliverypartners(''); getdeliverypartnerdetails(value); setDeliveryPartner(null);}}
                    
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
                  <Text style={{fontSize:14, color:'black'}}>Select the Delivery Partner</Text>
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
              {deliverycharges != null ? (
              <View style={styles.subtotbg}>
                <View style={styles.subtotcont}>
                  <Text style={styles.pricetitle}>Sub Total</Text>
                  <Text style={styles.pricerate}> Rs. {Number(productprice) * Number(productquantity)}/- </Text>
                </View>
                <View style={styles.subtotcont}>
                  <Text style={styles.pricetitle}>Delivery Charges</Text>
                  <Text style={styles.pricerate}> Rs. {deliverycharges}/- </Text>
                </View>
                {(productquantity >= discountFrom) ? (
                   <View style={styles.subtotcont}>
                      <Text style={styles.pricetitle}>Discount (Rs.{discountPrice} / Piece)</Text>
                      <Text style={styles.pricerate}> Rs. {Number(discountPrice) * Number(productquantity)} /- </Text>
                    </View>
                ): null}
                {/* <View style={styles.subtotcont}>
                  <Text style={styles.pricetitle}>GST (CGST + SGST)</Text>
                  <Text style={styles.pricerate}> Rs. 020/- </Text>
                </View> */}
                <View style={styles.divtot} />
                <View style={styles.subtotcont}>
                  <Text style={styles.pricetitle}>Total</Text>
                  {(productquantity >= discountFrom) ? (
                   <Text style={styles.pricerate}> Rs.{Number(productprice) * Number(productquantity) + Number(deliverycharges) - (Number(discountPrice) * Number(productquantity))} /- </Text>
                  ): <Text style={styles.pricerate}> Rs.{Number(productprice) * Number(productquantity) + Number(deliverycharges)} /- </Text>}
                
                </View>
              </View>
              ): null}
              <View style={styles.divider} />
              <View style={{marginTop:30, flexDirection:'row'}}>
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
  );
};
export default RegisterScreen;

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
  SelectStyle:{
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'grey',
    maxHeight: 40,
  },
  SelectText:{
    fontSize:16,
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
    fontWeight:'bold',
  },
  heading: {
    color: '#FC6CE4',
    textAlign:'left',
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
    marginRight:70,
  },
  pricerate: {
    color: 'black',
    fontSize: 16,
  },
  rate:{
    color: 'black',
    fontSize: 18,
    // marginTop: 8,
  },
  quantity:{
    color: 'black',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    flex:1,
  },
  container: {
    // flex: 1,
    // marginTop: 10,
  },
  quantiitem: {
    width:'50%',
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
    resizeMode:'contain',

  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
    marginBottom: 5,
    padding:5,
    overflow:'hidden'
    // backgroundColor:'#DBEFF3'
  
    
  },
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#1a91b8',
    padding: 5,
    // backgroundColor: '#eaf7fd',
    height:45,
},
counters: {
    color: '#015169',
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    // marginRight:50,
    paddingVertical:2,
    backgroundColor:'#03a9f3',
    flex:0
},
countersleft: {
  color: '#015169',
  fontWeight: 'bold',
  fontSize: 20,
  paddingHorizontal: 10,
  alignItems:'flex-end',
  paddingVertical:2,
  backgroundColor:'#03a9f3',
  flex:0
},
text:{
     color: '#015169',
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical:2,
    // backgroundColor:'#03a9f3'
},
searchbtnImageContainer: {    
  overflow: 'hidden',
  width: Dimensions.get('window').width / 2-10,
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
  marginLeft:Dimensions.get('window').width / 20,
},
itemOnebtnTitle: {
  fontSize: 17,
  fontWeight:'bold',
  color:'white',
  marginLeft:50
},
opbuttons: {
  alignItems: "center",
  justifyContent:"center",
  backgroundColor: "#01a3d4",
  padding: 15,
  width: Dimensions.get('window').width,
},
subtotbg:{
  alignItems: 'flex-end',
  margin: 10,
  marginBottom: 5,
  padding:5,
  backgroundColor:'#F1EFF0',
},
subtotcont:{
  marginBottom:7,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
 
  overflow:'hidden',
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
button: {
  // borderRadius:
  padding: 10,
  elevation: 2,
  marginHorizontal:10
},
buttonOpen: {
  backgroundColor: "#F194FF",
  marginTop:10
},
buttonClose: {
  backgroundColor: "#2196F3",
},
textStyle: {
  color: "white",
  fontWeight: "bold",
  textAlign: "center"
},
modalText: {
  marginBottom: 15,
  textAlign: "center",
  fontSize:18
},
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  // marginTop: 22
  backgroundColor: 'rgba(52, 52, 52, 0.8)'
},
addaddress:{
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: 16
},
dropdown1BtnStyle: {
  width:'100%',
  height: 40,
  backgroundColor: "#FFF",
  borderBottomWidth: 1,
  borderBottomColor: "#444",
},
dropdown1BtnTxtStyle: { color: "#8b9cb5", textAlign: "left" , fontSize:12},
dropdown1DropdownStyle: { backgroundColor: "#EFEFEF"},
dropdown1RowStyle: {
  backgroundColor: "#EFEFEF",
  borderBottomColor: "#C5C5C5",
},
dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
option: {
  fontSize: 14,
  color: 'black',
  textAlign: 'left',
  marginLeft:10
},
unselected: {
  backgroundColor: 'white',
  margin: 5,
  padding:10,
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
  paddingBottom:300,
},
listadd:{
  margin:10,
},
PaymentmodalText: {
  marginBottom: 2,
  textAlign: "left",
  fontSize:14,
  color:'#000'
},
PaymentcenteredView: {
  flex: 1,
  width:'100%',
  height:Dimensions.get('window').height,
  // justifyContent: "center",
  // alignItems: "center",
  // marginTop: 22
  backgroundColor: 'rgba(52, 52, 52, 0.8)'
},
PaymentmodalView: {
  // margin: 15,
  backgroundColor: "white",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
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
  position:'absolute',
  bottom:0,
  width:'100%',
},
Paymentbutton: {
  // borderRadius:
  padding: 10,
  width:'45%',
  marginHorizontal:10
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
dropdownaddBtnStyle: {
  width: '100%',
  height: 40,
  backgroundColor: "#FFF",
  borderBottomWidth: 1,
  borderBottomColor: "#e2e2e2",
},
dropdownaddBtnTxtStyle: { color: "#8b9cb5", textAlign: "left", fontSize: 14 },
productdetailhead: {
  fontSize: 16,
  fontFamily: 'Poppins-SemiBold',
  padding: 5,
  color: '#000'
},
productlist: {
  padding: 5,
  // borderWidth:1,
  // borderColor:'grey'
},
productdetailcustomer: {
  fontSize: 14,
  fontFamily: fonts.primaryRegular,
  padding: 5,
  color: '#000'
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
itemThreeSubContainer: {
  flexDirection: 'row',
  paddingVertical: 10,
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
Amounttext: {
  color:'#000'
}
});