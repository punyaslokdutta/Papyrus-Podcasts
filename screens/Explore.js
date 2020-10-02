import React, {Component, useState,useEffect, useRef, createRef,useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet,BackHandler, Text, View, SafeAreaView,FlatList, ActivityIndicator, TextInput, Platform, StatusBar,TouchableOpacity,TouchableNativeFeedback, Dimensions, ScrollView, Image, NativeModules, NativeEventEmitter, Linking, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import TrendingPodcast from './components/Explore/TrendingPodcast'
import TopChapters from './components/Explore/TopChapters';
import Story from './components/Explore/Story'
import ExploreBook from './components/Explore/ExploreBook'
import { Badge } from 'react-native-elements'
import {useSelector, useDispatch} from "react-redux"
import Shimmer from 'react-native-shimmer';
import {withFirebaseHOC} from './config/Firebase';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import MusicCategoryItem from './components/Explore/MusicCategoryItem'
import modalJSON2 from '../assets/animations/HeadPhone.json';
import TrendingPodcastsCarousel from './components/Explore/TrendingPodcastsCarousel'
import ExploreAnimation from './components/Explore/ExploreAnimation';
import StoryTellerCarousel from './components/Explore/StoryTellerCarousel';
import BookList from './components/Home/BookList';
import Podcast from './components/Home/Podcast';
import FlipItem from './components/Home/FlipItem';
import { NetworkContext } from './config/NetworkProvider';
import ContinueListeningPodcasts from './components/Explore/ContinueListeningPodcasts';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import moment from 'moment';
import ExtraDimensions from 'react-native-extra-dimensions-android';
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();
const extraDimensionsHeight =ExtraDimensions.getRealWindowHeight();

const {width,height} = Dimensions.get('window')

const areEqual = (prevProps, nextProps) => {
  return true;
}
const Explore = React.memo((props) => {

  const  userid = props.firebase._getUid();
  const privateUserID = "private" + userid;
  var didFocusListener = useRef();

  // music related redux & state variables
  const currentTime = useSelector(state=>state.rootReducer.currentTime);
  const musicPreferencesArray = useSelector(state=>state.userReducer.musicPreferencesArray);
  const musicEnabledNotificationSeen = useSelector(state=>state.userReducer.musicEnabledNotificationSeen);
  const [isModalVisible,setIsModalVisible] = useState(!musicEnabledNotificationSeen);
  const [isMusicCategoryModalVisible,setIsMusicCategoryModalVisible] = useState(false);
  const [musicCategoriesState,setMusicCategoriesState] = useState([]);
  const isMusicEnabled = useSelector(state=>state.userReducer.isMusicEnabled);
  const musicPreferences = useSelector(state=>state.userReducer.musicPreferences);
  const { position } = useTrackPlayerProgress(750);

  // URL listeners function reference
  const handleOpenUrlFuncRef = useSelector(state=>state.userReducer.handleOpenUrlFuncRef);
  
  // Context for checking Internet Connection
  const isConnectedContext = useContext(NetworkContext);

  // Podcast & Flip related states
  const lastPlayingPodcastID = useSelector(state=>state.userReducer.lastPlayingPodcastID);
  const podcast = useSelector(state=>state.rootReducer.podcast);
  const [podcastState,setPodcastState] = useState(podcast);
  const externalPodcastID = useSelector(state=>state.userReducer.externalPodcastID);
  const externalFlipID = useSelector(state=>state.userReducer.externalFlipID);
  const lastPlayingPodcast = useSelector(state=>state.rootReducer.lastPlayingPodcast);
  //const podcastsLocal = useSelector(state=>state.userReducer.continueListeningPodcasts);

  var [localLastPlayingPodcast,setLocalLastPlayingPodcast] = useState(null);
  var [storytellers,setStorytellers] = useState([]);
  var [exploreFlips,setExploreFlips] = useState([]);
  var [section1Podcasts,setSection1Podcasts] = useState([]);
  var [section2Podcasts,setSection2Podcasts] = useState([]);
  var [recordBooks,setRecordBooks] = useState([]);
  var [music,setMusic] = useState([]);
  var [chapters,setChapters] = useState([]);
  var [loading,setLoading] = useState(false);
  const [podcastsLocal,setContinueListeningPodcastsLocal] = useState([]);
  var [sections,setSections] = useState([]);
  var [lastPodcastID,setLastPodcastID] = useState(null);

  const dispatch=useDispatch();
  //const eventEmitter=useRef(new NativeEventEmitter(NativeModules.ReactNativeRecorder));
 
  var navigationState = props.navigation.state;

  console.log("NAVIGATION STATE IN EXPLORE SCREEN: ",navigationState);

  var startHeaderHeight  = 60;

  const numNotifications = useSelector(state=>state.userReducer.numNotifications);

  if(Platform.OS == 'Android')
  {
    startHeaderHeight = StatusBar.currentHeight;
  }


  async function addMusicPreferencesToFirestore()
  {   
    console.log("musicPreferences: ",musicPreferences);
    console.log("musicCategoriesState: ",musicCategoriesState);
    var localMusicPreferences = [];
    for(var i=0;i<musicCategoriesState.length;i++)
    {
       //pair = { musicCategoriesState[i].id, musicCategoriesState[i].musicCategoryName};
        //musicCategoriesState[i].id,musicCategoriesState[i].musicCategoryName];
      if(musicPreferences[musicCategoriesState[i].musicCategoryName] == true)
        localMusicPreferences.push(musicCategoriesState[i].musicCategoryName);
    }
    if(localMusicPreferences.length == 0){
      alert('Please select atleast 1 category for your background theme');
      return;
    }
    dispatch({type:"SET_MUSIC_PREFERENCES_ARRAY",payload:localMusicPreferences});
    firestore().collection('users').doc(userid).collection('privateUserData').doc(privateUserID).set({
      musicPreferences : localMusicPreferences
    },{merge:true}).then(() => {
      console.log("[Explore]sAdded MusicPreferences to user's private document");
      setIsMusicCategoryModalVisible(false);
      props.navigation.toggleDrawer()
      setTimeout(() => {dispatch({type:"SHOW_MUSIC_PLAYER_TOOLTIP",payload:true})}, 500)
    }).catch((error) => {
      console.log(error);
    })
  }

  async function retrieveAllMusicCategories()
  {
    try{
      const musicCategories = await firestore().collection('musicCategories').get();
      const musicCategoriesData = musicCategories.docs.map(document=>document.data());

      setMusicCategoriesState(musicCategoriesData);
      

    }
    catch(error){
      console.log("Error in retrieving musicCategories from firestore",error);
    }
  }


  async function fetchExploreItems()
  {
    console.log('[Explore] useEffect in Explore Screen[componentDidMount]');
    setLoading(true);

    try{
      const continueListeningQuery = await firestore().collection('users').doc(userid).collection('privateUserData')
      .doc(privateUserID).collection('PodcastsListened').orderBy('createdOn','desc').get();
      
      const continueListeningData = continueListeningQuery._docs.map(document => document.data());
      console.log("[Explore] continueListeningData: ",continueListeningData);
      if(podcastsLocal.length == 0)
        setContinueListeningPodcastsLocal(continueListeningData);
      
      dispatch({type:"SET_CONTINUE_LISTENING_PODCASTS",payload:continueListeningData})
    }
    catch(error){
      console.log("Error in fetching exploreSection names ",error);
    }

    
    //Top Storytellers
    try{
      let userQuery = await firestore().collectionGroup('privateUserData').where('isTopStoryTeller','==',true).get();
      let documentUsers = userQuery._docs.map(document => document.data());
      setStorytellers(documentUsers);
    }
    catch(error){
      console.log(error)
    }

    // Section 1 podcasts
    try{
      let section1Query = await firestore().collectionGroup('podcasts').where('isExploreSection1','==',true)
                          .orderBy('lastAddedToExplore1','desc').limit(10).get();
      let section1Podcasts = section1Query.docs.map(document => document.data());
      setSection1Podcasts(section1Podcasts);
    }
    catch(error){
      console.log(error)
    }

    // Section 2 podcasts
    try{
      let section2Query = await firestore().collectionGroup('podcasts').where('isExploreSection2','==',true)
                          .orderBy('lastAddedToExplore2','desc').limit(10).get();
      let section2Podcasts = section2Query.docs.map(document => document.data());
      setSection2Podcasts(section2Podcasts);
    }
    catch(error){
      console.log(error)
    }

    // Explore Flips
    try{
      let exploreFlipsQuery = await firestore().collection('flips')
                            .where('isExploreFlip','==',true).orderBy('lastEditedOn','desc')
                            .limit(12).get();
      let exploreFlipsData = exploreFlipsQuery.docs.map(document => document.data());
      //console.log("exploreFlipsData:- ",exploreFlipsData);
      setExploreFlips(exploreFlipsData);
    }
    catch(error){
      console.log(error)
    }
    // // Short Stories
    // try{
    //   let bookQuery = await firestore().collectionGroup('podcasts').where('isShortStory','==',true).get();
    //   let documentBooks = bookQuery.docs.map(document => document.data());
    //   setBooks(documentBooks);
    // }
    // catch(error){
    //   console.log(error)
    // }

    // Record Book Podcasts
    try{
      let recordBookQuery = await firestore().collection('books').where('isExploreRecordBook','==',true).get();
      let documentRecordBooks = recordBookQuery.docs.map(document => document.data());
      setRecordBooks(documentRecordBooks);
    }
    catch(error){
      console.log(error)
    }

    // // Classic Novels
    // try{
    //   let chapterQuery = await firestore().collectionGroup('podcasts').where('isClassicNovel','==',true).get();
    //   let documentChapters = chapterQuery.docs.map(document => document.data());
    //   setChapters(documentChapters);
    // }
    // catch(error){
    //   console.log(error)
    // }

    // try{
    //   let musicQuery = await firestore().collection('music').orderBy('lastEditedOn').get();
    //   let documentMusic = musicQuery.docs.map(document => document.data());
    //   setMusic(documentMusic);
    // }
    // catch(error){
    //   console.log(error)
    // }
    
    setLoading(false);
  }

    async function setLastPlayingPodcastInUserPrivateDoc(podcastID)
    {
      await firestore().collection('users').doc(userid).collection('privateUserData').
            doc(privateUserID).set({
              lastPlayingPodcastID : podcastID,
              lastPlayingCurrentTime : null
            },{merge:true})
    }



    function exitPodcastPlayerAndsetLastPlaying(){

      console.log("Inside exitPodcastPlayerAndsetLastPlaying : ",podcastState);
      if(podcastState!==null)
      {
        //setLastPlayingPodcastInUserPrivateDoc(podcastState.podcastID);
      }
      
    }

    function insertAt(array, index, ...elementsArray) {
      array.splice(index, 0, ...elementsArray);
    }

      async function validateAndAddLatestPlayingToFirestore (lastPodcast)  {

      // [1] if podcast already present in the PodcastsListened docs
      // [2] if not then check if there are only 10 docs or not.
      // [3] if there are 10 docs, then replace the last element since array(redux) 
      //     is sorted in descending order of createdOn
      // [4] if there are less than 10 docs, then simply add a new document
      
      console.log("[App] validateAndAddLatestPlayingToFirestore")
      console.log("[EXPLORE] positions: ",position);
      console.log("[validateAndAddLatestPlayingToFirestore] userid = ",userid);
      
      // [1] if podcast already present in the PodcastsListened docs
  
      var idx = -1;
      for(var i = 0; i < podcastsLocal.length; i++) {
        if (podcastsLocal[i].podcastID == lastPodcast.podcastID) {
            idx = i;
            break;
        }
      }
  
      console.log("[Explore11] podcastsLocal: ",podcastsLocal);
      const currTime = moment().format();
      try {
        if(idx != -1){
          firestore().collection('users').doc(userid).collection('privateUserData')
          .doc(privateUserID).collection('PodcastsListened').doc(podcastsLocal[idx].podcastsListenedID).set({
            lastPlayedPosition : position,
            createdOn : currTime,
            podcastPicture : lastPodcast.podcastPictures[0],
            podcastName : lastPodcast.podcastName
          },{merge:true}).then(() => {
            console.log("[validateAndAddLatestPlayingToFirestore] Successfully updated already existing podcast in the PodcastsListened collection");
            
          }).catch(error => console.log("[validateAndAddLatestPlayingToFirestore] Error in updating already existing podcast in the PodcastsListened collection",error))            
         
            var localArray = podcastsLocal;
            console.log("[Explore - Before updating localArray] localArray = ",localArray);
            
            const JSON = {
              podcastID : lastPodcast.podcastID,
              lastPlayedPosition : position,
              createdOn : currTime,
              podcastPicture : lastPodcast.podcastPictures[0],
              podcastName : lastPodcast.podcastName,
              duration : lastPodcast.duration,
              podcastsListenedID : podcastsLocal[idx].podcastsListenedID
            } 
            localArray.splice(idx,1); //deleion of specific index
            console.log("[!!!!!] localArray",localArray);
            insertAt(localArray,0,JSON);
            //setContinueListeningPodcastsLocal(localArray);
            console.log("[Explore - After updating podcastsListened document] podcastsLocal = ",podcastsLocal);
            dispatch({type:"SET_CONTINUE_LISTENING_PODCASTS",payload:localArray})
        }
        else if(podcastsLocal.length >= 10){
          firestore().collection('users').doc(userid).collection('privateUserData')
          .doc(privateUserID).collection('PodcastsListened').doc(podcastsLocal[podcastsLocal.length - 1].podcastsListenedID).set({
            podcastID : lastPodcast.podcastID,
            lastPlayedPosition : position,
            createdOn : currTime,
            podcastPicture : lastPodcast.podcastPictures[0],
            podcastName : lastPodcast.podcastName,
            duration : lastPodcast.duration
          },{merge:true}).then(() => {
            console.log("[validateAndAddLatestPlayingToFirestore] Successfully replaced the oldest podcast in terms of user's listening in the PodcastsListened collection");
            
          }).catch(error => console.log("[validateAndAddLatestPlayingToFirestore] Error in replacing oldest podcast in terms of user's listening in PodcastsListened",error))  
          
          var localArray = podcastsLocal;
          const JSON = {
            podcastID : lastPodcast.podcastID,
            lastPlayedPosition : position,
            createdOn : currTime,
            podcastPicture : lastPodcast.podcastPictures[0],
            podcastName : lastPodcast.podcastName,
            duration : lastPodcast.duration,
            podcastsListenedID : podcastsLocal[podcastsLocal.length - 1].podcastsListenedID
          };
          localArray.pop();
          insertAt(localArray,0,JSON);
          console.log("[Explore - After replacing podcastsListened document] localArray = ",localArray);
     
            dispatch({type:"SET_CONTINUE_LISTENING_PODCASTS",payload:localArray})
        }
        else if(podcastsLocal.length < 10){
          firestore().collection('users').doc(userid).collection('privateUserData')
          .doc(privateUserID).collection('PodcastsListened').add({
            // podcastID : lastPodcast.podcastID,
            // lastPlayedPosition : position,
            // createdOn : currTime,
            // podcastPicture : lastPodcast.podcastPictures[0],
            // podcastName : lastPodcast.podcastName,
            // duration : lastPodcast.duration
            podcastID : lastPodcast.podcastID,
            lastPlayedPosition : position,
            createdOn : currTime,
            podcastPicture : lastPodcast.podcastPictures[0],
            podcastName : lastPodcast.podcastName,
            duration : lastPodcast.duration
          }).then((docRef) => {
            console.log("[validateAndAddLatestPlayingToFirestore] Successfully added to PodcastsListened");
          firestore().collection('users').doc(userid).collection('privateUserData')
          .doc(privateUserID).collection('PodcastsListened').doc(docRef.id).set({
            podcastsListenedID : docRef.id
          },{merge:true})
          setLastPodcastID(docRef.id);
          }).catch((error) => {
            console.log("[validateAndAddLatestPlayingToFirestore] Error in adding to PodcastsListened",error)
          })
        } 
      }
      catch(error){
        console.log("[validateAndAddLatestPlayingToFirestore]ERROR: ",error)
      }
    }

    useEffect(() => {
      musicPreferencesArray.length != 0 && 
      fetchMusicDocs();
    },[musicPreferencesArray])

    useEffect(() => {
      if(lastPodcastID !== null && localLastPlayingPodcast !== null){
        let localArray1 = podcastsLocal;
        const JSON1 = {
          podcastID : localLastPlayingPodcast.podcastID,
          lastPlayedPosition : position,
          createdOn : moment().format(),
          podcastPicture : localLastPlayingPodcast.podcastPictures[0],
          podcastName : localLastPlayingPodcast.podcastName,
          //podcastName : "WHATEVER",
          duration : localLastPlayingPodcast.duration,
          podcastsListenedID : lastPodcastID
        };
        insertAt(localArray1,0,JSON1);
        setContinueListeningPodcastsLocal(localArray1);
        console.log("[useEffect - lastPlayingPodcast] podcastsLocal = ",podcastsLocal);
        console.log("[Explore - After adding to podcastsListened collection] localArray = ",localArray1);

        dispatch({type:"SET_CONTINUE_LISTENING_PODCASTS",payload:localArray1})
        setLocalLastPlayingPodcast(null);
        setLastPodcastID(null);
      }
    },[lastPodcastID])

    useEffect(() => {
      console.log("[Explore - useEffect - lastPlayingPodcast]",lastPlayingPodcast);
      if(lastPlayingPodcast !== null){
        setLocalLastPlayingPodcast(lastPlayingPodcast);
        validateAndAddLatestPlayingToFirestore(lastPlayingPodcast);
        dispatch({type:"SET_LAST_PLAYING_PODCAST_ITEM",payload:null});
      }
        
    },[lastPlayingPodcast])

    useEffect(() => {
      if(isMusicEnabled == true && musicPreferencesArray.length == 0){
        setIsMusicCategoryModalVisible(true);
      }
    },[isMusicEnabled])

    useEffect(() => {
      if(isMusicCategoryModalVisible == true){
        retrieveAllMusicCategories();
      }
    },[isMusicCategoryModalVisible])


      useEffect(() => {
        console.log("musicEnabledNotificationSeen: ",musicEnabledNotificationSeen);
        setIsModalVisible(!musicEnabledNotificationSeen);
        //musicEnabledNotificationSeen != true && setIsModalVisible(true);
      },[musicEnabledNotificationSeen])


      useEffect(
        () => {
          console.log("[ExploreScreen] useEffect LOG");
          if(!didFocusListener.current) {
            didFocusListener.current = props.navigation.addListener('didFocus', (route) => {
              console.log("HOME TAB PRESSED");
              //dispatch({type:"ENTER_VIDEO_SCREEN",payload:false})
              dispatch({type:"CHANGE_SCREEN"});
           });
          }
          
          fetchExploreItems();

          //dispatch({type:"SET_MUSIC",payload:"Swayam"})
          return async () => {
            //exitPodcastPlayerAndsetLastPlaying();
            //dispatch({type:"SET_PODCAST", payload: null});
            didFocusListener.current.remove();
            //Linking.removeEventListener("url",handleOpenUrlFuncRef);
            console.log(" App exited from Explore",podcast);
          };
        },[])

        async function fetchMusicDocs()
        {
          console.log("Inside fetchMusicDocs",musicPreferencesArray);
          try{
            let musicQuery = await firestore().collection('music').where("genres","array-contains-any",musicPreferencesArray).get();
            let documentMusicData = musicQuery.docs.map(document => document.data());
            const musicCount = documentMusicData.length;
            dispatch({ type:"SET_ALL_MUSIC",payload:documentMusicData});
            dispatch({type:"SET_MUSIC",payload:documentMusicData[0]})
            dispatch({type:"SET_CURRENT_MUSIC_INDEX",payload:1%musicCount});
          }
          catch(error){
            console.log("Error in fetching music documents of user's musicPreferences genres: ",error);
          }
        }

      async function fetchPodcastItem(podcastID)
      {

        let podcastItem = await firestore().collectionGroup('podcasts').where('podcastID','==',podcastID).get();
        let podcastData = podcastItem.docs[0]._data;

        dispatch({type:"ADD_NAVIGATION", payload:props.navigation});
        dispatch({type:"SET_FLIP_ID",payload:null});
        dispatch({type:"SET_CURRENT_TIME", payload:0});
        dispatch({type:"SET_DURATION", payload:podcastData.duration});
        dispatch({type:"SET_PAUSED", payload:false})
        dispatch({type:"SET_LOADING_PODCAST", payload:true});
        podcast === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
        dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
        dispatch({type:"SET_PODCAST", payload: podcastData}) 
        dispatch({type:"SET_NUM_LIKES", payload: podcastData.numUsersLiked})
        dispatch({type:"SET_NUM_RETWEETS", payload: podcastData.numUsersRetweeted})

        dispatch({type:"PODCAST_ID_FROM_EXTERNAL_LINK",payload:null});

      }

      useEffect( () => {
        console.log("In useEffect of externalPodcastID with podcastID: ",externalPodcastID);
        if((externalPodcastID !== null) &&
          (podcast === null || (podcast !== null && externalPodcastID != podcast.podcastID)))
          fetchPodcastItem(externalPodcastID);
        else
        {
          dispatch({type:"PODCAST_ID_FROM_EXTERNAL_LINK",payload:null});
          //setLastPlayingPodcastInUserPrivateDoc(null);
        }

      },[externalPodcastID])

      async function retrieveFlipFromFirestore() {

        const flipItem = await firestore().collection('flips').doc(externalFlipID).get();
        const flipItemData = flipItem.data();
        
        props.navigation.navigate('MainFlipItem',{
          item : flipItemData,
          numLikes : flipItemData.numUsersLiked,
          playerText : "play",
          pausedState : true,
          player : false
      })
      dispatch({type:"FLIP_ID_FROM_EXTERNAL_LINK",payload:null});

      }

      useEffect(() => {
        if(externalFlipID !== null){
          retrieveFlipFromFirestore();          
        }
      },[externalFlipID])

      useEffect(() => {
        if(lastPlayingPodcastID !== null &&  externalPodcastID=== null)
        {
          //fetchPodcastItem(lastPlayingPodcastID);
          //setLastPlayingPodcastInUserPrivateDoc(null);
        }

      },[lastPlayingPodcastID])

      // useEffect(
      //   () => {
      //     BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
      //     return () => {
      //       console.log(" [Explore]back_Button_Press Unmounted");
      //       BackHandler.removeEventListener("hardwareBackPress",  back_Button_Press);
      //     };
      //   }, [back_Button_Press])

      //   function back_Button_Press()
      //   {
      //     console.log("OUT FROM back_Button_Press: ",podcast);
      //     return false;
      //   }

      async function setMusicEnableNotificationSeen(musicEnabled) {
        dispatch({type:"SET_IS_MUSIC_ENABLED",payload:musicEnabled});
        dispatch({type:"SET_MUSIC_ENABLE_NOTIFICATION",payload:true});
        firestore().collection('users').doc(userid).collection('privateUserData').doc(privateUserID).set({
            musicPlayerEnabled : musicEnabled,
            musicEnabledNotificationSeen : true
        },{merge:true}).then(() => {
          console.log("Successfully updated musicEnabledNotificationSeen & musicPlayerEnabled in firestore");
        }).catch((err) => {
          console.log("Error in updating musicEnabledNotificationSeen & musicPlayerEnabled in firestore",error);
        })

        musicEnabled == true && setIsMusicCategoryModalVisible(true);
      }


      function getWindowDimension(event) { 
        const device_width = event.nativeEvent.layout.width;
        const device_height = event.nativeEvent.layout.height;
    
        console.log ("height: ",height);
        console.log("extraDimensionsHeight: ",extraDimensionsHeight);
        console.log ("nativeEventHeight: ",device_height);  // Yeah !! good value
        console.log ("STATUS BAR HEIGHT = ",STATUS_BAR_HEIGHT);
        if(extraDimensionsHeight - device_height >= STATUS_BAR_HEIGHT) 
          dispatch({type:"SET_NAV_BAR_HEIGHT",payload:extraDimensionsHeight - device_height});
        else
          dispatch({type:"SET_NAV_BAR_HEIGHT",payload:0});
        console.log ("nativeEventWidth: ",device_width); 
      }
    
      function renderMusicCategoryItems({item,index})
      {
        return(  
            <View>      
            <MusicCategoryItem item={item} index={index}/>
            </View>
          )
      }

      function renderFooter(){
        return (
          <View style={{alignItems:'center',marginTop:0,marginBottom:20}}>
          <TouchableOpacity onPress={() => {
            addMusicPreferencesToFirestore();
          }} style={{width:width/5,height:width/8,borderColor:'black',borderWidth:1,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:width/16,fontFamily:'Montserrat-Regular'}}>Done</Text>
            </TouchableOpacity>
            </View>
        )
      }

      function renderHeader() {
        return (
          <View style={{justifyContent:'center',alignItems:'center',textAlign:'center',marginBottom:10}}>
                <Text style={{marginHorizontal:5,paddingHorizontal:5, fontFamily:'Montserrat-Regular',fontSize:20,backgroundColor:'white',alignSelf:'center'}}>Select your music preferences</Text>
                </View> 
        )
      }

      function renderMusicCategories() {
        console.log("musicCategoriesState: ",musicCategoriesState)
        return (
          <View style={{alignItems:'center'}}>
          <FlatList
            data={musicCategoriesState}
            renderItem={renderMusicCategoryItems}
            numColumns={2}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader}
          /> 
          </View>
        )
      }

      function renderMusicCategoriesModal() {
        return (
          <Modal isVisible={isMusicCategoryModalVisible} backdropColor={'white'} style={{backgroundColor:'while'}}>
            <View style={{ backgroundColor:'white',height:height*3/4,borderRadius:10,borderWidth:0.5,borderColor:'black', width:width*3/4,alignSelf:'center' }}>
              <View style={{marginTop:width/18,flexDirection:'column'}}>
                {renderMusicCategories()}
              </View>
            </View>
          </Modal>
        )
      }


      function renderModal() {
        return (
          
          <Modal isVisible={isModalVisible} backdropColor={'white'} style={{backgroundColor:'while'}}>
            <View style={{ backgroundColor:'white',height:width,borderRadius:10,borderWidth:0.5,borderColor:'black', width:width*3/4,alignSelf:'center' }}>
              {/* <TouchableOpacity style={{ position:'absolute',right:5,top:0 }} onPress={() => setIsModalVisible(false)}>
              <Icon name="times-circle" size={24}/> 
              </TouchableOpacity> */}
              <LottieView style={{
          width:width/2,paddingLeft:width*3/25,paddingTop:10}} source={modalJSON2} autoPlay loop />
              <View style={{justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                <Text style={{marginHorizontal:5,paddingHorizontal:5,borderWidth:0,borderColor:'#dddd', fontFamily:'Montserrat-SemiBold',fontSize:30,backgroundColor:'white',alignSelf:'center'}}>Enable Background Music</Text>
                </View>
                  <View style={{marginTop:0,position:'absolute',bottom:4,flexDirection:'column'}}>
                   <TouchableOpacity onPress={() => {
                    setIsModalVisible(false);
                    setMusicEnableNotificationSeen(true);
                  }} style={{backgroundColor:'#dddd'}}>
                  <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:18,alignSelf:'center'}}> Yes </Text>
                  </TouchableOpacity>
                  <View style={{borderWidth:0,width:width*3/4,height:10}}/> 
                  <TouchableOpacity onPress={async() => {
                    props.navigation.toggleDrawer()
                    setTimeout(() => {dispatch({type:"SHOW_MUSIC_PLAYER_TOOLTIP",payload:true})}, 500)
                    setIsModalVisible(false);
                    setMusicEnableNotificationSeen(false);
                  }} style={{backgroundColor:'#dddd'}}>
                  <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:18,alignSelf:'center'}}> No </Text>
                  </TouchableOpacity>
                  </View>
            </View>
          </Modal>
        )
      }  

    function renderTetrisFlips()
    {
      if(exploreFlips.length >= 6)
        return (
          <View style={{borderColor:'black',borderWidth:1,height:width,width:width}}>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:0,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
            style={{borderColor:'black',borderWidth:1,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[0].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[0].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:1,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
            style={{borderColor:'black',borderWidth:1,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[1].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[1].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:2,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
             style={{borderColor:'black',borderWidth:1,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[2].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[2].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:"row"}}>
              <View style={{flexDirection:'column'}}>
              <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:3,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
                style={{borderColor:'black',borderWidth:1,height:width/3,width:width/3}}>
              <Image source={{uri:exploreFlips[3].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[3].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:4,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
              style={{borderColor:'black',borderWidth:1,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[4].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[4].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:5,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
                  style={{borderColor:'black',borderWidth:1,height:width*2/3,width:width*2/3}}>
                <Image source={{uri:exploreFlips[5].flipPictures[0]}} 
                  style={{height:width*2/3,width:width*2/3}}/>
              {
                exploreFlips[5].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/3 - height/48,top:width/3 - height/48}}/>

              }
              </TouchableOpacity>
          </View>
          </View>
      )
    }

    function renderTetrisFlipsII()
    {
      if(exploreFlips.length >= 12)
      return (
        <View style={{borderColor:'black',borderWidth:0.5,height:width,width:width}}>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:6,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
            style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[6].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[6].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:7,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
            style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[7].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[7].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:8,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
             style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[8].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[8].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:"row"}}>
              <View style={{flexDirection:'column'}}>
              <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:9,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
                style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
              <Image source={{uri:exploreFlips[9].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[9].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:10,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
              style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[10].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[10].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:11,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].lastEditedOn,
            })
            }}
                  style={{borderColor:'black',borderWidth:0.5,height:width*2/3,width:width*2/3}}>
                <Image source={{uri:exploreFlips[11].flipPictures[0]}} 
                  style={{height:width*2/3,width:width*2/3}}/>
              {
                exploreFlips[11].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/3 - height/48,top:width/3 - height/48}}/>

              }
              </TouchableOpacity>
          </View>
          </View>
      )
    }

    function renderSectionStoryTellers()
    {
      return (
        <View style={{width:width,paddingTop:height/50}}>
          <StoryTellerCarousel data={storytellers} navigation={props.navigation}/>
          </View>
      )
    }

    function renderContinueListeningPodcasts()
    {
      console.log("[Explore][renderContinueListeningPodcasts] ContinueListeningPodcasts before rendering");
      if(podcastsLocal.length != 0)
        return (
          <View style={{width:width,paddingTop:10}}>
          <ContinueListeningPodcasts podcasts={podcastsLocal} navigation={props.navigation}/>
          </View> 
        )
      else
        return null;
    }

    function renderSection1Podcasts()
    {
      return (
        <View style={{width:width,paddingTop:10}}>
        <TrendingPodcastsCarousel data={section1Podcasts} navigation={props.navigation}/>
        </View>
        
        )
    }

    function renderSection2PodcastsI()
    {
      return section2Podcasts.slice(0,4).map((item, index)=>
      {
        return <Podcast podcast={item} key ={item.podcastID} navigation={props.navigation}/>
      })
    }

    function renderSection2PodcastsII()
    {
      return section2Podcasts.slice(4,8).map((item, index)=>
      {
        return <Podcast podcast={item} key ={item.podcastID} navigation={props.navigation}/>
      })
    }

    function renderSection2PodcastsIII()
    {
      return section2Podcasts.slice(8,10).map((item, index)=>
      {
        return <Podcast podcast={item} key ={item.podcastID} navigation={props.navigation}/>
      })
    }
 
    function renderMainHeader() 
    {
      return (
      <View style={styles.AppHeader}>
        <StatusBar
               barStyle="dark-content"
               //backgroundColor='transparent'
               translucent
               //hidden={true}
               />
        <TouchableNativeFeedback onPress={()=> {
          props.navigation.toggleDrawer();
        }}>
        <View style={{paddingLeft: 15,paddingRight:10 ,paddingVertical:26} }>
         
          {
            (numNotifications == 0)
            ?
            <View style={{flowDirection:'row'}}>
          <Icon name="bars" size={22}/>
            </View>
            :
            <View style={{flowDirection:'row'}}>
          <Icon name="bars" size={22}/>
            <Badge
            width={5}
            textStyle={{fontSize:8}}
            value={numNotifications}
            status="error"
            containerStyle={styles.badgeStyle}
            />
            </View>
          }
        </View>
        </TouchableNativeFeedback>
        <View style={{flex:1, paddingVertical:10}}>
          <TouchableOpacity onPress={() => {
            dispatch({type:"SET_ALGOLIA_QUERY", payload:"papyrus"})
            dispatch({type:"SET_EXPLORE_SCREEN_AS_PREVIOUS_SCREEN", payload:true})
            props.navigation.navigate('SearchTabNavigator',{fromExplore:true})}}>
        <View style={{flexDirection:'row',height:startHeaderHeight, backgroundColor: 'white', paddingRight: 13, paddingVertical:10}}>
       
            <Text style={{ flex:1, fontFamily:'Montserrat-Bold',borderRadius:20,backgroundColor:'#dddd',fontSize:12,
              paddingTop: 0, paddingHorizontal: 10,justifyContent:'center',textAlignVertical:'center' }}>
           
              <Icon style={{paddingHorizontal:10,paddingTop:20 }} name="search" size={15} />
             

              {"  "}Search podcasts, books, topics, authors{"  "}
               </Text>

        </View>
        </TouchableOpacity>
        </View>
        </View>
      )
    }
     
      if(isConnectedContext.isConnected && loading == true)
      {
        return (
          
          <View style={{flexDirection:'column'}} onLayout={(event) => getWindowDimension(event)}>   
            {renderMainHeader()}
            <View style={{flexDirection:'row'}}>
          <View style={{width:width/2}}>
            <Shimmer>
          <Text style={{paddingLeft: 30, paddingTop:height/20,fontFamily:'Montserrat-Bold',  fontSize:18,textShadowColor:'black'}}> App is under construction.
          </Text>
          </Shimmer>
          <Shimmer>
          <Text style={{paddingLeft: 30, paddingTop:5, fontFamily:'Montserrat-Regular', fontSize:15,textShadowColor:'black'}}>Caution: There may be bugs.
          </Text>
          </Shimmer>
          <Text style={{paddingLeft: 30, paddingTop:0, fontFamily:'Montserrat-Bold',  fontSize:12,textShadowColor:'black'}}>
          </Text>
          </View>
          <View style={{paddingTop:height/6,paddingRight:15}}>
          <ExploreAnimation/>
          
          </View>
          </View>
            <View style={{backgroundColor:'#e1e6e1'}}>
            <View style={{height:25}}/>
            <View style={{flexDirection:'row',paddingLeft:0.1*width}}>
              <View style={{flexDirection:'column',height:height/3,width:width*0.8}}>
              <Shimmer>
                <View style={{backgroundColor:'#A9A9A9',height:height/5,width:width*0.8}}/>  
              </Shimmer>
              <Shimmer>
                <View style={{backgroundColor:'white',height:height*2/15,width:width*0.8,paddingLeft:10}}>
                  <View style={{marginTop:10,height:5,backgroundColor:"#A9A9A9",width:width*0.75}}/>
                  <View style={{marginTop:2,height:5,backgroundColor:"#A9A9A9",width:width*0.6}}/>
                  <View style={{marginTop:30,height:7,backgroundColor:"#A9A9A9",width:width*0.75}}/>
                  <View style={{marginTop:5,height:7,backgroundColor:"#A9A9A9",width:width*0.75}}/>
                  <View style={{marginTop:5,height:7,backgroundColor:"#A9A9A9",width:width*0.75}}/>

                  </View>
              </Shimmer>
              </View>
            
            </View>
            <View style={{flexDirection:'row',marginTop:100}}>
              <View style={{width:0.03*width}}/>
              <Shimmer>
                <View style={{backgroundColor:'#A9A9A9',height:height*2/30,width:width*0.3}}/>
                </Shimmer>
                <View style={{width:0.03*width}}/>
                <Shimmer>
                <View style={{backgroundColor:'#A9A9A9',height:height*2/30,width:width*0.4}}/>
                </Shimmer>
                <View style={{width:0.03*width}}/>
                <Shimmer>
                <View style={{backgroundColor:'#A9A9A9',height:height*2/30,width:width*0.4}}/>
                </Shimmer>
                <View style={{width:0.03*width}}/>

            </View>
            </View>
              
            
        </View>    
        
        )
      }
      else if(isConnectedContext.isConnected || (section1Podcasts.length != 0 || section2Podcasts.length != 0 || recordBooks.length != 0 || storytellers.length != 0 || music.length != 0))
      {
        return (
     
          <SafeAreaView style={{flex:1, backgroundColor:'white'}} onLayout={(event) => getWindowDimension(event)}>
          {renderMainHeader()}
          {renderModal()}
          {renderMusicCategoriesModal()}
          <ScrollView  scrollEventThrottle={16}>
         
          <View style={{flexDirection:'row'}}>
          <View style={{width:width/2}}>
          <Text style={{paddingLeft: 30, paddingTop:height/20,fontFamily:'Montserrat-Bold',  fontSize:18,textShadowColor:'black'}}> App is under construction.
          </Text>
          <Text style={{paddingLeft: 30, paddingTop:5, fontFamily:'Montserrat-Regular', fontSize:15,textShadowColor:'black'}}>Caution: There may be bugs.
          </Text>
          <Text style={{paddingLeft: 30, paddingTop:0, fontFamily:'Montserrat-Bold',  fontSize:12,textShadowColor:'black'}}>
          </Text>
          </View>
          <View style={{paddingTop:height/6,paddingRight:15}}>
          <ExploreAnimation/>
          
          </View>
          </View>

            <View style={{backgroundColor:'#e1e6e1'}}>
            <View style={{height:15}}/>
             {renderSection1Podcasts()}
             <View style={{marginTop:20,borderBottomColor:'#d1d0d4',borderBottomWidth:0}}/> 
             {renderContinueListeningPodcasts()}

             {renderTetrisFlips()}
             <View style={{marginTop:20,borderBottomColor:'#d1d0d4',borderBottomWidth:0}}/> 
             {renderSection2PodcastsI()}
             <Text style={{fontSize:23,marginTop:10, color:'black',fontFamily:'HeadlandOne-Regular'}}> Storytellers </Text>
             {renderSectionStoryTellers()}
            <View style={{marginTop:20,borderBottomColor:'#d1d0d4',borderBottomWidth:0}}/> 
            {renderSection2PodcastsII()}
            <View style={{height:15}}/>
            <Text style={{fontSize:23,marginBottom:10, color:'black',fontFamily:'HeadlandOne-Regular'}}> Popular Books </Text>
             <BookList navigation={props.navigation} books={recordBooks} fromScreen="Explore"/>
              
             {renderTetrisFlipsII()}
             <View style={{height:15}}/>
             {renderSection2PodcastsIII()}
             <View style={{height:15}}/>
             </View>
              </ScrollView>
          </SafeAreaView>
        )
      }
      else 
      {
        return (
          <View>
          {renderMainHeader()}

          <View style={{alignItems:'center',justifyContent:'center'}}>
            <Image source={require('../assets/images/NoInternet.jpg')} style={{height:height/1.5,width:width}}/>
            </View>
            </View>
        )
      }
},areEqual)

export default withFirebaseHOC(Explore);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  AppHeader:
  {
 flexDirection:'row',
 marginTop:STATUS_BAR_HEIGHT,
 backgroundColor: 'white'
  },
  storie: {
    height: 50,
    width: 50,
    borderRadius: 60,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
},
badgeStyle: {
  position: 'absolute',
  top: -4,
  right: -4
}
});
