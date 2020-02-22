// @flow
import * as React from 'react';
import NavigationService from './navigation/NavigationService'
import { Dimensions, StyleSheet , Image, StatusBar,SafeAreaView,  TouchableOpacity , View,Text, ScrollView,BackHandler,Alert } from 'react-native';
//import {
 // Video, Constants, DangerZone, GestureHandler,
//} from 'expo';

import Slider from "react-native-slider";
import Moment from "moment";
import { HeaderBackButton } from 'react-navigation';
import HomeScreen from './HomeScreen'

import { withNavigation } from 'react-navigation';
import Animated, { Easing } from 'react-native-reanimated';
//const { Value, timing } = Animated;
//import { type Video as VideoModel } from './videos';
import PodcastContent from '../screens/components/PodcastPlayer/PodcastContent';
import PlayerControls, { PLACEHOLDER_WIDTH } from './components/PodcastPlayer/PlayerControl';

import { PanGestureHandler, State } from 'react-native-gesture-handler';
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




const audioBookPlaylist = [
  {
    title: 'Hamlet - Act I',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act1_shakespeare.mp3',
    imageSource:
      'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
]


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

/*type VideoModalProps = {
  video: VideoModel,
};
*/
class PodcastPlayer extends React.Component{

  static navigationOptions = ({navigation}) => {
    return{
      headerLeft:(<HeaderBackButton onPress={()=>{NavigationService.navigate('HomeScreen')}}/>)
   }
  }
  translationY = new Value(0);

  velocityY = new Value(0);

  offsetY = new Value(0);

  offsetY2 = new Value(0);

  gestureState = new Value(State.UNDETERMINED);

  //onGestureEvent: $Call<event>;

  //translateYRef: Value;

  constructor(props) {
    super(props);
    this.back_Button_Press = this.back_Button_Press.bind(this);
    this.state=
    {
     // title: "Book Podcast", 
        trackLength: 300,
        timeElapsed: "0:00",
        timeRemaining: "5:00",
    }
    const {
      translationY, velocityY, offsetY, gestureState: state, offsetY2,
    } = this;
    this.onGestureEvent = event(
      [
        {
          nativeEvent: {
            translationY,
            velocityY,
            state,
          },
        },
      ],
      { useNativeDriver: true },
     // {slideUp();}
    );
    const clockY = new Clock();
    const finalTranslateY = add(add(translationY, offsetY), multiply(0.2, velocityY));
    const snapPoint = cond(
      lessThan(finalTranslateY, sub(offsetY, height / 4)),
      0,
      upperBound,
    );
    this.translateYRef = cond(
      eq(state, State.END),
      [
        set(translationY, runSpring(clockY, add(translationY, offsetY), snapPoint)),
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

  
  back_Button_Press = (navigation) => {
   
      // Put your own code here, which you want to exexute on back button press.
      console.log("In back button press")
      console.log(this.props)
      // Alert.alert(
      //   ' Exit From App ',
      //   ' Do you want to exit From App ?',
      //   [
      //     { text: 'Yes', onPress: () => this.props.navigation.goBack() },
      //     { text: 'No', onPress: () => console.log('NO Pressed') }
      //   ],
      //   { cancelable: false },
      // );
         
      this.props.navigation.pop(2);

      // Return true to enable back button over ride.
      return true;
    }



componentWillMount() {
 
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
  }


componentWillUnmount() {
  
    BackHandler.removeEventListener('hardwareBackPress', this.back_Button_Press);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.slideUp();
    }
  }

  slideUp = () => timing(this.offsetY2, {
    toValue: -upperBound,
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  }).start();

  render() {
   
    const {
      onGestureEvent, translateYRef:x, offsetY2,
    } = this;
    const translateYR = add(x, offsetY2);
    const { podcast } = this.props;
    const tY = interpolate(translateYR, {
      inputRange: [0, midBound],
      outputRange: [0, midBound],
      extrapolate: Extrapolate.CLAMP,
    });
    const opacity = interpolate(translateYR, {
      inputRange: [0, midBound - 100],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    const statusBarOpacity = interpolate(translateYR, {
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolateLeft: Extrapolate.CLAMP,
    });
    const videoContainerWidth = interpolate(translateYR, {
      inputRange: [0, midBound],
      outputRange: [width, width],
      extrapolate: Extrapolate.CLAMP,
    });
    const videoWidth = interpolate(translateYR, {
      inputRange: [0, midBound, upperBound],
      outputRange: [width, width  , PLACEHOLDER_WIDTH],
      extrapolate: Extrapolate.CLAMP,
    });
    const videoHeight = interpolate(translateYR, {
      inputRange: [0, midBound, upperBound],
      outputRange: [height*12/24, minHeight * 1.3, minHeight],
      extrapolate: Extrapolate.CLAMP,
    });
    
    const containerHeight = interpolate(translateYR, {
      inputRange: [0, midBound],
      outputRange: [height, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    const playerControlOpaciy = interpolate(translateYR, {
      inputRange: [midBound, upperBound],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
    console.log("In THIS of PodcastPlayer : ",this);
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
          onHandlerStateChange={onGestureEvent}
          activeOffsetY={[-10, 10]}
          {...{ onGestureEvent }}
        >
          
            <Animated.View style={{ backgroundColor: 'white', width: videoContainerWidth }}>
              <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: playerControlOpaciy }}>
                <PlayerControls title={this.props.podcast.Podcast_Name} onPress={this.slideUp} />
              </Animated.View>
              <Animated.Image
                source={{uri:this.props.podcast.Podcast_Pictures[0]}}
                style={{ width: videoWidth, height: videoHeight }}
              />

               </Animated.View>

               </PanGestureHandler>
               <ScrollView  scrollEventThrottle={16} >
              
            
            <Animated.View style={{ backgroundColor: 'white', width: videoContainerWidth, height: containerHeight }}>
              <Animated.View style={{ opacity }}>
                <PodcastContent /*trackLength={this.state.trackLength}*/ podcast={this.props.podcast} />
              </Animated.View>
            </Animated.View>
            </ScrollView> 


            </Animated.View>    
    );
  }
}

export default PodcastPlayer;
