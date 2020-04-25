

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as theme from '../constants/theme'
import {useDispatch} from "react-redux"

var {width, height}=Dimensions.get('window')
const areEqual = (prevProps, nextProps) => true

//const eventSourceTrendingPodcast = "TrendingPodcast";
const TopChapters = React.memo((props)=> {
  
  console.log("Inside TopChapters")
  console.log(props);
  const dispatch=useDispatch();

      const item = props.item
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
       <TouchableOpacity onPress={(()=>
        {
          dispatch({type:"SET_CURRENT_TIME", payload:0})
          dispatch({type:"SET_DURATION", payload:props.item.duration});
          dispatch({type:"SET_PAUSED", payload:false});
          dispatch({type:"SET_LOADING_PODCAST", payload:true});
          dispatch({type:"SET_PODCAST", payload: props.item})
          dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
          dispatch({type:"SET_NUM_LIKES", payload: props.item.numUsersLiked})
        })}>
       <Image style={{width:width/3 - 10, height:height/4, resizeMode:'cover',  overflow:'hidden',borderRadius:5, paddingRight:10}} source={{ uri: ((item === null || item === undefined)  ? null : item.podcastPictures[0])}} />
 
       </TouchableOpacity>
       </View>
                 
      );
    },areEqual);
  

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
