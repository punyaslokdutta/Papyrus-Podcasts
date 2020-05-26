

import React from 'react';
import LottieView from 'lottie-react-native';
import {ScrollView,Dimensions} from 'react-native';
import forwardIcon from '../../../assets/animations/lf30_editor_gLIPFK.json';
import { TouchableOpacity } from 'react-native-gesture-handler';

const {width,height} = Dimensions.get('window')


export default class Forwardanimation extends React.Component {
  
  componentDidMount = () => {
    this.animation.play(30,30);
  }
  
  render() {
    return(
      <TouchableOpacity onPress={()=> {
        this.animation.play(0,30);
        this.props.skipForward();
        //setTimeout(1);

        //this.animation.pause();
      }}>
        <LottieView ref={animation => {
          this.animation = animation;
        }} style={{ height: height/12}} source={forwardIcon} loop={false}/>                    
      </TouchableOpacity>
    );    
  }
}








