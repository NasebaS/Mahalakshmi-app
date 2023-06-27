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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../components/Loader';
import { ListItem, Avatar } from 'react-native-elements'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Table, Row, Rows } from 'react-native-table-component';
const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
]
export default class MyWalletScreen extends React.Component {
  
  state = {
    userid:0 ,
    loader:false,
    totalEarned:0,
    walletBalance:0,
    details:'',
    incentive:0,
    tableHead: ['Order Id', 'Margin Amount', 'Wallet Deduction', 'Status'],
    dbarray:'',
    tableData: [
      ['1', '2', '3', '4'],
      ['a', 'b', 'c', 'd'],
      ['1', '2', '3', '456\n789'],
      ['a', 'b', 'c', 'd']
    ]
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
  getuser = async () => {
    console.log("Working");
    var user_id = await AsyncStorage.getItem('user_id');
    var usertype = await AsyncStorage.getItem('user_type');
    this.setState({ userid: user_id })
    fetch(global.apiurl+"getuserwalletdetails", {
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
          console.log(data);
          this.setState({
            walletBalance:data.walletbalance,
            totalEarned:data.totalearned,
            details:data.details,
            incentive:data.incentive,
           loader:false
          })
          var mainarray = [];
          data.details.forEach(function(item, index){
            // console.log(item);
            var stringArray = new Array(item.order_number, item.margin_amount, item.wallet_deduction, item.wallet_admin_status);
            mainarray.push(stringArray);
          });
          this.setState({
              dbarray:mainarray
          })
        })
  }
  

  render() {

    return (
      <View style={{flex: 1, width: windowWidth, backgroundColor: 'white'}}>
        <Loader loading={this.state.loader} />
        <View style={styles.walletSection}>
          <View style={styles.walletBalance}>
            <Text style={styles.TextHead}>Wallet Balance</Text>
            <Text style={styles.TextAmount}>Rs. {this.state.walletBalance}</Text>
          </View>
          <View style={styles.walletAmount}>
            <Text style={styles.TextHead}>Total Margin Earned</Text>
            <Text style={styles.TextAmount}>Rs. {this.state.totalEarned}</Text>
          </View>
        </View>
        <View style={styles.walletSection}>
          <View style={styles.walletBalance}>
            <Text style={styles.TextHead}>Total Incentives</Text>
            <Text style={styles.TextAmount}>Rs. {this.state.incentive}</Text>
          </View>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <Table borderStyle={{borderWidth: 2, borderColor: '#ffb8dd', margin:5}}>
              <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
              <Rows data={this.state.dbarray} textStyle={styles.text}/>
            </Table>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'column',
    height: 60,
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
  },
  walletSection: {
    padding:10,
    flexDirection:'row',
    justifyContent:'space-around',
    borderBottomWidth:1,
    borderBottomColor:'#e7e7e7'
  },
  walletBalance: {
    borderWidth:3,
    borderColor:'#e4e4e4',
    padding:10,
    width: windowWidth /100 * 40 ,
    alignItems:'center',
    borderRadius:10,
    flexDirection:'column',
    justifyContent:'space-between'
  },
  walletAmount: {
    borderWidth:3,
    borderColor:'#e4e4e4',
    padding:10,
    width: windowWidth/ 100 * 40,
    alignItems:'center',
    borderRadius:10,
    flexDirection:'column',
    justifyContent:'space-between'
  },
  TextHead: {
    fontFamily:'Poppins-Regular',
    fontSize: 14,
    textAlign:'center',
    color:'grey'
  },
  TextAmount: {
    color:'#01a3d4',
    fontFamily:'Poppins-Bold',
    fontSize:20
  },
  tableHead: {
    flexDirection:'row',
    justifyContent:'space-around',
    paddingVertical: 10,
    backgroundColor:'#ffb8dd'
  },
  tableHeadText: {
    fontSize:12,
    fontFamily:'Poppins-Bold',
    color:'#4a4a4a'
  },
  tableBody: {
    flexDirection:'row',
    justifyContent:"center"
  },
  head: { 
    height: 40, 
    backgroundColor: '#ffb8dd', 
    
  },
  text: { margin: 6 , fontSize:12,
    fontFamily:'Poppins-Bold',
    color:'#4a4a4a' }


});
