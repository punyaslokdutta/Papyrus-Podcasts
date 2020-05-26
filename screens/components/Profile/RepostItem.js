import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from '../constants/theme'
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {withFirebaseHOC} from '../../config/Firebase';
import { useDispatch,useSelector} from 'react-redux';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

var {width, height}=Dimensions.get('window')



 const areEqual = (prevProps, nextProps) => true
 const RepostItem = React.memo((props)=> {
  console.log("Inside RepostItem");
  console.log("props.podcast : ",props.podcast);
  const dispatch = useDispatch();
  const podcast = useSelector(state=>state.rootReducer.podcast);
  const  realUserID = props.firebase._getUid();

  var createdOn = moment(props.podcast.createdOn).fromNow();

  if(createdOn === null)
    createdOn = props.podcast.createdOn.slice(0,10);

  async function retrievePodcastDocument()
  {
    try{
    if(podcast === null || (podcast!== null && podcast.podcastID != props.podcast.podcastID))
    {
      const podcastCollection = await firestore().collectionGroup('podcasts')
                             .where('podcastID','==',props.podcast.podcastID).get();
      const podcastDocumentData = podcastCollection.docs[0]._data;
      console.log("[RepostItem] podcastDocumentData : ", podcastDocumentData);
      dispatch({type:"SET_CURRENT_TIME", payload:0})
      dispatch({type:"SET_DURATION", payload:podcastDocumentData.duration})
      dispatch({type:"SET_PAUSED", payload:false})
      dispatch({type:"SET_LOADING_PODCAST", payload:true});
      dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
      podcast === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
      dispatch({type:"SET_PODCAST", payload: podcastDocumentData})
      dispatch({type:"SET_NUM_LIKES", payload: podcastDocumentData.numUsersLiked})
    }
    
    }
    catch(error){
      console.log("Error in retrievePodcastDocument() in RepostItem: ",error);
    }
  }

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

    return (
        <TouchableOpacity activeOpacity={0.5} onPress={() => {
        retrievePodcastDocument();
        }}>
            <View style={{flexDirection:'column'}}>
            <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
            <EvilIcon name='retweet' size={20} color='blue'/>
            <Text style={{ color:'black', paddingLeft:5,fontWeight:'400', fontSize:theme.sizes.font * 1.0 }}>
            {moment(props.podcast.bookmarkedOn).fromNow()}
            </Text>
            </View>    
            <View style={{flex:1,flexDirection:"row",paddingBottom:theme.sizes.padding/2,paddingLeft:width/64,width:width,height:height/7}}>
            
            <View>
            <Image style={{width:width/4,height:height/8,borderRadius:8}} source={ {uri: props.podcast.podcastPictures[0]}} />
        </View>

            <View style={[styles.flex, styles.column, styles.shadow, { width:(width*2)/3,paddingLeft:theme.sizes.padding/2, paddingTop: 0 }]}>
                <View style={{height:(height)/12,paddingBottom:20}}>
                <Text style={{ fontSize: theme.sizes.font * 1.0, fontFamily:'Proxima-Nova-Bold' }}>{props.podcast.podcastName.slice(0,50)}
                    {(props.podcast.podcastName.length > 50) ? ".." : ""}</Text> 
            {
                (props.podcast.chapterName !== null && props.podcast.chapterName !== undefined) &&
                <TouchableOpacity onPress={() => {
                    console.log("chapterID: ",props.podcast.chapterID);
                    props.navigation.navigate('RecordChapter',{bookID:props.podcast.bookID,chapterID:props.podcast.chapterID})
                }}>
                <Text style={{  fontSize: theme.sizes.font * 0.8,fontFamily:'Proxima-Nova-Bold',color: theme.colors.gray_green }}>
                {props.podcast.chapterName}
            </Text>
            </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => props.navigation.navigate('RecordBook',{bookID:props.podcast.bookID})}>
            <Text style={{  fontSize: theme.sizes.font * 0.8,fontFamily:'Proxima-Nova-Bold',color: theme.colors.gray_green }}>
                {props.podcast.bookName}
            </Text>
            </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',paddingTop:5}}>
                <TouchableOpacity onPress={() => {
                  retrieveUserPrivateDoc(props.podcast.podcasterID);
                }}>
                <Text style={{ fontFamily:'Proxima-Nova-Bold',fontSize:theme.sizes.font * 0.8,color: theme.colors.gray_green }}>
                    {props.podcast.podcasterName}
                </Text>
                </TouchableOpacity>
            </View>
        
            <View style={[
            styles.row,
            { alignItems: 'center', justifyContent: 'space-between'}
            ]}>
            
            <Text style={{  fontFamily:'Proxima-Nova-Bold',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green }}>
            {createdOn}
            </Text>
            
            </View>
            
        </View>
    
        </View>
        </View>
    </TouchableOpacity>
    );
      
  }, areEqual);

export default withFirebaseHOC(RepostItem);


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