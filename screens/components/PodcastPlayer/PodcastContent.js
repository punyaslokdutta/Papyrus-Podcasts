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
import LottieView from 'lottie-react-native';
import ForwardAnimation from './ForwardAnimation';
import BackwardAnimation from './BackwardAnimation';
import PlayPause from './PlayPause';
import BarsAnimation from './BarsAnimation';
import * as Animatable from 'react-native-animatable'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import Animated,{Easing} from 'react-native-reanimated';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

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

let heartCount = 0;


function getRandomNumber(min,max) {
  return Math.random() * (max - min) + min;
}


 const PodcastContent=(props)=> {
  const playbackState = usePlaybackState();
  const { position, bufferedPosition, duration } = useTrackPlayerProgress()
  const video = useRef();
  var smallAnimatedHeartIcon = useRef();
  var smallAnimatedBookmarkIcon = useRef();
  const userID = props.userID;
  const privateDataID = "private" + userID;

  
  const navBarHeight = useSelector(state=>state.userReducer.navBarHeight);
  const sessionStartListeningTime = useSelector(state=>state.rootReducer.sessionStartListeningTime);
  const rate=useSelector(state=>state.rootReducer.rate);
  const currentTime=useSelector(state=>state.rootReducer.currentTime) 
  const lastPlayingCurrentTime = useSelector(state=>state.userReducer.lastPlayingCurrentTime);
  const paused=useSelector(state=>state.rootReducer.paused);
  const volume=useSelector(state=>state.rootReducer.volume);

  const liked = useSelector(state=>state.userReducer.isPodcastLiked[props.podcast.podcastID]);
  const [likedState,setLikedState] = useState(liked);

  const bookmarked = useSelector(state=>state.userReducer.isPodcastBookmarked[props.podcast.podcastID]);
  const [bookmarkedState,setBookmarkedState] = useState(bookmarked);

  const userDisplayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
  const name = useSelector(state=>state.userReducer.name);
  const loadingPodcast = useSelector(state=>state.rootReducer.loadingPodcast)
  //const duration=useSelector(state=>state.rootReducer.duration)
  const dispatch=useDispatch();

  const heartsStore = useSelector(state=>state.rootReducer.hearts);
  const [hearts,setHearts] = useState([]);
  const podcastName = props.podcast.podcastName;
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
        descriptionText: props.podcast.podcastDescription,
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
         TrackPlayer.CAPABILITY_PAUSE
       ]
    });
    await TrackPlayer.add({
      id: "local-track",
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
  props.podcast !== null && setup();
},[props.podcast])

  useEffect(() => {
    setHearts([]);
  },[heartsStore])


  useEffect(() => {
    console.log("playbackState:",playbackState);
    if(playbackState == TrackPlayer.STATE_PLAYING){
      console.log("IN STATE PLAYING");
      loadingPodcast == true && dispatch({type:"SET_LOADING_PODCAST", payload:false});
      dispatch({type:"SET_PAUSED", payload:false});
      // ONLY ON First TIME LOAD
      lastPlayingCurrentTime != null && TrackPlayer.seekTo(lastPlayingCurrentTime);
      dispatch({type:"SET_LAST_PLAYING_CURRENT_TIME",payload:null});
    }
    else if(playbackState == TrackPlayer.STATE_BUFFERING){
      dispatch({type:"SET_LOADING_PODCAST", payload:true});
    }
    else if(playbackState == TrackPlayer.STATE_PAUSED){
      dispatch({type:"SET_PAUSED", payload:true});
    }
    // else if(playbackState == TrackPlayer.STATE_STOPPED){
    //   dispatch({type:"SET_PODCAST",payload:null});
    // }
  },[playbackState])

  

  function addHearts(){
    console.log("[addHearts] prevHearts : ",hearts);
    setHearts([...hearts,{id : heartCount , paddingRight : getRandomNumber(20,100)}]);
    console.log("[addHearts] nextHearts : ",hearts);
    heartCount++;
    console.log("[addHearts] heartCount : ",heartCount);
  }

  function removeHeart(id){
    console.log("[removeHeart] hearts: ",hearts);
    console.log("[removeHeart] id to be removed: ",id);

    // var newHearts = hearts;

    // // newHearts.pop();
    
    // newHearts.filter(heart => {
    //   return heart.id !== id
    // });
    // console.log("[removeHeart] newHearts: ",newHearts);
    // setHearts(newHearts);
  }

  function handleSmallAnimatedHeartIconRef  (ref) {
    smallAnimatedHeartIcon = ref
  }

  function handleSmallAnimatedBookmarkIconRef  (ref) {
    smallAnimatedBookmarkIcon = ref
  }
  

  function handleOnPressLike() {
    smallAnimatedHeartIcon.bounceIn();
    setLikedState(!likedState);
    }

  function handleOnPressBookmark() {
    //smallAnimatedBookmarkIcon.bounceIn();
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
    //setBookmarkedState(!bookmarkedState);
  }

  

  function skipForward() {
    TrackPlayer.seekTo(position + 10)
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime + 10})
  }
  function skipBackward() {
    TrackPlayer.seekTo(position - 10)
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime - 10})
    
  }

  function onLoadEnd(data) {
    dispatch({type:"SET_DURATION", payload: props.podcast.duration})
    //dispatch({type:"RESET_TO_INITIAL"})
    dispatch({type:"SET_LOADING_PODCAST", payload:false});

    //dispatch({type:"SET_PAUSED",payload:true});
    //****** HAVE TO FIX THIS AFTER TRACK PLAYER WORKS PROPERLY
    /*
    lastPlayingCurrentTime != null && 
    TrackPlayer.seekTo(lastPlayingCurrentTime) ;


    dispatch({type:"SET_LAST_PLAYING_CURRENT_TIME",payload:null});
    const currentTime = moment().format();
    dispatch({type:"SET_SESSION_START_LISTENING_TIME",payload:currentTime});
    */
  }

 function onSeek(data) {
  TrackPlayer.seekTo(data.seekTime)
  dispatch({type:"SET_CURRENT_TIME", payload: data.seekTime})
}
function onEnd() {
  dispatch({type:"TOGGLE_PLAY_PAUSED"})
  video.current.seek(0);
}
function onBuffering()
{
  console.log("Buffer Triggered");
  dispatch({type:"BUFFERING_PODCAST",payload:true})
}

