// @flow
import React ,{ useState, useEffect , useRef, useCallback} from 'react';
import { Dimensions, StyleSheet , Image, StatusBar,BackHandler, SafeAreaView,  TouchableNativeFeedback,TouchableOpacity , View,Text, ScrollView, Alert } from 'react-native';
//import {
 // Video, Constants, DangerZone, GestureHandler,
//} from 'expo';

import Slider from "react-native-slider";
import Moment from "moment";

import { HeaderBackButton } from 'react-navigation';
import HomeScreen from './HomeScreen'
import {useSelector, useDispatch} from "react-redux"


import { withNavigation } from 'react-navigation';
import Animated, { Easing } from 'react-native-reanimated';
//const { Value, timing } = Animated;
//import { type Video as VideoModel } from './videos';
import PodcastContent from '../screens/components/PodcastPlayer/PodcastContent';
import PlayerControls, { PLACEHOLDER_WIDTH } from './components/PodcastPlayer/PlayerControl';
//import Animated, { Easing } from 'react-native-reanimated';
import { PanGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler';
//const { Animated, Easing } = DangerZone;
//const { State, PanGestureHandler } = GestureHandler;
const { width, height } = Dimensions.get('window');
const { statusBarHeight } = StatusBar.currentHeight


const minHeight = height/10;
const midBound = (height*10)/11 - height/20;
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
   const   translationY =useRef(new Value(0)).current;

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
   const  isMiniPlayer = useSelector(state=>state.rootReducer.isMiniPlayer);
   const navigation=useSelector(state=>state.userReducer.navigation)
   const  dispatch=useDispatch();

   //componentDidMount
    useEffect(
      () => {
        console.log("Inside useEffect - componentDidMount of PodcastPlayer");
        BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
        return () => {
          console.log(" back_Button_Press Unmounted");
          BackHandler.removeEventListener("hardwareBackPress",  back_Button_Press);
        };
      }, [back_Button_Press])

      useEffect(
        () => {
          console.log("Inside useEffect - componentDidUpdate of PodcastPlayer");
          if(isMiniPlayer)
          {
          slideUp();
          }
          
        }, [props.podcast])
    
      
    //componentDidUpdate
  function slideDown()
  {
    if(!isMiniPlayer)
    {
      dispatch({type:"TOGGLE_MINI_PLAYER"})
      
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
  function back_Button_Press()
  {
    console.log("Inside BackButton Press");
    if(!isMiniPlayer)
    {
      dispatch({type:"TOGGLE_MINI_PLAYER"})
      
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
  return false;
 


    //BackHandler.removeEventListener('hardwareBackPress', this.back_Buttton_Press);

   

 
  }
  // componentWillUnmount()
  // {
  //   BackHandler.removeEventListener('hardwareBackPress', this.back_Buttton_Press);
  // }

  

  // componentDidUpdate(prevProps) {
  //  //BackHandler.addEventListener('hardwareBackPress', this.back_Buttton_Press);
  //   if (prevProps.podcast !== this.props.podcsast) {
  //     this.slideUp();
  //   }
  // }

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
      outputRange: [0, midBound],
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
      outputRange: [height*12/24, minHeight * 1.3, minHeight],
      extrapolate: Extrapolate.CLAMP,
    });
    const videoBorderRadius = interpolate(translateY, {
      inputRange: [0, midBound, upperBound],
      outputRange: [0, 10, 2],
      extrapolate: Extrapolate.CLAMP,
    });
    
    const containerHeight = interpolate(translateY, {
      inputRange: [0, midBound],
      outputRange: [height, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    const playerControlOpaciy = interpolate(translateY, {
      inputRange: [midBound, upperBound],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
    return (
    
      <Animated.View
      style={{
        transform: [{ translateY: tY }],
        ...shadow,
      }}
    >
      {/* <View>
                <TouchableOpacity onPress={NavigationService.navigate('HomeScreen')}>
                  <Text>qqqqqqqqqqqqqqqq</Text>
                  </TouchableOpacity>
                </View> */}

        <PanGestureHandler
          //onHandlerStateChange={onGestureEvent}
          activeOffsetY={[-10, 10]}
          //{...{ onGestureEvent }}
        >
          <TouchableNativeFeedback onPress={slideDown}>
            <Animated.View style={{ backgroundColor: 'white', width: videoContainerWidth }}>
              <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: playerControlOpaciy }}>
                <PlayerControls title={props.podcast.Podcast_Name} onPress={slideUp}      />
              </Animated.View>
              <Animated.Image
                source={{uri:props.podcast.Podcast_Pictures[0]}}
                style={{ width: videoWidth, height: videoHeight, borderColor:'black' }}
              />

               </Animated.View>
               </TouchableNativeFeedback>
               </PanGestureHandler>
               <ScrollView  scrollEventThrottle={16} >
              
            
            <Animated.View style={{ backgroundColor: 'white', width: videoContainerWidth, height: containerHeight }}>
              <Animated.View style={{ opacity }}>
                <PodcastContent  podcast={props.podcast} navigation={navigation} slideDown={slideDown} />
              </Animated.View>
            </Animated.View>
            </ScrollView> 


            </Animated.View>    
    );
  
}

export default PodcastPlayer;
