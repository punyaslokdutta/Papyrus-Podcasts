import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';
import {withFirebaseHOC} from './config/Firebase'
import {useSelector,useDispatch} from 'react-redux'

const setUserDetails = (props) => {
    // const bookid = this.props.navigation.state.params;
    const userDoc = props.navigation.state.params.user;
    console.log("\n\n");
    console.log("IN SET USER DETAILS");
    console.log("\n\n");

    const dispatch = useDispatch();
    dispatch({type:'CHANGE_NAME',payload:userDoc.name})
    dispatch({type:'CHANGE_USER_NAME',payload:userDoc.username})
    dispatch({type:'CHANGE_DISPLAY_PICTURE',payload:userDoc.displayPicture})
    dispatch({type:'ADD_ALL_TO_FOLLOWING_MAP',payload:userDoc.following_list})
    //Have to write a separate dispatch statement which fills the isUserFollowing from the following array
    console.log("User Doc: ",userDoc.name);
    return (
        null
    )
}

export default withFirebaseHOC(setUserDetails);