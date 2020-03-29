import React , {Component, useState}from "react";
import { TextInput } from "react-native";
import styles from "./styles";
import debounce from 'lodash/debounce';
import {useSelector,useDispatch} from 'react-redux'

// const ddSearchBox = connectSearchBox(({ refine, currentRefinement }) => {

//   return (
//     <TextInput
//       style={styles.textBox}
//       onChangeText={text => refine(text)}
//       value={currentRefinement}
//       placeholder="Search Something"
//       clearButtonMode="always"
//       spellCheck={false}
//       autoCorrect={false}
//       autoCapitalize="none"
//     />
//   );
// });
const SearchBox=(props)=>{

  const dispatch=useDispatch();
  const [Query, setQuery]=useState(null);
  console.log("[SearchBox] props.path = ",props.path)
  if(props.path == "searchOnlyBook")
  {
    return(
      <TextInput
        style={styles.textBox}
        //value={value}
        returnKeyType='search'
        onChangeText={(text)=>{setQuery(text)}}
        onSubmitEditing={()=>{  dispatch({type:"SET_ALGOLIA_BOOK_QUERY", payload: Query})}}
        placeholder="Search Book"
        placeholderTextColor={'black'}
      />
    );
  }
  else
  {
    return(
      <TextInput
        style={styles.textBox}
        //value={value}
        returnKeyType='search'
        onChangeText={(text)=>{setQuery(text)}}
        onSubmitEditing={()=>{  dispatch({type:"SET_ALGOLIA_QUERY", payload: Query})}}
        placeholder="Search Books, Podcasts, Chapters"
        placeholderTextColor={'black'}
      />
    );
  }
  
  }



//const DebouncedSearchBox = connectSearchBox(SearchBox);
export default SearchBox;
