// import React from 'react';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  WebView,
  useWindowDimensions,
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput,
  PermissionsAndroid,
  Clipboard,
  // Share
} from 'react-native';
import { Card, Rating, AirbnbRating, Icon, Button } from 'react-native-elements';
import { colors, fonts } from '../../styles';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { GridRow, RadioGroup } from '../../components';
import HTMLView from 'react-native-htmlview';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalFont from 'react-native-global-font';
import AnimatedLoader from "react-native-animated-loader";
import { color } from 'react-native-reanimated';
import Loader from '../../components/Loader';
import ReadMore from '@fawazahmed/react-native-read-more';
import {decode} from 'html-entities';
import { reduce } from 'lodash';
import { DOMParser } from 'react-native-html-parser';
import Share from "react-native-share";
import ImgToBase64 from 'react-native-image-base64';
import RNFetchBlob from 'rn-fetch-blob';
const { width: screenWidth } = Dimensions.get('window');
const iconFilter = require('../../../assets/images/icons/star.png');
const iconSort = require('../../../assets/images/icons/sort.png');
const iconWishtlist = require('../../../assets/images/pages/addtocart.png');
const iconCart = require('../../../assets/images/icons/cart.png');
const iconbuynow = require('../../../assets/images/pages/add2cart.png');
const iconoutofstock = require('../../../assets/images/icons/outofstock.jpg');
const loader = require('../../../assets/images/pages/loader.gif');
const countries = ["Egypt", "Canada", "Australia", "Ireland"];
var DomParser = require('react-native-html-parser').DOMParser
export default class ProductScreen extends React.Component {

  state = {
    productdetails: '',
    productimages: '',
    productid: '',
    productcode: '',
    sizearray: [],
    colorarray: [],
    setPrice: '',
    setSize: '',
    userid: 0,
    usertype: '',
    loader: false,
    cartmodal: false,
    addtocartmodal: false,
    quantity: 1,
    resellerPrice: 0,
    customerPrice: 0,
    margin: 0,
    cartmargin: 0,
    availability: false,
    stock: 0,
    customername: '',
    similardatas:'',
    SmallDescription:'',
    DescShow:false,
    DescLength:0,
    DescCopyShare:''
  }
  increment = () => this.setState({ quantity: this.state.quantity + 1 });
  decrement = () => this.setState({ quantity: this.state.quantity - 1 });
  componentDidMount = () => {
    const { id } = this.props.route.params;
    let fontName = 'Poppins-Regular'
    GlobalFont.applyGlobal(fontName)
    this.fetchData(id);
    this.setState({
      loader: true
    })
    this.getuser();
  }
  componentDidUpdate = (prevProps) => {
    const { id } = this.props.route.params;
    //console.log(prevProps.route.params.id);
    if (prevProps.route.params.id !== id) {
      this.setState({
        loader: true
      })
      this.fetchData(id);
    }
  }

  fetchData(id) {
    fetch(global.apiurl+'getsingleproductdetails&id=' + id, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.getuser();
        console.log(responseJson);
        this.refs._scrollView.scrollTo({});
        var sizearray = responseJson.productdetails[0].sizes.split(',');
        var colorarray = responseJson.productdetails[0].colors.split(',');
        this.setState({
          sizearray: sizearray,
          colorarray: colorarray,
          productdetails: responseJson.productdetails[0],
          productimages: responseJson.productimages,
          productid: responseJson.productdetails[0]['productid'],
          productcode: responseJson.productdetails[0]['productcode'],
          setPrice: responseJson.productdetails[0].mrp_price,
          resellerPrice: responseJson.productdetails[0].reseller_price,
          customerPrice: responseJson.productdetails[0].customer_price,
        });
        if(responseJson.productdetails[0].productdescription != null)
        {
          this.setState({
            SmallDescription: responseJson.productdetails[0].productdescription.substring(0, 100),
            DescLength: responseJson.productdetails[0].productdescription.length,
            DescCopyShare: responseJson.desc
          });
        }
        this.getprice(this.state.productid,this.state.sizearray[this.props.radioGroupsState[0]]);
        this.checkstock(this.state.colorarray[this.props.radioGroupsStateColor[0]], this.state.sizearray[this.props.radioGroupsState[0]]);
        this.setState({
          loader: false
        })
      })
      // .catch((error) => {
      //   console.error(error);
      // });

