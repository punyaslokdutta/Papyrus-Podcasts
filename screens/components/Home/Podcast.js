
import React, {Component, useState, useEffect, useContext, useRef} from 'react';
import { StyleSheet, Text, View, Image, Dimensions,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from '../constants/theme'
import {useDispatch,useSelector} from "react-redux"
import moment from 'moment';
import { Divider } from '../categories/components';
import {withFirebaseHOC} from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';

var {width, height}=Dimensions.get('window')

 /* useContext doesn't let you subscribe to a part of the context value (or some memoized selector) without fully re-rendering.*/
 //const areEqual = (prevProps, nextProps) => true;
 const areEqual = (prevProps, nextProps) => true
 const Podcast= React.memo((props)=> {
  console.log("Inside Podcast")
  console.log(props);
  const podcast = useSelector(state=>state.rootReducer.podcast);

  const  realUserID = props.firebase._getUid();
  //const privateDataID = "private" + userid; 
  var duration = parseInt((props.podcast.duration)/60);

  if(duration == 0)
    duration = 1;
  var currentDateTime = moment().format();
  var timeDiff = currentDateTime;//moment(currentDateTime).fromNow();
  if(props.podcast.createdOn)
    timeDiff = moment(props.podcast.createdOn).fromNow();
  const dispatch=useDispatch();


  async function retrieveUserPrivateDoc(userID)
  {
    try{
      const privateDataID = "private" + userID;
      const userDocument = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).get();
      console.log("[Podcast] userDocument : ", userDocument);
      const userDocumentData = userDocument.data();
      console.log("[Podcast] userDocumentData : ", userDocumentData);
      
      const isUserSame = (userID == realUserID);

      if(isUserSame)
      {
        props.navigation.navigate('ProfileTabNavigator')
      }
      else
      {
        dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:userDocumentData});
        props.navigation.navigate('ExploreTabNavigator',{userData:userDocumentData});
      }
        
      
    }
    catch(error){
      console.log("Error in retrieveUser() in Podcast: ",error);
    }
    
  }



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
          <TouchableOpacity  activeOpacity={0.5} onPress={(()=>{

            if(props.isBookmark == true)
            {
              retrievePodcastDoc(props.podcast.podcastID);
            }
            else
            {
              if(podcast === null || (podcast!== null && podcast.podcastID != props.podcast.podcastID))
              {
                dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
                dispatch({type:"SET_CURRENT_TIME", payload:0})
                dispatch({type:"SET_DURATION", payload:props.podcast.duration});
                dispatch({type:"SET_PAUSED", payload:false})
                dispatch({type:"SET_LOADING_PODCAST", payload:true});
                podcast === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
                dispatch({type:"SET_PODCAST", payload: props.podcast}) 
                dispatch({type:"SET_NUM_LIKES", payload: props.podcast.numUsersLiked})
              }
            }
            })}>
          <View style={[
            styles.flex, styles.column, styles.recommendation, styles.shadow, 
            {marginLeft: theme.sizes.margin },
          ]} key ={props.index}>
           <View style={[styles.flex, styles.recommendationHeader]}>
           
           <Image style={[styles.recommendationImage]} source={ {uri: props.podcast.podcastPictures["0"]}} />

           
          
        </View>
        {

          props.podcast.isChapterPodcast ?
          <Divider margin={theme.sizes.padding/6} borderBottomColor={'black'} borderBottomWidth={height/500} /> :
          <View style={{height:theme.sizes.padding/8}}/>
        }
        
        <View style={[styles.flex, styles.column, styles.shadow, { paddingLeft: theme.sizes.padding / 8,paddingRight: theme.sizes.padding / 8}]}>
              
              <View style={{height:height/20}}> 
              <Text style={{ fontSize: theme.sizes.font * 1.0, fontFamily:'Proxima-Nova-Bold',height:height/20 }}>{props.podcast.podcastName.slice(0,50)}
              {(props.podcast.podcastName.length > 50) ? ".." : ""}</Text> 
              </View>
              
              
              <View style={{height:height/20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate('RecordBook',{bookID:props.podcast.bookID})}>
              <Text style={{ fontSize: theme.sizes.font * 0.8,fontFamily:'Proxima-Nova-Bold', color: theme.colors.gray_green,height:height/20 }}>{props.podcast.bookName.slice(0,50)}
              {(props.podcast.bookName.length >50) ? ".." : ""}</Text>
              </TouchableOpacity>
              </View>
              

              <View style ={{height:(height)/45}}>
              <TouchableOpacity onPress={() => {
                  retrieveUserPrivateDoc(props.podcast.podcasterID);
                }}>
              <Text style={{ fontFamily:'Proxima-Nova-Bold',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green,height:height/45 }}>{props.podcast.podcasterName}</Text>
              </TouchableOpacity>
              </View>
          
              <View style={[
                styles.row,
                { alignItems: 'center', justifyContent: 'space-between'}
              ]}>
                
                <Text style={{  fontFamily:'Proxima-Nova-Regular',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green,height:height/50 }}>
                  {timeDiff}
                </Text>
                {/* <View style={{alignItems: 'flex-end',paddingRight:5}}>
            <Icon
              name="ellipsis-v"
              color={theme.colors.black}
              size={theme.sizes.font * 1.25}
            />
          </View> */}
              </View>
              <View>
              {
                duration == 1
                ?
                <Text style={{  fontFamily:'Proxima-Nova-Regular',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green }}> {duration} min </Text>
                :
                <Text style={{  fontFamily:'Proxima-Nova-Regular',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green }}> {duration} mins </Text>
              }
              
                </View>
            </View>
          </View>
          </TouchableOpacity>
          
          );
        
    
  }, areEqual);

export default withFirebaseHOC(Podcast);

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
    height: (height)*3/8,
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
    height: (width - (theme.sizes.padding * 3)) / 2,
  },
  avatar: {
    width: theme.sizes.padding,
    height: theme.sizes.padding,
    borderRadius: theme.sizes.padding / 2,
  },
  rating: {
    fontSize: theme.sizes.font * 2,
    color: theme.colors.white,
    fontWeight: 'bold'
  },
  shadow: {
    shadowColor: theme.colors.gray_green,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
    borderColor: theme.colors.black,
  },
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
