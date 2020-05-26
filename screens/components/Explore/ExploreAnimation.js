

import React from 'react';
import LottieView from 'lottie-react-native';
import newAnimation from '../../../assets/animations/1012-construction-site.json'
import {ScrollView,Dimensions} from 'react-native';

const {width,height} = Dimensions.get('window')


export default class ExploreAnimation extends React.Component {
  render() {
    return(
      <ScrollView>
        
      <LottieView style={{
        width:width/2}} source={newAnimation} autoPlay loop />
        </ScrollView>);
    
  }
}








