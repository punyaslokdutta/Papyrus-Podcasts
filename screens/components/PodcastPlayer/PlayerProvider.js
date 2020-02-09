// @flow
import React, {Component, useState, createContext, useReducer, useCallback, useEffect} from 'react';
import {
  View, StyleSheet, Dimensions, StatusBar, Platform,
} from 'react-native';
//import { DangerZone } from 'expo';
import PodcastPlayer from '../../PodcastPlayer'; //instead of Video Modal 
import podcasts from './podcasts';
import Animated, { Easing } from 'react-native-reanimated';
import PlayerContext from './PlayerContext';
import setGlobalPodcastContext from './setGlobalPodcastContext'
import PlayerReducer from './PlayerReducer'
import {SET_PODCAST} from './actionTypes'
import {SET_GLOBAL_FROM_PODCAST} from './actionTypes'
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState,
  useTrackPlayerEvents
} from "react-native-track-player";
import {useSelector} from "react-redux"
const { height } = Dimensions.get('window');
//const { Animated, Easing } = DangerZone;
const { Value, timing } = Animated;
const isOS = Platform.OS === 'ios';
import store from '../../../reducers/store';


const PlayerProvider=(props)=>{

  const podcast=useSelector(state=>state.rootReducer.podcast)
  const navigation =useSelector(state=>state.userReducer.navigation)
  

  animation = new Value(0);


  

 

  // const setGlobalFromPodcast=useCallback(
  //   (podcast)=>
  //   {
  //     dispatch(
  //       {
  //         type: SET_GLOBAL_FROM_PODCAST, 
  //         payload: podcast     
  //       }
  //     )
  //     togglePodcast(podcast)
  
  //   }, [], 
  
  // )




  

  
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
    });
    return (
      <PlayerContext.Provider value={podcast }>
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
                  podcast && <PodcastPlayer {...{podcast}} />
                }
              </Animated.View>
            )
          }
          {
            
            !isOS && podcast && <PodcastPlayer {...{podcast}} />
          }
        </View>
           

       
      </PlayerContext.Provider>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export { PlayerProvider};
