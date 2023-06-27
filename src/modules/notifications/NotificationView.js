import React from 'react';
import { StyleSheet, Dimensions, FlatList, View, ScrollView, TouchableOpacity, Image,
  Modal, Text, TouchableHighlight } from 'react-native';
import moment from 'moment';
import { colors, fonts } from '../../styles';
import { Card,Icon} from 'react-native-elements';
const { width: screenWidth } = Dimensions.get('window');
import {  GridRow,Button, RadioGroup, Dropdown } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { RadioButton } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';
const iconSort = require('../../../assets/images/icons/sort.png');
const iconFilter = require('../../../assets/images/icons/filter.png');
import Loader from '../../components/Loader';
// export default function SearchProductScreen(props) {
  export default class NotificationScreen extends React.Component {
    
    state = {
      modalVisible: false,
      productdetails : [],
      search:'',
      cate_id:'',
      loader:false,
      userid:'',
      usertype:'',
    };
   
   
   componentDidMount = () => {
   
    this.setState({
      loader: true
    })
    // alert(categoryid);
    this.getuser();

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getuser();
      this.setState({productdetails: [],loader: true})
      
    });

  }
  async getuser() {
    var userid = await AsyncStorage.getItem('user_id');
    var usertype = await AsyncStorage.getItem('user_type');
    
   this.setState({userid: userid, usertype: usertype});
   this.fetchdata();
  }
  
  componentWillUnmount() {
    this._unsubscribe();
  }
    // if(categoryid == '')
    // {
    //   fetch(global.apiurl+'getproductdetails', {
    //      method: 'GET'
    //   })
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //      //console.log(responseJson[0]);
    //      this.setState({
    //       productdetails: responseJson,
    //      })
    //   })
    //   .catch((error) => {
    //      console.error(error);
    //   });
    // }
   
   

   componentDidUpdate = (prevProps, prevState) => {
    // alert(prevProps.isFocused);
    if (prevProps.isFocused !== this.props.isFocused) {
      // const { categoryid } = this.props.route.params;categoryid
      this.getuser();
    }
  }
  fetchdata()
  {
    fetch(global.apiurl+'getnotificationsforcustomer&id='+this.state.userid, {
         method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson.action);
        this.setState({
        productdetails: responseJson.action,
        loader:false,
        })
    })
    .catch((error) => {
        console.error(error);
    });    
  }
  
_getRenderItemFunction = () =>
[this.renderRowOne][
  0
];

_openArticle = article => {
  // this.props.navigation.navigate('Article', {
  //   article,
  // });
};
deletenoti_list(listid)
{
  fetch(global.apiurl+'deletenotilistdetails&id='+listid,{
    method: 'GET'
  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson.action);
    if(responseJson.success == true)
    {
      this.getuser();
    }

  })
  .catch((error) => {
      console.error(error);
  });
}



_openpopup = () => {
  this.setState({modalVisible: true});
};


render(){

  // const groupedData = this.props.tabIndex === 0
  // ? GridRow.groupByRows(this.props.data, 2)
  // : this.props.data;
  // console.log(this.props.data._W);
  const groupedDatas =this.props.data;
  const groupedData = GridRow.groupByRows(this.state.productdetails, 2)
  return (   
    <View style={{backgroundColor:'#fff'}}>
       <Loader loading={this.state.loader} />
    <ScrollView
      style={styles.containers}
     
    >
      {/* <View style={styles.container}>
              <Image style={styles.avatar} source={{uri: global.apiurl+'image/notification_img/022420221325196217873fe1636adimg2.jpg'}} />
              <View style={styles.content}>
                <View >
                  <View style={styles.text}>
                    <Text style={styles.name}>Get 10% Discounts on All Products</Text>
                  </View>
                  <Text style={styles.timeAgo}>
                    2 hours ago
                  </Text>
                </View>
              </View>
            </View> */}
          {this.state.productdetails.map((item) => {
            return (
            <View style={styles.container}>
              {item.notificationimage != null ? (
              <Image style={styles.avatar} source={{uri: global.apiurl+'image/notification_img/'+item.notificationimage}} />
              ): null }
              <View style={styles.content}>
                <View style={{ flexDirection:'row'}}>
                  <View style={{width:'80%'}}>
                    <View style={styles.text}>
                      <Text style={styles.name}>{item.notificationmessage}</Text>
                    </View>
                    <Text style={styles.timeAgo}>
                    Posted {moment(item.createdat,"YYYY-MM-DD hh:mm:ss").fromNow()}
                    </Text>
                  </View>
                  <View style={{ padding:16, marginLeft:10}}>
                  <Icon
                    name='x'
                    type='feather'
                    color='#f50'
                    onPress={() => this.deletenoti_list(item.listid)}
                  />
                  </View>
                </View>
              </View>
            </View>
            );
          })}
    </ScrollView>
    
    </View>
  );
              }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'column',
    borderBottomWidth: 2,
    borderColor: "#f996c9",
    alignItems: 'flex-start',
    // marginBottom:10
  },
  avatar: {
    width:'100%',
    height:200,
    borderRadius:25,
    resizeMode:'contain',
  },
  text: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap:'wrap',
    fontFamily:'Poppins-Regular'
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0
  },
  mainContent: {
    marginRight: 60
  },
  img: {
    height: 50,
    width: 50,
    margin: 0
  },
  attachment: {
    position: 'absolute',
    right: 0,
    height: 50,
    width: 50
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  timeAgo:{
    fontSize:12,
    color:"#696969"
  },
  name:{
    fontSize:15,
    color:"#000",
    marginTop:10,
    fontFamily:'Poppins-Regular'
  }
});
