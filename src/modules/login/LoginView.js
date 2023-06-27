// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Loader from '../../components/Loader';
const logo = require('../../../assets/images/favicon-maha.png');
const LoginScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [user, setUser] = useState();
  const [loader,setLoader] = useState(true);
  React.useEffect(() => {
    getData();
  }, [navigation]);
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem('user_id');
      if(id !== null) {
        navigation.navigate('Home');
        setTimeout(function() {
          setLoader(false);
        }, 1500);
        
      }
      else{
        setLoader(false);
      }
    } catch(e) {
      // error reading value
    }
  };
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoader(true);
      getData();
      setUserEmail(null);
      setUserPassword(null);
    });
    return unsubscribe;
  }, [navigation]);

  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    // navigation.navigate('Home');
    //alert(user_id);
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    setLoading(true);
    let dataToSend = {email: userEmail, password: userPassword};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    //console.log(userEmail, userPassword)
    fetch(global.apiurl+"userlogin", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": userEmail,
            "password": userPassword
        })
    })
        .then(res => res.json())
        .then(async data => {
            //console.log(data)
            if (data.success === true) {
            setUserEmail(null);
            setUserPassword(null);
            await AsyncStorage.setItem('user_id', data.user_id.toString());
            await AsyncStorage.setItem('user_name', data.username.toString());
            await AsyncStorage.setItem('user_email', data.email.toString());
            await AsyncStorage.setItem('user_type', data.type.toString());
            // console.log(await AsyncStorage.getItem('user_id'));
            // alert(await AsyncStorage.getItem('user_id'));
            navigation.navigate('Home');
          } else {
            //setErrortext(data.action);
            alert('Please check your email id or password');
          }
        })
  //   fetch('https://www.mahalakshmi.binary-clouds.com/userlogin', {
  //     method: 'POST',
  //     body: formBody,
  //     headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  // },
  //   })
  //     .then((response) => {
  //      console.log(response);
  //     })
  //     .then((responseJson) => {
  //       //Hide Loader
  //       setLoading(false);
  //       //console.log(responseJson);
  //       // If server response message same as Data Matched
  //       // if (responseJson.status === 'success') {
  //       //   AsyncStorage.setItem('user_id', responseJson.data.email);
  //       //   console.log(responseJson.data.email);
  //       //   navigation.replace('DrawerNavigationRoutes');
  //       // } else {
  //       //   setErrortext(responseJson.msg);
  //       //   alert('Please check your email id or password');
  //       // }
  //     })
  //     .catch((error) => {
  //       //Hide Loader
  //       setLoading(false);
  //       console.error(error);
  //     });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loader} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              <Image
                source={logo}
                style={{
                  width: '50%',
                  height: 100,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) =>
                  setUserEmail(UserEmail)
                }
                placeholder="Enter Email / Mobile Number" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
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
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
                value={userPassword}
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Forgot Password')}
            >
              <Text style={styles.registerTextStyle}>Forgot Password</Text>
            </TouchableOpacity>
            {/* <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('Become a Reseller')}>
              Become a Reseller ? Register
            </Text> */}
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('Sign Up')}>
             Signup as Customer / Reseller 
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    // height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#00a3d7',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    // height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Poppins-Regular"
  },
  inputStyle: {
    flex: 1,
    height:40,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#f43397',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
    fontFamily: "Poppins-Regular",
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});