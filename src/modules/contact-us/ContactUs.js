import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
import { Icon } from 'react-native-elements';
import { color } from 'react-native-reanimated';
 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

 
const ContactUsScreen = ({navigation}) => {
  const [animating, setAnimating] = useState(true);
  const [contactDetails, setcontactDetails] = useState([]);
  
  useEffect(() => {
    getcontactdetails();
  }, []);
    const getcontactdetails = async() => { 
        fetch(global.apiurl+"get_contact_details", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if(responseJson.success == true) {
                setcontactDetails(responseJson);
            }
            else {
                alert("Try Again Later")
            }
        })
        .catch((error) => {
            console.error(error);
        });
    };
  return (
    <View style={styles.container}>
      <Text style={styles.Txtlabel}>Whatsapp Enquiry</Text>
      <TouchableOpacity style={styles.ShareButton} onPress={() => Linking.openURL('whatsapp://send?text=&phone='+contactDetails.whatsapp)}>
        <Icon
            size={16}
            name='whatsapp'
            type='font-awesome'
            color='#fff'
            iconStyle={{marginTop:5}}
            onPress={() => console.log('hello')} 
        />
        <Text style={styles.ShareButtonTxt}>
            Chat With Whatsapp
        </Text>
      </TouchableOpacity>
      <Text style={styles.Txtlabel}>Return Enquiry</Text>
      <TouchableOpacity style={styles.ShareButton} onPress={() => Linking.openURL('whatsapp://send?text=&phone='+contactDetails.return)}>
        <Icon
            size={16}
            name='whatsapp'
            type='font-awesome'
            color='#fff'
            iconStyle={{marginTop:5}}
            onPress={() => console.log('hello')} 
        />
        <Text style={styles.ShareButtonTxt}>
            Chat With Whatsapp
        </Text>
      </TouchableOpacity>
      <Text style={styles.Txtlabel}>Reseller Enquiry</Text>
      <TouchableOpacity style={styles.ShareButton} onPress={() => Linking.openURL('whatsapp://send?text=&phone='+contactDetails.reseller)}>
        <Icon
            size={16}
            name='whatsapp'
            type='font-awesome'
            color='#fff'
            iconStyle={{marginTop:5}}
            onPress={() => console.log('hello')} 
        />
        <Text style={styles.ShareButtonTxt}>
            Chat With Whatsapp
        </Text>
      </TouchableOpacity>
      <Text style={styles.Txtlabel}>General Enquiry</Text>
      <TouchableOpacity style={styles.ShareButton} onPress={() => Linking.openURL('whatsapp://send?text=&phone='+contactDetails.general)}>
        <Icon
            size={16}
            name='whatsapp'
            type='font-awesome'
            color='#fff'
            iconStyle={{marginTop:5}}
            onPress={() => console.log('hello')} 
        />
        <Text style={styles.ShareButtonTxt}>
            Chat With Whatsapp
        </Text>
      </TouchableOpacity>
    </View>

  );
};
 
export default ContactUsScreen;
 
const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor:'#fff',    
    // marginTop:'20%'
  },
  image: {
    width: 300,
    height: 200
  },
  Txtlabel: {
    fontSize:15,
    margin:20,
    fontFamily:'Poppins-Bold'
  },
  ShareButton: {
    padding:8,
    borderRadius:20,
    backgroundColor:'#0adc16',
    alignItems:'center', flexDirection:'row', justifyContent: 'center', width:'70%', alignSelf:'center'
  },
  ShareButtonTxt: {
    color:'#fff',
    fontFamily:'Poppins-SemiBold',
    marginTop:5,
    marginLeft:10
  }
});