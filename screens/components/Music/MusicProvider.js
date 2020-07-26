// @flow
import React, {Component, useState, createContext, useReducer, useCallback, useEffect} from 'react';
import {withFirebaseHOC} from '../../config/Firebase';
import {View, StyleSheet, Dimensions, StatusBar, Platform} from 'react-native';
//import { DangerZone } from 'expo';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import MusicPlayer from './MusicPlayer'; //instead of Video Modal 
import Animated, { Easing } from 'react-native-reanimated';
import MusicContext from './MusicContext';
import {useSelector, useDispatch} from "react-redux";
import Toast from 'react-native-simple-toast';

const { height } = Dimensions.get('window');
const { Value, timing } = Animated;
const isOS = Platform.OS === 'ios';


const MusicProvider=(props)=>{

  const dispatch = useDispatch();

  const flipID = useSelector(state=>state.flipReducer.currentFlipID);
  const podcastRedux = useSelector(state=>state.rootReducer.podcast);
  const { position } = useTrackPlayerProgress()
  const playbackState = usePlaybackState();
  const musicRedux=useSelector(state=>state.musicReducer.music)
  const allMusicRedux=useSelector(state=>state.musicReducer.allMusic);
  const currentMusicIndexRedux = useSelector(state=>state.musicReducer.currentMusicIndex);
  const navigation=useSelector(state=>state.userReducer.navigation)
  const userID = props.firebase._getUid();
  const isMusicEnabled = useSelector(state=>state.userReducer.isMusicEnabled);

  console.log("Inside MusicProvider\n\n",props,navigation,userID);

  animation = new Value(0);

    const translateY = animation.interpolate({
      inputRange: [0, height],
      outputRange: [0, height],
    });

    useEffect(() => {
      if(isMusicEnabled == false && musicRedux !== null)
      {
        if(podcastRedux === null && flipID === null )
          TrackPlayer.destroy();
        dispatch({type:"SET_MUSIC",payload:null});
      }
      else if(isMusicEnabled == true)
      {
        
        dispatch({type:"SET_MUSIC",payload:allMusicRedux[currentMusicIndexRedux]})
      }
    },[isMusicEnabled])

    useEffect(() => {
      // Have to trigger this only when currentTrackID = music.podcastID
      //const currentTrackID = await TrackPlayer.getCurrentTrack();
      updateMusicPlayerState(playbackState);
    },[playbackState])

    useEffect(() => {
      console.log("position: ",position);
      
      if(!podcastRedux && !flipID && musicRedux!==null && musicRedux !== undefined && (position >= musicRedux.duration - 1))
      {
        console.log("duration: ",musicRedux.duration);
        playnextTrack();
      }
    },[position])

    async function updateMusicPlayerState() {

      const currentTrackID = await TrackPlayer.getCurrentTrack();
      if(musicRedux!=null && currentTrackID == musicRedux.podcastID)
      {
        if(playbackState == TrackPlayer.STATE_PLAYING){
          dispatch({ type:"SET_MUSIC_PAUSED",payload:false});
        }
        else if(playbackState == TrackPlayer.STATE_PAUSED){
          console.log("[PAUSED]END")
          dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
        }
        else if(playbackState == TrackPlayer.STATE_STOPPED){
          //TrackPlayer.seekTo(0);
          console.log("[STOPPED]END")
          //dispatch({type:"SET_MUSIC_PAUSED", payload:true});
          
          //TrackPlayer.pause();
        }
      }
    }

    async function setup (nextMusic) {
      await TrackPlayer.setupPlayer({});
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          //TrackPlayer.CAPABILITY_STOP
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
        ],
        alwaysPauseOnInterruption: true,
         notificationCapabilities: [
           TrackPlayer.CAPABILITY_PLAY,
           TrackPlayer.CAPABILITY_PAUSE,
           //TrackPlayer.CAPABILITY_STOP
         ]
      });
      
      await TrackPlayer.add({
        id: nextMusic.podcastID,
        url: nextMusic.audioFileLink,
        title: nextMusic.podcastName,
        artist: "",
        artwork: nextMusic.podcastPictures[0],
        duration: nextMusic.duration
      });
      
    }


    function playnextTrack()
    {
      console.log("[playNextTrack] IN")
      dispatch({type: "SET_MUSIC",payload:allMusicRedux[currentMusicIndexRedux]});
      TrackPlayer.destroy();
              //this.props.dispatch({type:"SET_FLIP_ID",payload:null});
      setup(allMusicRedux[currentMusicIndexRedux]);
      TrackPlayer.play();
              
      Toast.show(allMusicRedux[currentMusicIndexRedux].podcastName);
      const musicCount = allMusicRedux.length;
      dispatch({type:"SET_CURRENT_MUSIC_INDEX",payload:(currentMusicIndexRedux + 1)%musicCount});
      console.log("[playNextTrack] OUT");
    }

    return (
      <MusicContext.Provider value={musicRedux }>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={StyleSheet.absoluteFill}>
            {props.children}
          </View>
          {
            isOS && (
              <Animated.View
                style={{ transform: [{ translateY }] }}
              >
                {
                  isMusicEnabled && musicRedux && <MusicPlayer/>
                }
              </Animated.View>
            )
          }
          {
            
            !isOS && isMusicEnabled && musicRedux && <MusicPlayer/>
           
          
          }
        </View>
           
      </MusicContext.Provider>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default withFirebaseHOC(MusicProvider);
