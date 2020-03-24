import React, { useEffect, useState } from 'react';
import {View,FlatList,ActivityIndicator,BackHandler,StyleSheet,  SafeAreaView,Image,  TextInput, Dimensions, TouchableOpacity} from 'react-native';

import SearchResults from './SearchResults';
import { InstantSearch, Index ,  Configure} from "react-instantsearch/dom";
//import algoliasearch from 'algoliasearch/lite';
import ItemSeperator from "./ItemSeperator";
import algoliasearch from "algoliasearch";

import Text from '../categories/components/Text'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';

import {useSelector,useDispatch} from 'react-redux';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import SearchBookItem from './SearchBookItem';
import { ScrollView } from 'react-native-gesture-handler';

const options = {
  title: 'Select Podcast Cover',
  chooseFromLibraryButtonTitle: 'Select from Library'
};

const searchClient = algoliasearch(
  'BJ2O4N6NAY',
  '8dd4ee7d486981d0b1f375d6c81b9fda'
);
const index = searchClient.initIndex('Books');

var {width, height}=Dimensions.get('window')
const SearchBookScreen=(props)=>
{
    const dispatch=useDispatch();

    const searchQuery = useSelector(state=>state.userReducer.algoliaQuery)
    console.log("Search Query: ",searchQuery);
    const [books,setBooks] = useState(null);
    const [lastPage,setLastPage] = useState(0);
    const [loading,setLoading] = useState(false);
    const [refreshing,setRefreshing] = useState(false);
    const [bookImage, setBookImage]=useState(null);
    const [BookImageDownloadURL, setBookImageDownloadURL]=useState(null);

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
                        height: 40,
                        width:width/2, 
                        borderBottomColor: 'gray',
                  
                        marginTop: 20,
                        marginBottom: 10,
                        borderBottomWidth: 1,
                        
                        
                    }} >
            <TextInput
                   
                    style={styles.textInput}          
                    onChangeText={(text) => {} }
                    placeholder="Book"
                    placeholderTextColor='white'
                   // value={}                 
                />
              </View>


                  
                  
              
           <View  style={{
                        width:width/2, 
                        borderBottomColor: 'gray',
                        marginBottom: 10,
                        marginRight: 30,
                        borderBottomWidth: 1,
                        //textColor:'white'
                       // placeholderTextColor='white', 
                        
                    }} >
            <TextInput
                             
                    onChangeText={(text) => {}}
                    placeholder="Author(s)"
                    placeholderTextColor='white'
                    style={styles.textInput}
                    //value={}                 
                />
                </View>
                <View style={{paddingTop:width/8 ,alignItems: 'center',}}>

              <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}>
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

export default SearchBookScreen;

const styles = StyleSheet.create({
  textInput: {
   color: 'white',
  },
 });
