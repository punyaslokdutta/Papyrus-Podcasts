// @flow
import  React, {useState,useEffect,useRef} from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView,TouchableOpacity, TouchableWithoutFeedback,Dimensions, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from "moment";
import HomeScreen from '../../HomeScreen'
import Explore from '../../Explore'
import {useSelector, useDispatch} from "react-redux"
import Video from 'react-native-video';
import ProgressBar from './ProgressBar'
import InfoScreen from '../../../InfoScreen'
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';
import { Button } from '../categories/components';
import Toast from 'react-native-simple-toast';

import * as Animatable from 'react-native-animatable'
import IconAntDesign from 'react-native-vector-icons/AntDesign'

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

const AnimatedIconAntDesign = Animatable.createAnimatableComponent(IconAntDesign)
const AnimatedIcon = Animatable.createAnimatableComponent(Icon)

 const PodcastContent=(props)=> {
  const video = useRef();
  var smallAnimatedHeartIcon = useRef();
  var smallAnimatedBookmarkIcon = useRef();
  const userID = props.userID;
  const privateDataID = "private" + userID;
  //const
  const rate=useSelector(state=>state.rootReducer.rate);
  const currentTime=useSelector(state=>state.rootReducer.currentTime)

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
    video.current.seek(currentTime + 15);
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime + 15})
  }
  function skipBackward() {
    video.current.seek(currentTime - 15);
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime -15})
    
  }

  function onLoadEnd(data) {
    dispatch({type:"SET_DURATION", payload: props.podcast.duration})
    dispatch({type:"RESET_TO_INITIAL"})
    dispatch({type:"SET_LOADING_PODCAST", payload:false});
  }

 function onSeek(data) {
  video.current.seek(data.seekTime);
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
  if (!paused) {
    dispatch({type:"TOGGLE_PLAY_PAUSED"})
    return;
  }
}

function parentSlideDown(){
  props.slideDown();
}


async function removeFromBookmarks() {

 firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('bookmarks')
    .where("podcastID",'==',props.podcast.podcastID).get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc) {
        doc.ref.delete().then(function() {
          //Toast.show("Unsaved");
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
    
    Toast.show("Saved to Collections");
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
        <View style={{ alignItems: "center"}}>
        <View style={{ alignItems: "center"}}>
        <TouchableOpacity style={styles.rateButton} onPress={()=>{
                  //dispatch({type:"TOGGLE_MINI_PLAYER"})
                  parentSlideDown()
                  props.navigation.navigate('InfoScreen', {podcast:props.podcast})
               }}>
                  <Text style={{color:'white', fontSize:12, alignItems: 'center'}}>
                    Read
              {/* READ ABOUT THIS PODCAST HERE */}
             </Text>

                </TouchableOpacity>
                       
        <Text style={[styles.textDark, { paddingTop:10,fontSize: 16, fontWeight: "500" }]}>{props.podcast.podcastName}</Text>
    
                    </View>
                    <View style={{ alignItems: "center", marginTop: 2}}>
                      <TouchableOpacity onPress={() => {
                        parentSlideDown();
                        retrieveUserPrivateDoc();
                        }}>
                    <Text style={[styles.text, { fontSize: 15, marginTop: 2}]}>{props.podcast.podcasterName}</Text>
                    </TouchableOpacity>
                    </View>

        <View  style={{paddingLeft:10}}>
        </View>
        </View>
        

         <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
                    <TouchableOpacity  onPress={skipBackward}>
                    <Icon name="undo"  size={28} label="10" color="white" />
                    </TouchableOpacity>
                    {loadingPodcast && <View style={styles.playButtonContainer}>
                      <ActivityIndicator size={'large'} color={'black'}/>
                      </View>}
        
                    {!loadingPodcast && !paused  && <TouchableOpacity style={styles.playButtonContainer}  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
                      
                   <IconAntDesign name="pause"  size={28} label="10" color="black"  style={[styles.playButton, { marginLeft: 0 }]}/>
                   </TouchableOpacity>}
                   {!loadingPodcast && paused && <TouchableOpacity style={styles.playButtonContainer}  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
                   <IconAntDesign name="play"  size={28} label="10" color="black"  style={[styles.playButton, { marginLeft: 0 }]}/>
                   </TouchableOpacity> }
  
                    <TouchableOpacity  onPress={skipForward}>
                    <Icon name="repeat"  size={28} label="10" color="white" />
                    </TouchableOpacity>
                </View>

            <View style={{alignItems:'center', paddingTop:8}}>
    <TouchableOpacity style={styles.rateButton} onPress={(()=>dispatch({type:"SET_RATE",payload: rate+0.25}))}><Text style={{color:'white', fontSize:12, alignItems: 'center'}}>x{rate}</Text></TouchableOpacity>
              
            </View>


            <View>
            <Video
            ref={video}
            /* For ExoPlayer */
             source={{ uri: props.podcast.audioFileLink }} 
            //source={require('../../../assets/images/testvideo.mp4')}
            style={styles.fullScreen}
            audioOnly={true}
            rate={rate}
            paused={paused}
            playInBackground={true}
            volume={volume }
            onBuffer={onBuffering}
            bufferConfig={{
            minBufferMs: 10000,
            maxBufferMs: 30000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000
            }}
           // muted={this.state.muted}
            //resizeMode={'contain'}
            onLoad={onLoadEnd}
            onProgress={(progress)=>dispatch({type:"SET_CURRENT_TIME", payload: progress.currentTime})}
            onEnd={onEnd}
           // onAudioBecomingNoisy={this.onAudioBecomingNoisy}
            //onAudioFocusChanged={this.onAudioFocusChanged}
            //repeat={false}
          />
            </View>
         
 
          <View style={{paddingTop:height/50}}> 
          <ProgressBar
                duration={props.podcast.duration}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
          
         </View>
         <View style={styles.icons}>
         <TouchableOpacity onPress={() => {
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
                //style={{}}
              />

                </TouchableOpacity>
               
                <View style={{paddingLeft:width/4}}>
                <TouchableOpacity onPress={() => handleOnPressBookmark()}>
                  <AnimatedIcon
                    ref={handleSmallAnimatedBookmarkIconRef}
                    name={bookmarked ? 'bookmark' : 'bookmark-o'}
                    color={bookmarked ? 'white' : 'white'}
                    size={20}
                  />
                </TouchableOpacity>
                </View>

                <TouchableOpacity>
                <View style={{paddingLeft:width/4}}>
                <Icon name="share" size={20} style={{color:'white'}}/>
                </View>
                </TouchableOpacity>
              </View>

              

        </View>
      
    );
  }

  
const styles = StyleSheet.create({
  content: {
    padding: 8,
    backgroundColor:'#2E2327',
    height:height*15/24
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
    borderRadius:10, 
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
  width: 80,
  height: 80,
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
}
});

export default PodcastContent;