// @flow
import  React, {useState,useEffect,useRef} from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView,TouchableOpacity, TouchableWithoutFeedback,Dimensions, ActivityIndicator,Share
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from "moment";
import HomeScreen from '../../HomeScreen'
import Explore from '../../Explore'
import {useSelector, useDispatch} from "react-redux"
import Video from 'react-native-video';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import ProgressBar from './ProgressBar'
import InfoScreen from '../../../InfoScreen'
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';
import { Button } from '../categories/components';
import Toast from 'react-native-simple-toast';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import ForwardAnimation from './ForwardAnimation';
import BackwardAnimation from './BackwardAnimation';
import PlayPause from './PlayPause';
import BarsAnimation from './BarsAnimation';
import * as Animatable from 'react-native-animatable'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import Animated,{Easing} from 'react-native-reanimated';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import ImageColors from "react-native-image-colors"
import LinearGradient from 'react-native-linear-gradient';

//import { styles } from '../categories/components/Block';

//import videos, { type Video } from './videos';
const colors = {
  transparent: 'transparent',
  white: '#fff',
  heartColor: '#e92f3c',
  textPrimary: '#515151',
  black: '#000', 
}

const { width,height } = Dimensions.get('window');
/*type VideoContentProps = 
  video: Video,
};*/

const animationEndY = Math.ceil(height);
const negativeEndY = animationEndY * -1;

const AnimatedIconAntDesign = Animatable.createAnimatableComponent(IconAntDesign)
const AnimatedIcon = Animatable.createAnimatableComponent(EvilIcon)

 const PodcastContent=(props)=> {
  const playbackState = usePlaybackState();
  const { position, bufferedPosition, duration } = useTrackPlayerProgress()
  const video = useRef();
  var smallAnimatedHeartIcon = useRef();
  var smallAnimatedBookmarkIcon = useRef();
  const userID = props.userID;
  const privateDataID = "private" + userID;

  const [dominantBackgroundColor,setDominantBackgroundColor] = useState('#212121')
  const [averageBackgroundColor,setAverageBackgroundColor] = useState('#212121')

  const navBarHeight = useSelector(state=>state.userReducer.navBarHeight);
  const sessionStartListeningTime = useSelector(state=>state.rootReducer.sessionStartListeningTime);
  const rate=useSelector(state=>state.rootReducer.rate);
  const currentTime=useSelector(state=>state.rootReducer.currentTime) 
  const lastPlayingCurrentTime = useSelector(state=>state.userReducer.lastPlayingCurrentTime);
  const paused=useSelector(state=>state.rootReducer.paused);
  const volume=useSelector(state=>state.rootReducer.volume);

  const liked = useSelector(state=>state.userReducer.isPodcastLiked[props.podcast.podcastID]);
  const [likedState,setLikedState] = useState(liked);
  const numLikesRedux = useSelector(state=>state.rootReducer.numLikes);

  const bookmarked = useSelector(state=>state.userReducer.isPodcastBookmarked[props.podcast.podcastID]);
  const [bookmarkedState,setBookmarkedState] = useState(bookmarked);
  const numRetweetsRedux = useSelector(state=>state.rootReducer.numRetweets);

  const userDisplayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
  const name = useSelector(state=>state.userReducer.name);
  const loadingPodcast = useSelector(state=>state.rootReducer.loadingPodcast)
  const dispatch=useDispatch();

  var podcastName = props.podcast.podcastName;

  

  var podcastDescription = props.podcast.podcastDescription;
  if(podcastDescription === undefined || podcastDescription === null)
    podcastDescription = "";
  
  async function buildDynamicURL() {
    const link = await dynamicLinks().buildShortLink({
      //link: 'https://newpodcast.com/' + props.podcast.podcastID,
      link: 'https://papyrusapp.page.link/player/' + props.podcast.podcastID,
      // domainUriPrefix is created in your firebase console
      domainUriPrefix: 'https://papyrusapp.page.link/',
      // optional set up which updates firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
      android: {
        packageName: 'com.papyrus_60',
        minimumVersion: '8',
        fallbackUrl: 'http://www.papyruspodcasts.com'
      },
      social: {
        title: props.podcast.podcastName,
        descriptionText: props.podcast.podcastDescription.slice(0,100),
        imageUrl: props.podcast.podcastPictures[0]
      }
    });
  
    console.log("dynamicURL created for the link: ",link);
    Share.share({
      title : props.podcast.podcastName,
      //url : link,
      message: link
    },{
      dialogTitle: 'Share Podcast'
    })
    return link;
  }

  

  async function setup() {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ],
      alwaysPauseOnInterruption: true,
       notificationCapabilities: [
         TrackPlayer.CAPABILITY_PLAY,
         TrackPlayer.CAPABILITY_PAUSE,
         TrackPlayer.CAPABILITY_STOP
       ]
    });
    
    await TrackPlayer.add({
      id: props.podcast.podcastID,
      url: props.podcast.audioFileLink,
      title: props.podcast.podcastName,
      artist: props.podcast.podcasterName,
      artwork: props.podcast.podcastPictures[0],
      duration: props.podcast.duration
    });
    
    await TrackPlayer.play();
  }
  
  async function isPlaying () {
    const currentState = await TrackPlayer.getState()
    return currentState === TrackPlayer.STATE_PLAYING
}

