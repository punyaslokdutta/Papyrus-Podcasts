// @flow
import * as React from 'react';
import { Dimensions, StyleSheet , Image, StatusBar,SafeAreaView,  TouchableOpacity , View,Text } from 'react-native';
//import {
 // Video, Constants, DangerZone, GestureHandler,
//} from 'expo';

import Slider from "react-native-slider";
import Moment from "moment";



//import { type Video as VideoModel } from './videos';
import PodcastContent from '../screens/components/PodcastPlayer/PodcastContent';
import PlayerControls, { PLACEHOLDER_WIDTH } from './components/PodcastPlayer/PlayerControl';
import Animated, { Easing } from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
//const { Animated, Easing } = DangerZone;
//const { State, PanGestureHandler } = GestureHandler;
const { width, height } = Dimensions.get('window');
const { statusBarHeight } = StatusBar.currentHeight
const minHeight = 64;
const midBound = height - 64 * 3;
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
export default class PodcastPlayer extends React.Component{
  translationY = new Value(0);

  velocityY = new Value(0);

  offsetY = new Value(0);

  offsetY2 = new Value(0);

  gestureState = new Value(State.UNDETERMINED);

  //onGestureEvent: $Call<event>;

  //translateY: Value;

  constructor(props) {
    super(props);
    this.state=
    {
      title: "Book Podcast", 
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
    );
    const clockY = new Clock();
    const finalTranslateY = add(add(translationY, offsetY), multiply(0.2, velocityY));
    const snapPoint = cond(
      lessThan(finalTranslateY, sub(offsetY, height / 4)),
      0,
      upperBound,
    );
    this.translateY = cond(
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
      onGestureEvent, translateY: y, offsetY2,
    } = this;
    const translateY = add(y, offsetY2);
    const { podcast } = this.props;
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
      outputRange: [width, width, PLACEHOLDER_WIDTH],
      extrapolate: Extrapolate.CLAMP,
    });
    const videoHeight = interpolate(translateY, {
      inputRange: [0, midBound, upperBound],
      outputRange: [width -64, minHeight * 1.3, minHeight],
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
    
        
        <PanGestureHandler
          onHandlerStateChange={onGestureEvent}
          activeOffsetY={[-10, 10]}
          {...{ onGestureEvent }}
        >
          <Animated.View
            style={{
              transform: [{ translateY: tY }],
              ...shadow,
            }}
          >
            <Animated.View style={{ backgroundColor: 'white', width: videoContainerWidth }}>
              <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: playerControlOpaciy }}>
                <PlayerControls title={this.state.title} onPress={this.slideUp} />
              </Animated.View>
              <Animated.Image
                source={require('../assets/images/harrypotter2.jpeg')}
                style={{ width: videoWidth, height: videoHeight }}
              />
              
            </Animated.View>
            <Animated.View style={{ backgroundColor: 'white', width: videoContainerWidth, height: containerHeight }}>
              <Animated.View style={{ opacity }}>
                <PodcastContent trackLength={this.state.trackLength} />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        
      
    );
  }
}
