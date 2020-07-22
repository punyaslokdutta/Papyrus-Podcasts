// @flow
import React, {Component, useState, createContext, useReducer, useCallback, useEffect} from 'react';
import {withFirebaseHOC} from '../../config/Firebase';
import {View, StyleSheet, Dimensions, StatusBar, Platform} from 'react-native';
//import { DangerZone } from 'expo';
import MusicPlayer from './MusicPlayer'; //instead of Video Modal 
import Animated, { Easing } from 'react-native-reanimated';
import MusicContext from './MusicContext';
import {useSelector} from "react-redux"
const { height } = Dimensions.get('window');
const { Value, timing } = Animated;
const isOS = Platform.OS === 'ios';


const MusicProvider=(props)=>{

  const music=useSelector(state=>state.musicReducer.music)
  const navigation=useSelector(state=>state.userReducer.navigation)
  const userID = props.firebase._getUid();
  console.log("Inside MusicProvider\n\n",props,navigation,userID);

  animation = new Value(0);

    const translateY = animation.interpolate({
      inputRange: [0, height],
      outputRange: [0, height],
    });
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
