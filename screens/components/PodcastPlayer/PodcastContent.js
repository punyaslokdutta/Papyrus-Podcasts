// @flow
import * as React from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView,TouchableOpacity,Dimensions 
} from 'react-native';

import {Button} from 'native-base'
//import Icon from './Icon';
import Icon from 'react-native-vector-icons/FontAwesome'
import Slider from "react-native-slider";
import Moment from "moment";
import {useSelector, useDispatch} from "react-redux"
import Video from 'react-native-video';
//import videos, { type Video } from './videos';

const { width,height } = Dimensions.get('window');
/*type VideoContentProps = 
  video: Video,
};*/

 const PodcastContent=(props)=> {


  const rate=useSelector(state=>state.rootReducer.rate);
  const isBuffering=useSelector(state=>state.rootReducer.isBuffering);
  const paused=useSelector(state=>state.rootReducer.paused);
  const volume=useSelector(state=>state.rootReducer.volume)
  const duration=useSelector(state=>state.rootReducer.duration)
  const dispatch=useDispatch();
  


const video = React.createRef();
  


  


  /*constructor(props)
  {
    super(props) 
    {
      this.state ={
        trackLength: 300,
        timeElapsed: "0:00",
        timeRemaining: "5:00", 
        isLiked: false,
        isBookmarked: false,
    };
  }
}*/

  

  

//   changeTime = seconds => {
//     this.setState({ timeElapsed: Moment.utc(seconds * 1000).format("m:ss") });
//     this.setState({ timeRemaining: Moment.utc((this.state.trackLength - seconds) * 1000).format("m:ss") });
// };

/*toggleLike=()=>
{
  this.setState(
    {
      isLiked: !this.state.isLiked
    }
  )
}
toggleBookmark=()=>
{
  this.setState(
    {
      isBookmarked: !this.state.isBookmarked
    }
  )
}*/


   
    //const { video } = this.props;
    //const {podcast} = this.props.playerGlobalContext 
    return (
      
        <ScrollView style={styles.content}>
        <View style={{ alignItems: "center"}}>
        <View style={{ alignItems: "center", marginTop: 8}}>
    <Text style={[styles.textDark, { fontSize: 16, fontWeight: "500" }]}>{props.podcast.Podcast_Name}</Text>
    
                    </View>
                    <View style={{ alignItems: "center", marginTop: 2}}>
                    <Text style={[styles.text, { fontSize: 15, marginTop: 2}]}>{props.podcast.podcasterName}</Text>
                    </View>

        <View  style={{paddingLeft:10}}>
        
        
        </View>
        </View>
        

<View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
                    <TouchableOpacity  onPress={() => alert('')}>
                    <Icon name="undo"  size={28} label="10" color="white" />
                    </TouchableOpacity>
                    {!paused && <TouchableOpacity style={styles.playButtonContainer}  onPress={(()=>dispatch({type:"SET_PAUSED"}))}>
                   <Icon name="pause"  size={32} label="10" color="black"  style={[styles.playButton, { marginLeft: 8 }]}/>
                   </TouchableOpacity>}
                   {paused && <TouchableOpacity style={styles.playButtonContainer}  onPress={(()=>dispatch({type:"SET_PAUSED"}))}>
                   <Icon name="play"  size={32} label="10" color="black"  style={[styles.playButton, { marginLeft: 8 }]}/>
                   </TouchableOpacity> }
  
                    <TouchableOpacity  onPress={() => alert('')}>
                    <Icon name="repeat"  size={28} label="10" color="white" />
                    </TouchableOpacity>
                </View>


            <View>
            <Video
            ref={video}
            /* For ExoPlayer */
            source={{ uri: 'https://storage.googleapis.com/papyrusbookimages/audio/bensound-summer.mp3' }} 
            //source={require('../../../assets/images/testvideo.mp4')}
            style={styles.fullScreen}
            //audioOnly={true}
            rate={rate}
            paused={paused}
            volume={volume }
           // muted={this.state.muted}
            resizeMode={'contain'}
            //onLoad={()=>dispatch({type:"SET_DURATION", payload: duration})}
            //onProgress={this.onProgress}
            //onEnd={this.onEnd}
           // onAudioBecomingNoisy={this.onAudioBecomingNoisy}
            //onAudioFocusChanged={this.onAudioFocusChanged}
            //repeat={false}
          />
            </View>
            
         

          


        </ScrollView>
      
    );
  }

  
const styles = StyleSheet.create({
  content: {
    padding: 16,
    backgroundColor:'black',
    height:height*15/24
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  views: {
    color: 'gray',
    marginBottom: 16,
  },
  textDark: {
    color: "white"
},
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop:height/30
  },
  upNext: {
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingTop: 8,
    padding: 16,
  },
  upNextTitle: {
    fontWeight: 'bold',
    color: 'gray',
  },
  thumbnail: {
    flexDirection: 'row',
    marginTop: 16,
  },
  thumbnailImage: {
    height: 100,
    width: 100,
  },
  thumbnailContent: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingBottom: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  thumbnailTitle: {
    fontSize: 16,
  },
  thumbnailUsername: {
    color: 'gray',
  },
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFF"
},
thumb: {
    width: 8,
    height: 8,
    backgroundColor: "#3D425C"
},

playButtonContainer: {
  backgroundColor: "#FFF",
  borderColor: "black",
  borderWidth: 2,
  width: 80,
  height: 80,
  borderRadius: 64,
  justifyContent: "center",
  marginHorizontal: 32,
  shadowColor: "#5D3F6A",
  shadowRadius: 30,
  shadowOpacity: 0.5, 
  alignItems:'center'
}, 
text: {
  color: "#8E97A6"
}
});

export default PodcastContent;