async function togglePlay  ()  {
  const currentState = await TrackPlayer.getState()
  const isPlaying = (currentState === TrackPlayer.STATE_PLAYING) 
  //dispatch({type:"TOGGLE_PLAY_PAUSED"});
    if (isPlaying) {
        return TrackPlayer.pause()
    } else {
        return TrackPlayer.play()
    }

}



  useEffect(() => {
    props.podcast !== null && setup() && extractDominantColor();
  },[props.podcast])

  useEffect(() => {
    console.log("playbackState:",playbackState);
    if(playbackState == TrackPlayer.STATE_PLAYING){
      console.log("IN STATE PLAYING");
      if(lastPlayingCurrentTime !== null){
        console.log("[PodcasContent] TRACK PLAYER SEEKING");
        TrackPlayer.seekTo(lastPlayingCurrentTime);
        dispatch({type:"SET_LAST_PLAYING_CURRENT_TIME",payload:null});
      }
      loadingPodcast == true && dispatch({type:"SET_LOADING_PODCAST", payload:false});
      dispatch({type:"SET_PAUSED", payload:false});
      // ONLY ON First TIME LOAD
       
    }
    else if(playbackState == TrackPlayer.STATE_BUFFERING){
      dispatch({type:"SET_LOADING_PODCAST", payload:true});
    }
    else if(playbackState == TrackPlayer.STATE_PAUSED){
      dispatch({type:"SET_PAUSED", payload:true});
    }
    else if(playbackState == TrackPlayer.STATE_STOPPED){
      //TrackPlayer.seekTo(0);
      dispatch({type:"SET_PAUSED", payload:true});
      TrackPlayer.pause();
    }
    // else if(playbackState == TrackPlayer.STATE_STOPPED){
    //   dispatch({type:"SET_PODCAST",payload:null});
    // }
  },[playbackState])

  async function extractDominantColor (){
    const colors = await ImageColors.getColors(props.podcast.podcastPictures[0], {
      fallback: "#228B22",
    })
    const averageColor = colors.average;
      console.log("averageColor = ",averageColor);
      setDominantBackgroundColor(colors.average);
      setAverageBackgroundColor(colors.lightVibrant);
    //const colors = await ImageColors.getColors(props.podcast.podcastPictures[0], config)
    if (colors.platform === "android") {
      // Access android properties
      // e.g.
      const averageColor = colors.average
      console.log("averageColor = ",averageColor);
    } else {
      // Access iOS properties
      // e.g.
      const backgroundColor = colors.background
    }
  }

  function handleSmallAnimatedHeartIconRef  (ref) {
    smallAnimatedHeartIcon = ref
  }

  function handleSmallAnimatedBookmarkIconRef  (ref) {
    smallAnimatedBookmarkIcon = ref
  }

  function handleOnPressLike() {
    setLikedState(!likedState);
    smallAnimatedHeartIcon.bounceIn();
    }

  function handleOnPressBookmark() {
    if(bookmarked != true)
    {
      smallAnimatedBookmarkIcon.bounceIn();
      setBookmarkedState(true);
      addToBookmarks();
    }
    else
    {
      smallAnimatedBookmarkIcon.bounceIn();
      setBookmarkedState(false);
      removeFromBookmarks();
      
    }
  }

  function skipForward() {
    TrackPlayer.seekTo(position + 10)
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime + 10})
  }
  function skipBackward() {
    TrackPlayer.seekTo(position - 10)
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime - 10})
    
  }

  function onSeek(data) {
    TrackPlayer.seekTo(data.seekTime)
    dispatch({type:"SET_CURRENT_TIME", payload: data.seekTime})
  }

