// @flow
import React ,{ useState, useEffect , useRef, useCallback} from 'react';
import { StyleSheet , Image, StatusBar,BackHandler, SafeAreaView,  TouchableNativeFeedback,TouchableOpacity , View,Text, ScrollView, Alert, Dimensions } from 'react-native';
import {useSelector, useDispatch,connect} from "react-redux"
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Animated, { Easing } from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import IconAntDesign from 'react-native-vector-icons/AntDesign'

import { PanGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler';
var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window');
const height =ExtraDimensions.getRealWindowHeight();
const width=ExtraDimensions.getRealWindowWidth();
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();
//const isNotchEnabled= SCREEN_HEIGHT+
const SOFT_MENU_BAR_HEIGHT =  (ExtraDimensions.getSoftMenuBarHeight() === 0) ? 0 :ExtraDimensions.getSoftMenuBarHeight();
const minHeight = height/15;
const midBound = (height*14)/15 - (height/10 ); //upper edge of miniPlayer
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


class MusicPlayer extends React.Component {

render() {   
      return (
        <View style={{backgroundColor:'black',borderTopLeftRadius:10,borderBottomLeftRadius:10, height:40,width:70,position:'absolute',right:0,bottom:height/8,justifyContent:'center',alignItems:'center'}}>
            <IconAntDesign name="play" size={20} color={'white'}/>
            </View>
      );
    }
    
}

//export default withFirebaseHOC(MusicPlayer);
const mapStateToProps = (state) => {
  return{
    navigation: state.userReducer.navigation,
    navBarHeight: state.userReducer.navBarHeight
  }}

  const mapDispatchToProps = (dispatch) =>{
    return{
    
    }}
export default connect(mapStateToProps,mapDispatchToProps)(MusicPlayer)

  