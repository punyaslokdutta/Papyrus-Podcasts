import React, {Component} from 'react';
import { StyleSheet, Text, View, Image,Dimensions, ImageBackground} from 'react-native';
import * as theme from '../constants/theme'
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import { withFirebaseHOC } from '../../config/Firebase';
import { useDispatch,useSelector } from 'react-redux';

var {width, height}=Dimensions.get('window')
const areEqual = (prevProps, nextProps) => true

  const Music = (props)=> {
  
    const dispatch = useDispatch();
    const podcastRedux = useSelector(state=>state.rootReducer.podcast);
    console.log("Inside [Music]")
    //console.log(props.item);
   
    function retrieveMusicDocument ()
    {
        try{
        if(podcastRedux === null || (podcastRedux!== null && podcastRedux.podcastID != props.item.podcastID))
        {
            dispatch({type:"SET_FLIP_ID",payload:null});
            dispatch({type:"SET_CURRENT_TIME", payload:0})
            dispatch({type:"SET_DURATION", payload:props.item.duration})
            dispatch({type:"SET_PAUSED", payload:false})
            dispatch({type:"SET_LOADING_PODCAST", payload:true});
            dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
            podcastRedux === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
            dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
            dispatch({type:"SET_PODCAST", payload: props.item})
            dispatch({type:"SET_NUM_LIKES", payload: props.item.numUsersLiked})
            //this.props.dispatch({type:"SET_NUM_RETWEETS", payload: this.state.numRetweets})

        }
        
        }
        catch(error){
        console.log("Error in retrieveMusicDocument() in Music: ",error);
        }
    }
   
      return (
        <TouchableNativeFeedback onPress={() => {
            retrieveMusicDocument();
        }} 
        style={{backgroundColor:'#e1e6e1',width:width*5/12,height:width*7/12,marginHorizontal:10}}>
        
        <Image style={{width:width*5/12,borderWidth:1,borderColor:'black', height:width*5/12}} source={{uri:props.item.podcastPictures[0]}}/>
      <Text style={{fontFamily:'Andika-R',fontSize:17}}> {props.item.podcastName} </Text>
           
       </TouchableNativeFeedback>
                 
      );
    };
  

export default withFirebaseHOC(Music);


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
  storie: {
    height: width/4,
    width: width/4,
    borderRadius: 60,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
},
username: {
    alignSelf: 'center',
    fontWeight: '200',
    fontSize: 15,
    fontFamily: 'Andika-R',
    paddingBottom:10
},
shadow: {
  shadowColor: theme.colors.black,
  shadowOffset: {
    width: 0,
    height: 50,
    radius: 69
  },
  shadowOpacity: 5,
  shadowRadius: 20,
  elevation: 30,
  //height: 10
}
});