function handlePlayPause() {
  // If playing, pause and show controls immediately.
  // if (!paused) {
  //   dispatch({type:"TOGGLE_PLAY_PAUSED"})
  //   return;
  // }
}

function parentSlideDown(){
  props.slideDown();
}




async function removeFromBookmarks() {

  dispatch({type:"REMOVE_FROM_PODCASTS_BOOKMARKED",payload:props.podcast.podcastID});
  dispatch({type:"SET_NUM_RETWEETS",payload:numRetweetsRedux - 1});

 firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('bookmarks')
    .where("podcastID",'==',props.podcast.podcastID).get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc) {
        doc.ref.delete().then(function() {
          Toast.show("Removed from Collections");
        }).catch(function(error){
          console.log("Error in removing bookmarks from user's bookmarks collection: ",error);
        });
      });
    });
 
  firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
      podcastsBookmarked : firestore.FieldValue.arrayRemove(props.podcast.podcastID)
    },{merge:true}).catch(function(error){
      console.log("Error in removing podcastID from podcastsBookmarked in user's private document: ",error);
    })

    if(props.podcast.isChapterPodcast == true)
    {
     firestore().collection('books').doc(props.podcast.bookID).collection('chapters').
       doc(props.podcast.chapterID).collection('podcasts').doc(props.podcast.podcastID).set({
         numUsersRetweeted : firestore.FieldValue.increment(-1)
       },{merge:true}).then(() => {
         console.log("Successfully decremented numUsersRetweeted in podcast(chapter) Doc");
       }).catch((error) => {
         console.log("Error in decrementing numUsersRetweeted in podcast(chapter) Doc");
       })
    }
    else if(props.podcast.isChapterPodcast == false)
    {
     firestore().collection('books').doc(props.podcast.bookID)
       .collection('podcasts').doc(props.podcast.podcastID).set({
         numUsersRetweeted : firestore.FieldValue.increment(-1)
       },{merge:true}).then(() => {
         console.log("Successfully decremented numUsersRetweeted in podcast(book) Doc");
       }).catch((error) => {
         console.log("Error in decrementing numUsersRetweeted in podcast(book) Doc");
       })
    }
    else if(props.podcast.isOriginalPodcast == true)
    {
     firestore().collection('podcasts').doc(props.podcast.podcastID).set({
         numUsersRetweeted : firestore.FieldValue.increment(-1)
       },{merge:true}).then(() => {
         console.log("Successfully decremented numUsersRetweeted in podcast(original) Doc");
       }).catch((error) => {
         console.log("Error in decrementing numUsersRetweeted in podcast(original) Doc");
       })
    }

  
}





