
import React, {Component} from 'react';
import { StyleSheet, Text, View, Image,ImageBackground,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import * as theme from '../constants/theme'
import {useDispatch,useSelector} from "react-redux"
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';

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

  const item = props.item;
  const podcastName = item.podcastName;
  const podcastDescription = item.podcastDescription;
  console.log(item)
  

  async function retrievePodcastDoc(podcastID)
  {
    try{
      if(podcast === null || (podcast!== null && podcast.podcastID != podcastID))
      {
        const podcastCollection = await firestore().collectionGroup('podcasts').where('podcastID','==',podcastID).get();
        console.log("[Podcast - BookmarkItem] podcastCollection : ", podcastCollection);
        const podcastDocumentData = podcastCollection.docs[0]._data;
        console.log("[Podcast - BookmarkItem] podcastDocumentData : ", podcastDocumentData);
        dispatch({type:"SET_CURRENT_TIME", payload:0})
        dispatch({type:"SET_PAUSED", payload:false})
        dispatch({type:"SET_LOADING_PODCAST", payload:true});
        dispatch({type:"SET_DURATION", payload:podcastDocumentData.duration});
        dispatch({type:"ADD_NAVIGATION", payload:props.navigation});
        podcast === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
        dispatch({type:"SET_PODCAST", payload: podcastDocumentData});
        dispatch({type:"SET_NUM_LIKES", payload: podcastDocumentData.numUsersLiked})
      }
      
    }
    catch(error){
      console.log("Error in retrievePodcast() in [Podcast - BookmarkItem]: ",error);
    }
  }

    return (
      <TouchableNativeFeedback style={[styles.shadow,{height:height/3, borderWidth:0, borderColor:'black',borderRadius:0}]} onPress={(()=>
        {
          if(props.isBookmark == true)
            {
              retrievePodcastDoc(props.item.podcastID);
            }
            else
            {
              if(podcast === null || (podcast!== null && podcast.podcastID != props.item.podcastID))
              {
                dispatch({type:"SET_CURRENT_TIME", payload:0});
                dispatch({type:"SET_PAUSED", payload:false});
                dispatch({type:"SET_LOADING_PODCAST", payload:true});
                podcast === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
                dispatch({type:"SET_PODCAST", payload: props.item});
                dispatch({type:"SET_DURATION", payload:props.item.duration});
                dispatch({type:"ADD_NAVIGATION", payload:props.navigation});
                dispatch({type:"SET_NUM_LIKES", payload: props.item.numUsersLiked});
              }
            } 
          
        })}> 
        <Image style={{height:height/5,borderRadius:0,marginHorizontal:3, resizeMode:'cover',  overflow:'hidden',alignItems:'center'}} source={{ uri:  ((item === null || item === undefined)  ? null : ( (item.podcastPictures.length != 0) && item.podcastPictures[0]))}} />
        
      <View style={{paddingHorizontal:10,height:height*2/15,borderColor:'black',height:height*10/40}}>
        <Text style={{height:height/15,fontFamily:'Montserrat-Bold',fontSize:20}}> {podcastName}{"   "} </Text>
      <Text style={{height:height/17,fontFamily:'Montserrat-Regular',color:'gray',paddingBottom:0,fontSize:12}}> {item.podcastDescription}</Text>
        </View>
      
      
      {/* <LinearGradient  colors={['transparent','#383131','black']} >
      <View style={{flexDirection:'row',height:height*3/40,width:width,alignItems:'center',justifyContent:'center'}}>
        
      
      
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
      </LinearGradient> */}
             {/* <Text style={{color:'white',position:'absolute',bottom:0}}>{item.podcastName}</Text>        */}
             
      </TouchableNativeFeedback>
    
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
