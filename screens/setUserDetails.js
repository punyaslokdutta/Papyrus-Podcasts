import React, {Component,useState,useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';
import {withFirebaseHOC} from './config/Firebase'
import {useSelector,useDispatch} from 'react-redux'
import firestore from '@react-native-firebase/firestore';

  async function retrieveDataPublic(dispatch,userid){

    let publicQuery = 9;
    try{
     publicQuery = await firestore().collection('users').doc(userid).onSnapshot(
                    async(doc)=> {
                        console.log("Inside PUBLIC QUERY");
                        console.log(doc)
    
                        dispatch({type:'CHANGE_EMAIL',payload:doc._data.email})
                        dispatch({type:'CHANGE_NAME',payload:doc._data.name})
                        dispatch({type:'CHANGE_USER_NAME',payload:doc._data.username})
                        dispatch({type:'CHANGE_DISPLAY_PICTURE',payload:doc._data.displayPicture})
                        dispatch({type:'ADD_ALL_TO_FOLLOWING_MAP',payload:doc._data.following_list})

                        const numFollowers = doc._data.followers_list.length;
                        dispatch({type:'ADD_NUM_FOLLOWERS',payload:numFollowers})
                        dispatch({type:'ADD_PERSONAL_LISTENING_TIME',payload: doc._data.timespent_by_user_listening})
                        dispatch({type:'ADD_NUM_LISTENED_BOOK_PODCASTS',payload: doc._data.listened_book_podcasts_count})
                        dispatch({type:'ADD_NUM_LISTENED_CHAPTER_PODCASTS',payload: doc._data.listened_chapter_podcasts_count})
                        dispatch({type:'ADD_INTRODUCTION',payload: doc._data.introduction})
                        
                        dispatch({type:'ADD_NUM_CREATED_BOOK_PODCASTS',payload: doc._data.created_book_podcasts_count})
                        dispatch({type:'ADD_NUM_CREATED_CHAPTER_PODCASTS',payload: doc._data.created_chapter_podcasts_count})

                    }
                );
      
    }
    catch(error)
    {
        console.log("ERROR IN SET USER DETAILS\n\n");
        console.log(error)
    }
  }


  async function retrieveData (dispatch,userid) {
    console.log("HIIIIIIIIIIIIIIIIIIIIIIII123456789")
    console.log(userid);
    let privateQuery = 9;
    try{
     privateQuery = await firestore().collection('users').doc(userid).collection('privateUserData')
                .doc('privateData').onSnapshot(
                    async(doc)=> {
                        console.log("Inside PRIVATE QUERY");
                        console.log(doc)
    
                        dispatch({type:'CHANGE_STATS',payload:doc._data})

                    }
                );
      
    }
    catch(error)
    {
        console.log("ERROR IN SET USER DETAILS\n\n");
        console.log(error)
    }
}

const setUserDetails = (props) => {
    // const bookid = this.props.navigation.state.params;
    const userDoc = props.navigation.state.params.user;
    console.log("IN SET USER DETAILS\n\n",userDoc);

    const  userid = props.firebase._getUid();
    console.log(userid)
    const dispatch = useDispatch();

    useEffect( () => {
     retrieveData(dispatch,userid);
     retrieveDataPublic(dispatch,userid)
     console.log("PRIVATE DATA")
      }, [])

    

    //Have to write a separate dispatch statement which fills the isUserFollowing from the following array
    console.log("User Doc: ",userDoc.name);
    return (
        null
    )
}

export default withFirebaseHOC(setUserDetails);

