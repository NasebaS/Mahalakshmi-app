import React, {useState, createRef, useEffect} from 'react';
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
  Modal,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import { RadioButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import ImgToBase64 from 'react-native-image-base64';
import { Card,Rating, AirbnbRating,Icon,CheckBox } from 'react-native-elements';

// const state = ["Tamilnadu", "Kerala", "Karnataka", "Maharastra"];
// const district = ["Salem", "Chennai", "Madurai", "Theni"];
const ProofLists = ["WA Group ScreenShot","Youtube","Instagram","Shop Image","Others"]
const RegisterScreen = (props) => {
  const [userName, setUserName] = useState('');
  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [userState, setUserState] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userConfPassword, setUserConfPassword] = useState('');
  const [CustTypevalue, setCustTypeValue] = React.useState('APP USER');

  const [userBusinessName, setuserBusinessName] = useState('');
  const [userBusinessProof, setuserBusinessProof] = useState('');
  const [userGSTno, setuserGSTno] = useState('');

  const [BusinessPreview, setBusinessPreview] = useState(null);
  const [TypeofProof, setTypeofProof] = useState(null);
  

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
 
  const [tandc, settandc] = useState(false);
  const [TandcModal, setTandcModal] = useState(false);
  const [
    isRegistraionSuccessUser,
    setIsRegistraionSuccessUser
  ] = useState(false);
  const [
    isRegistraionSuccessReseller,
    setIsRegistraionSuccessReseller
  ] = useState(false);
  
  const [StateList, setStateList] = useState([]);

  useEffect(() => {
    getstatelists();
  });
  
  const emailInputRef = createRef();
  const ageInputRef = createRef();
  const addressInputRef = createRef();
  const passwordInputRef = createRef();

  const handleSubmitButton = () => {
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
    if (!userState) {
      alert('Please Select State');
      return;
    }
    if (!userCity) {
      alert('Please Select City');
      return;
    }
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (typeof userEmail !== "undefined") {
        
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(userEmail)) {
        alert('Enter Valid Email Address');
        return;
      }
      
    }

    
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    if (!userConfPassword) {
      alert('Please fill Confirm Password');
      return;
    }
    if (userConfPassword != userPassword) {
      alert('Password Does Not Match');
      return;
    }
    if (CustTypevalue == "RESELLER" && !userBusinessName) {
      alert('Please Fill Business Name');
      return;
    }
    if (CustTypevalue == "RESELLER" && !TypeofProof) {
      alert('Please Select the Type of Proof');
      return;
    }
    if (CustTypevalue == "RESELLER" && !userBusinessProof) {
      alert('Please Select Proof');
      return;
    }
    // if (CustTypevalue == "RESELLER" && !userGSTno) {
    //   alert('Please Fill GST Number');
    //   return;
    // }
    if(tandc != true)
    {
      alert('Please Read Terms and Condition');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      name: userName,
      email: userEmail,
      mobilnumber:userMobileNumber,
      password: userPassword,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch(global.apiurl+"createuser", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "custype":CustTypevalue,
          "name": userName,
          "mobilnumber":userMobileNumber,
          "state":userState,
          "city":userCity,
          "email": userEmail,
          "password": userPassword,
          "businessname":userBusinessName,
          "businessproof":userBusinessProof,
          "gstno":userGSTno,
          "prooftype":TypeofProof
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.success === true) {
              if(CustTypevalue == "APP USER") {
                setIsRegistraionSuccessUser(true);
              }
              if(CustTypevalue == "RESELLER") {
                setIsRegistraionSuccessReseller(true);
              }
              console.log(
                'Registration Successful. Please Login to proceed'
              );
            } else {
              alert(data.action);
              if(data.action == "Phone Number Already Exists"){
                setUserMobileNumber('');
              }
              if(data.action == "Email Already Exists"){
                setUserEmail('');
              }
            }
        })
    // fetch('http://localhost:3000/api/user/register', {
    //   method: 'POST',
    //   body: formBody,
    //   headers: {
    //     //Header Defination
    //     'Content-Type':
    //     'application/x-www-form-urlencoded;charset=UTF-8',
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     //Hide Loader
    //     setLoading(false);
    //     console.log(responseJson);
    //     // If server response message same as Data Matched
    //     if (responseJson.status === 'success') {
    //       setIsRegistraionSuccess(true);
    //       console.log(
    //         'Registration Successful. Please Login to proceed'
    //       );
    //     } else {
    //       setErrortext(responseJson.msg);
    //     }
    //   })
    //   .catch((error) => {
    //     //Hide Loader
    //     setLoading(false);
    //     console.error(error);
    //   });
  };
  const getstatelists = () => {
    fetch(global.apiurl+'getstatelists',{
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson.details);
        setStateList(responseJson.details);
      })
      .catch((error) => {
         console.error(error);
      });
  };
  
  selectFile = async () => {


    try {
      const images = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      
      const fileName = images[0].uri.replace("file://", "");
      let data = '';
      ImgToBase64.getBase64String(images[0].uri)
        .then(base64String => {
          let base64 = `data:${images[0].type};base64,` + base64String
          const param = {
            base64: base64,
            name: images[0].name,
            type: images[0].type,
            size: images[0].size,
            fileName: images[0].name
          }
          // this.setState({ images: param });
          setuserBusinessProof(param);
          setBusinessPreview(base64)
        })
        .catch(err => alert('Canceled'));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('Cancelled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }
  if (isRegistraionSuccessUser) {
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
          User Registered Successfully Please Login 
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (isRegistraionSuccessReseller) {
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
          Reseller Registered Successfully Please Login 
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <Loader loading={loading} /> */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        {/* <View style={{alignItems: 'center'}}>
        <Text h1 style={styles.heading} >Sign Up to Continue</Text>
          <Image
            source={require('../../../assets/images/favicon-maha.png')}
            style={{
              width: '50%',
              height: 100,
              resizeMode: 'contain',
              margin: 30,
            }}
          />
        </View> */}
        {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
        <KeyboardAvoidingView enabled>
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
              onChangeText={(UserAddress) =>
                setUserMobileNumber(UserAddress)
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
              value={userMobileNumber}
            />
          </View>
          <View style={styles.SectionStyle}>
            <SelectDropdown
              data={StateList}
              buttonStyle={styles.SelectinputStyle}
              buttonTextStyle={styles.SelectTextinputStyle}
              defaultButtonText="Select State"
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
                setUserState(selectedItem);
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
            />
          </View>
          <View style={styles.SectionStyle}>
            {/* <SelectDropdown
              data={district}
              buttonStyle={styles.SelectinputStyle}
              buttonTextStyle={styles.SelectTextinputStyle}
              defaultButtonText="Select City"
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setUserCity(selectedItem);
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
            /> */}
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserCity(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter City"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
              value={userEmail}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                setUserPassword(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                ageInputRef.current &&
                ageInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                setUserConfPassword(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Confirm Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                ageInputRef.current &&
                ageInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionRadioStyle}>
              <Text style={{fontFamily:'Poppins-Regular',color:'#8b9cb5'}}>Are You?</Text>
              <RadioButton.Group onValueChange={newValue => setCustTypeValue(newValue)} value={CustTypevalue}>
                <View style={{ flexDirection: 'row', height:50}}>
                  <RadioButton value="APP USER" />
                  <Text style={styles.RadioButtonTextStyle}>Customer</Text>
                  <RadioButton value="RESELLER" />
                  <Text style={styles.RadioButtonTextStyle}>Reseller / Wholeseller</Text>
                </View>
              </RadioButton.Group>
          </View>
          {CustTypevalue == "RESELLER" ? (
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(BusinessName) => setuserBusinessName(BusinessName)}
              underlineColorAndroid="#f000"
              placeholder="Enter Business Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          ): null}
          {CustTypevalue == "RESELLER" ? (
          <View style={styles.SectionStyle}>
            <SelectDropdown
              data={ProofLists}
              buttonStyle={styles.SelectinputStyle}
              buttonTextStyle={styles.SelectTextinputStyle}
              defaultButtonText="Select Type of Proof"
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
                setTypeofProof(selectedItem);
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
            />
          </View>
          ): null}
          {CustTypevalue == "RESELLER" ? (
              <TouchableOpacity
                style={styles.UploadbuttonStyle}
                // activeOpacity={0.5}
                onPress={selectFile} >
                  <Icon
                  name='upload'
                  type='feather'
                  color='#8b9cb5'
                />  
                <Text style={styles.buttonUploadTextStyle}>
                Upload Any Proof of Your Business</Text>
              </TouchableOpacity>
          ): null}
          {CustTypevalue == "RESELLER" && BusinessPreview != null ? (
              <Image
                source={{
                  uri: BusinessPreview,
                }}
                style={{
                  width: '100%',
                  height: 100,
                  resizeMode: 'contain',
                  margin: 5
                }}
              />
          ): null}
         {CustTypevalue == "RESELLER" ? (
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserName) => setuserGSTno(UserName)}
                underlineColorAndroid="#f000"
                placeholder="Enter GST Number"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() =>
                  emailInputRef.current && emailInputRef.current.focus()
                }
                blurOnSubmit={false}
                maxLength={15}
              />
            </View>
            ): null}
            <View style={{marginLeft: 20,marginTop:20, flexDirection:'row'}}>
              <CheckBox
                left
                checked={tandc}
                onPress={() => settandc(!tandc)}
              />
              <TouchableOpacity
              onPress={() => console.log("Working")} 
              >
              <Text style={styles.TermCondTextStyle}
              onPress={() => setTandcModal(true)}>
                Read Terms and Conditons and Accept</Text>
              </TouchableOpacity>
              
            </View>
          
          {/* <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserAge) => setUserAge(UserAge)}
              underlineColorAndroid="#f000"
              placeholder="Enter Age"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
              ref={ageInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                addressInputRef.current &&
                addressInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View> */}
          
          
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={TandcModal}
      >
        <View style={styles.centeredView} onPress={() => setTandcModal(false)}>
          <View style={styles.modalView}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.modalText}>Terms and Condition</Text>
            <Icon name="close"  type='font-awesome' color='#f43397' onPress={() => setTandcModal(false)} />
            </View>
            <View style={styles.divider} />
            <Text>1. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            <Text>2. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            <Text>3. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            <Text>4. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            <Text>5. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            <Text>6. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            <Text>7. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            <Text>8. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            <Text>9. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>

          
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
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  SectionRadioStyle:{
    flexDirection: 'column',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#35baf5',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#35baf5',
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
    fontFamily:'Poppins-Regular'
  },
  buttonTextStyle: {
    color: '#FFF',
    paddingVertical: 10,
    fontSize: 16,
    fontFamily:'Poppins-Regular',
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E3E1E1',
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
    fontFamily:'Poppins-Regular',
    padding: 30,
    fontWeight:'bold',
  },
  heading: {
    color: '#35baf5',
    flex:1,
    textAlign:'left',
    fontSize: 22,
    padding: 20,
    fontWeight: "bold",
  },
  SelectinputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E3E1E1',
    backgroundColor:'#fff',
    height:42
  },
  SelectTextinputStyle: {
    color:'#8b9cb5',
    textAlign:'left',
    fontSize:16,
  },
  RadioButtonTextStyle:{
    paddingTop:8,paddingLeft:8,paddingRight:8,fontSize:14,fontFamily:'Poppins-Regular',color:'#8b9cb5'
  },
  UploadbuttonStyle:{
    
    borderWidth: 1,
    color: 'red',
    borderColor: '#ab8ce4',
    height: 45,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 10,
    padding:10,
    fontFamily:'Poppins-Regular',
    flexDirection:'row'
  },
  buttonUploadTextStyle: {
    color: '#8b9cb5',
    paddingVertical: 10,
    fontSize: 14,
    fontFamily:'Poppins-Regular',
    marginLeft:20
  },
  TermCondTextStyle: {
    color: '#8b9cb5',
    paddingVertical: 10,
    fontSize: 14,
    fontFamily:'Poppins-Regular',
    marginTop:5,
    textDecorationLine:'underline',
    textDecorationColor:'#35baf5'
    
  },
  
  cardwidth:{
    // flex: 1, width: 100,
    marginLeft: 3, marginRight: 3
  },
  cardwidthmodal:{
    flex: 1, width: 100,
  },
  
  modalView: {
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
    position:'absolute',
    bottom:0,
    width:'100%'
  },
  button: {
    // borderRadius:
    padding: 10,
    width:'45%',
    marginHorizontal:10
  },

  modalText: {
    marginBottom: 2,
    textAlign: "left",
    fontSize:14
  },
  centeredView: {
    flex: 1,
    width:'100%',
    // justifyContent: "center",
    // alignItems: "center",
    // marginTop: 22
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  divider: {
    borderBottomColor: 'black',
    opacity: 0.2,
    borderBottomWidth: 1,
    width:'100%',
    marginTop:10,
    marginBottom:5,
    textAlign: "left",
  },
});