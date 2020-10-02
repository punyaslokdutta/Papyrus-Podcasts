
import React, {Component} from 'react';
import { StyleSheet, Text, View,TextInput, Image} from 'react-native';
import SearchBox from '../components/Explore/SearchBox';
import styles from '../components/Explore/styles';
import ExtraDimensions from 'react-native-extra-dimensions-android';
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();

const CustomSearchHeader=(props)=> {
    
    return (
        <View style={{paddingTop:20,marginTop:STATUS_BAR_HEIGHT}}>
          <View style={styles.searchBoxContainer}>
          <SearchBox/>
          </View>   
        </View>
      );
}

export default CustomSearchHeader;