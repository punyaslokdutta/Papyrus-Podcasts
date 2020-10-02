import React, { useState, useEffect,useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Button, SafeAreaView, 
  Dimensions, Image, TextInput, Platform, KeyboardAvoidingView, ScrollView, 
  ActivityIndicator,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import ImagePicker from 'react-native-image-picker'
import OpenSettings from 'react-native-open-settings';
import { StatusBar } from 'react-native'

import { Block, Text } from '../categories/components/';
import ExtraDimensions from 'react-native-extra-dimensions-android';

import Video from 'react-native-video';
import VideoItem from './VideoItem';
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
import { useSelector, useDispatch,connect } from 'react-redux'
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';
import { Item } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
//const sharp = require("sharp");


const options = {
  title: 'Change Profile Picture',
  chooseFromLibraryButtonTitle: 'Select from Library'
};

class VideoScreen extends React.Component {

  constructor(props)
  {
    super(props)
    {
    this.state={
        conversations:[], 
        limit:6,
        lastVisibleConversation:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true,
        scrollPosition: 0,
        scrollToPosition : 0,
        layoutHeight: height,

      }
    }

  }

  //const [scrollPosition,setScrollPosition] = useState(0);
  //const [conversations,setConversations] = useState([]);
  // const [lastVisibleConversation,setLastVisibleConversation] = useState(null);
  // const [scrollToPosition,setScrollToPosition] = useState(0);
  // const [layoutHeight,setLayoutHeight] = useState(height);

  //const dispatch = useDispatch();

  componentDidMount = () => {
    //console.log("[VideScreen] -> componentDidMount -> this.didFocusListener(BEFORE addListener) = ",this.didFocusListener);
    
    // this.didFocusListener =  this.props.navigation.addListener('didFocus', () => {
    //     console.log("VIDEO SCREEN PRESSED");
    //     //this.props.inVideoScreen == false &&
    //     //this.props.dispatch({type:"ENTER_VIDEO_SCREEN",payload:true});
        
    //     //dispatch({type:"CHANGE_SCREEN"});
    //     });

    //     console.log("[VideScreen] -> componentDidMount -> this.didFocusListener(AFTER addListener) = ",this.didFocusListener);

        //this.props.inVideoScreen == false &&
        //this.props.dispatch({type:"ENTER_VIDEO_SCREEN",payload:true});

    this.setState({
        conversations : this.props.navigation.state.params.conversations,
        lastVisibleConversation : this.props.navigation.state.params.lastVisibleConversation,
    });
    // setConversations(this.props.navigation.state.params.conversations);
    // setLastVisibleConversation(this.props.navigation.state.params.lastVisibleConversation);
    // setScrollToPosition(this.props.navigation.state.params.scrollIndex);

    console.log("[VideoScreen] this.props.navigation.state.params.scrollIndex : ",this.props.navigation.state.params.scrollIndex);
    let wait = new Promise((resolve) => setTimeout(resolve, 10)); // Smaller number should work
        wait.then( () => {
            this.flatListRef.scrollToIndex({index:this.props.navigation.state.params.scrollIndex  , animated: false,viewPosition:0});
        });
  } 

  componentWillUnmount = () => {
    //this.props.inVideoScreen == true &&
    //this.props.dispatch({type:"ENTER_VIDEO_SCREEN",payload:false});
    //console.log("this.didFocusListener = ",this.didFocusListener);
    console.log("UNMOUNTING [VideoScreen]")

    //this.didFocusListener.remove();
  }

  retrieveMoreConversations = async () => {
    
    this.setState({
      refreshing: true
    });

    try{
        console.log('[VideoScreen] --> [retrieveMoreConversations] Retrieving More conversations');
        const  userid = this.props.firebase._getUid();
        console.log("userid = ",userid);
        console.log("this.state.lastVisibleConversation = ",this.state.lastVisibleConversation)
      let conversations = await firestore().collection('conversations').where('participants','array-contains',userid)//.where('isChapterPodcast','==',false)
                        .orderBy('createdOn','desc').startAfter(this.state.lastVisibleConversation).limit(this.state.limit).get();
    
      
      console.log("[VideoScreen] --> retrieveMoreConversations afterQuery()",conversations); 
      let documentData = conversations._docs.map(document => document.data());
      if(documentData.length != 0)   
      {
        let lastVisibleConversation = documentData[documentData.length - 1].createdOn;
        if(this.state.lastVisibleConversation !== lastVisibleConversation)
        {
          this.setState({
            conversations: [...this.state.conversations, ...documentData],
            lastVisibleConversation : lastVisibleConversation,
          });
        }
      }      
    }
    catch(error){
    console.log("Error in retrieveMoreFlips11: ",error);
    }
    finally {
      this.setState({
        refreshing: false
      });
    }
  }

  handleScroll = (event) => {
    console.log("In handleScroll : ",event.nativeEvent);
    if(event.nativeEvent.layoutMeasurement.height != this.state.layoutHeight)
    {
        this.setState({
            layoutHeight : event.nativeEvent.layoutMeasurement.height,
            scrollPosition : event.nativeEvent.contentOffset.y
        });
    }
    else
    {
        this.setState({
            scrollPosition : event.nativeEvent.contentOffset.y
        });
    }
        //setLayoutHeight(event.nativeEvent.layoutMeasurement.height);
    //if(Math.abs(scrollPosition - event.nativeEvent.contentOffset.y) >= height/6)
        //setScrollPosition(event.nativeEvent.contentOffset.y); 
   }
   
   


   onEndReached = ({ distanceFromEnd }) => {
        if(this.state.conversations.length > (this.state.limit - 1))
        {
        if(!this.onEndReachedCalledDuringMomentum){
            this.retrieveMoreConversations()
            this.onEndReachedCalledDuringMomentum = true;
        }
        }      
    }

   render(){
    return (
        <View>
            <StatusBar
               barStyle="dark-content"
               backgroundColor='transparent'
               translucent
               //hidden={true}
               />
            <FlatList
            data={this.state.conversations}
            onScroll={this.handleScroll}
            ref={(ref) => { this.flatListRef = ref }}
            getItemLayout={(data, index) => (
                {length: height, index, offset: height*index} 
              )}
            pagingEnabled={true}
            keyExtractor={item => item.conversationID}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
            refreshing={this.state.refreshing}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            renderItem={({item,index}) => {
                return (
                    <VideoItem item={item} index={index} layoutHeight={this.state.layoutHeight} scrollPosition={this.state.scrollPosition}/>
                    // <View style={{height:height,width:width}}>
                    //     <VideoPlayer
                    //     paused={true}
                    //     source={{uri: item.recordedVideoURL}}
                    //     disableVolume={true}
                    //     disableBack={true}
                    //     controlTimeout={3000}
                    // />
                    // </View>
                )
            }}
            />
        </View>
      );
   }
  
}

const mapStateToProps = (state) => {
  return{
    inVideoScreen : state.rootReducer.inVideoScreen
  }}

const mapDispatchToProps = (dispatch) =>{
    return{
    dispatch,
    }}
export default connect(mapStateToProps,mapDispatchToProps)(withFirebaseHOC(VideoScreen))

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