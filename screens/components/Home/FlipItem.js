import { Text, Dimensions,ScrollView,Share, Image,View,Animated,StyleSheet,ImageBackground, TouchableOpacity,TouchableNativeFeedback,Alert, ActivityIndicator } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { Component, useEffect,useState,useRef } from 'react';
import * as theme from '../constants/theme';

import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import {useSelector, useDispatch} from "react-redux"
import { withFirebaseHOC } from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';

import moment from "moment";
import Slider from '@react-native-community/slider';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import LinearGradient from 'react-native-linear-gradient';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Toast from 'react-native-simple-toast';
import { accessSync } from 'fs-extra';

const { width, height } = Dimensions.get('window');

const areEqual = (prevProps, nextProps) => true

const FlipItem = (props) => {
    
    const realUserID = props.firebase._getUid();
    const privateDataID = "private" + realUserID;
    const isAdmin = useSelector(state=>state.userReducer.isAdmin);
    const isFlipLikedRedux = useSelector(state=>state.userReducer.isFlipLiked);
    const userDisplayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
    const nameUser = useSelector(state=>state.userReducer.name);

    const [numLikes,setNumLikes] = useState(props.item.numUsersLiked);
    const [liked,setLiked] = useState(isFlipLikedRedux[props.item.flipID]);
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);
    const paused = useSelector(state=>state.flipReducer.paused);
    const isFlipPlaying = useSelector(state=>state.flipReducer.isFlipPlaying);
    const currentFlipID = useSelector(state=>state.flipReducer.currentFlipID);
    const [pausedState,setPausedState] = useState(true);
    const [playerText,setPlayerText] = useState("play");
    const flipID = props.item.flipID;

    const playbackState = usePlaybackState();
    const { position } = useTrackPlayerProgress()


    const [player,setPlayer] = useState(false);

    var scrollX = new Animated.Value(0);


    useEffect(() => {
      if(props.item.flipID == currentFlipID)
      {
        if(pausedState == true )
          setPlayerText("play");
        else
          setPlayerText("pause");
      }
      
    },[pausedState])

    useEffect(() => {
      console.log("sccdscds");
      if(props.item.flipID != currentFlipID && playerText == "pause")
      {
        setPlayerText("play");
        setPlayer(false);
      }
    },[currentFlipID])

    useEffect(() => {
      TrackPlayer.addEventListener('remote-stop', () => {
        dispatch({type:"SET_FLIP_ID",payload:null});
        setPlayerText("play");
        TrackPlayer.destroy()
      });
      TrackPlayer.addEventListener('remote-play', () => {
        setPausedState(true);
        setPausedState(false);
      });
      TrackPlayer.addEventListener('remote-pause', () => {
        setPausedState(false);
        setPausedState(true);
      });
    },[])

    useEffect(() => {
      if(props.item.flipID == currentFlipID)
      {
        console.log("position: ",position)
        if(position >= props.item.duration/1000 - 1 && position < props.item.duration/1000)
        {
          setPlayerText('play');
          setPlayer(false);
        }
      }
    },[position])
    

  //   useEffect(() => {
  //     props.item.flipPictures !== undefined &&
  //     props.item.flipPictures.map((img,index) => {
  //         Image.getSize(img, (width, height) => {
  //             var localResizeModes = resizeModes;
  //             if(height > width)
  //                 localResizeModes.push('cover');
  //             else
  //                 localResizeModes.push('contain');
                  
  //             setResizeModes(localResizeModes);    
  //         });

  //     })
  // },[])

    async function retrieveUserData(){
        if(realUserID == props.item.creatorID)
            props.navigation.navigate('ProfileTabNavigator');
        else
        {
            const userID = props.item.creatorID;
            const privateDataID = "private" + userID;
            const privateDoc = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).get();
            const privateDocumentData = privateDoc.data();
            dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:privateDocumentData})
            props.navigation.navigate('ExploreTabNavigator',{userData:privateDocumentData});
        }
    }

    async function deleteFlipFromFirestore () {
      firestore().collection('flips').doc(flipID).delete().then(() => {
        console.log("Flip Document successfully deleted. ");
        Toast.show('Flip deleted');
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    }

    async function buildDynamicURL() {
      const link = await dynamicLinks().buildShortLink({
        //link: 'https://newpodcast.com/' + props.podcast.podcastID,
        link: 'https://papyrusapp.page.link/flips/' + props.item.flipID,
        // domainUriPrefix is created in your firebase console
        domainUriPrefix: 'https://papyrusapp.page.link/',
        // optional set up which updates firebase analytics campaign
        // "banner". This also needs setting up before hand
        analytics: {
          campaign: 'banner',
        },
        android: {
          packageName: 'com.papyrus_60',
          minimumVersion: '8',
          fallbackUrl: 'http://www.papyruspodcasts.com'
        },
        social: {
          title: props.item.bookName,
          descriptionText: props.item.flipDescription,
          imageUrl: props.item.flipPictures[0]
        }
      });
    
      console.log("dynamicURL created for the link: ",link);
      Share.share({
        title : props.item.bookName,
        //url : link,
        message: link
      },{
        dialogTitle: 'Share Flip'
      })
      return link;
    }

    async function addLikeToFlipDoc(){

      firestore().collection('users').doc(realUserID).collection('privateUserData')
        .doc(privateDataID).set({
          flipsLiked : firestore.FieldValue.arrayUnion(props.item.flipID)
        },{merge:true}).then(() => {
          console.log("Added to flips Liked array in user privaate doc");
        }).catch((err) => console.log("Error in adding flip to liked flips list of user",err))

        firestore().collection('flips').doc(props.item.flipID).set({
          numUsersLiked : firestore.FieldValue.increment(1)
        },{merge:true}).then(() => {
          console.log("added 1 to number of users who liked this flip")
        }).catch((err) => {
          console.log("Error in adding likes to flipDoc",err);
        })

        const instance = firebase.app().functions("asia-northeast1").httpsCallable('addActivityFlipLike');
        try 
        {          
          await instance({ // change in podcast docs created by  user
            timestamp : moment().format(),
            photoURL : userDisplayPictureURL,
            flipID : props.item.flipID,
            userID : props.item.creatorID,
            flipImageURL : props.item.flipPictures[0],
            type : "flipLike",
            Name : nameUser,
            bookName : props.item.bookName,
          });
        }
        catch (e) 
        {
          console.log(e);
        }
    }

    async function removeLikeFromFlipDoc(){
      firestore().collection('users').doc(realUserID).collection('privateUserData')
        .doc(privateDataID).set({
          flipsLiked : firestore.FieldValue.arrayRemove(props.item.flipID)
        },{merge:true}).then(() => {
          console.log("Removed from flips Liked array in user privaate doc");
        }).catch((err) => console.log("Error in removing flip from liked flips list of user",err))

        firestore().collection('flips').doc(props.item.flipID).set({
          numUsersLiked : firestore.FieldValue.increment(-1)
        },{merge:true}).then(() => {
          console.log("subtracted 1 from number of users who liked this flip")
        }).catch((err) => {
          console.log("Error in removing likes from flipDoc",err);
        })
    }

    function handleOnSlide(time) {
      TrackPlayer.seekTo(time)
      //props.onSlideCapture({seekTime: time});
    }

    async function updateLikes() {
      if(isFlipLikedRedux[props.item.flipID] == true)
      {
        dispatch({type:"REMOVE_FROM_FLIPS_LIKED",payload:props.item.flipID})
        removeLikeFromFlipDoc();
        setNumLikes(numLikes-1);
        setLiked(false);
      }
      else
      {
        dispatch({type:"ADD_TO_FLIPS_LIKED",payload:props.item.flipID})
        addLikeToFlipDoc();
        setNumLikes(numLikes+1);
        setLiked(true);
      }
    }

    function stopPodcast() {
        dispatch({type:"SET_LAST_PLAYING_CURRENT_TIME",payload:null});
        dispatch({type:"SET_LAST_PLAYING_PODCASTID",payload:null});
        //BackHandler.removeEventListener("hardwareBackPress",  this.props.back_Button_Press());
        //dispatch({type:"TOGGLE_PLAY_PAUSED"})
        TrackPlayer.destroy()
        dispatch({type:"SET_PODCAST", payload: null})
    }

    async function startAudioFlip() {
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
        id: props.item.flipID,
        url: props.item.audioFileLink,
        title: props.item.bookName,
        artist: props.item.creatorName,
        artwork: props.item.flipPictures[0],
        duration: props.item.duration
      });
      setPlayer(true);
      dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
      await TrackPlayer.play();

    }

    function renderFlipPlayer() {
      if(loading)
        return (
          <View>
          <ActivityIndicator color='black' size={'small'}/>
          </View>
        )
      else
        return (
          <View style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start',marginVertical:5,height:width/15,marginHorizontal:8}}>
            <TouchableOpacity style={{width:width/10,height:width/10}} onPress={() => {
              //setPausedState(false);
              if(playerText == "pause")
              {
                setPlayerText("play");
                dispatch({type:"SET_FLIP_PLAYING",payload:false});
                TrackPlayer.pause();
              }
              else
              {
                //setLoading(true);
                setPlayerText("pause")
                dispatch({type:"SET_FLIP_PAUSED",payload:false})
                dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
                if(player == false || (player == true && props.item.flipID != currentFlipID)) 
                {
                  stopPodcast();
                  dispatch({type:"SET_FLIP_ID",payload:props.item.flipID});
                  dispatch({type:"SET_FLIP_PLAYING",payload:false});
                  dispatch({type:"SET_FLIP_PLAYING",payload:true});
                  startAudioFlip();
                }
                else
                {

                  TrackPlayer.play();

                }
              } 
            }}>
              <Icon name={playerText} size={playerText == 'play' ? 23 : 20} color='black'/>
            </TouchableOpacity> 
            {
              props.item.flipID == currentFlipID 
              ?
              <Text> {getMinutesFromSeconds(Math.floor(position))}</Text>
              :
              <Text> {getMinutesFromSeconds(0)}</Text>
            }
            <View style={{width:width*5/8}}>
              {
                props.item.flipID == currentFlipID 
                ?
                <Slider
                  value={position}
                  minimumValue={1}
                  maximumValue={props.item.duration/1000}
                  step={0.01}
                  onValueChange={(value)=>handleOnSlide(value)}
                  //onSlidingStart={handlePlayPause}
                  //onSlidingComplete={handlePlayPause}
                  minimumTrackTintColor={'black'}
                  maximumTrackTintColor={'black'}
                  thumbTintColor={'#F44336'}
                  //disabled={true}
                />
                :
                <Slider
                  value={0}
                  minimumValue={1}
                  maximumValue={props.item.duration/1000}
                  step={0.01}
                  //onValueChange={(value)=>handleOnSlide(value)}
                  //onSlidingStart={handlePlayPause}
                  //onSlidingComplete={handlePlayPause}
                  minimumTrackTintColor={'black'}
                  maximumTrackTintColor={'black'}
                  thumbTintColor={'#F44336'}
                  //disabled={true}
                />
              }
           
             </View>
          <Text>{getMinutesFromSeconds(Math.floor(props.item.duration/1000))}</Text>
            </View>
      )
    }

    function getMinutesFromSeconds(time) {
    
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

    function renderDots () {
        const dotPosition = Animated.divide(scrollX, width);
        return (
          <View style={[ styles.flex, styles.row, styles.dotsContainer ]}>
            {props.item.flipPictures && props.item.flipPictures.map((item, index) => {
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

      async function addFlipToExploreScreen() {
        firestore().collection('flips').doc(props.item.flipID).set({
          isExploreFlip : true,
          lastEditedOn: moment().format()
        },{merge:true}).then(() => {
          Toast.show("Flip added to Explore Section");
        }).catch((error) => {
          console.log("Error in adding flip to Explore Screen: ",error);
          Toast.show("Failed to")
        })
      }


      function renderMenu() {
        return (
          <Menu>
          <MenuTrigger>
          <IconAntDesign name="ellipsis1" size={26}/>
          </MenuTrigger>
          <MenuOptions customStyles={{optionWrapper: { margin: 5}}}>
          <MenuOption text='Edit' onSelect={() => {
            props.navigation.navigate('FlipPreviewScreen',{
              flipDescription : props.item.flipDescription,
              flipPictures : props.item.flipPictures,
              bookName : props.item.bookName,
              editing : true,
              flipID : props.item.flipID
            })
          }}/>
          <MenuOption text='Delete' onSelect={async() => {
            Alert.alert(  
              'Are you sure you want to delete this flip?',  
              '',  
              [  
                {  
                  text: 'Cancel',  
                  onPress: () => console.log('Cancel Pressed'),  
                  style: 'cancel',  
                },  
                {
                  text: 'OK', onPress: async() => {
                    deleteFlipFromFirestore();
                    console.log('OK Pressed')
                    }
                },  
              ]  
          );
          }}/>
          
          </MenuOptions>
          </Menu>
        );
      }

    return (
        <View style={{paddingBottom:0,borderBottomWidth:1,borderTopWidth:1, borderColor:'#dddd'}}>
            <View style={{backgroundColor:'#dddd',flexDirection:'row'}}>
            <TouchableOpacity 
            onPress={() => retrieveUserData()}
            style={{flexDirection:'row',padding:5}}>
                <View>
                    <Image 
                        source={{uri:props.item.creatorPicture}}
                        style={{height:width/12,width :width/12,borderRadius:20}} />
                </View>
                <View style={{borderColor:'black',borderWidth:0,justifyContent:'center'}}>
                    <Text style={{fontFamily:'Montserrat-Bold'}}> {props.item.creatorName}</Text>
                     
                </View>            
            </TouchableOpacity>
            <View style={{flex:1,alignItems:'flex-end',justifyContent:"center",paddingRight:5}}>
            {
              props.item.bookName !== undefined &&
              <Text style={{fontFamily:'Montserrat-Italic',fontSize:10}}>
                {props.item.bookName}
              </Text>
            }
            </View>
            </View>
            <View>
                {/* <Image 
                    source={{uri:props.item.flipPictures[0]}}
                    style={{height:width,width :width}}/> */}
                <ScrollView
                    horizontal
                    pagingEnabled
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={0.998}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }])}
                    useNativeDriver={true}
                >
            {
               props.item.flipPictures && props.item.flipPictures.map((img, index) => 
                <TouchableOpacity onPress={() => {
                  props.navigation.navigate('MainFlipItem',{
                    item : props.item,
                    // resizeModes : resizeModes
                  })
                }}>
                <Image
                  key={`${index}-${img}`}
                  source={{ uri: img }}
                  resizeMode='cover'
                  style={{ width:width, height: width/2 }}
                />
                </TouchableOpacity>
              )
            }
          </ScrollView>

            </View>
            <View>
            {
                props.item.flipPictures.length > 1 &&
                renderDots()
            }
                </View>
                {/* {
                  props.item.isAudioFlip == true &&
                  
                } */}
            {
                props.item.isAudioFlip == true &&
                renderFlipPlayer()
                
            }
                
            <View style={{marginHorizontal:5,height:width/3.5,marginTop:5}}>
                <Text style={{fontWeight:'bold',height:width/4,lineHeight:width/28}}>{props.item.creatorName} 
                <Text style={{fontWeight:'normal',fontFamily:'Montserrat-Regular',fontSize:width/28}}>  {props.item.flipDescription.slice(0,100)}
                
                {
                  props.item.flipDescription.length > 100
                  &&
                  <Text onPress={() => {
                    props.navigation.navigate('MainFlipItem',{
                      item : props.item,
                      //resizeModes : resizeModes
                    })
                  }} 
                  style={{fontWeight:'normal',color:'gray', fontFamily:'Montserrat-Regular',fontSize:width/30}}>...Read More</Text>
                }

                 </Text>
                </Text>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{color:"gray",fontSize:10}}>{moment(props.item.createdOn).fromNow()}</Text>
              
                
                </View>
                
            </View>
            <View style={{width:width,flexDirection:'row',alignItems:'flex-start'}}>
                <TouchableOpacity style={{paddingLeft:10,paddingTop:10,paddingBottom:10,paddingRight:5}} onPress={() => updateLikes()} > 
                  <IconAntDesign 
                    name={isFlipLikedRedux[props.item.flipID] ? "heart" : "hearto"}
                    color={isFlipLikedRedux[props.item.flipID] ? 'red' : 'black' } 
                    size={16} />
                </TouchableOpacity>
                <Text style={{paddingTop:8}}>{numLikes} </Text>
                <TouchableOpacity style={{padding:10}} onPress={() => buildDynamicURL()} > 
                  <Icon name="share" size={16} style={{color:'black'}}/>
                </TouchableOpacity>
                <View style={{position:'absolute',bottom:2,right:10}}>
                {
                  (isAdmin == true || props.item.creatorID == realUserID)
                  &&
                  renderMenu()
                }
                </View>
                </View>
        </View>
    )

}

