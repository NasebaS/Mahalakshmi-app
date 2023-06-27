import React from 'react';
import { StyleSheet, Dimensions, FlatList, View, ScrollView, TouchableOpacity, Image,
  Modal, Text, TouchableHighlight, Pressable } from 'react-native';

import { colors, fonts } from '../../styles';
const { width: screenWidth } = Dimensions.get('window');
import {  GridRow,Button, RadioGroup, Dropdown } from '../../components';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { RadioButton } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';
const iconSort = require('../../../assets/images/icons/sort.png');
const iconFilter = require('../../../assets/images/icons/filter.png');
import Loader from '../../components/Loader';
// export default function SearchProductScreen(props) {
  export default class SearchProductScreen extends React.Component {
    
    state = {
      modalVisible: false,
      modalVisibleSort: false,
      productdetails : [],
      productdetailsMain: [],
      search:'',
      cate_id:'',
      loader:false,
      userid:'',
      usertype:'',
      filtercategory:'',
      filterCateValue:null,
      filterSortValue:null
    };

   
   componentDidMount = () => {
    const { searchname } = this.props.route.params;
    this.setState({
      cate_id: searchname,
      loader: true
    })
    // alert(categoryid);
    this.fetchdata(searchname);  
    this.getuser();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getuser();
      const { searchname } = this.props.route.params;
      this.setState({productdetails: [],loader: true})
      this.fetchdata(searchname);  
    });
    
      fetch(global.apiurl+'getcategorydetails')
        .then((response) => response.json())
        .then((json) =>  this.setState({
          filtercategory: json,
        }))
        .catch((error) => console.error(error))
        .finally();

  }
  async getuser() {
    var userid = await AsyncStorage.getItem('user_id');
    var usertype = await AsyncStorage.getItem('user_type');
    
   this.setState({userid: userid, usertype: usertype});
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
    const { searchname } = this.props.route.params;
    // alert(prevProps.isFocused);
    if (prevProps.isFocused !== this.props.isFocused) {
      // const { categoryid } = this.props.route.params;categoryid
      this.fetchdata(searchname);
      this.getuser();
    }
  }
  fetchdata(searchname)
  {
    fetch(global.apiurl+'getsearchvalue&search='+searchname, {
         method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson.searchlist);
        this.setState({
        productdetails: responseJson.searchlist,
        productdetailsMain: responseJson.searchlist,
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


renderRowOne = rowData => {
  //console.log(rowData.item);
  const cellViews = rowData.item.map(item => (
    <TouchableOpacity key={item.productid} onPress={() => this.props.navigation.navigate('Product',{ id: item.productid})}>
      <View style={styles.itemOneContainer}>
        <View style={styles.itemOneImageContainer}>
          <Image style={styles.itemOneImage} source={{uri: global.apiurl+'image/'+item.image_path }} />
        </View>
        <View style={styles.itemOneContent}>
          <Text style={styles.itemOneTitle} numberOfLines={1}>
            {item.producttitle}
          </Text>
          <Text
            style={styles.itemOneSubTitle}
            styleName="collapsible"
            numberOfLines={3}
          >
           {item.productname}
          </Text>
          <Text style={styles.itemOnePrice} numberOfLines={1}>
            Rs. {(this.state.usertype == 'RESELLER') ? item.reseller_price : item.customer_price}/-
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ));
  return (
    <View key={rowData.item[0].id} style={styles.itemOneRow}>
      {cellViews}
    </View>
  );
};

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
    <View>
       <Loader loading={this.state.loader} />
         
       <View style={styles.demoButtonsContainer}>
       <Modal
          animationType="slide"
          transparent={true}
          visible={false}>
         <View style={{ height: '45%',marginTop: 'auto', backgroundColor:'white',borderTopWidth:1, borderTopColor:'#858585'}}>
    <View>
    <TouchableOpacity  onPress={() => {this.setState({ modalVisible: false})}}>
    <View style={[styles.searchImageContainer1,{padding:5,borderBottomWidth:1,borderBottomColor:'#858585'}]}>    
      <View style={styles.textwidth}>   
      <Text style={[styles.itemOneTitle, {fontSize: 20}]}
           numberOfLines={1}>
            Sort By
      </Text>      
      </View>
    </View>
    </TouchableOpacity>  
              <TouchableOpacity>
      <View style={styles.searchImageContainer1}>    
      <View style={styles.textwidth}>  
      <Text style={[styles.itemOneTitle,{color:'#858585'}]}
           numberOfLines={1}>
            Most Relevent</Text>    
             </View>
            <RadioButton
        value="first"
      />
         
      </View>
    </TouchableOpacity>
    <TouchableOpacity>
      <View style={styles.searchImageContainer1}> 
      <View style={styles.textwidth}>     
      <Text style={[styles.itemOneTitle,{color:'#858585'}]}
           numberOfLines={1}>
            New Arrivals</Text>    
            </View> 
            <RadioButton
        value="first"
      />
         
      </View>
    </TouchableOpacity>
    <TouchableOpacity>
      <View style={styles.searchImageContainer1}> 
      <View style={styles.textwidth}>      
      <Text style={[styles.itemOneTitle,{color:'#858585'}]}
           numberOfLines={1}>
            Price(Low to High)</Text>   
            </View>  
            <RadioButton
        value="first"
      />
         
      </View>
    </TouchableOpacity>
    <TouchableOpacity>
      <View style={styles.searchImageContainer1}>    
      <View style={styles.textwidth}>     
      <Text style={[styles.itemOneTitle,{color:'#858585'}]}
           numberOfLines={1}>
            Price(High to Low)</Text> 
            </View>     
            <RadioButton
        value="first"
      />
         
      </View>
    </TouchableOpacity>
    <TouchableOpacity>
      <View style={styles.searchImageContainer1}>    
      <View style={styles.textwidth}>   
      <Text style={[styles.itemOneTitle,{color:'#858585'}]}
           numberOfLines={1}>
            Rating</Text>    
            </View>
            <RadioButton
        value="first"
        style={{justifyContent: "flex-end"}}
      />
         
      </View>
    </TouchableOpacity>
    <TouchableOpacity  onPress={() => {this.setState({ modalVisible: false})}} style={{backgroundColor:'#03a9f3',marginHorizontal:20}}>
    <View style={[styles.searchImageContainer1,{padding:10,alignItems:'center'}]}>    
         
      <Text style={[styles.itemOneTitle, {fontSize: 16}]}
           numberOfLines={1}>
            Close
      </Text>      

      </View>
    </TouchableOpacity> 
              
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
        <View style={styles.PaymentcenteredView} onPress={() => this.setState({ modalVisible: false})}>
          <View style={styles.PaymentmodalView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.PaymentmodalText}>Filter</Text>
              <Icon name="close" type='font-awesome' color='#f43397' onPress={() => this.setState({ modalVisible: false})} />
            </View>
            <View style={styles.divider} />
            <View>            
            { this.state.filtercategory != '' ? (
              <>
            {this.state.filtercategory.map((item) => {
               return (
                  <TouchableOpacity>
                    <View style={styles.searchImageContainer1}>    
                    <View style={styles.textwidth}>     
                    <Text style={[styles.itemOneTitle,{color:'#858585'}]}
                        numberOfLines={1}>
                         {item.categoryname}</Text> 
                          </View>     
                          <RadioButton
                            value={item.categoryname}
                            status={ this.state.filterCateValue === item.categoryname ? 'checked' : 'unchecked' }
                            onPress={() => {
                              this.setState({ filterCateValue: item.categoryname});
                              var cate_name = item.categoryname;
                              const subarray = [];
                              var data = this.state.productdetailsMain.filter(function(item_filter){
                                  return item_filter.categoryname == cate_name;
                              }).map(function(item_filter){
                                subarray.push(item_filter);
                              });
                              // console.log(this.state.productdetailsMain);
                              // console.log(data);
                              console.log(this.state.productdetails);
                              console.log(subarray);
                              this.setState({ productdetails: subarray});
                              this.setState({ modalVisible: false })
                            }}

                          />
                    </View>
                  </TouchableOpacity>
               );
            })}
            </>
            ): null }
              <View style={styles.divider} />
              {/* <View style={{ marginTop: 30, flexDirection: 'row' }}>
                <Pressable
                  style={[styles.Paymentbutton, styles.PaymentbuttonOpen]}
                  onPress={() => this.setState({ modalVisible: false})}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>

                <Pressable
                  style={[styles.Paymentbutton, styles.PaymentbuttonClose]}
                  
                >
                  <Text style={styles.textStyle}>Filter</Text>
                </Pressable>
              </View> */}
            </View>
          </View>
        </View>
      </Modal>
      <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisibleSort}
        >
        <View style={styles.PaymentcenteredView} onPress={() => this.setState({ modalVisibleSort: false})}>
          <View style={styles.PaymentmodalView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.PaymentmodalText}>Sort</Text>
              <Icon name="close" type='font-awesome' color='#f43397' onPress={() => this.setState({ modalVisibleSort: false})} />
            </View>
            <View style={styles.divider} />
            <View>            
                <TouchableOpacity>
                  <View style={styles.searchImageContainer1}>    
                  <View style={styles.textwidth}>     
                  <Text style={[styles.itemOneTitle,{color:'#858585'}]}
                      numberOfLines={1}>
                        Price (Low to High)</Text> 
                        </View>     
                        <RadioButton
                          value={"pricelth"}
                          status={ this.state.filterSortValue === "pricelth" ? 'checked' : 'unchecked' }
                          onPress={() => {
                            this.setState({ filterSortValue: "pricelth"});
                            this.state.productdetailsMain.sort(function(a, b) {
                              return parseFloat(a.mrp_price) - parseFloat(b.mrp_price);
                            });
                            this.setState({ modalVisibleSort: false })
                          }}

                        />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.searchImageContainer1}>    
                  <View style={styles.textwidth}>     
                  <Text style={[styles.itemOneTitle,{color:'#858585'}]}
                      numberOfLines={1}>
                        Price (High to Low)</Text> 
                        </View>     
                        <RadioButton
                          value={"pricehtl"}
                          status={ this.state.filterSortValue === "pricehtl" ? 'checked' : 'unchecked' }
                          onPress={() => {
                            this.setState({ filterSortValue: "pricehtl"});
                            this.state.productdetailsMain.sort(function(a, b) {
                              return parseFloat(b.mrp_price) - parseFloat(a.mrp_price);
                            });
                            this.setState({ modalVisibleSort: false })
                          }}
                        />
                  </View>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
       <TouchableOpacity style={styles.opbutton} onPress={() => {this.setState({ modalVisibleSort: true})}}>
      <View style={styles.searchImageContainer}>        
          <Image style={styles.searchImage} 
          source={iconSort} />
          <Text style={styles.itemOneTitle}
           numberOfLines={1}>
            Sort</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={styles.opbutton} onPress={() => {this.setState({ modalVisible: true})}}>
      <View style={styles.searchImageContainer}>        
          <Image style={styles.searchImage} 
          source={iconFilter} />
          <Text style={styles.itemOneTitle}
           numberOfLines={1}>
            Filter</Text>
      </View>
    </TouchableOpacity>
          </View>
    <ScrollView
      style={styles.containers}
      contentContainerStyle={{ paddingBottom: 110 }}
    >
    <View >
      <FlatList
      keyExtractor={item =>
        item.id
          ? `${this.props.tabIndex}-${item.id}`
          : `${item[0] && item[0].id}`
      }
      style={{ backgroundColor: colors.white, paddingHorizontal: 0, paddingVertical:5 }}
      data={groupedData}
      renderItem={this._getRenderItemFunction()}
    />
    </View>    
    </ScrollView>
    
    </View>
  );
              }
}

