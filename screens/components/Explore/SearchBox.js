import React , {Component, useState}from "react";
import { TextInput } from "react-native";
import styles from "./styles";
import debounce from 'lodash/debounce';
import {useSelector,useDispatch} from 'react-redux'

const SearchBox=(props)=>{

  const dispatch=useDispatch();
  const [Query, setQuery]=useState(null);
  console.log("[SearchBox] props.path = ",props.path)
  
  return(
    <TextInput
      style={styles.textBox}
      //value={value}
      returnKeyType='search'
      onChangeText={(text)=>{setQuery(text)}}
      onSubmitEditing={()=>{  dispatch({type:"SET_ALGOLIA_QUERY", payload: Query})}}
      placeholder="Search by books, chapters, authors"
      placeholderTextColor={'black'}
    />
  );
}

export default SearchBox;
