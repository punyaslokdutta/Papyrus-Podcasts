
import React, { useState, useContext, useReducer, useEffect} from 'react';
import {BackHandler} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import ExtraDimensions from 'react-native-extra-dimensions-android';

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


// const { width,height } = Dimensions.get('window');
const height =ExtraDimensions.getRealWindowHeight();
const width=ExtraDimensions.getRealWindowWidth();
export const PLACEHOLDER_WIDTH = width / 4;

const areEqual = (prevProps, nextProps) => true;
 const PlayerControls = (props) => {

  console.log( props);
  
  const dispatch=useDispatch();
  const paused=useSelector(state=>state.rootReducer.paused);
  const { position } = useTrackPlayerProgress()

  const duration=useSelector(state=>state.rootReducer.duration);
  const loadingPodcast = useSelector(state=>state.rootReducer.loadingPodcast)

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
    
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={styles.container}>
          <View style={{width:width*3/12,height:height/15,borderColor:'red',borderWidth:0,height:height/15}}>
            </View>
        <View style={{flexDirection:'column',width:width*3/4,borderColor:'red',borderWidth:0,height:height/15}}>
          <View style={{flexDirection:'row',alignItems:'center',height:height/15 - 5,width:width*3/4,borderColor:'yellow',borderWidth:0}}>
          <View style={{width:width*7/12}}>
          <TextMarquee podcastName={props.podcastName} bookName={props.bookName}/>
          </View>
          <View style={{width:width*2/12,flexDirection:'row'}}>
            {loadingPodcast && <ActivityIndicator style={styles.icon} color={'white'}/>}
            {!loadingPodcast && paused && <TouchableOpacity  onPress={(()=>{
              dispatch({type:"TOGGLE_PLAY_PAUSED"})
              togglePlay()
              })}>
              <IconAntDesign name="play" size={20} style={styles.icon}/></TouchableOpacity>}
            {!loadingPodcast && !paused && <TouchableOpacity  onPress={(()=>{
              dispatch({type:"TOGGLE_PLAY_PAUSED"})
              togglePlay()
              })}>
              <IconAntDesign name="pause" size={50} style={styles.icon}/></TouchableOpacity>}
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
          </View>
          <View style={{alignItems:'center',width:width*9/12,borderColor:'yellow',borderWidth:0.0}}>
          <Slider
          style={{height:5,width:width*9/12,padding:0,marginLeft:0.5}}
        value={position}
        minimumValue={1}
        maximumValue={duration===undefined?600:duration}
        step={0.0001}
        //onValueChange={(value)=>handleOnSlide(value)}
        //onSlidingStart={handlePlayPause}
        //onSlidingComplete={handlePlayPause}
        minimumTrackTintColor={'#F44336'}
        maximumTrackTintColor={'white'}
        thumbTintColor={'transparent'}
       />
            </View>
          </View>
          
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
    height:height/15 * 1,
    borderWidth:0,
    backgroundColor:'#212121',
    borderColor:'white'
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
    fontSize: 20,
    color: 'white',
    padding: 7,
    
  },
});

export default PlayerControls