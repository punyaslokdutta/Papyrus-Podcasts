// @flow
import React ,{ useState, useEffect , useRef, useCallback} from 'react';
import { StyleSheet , Image, StatusBar,BackHandler, SafeAreaView,  TouchableNativeFeedback,TouchableOpacity , View,Text, ScrollView, Alert, Dimensions } from 'react-native';
import {useSelector, useDispatch,connect} from "react-redux"
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
  block,
  call,
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

  //console.log("[runSpring] position: ",state.position);
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



class PodcastPlayer extends React.Component {


  //const [state, changeState]=useState(0)
  //Animation values
  translationY = new Value(0);

  velocityY = new Value(0);

  offsetY = new Value(0);

  offsetY2 = new Value(0);

  gestureState = new Value(State.UNDETERMINED);

  translateY = new Value(0);

  snapPoint = new Value(0);
  
  finalTranslateY = new Value(0);
  //onGestureEvent: $Call<event>

  constructor(props){
    super(props);
    const {
      translationY, velocityY, offsetY, gestureState: state, offsetY2,
    } = this;

    this.onGestureEvent = event(
      [
        {
          nativeEvent: ({ translationY, velocityY, state })
          // nativeEvent: ({ translationY:y, velocityY:vY, state:s }) =>

          // block([
          //   // debug('x', _translateX),
          //   //call([], () => console.log("the code block was executed",translateY)),
          //    set(this.translationY,y),
          //    set(this.velocityY,vY),
          //    set(this.gestureState,s)
          // ]),
        },
      ],
      { useNativeDriver: true,
        listener: (event) => {
          const {absoluteX, translationX} = event.nativeEvent;
          console.log("absoluteX: ");
          //console.log('translationX' + translationX);
          //console.log('dest' + _translateX._value);
      }},
     ) 

     const clockY = new Clock();
     
     this.finalTranslateY = add(add(translationY, offsetY), multiply(2, velocityY));
     this.snapPoint = cond(
       lessThan(this.finalTranslateY, sub(offsetY, height/4)),
       0,
       upperBound,
     );
      //console.log("snapPoint: ",snapPoint.__inputNodes);
     this.translateY = cond(
      eq(state, State.END),
      [
        set(translationY, runSpring(clockY, add(translationY, offsetY), this.snapPoint)),
        set(offsetY, translationY),
        translationY,
      ],
      [
        cond(eq(state, State.BEGAN), [
          stopClock(clockY),
          cond(neq(offsetY2, 0), [
            set(offsetY, 0),
            set(offsetY2, 0),
          ]),
        ]),
        add(offsetY, translationY),

      ],
    );

  }




  componentDidUpdate(prevProps) {
    // if (prevProps !== this.props) {
    //    this.slideUp();
    //  }
    if(!this.props.isMiniPlayer)
    {
      this.velocityY.setValue(-8000);

    }
    console.log("In componentDidUpdate")

  }

  

  //translateY: Value;

     




    //BackHandler.addEventListener('hardwareBackPress', this.back_Buttton_Press);
   

   //console.log("navBarHeight: ",navBarHeight)
   //const  dispatch=useDispatch();

   componentDidMount = () => {
        console.log("Inside useEffect - componentDidMount of PodcastPlayer");
        //console.log("this.translate Value: ",this.translateY)
        this.setLastPlayingPodcastInUserPrivateDoc(null);
        BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
        //componentDidUnmount
        // return () => {
        //   console.log(" back_Button_Press Unmounted");
        //   BackHandler.removeEventListener("hardwareBackPress",  this.back_Button_Press);
        // };
      }

  componentWillUnmount = () => {
    console.log(" back_Button_Press Unmounted");
    BackHandler.removeEventListener("hardwareBackPress",  this.back_Button_Press);   
  }


