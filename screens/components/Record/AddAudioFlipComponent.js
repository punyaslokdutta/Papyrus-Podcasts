import React, { useState, useRef, useEffect, useCallback,createRef} from 'react';
import {Platform} from 'react-native';
import { TouchableOpacity,StyleSheet,Animated, Text,TextInput, Image,View, 
SafeAreaView, Dimensions, NativeModules,NativeEventEmitter, 
ActivityIndicator,Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import Icon from 'react-native-vector-icons/FontAwesome';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { renderers } from 'react-native-popup-menu';
import RNFetchBlob from 'react-native-fetch-blob'
import {request, PERMISSIONS,RESULTS} from 'react-native-permissions';
import Slider from '@react-native-community/slider';
import {useSelector, useDispatch,connect} from "react-redux"
import OpenSettings from 'react-native-open-settings';
import Tooltip from 'react-native-walkthrough-tooltip';

import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import DocumentPicker from 'react-native-document-picker';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import RNGRP from 'react-native-get-real-path';

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
        toolTipVisible : false,
        toolTipUploadVisible : false,
        audioFromLocalStorage: false,
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
    //this.whoosh = new Sound("", Sound.MAIN_BUNDLE);
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }  

    componentDidMount = () => {
      this.props.dispatch({ type : "SET_AUDIO_RECORDER_PLAYER_REF",payload : this.audioRecorderPlayer });
      
      if(this.props.flipPreviewWalkthroughDone && this.props.audioFlipWalkthroughDone == false){
        setTimeout(() => {
          console.log("350 ms have passed");
          this.setState({ toolTipVisible : true })
        },350)
      }
    }

    componentDidUpdate = (prevprops) => {
      if(prevprops.showAudioToolTip == false && this.props.showAudioToolTip == true)
      {
        this.setState({
          toolTipVisible : true
        })
      }

      if(prevprops.flipPreviewWalkthroughDone == false && this.props.flipPreviewWalkthroughDone == true)
      {
        this.setState({ toolTipVisible:true })
      }
      // if(this.state.toolTipVisible == false && this.props.audioFlipWalkthroughDone == false)
      // {
      //   this.setState({
      //     toolTipVisible : true 
      //   })
      // }
    }

    handleOnSlide = async(time) => {
      console.log("slide time:",time);
      if(this.state.audioFromLocalStorage == false)
        await this.audioRecorderPlayer.seekToPlayer(time/1000)
      else
        this.whoosh.setCurrentTime(time);
      //this.setState({ currentPositionSec : time });
      //onSeek({seekTime: time});
    }

    getMinutesFromSeconds = (time) => {
    
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

    extractDurationAndUploadAudio = async(filePath) => {
      if(filePath.indexOf('wav') !== -1){
        alert('Please upload audio in mp3 or m4a format. WAV format not supported');
        return;
      }

      Sound.setCategory('Playback');
      this.whoosh = new Sound(filePath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        const uploadedAudioDuration = this.whoosh.getDuration();
        if(uploadedAudioDuration > 140){
          alert('Please select an audio file within 140 seconds');
          return;
        }
        if(uploadedAudioDuration < 15){
          alert('Please select an audio file of atleast 15 seconds');
          return;
        }
          
        console.log('duration in seconds: ' + uploadedAudioDuration + 'number of channels: ' + this.whoosh.getNumberOfChannels());
        console.log("FILEPATH:- ",filePath);
        console.log("THIS.PROPS:- ",this.props);
        this.props.savePodcast(filePath,uploadedAudioDuration*1000);

        this.setState({ 
          playTime: this.getMinutesFromSeconds(Math.floor(0)),
          audioFromLocalStorage : true,
          showRecorder : false,
          duration: this.getMinutesFromSeconds(Math.floor(uploadedAudioDuration)),
          currentDurationSec : uploadedAudioDuration
        });
      })
    }

    playAudio = async(response) => {

      // Just to show alert when file is from google drive.
      RNFetchBlob.fs
         .stat(response.uri) // Relative path obtained from document picker
              .then(stats => {
                console.log(stats);
                console.log("ABSOLUTE PATH:- ",stats.path);
      })
      .catch(err => {
        console.log(err);
        console.log("error string = ",err.toString())
        const errorString = err.toString();
        const stringsToFind = ["Error: For input string","Error: stat error"];
        

        if(errorString.indexOf(stringsToFind[0]) !== -1)
          console.log("File has raw attached to it from Downloads");
        else if(errorString.indexOf(stringsToFind[1]) !== -1)
          alert('Please select an audio from local storage');
        else
          alert('Please select an audio from local storage');
      });

      // console.log("INSIDE PLAYAUDIO");
      RNGRP.getRealPathFromURI(response.uri).then((filePath) => {
        this.extractDurationAndUploadAudio(filePath);
      }).catch((error) => {
        console.log("[RNGRP error]",error);
      })
      
      //[IMPORTANT] [Have to keep 1 out of RNFetchBlob & RNGRP]
      // Both packages are able to retrieve path from uri, but it is not working for 
      // audio files on google drive.
      // So, work remaining here is:-
      // [1] Play/Pause sound using react-native-track-player
      // [2] use duration extracted by react-native-sound & set it in TrackPlayer only
      //     after checking that the audio is under 140 seconds, otherwise, display an alert
      //     to the user which says "audio needs to be within 140 seconds"
      // [3] use filePath generated by react-native-sound & upload audio to storage accordingly
      
      // [4] All is good except the upload from drive part. Look into this either by RNFetchBlob or
      //     RNGRP...maybe you can look into react-native-fs. Without point [4], we cannot have this
      //     upload option for flips or else we can show a alert to the user that they need to
      //     select an audio which is not in Google Drive.
     console.log("response : ",response);
    }

    setup = async(response) => {
      await TrackPlayer.setupPlayer({});
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          TrackPlayer.CAPABILITY_STOP
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE
        ],
        alwaysPauseOnInterruption: true,
         notificationCapabilities: [
           TrackPlayer.CAPABILITY_PLAY,
           TrackPlayer.CAPABILITY_PAUSE,
           TrackPlayer.CAPABILITY_STOP
         ]
      });
      
      await TrackPlayer.add({
        id: "notRandomID",
        url: response.uri,
        title: "",
        artist: "",
        artwork: "",
        duration: 220
      });
  
      //console.log("[FlipPreviewScreen]duration: ",duration);
      
      //await TrackPlayer.play();
    }

    uploadAudioFromGallery = async() => {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.audio],
        });
        console.log("Inside uploadAudioFromGallery");
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size
        );
        //await SoundPlayer.playUrl(res.uri);//,'.mp3');
        this.playAudio(res);
        this.setup(res);
        console.log("res:- ",res);      
  
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }

    onStartRecord = async () => {
      var permissionResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      
        // while(permissionResult !== RESULTS.GRANTED){
        //   console.log("Inside permissionResult: ",permissionResult);
        //   OpenSettings.openSettings()

        //   // permissionResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        //   // alert('Please enable your microphone permissions');
        // }

        if (permissionResult === RESULTS.GRANTED) {
          console.log('You can use the storage');
          const startRecordingResult = await this.audioRecorderPlayer.startRecorder();
          this.setState({ isRecording : true,recordSecs : 0,recordTime : 0 });
          this.audioRecorderPlayer.addRecordBackListener((e) => {
            console.log("DURATION : ",this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
            console.log("DURATION(in millisec) : ",e.current_position);
            
            this.setState({
              timeRemaining : 140 - Math.floor(e.current_position/1000),
              recordSecs : e.current_position,
              recordTime : this.getMinutesFromSeconds(Math.floor(e.current_position/1000)),
            })

            if(this.state.timeRemaining == 0)
            {
              this.onStopRecord();
            }
            //this.setRecordSecs(e.current_position)
            //this.setRecordTime(this.audioRecorderPlayer.mmss(Math.floor(e.current_position)));
          return;
          });
          console.log(startRecordingResult);
        } 
        else {
          console.log('permission denied');
          //alert('Papyrus needs access to microphone to record flips.');
          Alert.alert(  
            'Papyrus needs access to microphone to record flips',  
            '',  
            [  
                {  
                    text: 'Cancel',  
                    onPress: () => console.log('Cancel Pressed'),  
                    style: 'cancel',  
                },  
                {text: 'OK', onPress: () => {
                  OpenSettings.openSettings()
                  console.log('OK Pressed')
                }},  
            ]  
        ); 

         

          //const permissionResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);


          return;
        }
      };
       
      onStopRecord = async () => {
        
        const result = await this.audioRecorderPlayer.stopRecorder();
        if(this.state.recordSecs/1000 >= 15)
          this.props.savePodcast(defaultURI,this.state.recordSecs);
          
        this.audioRecorderPlayer.removeRecordBackListener();
        
        if(this.state.recordSecs/1000 >= 15)
        {
          this.setState({
            isRecording:false,
            showRecorder:false,
            playTime: this.getMinutesFromSeconds(Math.floor(0)),
            duration: this.getMinutesFromSeconds(Math.floor(this.state.recordSecs/1000)),
            recordSecs : 0
          })
        }
        else if(this.state.recordSecs/1000 < 15)
        {
          alert('Audio Flip should be atleast a minimum of 15 seconds');
          this.setState({
            isRecording:false,
            showRecorder: true,
            playTime: this.getMinutesFromSeconds(Math.floor(0)),
            //duration: this.getMinutesFromSeconds(Math.floor(this.state.recordSecs/1000)),
            recordSecs : 0
          })
          //return;
        }
        //setRecordSecs(0);
        console.log(result);
      };

      tick = () => {
        this.whoosh.getCurrentTime((seconds) => {
          if (this.tickInterval) {
            this.setState({
              currentPositionSec: seconds,
              playTime: this.getMinutesFromSeconds(seconds)
            });
          }
        });
      }

      startLocalUploadPlayer = async() => {
         // Play the sound with an onEnd callback
      this.setState({ paused:false });
      this.tickInterval = setInterval(() => { this.tick(); }, 250);
      this.whoosh.play((success) => {
        if (success) {
          if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
           }
          this.setState({ paused:true})
          console.log('successfully finished playing');
        } else {
          if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
          }
          this.setState({ paused:true})
          console.log('playback failed due to audio decoding errors');
        }
      });
      }

      setAudioFlipWalkthroughInFirestore = async() => {
        const userID = this.props.userID;
        const privateUserID = "private" + userID;
        
        firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
          audioFlipWalkthroughDone : true
        },{merge:true}).then(() => {
            console.log("audioFlipWalkthroughDone set in firestore successfully");       
        }).catch((error) => {
            console.log("Error in updating value of audioFlipWalkthroughDone in firestore");
        })
      }

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
                playTime: this.getMinutesFromSeconds(Math.floor(0)),
                duration: this.getMinutesFromSeconds(Math.floor(e.duration/1000))
               });

                await this.audioRecorderPlayer.stopPlayer();
  
            }
  
            this.setState({
              currentPositionSec : e.current_position,
              currentDurationSec : e.duration,
              playTime : this.getMinutesFromSeconds(Math.floor(e.current_position/1000)),
              duration : this.getMinutesFromSeconds(Math.floor(e.duration/1000))
            })
            return;
          });
        }
        
        
      };
       
      onPausePlay = async () => {
        if(this.state.audioFromLocalStorage == false){
          await this.audioRecorderPlayer.pausePlayer();   
        }
        else{
          await this.whoosh.pause();
        }
        this.setState({ paused:true})
      };
       
      onStopPlay = async () => {
        console.log('onStopPlay');
        if(this.state.audioFromLocalStorage == false){
          this.audioRecorderPlayer.stopPlayer();
          this.audioRecorderPlayer.removePlayBackListener();
          this.setState({ showRecorder : true,paused : true,playerStarted:false})
        }
        else {
          this.whoosh.stop();
          if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
           }
          this.setState({ showRecorder : true,paused : true,audioFromLocalStorage:false})

        }
        this.props.savePodcast(false,0);
        
      };
      
      renderRecorder = () => {
        
          if(!this.state.isRecording) 
          {
            return (
                <View style={{alignItems:'center'}}>
                 
                  <TouchableOpacity style={{alignItems:'flex-end',width:width }} onPress={() => this.uploadAudioFromGallery()}>
                  <Tooltip
                    isVisible={this.state.toolTipUploadVisible}
                    placement='top'
                    content={
                    <Text style={{fontSize:20,fontFamily:'Montserrat-SemiBold'}}>Press this to upload a 140-seconds flip from your gallery</Text>}
                    onClose={() => {
                      this.setState({ toolTipUploadVisible : false });
                      this.props.dispatch({type:"SET_AUDIO_FLIP_WALKTHROUGH",payload:true});
                      this.setAudioFlipWalkthroughInFirestore();
                  }}
                    
                  >
                    <Image source={require('../../../assets/images/outbox.png')} 
                           style={{height:20,width:20,marginRight:20}}/>
                  </Tooltip>
                  </TouchableOpacity>
                  <Tooltip
                    isVisible={this.state.toolTipVisible}
                    content={
                    <Text style={{fontSize:20,fontFamily:'Montserrat-SemiBold'}}>Press this to start recording your 140-seconds flip</Text>}
                    onClose={() => this.setState({
                      toolTipVisible : false,
                      toolTipUploadVisible : true
                    })}
                  >
                  <TouchableOpacity style={{ paddingTop :10}} onPress={this.onStartRecord}>
                  <FontAwesome name="microphone" color='black' size={40} />
                  </TouchableOpacity>
                  </Tooltip>
                </View>
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
            <TouchableOpacity style={{alignItems:'center',marginRight:10}} onPress={() => {
              if(this.state.audioFromLocalStorage == false)
                this.onStartPlay()
              else  
                this.startLocalUploadPlayer()

            }}>
            {/* <Text style={{borderWidth : 1,borderColor : 'black'}}>PLAY</Text> */}
            <FontAwesome name='play' size={20}/>
           </TouchableOpacity>
           <Text>{this.state.playTime} </Text>
           <View style={{width:width/2}}>
           <Slider
              value={this.state.currentPositionSec}
              minimumValue={1}
              maximumValue={this.state.currentDurationSec}
              step={0.01}
              onValueChange={(value)=>this.handleOnSlide(value)}
              minimumTrackTintColor={'black'}
              maximumTrackTintColor={'black'}
              thumbTintColor={'black'}
            />
             </View>
             <Text> {this.state.duration}</Text>

           <TouchableOpacity style={{paddingLeft:10}} onPress={() => {
            this.onStopPlay();
          }}>
          <FontAwesome name='times' size={20}/>
          </TouchableOpacity>
           </View>
           </View>
          )
        else
          return (
          <View>
            <View style={{paddingTop :20, flexDirection:'row'}}>
          <TouchableOpacity style={{alignItems:'center',marginRight:10}} onPress={this.onPausePlay}>
          <FontAwesome name='pause' size={20}/>
          </TouchableOpacity>
          <Text>{this.state.playTime} </Text>
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
              thumbTintColor={'black'}
              //disabled={true}
            />
             </View>
             <Text> {this.state.duration}</Text>

          <TouchableOpacity style={{paddingLeft:10}} onPress={() => {
            this.onStopPlay();
          }}>
          <FontAwesome name='times' size={20}/>
          </TouchableOpacity>
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

const mapDispatchToProps = (dispatch) =>{
  return{
  dispatch,
  }}

const mapStateToProps = (state) => {
  return{
    audioFlipWalkthroughDone: state.userReducer.audioFlipWalkthroughDone,
    flipPreviewWalkthroughDone: state.userReducer.flipPreviewWalkthroughDone
  }}

export default connect(mapStateToProps,mapDispatchToProps)(AddAudioFlipComponent);