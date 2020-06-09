

import React from 'react';
import LottieView from 'lottie-react-native';
import {ScrollView,Dimensions,StyleSheet,View} from 'react-native';
import playPause from '../../../assets/animations/play_pause.json';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from "react-redux";

const {width,height} = Dimensions.get('window')


class PlayPauseOut extends React.Component {
  
  componentDidMount = () => {
    this.animation.play(30,30);
  }

  componentDidUpdate =(prevProps)=>
  {
      if(!prevProps.paused && this.props.paused)
      {
        this.animation.play(30,60);
      }
      if(prevProps.paused && !this.props.paused)
      {
        this.animation.play(0,30);
      }
  }
  
  render() {
    return(

        
            //!loadingPodcast && !paused  && 
        <TouchableOpacity  onPress={()=>{
                if(!this.props.loadingPodcast && !this.props.paused)
                {
                    this.animation.play(30,60);
                    this.props.pausePodcast();
                }
                else if(!this.props.loadingPodcast && this.props.paused)
                {
                    this.animation.play(0,30);
                    this.props.pausePodcast();
                }
          }}>
            <View style={styles.playButtonContainer}>
            <LottieView ref={animation => { this.animation = animation;}} 
            style={{ height: height/9,color:'white',borderRadius:30,position:'absolute'}} source={playPause} 
            loop={false}/>
            </View>
        </TouchableOpacity>                         
    );    
  }
}

//export default PlayPauseOut;

const mapStateToProps = (state) => {
  return{
  paused: state.rootReducer.paused
  }}

export default connect(mapStateToProps,null)(PlayPauseOut)





const styles = StyleSheet.create({
    playButtonContainer: {
        position:'absolute',
        top:0,
        left:0,
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 2,
        width: height/10,
        height: height/10,
        borderRadius: 64,
        justifyContent: "center",
        marginHorizontal: 32,
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5, 
        
    }
})






