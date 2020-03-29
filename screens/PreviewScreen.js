import React, { Component, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Button, SafeAreaView, Dimensions, Image,  TextInput, Platform , BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import storage, { firebase } from '@react-native-firebase/storage'
import { withFirebaseHOC } from '../screens/config/Firebase'
import ImagePicker from 'react-native-image-picker'
import TagInput from 'react-native-tags-input';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import ImageResizer from 'react-native-image-resizer';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-simple-toast';
import HomeScreen from './HomeScreen';
import moment from 'moment';
//import { firebase } from '@react-native-firebase/functions';


const { width, height } = Dimensions.get('window');
const options = {
  title: 'Select Podcast Cover',
  chooseFromLibraryButtonTitle: 'Select from Library'
};

const initialTags  ={
  tag: '',
  tagsArray: [], 

}
const PreviewScreen = (props) => {

  const dispatch = useDispatch();
  const [PodcastImage, setPodcastImage] = useState(null);
  const ChapterName=useSelector(state=>state.recorderReducer.ChapterName)
  const BookName=useSelector(state=>state.recorderReducer.BookName)
  const AuthorName=useSelector(state=>state.recorderReducer.AuthorName)
  const LanguageSelected=useSelector(state=>state.recorderReducer.LanguageSelected)
  const bookId=useSelector(state=>state.recorderReducer.bookId)
 
  //BOOK_ID to be returned from recorderReducer which will be dispatched by Algolia 
  //For Now, Books which are not present in our database is handled. 
  // 1. Create a Book Document , Get the Doc RefId . Make Podcast Collection and Document. 
  // 2. Add a Review : "Pending" to these Books .
  // 3. Cloud Function for Image Resizing 
  // 4. Cloud Function for indexing the podcast , Pending Books are not indexed.
  // 5. OverAll PodcastCountUpdate 
  // 6. Build a unique path in Google storage for podcasts and images while uploading
  // 7. 50K Books 2lac podcasts 50K users (3 lac documents) [Algolia Indexing]
  // 8. 

  const [recordedFilePath, setrecordedFilePath] = useState(props.navigation.getParam('recordedFilePath'));
  const [Description, setDescription] = useState(null);
  const [PodcastName, setPodcastName]=useState(null);
  const [Tags, setTags]=useState(initialTags);
  const [tagsColor, settagsColor]=useState('#3ca897');
  const [tagsText, settagsText]=useState('#fff');
  const [podcastImageDownloadURL,setPodcastImageDownloadURL] = useState(null);
  const [podcastAudioDownloadURL,setPodcastAudioDownloadURL] = useState(null);
  const [Duration , setDuration]=useState(props.navigation.getParam('duration'))
  const [progress, setProgress]=useState(0)
  const [indeterminate, setIndeterminate]=useState(true)
  const [toggleIndicator, setToggleIndicator]=useState(false)
  const [uploadPodcastSuccess, setUploadPodcastSuccess]=useState(false)
  const [PodcastID,setPodcastID] = useState(null);
  const [warningMessage, setWarningMessage]=useState(false)

  const numCreatedBookPodcasts = useSelector(state=>state.userReducer.numCreatedBookPodcasts);
  const numCreatedChapterPodcasts = useSelector(state=>state.userReducer.numCreatedChapterPodcasts);
  const incrementedValue = numCreatedBookPodcasts + 1;

  const userName = useSelector(state=>state.userReducer.name);
  const userID = props.firebase._getUid();
  const privateDataID = "private" + userID;

  useEffect(
    () => {       
        podcastAudioDownloadURL && 
        firestore().collection('users').doc(userID).collection('privateUserData').
                        doc(privateDataID).set({
              numCreatedBookPodcasts : incrementedValue
                },{merge:true}) && 

        dispatch({type:"ADD_NUM_CREATED_BOOK_PODCASTS", payload: incrementedValue}) &&

        firestore().collection('Books').doc(bookId).collection('Podcasts')
      .add({
        AudioFileLink: podcastAudioDownloadURL,
        BookID: bookId, 
        ChapterName: "",
        Book_Name: BookName, 
        Duration: Duration,
        Genres: ["Non-Fiction","Science & Technology"],
        Language: LanguageSelected,
        Podcast_Name: PodcastName,
        Podcast_Pictures: [podcastImageDownloadURL],
        Timestamp: moment().format(),
        description: Description,
        Tags_Array : Tags.tagsArray,
        podcasterID: userID,
        podcasterName: userName,
        numUsersLiked : 0,
        AuthorName:AuthorName
    })
    .then(async function(docRef, props) {
        console.log("Document written with ID: ", docRef.id);
        firestore().collection('Books').doc(bookId).collection('Podcasts')
                .doc(docRef.id).set({
                    PodcastID: docRef.id
                },{merge:true})
         Toast.show("Successfully uploaded")
         setPodcastID(docRef.id)
         setUploadPodcastSuccess(true);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        Toast.show("Error: Please try again.")
    });
            
          
    },[podcastAudioDownloadURL])

    async function indexPodcast(){
      const instance = firebase.app().functions("asia-northeast1").httpsCallable('AddToPodcastsIndex');
        if(uploadPodcastSuccess == true)
        {
          try 
          {          
            await instance({ // change in podcast docs created by  user
              Timestamp : moment().format(),
              PodcastID : PodcastID,
              Podcast_Picture : podcastImageDownloadURL,
              Book_Name : BookName,
              Podcast_Name : PodcastName,
              Language : LanguageSelected,
              PodcasterName : userName, 
              AuthorName:AuthorName

            });
          }
          catch (e) 
          {
            console.log(e);
          }
          
          props.navigation.navigate('HomeScreen');
        }
    }

    useEffect(
      () => {
        indexPodcast();
        
      },[uploadPodcastSuccess]
    )


    useEffect(
      () => {
        console.log("Inside useEffect - componentDidMount of PreviewScreen");
        BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
        //if(props.navigation.state.params.Book_Name != null)
        //  dispatch({type:"CHANGE_BOOK",payload:props.navigation.state.params.Book_Name})
        //if(props.navigation.state.params.BookID != null)
        //  dispatch({type:"CHANGE_BOOK_ID",payload:props.navigation.state.params.BookID})
        return () => {
          console.log(" back_Button_Press Unmounted");
          BackHandler.removeEventListener("hardwareBackPress",  back_Button_Press);
          uploadPodcastSuccess && props.navigation.navigate('HomeScreen');

        };
      }, [back_Button_Press])
      


  function updateTagState(state){
    setTags(state);
  };


  function uploadPodcast(recordedFilePath)
  {
    //BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
    setToggleIndicator(true);
    uploadAudio(recordedFilePath);
  }

  function back_Button_Press()
  {
    console.log("Inside BackButton Press");
    if(!warningMessage)
    {
      Toast.show("Warning: Changes will be discarded on BackPress")
      setWarningMessage(true);
      return true;
      //dispatch({type:"TOGGLE_MINI_PLAYER"})
      
  }
  return false;
 


    //BackHandler.removeEventListener('hardwareBackPress', this.back_Buttton_Press);

   

 
  }




  

  async function uploadAudio(FilePath) {

    var refPath = "podcasts/audio/" + userID + "_" + Date.now() + ".m4a";
    var storageRef = storage().ref(refPath);
    console.log("Before storageRef.putFile in uploadAudio ");

    FilePath && storageRef.putFile(FilePath)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          setIndeterminate(false);
          console.log("snapshot: " + snapshot.state);
          console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes));
          
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            console.log("Success");
            //setIndeterminate(true);

          }
        },
        error => {
          //unsubscribe();
          console.log("File upload error: " + error.toString()); 
        },
        () => {
          storageRef.getDownloadURL()
            .then((downloadUrl) => {
              console.log("File available at: " + downloadUrl);
              setPodcastAudioDownloadURL(downloadUrl);
              //setUploadPodcastSuccess(true);
            })
        }
      )

  }

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
        setPodcastImage(source)
        var refPath = "podcasts/images/" + userID + "_" + Date.now() + ".jpg";
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
                  setPodcastImageDownloadURL(downloadUrl);
                })
            }
          )
          });
        }
    });
  }

  return (
    
    <ScrollView style={{ flex: 1, backgroundColor: '#101010' }}>
      
    <SafeAreaView style={{ flex: 1, backgroundColor: '#101010' }}>
    
     
      <View style={styles.AppHeader}>
        <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
          <View style={{ paddingLeft: width / 12, paddingVertical: height / 20, flexDirection: 'row' }}>
            <Icon name="times" size={20} style={{ color: 'white' }} />
            <Text style={{ fontFamily: 'san-serif-light', color: 'white', paddingLeft: (width * 7) / 35, fontSize: 20 }}>New Podcast</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center' }}>
        <View style={{ paddingVertical: height / 50, flexDirection: 'column' , paddingBottom:width/10}}>
          <TouchableOpacity onPress={uploadImage}>
          <View>
            <Image source={PodcastImage} style={{ width: height / 6, height: height / 6, borderRadius: 20, borderColor: 'white', borderWidth: 1 }} />
          </View>
          </TouchableOpacity>
        </View>
       
      </View>
    
      
      
      
      
      <View style={{ paddingLeft: width / 8, paddingBottom: 10 }}>
        <TextInput
          value={BookName}
          style={styles.TextInputStyleClass2}
          underlineColorAndroid="transparent"
          placeholder={"Book Name" }
          placeholderTextColor={"black"}
          //onChangeText={(text) => setPodcastName(text)}
          numberOfLines={1}
          multiline={false}
        />
      </View>
      <View style={{ paddingLeft: width / 8, paddingBottom: 10 }}>
        <TextInput
          style={styles.TextInputStyleClass2}
          underlineColorAndroid="transparent"
          placeholder={"Podcast Title" }
          placeholderTextColor={"black"}
          onChangeText={(text) => setPodcastName(text)}
          numberOfLines={1}
          multiline={false}
        />
      </View>
      
      
      
      <View style={{ paddingLeft: width / 8 }}>
        <TextInput
          style={styles.TextInputStyleClass}
          underlineColorAndroid="transparent"
          placeholder={"How should your listeners approach this podcast? " }
          placeholderTextColor={"black"}
          onChangeText={(text) => setDescription(text)}
          numberOfLines={6}
          multiline={true}
        />
      </View>
      <View style={styles.tagcontainer}>
        <TagInput
          updateState={updateTagState}
          tags={Tags}
          placeholder="Tags.." 
          label='Press comma to add a tag'
          labelStyle={{color: '#fff'}}
          leftElement={<Icon name={'tag'}  color={'#000000'}/>}
          leftElementContainerStyle={{marginLeft: 3}}
          containerStyle={{width:(width * 3) / 4}}
          inputContainerStyle={[styles.textInput, {backgroundColor: 'white'}]}
          tagStyle={styles.tag}
          tagTextStyle={styles.tagText}
          keysForTag={','}
          autoCorrect={false}
          />
      </View>

     { 

     toggleIndicator && 
     
     <View style={{ paddingTop: height / 8, alignItems: 'center'}}> 
      <Progress.Bar
          color={rgb(218,165,32)}
          style={styles.progress}
          progress={progress}
          indeterminate={indeterminate}
        />
      </View>
     }
      
      {!toggleIndicator && 
       <View style={{ paddingTop: height / 8, alignItems: 'center' }}>

        <TouchableOpacity onPress={() => {uploadPodcast(recordedFilePath)
        }} style={{ alignItems: 'center', justifyContent: 'center', height: height / 16, width: height / 6, borderRadius: 15, borderColor:rgb(218,165,32), borderWidth: 1 }}
        >
          <Text style={{ alignItems: 'center', fontFamily: 'sans-serif-light', color:rgb(218,165,32),  justifyContent: 'center' }} >Publish</Text>
        </TouchableOpacity>
      </View>
}



      
    
    </SafeAreaView>
    
    </ScrollView>
    
    
    
   
  );
}

export default withFirebaseHOC(PreviewScreen);


const styles = StyleSheet.create({
  AppHeader:
  {
    flexDirection: 'row',
    backgroundColor: '#101010'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container2: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'black',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  buttonStyle: {
    padding: 10,
    backgroundColor: '#202646',
    borderRadius: 5
  },
  textStyle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center'
  },
  TextInputStyleClass: {

    //textAlign: 'center',
    fontFamily: 'san-serif-light',
    fontStyle: 'italic',
    color: 'black',
    height: height / 6,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    height: height / 6,
    width: (width * 3) / 4,
    paddingLeft: 10,
    paddingRight: 10

  },
  progress: {
    

    //margin: 10,
    //paddingTop: height / 8,
    //alignItems: 'center'
  },
  TextInputStyleClass2: {

    //textAlign: 'center',
    fontFamily: 'san-serif-light',
    fontStyle: 'italic',
    color: 'black',
    borderWidth: 2,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    width: (width * 3) / 4,
    paddingLeft: 10,
    height: height / 18,
    paddingRight: 10,

  }, 
  tagcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  textInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    padding: 3,
  }, 
  tag: {
    backgroundColor: 'grey'
  }, 
  tagText: {
    color: 'black'
  },
  
});