async function addToBookmarks() {
   const picturesArray = [];
   picturesArray.push(props.podcast.podcastPictures[0]);

  dispatch({type:"ADD_TO_PODCASTS_BOOKMARKED",payload:props.podcast.podcastID});
  dispatch({type:"SET_NUM_RETWEETS",payload:numRetweetsRedux + 1});

  firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('bookmarks').add({
    bookmarkedOn : moment().format(),
    bookName : props.podcast.bookName,
    bookID : props.podcast.bookID,  
    chapterID : props.podcast.chapterID,
    chapterName : props.podcast.chapterName,
    podcastID : props.podcast.podcastID, 
    podcastName : props.podcast.podcastName,
    podcastPictures : picturesArray,
    podcastDescription : props.podcast.podcastDescription,
    podcasterName : props.podcast.podcasterName,
    podcasterID : props.podcast.podcasterID,
    createdOn : props.podcast.createdOn,
    isChapterPodcast : props.podcast.isChapterPodcast,
    isOriginalPodcast : props.podcast.isOriginalPodcast,
    duration: props.podcast.duration
  }).then(function(docRef){
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('bookmarks').doc(docRef.id).set({
      bookmarkID : docRef.id
    },{merge:true})
    
    Toast.show("Reposted");
  }).catch(function(error){
    console.log("Error in adding bookmarks to user's bookmarks collection: ",error);
  })
  
   firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
    podcastsBookmarked : firestore.FieldValue.arrayUnion(props.podcast.podcastID)
   },{merge:true}).catch(function(error){
     console.log("Error in adding podcastID to podcastsBookmarked in user's private document: ",error);
   })

   if(props.podcast.isChapterPodcast == true)
   {
    firestore().collection('books').doc(props.podcast.bookID).collection('chapters').
      doc(props.podcast.chapterID).collection('podcasts').doc(props.podcast.podcastID).set({
        numUsersRetweeted : firestore.FieldValue.increment(1)
      },{merge:true}).then(() => {
        console.log("Successfully incremented numUsersRetweeted in podcast(chapter) Doc");
      }).catch((error) => {
        console.log("Error in incrementing numUsersRetweeted in podcast(chapter) Doc");
      })
   }
   else if(props.podcast.isChapterPodcast == false)
   {
    firestore().collection('books').doc(props.podcast.bookID)
      .collection('podcasts').doc(props.podcast.podcastID).set({
        numUsersRetweeted : firestore.FieldValue.increment(1)
      },{merge:true}).then(() => {
        console.log("Successfully incremented numUsersRetweeted in podcast(book) Doc");
      }).catch((error) => {
        console.log("Error in incrementing numUsersRetweeted in podcast(book) Doc");
      })
   }
   else if(props.podcast.isOriginalPodcast == true)
   {
    firestore().collection('podcasts').doc(props.podcast.podcastID).set({
        numUsersRetweeted : firestore.FieldValue.increment(1)
      },{merge:true}).then(() => {
        console.log("Successfully incremented numUsersRetweeted in podcast(original) Doc");
      }).catch((error) => {
        console.log("Error in incrementing numUsersRetweeted in podcast(original) Doc");
      })
   }


}


async function retrieveUserPrivateDoc()
  {
    try{
      const privateDataID = "private" + props.podcast.podcasterID;
      const userDocument = await firestore().collection('users').doc(props.podcast.podcasterID).collection('privateUserData').doc(privateDataID)
                                .get();
      console.log("[PodcastContent] userDocument : ", userDocument);
      const userDocumentData = userDocument.data();
      console.log("[PodcastContent] userDocumentData : ", userDocumentData);
      
      const isUserSame = (props.podcast.podcasterID == userID);

      if(isUserSame)
      {
        props.navigation.navigate('ProfileTabNavigator')
      }
      else
      {
        dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:userDocumentData});
        props.navigation.navigate('ExploreTabNavigator',{userData:userDocumentData});
      }
        
      
    }
    catch(error){
      console.log("Error in retrieveUser() in PodcastContent: ",error);
    }
    
  }