const styles = StyleSheet.create({
  demoButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  demoButtonsContainer: {   
   
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
    
  },
  textwidth: {   
    marginLeft:10,
    width: Dimensions.get('window').width -80, 
  },
  demoItem: {
    marginVertical: 15,
  },
  gridcontainer: {
    flex: 1,
    marginHorizontal: 20,
   
  },
  bgImage: {
    flex: 1,
    marginHorizontal: -20,
  },
  opbutton: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    width: Dimensions.get('window').width / 2,
    borderBottomWidth:0.3,
    borderTopWidth:0.3
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headersection: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontFamily: fonts.primaryRegular,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
  },
  searchImageContainer1: {    
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
    padding:2,
  },
  searchImageContainer: {    
    overflow: 'hidden',
    width: Dimensions.get('window').width / 2,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchImage: {
    height: 20,
    width: 20,
    marginLeft:Dimensions.get('window').width / 6,
  },
  itemOneContainer: {
    flex: 1,
    width: Dimensions.get('window').width / 2 - 3,
    borderWidth:0.5
  },
  itemOneImageContainer: {
    borderRadius: 3,
    overflow: 'hidden',
    padding:2
  },
  itemOneImage: {
    height: 200,
    width: Dimensions.get('window').width / 2 - 10,
  },
  itemOneTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 12,
    color: '#000',
    fontFamily:'Montserrat',
  },
  itemOneSubTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 10,
    color: '#B2B2B2',
    marginVertical: 3,
    fontFamily:'Montserrat'
  },
  itemOnePrice: {
    fontFamily: fonts.primaryRegular,
    fontSize: 12,
    fontFamily:'Montserrat',
    color: '#000',
  },
  itemOneRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginTop: 10,
  },
  itemOneContent: {
    marginTop: 5,
    marginBottom: 5,
    padding:10
  },
  priceLink: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  PaymentmodalText: {
    marginBottom: 2,
    textAlign: "left",
    fontSize: 14
  },
  PaymentcenteredView: {
    flex: 1,
    width: '100%',
    // justifyContent: "center",
    // alignItems: "center",
    // marginTop: 22
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  divider: {
    borderBottomColor: 'black',
    opacity: 0.2,
    borderBottomWidth: 1,
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
    textAlign: "left",
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
  addaddressbtn: {
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});
