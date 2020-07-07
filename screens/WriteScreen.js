import React, { Component, useState,useEffect } from 'react'
import { Image, StyleSheet, ScrollView, TextInput,Alert, TouchableOpacity , View,ActivityIndicator, Linking,Dimensions,NativeModules} from 'react-native'
import Slider from 'react-native-slider';
import firestore from '@react-native-firebase/firestore'
//import { Divider, Button, Block, Text, Switch } from '../components';
import {  Block, Text } from '../screens/components/categories/components/';
import { Divider, Button, Switch } from '../screens/components/categories/components/';
import {withFirebaseHOC} from './config/Firebase'
import { theme, mocks } from '../screens/components/categories/constants/';
import Icon from 'react-native-vector-icons/FontAwesome'
import { firebase } from '@react-native-firebase/functions';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

import { WebView } from 'react-native-webview';

var {width, height}=Dimensions.get('window')


import {useSelector,useDispatch} from 'react-redux'
import Toast from 'react-native-simple-toast';
import { renderers } from 'react-native-popup-menu';

class WriteScreen extends Component {

    componentDidMount = () => {
        this.myWebView.postMessage("Hello from RN");
    }

    render() {
        return (
            <WebView 
            ref={webview => { this.myWebView = webview; }}
            source={{ uri: 'http://192.168.1.5:3000/param1/param2' }} />
        );
    }
     
  }

export default withFirebaseHOC(WriteScreen);
