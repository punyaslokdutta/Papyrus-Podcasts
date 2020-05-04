
import React, { useState, useContext, useReducer, useEffect} from 'react';
import Slider from '@react-native-community/slider';

import {
  View, StyleSheet, Text, Dimensions, TouchableWithoutFeedback,TouchableOpacity, ActivityIndicator
} from 'react-native';
//import { Icon } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome'
import {useDispatch, useSelector} from "react-redux"
import TextTicker from 'react-native-text-ticker'
import TextMarquee from './TextMarquee'
import IconAntDesign from 'react-native-vector-icons/AntDesign'

const { width,height } = Dimensions.get('window');
export const PLACEHOLDER_WIDTH = width / 4;

const areEqual = (prevProps, nextProps) => true;
 const PlayerControls = (props) => {

  //const [playerControlState,setplayerControlState ] =useState(props)
  //copied the props to the state of the component 
  console.log( props);
  
  const videoRef = useSelector(state=>state.rootReducer.videoRef)

  /*useEffect(() => {
   // setplayerControlState(props);
  }, []);*/


  
const dispatch=useDispatch();
const paused=useSelector(state=>state.rootReducer.paused);

  const currentTime=useSelector(state=>state.rootReducer.currentTime);
  const duration=useSelector(state=>state.rootReducer.duration);
  const position = getMinutesFromSeconds(currentTime);
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



  
   //const { title, onPress } = this.props;
    return (
      
      <TouchableWithoutFeedback onPress={props.onPress} style={{borderColor:'black'}} >
        <View style={styles.container}>
        <View style={{flexDirection:'column',paddingLeft:width*5/12}}>
        
        <TextMarquee podcastName={props.podcastName} bookName={props.bookName}/>
        
      <View style={{paddingTop:height/500}}>
        <Slider
        value={currentTime}
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
          {loadingPodcast && <ActivityIndicator color={'white'}/>}
          {!loadingPodcast && paused && <TouchableOpacity  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
            <IconAntDesign name="play" size={50} style={styles.icon}/></TouchableOpacity>}
          {!loadingPodcast && !paused && <TouchableOpacity  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
            <IconAntDesign name="pause" size={70} style={styles.icon}/></TouchableOpacity>}
                <TouchableOpacity onPress={(()=>{dispatch({type:"TOGGLE_PLAY_PAUSED"})
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
    backgroundColor:'#2E2327'
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
