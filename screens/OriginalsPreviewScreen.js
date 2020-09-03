import React, { Component, useState, useEffect,useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Button, SafeAreaView, Dimensions, Image,  TextInput, Platform , BackHandler, ActivityIndicator, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import storage, { firebase } from '@react-native-firebase/storage'
import { withFirebaseHOC } from '../screens/config/Firebase'
import ImagePicker from 'react-native-image-picker'
import TagInput from 'react-native-tags-input';
import { TagSelect } from 'react-native-tag-select'
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import ImageResizer from 'react-native-image-resizer';
import OpenSettings from 'react-native-open-settings';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import ProgressBar from './components/PodcastPlayer/ProgressBar';
import Slider from '@react-native-community/slider';
import Tooltip from 'react-native-walkthrough-tooltip';

const { width, height } = Dimensions.get('window');
const options = {
  title: 'Select Podcast Cover',
  chooseFromLibraryButtonTitle: 'Select from Library'
};

const initialTags  = {
  tag: '',
  tagsArray: [], 
}

const defaultPodcastImageURL = "https://storage.googleapis.com/papyrus-274618.appspot.com/walkthrough/Waves.jpg";

const OriginalsPreviewScreen = (props) => {

  console.log("In OriginalsPreviewScreen");

  const dispatch = useDispatch();
  const { position, bufferedPosition } = useTrackPlayerProgress();

  var scrollViewRef = useRef();
  const originalPodcastWalkthroughDone = useSelector(state=>state.userReducer.originalPodcastWalkthroughDone);
  const [toolTipPictureVisible,setToolTipPictureVisible] = useState(false);
  const [toolTipNameVisible,setToolTipNameVisible] =useState(false); 
  const [toolTipDescriptionVisible,setToolTipDescriptionVisible] = useState(false);
  const [toolTipGenresVisible,setToolTipGenresVisible] = useState(false);
  const [toolTipTagsVisible,setToolTipTagsVisible] = useState(false);

  const allCategoryNames = useSelector(state=>state.categoryReducer.allCategoryNames);
  const [genres,setGenres] = useState([]);
  const [genresSelected,setGenresSelected] = useState([]);
  const [categorySelectedMap,setCategorySelectedMap] = useState({})
  const categoriesSelected = React.createRef(null);
  const [defaultCategoryKeysSelected,setDefaultCategoryKeysSelected] = useState([]);
  const [showTagSelect,setShowTagSelect] = useState(false);
  const editpodcast = useSelector(state=>state.recorderReducer.editpodcast);
  const displayPictureURL = useSelector(state=>state.userReducer.displayPictureURL)
  const [isPlaying,setIsPlaying] = useState(false);
  const [loadingPodcastImage,setLoadingPodcastImage] = useState(false);
  const userPreferences = useSelector(state=>state.userReducer.userPreferences);
  const [podcastImage, setPodcastImage] = useState(defaultPodcastImageURL);
  const languageSelected=useSelector(state=>state.recorderReducer.languageSelected)
  const [publishLoading,setPublishLoading] = useState(false);
  const [recordedFilePath, setrecordedFilePath] = useState(props.navigation.getParam('recordedFilePath'));
  const [podcastDescription, setPodcastDescription] = useState(null);
  const [previewHeaderText,setPreviewHeaderText] = useState("Create Podcast");
  const [podcastName, setPodcastName]=useState(null);
  const [tags, setTags]=useState(initialTags);
  const [tagsColor, settagsColor]=useState('#3ca897');
  const [tagsText, settagsText]=useState('#fff');
  const [tagsLength,setTagsLength] = useState(0);
  //const [podcastImageDownloadURL,setPodcastImageDownloadURL] = useState("https://storage.googleapis.com/papyrus-274618.appspot.com/walkthrough/Waves.jpg");
  const [podcastAudioDownloadURL,setPodcastAudioDownloadURL] = useState(null);
  const [duration , setDuration]=useState(props.navigation.getParam('duration'))
  const [progress, setProgress]=useState(0)
  const [indeterminate, setIndeterminate]=useState(true)
  const [toggleIndicator, setToggleIndicator]=useState(false)
  const [uploadPodcastSuccess, setUploadPodcastSuccess]=useState(false)
  const [podcastID,setPodcastID] = useState(null);
  const [warningMessage, setWarningMessage]=useState(false)

  const totalMinutesRecorded = useSelector(state=>state.userReducer.totalMinutesRecorded);
  const userName = useSelector(state=>state.userReducer.name);
  const userID = props.firebase._getUid();
  const privateDataID = "private" + userID;

  console.log("ORIGINAL PODCASTS PREVIEW SCREEN")

  useEffect(() => {
    setup();
    if(originalPodcastWalkthroughDone == false){
      setTimeout(() => {
        setToolTipPictureVisible(true)
      },300)
    }
  },[])

  useEffect(() => { 
    if(podcastAudioDownloadURL !== null)
        addPodcastToFirestore();          
  },[podcastAudioDownloadURL])

  function retrieveCategories()
  {
    var categoryLabels = [];
    var categoryMap = {};
    for(var i=0;i<allCategoryNames.length;i++)
    {
      var j = i + 1
      var categoryLabel = {
        id : j,
        label : allCategoryNames[i]
      }
      
      if(allCategoryNames[i] === undefined){
        continue;
      }
      categoryLabels.push(categoryLabel);
      categoryMap[allCategoryNames[i]] = false;
    }
    setCategorySelectedMap(categoryMap);
    setGenres(categoryLabels);
  }

  async function addPodcastToFirestore()
  {
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
      numCreatedOriginalPodcasts : firestore.FieldValue.increment(1)
    },{merge:true}).then(() => {
      console.log("Successfully updated numCreatedOriginalPodcasts in user's private document");
    })
    dispatch({type:"INCREMENT_NUM_CREATED_ORIGINAL_PODCASTS"})

    firestore().collection('podcasts').add({
        audioFileLink: podcastAudioDownloadURL,
        duration: duration,
        isOriginalPodcast: true,
        genres: genresSelected, ////////////////////////
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
        numUsersRetweeted : 0
    })
    .then(async function(docRef, props) {
        console.log("Document written with ID: ", docRef.id);
        firestore().collection('podcasts').doc(docRef.id).set({
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

  async function setup() {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      alwaysPauseOnInterruption: true
    });
    
    if(editpodcast == true)
       {
         const podcast = props.navigation.state.params.podcast;
         setDuration(podcast.duration)
        await TrackPlayer.add({
          id: "local-track",
          url: podcast.audioFileLink,
          title: podcast.podcastName,
          artist: podcast.podcasterName,
          artwork: podcast.podcastPictures[0],
          duration: podcast.duration
        });
       }
       else
       {
        await TrackPlayer.add({
          id: "local-track",
          url: recordedFilePath,
          title: "cfdvdfvc",
          artist: userName,
          artwork: "dsccdcds",
          duration: duration
        });
       }
    
    //await TrackPlayer.play();
  }

  async function setOriginalPodcastWalkthroughInFirestore() {
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
      originalPodcastWalkthroughDone : true
    },{merge:true}).then(() => {
        console.log("originalPodcastWalkthroughDone set in firestore successfully");       
    }).catch((error) => {
        console.log("Error in updating value of originalPodcastWalkthroughDone in firestore");
    })
  }

  async function indexEditedPodcast(){
    
    const podcast = props.navigation.state.params.podcast;
    const instance = firebase.app().functions("asia-northeast1").httpsCallable('AddToPodcastsIndex');
      
    try 
    {          
      await instance({ // change in podcast docs created by  user
        createdOn : moment().format(),
        podcastID : podcast.podcastID,
        podcastPicture : podcastImage,
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
      TrackPlayer.destroy();
      dispatch({type:'SET_EDIT_PODCAST',payload:false});
      dispatch({type:"SET_PODCAST_UPLOAD_SUCCESS",payload:true});
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
      if(genresSelected.length > 0)
      {
        for(var i=0;i<genresSelected.length;i++)
        {
          if(prefsMap[genresSelected[i]] != true)
          {
            tempUserPreferences.push(genresSelected[i]);
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
        //updatePodcastCountInCategoryDoc();
        const updatedMinutesRecorded = totalMinutesRecorded + duration/60; 
        dispatch({type:"UPDATE_TOTAL_MINUTES_RECORDED",payload:updatedMinutesRecorded});
        updateTotalMinutesRecorded(updatedMinutesRecorded);
        setTags(initialTags);
        dispatch({type:'SET_EDIT_PODCAST',payload:false});
        props.navigation.navigate('HomeScreen');
      }
    },[uploadPodcastSuccess]
  )

  function getMinutesFromSeconds(time) {
    
    var hours = null;
    var minutes = null;
    var seconds = null;
    if(time >= 3600)
    {
      hours = Math.floor(time / 3600);
      time = time % 3600;
    }
    
    minutes = time >= 60 ? Math.floor(time / 60) : 0;
    seconds = Math.floor(time - minutes * 60);

    if(hours === null)
    {  
      return `${minutes >= 10 ? minutes : '0' + minutes}:${
        seconds >= 10 ? seconds : '0' + seconds
      }`;
    }
    else
    {
      return `${hours >= 10 ? hours : '0' + hours}:${
                minutes >= 10 ? minutes : '0' + minutes}:${
                seconds >= 10 ? seconds : '0' + seconds
      }`;
    }
  }

  function onSeek(data) {
    TrackPlayer.seekTo(data.seekTime)
  }

  function handleOnSlide(time) {
    onSeek({seekTime: time});
  }

  useEffect(() => {
    if(genres.length!=0)
    {
      var localSelectedCategories = {};
      var selectedTemp = [];
      const podcast = props.navigation.state.params.podcast;
      if(podcast !== undefined && podcast !== null)
      {
        setShowTagSelect(false);
        for(var i=0;i<podcast.genres.length;i++)
        {
          localSelectedCategories[podcast.genres[i]] = true;
          var j = 0;
          console.log("[OriginalsPreviewScreen] genres: ",genres);
          for(j=0;j<genres.length;j++)
          {
            console.log("podcast.genres[i] = ",podcast.genres[i]);
            if(genres[j].label == podcast.genres[i])
              break;
          }
          selectedTemp.push(j+1);
        }
        console.log("selectedTemp = ",selectedTemp);
        setDefaultCategoryKeysSelected(selectedTemp); 
        setCategorySelectedMap(localSelectedCategories);
      }
      setShowTagSelect(true);

    }
    
  },[genres])

  useEffect(() => {
    console.log("In USEEFFECT OF PREVIEW SCREEN");
    console.log("props.podcast = ",props.navigation.state.params.podcast);
    const podcast = props.navigation.state.params.podcast;
    retrieveCategories();
    if(podcast !== undefined && podcast !== null)
    {
      setPodcastDescription(podcast.podcastDescription);
      setPodcastName(podcast.podcastName);
      //setSelectedCategories(podcast.genres);  
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
      console.log("Inside useEffect - componentDidMount of OriginalsPreviewScreen");
      
      BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
      return () => {
        console.log(" back_Button_Press Unmounted");
        BackHandler.removeEventListener("hardwareBackPress",  back_Button_Press);
        dispatch({type:'SET_EDIT_PODCAST',payload:false});
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
    await firestore().collection('podcasts').doc(podcast.podcastID).set({
        podcastPictures : [podcastImage],
        podcastName: podcastName,
        podcastDescription: podcastDescription,
        tags: tags.tagsArray,
        lastEditedOn: moment().format()
    },{merge:true}).then(() => {
        console.log("Successfully uploaded edited original podcast");
        indexEditedPodcast();
    }).catch((err) => {
        console.error("Error in uploading edited original podcast: ",err);
    })
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
    TrackPlayer.destroy();
    return false;
  }


  async function uploadAudio(FilePath) {

    console.log(FilePath);
    var refPath = "podcasts/audio/" + userID + "_" + "_" + moment().format() + ".m4a";
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
              console.log("Error in storageRef.getDownloadURL() in uploadAudio in OriginalsPreviewScreen: ",err);
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
        //console.log('Response URI = ', response.uri);
        //console.log('Response PATH = ', response.path);
  
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
            if(response.error == "Permissions weren't granted")
            {
              Alert.alert(  
                'Papyrus needs access to your camera and/or storage.',  
                '',  
                [  
                    {  
                        text: 'Cancel',  
                        onPress: () => console.log('Cancel Pressed'),  
                        style: 'cancel',  
                    },  
                    {
                        text: 'OK', onPress: () => {
                        OpenSettings.openSettings()
                        console.log('OK Pressed')
                    }},  
                ]  
            ); 
            }
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
          console.log("Before storageRef.putFile");
          //console.log("response : ",response);
          //setImageFromURL(false);
          //setPodcastImage(source);
          setLoadingPodcastImage(true);
          var refPath = "podcasts/images/" + userID + "_" + "_" + moment().format() + ".jpg";
          
          if(response.path.split('.').pop() == "gif")
          {
            if(((response.fileSize/1024)/1024) > 1)
            {
              setLoadingPodcastImage(false);
              Alert.alert("Please upload a GIF file within 1 MB");
              return;
            }
            refPath = "podcasts/gifs/" + userID + "_" + "-" + moment().format() + ".gif";
            var storageRef = storage().ref(refPath);
            const unsubscribe=storageRef.putFile(response.path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
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
                console.log("gif upload error: " + error.toString());
              },
              () => {
                storageRef.getDownloadURL()
                  .then((downloadUrl) => {
                    console.log("File available at: " + downloadUrl);
                    setPodcastImage(downloadUrl);
                    setLoadingPodcastImage(false);
                  })
                  .catch(err => {
                    console.log("Error in storageRef.getDownloadURL() in uploadImage in OriginalsPreviewScreen: ",err);
                  })
              }
            )
          }
          else
          {
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
                      console.log("Error in storageRef.getDownloadURL() in uploadImage in OriginalsPreviewScreen: ",err);
                    })
                }
              )
              });
          }
          
          
          }
      });
    }
    catch(error){
      console.log("Resizing & Uploading Podcast Image Error: ",error);
    }
  }

  function renderPublishText(){
      if(publishLoading == true)
        return <ActivityIndicator color='black'/>;
      else
        return <Text style={{ borderRadius:10,textAlignVertical: 'center',padding:8,backgroundColor:'black',color:'white',fontSize:15,fontFamily:'Montserrat-SemiBold' }} >Publish</Text>
  }

  return (
    
    <ScrollView     
    ref={scrollViewRef}
    style={{flex: 1, backgroundColor: 'white' }} keyboardShouldPersistTaps='always'>
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    
     <View style={{paddingBottom:20}}>
          
      <View style={{width:width,borderWidth:0,borderColor:'black', paddingHorizontal: width / 20, paddingVertical: height / 20,display:'flex',justifyContent:'space-between', flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => {
        TrackPlayer.destroy();
        props.navigation.goBack(null)
      }}>
      <Icon name="arrow-left" size={20} style={{color:'black'}}/>
      </TouchableOpacity>
      <View style={{alignSelf:'center',position:'absolute',top:height/24,left:width/3.5,alignItems:'center',justifyContent:'center'}}>
      <Text style={{ fontFamily: 'Montserrat-SemiBold', color: 'black',paddingBottom:5, fontSize: 20 }}>
        {previewHeaderText}</Text>
        </View>
        {
          toggleIndicator && 
     
          <View style={{alignItems: 'center',justifyContent:'center',width:width/5}}> 
           <Progress.Bar
               color={'black'}
               style={{width:width/5}}
               progress={progress}
               indeterminate={indeterminate}
             />
           </View>
        }
        {
          !toggleIndicator &&
          <TouchableOpacity onPress={() => {
            if(podcastName === null || (podcastName !== null && (podcastName.length < 6 || podcastName.length > 150)))
            {
              alert("Please enter the name of your podcast as per the given limits.\nMin characters required: 6\nMax characters allowed: 150");
              return;
            }
            else if(!podcastName.replace(/\s/g,'').length)
            {
              setPodcastName(null);
              alert("Please enter some text in Podcast Name field");
              return;
            }
            else if(podcastDescription === null || (podcastDescription != null && (podcastDescription.length < 6 || podcastDescription.length > 3000)))
            {
              alert("Please enter the description of your podcast as per the given limits.\nMin characters required: 6\nMax characters allowed: 3000");
              return;
            }
            else if(!podcastDescription.replace(/\s/g,'').length)
            {
              setPodcastDescription(null);
              alert("Please enter some text in Podcast Description field");
              return;
            }
            else if(podcastImage == defaultPodcastImageURL)
            {
              alert("Please upload an image related to your podcast");
              return;
            }

            var i;
            var categorySelectedArray = [];
            for(i=0;i<genres.length;i++)
            {
              if(categorySelectedMap[genres[i].label] == true)
                categorySelectedArray.push(genres[i].label);
            }
            if(categorySelectedArray.length < 1)
            {
              alert('Please select atleast 1 category');
              return;
            }

            setGenresSelected(categorySelectedArray);
            const podcast = props.navigation.state.params.podcast;
            if(podcast !== null && podcast !== undefined)
              uploadEditedPodcast(podcast);
            else
              uploadPodcast(recordedFilePath);
          }} 
        >      
        {renderPublishText()}  
        </TouchableOpacity>
        }
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
              <Tooltip
              isVisible={toolTipPictureVisible}
              placement='bottom'
              content={
              <View style={{width:width/3}}>
              {/* <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/> */}
              <Text style={{fontFamily:"Montserrat-Bold"}}>Add a picture that relates to your original podcast.</Text>
              </View>}
              onClose={() => {
                setToolTipPictureVisible(false);
                setToolTipNameVisible(true);
              }}
            >
              <Image source={{uri:podcastImage}} style={{width: (width * 3) / 4,
                 height: (width * 3) / 4, borderRadius: 20, borderColor: 'white', borderWidth: 1 }}/>
              </Tooltip>
            }
          </View>
          </TouchableOpacity>
        </View>
       
     </View>
    
        <View style={{width:width*3/4,height:height/12,marginLeft: width / 8,borderRadius:10,marginBottom: 20,borderWidth:1,borderColor:'#9E9E9E',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity onPress={async() => {
          if(!isPlaying)
          {
            setIsPlaying(true);
            await TrackPlayer.play();
          }
          else
          {
            setIsPlaying(false);
            await TrackPlayer.pause();
          }
          
        }} style={{borderWidth:0,borderColor:'black',alignItems:'center'}}>
            {
              isPlaying 
              ?
              <Icon name="pause" color="black" size={25} />
              :
              <Icon name="play" color="black" size={25} />
            }
            </TouchableOpacity>
            <View style={{width:width*9/16,borderWidth:0,borderColor:'black',}}>
            <Slider
              value={position}
              minimumValue={1}
              maximumValue={duration===undefined?600:duration}
              step={0.01}
              onValueChange={(value)=>handleOnSlide(value)}
              //onSlidingStart={handlePlayPause}
              //onSlidingComplete={handlePlayPause}
              minimumTrackTintColor={'black'}
              maximumTrackTintColor={'black'}
              thumbTintColor={'black'}
              //disabled={true}
            />
            {/* <ProgressBar
                position = {position}
                duration={duration}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
                loadingPodcast={false}
              /> */}
              </View>
              <View>
            <Text>{getMinutesFromSeconds(duration)}</Text>
                </View>
          </View>
      
          <View style={{ paddingBottom: 10 }}>
      <Tooltip
              isVisible={toolTipNameVisible}
              placement='bottom'
              content={
              <View style={{width:width/3}}>
              {/* <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/> */}
              <Text style={{fontFamily:"Montserrat-SemiBold"}}>Add a title to your original podcast.</Text>
              </View>}
              onClose={() => {
                setToolTipNameVisible(false);
                setToolTipDescriptionVisible(true);
              }}
            >
            <View style={{alignItems:'center'}}>
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
            if(podcastName !== null && (podcastName.length < 6 || podcastName.length > 150))
            {
              const slicedPodcastName = podcastName.slice(0,150);
              setPodcastName(slicedPodcastName);
              alert('The name of the podcast should follow the given limits.\nMin characters required: 6\nMax characters allowed: 150');
            }
            
          }}
          onChangeText={(text) => {
            setPodcastName(text.slice(0,150))
          }}
          numberOfLines={1}
          multiline={false}
        />
        </View>
        </Tooltip>
      </View>

      
      
      <View>
      <Tooltip
              isVisible={toolTipDescriptionVisible}
              placement='top'
              content={
              <View style={{width:width/3}}>
              {/* <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/> */}
              <Text style={{fontFamily:"Montserrat-SemiBold"}}>Add a description to your original podcast</Text>
              </View>}
              onClose={() => {
                setToolTipDescriptionVisible(false);
                setToolTipGenresVisible(true);
              }}
            >
              <View style={{alignItems:'center'}}>
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
            if(podcastDescription != null && (podcastDescription.length < 6 || podcastDescription.length > 3000))
            {
              const slicedPodcastDescription = podcastDescription.slice(0,3000);
              setPodcastDescription(slicedPodcastDescription);
              alert('The description of the podcast should follow the given limits.\nMin characters required: 6\nMax characters allowed: 3000');
            }
            
          }}
          onChangeText={(text) => setPodcastDescription(text.slice(0,3000))}
          numberOfLines={6}
          multiline={true}
        />
        </View>
        </Tooltip>
      </View>
      <Tooltip
              isVisible={toolTipGenresVisible}
              placement='top'
              content={
              <View style={{width:width/3}}>
              {/* <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/> */}
              <Text style={{fontFamily:"Montserrat-SemiBold"}}>Add categories to your original podcast</Text>
              </View>}
              onClose={() => {
                setToolTipGenresVisible(false);
                scrollViewRef.current.scrollToEnd({animated:true});
                setTimeout(() => {
                  setToolTipTagsVisible(true);
              }, 300);
              }}
            >
      <View style={{marginTop:10}}>
      <View style={{alignItems:'center',marginHorizontal:width/8,borderWidth:0.5,borderRadius:10,borderColor:'black',paddingHorizontal:5}}>
        <Text style={{fontFamily:'Montserrat-SemiBold',color:'gray', paddingVertical:10}}>Choose categories for your podcast</Text>
      {
        showTagSelect == true &&
        <TagSelect 
            value={defaultCategoryKeysSelected}
            itemStyle={styles.item}
            itemLabelStyle={styles.label}
            itemStyleSelected={styles.itemSelected}
            itemLabelStyleSelected={styles.labelSelected}
            data={genres}
            max={5}
            ref={categoriesSelected}
            onMaxError={() => {
              alert('You can select a maximum of 5 categories for your podcast');
            }}
            onItemPress={(category)=>{
                console.log(category.label)
                var categoryMap = categorySelectedMap;
                categoryMap[category.label] = !categorySelectedMap[category.label]
                console.log(categoryMap);
                setCategorySelectedMap(categoryMap);
                console.log(categorySelectedMap)
           }}
          />
      }
      
        </View>
        </View>
        </Tooltip>
        <View>
      
              <View style={{alignItems:'center'}}>
              <Tooltip
              isVisible={toolTipTagsVisible}
              placement='top'
              content={
              <View style={{width:width/3}}>
              {/* <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/> */}
              <Text style={{fontFamily:"Montserrat-SemiBold"}}>Add tags that relate to your original podcast</Text>
              </View>}
              onClose={() => {
                setToolTipTagsVisible(false);
                dispatch({type:"SET_ORIGINAL_PODCAST_WALKTHROUGH",payload:true})
                setOriginalPodcastWalkthroughInFirestore();              
              }}
            >
         <TagInput
         updateState={updateTagState}
          tags={tags}
          placeholder="tags.." 
          label='Press comma to add a tag'
         labelStyle={{color: '#000000'}}
         leftElement={<Icon name={'tag'}  color={'#000000'}/>}
         leftElementContainerStyle={{marginLeft: 5}}
         containerStyle={{width:(width * 3.2) / 4}}
          inputContainerStyle={[styles.textInput, {backgroundColor: 'white'}]}
          inputStyle={{fontFamily: 'Montserrat-SemiBold',fontWeight:'normal',fontSize:15}}
         tagStyle={styles.tag}
          tagTextStyle={styles.tagText}
          keysForTag={','}
          autoCorrect={false}
          />
          </Tooltip>

          </View>
      </View>
    </View>
    </SafeAreaView>    
    </ScrollView>   
   
  );
}

export default withFirebaseHOC(OriginalsPreviewScreen);


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
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 'normal',
    //fontStyle: 'italic',
    color: 'black',
    height: height / 6,
    paddingBottom:10,
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
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 'normal',
    //fontStyle: 'italic',
    color: 'black',
    borderWidth: 1,
    paddingTop:0,
    marginTop:0,
    paddingBottom:0,
    marginBottom:0,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    width: (width * 3) / 4,
    paddingLeft: 10,
    //height: height / 18,
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
  }, 
  item: {
    borderWidth: 0.3,
    borderColor: '#333',    
    backgroundColor: 'transparent',

  },
  label: {
    color: 'black',
    fontSize:12,
    fontFamily: 'Montserrat-SemiBold'
  },
  itemSelected: {
    backgroundColor: '#333',
  },
  labelSelected: {
    color: '#FFF',
  },
  tag: {
    backgroundColor: 'grey'
  }, 
  tagText: {
    color: 'black',
    fontFamily: 'Montserrat-SemiBold'
  },
  
});