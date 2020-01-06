// @flow
import * as React from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView,TouchableOpacity, 
} from 'react-native';

import {Button} from 'native-base'
//import Icon from './Icon';
import Icon from 'react-native-vector-icons/FontAwesome'
import Slider from "react-native-slider";
import Moment from "moment";
//import videos, { type Video } from './videos';

/*type VideoContentProps = {
  video: Video,
};*/

export default class PodcastContent extends React.Component {
  constructor(props)
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
}

  

  

  changeTime = seconds => {
    this.setState({ timeElapsed: Moment.utc(seconds * 1000).format("m:ss") });
    this.setState({ timeRemaining: Moment.utc((this.state.trackLength - seconds) * 1000).format("m:ss") });
};

toggleLike=()=>
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
}


   
  render() {
    //const { video } = this.props;
    //const {podcast} = this.props.playerGlobalContext 
    return (
      
        <ScrollView style={styles.content}>
        <View style={{ alignItems: "center"}}>
        <View style={{ alignItems: "center", marginTop: 8}}>
    <Text style={[styles.textDark, { fontSize: 16, fontWeight: "500" }]}>{this.props.podcast.Podcast_Name}</Text>
    
                    </View>
                    <View style={{ alignItems: "center", marginTop: 2}}>
                    <Text style={[styles.text, { fontSize: 15, marginTop: 2}]}>{this.props.podcast.podcasterName}</Text>
                    </View>

        <View  style={{paddingLeft:10}}>
        
        
        </View>
        </View>
        

<View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
                    <TouchableOpacity  onPress={() => alert('')}>
                    <Icon name="undo"  size={28} label="10" color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.playButtonContainer}  onPress={() => alert('')}>

                    <Icon name="play"  size={32} label="10" color="black"  style={[styles.playButton, { marginLeft: 8 }]}/>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => alert('')}>
                    <Icon name="repeat"  size={28} label="10" color="white" />
                    </TouchableOpacity>
                </View>
         

          <View style={{ margin: 16 }}>
                    <Slider
                        minimumValue={0}
                        maximumValue={this.state.trackLength}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor="white"
                        onValueChange={seconds => this.changeTime(seconds)}
                    ></Slider>
                    <View style={{ marginTop: -12, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{color:'white'}}>{this.state.timeElapsed}</Text>
                        <Text style={{color:'white'}}>{this.state.timeRemaining}</Text>
                    </View>
                

                <View style={styles.icons}>
                 <Button  transparent onPress={()=>this.toggleLike()} >
                <Icon name="heart" size={20} style={[this.state.isLiked == 0 ? {color:'white'} : {color:'rgb(218,165,32)'}]}/>
                </Button>
                <Button  transparent>
                <Icon name="comments-o" size={20} style={{color:'white'}}/>
                </Button>
                <Button  transparent onPress={()=>this.toggleBookmark()}>
                <Icon name="bookmark-o" size={20} style={[this.state.isBookmarked == 0 ? {color:'white'} : {color:'rgb(218,165,32)'}]}/>
                </Button>
                <Button  transparent>
                <Icon name="share" size={20} style={{color:'white'}}/>
                </Button>
</View>
</View>


        </ScrollView>
      
    );
  }

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
}
});
