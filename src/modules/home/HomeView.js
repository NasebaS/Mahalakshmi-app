// import React from 'react';
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView, FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  TextInput,
  Pressable,
  BackHandler,
  PermissionsAndroid
} from 'react-native';
import { SearchBar, Icon, Button } from 'react-native-elements';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { fonts, colors } from '../../styles';
import { Text } from '../../components/StyledText';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
const { width: screenWidth } = Dimensions.get('window');
import { GridRow } from '../../components';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
const categoryimage = require('../../../assets/images/category/saree.png');
const image1 = require('../../../assets/images/offers/offer1.png');
const image2 = require('../../../assets/images/offers/offer2.png');
const image3 = require('../../../assets/images/offers/offer3.png');
const image4 = require('../../../assets/images/offers/offer4.png');
const image5 = require('../../../assets/images/offers/offer5.png');
const trend = require('../../../assets/images/pages/trending.png');
export default function HomeScreen(props) {

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [offers, setOffers] = useState([]);
  const [catalogue, setCatalogue] = useState([]);
  const [catalogue1, setCatalogue1] = useState([]);
  const [catalogue2, setCatalogue2] = useState([]);
  const [catalogue3, setCatalogue3] = useState([]);
  const [catalogue4, setCatalogue4] = useState([]);

  const [search, setsearch] = useState('');
  const [searchdata, setsearchdata] = useState('');
  const [searchvalue, setsearchvalue] = useState('');
  const [userid, setuserid] = useState(0);
  const [usertype, setusertype] = useState('');
  const focusDiv = useRef();
  // const isFocused = useIsFocused();
  //console.log(data);
  const getuser = async () => {
    var userid = await AsyncStorage.getItem('user_id');
    var usertype = await AsyncStorage.getItem('user_type');
    setuserid(userid);
    setusertype(usertype);
  }
  useEffect(() => {
    if (focusDiv.current) focusDiv.current.focus();
  }, [focusDiv]);

  useEffect(() => {
    getuser();
    fetch(global.apiurl+'getproductdetails')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  }, []);
  useEffect(() => {
    fetch(global.apiurl+'getcategorydetails')
      .then((response) => response.json())
      .then((json) => setCategory(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(global.apiurl+'getofferdetails')
      .then((response) => response.json())
      .then((json) => setOffers(json.details))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(global.apiurl+'getcataloguedetails')
      .then((response) => response.json())
      .then((json) => {
        //console.log(json.details);
        setCatalogue(json.details);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  //console.log(category);
  _renderItem = ({ item, index }, parallaxProps) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('Category')} >
        <View >
          <ParallaxImage
            source={{ uri: global.apiurl+'image/' + item.image_path }}
            containerStyle={styles.imageContainerCate}
            style={styles.imageCate}

            {...parallaxProps}
          />
          <Text style={styles.titleCate}>
            {(item.categoryname.length <10 ) ? item.categoryname : `${item.categoryname.substring(0, 10)}...`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderItemProduct = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.productitem}>
        <ParallaxImage
          source={{ uri: global.apiurl+'image/' + item.image_path }}
          containerStyle={styles.imageContainerProduct}
          style={styles.productimage}

          {...parallaxProps}
        />
        <Text style={styles.productprice}>
          Rs. {(usertype == 'RESELLER') ? item.reseller_price : item.customer_price} /-
        </Text>
        <Text style={styles.productoff}>
          Min 20% Off.
        </Text>
      </View>
    );
  }

  _renderItems = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.items}>
        <ParallaxImage
          source={{ uri: global.apiurl+'image/banner-img/' + item.image_path }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
      </View>
    );
  }

  _getRenderItemFunction = () =>
    [this.renderRowOne][
    0
    ];

  _openArticle = article => {
    props.navigation.navigate('Product', {},);
  };

  renderRowOne = rowData => {
    const cellViews = rowData.item.map(item => (
      // key={item.productid} onPress={() => this._openArticle(item)}
      <TouchableOpacity key={item.productid} onPress={() => props.navigation.navigate('Product', { id: item.productid })}>
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
              Rs.{(usertype == 'RESELLER') ? item.reseller_price : item.customer_price} /-
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
  const [searchnew, setSearchNew] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [showsearch, setshowsearch] = useState(false)
  useEffect(() => {
    componentDidMount = () => {
      getuser();
      this._unsubscribe = props.navigation.addListener('focus', () => {
        getuser();
      });
    }

    componentWillUnmount = () => {
      this._unsubscribe();
    }
    fetch(global.apiurl+'searchlistdetails')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setFilteredDataSource(responseJson.searchname);
        setMasterDataSource(responseJson.searchname);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const searchFilterFunction = (text) => {
    console.log(text)
    // Check if searched text is not blank
    setshowsearch(true);
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.searchname
          ? item.searchname.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log(newData.length);
      if(newData.length==0) {
        alert("No Products Found");
      }
      setFilteredDataSource(newData);
      setSearchNew(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setshowsearch(false);
      setFilteredDataSource(masterDataSource);
      setSearchNew(text);
    }
  };

  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      <Text style={styles.searchitem} onPress={() => props.navigation.navigate('Shop', { searchname: item.searchname })}>
        {item.searchname.toUpperCase()}
      </Text>
    );
  };
  render_image_item = (item) => {
    // let arr = [global.apiurl+'image/0106202207560461d6a094d89301640162363024.jpg', global.apiurl+'image/0106202207575861d6a1066425fDFI_1102_5.jpg', global.apiurl+'image/0106202208004061d6a1a8285f5DFI_1103_5.jpg', global.apiurl+'image/0106202208004061d6a1a82904cDFI_1103_4.jpg', global.apiurl+'image/0106202208082161d6a3757b367DFI_1104_5.jpg', global.apiurl+'image/0106202208082161d6a3757bb6cDFI_1104_4.jpg',global.apiurl+'image/0106202210490061d6c91c98080chudi1.jpg'];
    let arr = item[1];
    // console.log(arr);
    let arr2;
    if (arr.length > 3) {
      arr2 = arr.slice(3)
    }
    return (
      <>
        <View style={{ flexDirection: 'row' }}>
          {arr[0] != ''  ? ( 
          <View style={{ borderWidth: 0.5, borderColor: 'grey', minHeight: 200, flex: 0.5 }}>
          <TouchableOpacity key={arr[0][1]} onPress={() => props.navigation.navigate('Product', { id: arr[0][1] })}>
            <Image resizeMode={"cover"}   style={{ minHeight: 200 }} source={{ uri: global.apiurl+"image/" + arr[0][0] }} />
          </TouchableOpacity>
          </View> 
          ) : null }
          {arr.length > 1 ? ( 
          <View style={{ borderWidth: 0.5, borderColor: 'grey', minHeight: 200, flex: 0.5 }}>
            <TouchableOpacity key={arr[1][1]} onPress={() => props.navigation.navigate('Product', { id: arr[1][1] })}>
            <Image resizeMode={"cover"} style={{ minHeight: 200 }} source={{ uri: global.apiurl+"image/" + arr[1][0] }} />
            </TouchableOpacity>
          </View>
          ) : null }
        </View>
        <View style={{ flexDirection: 'row' }}>
        {arr.length > 2 ? ( 
          <View style={{ borderWidth: 0.5, borderColor: 'grey', minHeight: 200, flex: 0.5 }}>
          <TouchableOpacity key={arr[2][1]} onPress={() => props.navigation.navigate('Product', { id: arr[2][1] })}>
            <Image resizeMode={"cover"}   style={{ minHeight: 200 }} source={{ uri: global.apiurl+"image/" + arr[2][0] }} />
          </TouchableOpacity>
          </View> 
          ) : null }
          {arr.length > 3 ? ( 
          <View style={{ borderWidth: 0.5, borderColor: 'grey', minHeight: 200, flex: 0.5 }}>
            <TouchableOpacity key={arr[3][1]} onPress={() => props.navigation.navigate('Shop', { searchname: item[0] })}>
            <Image resizeMode={"cover"} style={{ minHeight: 200 }} source={{ uri: global.apiurl+"image/" + arr[3][0] }} />
            {arr.length > 4 && <View style={{ height: 200, justifyContent: "center", width: '100%', backgroundColor: 'rgba(0,0,0,0.4);', position: 'absolute' }}>
                <Text style={{ color: 'white', fontSize: 35, alignSelf: 'center' }}> + {arr2.length}</Text>
              </View>
            }
            </TouchableOpacity>
          </View>
          ) : null }
        </View>

        {/* { arr.length > 2 || arr.length > 3 ? (
        <View style={{ flexDirection: 'row', height: 150, width: '100%' }}>
          {arr.slice(2, 4).map((itm, index) => {
            return (
              <>
              {itm[0] != '' ? ( 
                <View style={[{ flex: .34, height: '100%' }]}>
                  <TouchableOpacity key={itm[1]} onPress={() => props.navigation.navigate('Product', { id: itm[1] })}>
                    <Image style={[{ height: '100%' },]} source={{ uri: global.apiurl+"image/" + itm[0] }} />
                  </TouchableOpacity>
                </View>
              ) : null }
              </>
            )
          })}
          {arr.length > 4 ? ( 
          <View style={{ height: 150, flex: .33 }}>
            <TouchableOpacity onPress={() => props.navigation.navigate('Shop', { searchname: item[0] })} >
              <Image style={{ height: '100%' }} source={{ uri: global.apiurl+"image/" + arr[4][0] }} />
              {arr.length > 5 && <View style={{ height: 150, justifyContent: "center", width: '100%', backgroundColor: 'rgba(0,0,0,0.4);', position: 'absolute' }}>
                <Text style={{ color: 'white', fontSize: 35, alignSelf: 'center' }}> + {arr2.length}</Text>
              </View>
              }
            </TouchableOpacity>
          </View>
          ) : null }
          
        </View>
        ): null } */}
        <View style={{ padding: 10 }}>
          <Text style={styles.cataloguename}>{item[0]}</Text>
          <Text style={styles.catalogueprice}>Starting From Rs. {(usertype == 'RESELLER') ? item[2] : item[3]} /- </Text>
        </View>
        <View style={styles.productdetail}>
          <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
            <Button
              icon={
                <Icon
                  name="download"
                  size={15}
                  color="#df0586"
                  type='feather'
                />
              }
              buttonStyle={{ borderColor: '#ced4da', borderWidth: 1, backgroundColor: 'transparent', borderRadius: 5 }}
              titleStyle={{ color: 'grey', fontSize: 12, marginLeft: 3 }}
              title="Download"
              onPress={() => checkPermission(item[0])}
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
              buttonStyle={{ borderColor: '#ced4da', borderWidth: 1, backgroundColor: 'transparent', borderRadius: 5 }}
              titleStyle={{ color: 'grey', fontSize: 12, marginLeft: 3 }}
              title="View Catalogue"
              onPress={() => props.navigation.navigate('Shop', { searchname: item[0] })}
            />
            {/* <Button
              icon={
                <Icon
                  name="share-2"
                  size={15}
                  color="#df0586"
                  type='feather'
                />
              }
              buttonStyle={{ borderColor: '#ced4da', borderWidth: 1, backgroundColor: 'transparent', borderRadius: 5 }}
              titleStyle={{ color: 'grey', fontSize: 12, marginLeft: 3 }}
              title="Share"
            /> */}
          </View>
        </View>
      </>
    );
  };
  // const REMOTE_IMAGE_PATH = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/gift.png';
  const checkPermission = async (cataloguename) => {
    setLoading(true);
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
  const downloadcatalogueimage = async (cataloguename) => {
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
        setLoading(false);
        alert("Images Downloaded Successfully");
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
      // for(i=0;i<image_array.length;i++)
      // {
      //   downloadImage(image_array[i]);
      // }

  }

  // const onShare = async() => {
  //   // console.log(this.state.productimages)
  //   var array = [];
  //   for (let imagedata of this.state.productimages) {
  //       var imagepath = global.imageurl + imagedata.image_path;
  //       var imagetype = imagepath.slice(imagepath.lastIndexOf('.') + 1);
  //       ImgToBase64.getBase64String(imagepath)
  //       .then(base64String => {
  //         let base64 = `data:image/png;base64,`+base64String;
  //         // console.log(base64);
  //         let shareOptions = {
  //           title: this.state.productdetails.producttitle+ " - " +this.state.productdetails.productname,
  //           message: this.state.productdetails.producttitle+ " - "+ this.state.DescCopyShare,
  //           url:base64,
  //           subject: 'Product Description'
  //         };
    
  //         Share.open(shareOptions)
  //         .then((result) => console.log(result))
  //         //If any thing goes wrong it comes here
  //         .catch((errorMsg) => console.log(errorMsg));
  //       })
  //   }
  // };
  const downloadImage = (imageurl,cataloguename) => {
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
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ?
             /[^.]+$/.exec(filename) : undefined;
  };
  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 4,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const getItem = (item) => {
    // Function for click on an item
    alert('Id : ' + item.id + ' Title : ' + item.title);
  };

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
      subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
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
    }, {
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

  const ENTRIES2 = [
    {
      title: 'Mobile',
      subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
      illustration: require('../../../assets/images/offers/offer1.png'),
    },
    {
      title: 'Laptop',
      subtitle: 'Lorem ipsum dolor sit amet',
      illustration: require('../../../assets/images/offers/offer2.png'),
    },
    {
      title: 'Sarees',
      subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
      illustration: require('../../../assets/images/offers/offer3.png'),
    },
    {
      title: 'Chudi',
      subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
      illustration: require('../../../assets/images/offers/offer4.png'),
    },
    {
      title: 'Accessories',
      subtitle: 'Lorem ipsum dolor sit amet',
      illustration: require('../../../assets/images/offers/offer5.png'),
    }
  ];


  const groupedData = GridRow.groupByRows(data, 2);
  return (


    <ScrollView
      style={styles.containers}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {searchvalue != '' ? (
        <View>
          {addressdata.map((item) => {
            return (
              <TouchableOpacity key={item.productid} onPress={() => this.props.navigation.navigate('Product', { id: item.productid })}>
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
                      Rs. {item.mrp_price}/-
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
      <View style={styles.container}>
        <ImageBackground
          // source={require('../../../assets/images/background.png')}
          style={styles.bgImage}
          resizeMode="cover"
        >
          <View style={styles.searchbar}>

            {/* <SearchBar       
         inputContainerStyle={{backgroundColor: 'white',height: 30}}
        width=   {screenWidth}   
        inputStyle={{backgroundColor: 'white'}}
        containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 30}}
        icon = {{width: 50 }}
        placeholderTextColor={'#g5g5g5'}
        placeholder="Search by keyword or product id"   
      /> */}

            <SearchBar
              placeholder="Search by Keywords or Product ID..."
              lightTheme={true}
              // onChangeText={(value) => setsearch(value)}
              onChangeText={(text) => searchFilterFunction(text)}
              value={searchnew}
              containerStyle={{ backgroundColor:'#fff', width:'100%', paddingHorizontal:'6%' }}
            />
          </View>
          <View style={(showsearch == true) ? styles.bg1 : styles.bg2}>
              {/* <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => searchFilterFunction(text)}
            value={searchnew}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          /> */}
            {filteredDataSource.length >= 1 ? (
                  <FlatList
                    data={filteredDataSource}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                    contentContainerStyle={{ width:'100%', paddingHorizontal:'6%'}}
                  />
            ) : null }
              <Text style={styles.searchitem}>NO PRODUCTS FOUND</Text>
            </View>



          {/* <Text style={styles.headersection}>Category</Text> */}
          <View style={styles.carouselsectionCate}>
            <Carousel
              activeSlideAlignment='start'
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={85}
              data={category}
              renderItem={this._renderItem}
              hasParallaxImages={true}
              loop={false}
              autoplay={false}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
            />
          </View>
          <View style={styles.carouselsection1}>
            {/* <Text style={styles.headersection1}>Offers</Text> */}
            <Carousel
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={screenWidth - 20}
              data={offers}
              autoplay={true}
              loop={true}
              renderItem={this._renderItems}
              hasParallaxImages={true}
            />
          </View>
          {/* <View style={styles.carouselsection}>
              <Carousel  
                      activeSlideAlignment='start'             
                      sliderWidth={screenWidth}
                      sliderHeight={screenWidth}
                      itemWidth={100}
                      data={data}             
                      renderItem={this._renderItemProduct}
                      hasParallaxImages={true}
                      loop={true}
                      autoplay={true}
                  /> 
            </View> */}
          {/* <Button
          title="Solid Button"
        /> */}
          {/* <View style={{ marginTop: 5, flexDirection: 'row', backgroundColor:'#fff' }}>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => props.navigation.navigate('Shop', { searchname: catalogue1 })}
            >
              <Text style={styles.textStyle}> {catalogue1} </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.navigation.navigate('Shop', { searchname: catalogue2 })}
            >
              <Text style={styles.textStyle}> {catalogue2} </Text>
            </Pressable>
          </View>
          <View style={{ marginBottom: 6, flexDirection: 'row' , backgroundColor:'#fff'}}>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => props.navigation.navigate('Shop', { searchname: catalogue3 })}
            >
              <Text style={styles.textStyle}> {catalogue3} </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.navigation.navigate('Shop', { searchname: catalogue4 })}
            >
              <Text style={styles.textStyle}> {catalogue4} </Text>
            </Pressable>
          </View> */}
          <View style={styles.gridcontainer}>
            <Text style={styles.headersectionTrending}>
              New Arrivals
              <Image
                style={{
                  flex: 1,
                  //  resizeMode:'contain'
                }}
                source={trend}
              />
            </Text>
            {catalogue != '' ? (
              <>
                {
           /* {this.render_catalogues} */}
                {catalogue.map((item) => {
                  return (
                    // <Text>{item.cataloguename}</Text>
                    this.render_image_item(item)

                  );
                })}

              </>
            ) : null}
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    // backgroundColor: colors.bluish,
    backgroundColor:'#fff',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  searchbar: {
    flex: 1,
    // width:'100%',
    // marginHorizontal: ,
    paddingVertical: 5,

  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor:'#fff',
  },
  gridcontainer: {
    flex: 1,
    // marginVertical: 5,
    backgroundColor: '#fff',

  },
  bgImage: {
    flex: 1,
    marginHorizontal: -20,
    backgroundColor:'#fff'
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Montserrat'
  },
  headersectionTrending: {
    //flex: 1,
    paddingVertical: 5,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#fff',
    color:'#000',
    // borderWidth:1
    paddingLeft: 10
  },
  headersection: {
    //flex: 1,
    paddingVertical: 5,
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    // borderWidth:1
  },
  headersection1: {
    flex: 1,
    paddingVertical: 5,
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    fontFamily: 'Montserrat'
  },
  carouselsection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 10
  },
  carouselsectionCate: {
    flex: 1,
    // paddingHorizontal: 20,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 100,
    // marginTop:10
  },
  carouselsection1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLarge: {
    flex: 2,
    justifyContent: 'space-around',
  },
  sectionHeader: {
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  description: {
    padding: 15,
    lineHeight: 25,
  },
  titleDescription: {
    color: '#19e7f7',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
  },
  title: {
    marginTop: 0,
    paddingBottom: 15,
    textAlign: 'center',
    fontFamily: fonts.primaryRegular,
  },
  titleCate: {
    marginTop: 0,
    paddingBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 12
  },
  productprice: {
    marginTop: 0,
    paddingBottom: 5,
    textAlign: 'center',
    color: 'black',
  },
  productoff: {
    paddingBottom: 15,
    textAlign: 'center',
    color: 'green',
    fontSize: 12,
    fontWeight: 'bold'
  },
  price: {
    marginBottom: 5,
  },
  bordered: {
    width: 380,
    borderWidth: 0.5,
    borderColor: colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  itemOneContainer: {
    flex: 1,
    width: Dimensions.get('window').width / 2 - 3,
    borderWidth: 0.5
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
    fontFamily: 'Poppins-Regular'
  },
  itemOneSubTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 10,
    color: '#B2B2B2',
    marginVertical: 3,
    fontFamily: 'Poppins-Regular'
  },
  itemOnePrice: {
    fontFamily: fonts.primaryRegular,
    fontSize: 13,
    fontFamily: 'Poppins-Regular'
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
  priceLink: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  item: {
    width: 100,
    height: 100,
  },
  productitem: {
    width: 100,
    height: 100,
    backgroundColor: 'white'
  },
  items: {
    width: "100%",
    height: 180,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    // resizeMode: 'contain',
  },
  imageContainerCate: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
    width: 80,
    height: 80,
    //Below lines will help to set the border radius
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    overflow: 'hidden',
  },
  imageCate: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'center',
    width: 80,
    height: 80,
    //Below lines will help to set the border radius
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    overflow: 'hidden',
  },
  productimage: {
    resizeMode: 'contain',
    width: 120
  },
  imageContainerProduct: {
    backgroundColor: 'transparent',
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
  },
  searchitem: {
    backgroundColor: 'white',
    margin: 5,
    padding: 4,
    width:'100%',
    color:'#000'
  },
  bg1: {
    backgroundColor: '#fff',
  },
  bg2: {
    display: "none",
  },
  button: {
    // borderRadius:
    padding: 10,
    width: '50%',
    borderWidth: 0.7,
    borderColor: '#f65dac'
    // marginLeft: 30
  },
  // buttonOpen: {
  //   backgroundColor: "#F194FF",
  //   // marginTop:10
  // },
  // buttonClose: {
  //   backgroundColor: "#2196F3",
  // },
  textStyle: {
    textAlign: "center",
    color: "#000"
  },
  productdetail: {
    padding: 10
  },
  cataloguename: {
    color: "black",
    // marginHorizontal: 10,
    fontSize: 14,
    fontWeight:'bold'
  },
  catalogueprice: {
    // marginHorizontal: 10,
    color: "red",
    fontSize: 12,
    marginVertical:5,
    fontWeight:'bold'
  }
});
