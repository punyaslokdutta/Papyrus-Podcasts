

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as theme from '../constants/theme'
import {useDispatch} from "react-redux"


var {width, height}=Dimensions.get('window')



// const areEqual = (prevProps, nextProps) => true
//  const Podcast= React.memo((props)=> {
//   console.log("Inside Podcast")
//   console.log(props);

// const eventSourceTrendingPodcast = "TrendingPodcast";
const areEqual = (prevProps, nextProps) => true

const TrendingPodcast= React.memo((props)=> {
  
  const dispatch=useDispatch();

  // constructor(props)
  // {
  //     super(props)
  //     {
  //      this.state={
  //        key: this.props.index,
  //        navigation: this.props.navigation,
  //        eventSource: eventSourceTrendingPodcast
  //      }
  //     }
  // }
  
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
  const item = props.item;
  console.log(item)
  
    return (
      
      // <View style={{height:130, width:210, marginLeft:20, borderwidth:4, borderColor:'#dddddd',overflow:'hidden', paddingRight:10,borderRadius:10}}>
      //                 <Image source={this.props.ImageUri} style={{width:210, height:130, resizeMode:'cover',  overflow:'hidden', paddingRight:10}}/>
      //             </View>    
      <View style={[styles.shadow,{height:height/5, width:width/2, marginLeft:20, borderwidth:5, borderColor:'#dddddd',overflow:'hidden', paddingRight:10,borderRadius:5}]}>
      <TouchableOpacity onPress={(()=>
        {
          dispatch({type:"SET_CURRENT_TIME", payload:0})
             dispatch({type:"SET_PAUSED", payload:false})
          dispatch({type:"SET_PODCAST", payload: props.item})
          dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
          dispatch({type:"SET_NUM_LIKES", payload: props.item.numUsersLiked})
        })}> 
      <Image style={[{width:width/2 - 10, height:height/5,borderRadius:5, resizeMode:'cover',  overflow:'hidden'}]} source={{ uri:  ((item === null || item === undefined)  ? null : ( (item.podcastPictures.length != 0) && item.podcastPictures[0]))}} />

      </TouchableOpacity>
      </View>
     );
  }, areEqual);

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
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  }
});
