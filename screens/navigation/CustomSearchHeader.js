
import React, {Component} from 'react';
import { StyleSheet, Text, View,TextInput, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SearchBox from '../components/Explore/SearchBox';
import styles from '../components/Explore/styles';
import SearchResults from '../components/Explore/SearchResults';
import { InstantSearch, Index ,  Configure} from "react-instantsearch/dom";
//import algoliasearch from 'algoliasearch/lite';
import algoliasearch from "algoliasearch";


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