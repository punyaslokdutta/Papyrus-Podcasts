import React, { useEffect, useState } from 'react';
import {View,FlatList,ActivityIndicator,BackHandler,StyleSheet,  SafeAreaView,Image,  TextInput, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore';
import storage, { firebase } from '@react-native-firebase/storage'
import Toast from 'react-native-simple-toast';
import BottomSheet from 'reanimated-bottom-sheet'

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
import SearchChapterItem from './SearchChapterItem';
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

const index = searchClient.initIndex('chapters');
const replicaIndex = searchClient.initIndex('chapters');

var {width, height}=Dimensions.get('window')
const SearchChapterScreen=(props)=>
{
    const dispatch=useDispatch();
    const userID = props.firebase._getUid();

    const initialAuthors  ={
      tag: '',
      tagsArray: []
    }

    const searchQuery = useSelector(state=>state.userReducer.algoliaQuery)
    const fromExploreScreen = useSelector(state=>state.userReducer.isExplorePreviousScreen)

    console.log("Search Query: ",searchQuery);
    const [chapters,setChapters] = useState(null);
    const [lastPage,setLastPage] = useState(0);
    const [loading,setLoading] = useState(false);
    const [refreshing,setRefreshing] = useState(false);
    const [chapterImage, setChapterImage]=useState(null);
    const [ChapterImageDownloadURL, setChapterImageDownloadURL]=useState(null);
    const [uploadChapterSuccess, setUploadChapterSuccess]=useState(false)
    const [chapterID,setChapterID] = useState(null);
    var [chapterNameState, setChapterNameState] = useState(null);
    
    const [authors, setAuthors]=useState(initialAuthors);

    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);
    const numHits = 10;

    async function uploadImage() {
      ImagePicker.showImagePicker(options, async (response) => {
        console.log('Response URI = ', response.uri);
        console.log('Response PATH = ', response.path);
  
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
          console.log("Before storageRef.putFile");
          setChapterImage(source)
          var refPath = "Chapters/images/" + userID + "_" + Date.now() + ".jpg";
          var storageRef = storage().ref(refPath);
          console.log("Before storageRef.putFile");
  
          ImageResizer.createResizedImage(response.path, 720, 720, 'JPEG',100)
        .then(({path}) => {
  
          const unsubscribe=storageRef.putFile(path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                //setIndeterminate(false);
                console.log("snapshot: " + snapshot.state);
                console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                //setProgress((snapshot.bytesTransferred / snapshot.totalBytes));
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  console.log("Success");
                }
              },
              error => {
                unsubscribe();
                console.log("image upload error: " + error.toString());
              },
              () => {
                storageRef.getDownloadURL()
                  .then((downloadUrl) => {
                    console.log("File available at: " + downloadUrl);
                    setChapterImageDownloadURL(downloadUrl);
                  })
              }
            )
            });
          }
      });
    }

    useEffect( ()=>
        {
            setLoading(true);
            console.log("Inside useEffect of SearchChapterScreen")
             setChapterNameState(searchQuery);
            if(searchQuery == "" || searchQuery == null)
            {
                setChapters(null)
                setLoading(false);
            }

            // searchQuery && index.search(searchQuery,{
            //     page : 0,
            //     hitsPerPage : numHits
            // }).then(({hits})=>
            // {
            //     setChapters(hits);
            //     setLoading(false);
            //     console.log(hits);
            // }).catch(function(error) {
            //     console.log("Error loading document: ", error);
            //     //Toast.show("Error: Please try again.")
            //     setLoading(false)
            // });
            
            searchQuery && replicaIndex.search(searchQuery,{
              page : 0,
              hitsPerPage : numHits
          }).then(({hits})=>
          {
              setChapters(hits);
              setLoading(false);
              console.log(hits);
          }).catch(function(error) {
              console.log("Error loading document: ", error);
              //Toast.show("Error: Please try again.")
              setLoading(false)
          });

        }, [searchQuery]
    )

    useEffect( ()=>
        {
            setRefreshing(true);
            console.log("Inside useEffect of lastPage")
 
            if(searchQuery == "" || searchQuery == null)
            {
                setRefreshing(false);
            }

            searchQuery && index.search(searchQuery,{
                page : lastPage,
                hitsPerPage : numHits
            }).then(({hits})=>
            {

                (chapters != undefined) && (chapters.length != 0) && (hits.length != 0) && 
                     setChapters([...chapters,...hits]);
                setRefreshing(false);
                console.log(hits);
            }).catch(function(error) {
                console.log("Error adding document: ", error);
                //Toast.show("Error: Please try again.")
                setRefreshing(false);

            });
           // setRefreshing(false);
        }, [lastPage]
    )

    useEffect(() => {
      const article = {
        bookName : chapterNameState,
        chapterPictures : [ChapterImageDownloadURL],
        chapterID : chapterID,
        authors : authors.tagsArray
      }

      uploadChapterSuccess && props.navigation.navigate('SelectScreen',{chapterItem:article});
    },[uploadChapterSuccess])

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

    function updateAuthorState(state){
      setAuthors(state);
    };

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
         <SearchChapterItem chapter={item} index={index} navigation={props.navigation}/>
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
          else if (fromExploreScreen == true)
          {
            return (
              <View style={{paddingBottom:height/96}}>
                <View style={[styles.seperator]} />
              <View style={{alignItems:'center'}}>
                <Text>{"\n"}Couldn't find your chapter?  </Text>
                <TouchableOpacity onPress={()=> {
                  setChapters([]);
                  props.navigation.navigate('SelectScreen');
                }}>
                <Text style={{textDecorationLine: 'underline',color:'rgb(218,165,32)'}}>Proceed to Select Screen to add chapter</Text>
                </TouchableOpacity>
                </View>
                </View>
            );
          }
          else 
          {
            return (
              <View style={{paddingBottom:height/96}}>
                <View style={[styles.seperator]} />
              <View style={{alignItems:'center'}}>
                <Text>{"\n"}Couldn't find your chapter?  </Text>
                <TouchableOpacity onPress={()=> {
                  setChapters([]);
                  dispatch({type:"SET_FROM_SEARCH_CHAPTER_SCREEN",payload:true});
                  dispatch({type:"SET_ALGOLIA_QUERY",payload:"dhdbshbdchsbdch"})
                  props.navigation.navigate('SearchBookScreen');
                }}>
                <Text style={{textDecorationLine: 'underline',color:'rgb(218,165,32)'}}>Proceed to SearchBookScreen to add book</Text>
                </TouchableOpacity>
                </View>
                </View>
            );
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
        return(
          
          <FlatList
          data={chapters}
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

export default withFirebaseHOC(SearchChapterScreen);

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
