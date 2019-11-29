

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PodcastPlayer from '../../PodcastPlayer'
import PlayerContext from '../../components/PodcastPlayer/PlayerContext'



const eventSourceTrendingPodcast = "TrendingPodcast";
class TrendingPodcast extends Component {
  
  constructor(props)
  {
      super(props)
      {
       this.state={
         key: this.props.index,
         navigation: this.props.navigation,
         eventSource: eventSourceTrendingPodcast
       }
      }
  }
  openPodcastPlayer()
  {

    this.props.navigation.navigate('PodcastPlayer',podcast=this.props.item.podcastID);

  }
  render() {
      /*const shadowOpt = {
    width:160,
    height:170,
    color:"#000",
    border:2,
    radius:3,
    opacity:0.2,
    x:0,
    y:3,
    style:{marginVertical:5}
  }*/
  //{{ uri: "https://scontent.fdel12-1.fna.fbcdn.net/v/t31.0-8/p960x960/14054441_518163365046457_6005096195143854779_o.jpg?_nc_cat=101&_nc_oc=AQmBj8SY60BCKzMFfvCPGLc1J44zxgFhJqefzYEifezUhkr7pFo29592HYyw6grMQF8&_nc_ht=scontent.fdel12-1.fna&oh=8ff3d0097e442acc84a804041fd0e7ee&oe=5E45429C"}} style={{width:100, height:100, borderRadius:50 }}
  const item = this.props.item;
  const eventSource=this.state.eventSource;
  console.log(item)
  
    return (
      
      // <View style={{height:130, width:210, marginLeft:20, borderwidth:4, borderColor:'#dddddd',overflow:'hidden', paddingRight:10,borderRadius:10}}>
      //                 <Image source={this.props.ImageUri} style={{width:210, height:130, resizeMode:'cover',  overflow:'hidden', paddingRight:10}}/>
      //             </View>
      <PlayerContext.Consumer>
      {

        ({setPodcast})=>(   
      <View style={{height:130, width:210, marginLeft:20, borderwidth:4, borderColor:'#dddddd',overflow:'hidden', paddingRight:10,borderRadius:10}}>
      <TouchableOpacity onPress={()=>setPodcast(item, eventSource)}>
      <Image style={{width:210, height:130, resizeMode:'cover',  overflow:'hidden', paddingRight:10}} source={{ uri: item.Podcast_Pictures["0"] }} />

      </TouchableOpacity>
      </View>)
      }
      </PlayerContext.Consumer>

    );

  
    
    }
  }

export default TrendingPodcast;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
