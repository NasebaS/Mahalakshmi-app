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
const ForgotPasswordScreen = (props) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userReenterPassword, setUserReenterPassword] = useState('');
  const [userotp, setUserotp] = useState('');
  const [otpsent, setOtpSent] = useState(false);

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
    fetch(global.apiurl+"ForgotPasswordSendOTP", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": userEmail
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.success === true) {
              setOtpSent(true);
              alert(data.action);
            } else {
              alert(data.action);
            }
        })
  };
  const ChangePasswordSubmitButton = () => {
    if (!userotp) {
      alert('Please fill OTP');
      return;
    }
    if (!userPassword) {
      alert('Please fill New Password');
      return;
    }
    if (!userReenterPassword) {
      alert('Please fill Reenter Password');
      return;
    }
    
    fetch(global.apiurl+"ForgotPassword_Change", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": userEmail,
          "otp" : userotp,
          "password" : userPassword,
          "reenterpassword" : userReenterPassword
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.success === true) {
              setOtpSent(true);
              setIsRegistraionSuccess(true)
            } else {
              alert(data.action);
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
          Password Changed Successfully
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
        
        <KeyboardAvoidingView enabled>
          {otpsent == false ? (
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
            />
          </View>
          ) : null}

          {otpsent == true ? (
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserOtp) => setUserotp(UserOtp)}
              underlineColorAndroid="#f000"
              placeholder="Enter OTP"
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
          ) : null}

          {otpsent == true ? (
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) => setUserPassword(UserPassword)}
              underlineColorAndroid="#f000"
              placeholder="Enter New Password"
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
           ) : null}

          {otpsent == true ? (
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserReenterPassword) =>
                setUserReenterPassword(UserReenterPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Reenter New Password"
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
           ) : null}

          {otpsent == false ? (
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>Send OTP</Text>
          </TouchableOpacity>
          ) : null}

          {otpsent == true ? (
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={ChangePasswordSubmitButton}>
            <Text style={styles.buttonTextStyle}>Change Password</Text>
          </TouchableOpacity>
           ) : null}

        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
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
    fontFamily:'Poppins-Regular'
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'grey',
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
  dropdown1BtnStyle: {
    width:'100%',
    height: 40,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 30,
  },
  dropdown1BtnTxtStyle: { color: "#8b9cb5", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
});