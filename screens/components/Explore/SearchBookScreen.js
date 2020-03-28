import React, { useEffect, useState } from 'react';
import {View,FlatList,ActivityIndicator,BackHandler,StyleSheet,  SafeAreaView,Image,  TextInput, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore';
import storage, { firebase } from '@react-native-firebase/storage'
import Toast from 'react-native-simple-toast';

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
import SearchBookItem from './SearchBookItem';
import { ScrollView } from 'react-native-gesture-handler';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';

const options = {
  title: 'Select Podcast Cover',
  chooseFromLibraryButtonTitle: 'Select from Library'
};

const searchClient = algoliasearch(
  'GL4BSOR8T3',
  '015571974bee040ecf4f58bf3276f8b3'
);
const index = searchClient.initIndex('Books');

var {width, height}=Dimensions.get('window')
const SearchBookScreen=(props)=>
{
    const dispatch=useDispatch();
    const userID = props.firebase._getUid();

    const initialAuthors  ={
      tag: '',
      tagsArray: []
    }

    const searchQuery = useSelector(state=>state.userReducer.algoliaQuery)
    console.log("Search Query: ",searchQuery);
    const [books,setBooks] = useState(null);
    const [lastPage,setLastPage] = useState(0);
    const [loading,setLoading] = useState(false);
    const [refreshing,setRefreshing] = useState(false);
    const [bookImage, setBookImage]=useState(null);
    const [BookImageDownloadURL, setBookImageDownloadURL]=useState(null);
    const [uploadBookSuccess, setUploadBookSuccess]=useState(false)
    const [bookID,setBookID] = useState(null);
    var [bookNameState, setBookNameState] = useState(null);
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
          setBookImage(source)
          var refPath = "Books/images/" + userID + "_" + Date.now() + ".jpg";
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
                    setBookImageDownloadURL(downloadUrl);
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
            console.log("Inside useEffect of SearchBookScreen")
             setBookNameState(searchQuery);
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
      const article = {
        title : bookNameState,
        bookPictures : [BookImageDownloadURL],
        bookID : bookID,
        authors : authors.tagsArray
      }

      uploadBookSuccess && props.navigation.navigate('SelectScreen',{bookItem:article});
    },[uploadBookSuccess])

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
          else 
          {
            return (
              <View style={{paddingBottom:height/96}}>
                <View style={[styles.seperator]} />
            
              <View style={{alignItems:'center'}}>
                <Text>{"\n"}Couldn't find your book?  </Text>
                <TouchableOpacity onPress={()=> {
            
                  // setBooks([]);
                }}>
                    
                <Text style={{textDecorationLine: 'underline',color:'rgb(218,165,32)'}}>Click Here to add book</Text>
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
      else if(books && books.length===0 )
      {
        return (
          
          <SafeAreaView style={{flex:1, backgroundColor:'#101010', alignItems:'center'}}>
           <ScrollView>
            <View style={{ alignItems: 'center' , paddingTop:height/8}}>
        <View style={{ paddingTop: 30, flexDirection: 'column' , paddingBottom:5}}>
          <TouchableOpacity onPress={uploadImage}>
          <View>
            <Image source={bookImage} style={{ width: height / 3, height: height / 6, borderRadius: 20, borderColor: 'white', borderWidth: 1 }} />
          </View>
          </TouchableOpacity>
        </View>
       
      </View>
            <View  style={{
                        paddingTop: 30,
                        paddingBottom: 10,
                        paddingLeft: width/7,
                        paddingRight:width/7
                    }} >
            <TextInput
                   
                   style={styles.TextInputStyleClass2}
                   value={bookNameState}         
                    onChangeText={(text) => {setBookNameState(text)} }
                    placeholder="Book"
                    //placeholderTextColor='white'
                   // value={}                 
                />
              </View>


                  
                  
              
              <View  style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 30,
                paddingBottom: 10,
                //paddingLeft: width/7,
                //paddingRight:width/7
                    }} >
          <TagInput
          updateState={updateAuthorState}
          tags={authors}
          placeholder="Author(s)" 
          //placeholderTextColor='white'
          label='Press comma to add a tag'
          labelStyle={{color: 'white'}}
          //leftElement={<Icon name={'tag'}  color={'white'}/>}
          //leftElementContainerStyle={{marginLeft: 3}}
          containerStyle={{width:(width * 3) / 4}}
          inputContainerStyle={styles.textInput}
          tagStyle={styles.tag}
          tagTextStyle={styles.tagText}
          inputStyle={styles.TextInputStyleClass2}
          keysForTag={','}
          autoCorrect={false}

          />


            {/* <TextInput   
                    onChangeText={(text) => {}}
                    placeholder="Author(s)"
                    placeholderTextColor='white'
                    style={styles.textInput}
                    //value={}                 
                /> */}
                </View>
                <View style={{paddingTop:width/8 ,alignItems: 'center',}}>

              <TouchableOpacity onPress={()=>{
                firestore().collection('Books').add({
                  title : bookNameState,
                  authors : authors.tagsArray,
                  bookPictures : [BookImageDownloadURL],
                  reviewPending : true
                })
                .then(function(docRef){
                  firestore().collection('Books').doc(docRef.id).set({
                    bookID : docRef.id
                  },{merge:true})

                  Toast.show("Book Successfully uploaded")
                  setBookID(docRef.id);
                  setUploadBookSuccess(true);

                })
                .catch(function(error) {
                  console.error("Error adding Book Document: ", error);
                  Toast.show("Error: Please try again.")
              });
              }} 
              style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}>
              <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Add Book</Text>
              </TouchableOpacity>
              </View> 
</ScrollView>
          </SafeAreaView>
          
      );
      }
      else
      {
        return(
          
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