function handlePlayPause() {
  // If playing, pause and show controls immediately.
  // if (!paused) {
  //   dispatch({type:"TOGGLE_PLAY_PAUSED"})
  //   return;
  // }
}

function parentSlideDown(){
  //removeHeart(1);
  setHearts([]);
  props.slideDown();
  
}




async function removeFromBookmarks() {

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

  dispatch({type:"REMOVE_FROM_PODCASTS_BOOKMARKED",payload:props.podcast.podcastID});

}





async function addToBookmarks() {
   const picturesArray = [];
   picturesArray.push(props.podcast.podcastPictures[0]);

  firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('bookmarks').add({
    bookmarkedOn : moment().format(),
    bookName : props.podcast.bookName,
    bookID : props.podcast.bookID,  
    chapterID : props.podcast.chapterID,
    chapterName : props.podcast.chapterName,
    podcastID : props.podcast.podcastID, 
    podcastName : props.podcast.podcastName,
    podcastPictures : picturesArray,
    podcasterName : props.podcast.podcasterName,
    podcasterID : props.podcast.podcasterID,
    createdOn : props.podcast.createdOn,
    isChapterPodcast : props.podcast.isChapterPodcast,
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

  dispatch({type:"ADD_TO_PODCASTS_BOOKMARKED",payload:props.podcast.podcastID});

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


function pausePodcast()
{
  const totalListeningTime = moment(sessionStartListeningTime).fromNow();
  console.log("Listening time from last interval: ",totalListeningTime);
  dispatch({type:"SET_SESSION_START_LISTENING_TIME",payload:0});
  dispatch({type:"TOGGLE_PLAY_PAUSED"});
}

function playPodcast()
{
  dispatch({type:"TOGGLE_PLAY_PAUSED"}); 
}



async function updatePodcastsLiked(props){

  //setLikedState(true);
  dispatch({type:'ADD_TO_PODCASTS_LIKED',payload:props.podcast.podcastID})
  const numUsers = props.podcast.numUsersLiked + 1;

  dispatch({type:'SET_NUM_LIKES',payload:numUsers})

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
      isChapterPodcast: props.podcast.isChapterPodcast 
    });
  }
  catch (e) 
  {
    console.log(e);
  }
} 

    return (
      
        <View style={styles.content}>
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
                       
        <Text style={[styles.textDark, {paddingTop:10,fontSize: 24,fontFamily:'Proxima-Nova-Bold' }]}>
          {podcastName}{"    "}
          </Text>
    
                    </View>
                    <View style={{ marginTop: 2}}>
                      <TouchableOpacity onPress={() => {
                        parentSlideDown();
                        retrieveUserPrivateDoc();
                        }}>
                    <Text style={[styles.text, { fontFamily:'Proxima-Nova-Bold',fontSize: 18, marginTop: 2}]}>{props.podcast.podcasterName}</Text>
                    </TouchableOpacity>
                    </View>

              <View style={{height:height/5,paddingTop:10}}>
                { podcastDescription.length != 0 &&
                  <TouchableNativeFeedback style={{height:height/6}} useForeground={true} onPress={()=>{
                  //dispatch({type:"TOGGLE_MINI_PLAYER"})
                  parentSlideDown()
                  props.navigation.navigate('InfoScreen', {podcast:props.podcast})
                  }}>
                      <Text style={{fontFamily:'Proxima-Nova-Regular',color:'white'}}>{podcastDescription.slice(0,300)}</Text>
                      <Text style={[styles.text,{fontFamily:'Proxima-Nova-Regular'}]}>{podcastDescription.length > 300 && "...Read More"}</Text>
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
    <TouchableOpacity style={styles.rateButton} onPress={(()=>dispatch({type:"SET_RATE",payload: rate+0.25}))}><Text style={{color:'white', fontSize:12, alignItems: 'center'}}>x{rate}</Text></TouchableOpacity>
              
            </View>


            
         
 
          <View style={{paddingTop:height/30,paddingBottom:height/20}}> 
          <ProgressBar
                position = {position}
                duration={props.podcast.duration}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
                loadingPodcast={loadingPodcast}
              />
          
         </View>
         <View style={{paddingBottom:navBarHeight + 20,flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:height/40}}>

           

         <TouchableOpacity onPress={() => {
                addHearts();
                if(liked != true)
                {
                  handleOnPressLike();
                  updatePodcastsLiked(props);  
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
            
            {
              hearts.length != 0 &&
              hearts.map(
                heart => {
                  console.log("heart.id: ",heart.id);
                  return <HeartContainer item={heart.id} style={{ right : heart.paddingRight}} onComplete={() => {removeHeart(heart.id)}}/>;
                }
              )
            }
            </View>

                <View style={{paddingLeft:width/4}}>
                <TouchableOpacity onPress={() => {
                  //onShare();
                  buildDynamicURL();
                }}>
                
                <Icon name="share" size={20} style={{color:'white',height:30,width:30}}/>
                </TouchableOpacity>
                </View>
              </View>
        </View>
      
    );
  }


  
// PODCAST CONTENT ENDS
//---------------------------------------------------------------


const areEqual = (prevProps, nextProps) => {
  //console.log("prevProps: ",prevProps);
  //console.log("nextProps: ",nextProps);
  return (prevProps.item == nextProps.item);
};

const HeartContainer = React.memo((props)=> {
  const [position] = useState(new Animated.Value(0));
   var [yAnimation,setYAnimation] = useState(new Animated.Value(0));
  var [opacityAnimation,setOpacityAnimation] = useState(new Animated.Value(1));
  useEffect(() => {
    //   position.interpolate({
    //   inputRange : [negativeEndY, 0],
    //   outputRange : [animationEndY,0]
    // });
    
    // setOpacityAnimation(position.interpolate({
    //   inputRange : [0, animationEndY],
    //   outputRange : [1,0]
    // }));
    Animated.timing(position, {
      duration : 2000,
      toValue : negativeEndY,
      easing : Easing.ease,
      useNativeDriver : true
    }).start(props.onComplete);
  },[])

  // useEffect(()=> {
  //   setYAnimation(position.interpolate({
  //     inputRange : [negativeEndY, 0],
  //     outputRange : [animationEndY,0]
  //   }));
  // },[position])


  // useEffect(() => {
  //   setOpacityAnimation(yAnimation.interpolate({
  //     inputRange : [0, animationEndY],
  //     outputRange : [1,0]
  //   }))
  // },[yAnimation])

   

        

  function getHeartStyle() {
    return {
      transform: [{ translateY : position}],
      opacity: 0.8
    };
  }

  console.log("[HeartContainer] props.key: ",props.item);
  return (
    <Animated.View style={[styles.heartContainer,getHeartStyle(), props.style]}>
      <Heart color="red"/>
    </Animated.View>
  );
},areEqual)

///////////////////////////////////

const Heart = props => {

  return(
  <View {...props} style={[styles.heart,props.style]}>
  <IconAntDesign name="heart" size={48} color={props.color}/>
</View>
  )
}

//-----><><><------
  
const styles = StyleSheet.create({
  content: {
    padding: 8,
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
},
  heartContainer: {
    position : 'absolute',
    bottom : 30,
    backgroundColor : "transparent"
  },
  heart: {
    width : 50,
    height : 50,
    alignItems : "center",
    justifyContent : "center",
    backgroundColor: "transparent"  
  }
});

export default PodcastContent;