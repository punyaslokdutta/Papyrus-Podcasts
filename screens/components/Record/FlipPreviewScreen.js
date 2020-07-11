
import React, { useState, useRef, useEffect, useCallback} from 'react';
import { TouchableOpacity,StyleSheet, Text,TextInput, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EnTypoIcon from 'react-native-vector-icons/Entypo';
import { TagSelect } from 'react-native-tag-select'
import { useDispatch, useSelector} from 'react-redux'
import { theme } from '../categories/constants';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import storage, { firebase, FirebaseStorageTypes } from '@react-native-firebase/storage'
import {withFirebaseHOC} from '../../config/Firebase';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import modalJSON from '../../../assets/animations/modal-microphone.json';
import modalJSON2 from '../../../assets/animations/modal-animation-2.json';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');
const addPictureImage = 'https://storage.googleapis.com/papyrus-274618.appspot.com/icons8-add-image-64.png';
const FlipPreviewScreen = (props)=> {
          
    return (
        <View>
            <Text> nejnednkjnc </Text>
        </View>
    )
}

export default withFirebaseHOC(FlipPreviewScreen);


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
    item: {
      borderWidth: 1,
      borderColor: '#333',    
      backgroundColor: 'transparent'
    },
    label: {
      color: 'white',
      fontSize:12
    },
    itemSelected: {
      backgroundColor: '#333',
    },
    labelSelected: {
      color: '#FFF',
    },
    AppHeader:
  {
 flexDirection:'row',
 backgroundColor: '#101010'
  },
});

