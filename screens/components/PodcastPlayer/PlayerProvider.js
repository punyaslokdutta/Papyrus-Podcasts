// @flow
import React, {Component, useState, createContext, useReducer} from 'react';
import {
  View, StyleSheet, Dimensions, StatusBar, Platform,
} from 'react-native';
//import { DangerZone } from 'expo';
import PodcastPlayer from '../../PodcastPlayer'; //instead of Video Modal 
import podcasts from './podcasts';
import Animated, { Easing } from 'react-native-reanimated';
import PlayerContext from './PlayerContext';
import PlayerReducer from './PlayerReducer'
import {SET_PODCAST} from './actionTypes'
const { height } = Dimensions.get('window');
//const { Animated, Easing } = DangerZone;
const { Value, timing } = Animated;
const isOS = Platform.OS === 'ios';

/*type PlayerProviderProps = {
  children: React.Node,
};

type PlayerProviderState = {
  video: Video | null,
};*/


const defaultState = {
  podcast: {}, 
  eventSource:null
};


//StateContext is for Global Player State
//DispatchContext is for functions that can mutate the global state
//const StateContext = React.createContext();
//const DispatchContext = React.createContext();
//HOC
const PlayerProvider=({children})=>{
  //const [state, dispatch] = useState({ ...defaultState });
  //const {podcast} =state

  const initialState ={
    podcast: null, 
    isPlaying : false, 
    isBuffering: false
  }
  const [state, dispatch]= useReducer(PlayerReducer,initialState )
  const {podcast} =state
  {console.log("Inside Player Provider ")}
  {console.log(state)}
//Global setPodcastFunction which all the components below can use 


function togglePodcast(podcast)  {
    //const {podcast} =playerGlobalState;
    animation = new Value(0);

    timing(
      animation,
      {
        toValue: podcast ? 1 : 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      },
    ).start();
  };

  const setPodcast =(podcast)=>
  {
    dispatch(
      {
        type: SET_PODCAST, 
        payload: podcast
      }
    )
    togglePodcast(podcast)

  }
  animation = new Value(0);

  

  
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
    });
    return (
      <PlayerContext.Provider value={{podcast:podcast, setPodcast}}>
      
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={StyleSheet.absoluteFill}>
            {children}
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
