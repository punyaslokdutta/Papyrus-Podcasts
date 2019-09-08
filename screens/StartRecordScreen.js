

import React, {Component} from 'react';
import {  Platform,TouchableOpacity,StyleSheet, Text, View, Button} from 'react-native';


let recordingPath;

class StartRecordScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false
    }
  }


  
   
    render() {
      return (
       <View></View>
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
