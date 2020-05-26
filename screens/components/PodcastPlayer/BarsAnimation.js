import React from 'react';
import LottieView from 'lottie-react-native';
import {ScrollView,Dimensions,StyleSheet,View} from 'react-native';
import bars from '../../../assets/animations/19751-music-volume-white.json';

const {width,height} = Dimensions.get('window')


export default class BarsAnimation extends React.Component {
  
  componentDidMount = () => {
    // if(this.props.paused)
    //     this.animation.pause();
    // else
        this.animation.play(0,30);
  }

  componentDidUpdate = (prevProps) => {
      if(this.props.paused)
        this.animation.pause();
     else if(prevProps.paused)
       this.animation.play(0,30);
  }
  
  render() {
    return(
            <LottieView ref={animation => { this.animation = animation;}} 
            style={{ height: height/16}} source={bars} 
            loop={true}/>                        
    );    
  }
}