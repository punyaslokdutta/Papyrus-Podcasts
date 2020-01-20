// @flow
import * as React from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView,TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Moment from "moment";
import {useSelector, useDispatch} from "react-redux"
import Video from 'react-native-video';
import ProgressBar from './ProgressBar'
//import videos, { type Video } from './videos';


/*type VideoContentProps = 
  video: Video,
};*/

 const PodcastContent=(props)=> {
  const video = React.createRef();


  const rate=useSelector(state=>state.rate);
  const paused=useSelector(state=>state.paused);
  const volume=useSelector(state=>state.volume)
  const currentTime=useSelector(state=>state.currentTime)
  const dispatch=useDispatch();

  function skipForward() {
    video.current.seek(currentTime + 15);
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime + 15})
  }
  function skipBackward() {
    video.current.seek(state.currentTime - 15);
    dispatch({type:"SET_CURRENT_TIME", payload: currentTime -15})
    
  }

  function onLoadEnd(data) {
    dispatch({type:"SET_DURATION", payload: props.podcast.Duration})
    dispatch({type:"RESET_TO_INITIAL"})
  }

 function onSeek(data) {
  video.current.seek(data.seekTime);
  dispatch({type:"SET_CURRENT_TIME", payload: data.seekTime})
}
function onEnd() {
  dispatch({type:"TOGGLE_PLAY_PAUSED"})
  video.current.seek(0);
}
function onBuffering()
{
  dispatch({type:"BUFFERING_PODCAST"})
}

function handlePlayPause() {
  // If playing, pause and show controls immediately.
  if (!paused) {
    dispatch({type:"TOGGLE_PLAY_PAUSED"})
    return;
  }
}


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
                    <TouchableOpacity  onPress={skipBackward}>
                    <Icon name="undo"  size={28} label="10" color="white" />
                    </TouchableOpacity>
                    {!paused && <TouchableOpacity style={styles.playButtonContainer}  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
                   <Icon name="pause"  size={24} label="10" color="black"  style={[styles.playButton, { marginLeft: 2 }]}/>
                   </TouchableOpacity>}
                   {paused && <TouchableOpacity style={styles.playButtonContainer}  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
                   <Icon name="play"  size={28} label="10" color="black"  style={[styles.playButton, { marginLeft: 6 }]}/>
                   </TouchableOpacity> }
  
                    <TouchableOpacity  onPress={skipForward}>
                    <Icon name="repeat"  size={28} label="10" color="white" />
                    </TouchableOpacity>
                </View>


            <View>
            <Video
            ref={video}
            /* For ExoPlayer */
             source={{ uri: props.podcast.AudioFileLink }} 
            //source={require('../../../assets/images/testvideo.mp4')}
            style={styles.fullScreen}
            audioOnly={true}
            rate={rate}
            paused={paused}
            playInBackground={true}
            volume={volume }
            onBuffer={onBuffering}
            bufferConfig={{
              minBufferMs: 10000,
              maxBufferMs: 30000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000
            }}
           // muted={this.state.muted}
            //resizeMode={'contain'}
            onLoad={onLoadEnd}
            onProgress={(progress)=>dispatch({type:"SET_CURRENT_TIME", payload: progress.currentTime})}
            onEnd={onEnd}
           // onAudioBecomingNoisy={this.onAudioBecomingNoisy}
            //onAudioFocusChanged={this.onAudioFocusChanged}
            //repeat={false}
          />
            </View>
         
 
          <View> 
          <ProgressBar
                duration={props.podcast.Duration}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
                
              />
          
         </View>
        </ScrollView>
      
    );
  }

  
const styles = StyleSheet.create({
  content: {
    padding: 16,
    backgroundColor:'black'
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
    paddingTop:40
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
}, 
innerProgressCompleted: {
  height: 20,
  backgroundColor: '#cccccc',
},
innerProgressRemaining: {
  height: 20,
  backgroundColor: '#2C2C2C',
},
progress: {
  flex: 1,
  flexDirection: 'row',
  borderRadius: 3,
  overflow: 'hidden',
}
});

export default PodcastContent;