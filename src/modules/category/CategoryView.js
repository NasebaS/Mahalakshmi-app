// import React from 'react';
import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, Text, TouchableOpacity, Image,FlatList, Button } from 'react-native';
import {  GridRow } from '../../components';
import { colors, fonts } from '../../styles';
import Loader from '../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
const pantIcon = require('../../../assets/images/category/pant.png');
const jeansIcon = require('../../../assets/images/category/jeans.png');
const chudiIcon = require('../../../assets/images/category/chudi.png');
const shirtIcon = require('../../../assets/images/category/shirt.png');
const sareeIcon = require('../../../assets/images/category/saree.png');

export default function CategoryScreen(props) {
  const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const[loader, SetLoading] = useState(true);
    const[itemlist, Setitemlist] = useState([]);
    const[allItemName, setallItemName] = useState("");
    console.log(data);
    const categorylist =
      [
      {
        id: '1',
        name: 'Chudithar',
        items: [
          { id: '1', name: 'Cotton Chudi' },
          { id: '2', name: 'Stiched' },
        ],
      },
      {
        id: '2',
        name: 'Salwar Suits',
        items: [
          { id: '1', name: 'Omelete' },
          { id: '2', name: 'Scrambled' },
        ],
      },
      {
        id: '3',
        name: 'Wrap',
        items: [
          { id: '1', name: 'palin' },
          { id: '2', name: 'Choco' },
        ],
      },
      {
        id: '4',
        name: 'Club',
        items: [
          { id: '1', name: 'Mixed' },
          { id: '2', name: 'Olive' },
        ],
      },
    ];
    
  
    useEffect(() => {
      
      fetch(global.apiurl+'getcategorydetails')
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          console.log(global.apiurl)
          setData(json);
          getsubcate(json[0].categoryid);
          
        })
        .catch((error) => console.error(error))
        .finally(() => SetLoading(false));

    }, []);

    getsubcate = (cateid) => {
      setallItemName(data.filter((item) => item.categoryid == cateid )[0].categoryname);
      fetch(global.apiurl+'get-cate-product', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "cateid": cateid
        })
      })
      .then((response) => response.json())
      .then((json) => { console.log(json.details); Setitemlist(json.details); })
      .catch((error) => console.error(error))
      .finally(() => SetLoading(false));
    }

 _getRenderItemFunction = () =>
[this.renderRowOne][
  0];
  const groupedData =GridRow.groupByRows(data, 3);
  renderRowOne = rowData => {
    const cellViews = rowData.item.map(item => (
      <TouchableOpacity
      style={styles.item}
      onPress={() => props.navigation.navigate('Shop',{ searchname: item.categoryname})}
    >
      <Image
        resizeMode="contain"
        source={{uri: global.apiurl+'image/'+item.image_path }} 
        style={{width: '100%', height: '70%'}}
      /> 
      <Text style={styles.itemText}>{item.categoryname}</Text>
    </TouchableOpacity>
    ));
    return (
      <View style={styles.container}>
        <View style={styles.row}>
        {cellViews}
        </View>
      </View>
    );
  };
  return (
    
    <View
    style={styles.container}
    >
    <Loader loading={loader} />
    {/* <FlatList
          keyExtractor={item =>
            item.id
              ? `${this.props.tabIndex}-${item.id}`
              : `${item[0] && item[0].id}`
          }
          style={{ backgroundColor: colors.white, paddingHorizontal: 15 }}
          data={groupedData}
          renderItem={this._getRenderItemFunction()}
        /> */}
    {/* <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Charts')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/category/saree.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Sarees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Gallery')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/category/kurta.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Kurtas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Profile')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/category/bottom.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Leggins</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Chat')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/category/chudi.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Choli</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Calendar')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/category/lehenga.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Lehenga</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Auth')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/category/chudi.png')}
            tintColor={colors.primary}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Chudi</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Blog')}
          style={styles.blogItem}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/category/bra.png')}
            tintColor={colors.primary}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Inners</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Calendar')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/category/top.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Frils</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Auth')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/category/kurti.png')}
            tintColor={colors.primary}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Party wear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Blog')}
          style={styles.blogItem}
        >
        <Image
          resizeMode="contain"
          source={jeansIcon}
          tintColor={colors.primary}
          style={styles.itemImage}
        />
          <Text style={styles.itemText}>Jeans</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Calendar')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={chudiIcon}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Westernwears</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Auth')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={shirtIcon}
            tintColor={colors.primary}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Kids</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Blog')}
          style={styles.blogItem}
        >
        <Image
          resizeMode="contain"
          source={pantIcon}
          tintColor={colors.primary}
          style={styles.itemImage}
        />
          <Text style={styles.itemText}>Pant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Calendar')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={shirtIcon}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Shirt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Auth')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={shirtIcon}
            tintColor={colors.primary}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>coat</Text>
        </TouchableOpacity>
      </View>
    </View> */}
    <View style={{flex:1,flexDirection: 'row'}}>
        <View style={styles.containerCate}>
        <ScrollView
          showsVerticalScrollIndicator ={false}
        >
            <View style={styles.row}>
          {data.map((item, index) => (
            <TouchableOpacity
            style={styles.item}
            onPress={() => getsubcate(item.categoryid)}
          >
            <Image
              source={{uri: global.apiurl+'image/'+item.image_path }} 
              style={styles.itemImage}
            />
            <Text style={styles.itemText}>{item.categoryname}</Text>
          </TouchableOpacity>
          ))}

            </View>
          </ScrollView>
        </View>
        <ScrollView style={{width:'70%'}}>
          <View style={styles.container}>
              <View style={styles.subrow}>

              {itemlist.length > 1 ? (
              <View>
                      <TouchableOpacity
                        style={styles.subitem}
                        onPress={() => props.navigation.navigate('Shop', { searchname: allItemName })}
                      >

                        <Text style={styles.subitemText}>All Items</Text>
                      </TouchableOpacity>
                      <Text></Text>
                </View>
              ) : null }
           {
              itemlist.map((item) => (
                
                  <View>
                      <TouchableOpacity
                        style={styles.subitem}
                        onPress={() => props.navigation.navigate('Shop', { searchname: item.subcategoryname })}
                      >

                        <Text style={styles.subitemText}>{item.subcategoryname}</Text>
                      </TouchableOpacity>
                      <Text></Text>
                  </View>
              ))
          }
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerCate: {
    backgroundColor: colors.white,
    width:'30%'
  },
  row: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  subrow: {
    // flexDirection: 'row',
    marginTop: 10,
  },
  item: {
    flex: 1,
    height: 120,
    padding: 10,
    // borderColor: colors.primaryLight,
    // borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRightWidth:1,
    borderRightColor:'#ced4da',
    borderBottomWidth:1,
    borderBottomColor:'#ced4da',
  },
  subitem: {
  
    borderColor: '#ced4da',
    borderRadius: 5,
    borderWidth:1,
    marginHorizontal:10,
    padding:5
  },
  blogItem: {
    width: '31%',
    height: 120,
    paddingVertical: 20,
    borderColor: colors.primaryLight,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 5,
  },
  itemText: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    marginTop:20,
    fontSize:12,
    textAlign:'center'
  },
  subitemText: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize:12,    
  },
  itemImage: {
    // resizeMode: 'contain',
    width: 75,
    height: 75,
    //Below lines will help to set the border radius
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
  },
});