      fetch(global.apiurl+'getsimilarproducts&id=' + id, {
      method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson);
        this.setState({
          similardatas: responseJson
        })
      })
      // .catch((error) => {
      //   console.error(error);
      // });
  }

  checkstock = (color, size) => {
    fetch(global.apiurl+'checkstock&id=' + this.state.productcode + '&color=NOCOLOR&size=' + size, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.stock != '') {
          this.setState({
            stock: responseJson.stock[0].stock
          })
          if (this.state.stock > 0) {
            console.log("Stock Available");
            this.setState({ availability: true });
          }
          else {
            console.log("Stock UnAvailable");
            this.setState({ availability: false });
          }
        }
        else {
          this.setState({ availability: false, stock: 0 });
        }
        this.setState({
          loader: false
        })
      })
      .catch((error) => {
        console.error(error);
      });

  }

  async getuser() {
    var userid = await AsyncStorage.getItem('user_id');
    var usertype = await AsyncStorage.getItem('user_type');
    this.setState({ userid: userid, usertype: usertype });
  }


  addtocart = () => {
    this.setState({
      loader: true
    })
    if (this.state.userid == null) {
      this.props.navigation.navigate('Login');
    }
    else {

      if (this.state.usertype == "RESELLER") {
        var cartmargin = this.state.cartmargin;
      }
      else {
        var cartmargin = 0;
      }
      fetch(global.apiurl+"addtocart", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "customerid": this.state.userid,
          "productid": this.state.productdetails.productid,
          "productcode": this.state.productdetails.productcode,
          "size": this.state.sizearray[this.props.radioGroupsState[0]],
          "color": this.state.colorarray[this.props.radioGroupsStateColor[0]],
          "cartmargin": cartmargin,
          "custype": this.state.usertype,
          "customername": this.state.customername,
          "quantity": this.state.quantity
        })
      })
        .then(res => res.json())
        .then(async data => {
          this.setState({
            loader: false
          })
          console.log(data);
          if (data.success === true) {
            alert(data.action);
            this.props.navigation.navigate('Product', { id: this.state.productid });
            this.setState({ addtocartmodal: false })
          } else {
            alert('Error occured');
          }
        })

    }
  }
  addtocartReseller = () => {
    this.setState({
      loader: true
    })
    if (this.state.userid == null) {
      this.props.navigation.navigate('Login');
    }
    else {
      //console.log(this.state.userid);
      if (this.state.customername == '' && this.state.usertype == 'RESELLER') {
        alert("Add Customer Name");
        return;
      }
      if (this.state.usertype == "RESELLER") {
        var cartmargin = this.state.cartmargin;
        // var cartmargin = 0;
      }
      else {
        var cartmargin = 0;
      }
      fetch(global.apiurl+"addtocart", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "customerid": this.state.userid,
          "productid": this.state.productdetails.productid,
          "productcode": this.state.productdetails.productcode,
          "size": this.state.sizearray[this.props.radioGroupsState[0]],
          "color": this.state.colorarray[this.props.radioGroupsStateColor[0]],
          "cartmargin": cartmargin,
          "custype": this.state.usertype,
          "customername": this.state.customername,
          "quantity": this.state.quantity
        })
      })
        .then(res => res.json())
        .then(async data => {
          console.log(data);
          if (data.success === true) {
            alert(data.action);
            this.setState({
              loader: false
            })
            this.setState({ addtocartmodal: false });
            this.props.navigation.navigate('Product', { id: this.state.productid });
          } else {
            alert('Error occured');
            this.setState({
              loader: false
            })
          }
        })
    }
  }

  _getRenderItemFunction = () =>
    [this.renderRowOne][
    0
    ];
  _getRenderItemFunctions = () =>
    [this.renderRowThree][
    0
    ];

  _openArticle = article => {
    this.props.navigation.navigate('Article', {
      article,
    });
  };

  _renderItems = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.items}>
        <ParallaxImage
          source={{ uri: global.apiurl+'image/' + item.image_path }}
          containerStyle={styles.imageContainer}
          style={styles.productimages}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
      </View>
    );
  };

  _rendersimilarItems = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.similaritems}>
        <ParallaxImage
          source={item.illustration}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
      </View>
    );
  }

  renderRowOne = rowData => {
    //console.log(rowData.item);
    const cellViews = rowData.item.map(item => (
      <TouchableOpacity key={item.productid} onPress={() => this.props.navigation.navigate('Product', { id: item.productid })} >
        <View style={styles.itemOneContainer}>
          <View style={styles.itemOneImageContainer}>
            <Image style={styles.itemOneImage} source={{ uri: global.apiurl+'image/' + item.image_path }} />
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
              Rs.  {(this.state.usertype == 'RESELLER') ? item.reseller_price : item.customer_price} /-
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

  renderRowThree = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itemThreeContainer}
    >
      <View style={styles.itemThreeSubContainer}>
        <Image source={item.image} style={styles.itemThreeImages} />
        <View style={styles.itemThreeContent}>
          <Text style={styles.itemThreeBrand}>{item.brand}</Text>
          <View>
            <Text style={styles.itemThreeSubtitle} numberOfLines={1}>
              {item.comments}
            </Text>
          </View>
        </View>
        <View style={styles.itemThreeMetaContainer}>
          {item.badge && (
            <View
              style={[
                styles.badge,
                item.badge === '5' && { backgroundColor: colors.green },
              ]}
            >
              <Text
                style={{ fontSize: 10, color: colors.white }}
                styleName="bright"
              >
                {item.badge}<Image style={styles.searchImage}
                  source={iconFilter} />
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.itemThreeHr} />
    </TouchableOpacity>
  );
  buynowreseller = () => {

    this.setState({ cartmodal: false });
    this.props.navigation.navigate('Buy Now - Reseller', {
      productid: this.state.productid,
      resellerprice: this.state.resellerPrice,
      marginamount: this.state.margin,
      productsize: this.state.sizearray[this.props.radioGroupsState[0]],
      quantity: this.state.quantity,
      productcolor: this.state.colorarray[this.props.radioGroupsStateColor[0]],
      productcode: this.state.productcode
    })
  }
  getprice = (productid,size) => {
      fetch(global.apiurl+'get_price_by_size&id=' + productid + '&size=' + size, {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson.details[0]);
        this.setState({
          customerPrice: responseJson.details[1],
          resellerPrice: responseJson.details[0],
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  sizechange = (index) => {
    this.props.setRadioGroupsState({ ...this.props.radioGroupsState, 0: index })
    this.setState({
      loader: true,
      quantity:1
    })
    // this.state.stock.forEach(element => {
    //   // console.log(element.color);
    //   // console.log(this.state.colorarray[this.props.radioGroupsStateColor[0]]);
    //   // console.log(element.size);
    //   // console.log(this.state.sizearray[this.props.radioGroupsState[0]]);
    //   if(element.size === this.state.sizearray[index] && element.color  === this.state.colorarray[this.props.radioGroupsStateColor[0]])
    //   {
    //       if(element.stock > 0)
    //       {
    //         console.log("Stock Available");
    //         this.setState({ availability: true });
    //       }
    //       else{
    //       console.log("Stock UnAvailable");
    //       this.setState({ availability: false });
    //       }          
    //   }
    //   else{
    //     console.log("Stock UnAvailable");
    //     this.setState({ availability: false });
    //     }
    // });
    this.getprice(this.state.productid,this.state.sizearray[index]);
    this.checkstock(this.state.colorarray[this.props.radioGroupsStateColor[0]], this.state.sizearray[index]);
  }
  colorchange = (index) => {
    this.props.setRadioGroupsStateColor({ ...this.props.radioGroupsStateColor, 0: index })
    this.setState({
      loader: true
    })
    this.checkstock(this.state.colorarray[index], this.state.sizearray[this.props.radioGroupsState[0]])
  }
  // htmlDecode = (input) => {
  //   let doc = new DOMParser().parseFromString(input, "text/html");
  //   return doc.documentElement.textContent;
  // }
  copyclipboard = (text) => {
    Clipboard.setString(text);
    alert("Description Copied");
  }
 

  render() {
    const { visible } = this.state;
    //const { id } = this.props.route.params;
    const ENTRIES1 = [
      {
        title: 'Sarees',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: require('../../../assets/images/category/saree.png'),
      },
      {
        title: 'Kurtis',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: require('../../../assets/images/category/kurti.png'),
      },
      {
        title: 'Dress Materials',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat',
        illustration: require('../../../assets/images/category/suit.png'),
      },
      {
        title: 'Kurtha sets',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: require('../../../assets/images/category/kurta.png'),
      },
      {
        title: 'Top wears',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: require('../../../assets/images/category/top.png'),
      }, {
        title: 'Bottom wears',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: require('../../../assets/images/category/bottom.png'),
      },
      {
        title: 'Gown',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: require('../../../assets/images/category/gown.png'),
      },
      {
        title: 'Night suits',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: require('../../../assets/images/category/night.png'),
      },
      {
        title: 'Innerwears',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: require('../../../assets/images/category/bra.png'),
      },
      {
        title: 'Lehenga',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: require('../../../assets/images/category/lehenga.png'),
      },
      {
        title: 'Chudi',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: require('../../../assets/images/category/chudi.png'),
      },
    ];


    // const groupedData =
    //   this.props.tabIndex === 0
    //     ? GridRow.groupByRows(this.props.data._W, 2)
    //     : this.props.data;
    const checkPermission = async (cataloguename) => {
      this.setState({
        loader: false
      })
      // Function to check the platform
      // If iOS then start downloading
      // If Android then ask for permission
  
      if (Platform.OS === 'ios') {
        // downloadImage();
        downloadcatalogueimage();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message:
                'App needs access to your storage to download Photos',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Once user grant the permission start downloading
            console.log('Storage Permission Granted.');
            // downloadImage();
            console.log(cataloguename);
            downloadcatalogueimage(cataloguename);
          } else {
            // If permission denied then show alert
            alert('Storage Permission Not Granted');
          }
        } catch (err) {
          // To handle permission related exception
          console.warn(err);
        }
      }
    };
    downloadcatalogueimage = async (cataloguename) => {
      var image_array = [];
      fetch(global.apiurl+'getsinglecatalogueimage&catalogue='+cataloguename)
        .then((response) => response.json())
        .then((json) => {
          console.log(json.details);
          image_array = json.details;
          for(i=0;i<image_array.length;i++)
          {
            downloadImage(image_array[i],cataloguename);
          }
          this.setState({
            loader: false
          })
          alert("Images Downloaded Successfully");
        })
        .catch((error) => console.error(error))
        .finally(() =>  this.setState({
          loader: false
        }));
        // for(i=0;i<image_array.length;i++)
        // {
        //   downloadImage(image_array[i]);
        // }
  
    }
    downloadImage = (imageurl,cataloguename) => {
      if(imageurl != '') {
      // Main function to download the image
      
      // To add the time suffix in filename
      let date = new Date();
      // Image URL which we want to download
      let image_URL = global.apiurl+"image/"+imageurl;    
      // Getting the extention of the file
      let ext = getExtention(image_URL);
      ext = '.' + ext[0];
      // Get config and fs from RNFetchBlob
      // config: To pass the downloading related options
      // fs: Directory path where we want our image to download
      const { config, fs } = RNFetchBlob;
      let PictureDir = fs.dirs.PictureDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          // Related to the Android only
          useDownloadManager: true,
          notification: true,
          path:
            PictureDir +
            '/mahalakshmi/'+cataloguename+'_'+ 
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            ext,
          description: 'Image',
        },
      };
      config(options)
        .fetch('GET', image_URL)
        .then(res => {
          // Showing alert after successful downloading
          // console.log('res -> ', JSON.stringify(res));
          
          console.log('Image Downloaded Successfully');
        });
      }
    };
    const getExtention = filename => {
      // To get the file extension
      return /[.]/.exec(filename) ?
               /[^.]+$/.exec(filename) : undefined;
    };
    const getImagePathasBase64 = (imagesPath) => {      
      let imagePath = null;
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', global.imageurl + imagesPath.image_path)
        // the image is now dowloaded to device's storage
        .then((resp) => {
          // the image path you can use it directly with Image component
          imagePath = resp.path();
          return resp.readFile('base64');
        })
        .then((base64Data) => {
          // here's base64 encoded image
          var imageUrl = 'data:image/png;base64,' + base64Data;
          console.log(imageUrl);
          return fs.unlink(imagePath);
        });
    };
    const onShare = async() => {
      // console.log(this.state.productimages)
      var array = [];
      for (let imagedata of this.state.productimages) {
          var imagepath = global.imageurl + imagedata.image_path;
          var imagetype = imagepath.slice(imagepath.lastIndexOf('.') + 1);
          ImgToBase64.getBase64String(imagepath)
          .then(base64String => {
            let base64 = `data:image/png;base64,`+base64String;
            // console.log(base64);
            let shareOptions = {
              title: this.state.productdetails.producttitle+ " - " +this.state.productdetails.productname,
              message: this.state.productdetails.producttitle+ " - "+ this.state.DescCopyShare,
              url:base64,
              subject: 'Product Description'
            };
      
            Share.open(shareOptions)
            .then((result) => console.log(result))
            //If any thing goes wrong it comes here
            .catch((errorMsg) => console.log(errorMsg));
          })
      }
      // try {
      //   const result = await Share.share({
      //     message:
      //       'React Native | A framework for building native apps using React',
      //     urls:,
      //   });
      //   if (result.action === Share.sharedAction) {
      //     if (result.activityType) {
      //       // shared with activity type of result.activityType
      //     } else {
      //       // shared
      //     }
      //   } else if (result.action === Share.dismissedAction) {
      //     // dismissed
      //   }
      // } catch (error) {
      //   alert(error.message);
      // }
    };
    //console.log(this.props.data._W);
    const groupedData = GridRow.groupByRows(this.state.similardatas, 2);
    const groupedDatas = this.state.similardatas;
    //alert(groupedData);
    return (

      <View>
        <Loader loading={this.state.loader} />
        <ScrollView ref='_scrollView'
          contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={styles.productview}>
            <View style={{ width: '100%' }}>
              <Carousel
                sliderWidth={screenWidth/100 *110}
                sliderHeight={screenWidth}
                itemWidth={screenWidth}
                data={this.state.productimages}
                autoplay={false}
                loop={false}
                renderItem={this._renderItems}
                hasParallaxImages={true}
              />
            </View>
            <View style={styles.productdetail}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.BrandName}>{this.state.productdetails.productname}</Text>
                <TouchableOpacity style={{}}>
                  <View style={styles.searchImageContainer}>
                    <Text style={styles.starstext}
                      numberOfLines={1}>
                      4.5 </Text>
                    <Image style={styles.searchImage}
                      source={iconFilter} />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.headersection} >{this.state.productdetails.producttitle}</Text>
              <Text style={styles.Amounttext} >Rs. {(this.state.usertype == 'RESELLER') ? this.state.resellerPrice : this.state.customerPrice}/- <Text style={styles.Mrptext}> Rs. {(this.state.usertype == 'RESELLER') ? this.state.customerPrice : this.state.setPrice}/-</Text>
                <Text style={styles.percenttext}> 2% off</Text></Text>


              {/* <View style={styles.container}>
          <View style={styles.item}>
            <Text style={styles.delivery}> Free Delivery</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.reviewtext}> 4.2K reviews</Text>
          </View>
        </View> */}
              {this.state.stock <= 10 && this.state.stock != 0 ? (
                <View style={styles.container}>
                  <Text style={styles.limitedstock}>Hurry Limited Stock Only Available</Text>
                </View>
              ) : null}
              {/* <TouchableOpacity>
              <View style={styles.shippingContainer}>        
            <Text style={styles.itemOneTitle}
            numberOfLines={1}>
            Free Delivery</Text>
            </View>
          </TouchableOpacity> */}
              {/* <Text style={styles.headersection}>Similar Products</Text>
            <Carousel    
                activeSlideAlignment='start'         
                sliderWidth={screenWidth}
                sliderHeight={screenWidth}
                itemWidth={50}
                data={ENTRIES1}
                autoplay={false}
                loop={false}
                renderItem={this._rendersimilarItems}
                hasParallaxImages={true}
            />   */}
            </View>
            <View style={styles.productdetail}>
              <View style={{flexDirection: "row",justifyContent:'space-around'}}>
              <Button
                icon={
                  <Icon
                    name="download"
                    size={15}
                    color="#df0586"
                    type='feather'
                  />
                }
                buttonStyle={{borderColor:'#ced4da', borderWidth:1,backgroundColor:'transparent', borderRadius:5}}
                titleStyle={{color:'grey', fontSize:12, marginLeft:3}}
                title="Download"
                onPress={() => checkPermission(this.state.productdetails.productname)}
              />
              <Button
                icon={
                  <Icon
                    name="eye"
                    size={15}
                    color="#df0586"
                    type='feather'
                  />
                }
                buttonStyle={{borderColor:'#ced4da', borderWidth:1,backgroundColor:'transparent', borderRadius:5}}
                titleStyle={{color:'grey', fontSize:12, marginLeft:3}}                
                title="View Catalogue"
                onPress={() => this.props.navigation.navigate('Shop', { searchname: this.state.productdetails.productname })}
              />              
              <Button
                icon={
                  <Icon
                    name="share-2"
                    size={15}
                    color="#df0586"
                    type='feather'
                  />
                }
                buttonStyle={{borderColor:'#ced4da', borderWidth:1,backgroundColor:'transparent', borderRadius:5}}
                titleStyle={{color:'grey', fontSize:12, marginLeft:3}}                
                title="Share"
                onPress={onShare}
              />              
              </View>
            </View>
            {this.state.sizearray.length > 1 ? (
              <View style={styles.productdetail}>
                <Text style={styles.headersection}>Select Size</Text>
                <RadioGroup
                  style={styles.demoItem}
                  items={this.state.sizearray}
                  selectedIndex={this.props.radioGroupsState[0]}
                  onChange={(index) => this.sizechange(index)}
                  // onChange={(size) => console.log(size)}
                />
              </View>
            ) : null}
            {/* {this.state.colorarray.length > 1 ? (
              <View style={styles.productdetail}>
                <Text style={styles.headersection}>Select Color</Text>
                <RadioGroup
                  style={styles.demoItem}
                  items={this.state.colorarray}
                  selectedIndex={this.props.radioGroupsStateColor[0]}
                  onChange={(index) => this.colorchange(index)}
                //onChange={(size) => console.log(size)}
                />
              </View>
            ) : null} */}
            <View style={styles.productdetail}>
              <View style={styles.container}>
                      <Text style={styles.quantity}>Quantity : {this.state.quantity} </Text>
                      <Text style={styles.quantity}></Text>
                      <TouchableOpacity onPress={this.decrement} disabled={this.state.quantity > 1 ? false : true}>
                          <Text style={styles.countersleft}>-</Text>
                      </TouchableOpacity>
                      <Text style={{marginTop:5, color:'#000'}} >{this.state.quantity}</Text>
                      <TouchableOpacity onPress={this.increment} disabled={this.state.quantity < this.state.stock ? false : true}>
                          <Text style={styles.counters}>+</Text>
                      </TouchableOpacity>
                  </View>
            </View>

            <View style={styles.productdetail}>
              <View style={{flexDirection:'row',justifyContent: 'space-between' }}>
              <Text style={styles.headersection}>Product Details</Text>
              <Button
                icon={
                  <Icon
                    name="copy"
                    size={15}
                    color="#df0586"
                    type='feather'
                  />
                }
                buttonStyle={{borderColor:'#ced4da', borderWidth:1,backgroundColor:'transparent', borderRadius:5}}
                titleStyle={{color:'grey', fontSize:12, marginLeft:3}}                
                title="Copy"
                onPress = {() => this.copyclipboard(this.state.DescCopyShare) }
              />   
              </View>
              
                
                <HTMLView
                  value={(!this.state.DescShow && this.state.DescLength > 100 ) ? this.state.SmallDescription : this.state.productdetails.productdescription}
                  stylesheet={stylesHtml}                  
                />
                { this.state.DescShow == false && this.state.DescLength > 100 ? (
                <TouchableOpacity onPress={() => this.setState({ DescShow: true })} ><Text style={{ color:'red', fontFamily:'Poppins-Bold', textAlign:'right', marginRight:10}}>....Read More</Text></TouchableOpacity>
                ): null}
                { this.state.DescShow == true && this.state.DescLength > 100 ? (
                <TouchableOpacity onPress={() => this.setState({ DescShow: false })} ><Text style={{ color:'red', fontFamily:'Poppins-Bold',textAlign:'right', marginRight:10}}>Show Less</Text></TouchableOpacity>
                ): null }
                {/* <ReadMore numberOfLines={3} style={styles.textStyle}>
                  {this.state.productdetails.productdescription}
                </ReadMore> */}
                {/* </HTMLView> */}
              {/* <Text>{this.state.productdetails.productdescription}</Text> */}
              {/* <Text>Saree Meter: 6.5m</Text>
          <Text>Color: multicolor</Text>
          <Text>Pattern: Weave</Text>
          <Text>Blouse Fabric: Silk</Text> */}
            </View>
            {/* <Card style={styles.cardwidth}>
          <Text style={styles.headersection}>Ratings and Reviews</Text>
  
          <Rating
            showRating
            style={{ paddingVertical: 10 }}
            
          />
          <FlatList
          keyExtractor={item =>
            item.id
              ? `${this.props.tabIndex}-${item.id}`
              : `${item[0][0] && item[0].id}`
          }
          style={{ backgroundColor: colors.white, paddingHorizontal: 15 }}
          data={groupedData}
          renderItem={this._getRenderItemFunctions()}
          />  
          </Card> */}
            <Text style={styles.peoplealsoview}>Similar Products</Text>
            <FlatList
              keyExtractor={item =>
                item.id
                  ? `${this.props.tabIndex}-${item.id}`
                  : `${item[0] && item[0].id}`
              }
              style={{ backgroundColor: colors.white, paddingHorizontal: 5, paddingVertical: 0 }}
              data={groupedData}
              renderItem={this._getRenderItemFunction()}
            />
          </View>
        </ScrollView>
        {this.state.availability == true ? (
          <View style={styles.demoButtonsContainer}>
            <TouchableOpacity style={styles.opbuttons} onPress={() => {
              if (this.state.usertype == "RESELLER") {
                this.setState({ addtocartmodal: true });
              }
              else {
                if (this.state.userid === null) {
                  this.props.navigation.navigate('Login');
                }
                else {
                  this.addtocart()
                }
              }
            }}>
              <View style={styles.searchbtnImageContainer}>
                <Image style={styles.searchbtnImage}
                  source={iconWishtlist} />
                <Text style={styles.itemOnebtnTitle}
                  numberOfLines={1} >
                  Add to Cart</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.opbutton} onPress={() => {
                if (this.state.usertype == "RESELLER") {
                  this.setState({ cartmodal: true });
                }
                else {
                  if (this.state.userid === null) {
                    this.props.navigation.navigate('Login');
                  }
                  else {
                    this.props.navigation.navigate('Buy Now', {
                      productid: this.state.productid,
                      productprice: (this.state.usertype == 'RESELLER') ? this.state.resellerPrice : this.state.customerPrice,
                      productsize: this.state.sizearray[this.props.radioGroupsState[0]],
                      productcolor: this.state.colorarray[this.props.radioGroupsStateColor[0]],
                      productcode: this.state.productcode,
                      productquantity: this.state.quantity
                    })
                  }
                }
              }} >
              <View style={styles.searchbtnImageContainer}>
                <Image style={styles.searchbtnImage}
                  source={iconbuynow} />
                <Text style={styles.itemOnebtnTitle}
                  numberOfLines={1} >
                  Buy Now</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.availability == false ? (
          <View style={styles.demoButtonsContainer}>
            <TouchableOpacity style={styles.outofstockbtn}>
              <View style={styles.searchbtnImageContainer}>
                <Image style={styles.searchbtnImage}
                  source={iconoutofstock} />
                <Text style={styles.outofstock}
                  numberOfLines={1} >
                  Out of Stock</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.cartmodal}
        >
          <View style={styles.centeredView} onPress={() => this.setState({ cartmodal: false })}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.modalText}>BUY NOW</Text>
                <Icon name="close" type='font-awesome' color='#f43397' onPress={() => this.setState({ cartmodal: false })} />
              </View>
              <View style={styles.divider} />
              <Card style={styles.cardwidthmodal}>
                <Text style={{ fontSize: 14, marginBottom: 5, color:'black' }}>Size</Text>
                <RadioGroup
                  style={{ flex: 0 }}
                  items={this.state.sizearray}
                  selectedIndex={this.props.radioGroupsState[0]}
                  onChange={(index) => this.sizechange(index)}
                //onChange={(size) => console.log(size)}
                />
              </Card>
              <Card style={styles.cardwidthmodal}>
                <View style={styles.container}>
                  <Text style={styles.quantity}>Quantity : {this.state.quantity} </Text>
                  <Text style={styles.quantity}></Text>
                  <TouchableOpacity onPress={this.decrement} disabled={this.state.quantity > 1 ? false : true}>
                    <Text style={styles.countersleft}>-</Text>
                  </TouchableOpacity>
                  <Text style={{ marginTop: 5, color:'#000' }} >{this.state.quantity}</Text>
                  <TouchableOpacity onPress={this.increment} disabled={this.state.quantity < this.state.stock ? false : true}>
                    <Text style={styles.counters}>+</Text>
                  </TouchableOpacity>
                </View>
              </Card>
              {this.state.usertype == "RESELLER" ? (
              <Card style={styles.cardwidthmodal}>
                  <Text style={{ fontSize: 14,color:'black' }}>Margin Amount <Text style={{ fontSize:10, color:'red', fontWeight:'bold'}}>(For COD Orders Only)</Text></Text>
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={(value) => this.setState({
                      margin: value
                    })}
                    underlineColorAndroid="#f000"
                    placeholder="Enter Margin Amount"
                    placeholderTextColor="#8b9cb5"
                    keyboardType="numeric"
                    // ref={emailInputRef}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      passwordInputRef.current &&
                      passwordInputRef.current.focus()
                    }
                    blurOnSubmit={false}
                  />
                </Card>
              ) : null }

              <View style={{ marginTop: 30, flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => this.setState({ cartmodal: false })}
                >
                  <Text style={styles.textStyle}> Close </Text>
                </Pressable>
                {this.state.availability == true ? (
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={this.buynowreseller}
                  >
                    <Text style={styles.textStyle}> Buy Now </Text>
                  </Pressable>

                ) : null}
                {this.state.availability == false ? (
                  <Pressable
                    style={[styles.button]}
                  >
                    <Text style={styles.outofstock}> Out Of Stock</Text>
                  </Pressable>

                ) : null}
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.addtocartmodal}
        >
          <View style={styles.centeredView} onPress={() => this.setState({ addtocartmodal: false })}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.modalText}>Add to Cart</Text>
                <Icon name="close" type='font-awesome' color='#f43397' onPress={() => this.setState({ addtocartmodal: false })} />
              </View>
              <View style={styles.divider} />
              <Card style={styles.cardwidthmodal}>
                <Text style={{ fontSize: 14, marginBottom: 5, color:'black' }}>Size</Text>
                <RadioGroup
                  style={{ flex: 0 }}
                  items={this.state.sizearray}
                  selectedIndex={this.props.radioGroupsState[0]}
                  onChange={(index) => this.sizechange(index)}
                //onChange={(size) => console.log(size)}
                />
              </Card>
              <Card style={styles.cardwidthmodal}>
                <View style={styles.container}>
                      <Text style={styles.quantity}>Quantity : {this.state.quantity} </Text>
                      <Text style={styles.quantity}></Text>
                      <TouchableOpacity onPress={this.decrement} disabled={this.state.quantity > 1 ? false : true}>
                          <Text style={styles.countersleft}>-</Text>
                      </TouchableOpacity>
                      <Text style={{marginTop:5, color:'#000'}} >{this.state.quantity}</Text>
                      <TouchableOpacity onPress={this.increment} disabled={this.state.quantity < this.state.stock ? false : true}>
                          <Text style={styles.counters}>+</Text>
                      </TouchableOpacity>
                  </View>
              </Card>
              {this.state.usertype == "RESELLER" ? (
              <Card style={styles.cardwidthmodal}>
                <Text style={{ fontSize: 14, color:'black' }}>Customer Name</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(value) => this.setState({
                    customername: value
                  })}
                  underlineColorAndroid="#f000"
                  placeholder="Enter Customer Name"
                  placeholderTextColor="#8b9cb5"
                  // ref={emailInputRef}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    passwordInputRef.current &&
                    passwordInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                />
              </Card>
              ) : null }
              {this.state.usertype == "RESELLER" ? (
              <Card style={styles.cardwidthmodal}>
                  <Text style={{ fontSize: 14, color:'black' }}>Margin Amount <Text style={{ fontSize:10, color:'red', fontWeight:'bold'}}>(For COD Orders Only)</Text></Text>
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={(value) => this.setState({
                      cartmargin: value
                    })}
                    underlineColorAndroid="#f000"
                    placeholder="Enter Margin Amount"
                    placeholderTextColor="#8b9cb5"
                    keyboardType="numeric"
                    // ref={emailInputRef}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      passwordInputRef.current &&
                      passwordInputRef.current.focus()
                    }
                    blurOnSubmit={false}
                  />
                </Card>
              ) : null }
              <View style={{ marginTop: 30, flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => this.setState({ addtocartmodal: false })}
                >
                  <Text style={styles.textStyle}> Close </Text>
                </Pressable>
                {this.state.availability == true ? (
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={this.addtocartReseller}
                  >
                    <Text style={styles.textStyle}> Add to Cart</Text>
                  </Pressable>
                ) : null}
                {this.state.availability == false ? (
                  <Pressable
                    style={[styles.button]}
                  >
                    <Text style={styles.outofstock}> Out Of Stock</Text>
                  </Pressable>

                ) : null}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  productview: {
    backgroundColor: '#fff',
  },
  cardwidth: {
    width: '98%',
    marginLeft: 10, marginRight: 10
  },
  cardwidthmodal: {
    flex: 1, width: 100,
  },
  tabsContainer: {
    alignSelf: 'stretch',
    marginTop: 30,
  },

  searchImageContainer: {
    overflow: 'hidden',
    width: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#04aa6d',
    borderColor: '#04aa6d',
  },
  opbutton: {
    alignItems: "center",
    backgroundColor: "#f43397",
    padding: 5,
    width: Dimensions.get('window').width / 2,
  },
  opbuttons: {
    alignItems: "center",
    backgroundColor: "#01a3d4",
    padding: 10,
    width: Dimensions.get('window').width / 2,
  },
  outofstockbtn: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    width: Dimensions.get('window').width,
  },
  outofstock: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ff0000',
    marginLeft: 5
  },
  shippingContainer: {
    overflow: 'hidden',
    width: 100,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colors.bluish
  },
  searchImage: {
    height: 10,
    width: 10,
  },
  headersection: {
    paddingVertical: 5,
    fontFamily: fonts.primaryRegular,
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    color:'black'
  },
  demoButton: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    width: 150,
    height: 20,
  },
  Amounttext: {
    
    fontFamily:'Poppins-Regular',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#5f5f5f',
  },
  Mrptext: {
    paddingHorizontal: 30,
    fontFamily:'Poppins-Regular',
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#5b5b5b',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
  },
  starstext: {
    fontFamily: fonts.primaryRegular,
    fontSize: 10,
    color: 'white',
    paddingTop: 4,
    paddingLeft: 5,
  },
  percenttext: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontFamily: fonts.primaryRegular,
    fontSize: 16,
    color: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
  },
  carouselsection: {
    flex: 2,
    paddingHorizontal: 20,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemOneContainer: {
    flex: 1,
    width: Dimensions.get('window').width / 2 - 3,
    borderWidth: 0.5,
  },
  itemOneImageContainer: {
    borderRadius: 3,
    overflow: 'hidden',
    padding: 2
  },
  itemOneImage: {
    height: 200,
    width: Dimensions.get('window').width / 2 - 10,
  },
  itemOneTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color:'black'
  },
  itemOneSubTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 12,
    color: '#B2B2B2',
    marginVertical: 3,
    fontFamily: 'Poppins-Regular'
  },
  itemOnePrice: {
    fontFamily: fonts.primaryRegular,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color:'black'
  },
  itemOneRow: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    //marginTop: 10,
  },
  itemOneContent: {
    // marginTop: 5,
    // marginBottom: 5,
    padding: 10
  },
  items: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  similaritems: {
    width: 40,
    height: 40,
  },

  imageContainer: {
    flex: 2,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  itemOneRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginTop: 10,
  },
  itemOneContent: {
    marginTop: 5,
    marginBottom: 5,
    padding: 10
  },
  itemTwoContainer: {
    paddingBottom: 10,
    backgroundColor: 'white',
    marginVertical: 5,
  },
  itemTwoContent: {
    padding: 20,
    position: 'relative',
    marginHorizontal: Platform.OS === 'ios' ? -15 : 0,
    height: 150,
  },
  itemTwoTitle: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 20,
  },
  itemTwoSubTitle: {
    color: colors.white,
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
    marginVertical: 5,
  },
  itemTwoPrice: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 20,
  },
  itemTwoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  itemTwoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#6271da',
    opacity: 0.5,
  },
  itemThreeContainer: {
    backgroundColor: 'white',
  },
  itemThreeSubContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  itemThreeImage: {
    height: 100,
    width: 100,
  },
  itemThreeImages: {
    height: 40,
    borderRadius: 50,
    width: 40,
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
  itemThreeTitle: {
    fontFamily: fonts.primaryBold,
    fontSize: 16,
    color: '#5F5F5F',
  },
  itemThreeSubtitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 12,
    color: '#a4a4a4',
  },
  itemThreeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemThreePrice: {
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
    color: '#5f5f5f',
    textAlign: 'right',
  },
  itemThreeHr: {
    flex: 1,
    height: 1,
    backgroundColor: '#e3e3e3',
    marginRight: -15,
  },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchbtnImageContainer: {
    overflow: 'hidden',
    width: Dimensions.get('window').width / 2 - 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  demoButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'absolute',
    bottom: 0
  },
  searchbtnImage: {
    height: 30,
    width: 30,
    marginLeft: Dimensions.get('window').width / 10,
  },
  itemOnebtnTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5
  },
  productimages: {
    resizeMode: 'contain',
    height: 100,
    width: 100,
  },
  reviewtext: {
    marginHorizontal: 7,
    fontSize: 16,
    textAlign: 'right',
    color: '#5933f4',

  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  item: {
    width: '50%' // is 50% of container width
  },
  delivery: {
    fontSize: 16,
    color: '#f43397',
    fontWeight: "bold",
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
    position: 'absolute',
    bottom: 0
  },
  button: {
    // borderRadius:
    padding: 10,
    width: '45%',
    marginHorizontal: 10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
    // marginTop:10
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 2,
    textAlign: "left",
    fontSize: 14,
    color:'black'
  },
  centeredView: {
    flex: 1,
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
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#1a91b8',
    padding: 5,
    // backgroundColor: '#eaf7fd',
    height: 45,
  },
  counters: {
    color: '#015169',
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    // marginRight:50,
    paddingVertical: 2,
    backgroundColor: '#03a9f3',
    flex: 0,
    marginLeft: 8,
  },
  countersleft: {
    color: '#015169',
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    paddingVertical: 2,
    backgroundColor: '#03a9f3',
    flex: 0,
    marginRight: 8
  },
  quantity: {
    color: 'black',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    flex: 1,
  },
  inputStyle: {
    color: 'black',
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomWidth: 1,
    // borderRadius: 30,
    borderColor: 'grey',
  },
  Amountcarttext: {
    fontWeight: 'bold',
    fontSize: 12
  },
  peoplealsoview: {
    paddingVertical: 10,
    // paddingHorizontal: 10,
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    backgroundColor: '#fff',
    marginTop: 10,
    color:'black'
  },
  limitedstock: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'red',
     fontFamily:'Poppins-Regular',
  },
  BrandName: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
    marginTop: 5,
    fontFamily:'Poppins-Regular',
  },
  productdetail:{
    borderTopWidth:1,
    borderTopColor:'#ced4da',
    // borderBottomWidth:1,
    // borderBottomColor:'#ced4da',
    padding:10,
    marginVertical:2,
    width:'100%'
  }
});

const stylesHtml = StyleSheet.create({
  p:{
    color: '#000', // make links coloured pink
  },
});