    //componentDidUpdate
  slideDown = () =>
  {
    if(!this.props.isMiniPlayer)
    {
      //this.props.toggleMiniPlayer();
      //this.props.removeAllHearts();
      console.log("this.offsetY = ",this.offsetY._value)
      //this.offsetY.setValue(-100);
      this.velocityY.setValue(8000);
      timing(this.offsetY, {
        toValue: upperBound,
        duration: 1000,
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
        //this.slideUp();
      }
  }
  
    setLastPlayingPodcastInUserPrivateDoc = async (podcastID) =>
      {
        console.log("Inside setLastPlayingPodcastInUserPrivateDoc");
        const  userID = this.props.userID;
        const privateUserID = "private" + userID;
        console.log("podcastID: ",podcastID);
        if(podcastID === null)
          return;
        await firestore().collection('users').doc(userID).collection('privateUserData').
              doc(privateUserID).set({
                lastPlayingPodcastID : podcastID,
                lastPlayingCurrentTime : this.props.currentTime
              },{merge:true}).then(function(){
                console.log("lastPlayingPodcastID set to NULL");
              })
              .catch((error) => {
                console.log("Error in setting lastPlayingPodcastID: ",error);
              })
      }

  back_Button_Press = () =>
  {
    console.log("Inside BackButton Press");
    if(!this.props.isMiniPlayer)
    {
      //this.props.toggleMiniPlayer();
      // this.props.removeAllHearts();

      // timing(this.offsetY, {
      //   toValue: upperBound,
      //   duration: 1000,
      //   easing: Easing.inOut(Easing.ease),
      //   useNativeDriver: true
      // }).start();
      this.slideDown();

     // dispatch({type:"TOGGLE_MINI_PLAYER"})
      return true;
      //dispatch({type:"TOGGLE_MINI_PLAYER"})
  }
  console.log("Back Butttttton: ",this.props.podcast.podcastID);
  if(this.props.podcast!==null)
  {
    this.setLastPlayingPodcastInUserPrivateDoc(this.props.podcast.podcastID);
    //dispatch({type:"SET_PODCAST", payload: null});
  }
  return false;
    //BackHandler.removeEventListener('hardwareBackPress', this.back_Buttton_Press);
  }

  slideUp = () => {
    //this.props.toggleMiniPlayer();
    console.log("sliding UP");
    this.velocityY.setValue(-8000);
    timing(this.offsetY, {
    toValue: 0,
    duration: 1000,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true
  }).start();
}

render() {
    const  {onGestureEvent, onGestureEvent1,translateY:y, offsetY2} = this ;
    const translateY = add(y, offsetY2);
    const { podcast } = this.props;

    //console.log("this.gestureState: ",this.gestureState);

    const tY = interpolate(translateY, {
      inputRange: [0, midBound],
      outputRange: [0, midBound-this.props.navBarHeight],
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

    
      return (

        

        <Animated.View
        style={{
          transform: [{ translateY: tY }],
          //...shadow,
        }}
      >
        <Animated.Code>
        {
          () => call([this.translateY,this.velocityY,this.snapPoint,this.offsetY,this.offsetY2,this.translationY,this.finalTranslateY], 
            ([val,val6,val4,val1,val2,val3,val5]) => {
            // console.log("this.translateY = ",val)
            // console.log("this.translationY = ",val3)
            // console.log("this.finalTranslateY = ",val5)
            //console.log("this.snapPoint = ",val4)
            // console.log("this.offsetY = ",val1)
            // console.log("this.offsetY2 = ",val2)
            // console.log("this.velocityY = ",val6)

            // console.log("upperBound = ",upperBound)
            // console.log("midBound = ",midBound)
            // console.log("height = ",height)
            val == upperBound && !this.props.isMiniPlayer && this.props.toggleMiniPlayer();
            val == 0 && this.props.isMiniPlayer && this.props.toggleMiniPlayer();
          })
        }
 </Animated.Code>
 
            <PanGestureHandler
                onHandlerStateChange={onGestureEvent}
                activeOffsetY={[-10, 10]}
                {...{ onGestureEvent }}
            >
           
              
                 
              <Animated.View style={{ backgroundColor: '#212121', width: videoContainerWidth }}>
              
              <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: playerControlOpaciy }}>
              <PlayerControls back_Button_Press={this.back_Button_Press} setLastPlayingPodcastInUserPrivateDoc={this.setLastPlayingPodcastInUserPrivateDoc} podcastName={this.props.podcast.podcastName} bookName={this.props.podcast.bookName} userID={this.props.userID} onPress={this.slideUp}      />
              </Animated.View>
                
                
                {/* <TouchableNativeFeedback onPress={() => {
                  if(!this.props.isMiniPlayer)
                  {
                    this.slideDown()
                    this.props.navigation.navigate('InfoScreen', {podcast:this.props.podcast});
                  }
                  else
                  {
                    this.slideUp();
                  }
  
                }}> */}
                <Animated.Image
                  source={{uri:this.props.podcast.podcastPictures[0]}}
                  resizeMode='contain'
                  style={{ width: videoWidth, height: videoHeight, borderColor:'black',borderRadius:5 }}
                />
                {/* </TouchableNativeFeedback> */}
                  {/* {
                    !this.props.isMiniPlayer && <IconAntDesign name="downcircleo" size={30} color='black' style={{
                    //width: width/15,  
                    //height: width/10,   
                    borderRadius: 30,            
                    backgroundColor: '#dddd',                                    
                    position: 'absolute',                                          
                    top: height/50,                                                    
                    left: width/20, }}/>
                  } */}
  
                 </Animated.View>
                 </PanGestureHandler>
                
  
                 <View>
              <Animated.View style={{ backgroundColor: '#212121', width: videoContainerWidth, height: containerHeight }}>
                <Animated.View style={{ opacity }}>
                <PodcastContent userID={this.props.userID} podcast={this.props.podcast} navigation={this.props.navigation} slideDown={this.slideDown} />
                </Animated.View>
              </Animated.View>
              </View>
  
              </Animated.View>
      );
    }
    
}

//export default withFirebaseHOC(PodcastPlayer);
const mapStateToProps = (state) => {
  return{
    currentTime: state.rootReducer.currentTime,
    isMiniPlayer: state.rootReducer.isMiniPlayer,
    navigation: state.userReducer.navigation,
    navBarHeight: state.userReducer.navBarHeight,
    lastPlayingPodcastID: state.userReducer.lastPlayingPodcastID
  }}

  const mapDispatchToProps = (dispatch) =>{
    return{
    toggleMiniPlayer:() => dispatch({type:"TOGGLE_MINI_PLAYER"}),
    removeAllHearts:() => dispatch({type:"REMOVE_ALL_HEARTS"})
    }}
export default connect(mapStateToProps,mapDispatchToProps)(PodcastPlayer)

  