import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions,TouchableOpacity,TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from '../constants/theme'
import {withFirebaseHOC} from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { useDispatch,useSelector} from 'react-redux';

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
const followText = "FOLLOW";
const followingText = "FOLLOWING";

 const areEqual = (prevProps, nextProps) => true

 const SearchUserItem = React.memo((props)=> {
    console.log("Inside SearchUserItem");
    console.log("props.user : ",props.user);
    const dispatch = useDispatch();
    const name = useSelector(state=>state.userReducer.name);
    const userDisplayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
    const realUserID = props.firebase._getUid();
    const realPrivateUserID = "private" + realUserID;
    const userID = props.user.objectID;
    const privateDataID = "private" + userID;

    var [wholestring,setWholestring] = useState(followText);
    var initialMessage = useSelector(state=>state.userReducer.isUserFollowing[userID])
    var initialFollowText = followText;

    useEffect(() => {
        if(initialMessage === true)
            setWholestring(followingText);
        else
            setWholestring(followText);
    },[initialMessage])

    async function retrieveData() 
    {        
        if(wholestring === followText)
        {
            console.log("FOLLOW Button is pressed");
            try{
                await firestore().collection('users').doc(userID).set({
                    followersList : firestore.FieldValue.arrayUnion(realUserID),
                    followerCount : firestore.FieldValue.increment(1)
                },{ merge:true })
            }
            catch(error){
                console.log("Error in adding to follower list of ",userID);
                console.log(error);
            }
                

            try{
                await firestore().collection('users').doc(realUserID).collection('privateUserData').doc(realPrivateUserID).set({
                    followingList : firestore.FieldValue.arrayUnion(userID),
                    followingCount : firestore.FieldValue.increment(1)
                },{ merge:true })
            }
            catch(error){
                console.log("Error in adding to following list of ",realUserID);
                console.log(error);
            }
                
            const instance = firebase.app().functions("asia-northeast1").httpsCallable('addActivity');
            try {          
                await instance({ 
                timestamp : moment().format(),
                photoURL : userDisplayPictureURL,
                podcastID : null,
                userID : userID,
                podcastImageURL : null,
                type : "follow",
                Name : name
                });
            }
            catch (e) {
                console.log("Error in calling addActivity cloud function for Follow Activity");
                console.log(e);
            }    
        } 
        else if(wholestring === followingText)
        {
            console.log("[CustomUserHeader] IN RETRIEVE DATA -- FOLLOWING");
            try{
                await firestore().collection('users').doc(userID).set({
                    followersList : firestore.FieldValue.arrayRemove(realUserID),
                    followerCount : firestore.FieldValue.increment(-1) 
                },{ merge:true })
            }
            catch(error){
                console.log("Error in removing from followers list of ",otherPrivateUserItem.id);
            }
            
                
            try{
                await firestore().collection('users').doc(realUserID).collection('privateUserData').doc(realPrivateUserID).set({
                    followingList : firestore.FieldValue.arrayRemove(userID),
                    followingCount : firestore.FieldValue.increment(-1) 
                },{ merge:true })
            }
            catch(error){
                console.log("Error in adding to following list of ",realUserID);
                console.log(error);
            }
        }   
    };

    async function retrieveUserDocument()
    {  
        try{
        const userDocument = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID)
                                .get();
        const userDocumentData = userDocument._data;
        console.log("[SearchUserItem] userDocumentData : ", userDocumentData);
        dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:userDocumentData})
        props.navigation.navigate('ExploreTabNavigator',{userData:userDocumentData})
        }
        catch(error){
        console.log("Error in retrieveUserDocument() in SearchUserItem: ",error);
        }
    }

    return (
        <TouchableNativeFeedback onPress={() => {
        if(props.user.objectID == realUserID)
            props.navigation.navigate('ProfileTabNavigator');
        else
            retrieveUserDocument();
        }} >
        <View style={{height:width/5,flexDirection:'row',marginLeft:20,marginRight:10,marginTop:10,marginBottom:0}}>
                
            <View>
            <Image source={{uri:props.user.userPicture}} style={{height:width/6,marginRight:10,borderRadius:50,width:width/6}}/>
            </View>
            
            <View style={{width:width/2, justifyContent: 'center'}}>
            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:15,marginBottom:12}}> 
            {props.user.name}
            </Text>
            </View>
            
            {
              props.user.objectID != realUserID &&
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <TouchableOpacity style={{padding:5,borderRadius:5,borderColor:'black',
              alignItems:'center',justifyContent:'center',borderWidth:1, 
              backgroundColor:initialMessage == true ? '#0AC4BA' : 'white'}}
              onPress={() => {
              
              if(wholestring === followText)
              {
                  console.log("FoLLow")
                  dispatch({
                      type: "ADD_TO_FOLLOWING_MAP",
                      payload: userID
                  })
                  //setMessage(followingText)
              }         
              else if(wholestring === followingText)
              {
                  console.log("UnFOLLOW")
                  dispatch({
                      type: "REMOVE_FROM_FOLLOWING_MAP",
                      payload: userID
                  })
                  //setMessage(followText)
              }
              else
              {
                  console.log('UNDEFINEDDDDDDDDD')
              }
              retrieveData();
              }}>
                  <Text style={{fontSize:12}}>{wholestring}</Text>
              </TouchableOpacity>
              </View>
            }
            
        </View>
    </TouchableNativeFeedback>
    );
      
  }, areEqual);

export default withFirebaseHOC(SearchUserItem);