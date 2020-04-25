
import React, {Component} from 'react';
import { StyleSheet, Text, View,TextInput, Image} from 'react-native';
import SearchBox from '../components/Explore/SearchBox';
import styles from '../components/Explore/styles';


const CustomSearchHeader=(props)=> {
    
    return (
        <View style={{paddingTop:20}}>
          <View style={styles.searchBoxContainer}>
          <SearchBox/>
          </View>   
        </View>
      );
}

export default CustomSearchHeader;