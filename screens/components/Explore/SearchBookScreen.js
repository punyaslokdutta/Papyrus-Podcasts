import React, { useEffect, useState } from 'react';
import {View, Text,FlatList,ActivityIndicator,BackHandler} from 'react-native';
//var {width, height}=Dimensions.get('window')
import SearchResults from './SearchResults';
import { InstantSearch, Index ,  Configure} from "react-instantsearch/dom";
//import algoliasearch from 'algoliasearch/lite';
import ItemSeperator from "./ItemSeperator";
import algoliasearch from "algoliasearch";
import styles from './styles'

import {useSelector,useDispatch} from 'react-redux';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import SearchBookItem from './SearchBookItem';

const searchClient = algoliasearch(
  'GL4BSOR8T3',
  '015571974bee040ecf4f58bf3276f8b3'
);
const index = searchClient.initIndex('Books');
const SearchBookScreen=(props)=>
{
    const dispatch=useDispatch();

    const searchQuery = useSelector(state=>state.userReducer.algoliaQuery)
    console.log("Search Query: ",searchQuery);
    const [books,setBooks] = useState(null);
    const [lastPage,setLastPage] = useState(0);
    const [loading,setLoading] = useState(false);
    const [refreshing,setRefreshing] = useState(false);
    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);
    const numHits = 10;
    useEffect( ()=>
        {
            setLoading(true);
            console.log("Inside useEffect of SearchBookScreen")
 
            if(searchQuery == "" || searchQuery == null)
            {
                setBooks(null)
                setLoading(false);
            }

            searchQuery && index.search(searchQuery,{
                page : 0,
                hitsPerPage : numHits
            }).then(({hits})=>
            {
                setBooks(hits);
                setLoading(false);
                console.log(hits);
            })
            
            
        }, [searchQuery]
    )

    useEffect( ()=>
        {
            setRefreshing(true);
            console.log("Inside useEffect of lastPage")
 
            if(searchQuery == "" || searchQuery == null)
            {
                //setBooks(null)
                setRefreshing(false);
            }

            searchQuery && index.search(searchQuery,{
                page : lastPage,
                hitsPerPage : numHits
            }).then(({hits})=>
            {

                (books != undefined) && (books.length != 0) && (hits.length != 0) && 
                     setBooks([...books,...hits]);
                setRefreshing(false);
                console.log(hits);
            })
           // setRefreshing(false);
        }, [lastPage]
    )

    // useEffect(
    //     () => {
    //       console.log("Inside useEffect - componentDidMount of SearchBookScreen");
    //       BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
    //       return () => {
    //         console.log(" back_Button_Press Unmounted");
    //         BackHandler.removeEventListener("hardwareBackPress",  back_Button_Press);
    //         props.navigation.navigate('Explore');
  
    //       };
    //     }, [back_Button_Press])

    function back_Button_Press()
    {
        console.log("Inside BackButton Press");
        dispatch({type:"SET_ALGOLIA_QUERY", payload: null})
        return false;
        //BackHandler.removeEventListener('hardwareBackPress', this.back_Buttton_Press);
    }
    

    function renderDatas({item,index})
    {
        console.log(item)
       return(
           <View>
         <SearchBookItem book={item} index={index} navigation={props.navigation}/>
          </View>
       )
    }

    function onEndReached({ distanceFromEnd }){

        if(!onEndReachedCalledDuringMomentum){
          setLastPage(lastPage+1);
          setOnEndReachedCalledDuringMomentum(true);
        }
        
      }

    function renderFooter() {
        try {
          // Check If Loading
          if (refreshing == true) {
            return (
              <ActivityIndicator/>
            )
          }
          else {
            return null;
          }
        }
        catch (error) {
          console.log(error);
        }
      }

      if(loading == true)
      {
        return (
            <View>
            <ActivityIndicator/>
            </View>
          )
      }
      else
      {
        return (
            <FlatList
          data={books}
          renderItem={renderDatas}
          //numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.Book_Name}
          ItemSeparatorComponent={ItemSeperator}
          //ListHeaderComponent={this.renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
        />
      );
      }
    
}

export default SearchBookScreen;
