
import React, {Component} from 'react';
import { StyleSheet, Text, View, Image,ImageBackground,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as theme from '../constants/theme'
import {useDispatch,useSelector} from "react-redux"
import LinearGradient from 'react-native-linear-gradient';

var {width, height}=Dimensions.get('window')



// const areEqual = (prevProps, nextProps) => true
//  const Podcast= React.memo((props)=> {
//   console.log("Inside Podcast")
//   console.log(props);

// const eventSourceTrendingPodcast = "TrendingPodcast";
const areEqual = (prevProps, nextProps) => true

const TrendingPodcast= React.memo((props)=> {
  
  const dispatch=useDispatch();
  const podcast = useSelector(state=>state.rootReducer.podcast);

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
  const podcastName = item.podcastName;
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
          dispatch({type:"SET_LOADING_PODCAST", payload:true});
          podcast === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
          dispatch({type:"SET_PODCAST", payload: props.item})
          dispatch({type:"SET_DURATION", payload:props.item.duration});
          dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
          dispatch({type:"SET_NUM_LIKES", payload: props.item.numUsersLiked})
        })}> 
      <ImageBackground style={[{width:width/2, height:height/5,borderRadius:5, resizeMode:'cover',  overflow:'hidden',alignItems:'center'}]} source={{ uri:  ((item === null || item === undefined)  ? null : ( (item.podcastPictures.length != 0) && item.podcastPictures[0]))}} >
      <View style={{height:height*5/40}}/>
      
      <LinearGradient  colors={['transparent','#383131','black']} >
      <View style={{flexDirection:'row',height:height*3/40,width:width/2,alignItems:'center',justifyContent:'center'}}>
        
      
      
      <View>
      <Text style={{paddingLeft:5,color:'white',fontSize:15}}> 
      <Icon name="play" size={13} style={styles.icon}/> 
      {"  "}{podcastName.slice(0,40)}   

      {
        (podcastName.length > 40)  &&  ".."
      }
      </Text> 
      </View>
      </View>
      </LinearGradient>
             {/* <Text style={{color:'white',position:'absolute',bottom:0}}>{item.podcastName}</Text>        */}
             
        </ImageBackground>
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
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
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
  },
  icon: {
    color: 'white',
    paddingRight:6,paddingLeft:5
  },
});
