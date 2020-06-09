
import React, { useState, useContext, useReducer, useEffect} from 'react';
import {BackHandler} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';

import {
  View, StyleSheet, Text, Dimensions, TouchableWithoutFeedback,TouchableOpacity, ActivityIndicator
} from 'react-native';
//import { Icon } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome'
import {useDispatch, useSelector} from "react-redux"
import TextTicker from 'react-native-text-ticker'
import TextMarquee from './TextMarquee'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import firestore from '@react-native-firebase/firestore';


const { width,height } = Dimensions.get('window');
export const PLACEHOLDER_WIDTH = width / 4;

const areEqual = (prevProps, nextProps) => true;
 const PlayerControls = (props) => {

  //const [playerControlState,setplayerControlState ] =useState(props)
  //copied the props to the state of the component 
  console.log( props);
  
  //const videoRef = useSelector(state=>state.rootReducer.videoRef)

  /*useEffect(() => {
   // setplayerControlState(props);
  }, []);*/


  
const dispatch=useDispatch();
const paused=useSelector(state=>state.rootReducer.paused);
const { position } = useTrackPlayerProgress()

  const currentTime=useSelector(state=>state.rootReducer.currentTime);
  const duration=useSelector(state=>state.rootReducer.duration);
  //const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);
  const loadingPodcast = useSelector(state=>state.rootReducer.loadingPodcast)

  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (!paused) {
      dispatch({type:"TOGGLE_PLAY_PAUSED"})
      return;
    }
  }

  function onSeek(data) {
    videoRef.seek(data.seekTime);
    dispatch({type:"SET_CURRENT_TIME", payload: data.seekTime})
  }

  function handleOnSlide(time) {
    onSeek({seekTime: time});
  }

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

  async function togglePlay  ()  {
    const currentState = await TrackPlayer.getState()
    const isPlaying = (currentState === TrackPlayer.STATE_PLAYING)
    if (isPlaying) { 
      return TrackPlayer.pause()
      } 
    else {
      return TrackPlayer.play()
      }
  }
  
  async function setLastPlayingPodcastInUserPrivateDoc(podcastID)
  {
    console.log("Inside setLastPlayingPodcastInUserPrivateDoc");
    const  userID = props.userID;
    const privateUserID = "private" + userID;
    console.log("podcastID: ",podcastID);
    await firestore().collection('users').doc(userID).collection('privateUserData').
          doc(privateUserID).set({
            lastPlayingPodcastID : podcastID,
            lastPlayingCurrentTime : null
          },{merge:true}).then(function(){
            console.log("lastPlayingPodcastID set to NULL");
          })
          .catch((error) => {
            console.log("Error in setting lastPlayingPodcastID: ",error);
          })
  }

  
   //const { title, onPress } = this.props;
    return (
      
      <TouchableWithoutFeedback onPress={props.onPress} style={{borderColor:'black'}} >
        <View style={styles.container}>
        <View style={{flexDirection:'column',paddingLeft:width*5/12}}>
        
        <TextMarquee podcastName={props.podcastName} bookName={props.bookName}/>
        
      <View style={{paddingLeft:10,paddingTop:height/500}}>
        <Slider
        value={position}
        minimumValue={1}
        maximumValue={duration===undefined?600:duration}
        step={0.01}
        //onValueChange={(value)=>handleOnSlide(value)}
        //onSlidingStart={handlePlayPause}
        //onSlidingComplete={handlePlayPause}
        minimumTrackTintColor={'#F44336'}
        maximumTrackTintColor={'white'}
        thumbTintColor={'#F44336'}
      
        disabled={true}
       />
      </View>
      </View>
          {/* <Text style={styles.title} numberOfLine={3}>{props.title}</Text> */}
          {loadingPodcast && <ActivityIndicator style={styles.icon} color={'white'}/>}
          {!loadingPodcast && paused && <TouchableOpacity  onPress={(()=>{
            dispatch({type:"TOGGLE_PLAY_PAUSED"})
            togglePlay()
            })}>
            <IconAntDesign name="play" size={40} style={styles.icon}/></TouchableOpacity>}
          {!loadingPodcast && !paused && <TouchableOpacity  onPress={(()=>{
            dispatch({type:"TOGGLE_PLAY_PAUSED"})
            togglePlay()
            })}>
            <IconAntDesign name="pause" size={70} style={styles.icon}/></TouchableOpacity>}
                <TouchableOpacity onPress={(()=>{
                  setLastPlayingPodcastInUserPrivateDoc(null);
                  dispatch({type:"SET_LAST_PLAYING_CURRENT_TIME",payload:null});
                  dispatch({type:"SET_LAST_PLAYING_PODCASTID",payload:null});
                  //BackHandler.removeEventListener("hardwareBackPress",  this.props.back_Button_Press());
                  dispatch({type:"TOGGLE_PLAY_PAUSED"})
                  TrackPlayer.destroy()
                  dispatch({type:"SET_PODCAST", payload: null})
                  })}>
                <Icon name="times-circle" size={24} style={styles.icon}/>
                </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      
    );
  
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderWidth:0.25, 
    backgroundColor:'#212121'
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: 8,
  },
  placeholder: {
    width: PLACEHOLDER_WIDTH,
  },
  icon: {
    fontSize: 25,
    color: 'white',
    padding: 8,
    
  },
});

export default PlayerControls