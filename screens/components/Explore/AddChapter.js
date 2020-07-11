import React , {Component, useState,useEffect}from "react";
import { View,Text,  StyleSheet,  Dimensions, SafeAreaView, ScrollView , TouchableOpacity, Image, TextInput} from "react-native";
import TagInput from 'react-native-tags-input';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import {useSelector,useDispatch} from 'react-redux';
import {withFirebaseHOC} from '../../config/Firebase'
import storage, { firebase } from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

const options = {
    title: 'Select Podcast Cover',
    chooseFromLibraryButtonTitle: 'Select from Library'
  };



var {width, height}=Dimensions.get('window')
const AddChapter=(props)=>{

  const initialAuthors = {
    tag: '',
    tagsArray: []
  }
    const userID = props.firebase._getUid();
    const searchQuery = useSelector(state=>state.userReducer.algoliaQuery)
    console.log(props)
    const bookName = props.bookName;
    const dispatch = useDispatch();

    const [bookImage, setBookImage]=useState(null);
    const [BookImageDownloadURL, setBookImageDownloadURL]=useState(null);
    const [uploadBookSuccess, setUploadBookSuccess]=useState(false)
    const [bookID,setBookID] = useState(null);
    var [bookNameState, setBookNameState] = useState(bookName);
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
        //props.navigation.navigate('AddBookReviewScreen',{bookItem:article});
      },[uploadBookSuccess])

    function updateAuthorState(state){
        setAuthors(state);
      };

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
            var refPath = "books/images/" + userID + "_" + moment().format()() + ".jpg";
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




  return(
    <SafeAreaView style={{flex:1,backgroundColor:'#dddd', alignItems:'center'}}>
          <ScrollView>
           <View style={{ alignItems: 'center' , paddingTop:0}}>
       <View style={{ paddingTop: 10, flexDirection: 'column' , paddingBottom:20}}>
         <TouchableOpacity onPress={uploadImage}>
         <View>
           <Image source={bookImage} style={{ width: height / 6, height: height / 6, borderRadius: 20, borderColor: 'black', borderWidth: 1 }} />
         </View>
         </TouchableOpacity>
       </View>
      
     </View>
           <View  style={{
                       paddingTop: 0,
                       paddingBottom: 10,
                       paddingLeft: width/7,
                       paddingRight:width/7
                   }} >
           <TextInput
                  
                  style={styles.TextInputStyleClass2}
                  value={bookName}         
                 // onChangeText={(text) => {setBookNameState(text)} }
                   placeholder="Book"                
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
         containerStyle={{width:(width * 3) / 4}}
         inputContainerStyle={styles.textInput}
         tagStyle={styles.tag}
         tagTextStyle={styles.tagText}
         inputStyle={styles.TextInputStyleClass2}
         keysForTag={','}
         autoCorrect={false}

         />
               </View>
               <View style={{paddingTop:width/8 ,alignItems: 'center',}}>

             <TouchableOpacity onPress={()=>{
                 
               firestore().collection('books').add({
                 bookName : bookNameState,
                 authors : authors.tagsArray,
                 bookPictures : [BookImageDownloadURL],
                 reviewPending : true,
                 createdOn : moment().format()
               })
               .then(function(docRef){
                 firestore().collection('books').doc(docRef.id).set({
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
             <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Add Chapter</Text>
             </TouchableOpacity>
             </View> 
</ScrollView>
         </SafeAreaView>)
  
  }



export default withFirebaseHOC(AddChapter);



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
      borderRadius: 0,
      backgroundColor: "white",
      width: (width * 3) / 4,
      //paddingTop: 15,
      paddingLeft: 10,
      height: height / 18,
      paddingRight: 10,
  
    }
   });
  



