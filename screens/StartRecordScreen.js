

import React, {Component} from 'react';
import {  Platform,TouchableOpacity,StyleSheet, Text, View, Button} from 'react-native';


import { RNVoiceRecorder } from 'react-native-voice-recorder'
let recordingPath;

class StartRecordScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false
    }
  }


  _onRecord() {
    RNVoiceRecorder.Record({
      format: 'wav',
      onDone: (path) => {
        console.log('record done: ' + path)

        recordingPath = path;
      },
      onCancel: () => {
        console.log('on cancel')
      }
    });
  }
   
    render() {
      return (
        <Button onPress={() => {
          this._onRecord()
  
         this.setState({ visible: true });
        }} title={'Record'}>
        </Button>
      );
    }
  }

export default StartRecordScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding:10,
    backgroundColor: '#202646',
    borderRadius:5
    },
    textStyle: {
      fontSize:20,
    color: '#ffffff',
    textAlign: 'center'
    },
});