export default withFirebaseHOC(FlipItem);


const styles = StyleSheet.create({
  flex: {
    flex: 0,
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding * 1.33,
    paddingBottom: theme.sizes.padding * 0.66,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  articles: {
  },
  books: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  destination: {
    width: width - (theme.sizes.padding * 2),
    height: height/3,
    marginHorizontal: theme.sizes.margin*1.5,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding * 0.66,
    borderRadius: theme.sizes.radius,
  },
  destinationInfo: {
    position: 'absolute',
    borderRadius: theme.sizes.radius,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding / 2,
    bottom: height/100,
    left: (width - (theme.sizes.padding * 4)) / (Platform.OS === 'ios' ? 3.2 : 3),
    backgroundColor: theme.colors.white,
    width: width - (theme.sizes.padding * 4),
  },
  recommended: {
  },
  recommendedHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.sizes.padding,
  },
  recommendedList: {
  },
  recommendation: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    marginHorizontal: 0,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    borderRadius: theme.sizes.radius,
    marginVertical: theme.sizes.margin * 0.5,
  },
  recommendationHeader: {
    overflow: 'hidden',
    borderTopRightRadius: theme.sizes.radius,
    borderTopLeftRadius: theme.sizes.radius,
  },
  recommendationOptions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.sizes.padding / 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  recommendationTemp: {
    fontSize: theme.sizes.font * 1.25,
    color: theme.colors.white
  },
  recommendationImage: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    height: (width - (theme.sizes.padding * 2)) / 2,
  },
  avatar: {
    width: theme.sizes.padding,
    height: theme.sizes.padding,
    borderRadius: ((theme.sizes.padding) * 2) / 1,
  },
  rating: {
    fontSize: theme.sizes.font * 1.5,
    color: theme.colors.white,
    fontWeight: 'bold'
  },
  shadow: {
    shadowColor: theme.colors.dark_green,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
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
  }
});

       
    
  