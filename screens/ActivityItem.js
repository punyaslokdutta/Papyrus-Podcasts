
import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from './components/constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useDispatch} from "react-redux"
import firestore from '@react-native-firebase/firestore';
import { withFirebaseHOC } from './config/Firebase';
import moment from 'moment';
var {width, height}=Dimensions.get('window')

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


  
 const areEqual = (prevProps, nextProps) => true
 const ActivityItem = React.memo((props)=> {

  const realUserID = props.firebase._getUid();
  const dispatch = useDispatch();
  var currentDateTime = moment().format();
  
  var timeDiff = currentDateTime;//moment(currentDateTime).fromNow();
  if(props.activity.creationTimestamp)
    timeDiff = moment(props.activity.creationTimestamp).fromNow();

  async function retrievePodcast(podcastID)
  {
    const podcastCollection = await firestore().collectionGroup('Podcasts').where('podcastID','==',podcastID).get();
    console.log("[ActivityItem] podcastCollection : ", podcastCollection);
    const podcastDocumentData = podcastCollection.docs[0]._data;
    console.log("[ActivityItem] podcastDocumentData : ", podcastDocumentData);
    dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
    dispatch({type:"SET_PODCAST", payload: podcastDocumentData})
    dispatch({type:"SET_NUM_LIKES", payload: podcastDocumentData.numUsersLiked})
  }

  async function retrieveUser(props,userID)
  {
    const privateDataID = "private" + userID;
    const userDocument = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).get();
    console.log("[ActivityItem] userDocument : ", userDocument);
    const userDocumentData = userDocument.data();
    console.log("[ActivityItem] userDocumentData : ", userDocumentData);
    
    const isUserSame = (userID == realUserID);
    isUserSame ?
    props.navigation.navigate('ProfileTabNavigator')
    :
    props.navigation.navigate('ExploreTabNavigator', {userData:userDocumentData})

  }


  console.log("Inside [Activity Item]");
  console.log("[Activity Item] props in Activity Item: ",props);

  let activityText = <Text>{props.activity.actorName} liked your podcast -
  <Text style={{fontWeight:"bold"}}>{props.activity.podcastName}.</Text>
  </Text>
  if(props.activity.type == "follow")
activityText = <Text>{props.activity.actorName} started following you.</Text>
   
        return (
          
             
            <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:"row",height:height/8}}>
            <TouchableOpacity onPress={() => {
              console.log("userClicked");

              retrieveUser(props,props.activity.actorID);
              
            }}>
            <View>
              <Image style={{borderRadius:60,width:height/16,height:height/16}} source={{uri: props.activity.actorImage}} />
            </View>
            </TouchableOpacity>
            <View style={{width:width/2,paddingLeft:width/25}}>
        
            {activityText}
            <Text style={{color:'gray'}}>{timeDiff}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              console.log("podcastClicked")
              
                retrievePodcast(props.activity.podcastID);
              }}>
              
              <View>
              <Image style={{borderRadius:60,width:height/16,height:height/16}} source={{uri: props.activity.podcastPicture}} />
              </View>
              </TouchableOpacity>
          </View>
      
        );
      
  }, areEqual);

export default withFirebaseHOC(ActivityItem);
