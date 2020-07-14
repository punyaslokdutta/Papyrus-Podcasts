import React, { useState, useRef, useEffect, useCallback,createRef} from 'react';
import {Platform} from 'react-native';
import { TouchableOpacity,StyleSheet,Animated, Text,TextInput, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { renderers } from 'react-native-popup-menu';
import {request, PERMISSIONS,RESULTS} from 'react-native-permissions';

 
const path = Platform.select({
    ios: 'hello.m4a',
    android: 'sdcard/hello.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
  });

const defaultURI = "file:///sdcard/sound.mp4";


//const uri = await audioRecorderPlayer.startRecord(path);
class AddAudioFlipComponent extends React.Component {

  constructor(props)
  {
    super(props)
    {
    this.state={
        isRecording:true,
        paused:true,
        recordSecs:0, 
        recordTime:0,
        currentPositionSec:0,
        currentDurationSec:0,
        playTime:0,
        duration :0
      }
    }
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1

  }  


    // const [recordSecs, setRecordSecs]=useState(0);
    // const [recordTime, setRecordTime]=useState(0);
    // const [currentPositionSec, setCurrentPositionSec]=useState(0);
    // const [currentDurationSec, setCurrentDurationSec]=useState(0);
    // const [playTime, setPlaytime]=useState(0);
    // const [duration, setDuration]=useState(0);


    onStartRecord = async () => {
      const permissionResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      
        if (permissionResult === RESULTS.GRANTED) {
          console.log('You can use the storage');
          const startRecordingResult = await this.audioRecorderPlayer.startRecorder();
          this.setState({ isRecording : false,recordSecs : 0,recordTime : 0 });
          this.audioRecorderPlayer.addRecordBackListener((e) => {
            console.log("DURATION : ",this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
            this.setState({
              recordSecs : e.current_position,
              recordTime : this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
            })
            //this.setRecordSecs(e.current_position)
            //this.setRecordTime(this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
          return;
          });
          console.log(startRecordingResult);
        } 
        else {
          console.log('permission denied');
          return;
        }
      };
       
      onStopRecord = async () => {
        const result = await this.audioRecorderPlayer.stopRecorder();
        this.props.savePodcast(defaultURI,this.state.recordSecs);
        this.audioRecorderPlayer.removeRecordBackListener();
        this.setState({
          isRecording:true,
          recordSecs : 0
        })
        
        //setRecordSecs(0);
        console.log(result);
      };
       
      onStartPlay = async () => {
        console.log('onStartPlay');
        const msg = await this.audioRecorderPlayer.startPlayer();
        this.setState({ paused:false})
        console.log(msg);
        this.audioRecorderPlayer.addPlayBackListener((e) => {
          if (e.current_position === e.duration) {
            console.log('finished');
            this.audioRecorderPlayer.stopPlayer();
          }

          this.setState({
            currentPositionSec : e.current_position,
            currentDurationSec : e.duration,
            playTime : this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
            duration : this.audioRecorderPlayer.mmssss(Math.floor(e.duration))
          })
          // setCurrentPositionSec(e.current_position);
          // setCurrentDurationSec(e.duration);
          // setPlaytime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
          // setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
          return;
        });
      };
       
      onPausePlay = async () => {
        await this.audioRecorderPlayer.pausePlayer();
        this.setState({ paused:true})

      };
       
      onStopPlay = async () => {
        console.log('onStopPlay');
        this.audioRecorderPlayer.stopPlayer();
        this.audioRecorderPlayer.removePlayBackListener();
      };
      
      render() {
        return(
          <View style={{flexDirection:'row'}}>
   
          {
            this.state.isRecording 
            ?
            <TouchableOpacity style={{paddingLeft:130, paddingRight :30, paddingTop :20,  alignItems:'center'}} onPress={this.onStartRecord}>
              <Text style={{borderWidth : 1,borderColor : 'black'}}>RECORD</Text>
             </TouchableOpacity>
             :
             <TouchableOpacity style={{paddingLeft:130, paddingRight :30, paddingTop :20,  alignItems:'center'}} onPress={this.onStopRecord}>
              <Text style={{borderWidth : 1,borderColor : 'black'}}>STOP</Text>
             </TouchableOpacity>

          }
          {
            this.state.paused 
            ?
            <TouchableOpacity style={{paddingLeft:130, paddingRight :30, paddingTop :20,  alignItems:'center'}} onPress={this.onStartPlay}>
              <Text style={{borderWidth : 1,borderColor : 'black'}}>PLAY</Text>
             </TouchableOpacity>
             :
             <TouchableOpacity style={{paddingLeft:130, paddingRight :30, paddingTop :20,  alignItems:'center'}} onPress={this.onPausePlay}>
              <Text style={{borderWidth : 1,borderColor : 'black'}}>PAUSE</Text>
             </TouchableOpacity>

          }
    
    
        <View><Text style={{paddingTop:20}}>{this.state.recordSecs}</Text></View>
    
        </View>)
      }
    
}

 





export default AddAudioFlipComponent;