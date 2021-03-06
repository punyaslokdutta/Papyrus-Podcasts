// @flow
import React, {Component, useState, createContext, useReducer, useCallback, useEffect} from 'react';
import {withFirebaseHOC} from '../../config/Firebase';
import {View, StyleSheet, Dimensions, StatusBar, Platform} from 'react-native';
//import { DangerZone } from 'expo';
import PodcastPlayer from '../../PodcastPlayer'; //instead of Video Modal 
import Animated, { Easing } from 'react-native-reanimated';
import PlayerContext from './PlayerContext';
import {useSelector} from "react-redux"
const { height } = Dimensions.get('window');
const { Value, timing } = Animated;
const isOS = Platform.OS === 'ios';


const PlayerProvider=(props)=>{

  const podcast=useSelector(state=>state.rootReducer.podcast)
  const navigation=useSelector(state=>state.userReducer.navigation)
  const userID = props.firebase._getUid();
  console.log("Inside PlayerProvider\n\n",props,navigation,userID);

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
      inputRange: [0, height],
      outputRange: [0, height],
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
                  podcast && <PodcastPlayer {...{userID}} {...{podcast}} {...{navigation}} />
                }
              </Animated.View>
            )
          }
          {
            
            !isOS && podcast && <PodcastPlayer {...{userID}} {...{podcast}} {...{navigation}}/>
           
          
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


export default withFirebaseHOC(PlayerProvider);
