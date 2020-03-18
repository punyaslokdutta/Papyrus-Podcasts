import React, {Component,useState,useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';
import {withFirebaseHOC} from './config/Firebase'
import {useSelector,useDispatch} from 'react-redux'
import firestore from '@react-native-firebase/firestore';

  async function retrieveDataPublic(dispatch,userid){

    let doc = 9;
    try{
     doc = await firestore().collection('users').doc(userid).get();
                   
        console.log("Inside PUBLIC QUERY");
        console.log(doc)
        
        //For sending to cloud functions so that ActivityItem gets total user item which it can forward to ExploreTabNavigator --> CustomUserHeader  
        dispatch({type:'SET_USER_ITEM',payload:doc._data})

        dispatch({type:'SET_PODCASTS_LIKED',payload:doc._data.podcastsLiked})

        dispatch({type:'CHANGE_EMAIL',payload:doc._data.email})
        dispatch({type:'CHANGE_NAME',payload:doc._data.name})
        dispatch({type:'CHANGE_USER_NAME',payload:doc._data.username})
        dispatch({type:'CHANGE_DISPLAY_PICTURE',payload:doc._data.displayPicture})
        dispatch({type:'ADD_ALL_TO_FOLLOWING_MAP',payload:doc._data.following_list})
        dispatch({type:'CHANGE_WEBSITE',payload:doc._data.website})

        const numFollowers = doc._data.followers_list.length;
        dispatch({type:'ADD_NUM_FOLLOWERS',payload:numFollowers})
        dispatch({type:'ADD_INTRODUCTION',payload: doc._data.introduction})
        dispatch({type:'ADD_NUM_CREATED_BOOK_PODCASTS',payload: doc._data.numCreatedBookPodcasts})
        dispatch({type:'ADD_NUM_CREATED_CHAPTER_PODCASTS',payload: doc._data.numCreatedChapterPodcasts})
        dispatch({type:'ADD_TOTAL_MINUTES_RECORDED',payload: doc._data.totalMinutesRecorded})
    
    }
    catch(error)
    {
        console.log("ERROR IN SET USER DETAILS\n\n");
        console.log(error)
    }
  }


//   async function retrieveData (dispatch,userid) {
//     console.log("HIIIIIIIIIIIIIIIIIIIIIIII123456789")
//     console.log(userid);
//     let doc = 9;
//     try{
//      doc = await firestore().collection('users').doc(userid).collection('privateUserData').doc('privateData').get();
//         console.log("Inside PRIVATE QUERY");
//         console.log(doc)
//         dispatch({type:'CHANGE_STATS',payload:doc._data})
//     }
//     catch(error)
//     {
//         console.log("ERROR IN SET USER DETAILS\n\n");
//         console.log(error)
//     }
// }

const setUserDetails = (props) => {
    // const bookid = this.props.navigation.state.params;
    const userDoc = props.navigation.state.params.user;
    console.log("IN SET USER DETAILS\n\n",userDoc);

    const  userid = props.firebase._getUid();
    console.log(userid)
    const dispatch = useDispatch();

    useEffect( () => {
     //retrieveData(dispatch,userid);
     retrieveDataPublic(dispatch,userid);
     props.navigation.navigate('App');
     console.log("PRIVATE DATA")
      }, [])

    

    //Have to write a separate dispatch statement which fills the isUserFollowing from the following array
    console.log("User Doc: ",userDoc.name);
    return (
        null
    )
}

export default withFirebaseHOC(setUserDetails);

