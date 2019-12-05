// @flow
import * as React from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView,TouchableOpacity
} from 'react-native';

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
        timeRemaining: "5:00"
    };
  }
}

  

  

  changeTime = seconds => {
    this.setState({ timeElapsed: Moment.utc(seconds * 1000).format("m:ss") });
    this.setState({ timeRemaining: Moment.utc((this.state.trackLength - seconds) * 1000).format("m:ss") });
};


   
  render() {
    //const { video } = this.props;
    //const {podcast} = this.props.playerGlobalContext 
    return (
      
        <ScrollView style={styles.content}>
        <View style={{flexDirection: "row", alignItems: "center", paddingLeft:80}}>
        <View style={{ alignItems: "center", marginTop: 8}}>
                        <Text style={[styles.textDark, { fontSize: 16, fontWeight: "500" }]}>Boggart in the Wardrobe</Text>
                        <Text style={[styles.text, { fontSize: 10, marginTop: 4}]}>Jeremy Blake</Text>
                    </View>
        <View  style={{paddingLeft:10}}>
        
        
        </View>
        </View>
        

<View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
                    <TouchableOpacity>
                    <Icon name="undo"  size={28} label="10" color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.playButtonContainer}>

                    <Icon name="play"  size={32} label="10" color="black"  style={[styles.playButton, { marginLeft: 8 }]}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Icon name="repeat"  size={28} label="10" color="black" />
                    </TouchableOpacity>
                </View>
         

          <View style={{ margin: 16 }}>
                    <Slider
                        minimumValue={0}
                        maximumValue={this.state.trackLength}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor="black"
                        onValueChange={seconds => this.changeTime(seconds)}
                    ></Slider>
                    <View style={{ marginTop: -12, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={[styles.textLight, styles.timeStamp]}>{this.state.timeElapsed}</Text>
                        <Text style={[styles.textLight, styles.timeStamp]}>{this.state.timeRemaining}</Text>
                    </View>
                

                <View style={styles.icons}>

<Icon name="thumbs-o-up" size={20} />
<Icon name="comments-o" size={20} />
<Icon name="bookmark-o" size={20}  />
<Icon name="share-square-o"  size={20} />
</View>
</View>


        </ScrollView>
      
    );
  }

  }
const styles = StyleSheet.create({
  content: {
    padding: 16,
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
    color: "#3D425C"
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
