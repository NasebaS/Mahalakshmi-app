// @flow
import { compose,withState } from 'recompose';
import React, { useEffect, useState } from 'react';
import ProductScreen from './ProductView';

const getMoviesFromApi = () => {
  return fetch(global.apiurl+'getproductdetails')
    .then((response) => response.json())
    .then((json) => {
      return json;
     // console.log(json);
    })
    .catch((error) => {
      console.error(error);
    });
};

const listDatas = getMoviesFromApi();
//console.log(listDatas)
const listData = [
  {
    id: 1,
    brand: 'Citizen',
    title: 'CITIZEN ECO-DRIVE',
    subtitle: 'Limited Edition',
    price: '$129.99',
    badge: 'NEW',
    badgeColor: '#3cd39f',
    image:
    require('../../../assets/images/category/chudi.png'),
  },
  {
    id: 2,
    brand: 'Weeknight',
    title: 'NEXT-LEVEL WEAR',
    subtitle: 'Office, prom or special parties is all dressed up',
    price: '$29.99',
    priceFrom: true,
    image: require('../../../assets/images/category/saree.png'),
  },
  {
    id: 3,
    brand: 'Mad Perry',
    title: 'CITIZEN ECO-DRIVE',
    subtitle: 'Office, prom or special parties is all dressed up',
    price: '$29.99',
    priceFrom: true,
    badge: 'SALE',
    badgeColor: '#ee1f78',
    image: require('../../../assets/images/category/kurta.png'),
  },
  {
    id: 4,
    brand: 'Citizen',
    title: 'CITIZEN ECO-DRIVE',
    subtitle: 'Limited Edition',
    price: '$129.99',
    badge: 'NEW',
    badgeColor: 'green',
    image: require('../../../assets/images/category/kurti.png'),
  },
  {
    id: 5,
    brand: 'Weeknight',
    title: 'NEXT-LEVEL WEAR',
    subtitle: 'Office, prom or special parties is all dressed up',
    price: '$29.99',
    priceFrom: true,
    image: require('../../../assets/images/category/chudi.png'),
  },
  {
    id: 6,
    brand: 'Mad Perry',
    title: 'CITIZEN ECO-DRIVE',
    subtitle: 'Office, prom or special parties is all dressed up',
    price: '$29.99',
    priceFrom: true,
    badge: 'SALE',
    badgeColor: 'red',
    image: require('../../../assets/images/category/lehenga.png'),
  },
  {
    id: 7,
    brand: 'Citizen',
    title: 'CITIZEN ECO-DRIVE',
    subtitle: 'Limited Edition',
    price: '$129.99',
    badge: 'NEW',
    badgeColor: '#3cd39f',
    image: require('../../../assets/images/category/bra.png'),
  },
  {
    id: 8,
    brand: 'Weeknight',
    title: 'NEXT-LEVEL WEAR',
    subtitle: 'Office, prom or special parties is all dressed up',
    price: '$29.99',
    priceFrom: true,
    image: require('../../../assets/images/category/top.png'),
  },
  {
    id: 9,
    brand: 'Mad Perry',
    title: 'CITIZEN ECO-DRIVE',
    subtitle: 'Office, prom or special parties is all dressed up',
    price: '$29.99',
    priceFrom: true,
    badge: 'SALE',
    badgeColor: '#ee1f78',
    image: require('../../../assets/images/category/bottom.png'),
  },
  {
    id: 10,
    brand: 'Citizen',
    title: 'CITIZEN ECO-DRIVE',
    subtitle: 'Limited Edition',
    price: '$129.99',
    badge: 'NEW',
    badgeColor: 'green',
    image: require('../../../assets/images/category/saree.png'),
  },
  {
    id: 11,
    brand: 'Weeknight',
    title: 'NEXT-LEVEL WEAR',
    subtitle: 'Office, prom or special parties is all dressed up',
    price: '$29.99',
    priceFrom: true,
    image: require('../../../assets/images/category/top.png'),
  },
  {
    id: 12,
    brand: 'Mad Perry',
    title: 'CITIZEN ECO-DRIVE',
    subtitle: 'Office, prom or special parties is all dressed up',
    price: '$29.99',
    priceFrom: true,
    badge: 'SALE',
    badgeColor: 'red',
    image: require('../../../assets/images/category/bottom.png'),
  },
];
  
  export default compose(
    withState('tabIndex', 'setTabIndex', 0),
    withState('tabs', 'setTabs', ['Grid', 'List 1', 'List 2']),
    withState('radioGroupsState', 'setRadioGroupsState', [0, 0]),
    withState('radioGroupsStateColor', 'setRadioGroupsStateColor', [0, 0]),
    withState('data', 'setData', listDatas),
  )(ProductScreen);
