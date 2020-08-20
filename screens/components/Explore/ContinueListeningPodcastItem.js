import { Text,Image, Dimensions,View, StyleSheet,ImageBackground, TouchableOpacity,TouchableNativeFeedback } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { Component, useEffect,useState,useRef } from 'react';
import * as theme from '../constants/theme';
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/FontAwesome'
import {useSelector, useDispatch} from "react-redux"
import { withFirebaseHOC } from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import moment from "moment";
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';


const { width, height } = Dimensions.get('window');

const areEqual = (prevProps, nextProps) => true

const ContinueListeningPodcastItem = React.memo((props) => {
  console.log("ContinueListeningPodcastItem rendered");

  const  userID = props.firebase._getUid();
  const privateUserID = "private" + userID;
  const podcastRedux = useSelector(state=>state.rootReducer.podcast)
  const dispatch = useDispatch();

  async function retrievePodcast() {
    if(podcastRedux === null || (podcastRedux!== null && podcastRedux.podcastID != props.podcast.podcastID))
    {
      const podcastCollection = await firestore().collectionGroup('podcasts')
      .where('podcastID','==',props.podcast.podcastID).get();

      const podcastDocumentData = podcastCollection.docs[0]._data;

      dispatch({type:"SET_FLIP_ID",payload:null});
      dispatch({type:"SET_CURRENT_TIME", payload:0})
      dispatch({type:"SET_DURATION", payload:podcastDocumentData.duration})
      dispatch({type:"SET_PAUSED", payload:false})
      dispatch({type:"SET_LOADING_PODCAST", payload:true});
      dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
      dispatch({type:"SET_LAST_PLAYING_CURRENT_TIME",payload:props.podcast.lastPlayedPosition})
      props.podcastRedux === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
      dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
      dispatch({type:"SET_PODCAST", payload: podcastDocumentData})
      dispatch({type:"SET_NUM_LIKES", payload: podcastDocumentData.numUsersLiked})
    }
    
  }

  var progressPercent = props.podcast.lastPlayedPosition/props.podcast.duration;
  if(progressPercent > 1)
    progressPercent = 1;

  return (
      <TouchableNativeFeedback activeOpacity={0.8} onPress={() => {
          retrievePodcast();
      }}
      style={{borderRadius:10}}>
        
          <View style={{height:height/2.5,width:width/2,borderRadius:10,borderWidth:0,backgroundColor:'white',
          shadowColor: '#000000',shadowOffset: { width: 10, height: 0 },shadowOpacity: 0,
          shadowRadius: 0,elevation: 0.00036}}>
            <View>
            <Image
          style={{height:height/4,width:width/2,borderTopLeftRadius:10,borderTopRightRadius:10}}
          source={{ uri: props.podcast.podcastPicture }}
          />
          <View style={{position:'absolute',bottom:0,width:width/2,height:3,backgroundColor:'black'}}>
          <View style={{position:'absolute',bottom:0,width:(width/2)*progressPercent,height:3,backgroundColor:'red'}}/>
          </View>
          </View>
          <View style={{padding:4,height:height*3/20}}>
          <View style={{height:height*3/40}}>
      <Text style={{fontFamily:'Montserrat-Bold',fontSize:15}}>{props.podcast.podcastName}</Text>
              </View>
              <View style={{height:height*3/40,alignSelf:'flex-end',justifyContent:'center'}}>
                  <Text style={{fontFamily:"Montserrat-Regular",fontSize:12}}>You were listening to this podcast
                  <Text style={{fontFamily:'Montserrat-Bold',color:'gray'}}> {moment(props.podcast.createdOn).fromNow()}</Text>
                  </Text>
                  </View>

      </View>
      </View>
      </TouchableNativeFeedback>
    )

}, areEqual)

export default withFirebaseHOC(ContinueListeningPodcastItem);


const styles = StyleSheet.create({
  flex: {
    flex: 0,
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding * 1.33,
    paddingBottom: theme.sizes.padding * 0.66,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articles: {
  },
  books: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  destination: {
    width: width - (theme.sizes.padding * 2),
    height: height/3,
    marginHorizontal: theme.sizes.margin*1.5,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding * 0.66,
    borderRadius: theme.sizes.radius,
  },
  destinationInfo: {
    position: 'absolute',
    borderRadius: theme.sizes.radius,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding / 2,
    bottom: height/100,
    left: (width - (theme.sizes.padding * 4)) / (Platform.OS === 'ios' ? 3.2 : 3),
    backgroundColor: theme.colors.white,
    width: width - (theme.sizes.padding * 4),
  },
  recommended: {
  },
  recommendedHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.sizes.padding,
  },
  recommendedList: {
  },
  recommendation: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    marginHorizontal: 0,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    borderRadius: theme.sizes.radius,
    marginVertical: theme.sizes.margin * 0.5,
  },
  recommendationHeader: {
    overflow: 'hidden',
    borderTopRightRadius: theme.sizes.radius,
    borderTopLeftRadius: theme.sizes.radius,
  },
  recommendationOptions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.sizes.padding / 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  recommendationTemp: {
    fontSize: theme.sizes.font * 1.25,
    color: theme.colors.white
  },
  recommendationImage: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    height: (width - (theme.sizes.padding * 2)) / 2,
  },
  avatar: {
    width: theme.sizes.padding,
    height: theme.sizes.padding,
    borderRadius: ((theme.sizes.padding) * 2) / 1,
  },
  rating: {
    fontSize: theme.sizes.font * 1.5,
    color: theme.colors.white,
    fontWeight: 'bold'
  },
  shadow: {
    shadowColor: theme.colors.dark_green,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  dots: {
    width: 10,
    height: 10,
    borderWidth: 2.5,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
    borderColor: 'transparent',
  },
  activeDot: {
    width: 12.5,
    height: 12.5,
    borderRadius: 6.25,
    borderColor: theme.colors.active,
  }
});



