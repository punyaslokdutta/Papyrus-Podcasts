import React, { Component, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Button, SafeAreaView, Dimensions, Image,  TextInput, Platform , BackHandler, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
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
import moment from 'moment';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';


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

  console.log("In PreviewScreen");

  const dispatch = useDispatch();
  const displayPictureURL = useSelector(state=>state.userReducer.displayPictureURL)
  const [loadingPodcastImage,setLoadingPodcastImage] = useState(false);
  const userPreferences = useSelector(state=>state.userReducer.userPreferences);
  const [podcastImage, setPodcastImage] = useState("https://storage.googleapis.com/papyrus-fa45c.appspot.com/podcasts/Waves.jpg");
  const chapterName=useSelector(state=>state.recorderReducer.chapterName)
  const bookName=useSelector(state=>state.recorderReducer.bookName)
  const authors=useSelector(state=>state.recorderReducer.authors)
  const languageSelected=useSelector(state=>state.recorderReducer.languageSelected)
  const bookID=useSelector(state=>state.recorderReducer.bookID)
  const chapterID=useSelector(state=>state.recorderReducer.chapterID)
  const genres = useSelector(state=>state.recorderReducer.genres)
  const [publishLoading,setPublishLoading] = useState(false);
  const [recordedFilePath, setrecordedFilePath] = useState(props.navigation.getParam('recordedFilePath'));
  const [podcastDescription, setPodcastDescription] = useState(null);
  const [previewHeaderText,setPreviewHeaderText] = useState("New Podcast");
  const [podcastName, setPodcastName]=useState(null);
  const [tags, setTags]=useState(initialTags);
  const [tagsColor, settagsColor]=useState('#3ca897');
  const [tagsText, settagsText]=useState('#fff');
  const [tagsLength,setTagsLength] = useState(0);
  //const [podcastImageDownloadURL,setPodcastImageDownloadURL] = useState("https://storage.googleapis.com/papyrus-fa45c.appspot.com/podcasts/Waves.jpg");
  const [podcastAudioDownloadURL,setPodcastAudioDownloadURL] = useState(null);
  const [duration , setDuration]=useState(props.navigation.getParam('duration'))
  const [progress, setProgress]=useState(0)
  const [indeterminate, setIndeterminate]=useState(true)
  const [toggleIndicator, setToggleIndicator]=useState(false)
  const [uploadPodcastSuccess, setUploadPodcastSuccess]=useState(false)
  const [podcastID,setPodcastID] = useState(null);
  const [warningMessage, setWarningMessage]=useState(false)

  const numCreatedBookPodcasts = useSelector(state=>state.userReducer.numCreatedBookPodcasts);
  const numCreatedChapterPodcasts = useSelector(state=>state.userReducer.numCreatedChapterPodcasts);
  const totalMinutesRecorded = useSelector(state=>state.userReducer.totalMinutesRecorded);

  var incrementedValue = 0;
  
  if(chapterID !== null && chapterID !== undefined)
    incrementedValue = numCreatedChapterPodcasts + 1
  else
    incrementedValue = numCreatedBookPodcasts + 1

  const userName = useSelector(state=>state.userReducer.name);
  const userID = props.firebase._getUid();
  const privateDataID = "private" + userID;

  console.log("PREVIEW SCREEN")

  useEffect(() => {
    setup();
  },[])
  useEffect(() => { 

    if(podcastAudioDownloadURL !== null)
    {
      // uploading book podcast
      if(chapterID === null || chapterID === undefined)         
      {
        try{
          firestore().collection('users').doc(userID).collection('privateUserData').
                      doc(privateDataID).set({
            numCreatedBookPodcasts : incrementedValue//firestore.FieldValue.increment(1)
              },{merge:true})
              
          dispatch({type:"ADD_NUM_CREATED_BOOK_PODCASTS", payload: incrementedValue}) 
        }
        catch(error){
          console.log("updating numCreatedBookPodcasts in user Doc error: ", error)
        } 

        firestore().collection('books').doc(bookID).collection('podcasts').add({
          audioFileLink: podcastAudioDownloadURL,
          bookID: bookID, 
          chapterName: "",
          isChapterPodcast: false,
          bookName: bookName, 
          duration: duration,
          genres: genres,
          language: languageSelected,
          podcastName: podcastName,
          podcastPictures: [podcastImage],
          createdOn: moment().format(),
          lastEditedOn: moment().format(),
          podcastDescription: podcastDescription,
          tags : tags.tagsArray,
          podcasterID: userID,
          podcasterName: userName,
          podcasterDisplayPicture: displayPictureURL,
          numUsersLiked : 0,
          authors: authors
        })
        .then(async function(docRef, props) {
          console.log("Document written with ID: ", docRef.id);
          firestore().collection('books').doc(bookID).collection('podcasts')
                  .doc(docRef.id).set({
                      podcastID: docRef.id
                  },{merge:true})
            Toast.show("Successfully uploaded")
            setPodcastID(docRef.id)
            setTags({
              tag: '',
              tagsArray: [], 
            });
            setUploadPodcastSuccess(true);
            dispatch({type:"SET_PODCAST_UPLOAD_SUCCESS",payload:true});
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
          Toast.show("Error: Please try again.")
        });
      } 
      // uploading chapter podcast
      else                             
      {
        try{
          firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
                numCreatedChapterPodcasts : incrementedValue
              },{merge:true}) 

          dispatch({type:"ADD_NUM_CREATED_CHAPTER_PODCASTS", payload: incrementedValue}); 
        } 
        catch(error){
          console.log("updating numCreatedChapterPodcasts in user Doc error: ", error)
        }
        
        firestore().collection('books').doc(bookID).collection('chapters').doc(chapterID).collection('podcasts').add({
          audioFileLink: podcastAudioDownloadURL,
          bookID: bookID,
          chapterID: chapterID, 
          chapterName: chapterName,
          isChapterPodcast: true,
          bookName: bookName, 
          duration: duration,
          genres: genres,
          language: languageSelected,
          podcastName: podcastName,
          podcastPictures: [podcastImage],
          createdOn: moment().format(),
          lastEditedOn: moment().format(),
          podcastDescription: podcastDescription,
          tags : tags.tagsArray,
          podcasterID: userID,
          podcasterName: userName,
          podcasterDisplayPicture: displayPictureURL,
          numUsersLiked : 0,
          authors:authors
        })
        .then(async function(docRef, props) {
          console.log("Document written with ID: ", docRef.id);
          firestore().collection('books').doc(bookID).collection('chapters').doc(chapterID).collection('podcasts')
                  .doc(docRef.id).set({
                      podcastID: docRef.id
                  },{merge:true})
            Toast.show("Successfully uploaded")
            setPodcastID(docRef.id)
            setUploadPodcastSuccess(true);
            dispatch({type:"SET_PODCAST_UPLOAD_SUCCESS",payload:true});
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
          Toast.show("Error: Please try again.")
        });
      }
    }
              
  },[podcastAudioDownloadURL])

  async function setup() {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ],
      alwaysPauseOnInterruption: true
    });

    await TrackPlayer.add({
      id: "local-track",
      url: recordedFilePath,
      title: "cfdvdfvc",
      artist: userName,
      artwork: "dsccdcds",
      duration: duration
    });
    //await TrackPlayer.play();
  }

  async function indexEditedPodcast(){
    
    const podcast = props.navigation.state.params.podcast;
    const chapterNameValue = (podcast.isChapterPodcast == true) ? podcast.chapterName : null
    const instance = firebase.app().functions("asia-northeast1").httpsCallable('AddToPodcastsIndex');
      
    try 
    {          
      await instance({ // change in podcast docs created by  user
        createdOn : moment().format(),
        podcastID : podcast.podcastID,
        podcastPicture : podcastImage,
        chapterName : chapterNameValue,  // have to handle it in SearchPodcastItem *******************
        bookName : podcast.bookName,
        podcastName : podcastName,
        language : podcast.language,
        podcasterName : podcast.podcasterName
      });
    }
    catch (e) 
    {
      console.log(e);
    }
    finally{
      Toast.show("Edited Podcast Successfully");
      setPublishLoading(false);
      props.navigation.navigate("HomeScreen");
    }
        
      
  }


  async function indexPodcast(){

    const instance = firebase.app().functions("asia-northeast1").httpsCallable('AddToPodcastsIndex');
      if(uploadPodcastSuccess == true)
      {
        try 
        {          
          await instance({ // change in podcast docs created by  user
            createdOn : moment().format(),
            podcastID : podcastID,
            podcastPicture : podcastImage,
            chapterName : chapterName,  // have to handle it in SearchPodcastItem *******************
            bookName : bookName,
            podcastName : podcastName,
            language : languageSelected,
            podcasterName : userName
          });
        }
        catch (e) 
        {
          console.log(e);
        }
        
      }
  }
  
  async function updateTotalMinutesRecorded(updatedMinutesRecorded)
  {
    try{
      await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
        totalMinutesRecorded : updatedMinutesRecorded
      },{merge:true})
    }
    catch(error){
      console.log(error);
    }
  }

  async function addGenresToUserPreferences() {
    var tempUserPreferences = userPreferences;
    var prefsMap = {};

    for(var i=0;i<tempUserPreferences.length;i++)
      prefsMap[tempUserPreferences[i]] = true;
    
    if(tempUserPreferences.length < 10)
    {
      if(genres.length > 0)
      {
        for(var i=0;i<genres.length;i++)
        {
          if(prefsMap[genres[i]] != true)
          {
            tempUserPreferences.push(genres[i]);
            break;
          }
        }
      }
      dispatch({type:"SET_USER_PREFERENCES",payload:tempUserPreferences});

      firestore().collection('users').doc(userID).collection('privateUserData')
        .doc(privateDataID).set({
          userPreferences : tempUserPreferences
        },{merge:true}).then(() => {
          console.log("Successfully updated userPreferences of podcaster document");
        }).catch((err) => {
          console.log("Error in updating userPreferences of podcaster document");
        })
    }
  }

  useEffect(
    () => {
      if(uploadPodcastSuccess == true)
      {
        indexPodcast();
        addGenresToUserPreferences();
        const updatedMinutesRecorded = totalMinutesRecorded + duration/60; 
        dispatch({type:"UPDATE_TOTAL_MINUTES_RECORDED",payload:updatedMinutesRecorded});
        updateTotalMinutesRecorded(updatedMinutesRecorded);
        setTags(initialTags);
        props.navigation.navigate('HomeScreen');
      }
    },[uploadPodcastSuccess]
  )

  useEffect(() => {
    console.log("In USEEFFECT OF PREVIEW SCREEN");
    console.log("props.podcast = ",props.navigation.state.params.podcast);
    const podcast = props.navigation.state.params.podcast;
    if(podcast !== undefined && podcast !== null)
    {
      setPodcastDescription(podcast.podcastDescription);
      setPodcastName(podcast.podcastName);
      setPodcastImage(podcast.podcastPictures[0]);
      setPreviewHeaderText("Edit Podcast");
      
      var existingPodcastTags  ={
        tag: '',
        tagsArray: [], 
      
      }

      if(podcast.tags !== undefined && podcast.tags !== null)
      {
        existingPodcastTags  ={
          tag: '',
          tagsArray: podcast.tags, 
        
        }
      }
      
      setTags(existingPodcastTags);
    }
  },[])

  useEffect(
    () => {
      console.log("Inside useEffect - componentDidMount of PreviewScreen");
      
      BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
      return () => {
        console.log(" back_Button_Press Unmounted");
        BackHandler.removeEventListener("hardwareBackPress",  back_Button_Press);
        uploadPodcastSuccess && props.navigation.navigate('HomeScreen');

      };
  }, [back_Button_Press])
      

  function updateTagState(state)
  {
    console.log(state);
    
    if(state.tagsArray.length != tagsLength && state.tagsArray.length != 0)  // for trimming last selected tag
    {
      var trimmedTagState = state;
      const trimmedTag = state.tagsArray[state.tagsArray.length - 1].trim();
      trimmedTagState.tagsArray[trimmedTagState.tagsArray.length - 1] = trimmedTag;
      setTags(trimmedTagState);
      setTagsLength(trimmedTagState.tagsArray.length);
    }
    else
      setTags(state);

    var tagsArrayLength = state.tagsArray.length;
    if(tagsArrayLength != 0)
    {
      if(state.tagsArray[tagsArrayLength-1].length == 0 || !state.tagsArray[tagsArrayLength-1].replace(/\s/g,'').length)
      {
        var tagState = state;
        tagState.tagsArray.pop();
        setTags(tagState);   
      }
      

    }         
  };

  async function uploadEditedPodcast(podcast)
  {
    setPublishLoading(true);
    if(podcast.isChapterPodcast == false)
    {
      await firestore().collection('books').doc(podcast.bookID).collection('podcasts').doc(podcast.podcastID)
            .set({
              podcastPictures : [podcastImage],
              podcastName: podcastName,
              podcastDescription: podcastDescription,
              tags: tags.tagsArray,
              lastEditedOn: moment().format()
            },{merge:true}).then(() => {
              console.log("Successfully uploaded edited book podcast");
              indexEditedPodcast();
            }).catch((err) => {
              console.log("Error in uploading edited book podcast: ",err);
            })
    }
    else
    {
      await firestore().collection('books').doc(podcast.bookID).collection('chapters').doc(podcast.chapterID)
          .collection('podcasts').doc(podcast.podcastID).set({
              podcastPictures : [podcastImage],
              podcastName: podcastName,
              podcastDescription: podcastDescription,
              tags: tags.tagsArray,
              lastEditedOn: moment().format()
            },{merge:true}).then(() => {
              console.log("Successfully uploaded edited book podcast");
              indexEditedPodcast();
            }).catch((err) => {
              console.log("Error in uploading edited chapter podcast: ",err);
            })
    }
  }

  function uploadPodcast(recordedFilePath)
  {
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
    }
    return false;
  }


  async function uploadAudio(FilePath) {

    console.log(FilePath);
    var refPath = "podcasts/audio/" + userID + "_" + bookID + "_" + moment().format() + ".m4a";
    var storageRef = storage().ref(refPath);
    console.log("Before storageRef.putFile in uploadAudio ");
    try{
      FilePath && storageRef.putFile(FilePath).on(
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
          console.log("File upload error code: " + error.code);
          console.log("File upload error: " + error.toString()); 
        },
        () => {
          storageRef.getDownloadURL()
            .then((downloadUrl) => {
              console.log("File available at: " + downloadUrl);
              setPodcastAudioDownloadURL(downloadUrl);
              //setUploadPodcastSuccess(true);
            })
            .catch(err => {
              console.log("Error in storageRef.getDownloadURL() in uploadAudio in PreviewScreen: ",err);
            })
        }
      )
    }
    catch(error){
      console.log("Podcast Audio upload error: ",error);
    }
  }

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
          //setImageFromURL(false);
          //setPodcastImage(source);
          setLoadingPodcastImage(true);
          var refPath = "podcasts/images/" + userID + "_" + bookID + "_" + moment().format() + ".jpg";
          var storageRef = storage().ref(refPath);
          console.log("Before storageRef.putFile");
  
          ImageResizer.createResizedImage(response.path, 720, 720, 'JPEG',100)
        .then(({path}) => {
  
          const unsubscribe=storageRef.putFile(path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                console.log("snapshot: " + snapshot.state);
                console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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
                    setPodcastImage(downloadUrl);
                    setLoadingPodcastImage(false);
                  })
                  .catch(err => {
                    console.log("Error in storageRef.getDownloadURL() in uploadImage in PreviewScreen: ",err);
                  })
              }
            )
            });
          }
      });
    }
    catch(error){
      console.log("Resizing & Uploading Podcast Image Error: ",error);
    }
  }

  return (
    
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    
     <View>
      <View style={styles.AppHeader}>
        <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
          <View style={{ paddingLeft: width / 12, paddingVertical: height / 20, flexDirection: 'row' }}>
          <Icon name="arrow-left" size={20} style={{color:'black'}}/>
  <Text style={{ fontFamily: 'san-serif-light', color: 'black', paddingLeft: (width * 7) / 35, fontSize: 20 }}>{previewHeaderText}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center' }}>
        <View style={{ paddingVertical: height / 50, flexDirection: 'column' , paddingBottom:width/10}}>
          <TouchableOpacity onPress={uploadImage}>
          <View style={{ borderRadius: 20, borderColor: 'white', borderWidth: 0,justifyContent:'center' }}>
            {
              loadingPodcastImage == true
              ?
              <View style={{width: (width * 3) / 4,
                height: (width * 3) / 4, borderRadius: 20, borderColor: 'white', borderWidth: 1,alignItems:'center',justifyContent:'center' }}>
              <ActivityIndicator size='large' color='rgb(218,165,32)'/>
              </View>
              :
              <Image source={{uri:podcastImage}} style={{width: (width * 3) / 4,
                 height: (width * 3) / 4, borderRadius: 20, borderColor: 'white', borderWidth: 1 }}/>
              
            }
          </View>
          </TouchableOpacity>
        </View>
       
     </View>
    
     
        <TouchableOpacity onPress={async() => {
          await TrackPlayer.play();
        }} style={{marginBottom:20,alignItems:'center'}}>
            <Icon name="play" color="black" size={25} />
            </TouchableOpacity>

      {
        chapterName !== null && chapterName !== undefined &&
        <View style={{ paddingLeft: width / 8, paddingBottom: 10 }}>
         <TextInput
          value={chapterName}
          style={styles.TextInputStyleClass2}
          underlineColorAndroid="transparent"
          placeholder={"Chapter Name" }
          placeholderTextColor={"black"}
          numberOfLines={1}
          multiline={false}
        />
        </View>
      }
  
      <View style={{ paddingLeft: width / 8, paddingBottom: 10 }}>
         <TextInput
          value={bookName}
          style={styles.TextInputStyleClass2}
          underlineColorAndroid="transparent"
          placeholder={"Book Name" }
          placeholderTextColor={"black"}
          numberOfLines={1}
          multiline={false}
        />
      </View>

      
      <View style={{ paddingLeft: width / 8, paddingBottom: 10 }}>
        <TextInput
          style={styles.TextInputStyleClass2}
          underlineColorAndroid="transparent"
          placeholder={"Podcast Title (Min characters: 6)"}
          placeholderTextColor={"gray"}
          value={podcastName}
          onBlur={() => {
            if(podcastName !== null)
            {
              const trimmedPodcastName = podcastName.trim();
              setPodcastName(trimmedPodcastName);
            }
            if(podcastName !== null && (podcastName.length < 6 || podcastName.length > 50))
            {
              const slicedPodcastName = podcastName.slice(0,50);
              setPodcastName(slicedPodcastName);
              alert('The name of the podcast should follow the given limits.\nMin characters required: 6\nMax characters allowed: 50');
            }
            
          }}
          onChangeText={(text) => {
            setPodcastName(text)
          }}
          numberOfLines={1}
          multiline={false}
        />
      </View>

      
      
      <View style={{ paddingLeft: width / 8 }}>
        <TextInput
          style={styles.TextInputStyleClass}
          underlineColorAndroid="transparent"
          placeholder={"How should your listeners approach this podcast?" }
          placeholderTextColor={"gray"}
          value={podcastDescription}
          onBlur={() => {
            if(podcastDescription !== null)
            {
              const trimmedPodcastDescription = podcastDescription.trim();
              setPodcastDescription(trimmedPodcastDescription);
            }
            if(podcastDescription != null && (podcastDescription.length < 6 || podcastDescription.length > 1000))
            {
              const slicedPodcastDescription = podcastDescription.slice(0,1000);
              setPodcastDescription(slicedPodcastDescription);
              alert('The description of the podcast should follow the given limits.\nMin characters required: 6\nMax characters allowed: 1000');
            }
            
          }}
          onChangeText={(text) => setPodcastDescription(text)}
          numberOfLines={6}
          multiline={true}
        />
      </View>
      

      <View style={styles.tagcontainer}>

         <TagInput
         updateState={updateTagState}
          tags={tags}
          placeholder="tags.." 
          label='Press comma to add a tag'
         labelStyle={{color: '#000000'}}
         leftElement={<Icon name={'tag'}  color={'#000000'}/>}
         leftElementContainerStyle={{marginLeft: 3}}
         containerStyle={{width:(width * 3) / 4}}
          inputContainerStyle={[styles.textInput, {backgroundColor: 'white'}]}
          inputStyle={{fontFamily: 'Andika-R',fontSize:15}}
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
      
      {
        !toggleIndicator && 
       <View style={{ paddingTop: height /16, alignItems: 'center', paddingBottom:10 }}>

        <TouchableOpacity onPress={() => {
          if(podcastName === null || (podcastName !== null && (podcastName.length < 6 || podcastName.length > 50)))
          {
            alert("Please enter the name of your podcast as per the given limits.\nMin characters required: 6\nMax characters allowed: 50");
            return;
          }
          else if(!podcastName.replace(/\s/g,'').length)
          {
            setPodcastName(null);
            alert("Please enter some text in Podcast Name field");
            return;
          }
          else if(podcastDescription === null || (podcastDescription != null && (podcastDescription.length < 6 || podcastDescription.length > 1000)))
          {
            alert("Please enter the description of your podcast as per the given limits.\nMin characters required: 6\nMax characters allowed: 1000");
            return;
          }
          else if(!podcastDescription.replace(/\s/g,'').length)
          {
            setPodcastDescription(null);
            alert("Please enter some text in Podcast Description field");
            return;
          }
          const podcast = props.navigation.state.params.podcast;
          if(podcast !== null && podcast !== undefined)
            uploadEditedPodcast(podcast);
          else
            uploadPodcast(recordedFilePath);
      }} 
        style={{ alignItems: 'center', justifyContent: 'center', height: height / 16, width: height / 6, borderRadius: 15,marginBottom:30, borderColor:rgb(218,165,32), borderWidth: 1, }}
        >
          {
            publishLoading == true
            ?
            <ActivityIndicator color='rgb(218,165,32)'/>
            :
            <Text style={{ alignItems: 'center',fontWeight:'800', fontFamily: 'Montserrat-Medium', color:rgb(218,165,32),  justifyContent: 'center',fontSize:20 }} >Publish</Text>
          }
          
        </TouchableOpacity>
      </View>
      }
    </View>
    </SafeAreaView>
    
    </ScrollView>
    
    
    
   
  );
}

export default withFirebaseHOC(PreviewScreen);


const styles = StyleSheet.create({
  AppHeader:
  {
    flexDirection: 'row',
    backgroundColor: 'white'
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
    fontFamily: 'Andika-R',
    //fontStyle: 'italic',
    color: 'black',
    height: height / 6,
    borderWidth: 1,
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
    fontFamily: 'Andika-R',
    //fontStyle: 'italic',
    color: 'black',
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    width: (width * 3) / 4,
    paddingLeft: 10,
    height: height / 18,
    paddingRight: 10
  }, 
  tagcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  textInput: {
    height: 40,
    borderColor: '#9E9E9E',
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    padding: 0,
    fontFamily: 'Andika-R'
  }, 
  tag: {
    backgroundColor: 'grey'
  }, 
  tagText: {
    color: 'black',
    fontFamily: 'Andika-R'
  },
  
});