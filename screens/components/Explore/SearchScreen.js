
import React, {useState,useEffect,Component} from 'react';
import { StyleSheet, Text, View,TextInput, Image,FlatList,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SearchBox from './SearchBox';
import styles from './styles';
import SearchResults from './SearchResults';
import { InstantSearch, Index ,  Configure} from "react-instantsearch/dom";
//import algoliasearch from 'algoliasearch/lite';
import algoliasearch from "algoliasearch";
import ItemSeperator from "./ItemSeperator";
import {useSelector,useDispatch} from 'react-redux';
import SearchOnlyBookItem from './SearchOnlyBookItem';

const searchClient = algoliasearch(
  'VSRFUPESVM',
  '4d3be49cf4512e3579ea5b198a420f1d'
);

const SearchScreen=(props)=> {
    
  const searchBookQuery = useSelector(state=>state.userReducer.algoliaBookQuery)
  const [books,setBooks] = useState(null);
  const [lastPage,setLastPage] = useState(0);
  const [loading,setLoading] = useState(false);
  const [refreshing,setRefreshing] = useState(false);

  const index = searchClient.initIndex('books');
  
  const numHits = 10;

  useEffect( ()=>
  {
      setLoading(true);
      console.log("Inside useEffect of SearchScreen")
       //setBookNameState(searchQuery);
      if(searchBookQuery == "" || searchBookQuery == null)
      {
          setBooks(null)
          setLoading(false);
      }

      searchBookQuery && index.search(searchBookQuery,{
          page : 0,
          hitsPerPage : numHits
      }).then(({hits})=>
      {
          setBooks(hits);
          setLoading(false);
          console.log("[SearchScreen] hits : ",hits);
      })
      
      
  }, [searchBookQuery]
)
  
  function renderDatas({item,index})
  {
      console.log(item)
    return(
        <View>
      <SearchOnlyBookItem book={item} index={index} navigation={props.navigation}/>
        </View>
    )
  }

  function renderHeader(){
    return(
      <View style={{paddingTop:20}}>
      <View style={styles.searchBoxContainer}>
      <SearchBox path="searchOnlyBook"/>
      </View>   
    </View>
    );
   }


   function renderFooter() {
    try {
      // Check If Loading
      if (refreshing == true) {
        return (
          <ActivityIndicator/>
        )
      }
      else
      {
        return null
      }
      // else 
      // {
      //   return (
      //     <View style={{paddingBottom:height/96}}>
      //       <View style={[styles.seperator]} />
      //     <View style={{alignItems:'center'}}>
      //       <Text>{"\n"}Couldn't find your book?  </Text>
      //       <TouchableOpacity onPress={()=> {
      //         setBooks([]);
      //       }}>
      //       <Text style={{textDecorationLine: 'underline',color:'rgb(218,165,32)'}}>Click Here to add book</Text>
      //       </TouchableOpacity>
      //       </View>
      //       </View>
      //   );
      // }
    }
    catch (error) {
      console.log(error);
    }
  }

    if(loading == true){
      return (
        <ActivityIndicator/>
      )
    }
    else{
      return (
        <FlatList
        data={books}
        renderItem={renderDatas}
        //numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.bookName}
        ItemSeparatorComponent={ItemSeperator}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        //onEndReached={onEndReached}
        //onEndReachedThreshold={0.5}
        //refreshing={refreshing}
        //onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
        /> 
      );
    }
}

export default SearchScreen;