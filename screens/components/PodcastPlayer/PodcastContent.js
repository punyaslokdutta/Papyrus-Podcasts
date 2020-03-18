// @flow
import  React, {useState,useEffect,useRef} from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView,TouchableOpacity, TouchableWithoutFeedback,Dimensions, 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Moment from "moment";
import HomeScreen from '../../HomeScreen'
import Explore from '../../Explore'
import {useSelector, useDispatch} from "react-redux"
import Video from 'react-native-video';
import ProgressBar from './ProgressBar'
import InfoScreen from '../../../InfoScreen'
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';

//import videos, { type Video } from './videos';


const { width,height } = Dimensions.get('window');
/*type VideoContentProps = 
  video: Video,
};*/

 const PodcastContent=(props)=> {
  const video = useRef();
  const userID = props.userID;
  

  const userItem = useSelector(state=>state.userReducer.userItem)

  const isHomeScreen = useSelector(state=>state.rootReducer.isHomeScreen)
  //const 
  const rate=useSelector(state=>state.rootReducer.rate);
  const currentTime=useSelector(state=>state.rootReducer.currentTime)
  //const isBuffering=useSelector(state=>state.rootReducer.isBuffering);
  const paused=useSelector(state=>state.rootReducer.paused);
  const volume=useSelector(state=>state.rootReducer.volume);
  const liked = useSelector(state=>state.userReducer.isPodcastLiked[props.podcast.PodcastID]);
  const userDisplayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
  const name = useSelector(state=>state.userReducer.name);
  //const duration=useSelector(state=>state.rootReducer.duration)
  const dispatch=useDispatch();
  
  //const video = React.createRef();

//   useEffect(
//     () => {
//      setLikedState(true);
//    }, [liked]
//  )

  function skipForward() {
    video.current.seek(currentTime + 15);
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime + 15})
  }
  function skipBackward() {
    video.current.seek(currentTime - 15);
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime -15})
    
  }

  function onLoadEnd(data) {
    dispatch({type:"SET_DURATION", payload: props.podcast.Duration})
    dispatch({type:"RESET_TO_INITIAL"})
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

async function updatePodcastsLiked(props){

  //setLikedState(true);
  dispatch({type:'ADD_TO_PODCASTS_LIKED',payload:props.podcast.PodcastID})
  const numUsers = props.podcast.numUsersLiked + 1;

  dispatch({type:'SET_NUM_LIKES',payload:numUsers})

  const likedPodcasts = await firestore().collection('users').doc(userID).set({
        podcastsLiked : firestore.FieldValue.arrayUnion(props.podcast.PodcastID)
  },{merge:true})
  
  console.log("[PodcastContent] In function updatePodcastsLiked, numUsers = ",numUsers);

  const numlikedUsers = await firestore().collection('Books').doc(props.podcast.BookID).collection('Podcasts').doc(props.podcast.PodcastID)
                                  .set({
    numUsersLiked : numUsers
  },{merge:true})


  console.log("props.podcast = ",props.podcast);

  const instance = firebase.app().functions("asia-northeast1").httpsCallable('addActivity');
  try 
  {          
    await instance({ // change in podcast docs created by  user
      userItem : userItem,
      podcast : props.podcast,
      timestamp : Date.now(),
      photoURL : userDisplayPictureURL,
      PodcastID : props.podcast.PodcastID,
      userID : props.podcast.podcasterID,
      podcastImageURL : props.podcast.Podcast_Pictures[0],
      type : "like",
      Name : name,
      podcastName : props.podcast.Podcast_Name 
    });
  }
  catch (e) 
  {
    console.log(e);
  }
  
  if(isHomeScreen)
  {
    await firestore().collection('users').doc(userID).collection('privateUserData')
                .doc('privateData').collection('podcastRecommendations')
                .doc(props.podcast.podcastID).set({
                  numUsersLiked : numUsers
                },{merge:true})
  }
} 

    return (
      
        <ScrollView style={styles.content}>
        <View style={{ alignItems: "center"}}>
        <View style={{ alignItems: "center", marginTop: 8}}>
        <Text style={[styles.textDark, { fontSize: 16, fontWeight: "500" }]}>{props.podcast.Podcast_Name}</Text>
    
                    </View>
                    <View style={{ alignItems: "center", marginTop: 2}}>
                    <Text style={[styles.text, { fontSize: 15, marginTop: 2}]}>{props.podcast.podcasterName}</Text>
                    </View>
                    
              {/* <View>
                <TouchableOpacity onPress={NavigationService.navigate('Explore')}>
                  <Text style={{color:'white'}}>qqqqqqqqqqqqqqqq</Text>
                  </TouchableOpacity>
                </View> */}

        <View  style={{paddingLeft:10}}>
        </View>
        </View>
        

         <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
                    <TouchableOpacity  onPress={skipBackward}>
                    <Icon name="undo"  size={28} label="10" color="white" />
                    </TouchableOpacity>
                    {!paused && <TouchableOpacity style={styles.playButtonContainer}  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
                   <Icon name="pause"  size={24} label="10" color="black"  style={[styles.playButton, { marginLeft: 2 }]}/>
                   </TouchableOpacity>}
                   {paused && <TouchableOpacity style={styles.playButtonContainer}  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
                   <Icon name="play"  size={28} label="10" color="black"  style={[styles.playButton, { marginLeft: 6 }]}/>
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
             source={{ uri: props.podcast.AudioFileLink }} 
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
         
 
          <View> 
          <ProgressBar
                duration={props.podcast.Duration}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
          
         </View>
         <View style={styles.icons}>
         <TouchableOpacity onPress={() => {
                if(liked != true)
                updatePodcastsLiked(props);
         }}>

               {
               liked ? 
                 <Icon name="heart" size={20} style={{color:'rgb(218,165,32)'} }/> :
                 <Icon name="heart" size={20} style={{color:'white'} }/> 
               }
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                   //dispatch({type:"TOGGLE_MINI_PLAYER"})
                   parentSlideDown()
                   props.navigation.navigate('InfoScreen', {podcast:props.podcast})
                }}>
                <Icon name="info-circle" size={24} style={{color:'white'}}/>
                </TouchableOpacity>
                <TouchableOpacity >
                <Icon name="bookmark-o" size={20} style={{color:'white'}}/>
                </TouchableOpacity>
                <TouchableOpacity>
                <Icon name="share" size={20} style={{color:'white'}}/>
                </TouchableOpacity>
              </View>

              

        </ScrollView>
      
    );
  }

  
const styles = StyleSheet.create({
  content: {
    padding: 16,
    backgroundColor:'black',
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
    justifyContent: 'space-between',
    //paddingRight:30,
    paddingTop:height/30,
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
    borderRadius:3, 
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