async function updatePodcastsUnliked(props) {

  dispatch({type:'REMOVE_FROM_PODCASTS_LIKED',payload:props.podcast.podcastID});


  //const numUsers = props.podcast.numUsersLiked - 1;
  const numUsers = numLikesRedux - 1;  
  
    dispatch({type:'SET_NUM_LIKES',payload:numUsers});
    
    if(props.podcast.isChapterPodcast === true)
    {
      await firestore().collection('books').doc(props.podcast.bookID).collection('chapters').
        doc(props.podcast.chapterID).collection('podcasts').doc(props.podcast.podcastID).set({
          numUsersLiked : firestore.FieldValue.increment(-1)
      },{merge:true})
    }
    else if(props.podcast.isChapterPodcast === false)
    {
      await firestore().collection('books').doc(props.podcast.bookID).collection('podcasts')
          .doc(props.podcast.podcastID).set({
        numUsersLiked : firestore.FieldValue.increment(-1)
      },{merge:true})
    }
    else if(props.podcast.isOriginalPodcast === true)    
    {
      await firestore().collection('podcasts').doc(props.podcast.podcastID).set({
        numUsersLiked : firestore.FieldValue.increment(-1)
      },{merge:true})
    }
 
  await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
    podcastsLiked : firestore.FieldValue.arrayRemove(props.podcast.podcastID)
  },{merge:true})

 }

