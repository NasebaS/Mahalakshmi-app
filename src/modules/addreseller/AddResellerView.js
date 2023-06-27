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
  Alert,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DocumentPicker from 'react-native-document-picker';
import ImgToBase64 from 'react-native-image-base64';
import { Card,Rating, AirbnbRating,Icon,CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { useScrollToTop } from '@react-navigation/native';
const RegisterScreen = (props) => {
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem('user_id');
      const username = await AsyncStorage.getItem('user_name');
      const useremail = await AsyncStorage.getItem('user_email');
      const usertype = await AsyncStorage.getItem('user_type');
      if(id !== null) {
        // console.log(id);
        setUserId(id);
      }
    } catch(e) {
      // error reading value
    }
  }
  getData();
  const [userId, setUserId] = useState('');

  const [userBusinessName, setuserBusinessName] = useState('');
  const [userBusinessProof, setuserBusinessProof] = useState('');
  const [userGSTno, setuserGSTno] = useState('');

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);
  const gender = ["Male", "Female", "Trans"];
  const emailInputRef = createRef();
  const ageInputRef = createRef();
  const addressInputRef = createRef();
  const passwordInputRef = createRef();

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userBusinessName) {
      alert('Please Fill Business Name');
      return;
    }
    if (!userBusinessProof) {
      alert('Please Select Proof');
      return;
    }
    if (!userGSTno) {
      alert('Please Fill GST Number');
      return;
    }
    //Show Loader
    setLoading(true);
    
    fetch(global.apiurl+"createreseller", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "businessname":userBusinessName,
          "businessproof":userBusinessProof,
          "gstno":userGSTno,
          "userid":userId
        })
    })
        .then(res => res.json())
        .then(data => {
            //console.log(data)
            if (data.success === true) {
              setIsRegistraionSuccess(true);
              // console.log(
              //   'Registration Successful. Please Login to proceed'
              // );
              deletedata = async () => {
                await AsyncStorage.removeItem('user_id');
                await AsyncStorage.removeItem('user_name');
                await AsyncStorage.removeItem('user_email');
                await AsyncStorage.removeItem('user_type');
                
                props.navigation.navigate('Login');
              }
              setTimeout(() => {
                deletedata();
                }, 2000);
            } else {
              setErrortext(data.action);
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
          Your App User Account is Deactivated. Reseller Account Registered Successfully, We Will Mail You When Your Account is Activated!!!
        </Text>
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
        {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
        <KeyboardAvoidingView enabled>
        
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
              />
            </View>
          
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
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
    padding: 30,
    fontWeight:'bold',
    fontFamily:'Poppins-Regular'
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
    
  }
});