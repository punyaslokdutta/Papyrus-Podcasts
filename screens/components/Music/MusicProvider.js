// @flow
import React, {Component, useState, createContext, useReducer, useCallback, useEffect} from 'react';
import {withFirebaseHOC} from '../../config/Firebase';
import {View, StyleSheet, Dimensions, StatusBar, Platform} from 'react-native';
//import { DangerZone } from 'expo';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import MusicPlayer from './MusicPlayer'; //instead of Video Modal 
import Animated, { Easing } from 'react-native-reanimated';
import MusicContext from './MusicContext';
import {useSelector, useDispatch} from "react-redux"
const { height } = Dimensions.get('window');
const { Value, timing } = Animated;
const isOS = Platform.OS === 'ios';


const MusicProvider=(props)=>{

  const dispatch = useDispatch();
  const playbackState = usePlaybackState();
  const music=useSelector(state=>state.musicReducer.music)
  const navigation=useSelector(state=>state.userReducer.navigation)
  const userID = props.firebase._getUid();
  console.log("Inside MusicProvider\n\n",props,navigation,userID);

  animation = new Value(0);

    const translateY = animation.interpolate({
      inputRange: [0, height],
      outputRange: [0, height],
    });

    useEffect(() => {
      // Have to trigger this only when currentTrackID = music.podcastID
      //const currentTrackID = await TrackPlayer.getCurrentTrack();
      if(playbackState == TrackPlayer.STATE_PLAYING){
        dispatch({ type:"SET_MUSIC_PAUSED",payload:false});
      }
      else if(playbackState == TrackPlayer.STATE_PAUSED){
        dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
      }
      else if(playbackState == TrackPlayer.STATE_STOPPED){
        //TrackPlayer.seekTo(0);
        dispatch({type:"SET_MUSIC_PAUSED", payload:true});
        //TrackPlayer.pause();
      }
    },[playbackState])

    return (
      <MusicContext.Provider value={music }>
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
                  music && <MusicPlayer/>
                }
              </Animated.View>
            )
          }
          {
            
            !isOS && music && <MusicPlayer/>
           
          
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