async function updatePodcastsLiked(props){

  //setLikedState(true);
  dispatch({type:'ADD_TO_PODCASTS_LIKED',payload:props.podcast.podcastID})
  //const numUsers = props.podcast.numUsersLiked + 1;
  const numUsers = numLikesRedux + 1;  

  dispatch({type:'SET_NUM_LIKES',payload:numUsers})

  if(props.podcast.isChapterPodcast === true)
    {
      await firestore().collection('books').doc(props.podcast.bookID).collection('chapters').
        doc(props.podcast.chapterID).collection('podcasts').doc(props.podcast.podcastID).set({
          numUsersLiked : firestore.FieldValue.increment(1)
      },{merge:true})
    }
    else if(props.podcast.isChapterPodcast === false)
    {
      await firestore().collection('books').doc(props.podcast.bookID).collection('podcasts')
          .doc(props.podcast.podcastID).set({
        numUsersLiked : firestore.FieldValue.increment(1)
      },{merge:true})
    }
    else if(props.podcast.isOriginalPodcast === true)    
    {
      await firestore().collection('podcasts').doc(props.podcast.podcastID).set({
        numUsersLiked : firestore.FieldValue.increment(1)
      },{merge:true})
    }


  const likedPodcasts = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
        podcastsLiked : firestore.FieldValue.arrayUnion(props.podcast.podcastID)
  },{merge:true})
  
  console.log("[PodcastContent] In function updatePodcastsLiked, numUsers = ",numUsers);

  console.log("props.podcast = ",props.podcast);

  var chapterID = null;
  if(props.podcast.isChapterPodcast === true)
    chapterID = props.podcast.chapterID;
  else
    chapterID = "";

  const instance = firebase.app().functions("asia-northeast1").httpsCallable('addActivity');
  try 
  {          
    await instance({ // change in podcast docs created by  user
      likeUpdatedInDocument : true, // so that we don't update numUsersLiked in cloud functions
      timestamp : moment().format(),
      photoURL : userDisplayPictureURL,
      podcastID : props.podcast.podcastID,
      userID : props.podcast.podcasterID,
      podcastImageURL : props.podcast.podcastPictures[0],
      type : "like",
      Name : name,
      podcastName : props.podcast.podcastName,
      bookID : props.podcast.bookID,
      chapterID : props.podcast.chapterID,
      isChapterPodcast: props.podcast.isChapterPodcast,
    });
  }
  catch (e) 
  {
    console.log(e);
  }
} 

    

    return (
      
      <LinearGradient  colors={['transparent',dominantBackgroundColor,'#212121']} >
        <ScrollView 
        style={{paddingHorizontal: 8,paddingBottom:40,
          //backgroundColor:dominantBackgroundColor,
          height:height
          }}>

        <View>
        <View>
        {/* <TouchableOpacity style={styles.rateButton} onPress={()=>{
                  //dispatch({type:"TOGGLE_MINI_PLAYER"})
                  parentSlideDown()
                  props.navigation.navigate('InfoScreen', {podcast:props.podcast})
               }}>
                  <Text style={{color:'white', fontSize:12, alignItems: 'center'}}>
                    Read
             </Text>

                </TouchableOpacity> */}
                       
        <Text style={[styles.textDark, {paddingTop:10,fontSize: 28,fontFamily:'Montserrat-SemiBold' }]}>
          {podcastName}{"    "}
          </Text>
    
                    </View>
                    <View style={{ marginTop: 2}}>
                      
                      <TouchableNativeFeedback onPress={() => {
                        parentSlideDown();
                        retrieveUserPrivateDoc();
                        }}>
                      <View style={{flexDirection:'row', marginTop: 2}}>
                        <Image source={{uri:props.podcast.podcasterDisplayPicture}} style={{height:height/20,width:height/20,borderRadius:30}}/>
                        
                          <Text style={[styles.text, { fontFamily:'Montserrat-SemiBold',fontSize: 18, marginTop: 0,marginLeft:7}]}>
                            {props.podcast.podcasterName}
                          </Text>
                        
                        </View>
                    </TouchableNativeFeedback>
                      
                      
                    </View>

              <View style={{height:height/5,paddingTop:10}}>
                { podcastDescription.length != 0 &&
                  <TouchableNativeFeedback style={{height:height/6}} useForeground={true} onPress={()=>{
                  //dispatch({type:"TOGGLE_MINI_PLAYER"})
                  parentSlideDown()
                  props.navigation.navigate('InfoScreen', {podcast:props.podcast})

                  }}>
                      <Text style={{fontFamily:'Montserrat-Regular',fontSize:height/54,color:'white',lineHeight:height/54}}>{podcastDescription.slice(0,300)}
                      <Text style={[styles.text,{fontFamily:'Montserrat-Regular'}]}>{podcastDescription.length > 300 && "...Read More"}</Text>
                      </Text>
                  </TouchableNativeFeedback>
                }
                <View style={{justifyContent:'flex-end'}}>
                <BarsAnimation paused={paused} loadingPodcast={loadingPodcast}/>
                </View>
                </View>


        <View  style={{paddingLeft:10}}>
        </View>
        </View>
        

         <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: height/20 }}>
                    {/* <TouchableOpacity  onPress={skipBackward} style={{paddingRight:width/20}}>
                    <Icon name="undo"  size={28} label="10" color="white"/>
                    </TouchableOpacity> */}
                    <BackwardAnimation skipBackward={skipBackward}/>
                    {loadingPodcast && <View style={styles.playButtonContainer}>
                      <ActivityIndicator size={'large'} color={'black'}/>
                      </View>}
        
                    {
                      !loadingPodcast && <PlayPause loadingPodcast={loadingPodcast}
                       pausePodcast={togglePlay} playPodcast={togglePlay}/>
                    }
  
                    {/* <TouchableOpacity  onPress={skipForward} style={{paddingLeft:0}}> */}
                    
                    <ForwardAnimation skipForward={skipForward}/>
                    {/* <Icon name="repeat"  size={28} label="10" color="white" /> */}
                    {/* </TouchableOpacity> */}
                </View>

            <View style={{alignItems:'center', paddingTop:16}}>
            <TouchableOpacity style={styles.rateButton} onPress={(()=>{
      TrackPlayer.getRate().then(function(rate){
        console.log("RATE: ",rate)
        if(rate == 2){
          rate = 0.75;
        }
        dispatch({type:"SET_RATE",payload: rate+0.25});
        TrackPlayer.setRate(rate + 0.25)
      }
      );
    })}>
      
      <Text style={{color:'white', fontSize:12, alignItems: 'center'}}>x{rate}</Text></TouchableOpacity>
              
          </View>
          <View style={{paddingTop:height/30,paddingBottom:0}}> 
          <ProgressBar
                position = {position}
                duration={props.podcast.duration}
                onSlideCapture={onSeek}
                loadingPodcast={loadingPodcast}
              /> 
         </View> 

         <View style={{flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop:height/40,paddingBottom:50,marginBottom:48}}>

           

         <TouchableOpacity onPress={() => {
                if(liked != true)
                {
                  handleOnPressLike();
                  updatePodcastsLiked(props);  
                }
                else
                {
                  setLikedState(!likedState);
                  updatePodcastsUnliked(props);
                }

            }}>

              <AnimatedIconAntDesign
                ref={handleSmallAnimatedHeartIconRef}
                name={liked ? 'heart' : 'hearto'}
                color={liked ? colors.heartColor : 'white'}
                size={20}
                style={{height:30,width:30}}
              />

                </TouchableOpacity>
               
                <View style={{paddingLeft:width/4}}>
                <TouchableOpacity onPress={() => handleOnPressBookmark()}>
                  <AnimatedIcon
                    ref={handleSmallAnimatedBookmarkIconRef}
                    name={bookmarked ? 'retweet' : 'retweet'}
                    color={bookmarked ? '#3879ab' : 'white'}
                    size={30}
                    style={{height:30,width:30}}
                  />
                </TouchableOpacity>
                </View>
                <View>
            </View>

            <View style={{paddingLeft:width/4}}>
            <TouchableOpacity onPress={() => {
              buildDynamicURL();
            }}>
                
            <Icon name="share" size={20} style={{color:'white',height:30,width:30}}/>
            </TouchableOpacity>
            </View>
          </View>
          <View style={{height:100}}/>

    </ScrollView>
    </LinearGradient>

    );
  }
  
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 8,
    backgroundColor:'#212121',
    height:height*18/24
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  views: {
    color: 'gray',
    marginBottom: 16,
  },
  textDark: {
    color: "white"
},
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:height/12,
    //paddingBottom:48
  },
  upNext: {
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingTop: 8,
    padding: 16,
  },
  upNextTitle: {
    fontWeight: 'bold',
    color: 'gray',
  },
  rateButton:{
    //alignItems:'center' ,
    //paddingTop: 8, 
    alignItems: 'center',
    justifyContent:'center', 
    height:height/30, 
    width:(width*7)/70, 
    borderRadius:5, 
    borderColor:'rgba(255, 255, 255, 0.5)', 
    borderWidth: 1

  },
  thumbnail: {
    flexDirection: 'row',
    marginTop: 16,
  },
  thumbnailImage: {
    height: 100,
    width: 100,
  },
  thumbnailContent: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingBottom: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  thumbnailTitle: {
    fontSize: 16,
  },
  thumbnailUsername: {
    color: 'gray',
  },
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFF"
},
thumb: {
    width: 8,
    height: 8,
    backgroundColor: "#3D425C"
},

playButtonContainer: {
  backgroundColor: "#FFF",
  borderColor: "black",
  borderWidth: 2,
  width: height/10,
  height: height/10,
  borderRadius: 64,
  justifyContent: "center",
  marginHorizontal: 32,
  shadowColor: "#5D3F6A",
  shadowRadius: 30,
  shadowOpacity: 0.5, 
  alignItems:'center'
}, 
text: {
  color: "#8E97A6"
}, 
innerProgressCompleted: {
  height: 20,
  backgroundColor: '#cccccc',
},
innerProgressRemaining: {
  height: 20,
  backgroundColor: '#2C2C2C',
},
progress: {
  flex: 1,
  flexDirection: 'row',
  borderRadius: 3,
  overflow: 'hidden',
},
container: {
  flex: 1,
}
});

export default PodcastContent;