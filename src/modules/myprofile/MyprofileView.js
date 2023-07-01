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
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../components/Loader';



const AddressScreen=({navigation})=>{
  state = {
    userid:0 ,
    cartdetails:'',
    orderlength:'',
    loader:false,
    name:'',
    email:'',
    password:'',
    phone_number:'',
        
 } 

  componentDidMount = () => {
    this.getuser();
    this.setState({ loader: true })
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //this.getuser();
      this.setState({ loader: true })
    });
    
  }
  componentDidUpdate = (prevProps, prevState) => {
    
    if (prevProps.isFocused !== this.props.isFocused) {
      this.getuser();
    }
  }
  getuser = async () => {
    console.log("Working");
    var user_id = await AsyncStorage.getItem('user_id');
    var usertype = await AsyncStorage.getItem('user_type');
    this.setState({ userid: user_id })
    fetch(global.apiurl+"getuserdetails", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "userid": this.state.userid,
        })
    })
        .then(res => res.json())
        .then(data => {
          this.setState({
            name : data.user_detail[0].name,
            email: data.user_detail[0].email,
            password: data.user_detail[0].password,
            phone_number: data.user_detail[0].phone_number,
            loader:false
          })
        })
  }
  handleAddAddress=()=>{
    this.setState({ showForm: true });
};
  
   handleSubmitButton = () => {
     
    //  console.log("Pressed")
    if (!this.state.name) {
      alert('Please fill Name');
      return;
    }
    if (!this.state.email) {
      alert('Please fill Email');
      return;
    }
    if (typeof this.state.email !== "undefined") {
        
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(this.state.email)) {
        alert('Enter Valid Email Address');
        return;
      }
      
    }
    if (!this.state.phone_number) {
      alert('Please fill Mobile Number');
      return;
    }
    
    if (typeof this.state.phone_number !== "undefined") {
          
      var pattern = new RegExp(/^[0-9\b]+$/);
      if (!pattern.test(this.state.phone_number)) {
        alert("Please Enter only Number.");
        return;
      }else if(this.state.phone_number.length != 10){
        alert("Please Enter 10 Digits Phone Number");
        return;
      }
    }
    //Show Loader
    this.setState({ loader: true })
    // this.setState({ loader: false})
    fetch(global.apiurl+"updateuserdetails", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "userid": this.state.userid,
          "name" : this.state.name,
          "email": this.state.email,
          "password": this.state.password,
          "phone_number": this.state.phone_number
        })
    })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          alert(data.details)
          this.getuser();
            // setUserName(data.user_detail[0].name)
            // setUserEmail(data.user_detail[0].email)
            // setUserPassword(data.user_detail[0].password)
            // setUserMobileNumber(data.user_detail[0].phone_number)
        })
        
       
  
  };

 

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
      <Loader loading={this.state.loader} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <Text>Name</Text>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserName) => this.setState({ name: UserName })}
              underlineColorAndroid="#f000"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              value={this.state.name}
              
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <Text>Email </Text>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => this.setState({ email: UserEmail })}
              underlineColorAndroid="#f000"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              returnKeyType="next"
              blurOnSubmit={false}
              value={this.state.email}
            />
          </View>
          <View style={styles.SectionStyle}>
            <Text>Change Password</Text>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                this.setState({ password: UserPassword })}
              underlineColorAndroid="#f000"
              placeholderTextColor="#8b9cb5"
              returnKeyType="next"
              secureTextEntry={true}
              blurOnSubmit={false}
              
            />
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
          <View style={styles.SectionStyle}>
            <Text>Change Mobile Number</Text>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserAddress) =>
                this.setState({ phone_number: UserAddress })}
              underlineColorAndroid="#f000"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
              value={this.state.phone_number}
            />
          </View>
        
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('Address')}>
          
            <Text style={styles.buttonText}>Add Address</Text>
          </TouchableOpacity>
        

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={this.handleSubmitButton}
            >
            <Text style={styles.buttonTextStyle}>Update</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
    );
  }

export default AddressScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'column',
    height: 60,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  address: {
    display:'flex',
   flexDirection:'row',

  },
  button: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'blue',
    fontSize: 14,
  },
  buttonStyle: {
    backgroundColor: '#35baf5',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#35baf5',
    height: 40,
    alignItems: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingRight: 15,
    borderBottomWidth: 1,
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
  },
  heading: {
    color: '#35baf5',
    flex:1,
    textAlign:'left',
    fontSize: 22,
    padding: 20,
    fontWeight: "bold",
  }
});
