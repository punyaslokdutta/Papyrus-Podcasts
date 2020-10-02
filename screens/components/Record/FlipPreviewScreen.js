import React, { useState, useRef, useEffect, useCallback} from 'react';
import { TouchableOpacity,StyleSheet,Animated, Text,TextInput, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter, ActivityIndicator} from 'react-native';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';

import Tooltip from 'react-native-walkthrough-tooltip';
import ToggleSwitch from 'toggle-switch-react-native';
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
import DocumentPicker from 'react-native-document-picker';
import Modal from 'react-native-modal';
import modalJSON2 from '../../../assets/animations/modal-animation-2.json';
import LottieView from 'lottie-react-native';
import { set } from 'react-native-reanimated';
import AddAudioFlipComponent from './AddAudioFlipComponent';

import SoundPlayer from 'react-native-sound-player';
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob'
import RNGRP from 'react-native-get-real-path';
import { useFirstInstallTime } from 'react-native-device-info';
import ExtraDimensions from 'react-native-extra-dimensions-android';
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();


const { width, height } = Dimensions.get('window');
const addPictureImage = 'https://storage.googleapis.com/papyrus-274618.appspot.com/icons8-add-image-64.png';
const FlipPreviewScreen = (props)=> {
          
  var scrollX = new Animated.Value(0);



  const { position,duration } = useTrackPlayerProgress()

  const dispatch = useDispatch();
  const [publishLoading,setPublishLoading] = useState(false);
  const [previewHeaderText,setPreviewHeaderText] = useState("Create Flip");
  const [bookName,setBookName] =useState("");
  const [flipTitle,setFlipTitle] = useState(props.navigation.state.params.flipTitle);
  const [showAudioToolTip,setShowAudioToolTip] = useState(false);

  const isAudioFlip = props.navigation.state.params.audioFlip;
  const [flipDescription,setFlipDescription] = useState(props.navigation.state.params.flipDescription);
  const [flipLocalAudio,setFlipLocalAudio] = useState(false);
  const [flipAudioDownloadURL,setFlipAudioDownloadURL] = useState(false);
  const [durationState,setDurationState] = useState(0);
  const name = useSelector(state=>state.userReducer.name);
  const displayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);

  const audioRecorderPlayerRef = useSelector(state=>state.flipReducer.audioRecorderPlayerRef);
  const flipPreviewWalkthroughDone = useSelector(state=>state.userReducer.flipPreviewWalkthroughDone);
  const audioFlipWalkthroughDone = useSelector(state=>state.userReducer.audioFlipWalkthroughDone);

  const [toolTipVisible,setToolTipVisible] = useState(false);
  const userID = props.firebase._getUid();
  const privateUserID = "private" + userID;
  const [flipRelatedToBook,setFlipRelatedToBook] = useState(true);
  const [bookInputVisible,setBookInputVisible] = useState(false);
  var scrollViewRef = useRef();

  // useEffect(() => {
  //   _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
  //     console.log('finished loading', success);
  //     getInfo();
  //   })
  // },[])
  useEffect(() => {
   
    if(flipPreviewWalkthroughDone == false){
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({animated:true});
    }, 100);

    setTimeout(() => {
      setToolTipVisible(true);
  }, 250)
    }
  },[])
  


  useEffect(() => {
    if(props.navigation.state.params.bookName !== undefined){
      
      setBookName(props.navigation.state.params.bookName);
      props.navigation.state.params.flipDescription && 
      setFlipDescription(props.navigation.state.params.flipDescription);
      props.navigation.state.params.flipTitle && 
      setFlipTitle(props.navigation.state.params.flipTitle);
      setPreviewHeaderText("Edit Flip");
    }  
  },[props.navigation.state.params.bookName])

  function savePodcast(audioFilePath,duration) {
    setFlipLocalAudio(audioFilePath);
    setDurationState(duration);
  }

  async function getInfo() { // You need the keyword `async`
  try {
    const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
    console.log('getInfo', info) // {duration: 12.416, currentTime: 7.691}
  } catch (e) {
    console.log('There is no song playing', e)
  }
}

  async function addFlipToFirestore() {
    try{
      setPublishLoading(true);
      if(props.navigation.state.params.editing === true){
        firestore().collection('flips').doc(props.navigation.state.params.flipID).set({
          flipDescription : flipDescription,
          flipTitle : flipTitle,
          flipPictures : props.navigation.state.params.flipPictures,
          bookName : bookName,
          lastEditedOn : moment().format() 
        },{merge:true}).then(() => {
          Toast.show('Flip edited successfully');
          setFlipAudioDownloadURL(false);
          setBookName(null);
          setFlipDescription(null);
          setPublishLoading(false);

        }).catch((err) => {
          console.log("Error in editing text flip in firestore :- ",err)
          setPublishLoading(false);
          alert('Failed to post edited flip !!!');
        });
      }
      else{
        firestore().collection('flips').add({
          flipDescription : flipDescription,
          flipTitle : flipTitle,
          flipPictures : props.navigation.state.params.flipPictures,
          creatorID : userID,
          creatorName : name,
          bookName : bookName,
          creatorPicture : displayPictureURL,
          createdOn : moment().format(),
          lastEditedOn : moment().format(),
          numUsersLiked : 0
        }).then((docRef) => {
          console.log('Text Flip added to firestore with ID',docRef.id);
          firestore().collection('flips').doc(docRef.id).set({
            flipID : docRef.id
          },{merge:true});
          setPublishLoading(false);
          setBookName(null);
          setFlipDescription(null);
          Toast.show('Flip posted successfully');
        }).catch((err) => {
          console.log("Error in adding text flip to firestore :- ",err)
          setPublishLoading(false);
          alert('Failed to post flip !!!');
        });
      }
      }
      catch(error){
        console.log(error);
      } 
      finally{
        props.navigation.popToTop();
        dispatch({type:"SET_FLIP_UPLOAD_SUCCESS",payload:true});
        props.navigation.navigate('HomeScreen');
      }
  }

  async function addAudioFlipToFirestore() {
    try{
      if(props.navigation.state.params.editing === true){
        firestore().collection('flips').doc(props.navigation.state.params.flipID).set({
          flipDescription : flipDescription,
          flipTitle : flipTitle,
          flipPictures : props.navigation.state.params.flipPictures,
          bookName : bookName,
          lastEditedOn : moment().format() 
        },{merge:true}).then(() => {
          setPublishLoading(false);
          setFlipAudioDownloadURL(false);
          setBookName(null);
          setFlipDescription(null);
          Toast.show('Flip edited successfully');
        }).catch((err) => {
          setPublishLoading(false);
          console.log("Error in editing text flip in firestore :- ",err)
          alert('Failed to post edited flip !!!');
        });
      }
      else{
        firestore().collection('flips').add({
          flipDescription : flipDescription,
          flipTitle : flipTitle,
          flipPictures : props.navigation.state.params.flipPictures,
          creatorID : userID,
          isAudioFlip : true,
          audioFileLink : flipAudioDownloadURL,
          duration : durationState,
          creatorName : name,
          bookName : bookName,
          creatorPicture : displayPictureURL,
          createdOn : moment().format(),
          lastEditedOn : moment().format(),
          numUsersLiked : 0
        }).then((docRef) => {
          console.log('Audio Flip added to firestore with ID',docRef.id);
          firestore().collection('flips').doc(docRef.id).set({
            flipID : docRef.id
          },{merge:true});
          audioRecorderPlayerRef.removePlayBackListener();
          setPublishLoading(false);
          setFlipAudioDownloadURL(false);
          setBookName(null);
          setFlipDescription(null);
          Toast.show('Audio Flip posted successfully');
        }).catch((err) => {
          setPublishLoading(false);
          console.log("Error in adding audio flip to firestore :- ",err)
          alert('Failed to post audio flip !!!');
        });
      }
      }
      catch(error){
        console.log(error);
      } 
      finally{
        //setFlipAudioDownloadURL(false);
        props.navigation.popToTop();
        //dispatch({type:"SET_FLIP_UPLOAD_SUCCESS",payload:false});
        dispatch({type:"SET_FLIP_UPLOAD_SUCCESS",payload:true});
        props.navigation.navigate('HomeScreen');
      }
  }

  useEffect(() => {
    if(flipAudioDownloadURL != false)
    {
      addAudioFlipToFirestore();
    }
  },[flipAudioDownloadURL])


  async function uploadAudioToStorage() {
    setPublishLoading(true);
    console.log(flipLocalAudio);
    var refPath = "flips/audio/" + userID + "_" + moment().format() + ".m4a";
    var storageRef = storage().ref(refPath);
    console.log("Before storageRef.putFile in uploadAudioToStorage ");
    try{
      flipLocalAudio && storageRef.putFile(flipLocalAudio).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          //setIndeterminate(false);
          console.log("snapshot: " + snapshot.state);
          console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          //setProgress((snapshot.bytesTransferred / snapshot.totalBytes));
          
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            console.log("Success");
            //setIndeterminate(true);
          }
        },
        error => {
          //unsubscribe();
          console.log("File upload error code: " + error.code);
          console.log("File upload error: " + error.toString()); 
        },
        () => {
          storageRef.getDownloadURL()
            .then((downloadUrl) => {
              console.log("File available at: " + downloadUrl);
              setFlipAudioDownloadURL(downloadUrl);
              //setUploadPodcastSuccess(true);
            })
            .catch(err => {
              console.log("Error in storageRef.getDownloadURL() in uploadAudioToStorage in FlipPreviewScreen: ",err);
            })
        }
      )
    }
    catch(error){
      console.log("Flip Audio upload error: ",error);
    }
  }

  async function validateAndAddFlipToFirestore(){
    if(props.navigation.state.params.flipPictures.length == 0)
    {
      alert('Please add a picture for your flip');
      return;
    }

    if(flipDescription.length == 0)
    {
      alert('Please describe your flip');
      return;
    }

    if(!flipDescription.replace(/\s/g,'').length)
    {
      setFlipDescription(null);
      alert("Please enter some text in flip Description field");
      return;
    }

    if(flipTitle === undefined || flipTitle.length == 0)
    {
      alert('Please provide a title for your flip');
      return;
    }

    if(!flipTitle.replace(/\s/g,'').length)
    {
      setFlipTitle(null);
      alert("Please enter some text in flip Title field");
      return;
    }

    if(flipRelatedToBook == true)
    {
      if(bookName == null || bookName.length == 0)
      {
        alert('Please provide a book related to your flip');
        return;
      }
  
      if(!bookName.replace(/\s/g,'').length)
      {
        setBookName(null);
        alert("Please enter some text in book field");
        return;
      }
    }
    else
      setBookName(null);
    

    if(isAudioFlip == true)
    {
      if(flipLocalAudio == false)
      {
        alert('Please add an audio for your flip');
        return;
      }
      uploadAudioToStorage();
    }
    else
      addFlipToFirestore();
  }

  async function setFlipPreviewWalkthroughInFirestore() {
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
      flipPreviewWalkthroughDone : true
    },{merge:true}).then(() => {
        console.log("flipPreviewWalkthroughDone set in firestore successfully");       
    }).catch((error) => {
        console.log("Error in updating value of flipPreviewWalkthroughDone in firestore");
    })
  }

  function renderPublishText(){
    if(publishLoading == true)
      return <ActivityIndicator color='black'/>;
    else
      return(
        <TouchableOpacity onPress={() => {
          validateAndAddFlipToFirestore();
        }}>
        <Text style={{ fontFamily:'Montserrat-Regular', borderRadius:10,textAlignVertical: 'center',padding:8,backgroundColor:'black',color:'white',fontSize:15 }} >Publish</Text>
        </TouchableOpacity>
      ) 
  }

  function renderDots () {
    const dotPosition = Animated.divide(scrollX, width);
    return (
      <View style={[ styles.flex, styles.row, styles.dotsContainer ]}>
        {props.navigation.state.params.flipPictures && 
        props.navigation.state.params.flipPictures.map((item, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp'
          });
          return (
            <Animated.View
              key={`step-${item}-${index}`}
              style={[styles.dots, styles.activeDot,{ opacity }]}
            />
          )
        })}
      </View>
    )
  }

  function renderAudio() {
    <View>
      <View style={{height:height/7,justifyContent:'center',alignItems:'center'}}>
        <AddAudioFlipComponent showAudioToolTip={showAudioToolTip} savePodcast={savePodcast}/>
      </View>
        <TouchableOpacity>
          <Text> UPLOAD </Text>
      </TouchableOpacity>
    </View>    
  } 

    return (
      <ScrollView 
      ref={scrollViewRef}
      contentContainerStyle={{flex:1,backgroundColor:'white',marginBottom:30,marginTop:STATUS_BAR_HEIGHT}} keyboardShouldPersistTaps={'always'}>
        <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center',paddingHorizontal:10,paddingVertical:5,height:height/12}}>
        
        <TouchableOpacity onPress={() => {
        props.navigation.goBack(null)
      }}>
      <Icon name="arrow-left" size={20} style={{color:'black'}}/>
      </TouchableOpacity>
      <View style={{alignSelf:'center',position:'absolute',left:width/3,alignItems:'center',justifyContent:'center'}}>
      <Text style={{ fontFamily: 'Montserrat-Regular', color: 'black',paddingBottom:5, fontSize: 20 }}>
        {previewHeaderText}</Text>
        </View>
        {renderPublishText()}  
          </View>
        <Animated.ScrollView
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.998}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {useNativeDriver:true}
              )}
        >
        {
            props.navigation.state.params.flipPictures && 
            props.navigation.state.params.flipPictures.map((img, index) => 
            
            <Image
              key={`${index}-${img}`}
              source={{ uri: img }}
              resizeMode='cover'
              style={{ width:width, height: width }}
            />
            
          )
        }
        </Animated.ScrollView>
        <View>
          {
            props.navigation.state.params.flipPictures.length > 1 &&
            renderDots()
          }
          </View>
          {
            isAudioFlip &&
            <View style={{height:height/7,justifyContent:'center',alignItems:'center'}}>
              <AddAudioFlipComponent userID={userID} showAudioToolTip={showAudioToolTip} savePodcast={savePodcast}/>
            </View> 
            //renderAudio()
          }


          <View style={{marginTop:20,alignItems:'center',justifyContent:'center'}}>
          <TextInput
              style={styles.TextInputStyleClass2}
              placeholder={"Title"}
              placeholderTextColor={"gray"}
              value={flipTitle}
              underlineColorAndroid="transparent"
              onBlur={() => {
                if(flipTitle !== null)
                {
                  const trimmedFlipName = flipTitle.trim();
                  setFlipTitle(trimmedFlipName.slice(0,150));
                }
              }}
              onChangeText={(text) => {
                setFlipTitle(text.slice(0,150));
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          
            <View style={{marginTop:20,alignItems:'center',justifyContent:'center'}}>
              <TextInput
              style={styles.TextInputStyleClass}
              underlineColorAndroid="transparent"
              //placeholder={"How should your listeners approach this podcast?" }
              //placeholderTextColor={"gray"}
              value={flipDescription}
              onBlur={() => {
                if(flipDescription !== null)
                {
                  const trimmedFlipDescription = flipDescription.trim();
                  setFlipDescription(trimmedFlipDescription.slice(0,3000));
                }
              }}
              onChangeText={(text) => {
                setFlipDescription(text.slice(0,3000));
              }}
              multiline={true}
              numberOfLines={6}
                />
              </View>
              <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
              <Text style={{fontFamily:'Montserrat-SemiBold',paddingBottom:15}}> Is this flip related to any book?</Text>
              <Tooltip
                isVisible={toolTipVisible}
                content={
                <Text style={{fontSize:20,fontFamily:'Montserrat-SemiBold'}}>If your flip is not related to any book, you can switch off this option</Text>}
                onClose={() => {
                  setToolTipVisible(false);
                  dispatch({type:"SET_FLIP_PREVIEW_WALKTHROUGH",payload:true})
                  setFlipPreviewWalkthroughInFirestore();
                  setShowAudioToolTip(true);
                }}
              >
              <ToggleSwitch
                    isOn={flipRelatedToBook}
                    onColor="#79cced"
                    offColor='#808080'
                    labelStyle={{ color: "white", fontWeight: "900" }}
                    size="medium"
                    onToggle={isOn => {
                      console.log("changed to : ", isOn)
                      setFlipRelatedToBook(isOn);
                    }}
                  />
                </Tooltip>
              </View>
            {
              flipRelatedToBook == true  && 
              <View style={{marginTop:20,alignItems:'center',justifyContent:'center'}} >
              <TextInput
                style={styles.TextInputStyleClass2}
                placeholder={"Which book is this flip related to?"}
                placeholderTextColor={"gray"}
                value={bookName}
                underlineColorAndroid="transparent"
                onBlur={() => {
                  if(bookName !== null)
                  {
                    const trimmedBookName = bookName.trim();
                    setBookName(trimmedBookName.slice(0,150));
                  }
                }}
                onChangeText={(text) => {
                  setBookName(text.slice(0,150));
                }}
                multiline={true}
                numberOfLines={2}
              />
              </View> 
            }
              
      </ScrollView>        
    )
}

export default withFirebaseHOC(FlipPreviewScreen);


const styles = StyleSheet.create({
  flex:{
    flex:0,
  },
  row: {
    flexDirection: 'row'
  },

  TextInputStyleClass: {

    //textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    //fontStyle: 'italic',
    color: 'black',
    height: height / 6,
    paddingBottom:10,
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 3,
    backgroundColor: "white",
    height: height / 6,
    width: (width * 5) / 6,
    paddingLeft: 10,
    paddingRight: 10

  },
  TextInputStyleClass2: {

    //textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 'normal',
    //fontStyle: 'italic',
    fontSize: 17,
    color: 'black',
    borderWidth: 1,
    paddingTop:0,
    marginTop:0,
    paddingBottom:0,
    marginBottom:0,
    borderColor: '#9E9E9E',
    borderRadius: 3,
    backgroundColor: "white",
    width: (width * 5) / 6,
    paddingLeft: 10,
    //height: height / 18,
    paddingRight: 10
  }, 
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
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  dots: {
    width: 5,
    height: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
    borderColor: 'transparent',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 6.25,
    borderColor: theme.colors.active,
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

