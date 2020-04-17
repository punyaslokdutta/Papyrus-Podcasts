import React, { useEffect, useState , useRef} from 'react';
import {View,FlatList,ActivityIndicator,BackHandler,StyleSheet,  SafeAreaView,Image,  TextInput, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore';
import storage, { firebase } from '@react-native-firebase/storage'
import Toast from 'react-native-simple-toast';

import RBSheet from "react-native-raw-bottom-sheet";
import SearchResults from './SearchResults';
import { InstantSearch, Index ,  Configure} from "react-instantsearch/dom";
//import algoliasearch from 'algoliasearch/lite';
import ItemSeperator from "./ItemSeperator";
import algoliasearch from "algoliasearch";
import {withFirebaseHOC} from '../../config/Firebase'
import TagInput from 'react-native-tags-input';

import Text from '../categories/components/Text'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';

import {useSelector,useDispatch} from 'react-redux';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import SearchPodcastItem from './SearchPodcastItem';
import { ScrollView } from 'react-native-gesture-handler';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';

const options = {
  title: 'Select Podcast Cover',
  chooseFromLibraryButtonTitle: 'Select from Library'
};

const searchClient = algoliasearch(
  'BMHKOL10SE',
  '8ab33c27b3ed311ee783cf9d91fee1c6'
);
const index = searchClient.initIndex('podcasts');

var {width, height}=Dimensions.get('window')
const SearchPodcastScreen=(props)=>
{
    const dispatch=useDispatch();
    
    const initialAuthors  ={
      tag: '',
      tagsArray: []
    }

    const searchQuery = useSelector(state=>state.userReducer.algoliaQuery)
    console.log("Search Query: ",searchQuery);
    const [podcasts,setPodcasts] = useState(null);
    const [lastPage,setLastPage] = useState(0);
    const [loading,setLoading] = useState(false);
    const [refreshing,setRefreshing] = useState(false);

    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);
    const numHits = 10;

    useEffect( ()=>
        {
            setLoading(true);
            console.log("Inside useEffect of SearchPodcastScreen")
            if(searchQuery == "" || searchQuery == null)
            {
                setPodcasts(null)
                setLoading(false);
            }

            searchQuery && index.search(searchQuery,{
                page : 0,
                hitsPerPage : numHits
            }).then(({hits})=>
            {
                setPodcasts(hits);
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
                setPodcasts(null)
                setRefreshing(false);
            }

            searchQuery && index.search(searchQuery,{
                page : lastPage,
                hitsPerPage : numHits
            }).then(({hits})=>
            {

                (podcasts != undefined) && (podcasts.length != 0) && (hits.length != 0) && 
                setPodcasts([...podcasts,...hits]);
                setRefreshing(false);
                console.log(hits);
            })
           // setRefreshing(false);
        }, [lastPage]
    )

    useEffect(
        () => {
          return () => {
            console.log(" back_Button_Press Unmounted");
            dispatch({type:"SET_ALGOLIA_QUERY",payload:"papyrus"})
          };
        }, [])

    function renderDatas({item,index})
    {
        console.log(item)
       return(
           <View>
         <SearchPodcastItem podcast={item} index={index} navigation={props.navigation}/>
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

          if (refreshing == true) {
            return (
              <ActivityIndicator/>
            )
          }
          else{
            return null;
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
        return(
          
          <FlatList
          data={podcasts}
          renderItem={renderDatas}
          //numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.objectID}
          ItemSeparatorComponent={ItemSeperator}
          //ListHeaderComponent={this.renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
        /> 
        )
}
}

export default withFirebaseHOC(SearchPodcastScreen);

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: 'white',
    //borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    //padding: 3,
  }, 
  TextStyle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline'
  },
  tag: {
    backgroundColor: 'grey'
  }, 
  tagText: {
    color: 'black'
  },
  seperator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1
  },
  TextInputStyleClass2: {

    //textAlign: 'center',
    fontFamily: 'san-serif-light',
    fontStyle: 'italic',
    color: 'black',
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    width: (width * 3) / 4,
    //paddingTop: 15,
    paddingLeft: 10,
    height: height / 18,
    paddingRight: 10,

  }
 });