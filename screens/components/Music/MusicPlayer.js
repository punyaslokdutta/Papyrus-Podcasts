// @flow
import React ,{ useState, useEffect , useRef, useCallback} from 'react';
import { StyleSheet , Image, StatusBar,BackHandler, SafeAreaView,  TouchableNativeFeedback,TouchableOpacity , View,Text, ScrollView, Alert, Dimensions } from 'react-native';
import {useSelector, useDispatch,connect} from "react-redux"
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Animated, { Easing } from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';
import EnTypo from 'react-native-vector-icons/Entypo';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';

import { PanGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window');
const height =ExtraDimensions.getRealWindowHeight();
const width=ExtraDimensions.getRealWindowWidth();
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();
//const isNotchEnabled= SCREEN_HEIGHT+
const SOFT_MENU_BAR_HEIGHT =  (ExtraDimensions.getSoftMenuBarHeight() === 0) ? 0 :ExtraDimensions.getSoftMenuBarHeight();
const minHeight = height/15;
const midBound = (height*14)/15 - (height/10 ); //upper edge of miniPlayer
const upperBound = midBound + minHeight;
const {
  Extrapolate,
  Value,
  Clock,
  block,
  call,
  cond,
  eq,
  set,
  add,
  sub,
  multiply,
  lessThan,
  clockRunning,
  startClock,
  spring,
  stopClock,
  event,
  interpolate,
  timing,
  neq,
} = Animated;


class MusicPlayer extends React.Component {

    componentDidMount = () => {
        
        if(this.props.flipID === null && this.props.podcastRedux === null)
        {
          this.setup();
          TrackPlayer.play();  
        }
        // TrackPlayer.addEventListener('remote-play', () => {
        //   this.props.dispatch({ type:"SET_MUSIC_PAUSED",payload:false});
        // });
        // TrackPlayer.addEventListener('remote-pause', () => {
        //   this.props.dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
        // });
    }

    componentDidUpdate = (prevprops) => {

    }

    setup = async() => {
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
          id: this.props.musicRedux.podcastID,
          url: this.props.musicRedux.audioFileLink,
          title: this.props.musicRedux.podcastName,
          artist: "",
          artwork: this.props.musicRedux.podcastPictures[0],
          duration: this.props.musicRedux.duration
        });
        
      }

    render() {   
        return (
            <View style={{flexDirection:'row', backgroundColor:'black',borderTopLeftRadius:20,borderBottomLeftRadius:20, height:40,width:70,position:'absolute',right:0,bottom:height/16,justifyContent:'space-evenly',alignItems:'center'}}>
            <TouchableOpacity onPress={() => {
              console.log(this.props.currentMusicIndexRedux);
              console.log(this.props.allMusicRedux[this.props.currentMusicIndexRedux])
              this.props.dispatch({type: "SET_MUSIC",payload:this.props.allMusicRedux[this.props.currentMusicIndexRedux]});
              TrackPlayer.destroy();
              this.props.dispatch({type:"SET_FLIP_ID",payload:null});
              this.setup();
              if(!this.props.musicPausedRedux)
              {
                TrackPlayer.play();
              }
              Toast.show(this.props.allMusicRedux[this.props.currentMusicIndexRedux].podcastName);
              const musicCount = this.props.allMusicRedux.length;
              this.props.dispatch({type:"SET_CURRENT_MUSIC_INDEX",payload:(this.props.currentMusicIndexRedux + 1)%musicCount});
            }}>
              <EnTypo name="shuffle" size={15} color="white"/>
              </TouchableOpacity>
            {
                this.props.musicPausedRedux 
                ?
                <TouchableOpacity onPress={async() => {
                    this.props.dispatch({ type:"SET_MUSIC_PAUSED",payload:false});
                    const currentTrackID = await TrackPlayer.getCurrentTrack();
                    if(this.props.musicRedux.podcastID !== currentTrackID)
                    {
                      this.props.dispatch({type:"SET_FLIP_ID",payload:null});
                      this.setup();
                    }
                    await TrackPlayer.play();
                }}>
                <IconAntDesign name="play" size={20} color={'white'}/>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={async() => {
                    this.props.dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
                    await TrackPlayer.pause();
                    }}>
                <IconAntDesign name="pause" size={20} color={'white'}/>
                </TouchableOpacity>
            }
                </View>
        );
        }
    
}

//export default withFirebaseHOC(MusicPlayer);
const mapStateToProps = (state) => {
  return{
    navigation: state.userReducer.navigation,
    navBarHeight: state.userReducer.navBarHeight,
    musicRedux:  state.musicReducer.music,
    musicPausedRedux: state.musicReducer.musicPaused,
    allMusicRedux: state.musicReducer.allMusic,
    currentMusicIndexRedux: state.musicReducer.currentMusicIndex,
    podcastRedux: state.rootReducer.podcast,
    flipID: state.flipReducer.currentFlipID
  }}

  const mapDispatchToProps = (dispatch) =>{
    return{
        dispatch,
    }}
export default connect(mapStateToProps,mapDispatchToProps)(MusicPlayer)

  