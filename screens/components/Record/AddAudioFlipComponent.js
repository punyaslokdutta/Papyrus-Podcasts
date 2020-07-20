import React, { useState, useRef, useEffect, useCallback,createRef} from 'react';
import {Platform} from 'react-native';
import { TouchableOpacity,StyleSheet,Animated, Text,TextInput, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { renderers } from 'react-native-popup-menu';
import {request, PERMISSIONS,RESULTS} from 'react-native-permissions';
//import flipRecorderJSON from '../../../assets/animations/flipRecorder.json';
import Slider from '@react-native-community/slider';

const path = Platform.select({
    ios: 'hello.m4a',
    android: 'sdcard/hello.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
  });

const { width, height } = Dimensions.get('window');

const defaultURI = "file:///sdcard/sound.mp4";


//const uri = await audioRecorderPlayer.startRecord(path);
class AddAudioFlipComponent extends React.Component {

  constructor(props)
  {
    super(props)
    {
    this.state={
        isRecording:false,
        showRecorder:true,
        playerStarted:false,
        paused:true,
        recordSecs:0, 
        recordTime:0,
        currentPositionSec:0,
        currentDurationSec:0,
        playTime:0,
        duration :0,
        timeRemaining : 140 // 140-sec Podcast
      }
    }
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }  

    handleOnSlide = async(time) => {
      console.log("slide time:",time);
      await this.audioRecorderPlayer.seekToPlayer(time/1000)
      //this.setState({ currentPositionSec : time });
      //onSeek({seekTime: time});
    }

    onStartRecord = async () => {
      const permissionResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      
        if (permissionResult === RESULTS.GRANTED) {
          console.log('You can use the storage');
          const startRecordingResult = await this.audioRecorderPlayer.startRecorder();
          this.setState({ isRecording : true,recordSecs : 0,recordTime : 0 });
          this.audioRecorderPlayer.addRecordBackListener((e) => {
            console.log("DURATION : ",this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
            console.log("DURATION(in sec) : ",e.current_position);
            
            this.setState({
              timeRemaining : 140 - Math.floor(e.current_position/1000),
              recordSecs : e.current_position,
              recordTime : this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
            })

            if(this.state.timeRemaining == 0)
            {
              this.onStopRecord();
            }
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
          isRecording:false,
          showRecorder:false,
          playTime: this.audioRecorderPlayer.mmssss(Math.floor(0)),
          duration: this.audioRecorderPlayer.mmssss(Math.floor(this.state.recordSecs)),
          recordSecs : 0
        })
        
        //setRecordSecs(0);
        console.log(result);
      };
       
      onStartPlay = async () => {
        console.log('onStartPlay');
        const msg = await this.audioRecorderPlayer.startPlayer();
        this.setState({ paused:false });
        console.log(msg);
        if(this.state.playerStarted == false)
        {
          this.setState({ playerStarted : true });
          this.audioRecorderPlayer.addPlayBackListener(async(e) => {
            console.log(e.current_position);
            if (e.current_position === e.duration) {
              console.log('finished');
              this.setState({
                paused : true,
                playTime: this.audioRecorderPlayer.mmssss(Math.floor(0)),
                duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration))
               });
              await this.audioRecorderPlayer.stopPlayer();
  
            }
  
            this.setState({
              currentPositionSec : e.current_position,
              currentDurationSec : e.duration,
              playTime : this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
              duration : this.audioRecorderPlayer.mmssss(Math.floor(e.duration))
            })
            return;
          });
        }
        
        
      };
       
      onPausePlay = async () => {
        await this.audioRecorderPlayer.pausePlayer();
        this.setState({ paused:true})

      };
       
      onStopPlay = async () => {
        console.log('onStopPlay');
        this.audioRecorderPlayer.stopPlayer();
        this.audioRecorderPlayer.removePlayBackListener();
        this.setState({ showRecorder : true,paused : true,playerStarted:false})
      };
      
      renderRecorder = () => {
        
          if(!this.state.isRecording) 
          {
            return (
                  <TouchableOpacity style={{ paddingTop :20,  alignItems:'center'}} onPress={this.onStartRecord}>
                  <FontAwesome name="microphone" color='black' size={40} />
                  </TouchableOpacity>
              ) 
          }
          else
          {
            return (
                <View style={{paddingTop :20,width:width,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                  <View style={{position:'absolute',left:width/10, top:height/12}}>
                  <Text style={{fontFamily:'Montserrat'}}>Recording...</Text>
                  </View>
                  <TouchableOpacity style={{alignItems:'center'}} onPress={this.onStopRecord}>
                  <FontAwesome name='stop' size={20}/>
                  </TouchableOpacity>
                  <View style={{position:'absolute',right:width/10, top:height/12}}>
                  <Text style={{fontFamily:'Montserrat-Bold'}}>{this.state.timeRemaining}</Text>
                  </View>
                </View>
            )
          }  
      }

      renderPlayer = () => {
        if(this.state.paused)
          return (
            <View>
            <View style={{paddingTop :20, flexDirection:'row'}}>
            <TouchableOpacity style={{alignItems:'center'}} onPress={this.onStartPlay}>
            {/* <Text style={{borderWidth : 1,borderColor : 'black'}}>PLAY</Text> */}
            <FontAwesome name='play' size={20}/>
           </TouchableOpacity>
           <View style={{width:width/2}}>
           <Slider
              value={this.state.currentPositionSec}
              minimumValue={1}
              maximumValue={this.state.currentDurationSec}
              step={0.01}
              onValueChange={(value)=>this.handleOnSlide(value)}
              //onSlidingStart={handlePlayPause}
              //onSlidingComplete={handlePlayPause}
              minimumTrackTintColor={'black'}
              maximumTrackTintColor={'black'}
              thumbTintColor={'#F44336'}
              //disabled={true}
            />
             </View>
           <TouchableOpacity onPress={() => {
            this.onStopPlay();
          }}>
          <FontAwesome name='times' size={20}/>
          </TouchableOpacity>
           </View>
           <View style={{paddingTop :20, flexDirection:'row'}}>
           <Text>{this.state.playTime} </Text>
           <View style={{width:width/4}}/>
           <Text> {this.state.duration}</Text>
           </View>
           </View>
          )
        else
          return (
          <View>
            <View style={{paddingTop :20, flexDirection:'row'}}>
          <TouchableOpacity style={{alignItems:'center'}} onPress={this.onPausePlay}>
          <FontAwesome name='pause' size={20}/>
          </TouchableOpacity>
          <View style={{width:width/2}}>
           <Slider
              value={this.state.currentPositionSec}
              minimumValue={1}
              maximumValue={this.state.currentDurationSec}
              step={0.01}
              onValueChange={(value)=>this.handleOnSlide(value)}
              //onSlidingStart={handlePlayPause}
              //onSlidingComplete={handlePlayPause}
              minimumTrackTintColor={'black'}
              maximumTrackTintColor={'black'}
              thumbTintColor={'#F44336'}
              //disabled={true}
            />
             </View>
          <TouchableOpacity onPress={() => {
            this.onStopPlay();
          }}>
          <FontAwesome name='times' size={20}/>
          </TouchableOpacity>
          </View>
          <View style={{paddingTop :20, flexDirection:'row'}}>
           <Text>{this.state.playTime} </Text>
           <View style={{width:width/4}}/>
           <Text> {this.state.duration}</Text>
           </View>
          </View>
          )
        
      }

      render() {
        return(
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
   
          {
            this.state.showRecorder && this.renderRecorder()
          }
          {
            !this.state.showRecorder && this.renderPlayer()
          }

        {/* <View><Text style={{paddingTop:20}}>{this.state.recordSecs}</Text></View> */}
    
        </View>
        )
      }
    
}

 





export default AddAudioFlipComponent;