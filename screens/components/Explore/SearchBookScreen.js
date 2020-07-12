import React, { useEffect, useState , useRef} from 'react';
import {View,FlatList,ActivityIndicator,BackHandler,StyleSheet,  SafeAreaView,Image,  TextInput, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore';
import storage, { firebase } from '@react-native-firebase/storage'
import Toast from 'react-native-simple-toast';
import AddBook from '../Explore/AddBook';

import RBSheet from "react-native-raw-bottom-sheet";
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
import SearchBookItem from './SearchBookItem';
import { ScrollView } from 'react-native-gesture-handler';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';
import LinearGradient from 'react-native-linear-gradient';

const options = {
  title: 'Select Podcast Cover',
  chooseFromLibraryButtonTitle: 'Select from Library'
};





var {width, height}=Dimensions.get('window')
const SearchBookScreen=(props)=>
{
    const dispatch=useDispatch();
    const refRBSheet = useRef();
    const userID = props.firebase._getUid();

    const algoliaAPPID = useSelector(state=>state.userReducer.algoliaAPPID);
    const algoliaAPIKey = useSelector(state=>state.userReducer.algoliaAPIKey);

    const searchClient = algoliasearch(
      algoliaAPPID,
      algoliaAPIKey
    );

    const index = searchClient.initIndex('prod_books');
    //const index = searchClient.initIndex('prod_books');

    const fromSearchChapterScreen = useSelector(state=>state.userReducer.fromSearchChapterScreen)
    console.log("FROM_SEARCH_CHAPTER_SCREEN : ",fromSearchChapterScreen)

    const initialAuthors  ={
      tag: '',
      tagsArray: []
    }

    const bookAdded = useSelector(state=>state.userReducer.bookAdded)
    const searchQuery = useSelector(state=>state.userReducer.algoliaQuery)
    const fromExploreScreen = useSelector(state=>state.userReducer.isExplorePreviousScreen)

    console.log("Search Query: ",searchQuery);
    console.log("fromExploreScreen : ",fromExploreScreen);
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

    useEffect(() => {
      (bookAdded !== null) && props.navigation.navigate('AddBookReviewScreen',{bookItem:bookAdded})
      && dispatch({type:"ADD_BOOK",payload:null})//refRBSheet.current.close()
    },[bookAdded])

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
         <SearchBookItem book={item} index={index} fromSearchChapterScreen={fromSearchChapterScreen} navigation={props.navigation}/>
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
          else
          {
            
              return (
                <View style={{paddingBottom:height/96}}>
                  <View style={[styles.seperator]} />
              
                <View style={{alignItems:'center'}}>
                  <Text style={{fontFamily:'Montserrat-Medium',color:'gray',paddingBottom:10}}>{"\n"}Couldn't find your book ?</Text>
                  <LinearGradient style={{borderRadius:5}} colors={['transparent','rgb(218,165,32)']}>

                  <TouchableOpacity style={{borderRadius:5,height:40,width:width*5/12,marginTop:0,alignItems:'center',justifyContent:'center'}} onPress={() => {refRBSheet.current.open()
                                                    }}>
                                 
                  <RBSheet
                    ref={refRBSheet}
                    animationType={"slide"}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    duration={50}
                    customStyles={{
                      container:{
                        backgroundColor: 'rgb(218,165,32)',
                        height:(height*5)/8,
                        borderTopLeftRadius : 40,
                        borderTopRightRadius : 40
                      },
                      wrapper: {
                        backgroundColor: "transparent"
                      },
                      draggableIcon: {
                        backgroundColor: "#000"
                      }
                    }}
                  >
                 <AddBook refRb ={refRBSheet.current}/>
                 </RBSheet>
                      
                  <Text style={{fontFamily:'Caudex-Bold', color:'black'}}>Click Here to add book</Text>
                  </TouchableOpacity>
                  </LinearGradient>

                  </View>
                  </View>
              );
          } 
        }

      
      if(loading == true
        )
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
          data={books}
          renderItem={renderDatas}
          //numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.bookName}
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

export default withFirebaseHOC(SearchBookScreen);

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
