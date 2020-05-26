

import React from 'react';
import LottieView from 'lottie-react-native';
import {ScrollView,Dimensions} from 'react-native';
import backwardIcon from '../../../assets/animations/lf30_editor_ELEuLb.json';
import { TouchableOpacity } from 'react-native-gesture-handler';

const {width,height} = Dimensions.get('window')


export default class Backwardanimation extends React.Component {
  
  componentDidMount = () => {
    this.animation.play(30,30);
  }
  
  render() {
    return(
      <TouchableOpacity onPress={()=> {
        this.animation.play(0,30);
        this.props.skipBackward();
        //setTimeout(1);

        //this.animation.pause();
      }}>
        <LottieView ref={animation => {
          this.animation = animation;
        }} style={{ height: height/12}} source={backwardIcon} loop={false}/>                    
      </TouchableOpacity>
    );    
  }
}








