import React from 'react';

import { TouchableOpacity, View, Text, Dimensions } from 'react-native';

import { colors } from '../styles';

export default function RNSRadioGroup({
  items,
  selectedIndex,
  onChange,
  style,
  underline,
}) {
  return (
    <View
      style={[styles.container, underline && styles.underline, style && style]}
    >
      {items &&
        items.map((item, index) => {
          let isActive = false;
          if (selectedIndex !== undefined && selectedIndex === index)
            isActive = true;

          let activeStyle = styles.itemActive;
          if (underline) activeStyle = styles.itemActiveUnderline;

          let activeTextStyle = styles.textActive;
          if (underline) activeTextStyle = styles.textActiveUnderline;

          return (
            <TouchableOpacity
              onPress={() => onChange(index)}
              key={item.id || item}
              style={[
                styles.item,
                underline && styles.itemUnderline,
                isActive && activeStyle,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  underline && styles.textUnderline,
                  isActive && activeTextStyle,
                ]}
              >
                {item.value || item}
              </Text>
              {underline && isActive && (
                <View
                  style={{
                    height: 5,
                    borderBottomColor: colors.primary,
                    borderBottomWidth: 3,
                    position: 'absolute',
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

const styles = {
  container: {
    // flex: 1,
    width:'100%',
    flexDirection: 'row',
    flexWrap:'wrap',
    // borderColor: colors.primary,
    // borderWidth: 1,
    borderRadius: 5,
  },
  underline: {
    borderWidth: 0,
  },
  item: {
    // flex: 1,
    width: Dimensions.get('window').width/4.7,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth:1,
    borderColor:'#e3e3e3',
    margin:4,
    borderRadius:5,
    
  },
  itemUnderline: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e3e3e3',
  },
  itemActive: {
    backgroundColor: '#ff84c4',
  },
  itemActiveUnderline: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  text: {
    color: 'grey',
    fontSize:12
  },
  textUnderline: {
    color: '#a6a6a6',
  },
  textActive: {
    color: colors.white,
  },
  textActiveUnderline: {
    color: colors.primary,
  },
};
