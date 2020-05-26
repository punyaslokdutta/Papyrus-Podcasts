// @flow
import React ,{ useState, useEffect , useRef, useCallback} from 'react';
import { StyleSheet , Image, StatusBar,BackHandler, SafeAreaView,  TouchableNativeFeedback,TouchableOpacity , View,Text, ScrollView, Alert, Dimensions } from 'react-native';
import {useSelector, useDispatch} from "react-redux"
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Animated, { Easing } from 'react-native-reanimated';
import PodcastContent from '../screens/components/PodcastPlayer/PodcastContent';
import firestore from '@react-native-firebase/firestore';
import PlayerControls, { PLACEHOLDER_WIDTH } from './components/PodcastPlayer/PlayerControl';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import {withFirebaseHOC} from './config/Firebase';

import { PanGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler';
var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window');
const height =ExtraDimensions.getRealWindowHeight();
const width=ExtraDimensions.getRealWindowWidth();
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();
//const isNotchEnabled= SCREEN_HEIGHT+
const SOFT_MENU_BAR_HEIGHT =  (ExtraDimensions.getSoftMenuBarHeight() === 0) ? 0 :ExtraDimensions.getSoftMenuBarHeight();
const minHeight = height/12;
const midBound = (height*10)/11 - (height*33/288 );
const upperBound = midBound + minHeight;
const {
  Extrapolate,
  Value,
  Clock,
  cond,
  eq,
  set,
  add,
  sub,
  multiply,
  lessThan,
  clockRunning,
  startClock,
  spring,
  stopClock,
  event,
  interpolate,
  timing,
  neq,
} = Animated;
//const AnimatedVideo = Animated.createAnimatedComponent(Video);
const shadow = {
  alignItems: 'center',
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.18,
  shadowRadius: 2,
};


/*type VideoModalProps = {
  video: VideoModel,
};
*/
const PodcastPlayer=(props)=>{


  //const [state, changeState]=useState(0)
  //Animation values
   const translationY =useRef(new Value(0)).current;

  const velocityY = useRef(new Value(0)).current;

  const offsetY = useRef(new Value(0)).current;

  const offsetY2 = useRef(new Value(0)).current;

  const gestureState = useRef(new Value(State.UNDETERMINED)).current;

  function runSpring(clock, value, dest) {
    const state = {
      finished: new Value(0),
      velocity: new Value(0),
      position: new Value(0),
      time: new Value(0),
    };

    const config = {
      damping: 20,
      mass: 1,
      stiffness: 100,
      overshootClamping: false,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      toValue: new Value(0),
    };

    return [
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.velocity, 0),
        set(state.position, value),
        set(config.toValue, dest),
        startClock(clock),
      ]),
      spring(clock, state, config),
      cond(state.finished, stopClock(clock)),
      state.position,
    ];
  }


  //onGestureEvent: $Call<event>;

  //translateY: Value;



    // const {
    //   translationY, velocityY, offsetY, gestureState: state, offsetY2,
    // } = this;
    const onGestureEvent = (
      event(
      [
        {
          nativeEvent: {
            translationY,//:translationYRef.current,
            velocityY,//:velocityYRef.current,
            gestureState,//:gestureStateRef.current,
          },
        },
      ],
      { useNativeDriver: true },

    )


      );


    const clockY = useRef(new Clock()).current;
    const finalTranslateY = useRef(add(add(translationY, offsetY), multiply(0.2, velocityY))).current;
    const snapPoint = useRef(cond(
      lessThan(finalTranslateY, sub(offsetY, height / 4)),
      0,
      0,
    )).current;
    console.log()

     const translateY = useRef(cond(
      eq(gestureState, State.END),
      [
        set(translationY, runSpring(clockY, add(translationY, offsetY), snapPoint)),
        set(offsetY, translationY),
        translationY,
      ],
      [
        cond(eq(gestureState, State.BEGAN), [
          stopClock(clockY),
          cond(neq(offsetY2, 0), [
            set(offsetY, 0),
            set(offsetY2, 0),
          ]),
        ]),
        add(offsetY, translationY),
      ],
    )).current;




    //BackHandler.addEventListener('hardwareBackPress', this.back_Buttton_Press);
   const currentTime=useSelector(state=>state.rootReducer.currentTime); 
   const [currentTimeState,setCurrentTimeState] = useState(currentTime);
   const  isMiniPlayer = useSelector(state=>state.rootReducer.isMiniPlayer);
   const navigation=useSelector(state=>state.userReducer.navigation)
   const navBarHeight = useSelector(state=>state.userReducer.navBarHeight);
   const lastPlayingPodcastID = useSelector(state=>state.userReducer.lastPlayingPodcastID);

   console.log("navBarHeight: ",navBarHeight)
   const  dispatch=useDispatch();

   //componentDidMount
    useEffect(
      () => {
        console.log("Inside useEffect - componentDidMount of PodcastPlayer");
        
        setLastPlayingPodcastInUserPrivateDoc(null);
        BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
        return () => {
          console.log(" back_Button_Press Unmounted");
          BackHandler.removeEventListener("hardwareBackPress",  back_Button_Press);
        };
      }, [back_Button_Press])

      useEffect(
        () => {
          console.log("Inside useEffect - componentDidUpdate of PodcastPlayer");
          // if(isMiniPlayer)
          // {
          // slideUp();
          // }
          // if(!isMiniPlayer)
          // slideDown();
          if(lastPlayingPodcastID != null)
          {
            dispatch({type:"SET_PAUSED",payload:true})
            slideDown();
            dispatch({type:"SET_LAST_PLAYING_PODCASTID",payload:null});
          }

        }, [props.podcast])


    //componentDidUpdate
  function slideDown()
  {
    if(!isMiniPlayer)
    {
      dispatch({type:"TOGGLE_MINI_PLAYER"})
      dispatch({type:"REMOVE_ALL_HEARTS"});
      timing(offsetY, {
        toValue: upperBound,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }).start();

     // dispatch({type:"TOGGLE_MINI_PLAYER"})


      //return true;
      //dispatch({type:"TOGGLE_MINI_PLAYER"})

    }
    else
    {
      //dispatch({type:"TOGGLE_MINI_PLAYER"})
      slideUp();
    }
  }
  
    async function setLastPlayingPodcastInUserPrivateDoc(podcastID)
      {
        console.log("Inside setLastPlayingPodcastInUserPrivateDoc");
        const  userID = props.userID;
        const privateUserID = "private" + userID;
        console.log("podcastID: ",podcastID);
        if(podcastID === null)
          return;
        await firestore().collection('users').doc(userID).collection('privateUserData').
              doc(privateUserID).set({
                lastPlayingPodcastID : podcastID,
                lastPlayingCurrentTime : currentTime
              },{merge:true}).then(function(){
                console.log("lastPlayingPodcastID set to NULL");
              })
              .catch((error) => {
                console.log("Error in setting lastPlayingPodcastID: ",error);
              })
      }

  function back_Button_Press()
  {
    console.log("Inside BackButton Press");
    if(!isMiniPlayer)
    {
      dispatch({type:"TOGGLE_MINI_PLAYER"})
      dispatch({type:"REMOVE_ALL_HEARTS"});

      timing(offsetY, {
        toValue: upperBound,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }).start();

     // dispatch({type:"TOGGLE_MINI_PLAYER"})
      return true;
      //dispatch({type:"TOGGLE_MINI_PLAYER"})
  }
  console.log("Back Butttttton: ",props.podcast.podcastID);
  if(props.podcast!==null)
  {
    setLastPlayingPodcastInUserPrivateDoc(props.podcast.podcastID);
    //dispatch({type:"SET_PODCAST", payload: null});
  }
  return false;
    //BackHandler.removeEventListener('hardwareBackPress', this.back_Buttton_Press);
  }

  function slideUp(){
    dispatch({type:"TOGGLE_MINI_PLAYER"})
    timing(offsetY, {
    toValue: -upperBound,
    duration: 1000,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true
  }).start();
}


    //const  onGestureEvent, translateY, offsetY2 ;
     //const translateY = add(y, offsetY2);
    // const { podcast } = this.props;


    const tY = interpolate(translateY, {
      inputRange: [0, midBound],
      outputRange: [0, midBound-navBarHeight],
      extrapolate: Extrapolate.CLAMP,
    });
    const opacity = interpolate(translateY, {
      inputRange: [0, midBound - 100],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    const statusBarOpacity = interpolate(translateY, {
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolateLeft: Extrapolate.CLAMP,
    });
    const videoContainerWidth = interpolate(translateY, {
      inputRange: [0, midBound],
      outputRange: [width, width],
      extrapolate: Extrapolate.CLAMP,
    });
    const videoWidth = interpolate(translateY, {
      inputRange: [0, midBound, upperBound],
      outputRange: [width, width  , PLACEHOLDER_WIDTH],
      extrapolate: Extrapolate.CLAMP,
    });
    const videoHeight = interpolate(translateY, {
      inputRange: [0, midBound, upperBound],
      outputRange: [height*6/24, minHeight * 1.3, minHeight],
      extrapolate: Extrapolate.CLAMP,
    });
    const videoBorderRadius = interpolate(translateY, {
      inputRange: [0, midBound, upperBound],
      outputRange: [0, 10, 2],
      extrapolate: Extrapolate.CLAMP,
    });

    const containerHeight = interpolate(translateY, {
      inputRange: [0, midBound],
      outputRange: [height*4/4, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    const playerControlOpaciy = interpolate(translateY, {
      inputRange: [midBound, upperBound],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
    console.log("In THIS of PodcastPlayer : ",this);
    return (

      <Animated.View
      style={{
        transform: [{ translateY: tY }],
        //...shadow,
      }}
    >
          <TouchableNativeFeedback onPress={slideDown}>
            <View>
               
            <Animated.View style={{ backgroundColor: '#212121', width: videoContainerWidth }}>
            
            <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: playerControlOpaciy }}>
            <PlayerControls setLastPlayingPodcastInUserPrivateDoc={setLastPlayingPodcastInUserPrivateDoc} podcastName={props.podcast.podcastName} bookName={props.podcast.bookName} userID={props.userID} onPress={slideUp}      />
            </Animated.View>
              
              
              <TouchableNativeFeedback onPress={() => {
                if(!isMiniPlayer)
                {
                  slideDown()
                  props.navigation.navigate('InfoScreen', {podcast:props.podcast});
                }
                else
                {
                  slideUp();
                }

              }}>
              <Animated.Image
                source={{uri:props.podcast.podcastPictures[0]}}
                resizeMode='contain'
                style={{ width: videoWidth, height: videoHeight, borderColor:'black',borderRadius:5 }}
              />
              </TouchableNativeFeedback>
                {
                  !isMiniPlayer && <IconAntDesign name="downcircleo" size={30} color='black' style={{
                  //width: width/15,  
                  //height: width/10,   
                  borderRadius: 30,            
                  backgroundColor: '#dddd',                                    
                  position: 'absolute',                                          
                  top: height/50,                                                    
                  left: width/20, }}/>
                }

               </Animated.View>
               </View>
               </TouchableNativeFeedback>

               <View>
            <Animated.View style={{ backgroundColor: '#212121', width: videoContainerWidth, height: containerHeight }}>
              <Animated.View style={{ opacity }}>
              <PodcastContent userID={props.userID} podcast={props.podcast} navigation={navigation} slideDown={slideDown} />
              </Animated.View>
            </Animated.View>
            </View>

            </Animated.View>
    );

}

export default withFirebaseHOC(PodcastPlayer);