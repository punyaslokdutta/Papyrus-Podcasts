

import React from 'react';
import LottieView from 'lottie-react-native';
import newAnimation from '../../../assets/animations/waves_modified.json'
import {ScrollView,Dimensions} from 'react-native';
import {connect} from "react-redux";

const {width,height} = Dimensions.get('window')


class PodcastAnimation extends React.Component {
  
    componentDidMount = () => {
        this.animation.play(0,0);
      }
  
    componentDidUpdate =(prevProps)=>{ 
        
        // if(prevProps.podcast !== null && this.props.podcast === null)
        //     this.animation.pause();
        // if(prevProps.podcast !== null && this.props.podcast !== null && this.p)
        //     this.animation.pause();
        if(this.props.podcast && this.props.podcast.podcastID == this.props.podcastID) 
        {
            if(!this.props.paused)
                this.animation.play(0,60);
            else
                this.animation.pause();
        }
        else
        {
            this.animation.pause();
        }
        
    }

    render() {
        return(
        
        <LottieView ref={animation => { this.animation = animation;}}
        style={{width:width*3/3}} source={newAnimation}/>
            );
    
  }
}

const mapStateToProps = (state) => {
    return{
    podcast: state.rootReducer.podcast,
    paused: state.rootReducer.paused
    }}
  
  export default connect(mapStateToProps,null)(PodcastAnimation)








