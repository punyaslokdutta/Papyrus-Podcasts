

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as theme from '../constants/theme'
var {width, height}=Dimensions.get('window')


class TopChapters extends Component {
   
  constructor(props)
  {
      super(props)
      {
       state:{
         key: this.props.index
         navigation: this.props.navigation
       }
      }
  }
  openPodcastPlayer()
  {

    this.props.navigation.navigate('PodcastPlayer',podcast=this.props.item.podcastID);

  }
    render() {
      const item = this.props.item
      console.log(item)
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
      return (
        
        // <View style={{height:210, width:130, marginLeft:20, borderwidth:4, borderColor:'#dddddd',overflow:'hidden', paddingRight:10,borderRadius:10}}>
        //                 <Image source={this.props.ImageUri} style={{width:130, height:210, resizeMode:'cover',  overflow:'hidden', paddingRight:10}}/>
        //             </View>
       <View style={[styles.shadow,{height:height/4, width:width/3, marginLeft:20, borderwidth:5, borderColor:'#dddddd',overflow:'hidden', paddingRight:10,borderRadius:5}]}>
       <TouchableOpacity onPress={()=>this.openPodcastPlayer()}>
       <Image style={{width:width/3 - 10, height:height/4, resizeMode:'cover',  overflow:'hidden',borderRadius:5, paddingRight:10}} source={{ uri: item.Chapter_Pictures_Array["0"] }} />
 
       </TouchableOpacity>
       </View>
                 
      );
    }
  }

export default TopChapters;


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
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  }
});
