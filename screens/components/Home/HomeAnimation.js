

import React from 'react';
import LottieView from 'lottie-react-native';
import newAnimation from '../../../assets/animations/homeFinalAnimation.json';
import {ScrollView,Dimensions} from 'react-native';

const {width,height} = Dimensions.get('window')


export default class HomeAnimation extends React.Component {
  render() {
    return(
      
        
      <LottieView style={{
       
        height: height*7/24,
        width: 300}} source={newAnimation} autoPlay loop />
        );
    
  }
}








