import React , {Component, useState,useEffect}from "react";
import { View,Text,  StyleSheet,  Dimensions, SafeAreaView, ScrollView , TouchableOpacity, Image, TextInput, ActivityIndicator} from "react-native";
import TagInput from 'react-native-tags-input';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import {useSelector,useDispatch} from 'react-redux';
import {withFirebaseHOC} from '../../config/Firebase'
import storage, { firebase } from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';


const options = {
    title: 'Select Podcast Cover',
    chooseFromLibraryButtonTitle: 'Select from Library'
  };

var {width, height}=Dimensions.get('window')
const AddBook=(props)=>{

  const [tagsLength,setTagsLength] = useState(0);
  const initialAuthors = {
    tag: '',
    tagsArray: []
  }
    const userID = props.firebase._getUid();
    const searchQuery = useSelector(state=>state.userReducer.algoliaQuery)

    const dispatch = useDispatch();

    const [loading,setLoading] = useState(false);
    const [bookImage, setBookImage]=useState(null);
    const [BookImageDownloadURL, setBookImageDownloadURL]=useState(null);
    const [uploadBookSuccess, setUploadBookSuccess]=useState(false)
    const [bookID,setBookID] = useState(null);
    var [bookNameState, setBookNameState] = useState(searchQuery);
    const [authors, setAuthors]=useState(initialAuthors);

    useEffect(() => {
        
        const article = {
          bookName : bookNameState,
          bookPictures : [BookImageDownloadURL],
          bookID : bookID,
          authors : authors.tagsArray
        }
        uploadBookSuccess && 
        dispatch({type:"ADD_BOOK",payload:article}) 
        //props.navigation.navigate('SelectScreen',{bookItem:article});
      },[uploadBookSuccess])

    function updateAuthorState(state)
    {
      console.log(state);
      // if(state.tag.replace(/\s/g,'').length)
      if(state.tagsArray.length == 0)
      {
        setAuthors(state);
        setTagsLength(0);
        return;
      } 
      if(state.tagsArray.length != tagsLength)  // for trimming last selected author(tag)
      {
        var trimmedTagState = state;
        // if(state.tagsArray.length != 0)
        // {
          const trimmedTag = state.tagsArray[state.tagsArray.length - 1].trim();
          trimmedTagState.tagsArray[trimmedTagState.tagsArray.length - 1] = trimmedTag;
          setAuthors(trimmedTagState);
          setTagsLength(trimmedTagState.tagsArray.length);
      }
      else
        setAuthors(state);

        var tagsArrayLength = state.tagsArray.length;
      if(tagsArrayLength != 0)
      {
        if(state.tagsArray[tagsArrayLength-1].length == 0 || !state.tagsArray[tagsArrayLength-1].replace(/\s/g,'').length) // to check for whitespaces at right or left
        {
          var tagState = state;
          tagState.tagsArray.pop();
          setAuthors(tagState);   
        }
      }
            
    };

    async function uploadImage() {

      try{
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
            var refPath = "books/images/" + userID + "_" + moment().format() + ".jpg";
            var storageRef = storage().ref(refPath);
            console.log("Before storageRef.putFile");
    
            ImageResizer.createResizedImage(response.path, 720, 720, 'JPEG',100)
          .then(({path}) => {
    
            storageRef.putFile(path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
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
                  console.log("Book image upload error: " + error.toString());
                },
                () => {
                  storageRef.getDownloadURL()
                    .then((downloadUrl) => {
                      console.log("File available at: " + downloadUrl);
                      setBookImageDownloadURL(downloadUrl);
                    })
                    .catch(err => {
                      console.log("Error in storageRef.getDownloadURL() in uploadImage in AddBook: ",err);
                    })
                }
              )
              });
            }
        });
      }
      catch(error){
        console.log("Error in AddBook while uploading & resizing Book Image: ",error);
      }
    }




  return(
    <SafeAreaView style={{flex:1,backgroundColor:'black', alignItems:'center'}}>
    {/* <LinearGradient style={{borderRadius:5}} colors={['transparent','#9c9a86','#cccaa9','rgb(218,165,32)']}> */}
    <LinearGradient style={{borderRadius:5}} colors={['rgb(218,165,32)','#cccaa9','#9c9a86','transparent']}>

          <ScrollView>
           <View style={{ alignItems: 'center' , paddingTop:0}}>
       <View style={{ paddingTop: 10, flexDirection: 'column' , paddingBottom:20}}>
         <TouchableOpacity onPress={uploadImage}>
         <View>
           {
             bookImage == null
             ?
             <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/Insert-Image.png"}} style={{ width: height / 6, height: height / 6, borderRadius: 20, borderColor: 'black', borderWidth: 1 }} />
             :
             <Image source={bookImage} style={{ width: height / 6, height: height / 6, borderRadius: 20, borderColor: 'black', borderWidth: 1 }} />
           }
           
         </View>
         </TouchableOpacity>
       </View>
      
     </View>
           <View  style={{
                       paddingTop: 0,
                       paddingBottom: 0,
                       alignItems:'center',
                       marginHorizontal : width/8 
                   }} >
           <TextInput
                  style={styles.TextInputStyleClass2}
                  value={bookNameState}        
                  onChangeText={(text) => {setBookNameState(text)} }
                  placeholder="Book"
                  numberOfLines={1}
                  multiline={false}
                  onBlur={() => {
                    setBookNameState(bookNameState.trim());
                    if(bookNameState != null && bookNameState.length < 1)
                    {
                      setBookNameState(null);
                      alert('Please enter the name of the book you want to add');
                    }
                  }}                
               />
             </View>


                 
                 
             
             <View  style={{
               flex: 1,
               justifyContent: 'center',
               alignItems: 'center',
               paddingTop: 0,
               paddingBottom: 0,
                   }} >
         <TagInput
         updateState={updateAuthorState}
         tags={authors}
         placeholder="Author(s)" 
         label='Press comma to add an author'
         labelStyle={{color: 'black'}}
         containerStyle={{width:(width * 49) / 60}}
         inputContainerStyle={styles.textInput}
         tagStyle={styles.tag}
         tagTextStyle={styles.tagText}
         inputStyle={styles.TextInputStyleClass2}
         keysForTag={','}
         autoCorrect={false}

         />
               </View>
               <View style={{paddingTop:width/8 ,alignItems: 'center',}}>

            {
              loading == true ?
                 <ActivityIndicator/>
                 :
                 <TouchableOpacity onPress={()=>{
                  
                  if(bookNameState === null)
                  {
                    alert('Please enter the name of the book you want to add');
                    return;
                  }
                  else if(!bookNameState.replace(/\s/g,'').length)
                  {
                    setBookNameState(null);
                    alert("Please enter some text in book name field");
                    return;
                  }
                  else if(authors.tagsArray.length == 0)
                  {
                    alert('Please enter atleast 1 author for your book');
                    return;
                  }
                setLoading(true);

                firestore().collection('books').add({
                  bookName : bookNameState,
                  authors : authors.tagsArray,
                  bookPictures : [BookImageDownloadURL],
                  reviewPending : true,
                  createdOn : moment().format(),
                  createdBy : userID
                })
                .then(function(docRef){
                  firestore().collection('books').doc(docRef.id).set({
                    bookID : docRef.id
                  },{merge:true})

                  Toast.show("Book Successfully uploaded")
                  setBookID(docRef.id);
                  setUploadBookSuccess(true);
                  setLoading(false);
                })
                .catch(function(error) {
                  console.error("Error adding Book Document: ", error);
                  Toast.show("Error: Please try again.")
              });
              }} 
              style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}>
              <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Add Book</Text>
              </TouchableOpacity>
            }
             
             </View> 
</ScrollView>
</LinearGradient>
         </SafeAreaView>)
  
  }



export default withFirebaseHOC(AddBook);



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
      color: 'black',
      fontFamily: 'Andika-R'
    },
    seperator: {
      borderBottomColor: '#d1d0d4',
      borderBottomWidth: 1
    },
    TextInputStyleClass2: {
  
      //textAlign: 'center',
      fontFamily: 'Andika-R',
      fontSize: 15,
      //fontStyle: 'italic',
      color: 'black',
      borderWidth: 1,
      borderColor: '#9E9E9E',
      borderRadius: 5,
      backgroundColor: "white",
      width: (width * 3) / 4,
      //paddingTop: 15,
      paddingLeft: 10,
      height: height / 18,
      //paddingRight: 10,
  
    }
   });
  



