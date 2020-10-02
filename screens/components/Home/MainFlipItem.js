import { Text, Dimensions,ScrollView,Share,TouchableWithoutFeedback, Image,View,Animated,StyleSheet,ImageBackground, TouchableOpacity,TouchableNativeFeedback,Alert } from 'react-native'
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
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import moment from "moment";
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import ImageZoom from 'react-native-image-pan-zoom';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get('window');

const areEqual = (prevProps, nextProps) => true

const MainFlipItem = (props) => {
    
    const nameUser = useSelector(state=>state.userReducer.name);
    const userDisplayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
    const isFlipLikedRedux = useSelector(state=>state.userReducer.isFlipLiked);
    const [loading,setLoading] = useState(false);
    const realUserID = props.firebase._getUid();
    const privateUserID = "private" + realUserID;
    const [resizeModes,setResizeModes] = useState([]);
    const [loadingResizeModes,setLoadingResizeModes] = useState(true);
    const [playerText,setPlayerText] = useState("play");
    const [player,setPlayer] = useState(false);
    const [pausedState,setPausedState] = useState(true);
    const paused = useSelector(state=>state.flipReducer.paused);
    const isAdmin = useSelector(state=>state.userReducer.isAdmin);
    const currentFlipID = useSelector(state=>state.flipReducer.currentFlipID);
    const [numLikes,setNumLikes] = useState(0);
    const [likeString,setLikeString] = useState("likes");

    const dispatch = useDispatch();
    const flipID = props.navigation.state.params.item.flipID;
    const item = props.navigation.state.params.item;
    const { position } = useTrackPlayerProgress()

    var scrollX = new Animated.Value(0);


    useEffect(() => {
      if(props.navigation.state.params.item.flipID == currentFlipID)
      {
        console.log("position: ",position)
        !paused && playerText == 'play' && setPlayerText('pause');
        if(position >= props.navigation.state.params.item.duration/1000 - 1 && 
          position < props.navigation.state.params.item.duration/1000)
        {
          setPlayerText('play');
          setPlayer(false);
        }
      }
    },[position])

    useEffect(() => {
      numLikes == 1 ? setLikeString("like") : setLikeString("likes")
     },[numLikes])

    useEffect(() => {
      if(paused == true && props.navigation.state.params.item.flipID == currentFlipID)
      {
        setPausedState(true);
        setPlayerText('play')
      }
    },[paused])

    useEffect(() => {
      console.log("sccdscds");
      if(props.navigation.state.params.item.flipID != currentFlipID && playerText == "pause")
      {
        setPlayerText("play");
        setPlayer(false);
      }
    },[currentFlipID])

    useEffect(() => {
      if(props.navigation.state.params.item.flipID == currentFlipID)
      {
        if(pausedState == true )
          setPlayerText("play");
        else
          setPlayerText("pause");
      }
      
    },[pausedState])


    useEffect(() => {
      console.log("In FLIP ITEM ID: ",item.flipID);
      console.log("Flip Book Name : ",item.bookName);

      if(props.navigation.state.params.numLikes !== undefined &&     
        props.navigation.state.params.numLikes !== null) 
      {
        setNumLikes(props.navigation.state.params.numLikes);
      }
      else
      {
        setNumLikes(props.navigation.state.params.item.numUsersLiked);
      }

      props.navigation.state.params.playerText !== undefined && 
      setPlayerText(props.navigation.state.params.playerText);

      props.navigation.state.params.pausedState !== undefined && 
      setPausedState(props.navigation.state.params.pausedState);
      
      props.navigation.state.params.player !== undefined &&
      setPlayer(props.navigation.state.params.player);

  },[])

  useEffect(() => {
    if(resizeModes.length == item.flipPictures.length)
        setLoadingResizeModes(false);
  },[resizeModes])

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
      id: props.navigation.state.params.item.flipID,
      url: props.navigation.state.params.item.audioFileLink,
      title: props.navigation.state.params.item.bookName,
      artist: props.navigation.state.params.item.creatorName,
      artwork: props.navigation.state.params.item.flipPictures[0],
      duration: props.navigation.state.params.item.duration
    });
    setPlayer(true);
    dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
    await TrackPlayer.play();

  }


    async function retrieveUserData(){
        if(realUserID == props.navigation.state.params.item.creatorID)
            props.navigation.navigate('ProfileTabNavigator');
        else
        {
            const userID = props.navigation.state.params.item.creatorID;
            const privateDataID = "private" + userID;
            const privateDoc = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).get();
            const privateDocumentData = privateDoc.data();
            dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:privateDocumentData})
            props.navigation.navigate('ExploreTabNavigator',{userData:privateDocumentData});
        }
    }

    function renderDots () {
        const dotPosition = Animated.divide(scrollX, width);
        return (
          <View style={[ styles.flex, styles.row, styles.dotsContainer ]}>
            {props.navigation.state.params.item.flipPictures && 
            props.navigation.state.params.item.flipPictures.map((item, index) => {
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

      function updateLocalStateLikes() {
        if(isFlipLikedRedux[props.navigation.state.params.item.flipID]){
          setNumLikes(numLikes-1);
        }
        else{
          setNumLikes(numLikes+1);
        }
      }

      function handleOnSlide(time) {
        TrackPlayer.seekTo(time)
        //props.onSlideCapture({seekTime: time});
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
            <View style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start',marginBottom:5,height:width/15,marginHorizontal:8}}>
              <TouchableOpacity style={{width:width/10,height:width/10,paddingLeft:10}} onPress={() => {
                //setPausedState(false);
                if(playerText == "pause")
                {
                  setPlayerText("play");
                  dispatch({type:"SET_FLIP_PAUSED",payload:true})
                  dispatch({type:"SET_FLIP_PLAYING",payload:false});
                  TrackPlayer.pause();
                }
                else
                {
                  //setLoading(true);
                  setPlayerText("pause")
                  dispatch({type:"SET_FLIP_PAUSED",payload:false})
                  dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
                  if(player == false || (player == true && props.navigation.state.params.item.flipID != currentFlipID)) 
                  {
                    stopPodcast();
                    dispatch({type:"SET_FLIP_ID",payload:props.navigation.state.params.item.flipID});
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
                props.navigation.state.params.item.flipID == currentFlipID 
                ?
                <Text> {getMinutesFromSeconds(Math.floor(position))}</Text>
                :
                <Text> {getMinutesFromSeconds(0)}</Text>
              }
              <View style={{width:width*5/8}}>
                {
                  props.navigation.state.params.item.flipID == currentFlipID 
                  ?
                  <Slider
                    value={position}
                    minimumValue={1}
                    maximumValue={props.navigation.state.params.item.duration/1000 - 1}
                    step={0.01}
                    onValueChange={(value)=>handleOnSlide(value)}
                    //onSlidingStart={handlePlayPause}
                    //onSlidingComplete={handlePlayPause}
                    minimumTrackTintColor={'black'}
                    maximumTrackTintColor={'black'}
                    thumbTintColor={'black'}
                    //disabled={true}
                  />
                  :
                  <Slider
                    value={0}
                    minimumValue={1}
                    maximumValue={props.navigation.state.params.item.duration/1000}
                    step={0.01}
                    //onValueChange={(value)=>handleOnSlide(value)}
                    //onSlidingStart={handlePlayPause}
                    //onSlidingComplete={handlePlayPause}
                    minimumTrackTintColor={'black'}
                    maximumTrackTintColor={'black'}
                    thumbTintColor={'black'}
                    //disabled={true}
                  />
                }
             
               </View>
            <Text>{getMinutesFromSeconds(Math.floor(props.navigation.state.params.item.duration/1000))}</Text>
              </View>
        )
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
                flipDescription : props.navigation.state.params.item.flipDescription,
                flipPictures : props.navigation.state.params.item.flipPictures,
                bookName : props.navigation.state.params.item.bookName,
                editing : true,
                flipID : props.navigation.state.params.item.flipID
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
                    firestore().collection('flips').doc(flipID).delete().then(() => {
                        console.log("Flip Document successfully deleted. ");
                        Toast.show('Flip deleted');
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
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

      async function addLikeToFlipDoc(){

        firestore().collection('users').doc(realUserID).collection('privateUserData')
          .doc(privateUserID).set({
            flipsLiked : firestore.FieldValue.arrayUnion(props.navigation.state.params.item.flipID)
          },{merge:true}).then(() => {
            console.log("Added to flips Liked array in user privaate doc");
          }).catch((err) => console.log("Error in adding flip to liked flips list of user",err))
  
          firestore().collection('flips').doc(props.navigation.state.params.item.flipID).set({
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
              flipID : props.navigation.state.params.item.flipID,
              userID : props.navigation.state.params.item.creatorID,
              flipImageURL : props.navigation.state.params.item.flipPictures[0],
              type : "flipLike",
              Name : nameUser,
              flipTitle : props.navigation.state.params.item.flipTitle,
              bookName : props.navigation.state.params.item.bookName,
            });
          }
          catch (e) 
          {
            console.log(e);
          }
      }
  
      async function removeLikeFromFlipDoc(){
        firestore().collection('users').doc(realUserID).collection('privateUserData')
          .doc(privateUserID).set({
            flipsLiked : firestore.FieldValue.arrayRemove(props.navigation.state.params.item.flipID)
          },{merge:true}).then(() => {
            console.log("Removed from flips Liked array in user privaate doc");
          }).catch((err) => console.log("Error in removing flip from liked flips list of user",err))
  
          firestore().collection('flips').doc(props.navigation.state.params.item.flipID).set({
            numUsersLiked : firestore.FieldValue.increment(-1)
          },{merge:true}).then(() => {
            console.log("subtracted 1 from number of users who liked this flip")
          }).catch((err) => {
            console.log("Error in removing likes from flipDoc",err);
          })
      }

      async function buildDynamicURL() {
        var ans = props.navigation.state.params.item.flipTitle;
        if(ans === undefined || ans === null)
          ans = props.navigation.state.params.item.bookName;
        const link = await dynamicLinks().buildShortLink({
          //link: 'https://newpodcast.com/' + props.podcast.podcastID,
          link: 'https://papyrusapp.page.link/flips/' + props.navigation.state.params.item.flipID,
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
            title: ans,
            descriptionText: props.navigation.state.params.item.flipDescription.slice(0,200),
            imageUrl: props.navigation.state.params.item.flipPictures[0]
          }
        });
      
        console.log("dynamicURL created for the link: ",link);
        Share.share({
          title : ans,
          //url : link,
          message: link
        },{
          dialogTitle: 'Share Flip'
        })
        return link;
      }

      async function updateLikes() {
        if(isFlipLikedRedux[props.navigation.state.params.item.flipID] == true)
        {
          dispatch({type:"REMOVE_FROM_FLIPS_LIKED",payload:props.navigation.state.params.item.flipID})
          removeLikeFromFlipDoc();
          setNumLikes(numLikes-1);
        }
        else
        {
          dispatch({type:"ADD_TO_FLIPS_LIKED",payload:props.navigation.state.params.item.flipID})
          addLikeToFlipDoc();
          setNumLikes(numLikes+1);
        }
      }


    function renderImage(item){
      return (
        <Image
          key={`${item}`}
          source={{ uri: item }}
          resizeMode='contain'
          style={{ width:width, height: width*1.5 }}
        />
      )
    }

    return (
        <ScrollView style={{paddingBottom:0,borderBottomWidth:1,borderTopWidth:1, borderColor:'#dddd'}}>
            <View style={{flexDirection:'row',paddingBottom:0}}>
            <TouchableOpacity 
            onPress={() => retrieveUserData()}
            style={{flexDirection:'row',padding:5}}>
                <View>
                    <Image 
                        source={{uri:props.navigation.state.params.item.creatorPicture}}
                        style={{height:width/12,width :width/12,borderRadius:20}} />
                </View>
                <View style={{borderColor:'black',borderWidth:0,justifyContent:'center'}}>
                    <Text style={{fontFamily:'Montserrat-Bold'}}> {props.navigation.state.params.item.creatorName}</Text>
                     
                </View>            
            </TouchableOpacity>
            <View style={{flex:1,alignItems:'flex-end',justifyContent:"center",paddingRight:5}}>
            {
              props.navigation.state.params.item.bookName !== undefined &&
              <Text style={{fontFamily:'Montserrat-MediumItalic',fontSize:10}}>
                {props.navigation.state.params.item.bookName}
              </Text>
            }
            </View>
            </View>
            <View>
                {/* <Image 
                    source={{uri:props.navigation.state.params.item.flipPictures[0]}}
                    style={{height:width,width :width}}/> */}
                    <Animated.FlatList
                  horizontal
                  pagingEnabled
                  scrollEnabled
                  showsHorizontalScrollIndicator={false}
                  decelerationRate={0.9}
                  scrollEventThrottle={0}
                  snapToInterval={width} 
                  snapToAlignment={"center"}
                  style={{ overflow:'visible', height: width*1.5 }}
                  data={props.navigation.state.params.item.flipPictures}
                  keyExtractor={(item, index) => `${item}`}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    {useNativeDriver:true}
                    )}
                  renderItem={({ item }) => renderImage(item)}
                />
               

            </View>
            <View>
            {
                props.navigation.state.params.item.flipPictures.length > 1 &&
                renderDots()
            }
                </View>
                {
                  props.navigation.state.params.item.isAudioFlip == true &&
                  renderFlipPlayer()
                }
            <View style={{marginHorizontal:5,paddingBottom:height/6}}>
                {
                  props.navigation.state.params.item.flipTitle !== undefined &&
                  <Text style={{fontFamily:'Montserrat-Bold',lineHeight: width/16,fontSize:width/18}}>{props.navigation.state.params.item.flipTitle} </Text>

                }
                <Text style={{fontWeight:'normal', fontFamily:'Montserrat-Regular'}}>{props.navigation.state.params.item.flipDescription} </Text>
                
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{color:"gray",fontSize:10}}>{moment(props.navigation.state.params.item.createdOn).fromNow()}</Text>
                
                {
                  (isAdmin == true || props.navigation.state.params.item.creatorID == realUserID)
                  &&
                  renderMenu()
                }

                
                
                </View>
                <View style={{width:width,flex:1,flexDirection:'row',alignItems:'flex-start'}}>
                <TouchableOpacity style={{paddingLeft:10,paddingTop:10,paddingBottom:10,paddingRight:5}} onPress={() => {
                    if(props.navigation.state.params.updateLikes !== undefined && 
                      props.navigation.state.params.updateLikes !== null)
                    {
                      updateLocalStateLikes();
                      props.navigation.state.params.updateLikes();
                    }
                    else // coming to MainDlipItem from ActivityItem or external link
                    {
                      updateLikes();
                    }

                  }} > 
                  <IconAntDesign 
                    name={isFlipLikedRedux[props.navigation.state.params.item.flipID] ? "heart" : "hearto"}
                    color={isFlipLikedRedux[props.navigation.state.params.item.flipID] ? 'red' : 'black' } 
                    size={16} />
                </TouchableOpacity>
                <TouchableOpacity style={{padding:10}} onPress={() => buildDynamicURL()} > 
                  <Icon name="share" size={16} style={{color:'black'}}/>
                </TouchableOpacity>
                {
                  numLikes != 0 
                  &&
                  <TouchableOpacity onPress={() => {
                    props.navigation.navigate('LikersScreen', {
                      flipID : props.navigation.state.params.item.flipID
                      })}} style={{position:'absolute',padding:10,right:5}}>
                    <Text style={{fontFamily:'Montserrat-Regular'}}>{numLikes} {likeString}</Text>
                  </TouchableOpacity>
                }
                  
                </View>
            </View>
           
        </ScrollView>
    )

  }//, areEqual)

export default withFirebaseHOC(MainFlipItem);


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

       
    
  