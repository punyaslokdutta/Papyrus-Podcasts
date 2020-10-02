import React, { useState, useEffect,useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Button, SafeAreaView, 
  Dimensions, Image, TextInput, Platform, KeyboardAvoidingView, ScrollView, 
  ActivityIndicator,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import ImagePicker from 'react-native-image-picker'
import OpenSettings from 'react-native-open-settings';
import ExtraDimensions from 'react-native-extra-dimensions-android';

import { Block, Text } from '../categories/components/';

import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import storage, {firebase, FirebaseStorageTypes } from '@react-native-firebase/storage'
//import firebase from '@react-native-firebase/app';
//import {anthology} from '../../../assets/images'
//const { width, height } = Dimensions.get('window');

const height =ExtraDimensions.getRealWindowHeight();
const width=ExtraDimensions.getRealWindowWidth();

import { theme, mocks } from '../categories/constants/'
import { withFirebaseHOC } from '../../config/Firebase'
import firestore from '@react-native-firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';
import { Item } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
//const sharp = require("sharp");


const options = {
  title: 'Change Profile Picture',
  chooseFromLibraryButtonTitle: 'Select from Library'
};
const VideoItem = (props) => {

  const [scrollPosition,setScrollPosition] = useState(0);
  const [paused,setPaused] = useState(true);
  // const inVideoScreen = useSelector(state=>state.rootReducer.inVideoScreen);


  //   useEffect(() => {
  //       inVideoScreen == false && setPaused(true) 
  //   },[inVideoScreen])

    useEffect(() => {
        console.log("props.index",props.index);
        console.log("props.scrollPosition",props.scrollPosition)
        const currIndex = props.scrollPosition/props.layoutHeight;
        if(currIndex == props.index && paused == true)
            setPaused(false);
        else if(currIndex == props.index && paused == false)
            setPaused(true);
        else
            setPaused(true);

    },[props.scrollPosition])



  return (
    <View style={{height:height,width:width,borderWidth:0,borderColor:'white'}}>
        <VideoPlayer
        paused={paused}
        //videoStyle={{height:height*7/10,width:width}}
        //style={{alignItems:'center',justifyContent:'center'}}
        source={{uri: props.item.recordedVideoURL}}
        disableVolume={true}
        disableBack={true}
        controlTimeout={3000}
        tapAnywhereToPause={true}
        resizeMode='cover'
    />
    </View>
  );
}

export default withFirebaseHOC(VideoItem);

const styles = StyleSheet.create({
  AppHeader:
  {
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    //justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  buttonStyle: {
    padding: 10,
    backgroundColor: '#202646',
    borderRadius: 5
  },
  textStyle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center'
  },
  TextInputStyleClass: {

    //textAlign: 'center',
    fontFamily: 'san-serif-light',
    fontStyle: 'italic',
    color: 'black',
    height: height / 6,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    height: height / 6,
    width: (width * 3) / 4,
    paddingLeft: 10,
    paddingRight: 10

  },
  TextInputStyleClass2: {

    //textAlign: 'center',
    fontFamily: 'san-serif-light',
    fontStyle: 'italic',
    color: 'black',
    borderWidth: 2,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    width: (width * 3) / 4,
    paddingLeft: 10,
    height: height / 18,
    paddingRight: 10,

  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  }
});