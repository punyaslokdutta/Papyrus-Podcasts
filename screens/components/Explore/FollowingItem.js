import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from '../constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useDispatch} from "react-redux"
import firestore from '@react-native-firebase/firestore';
import { withFirebaseHOC } from '../../config/Firebase';


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




 /* useContext doesn't let you subscribe to a part of the context value (or some memoized selector) without fully re-rendering.*/
 //const areEqual = (prevProps, nextProps) => true;
 const areEqual = (prevProps, nextProps) => true

 const FollowingItem = React.memo((props)=> {
  console.log("Inside Following Item")
  console.log(props);
  console.log("userData = ",props.item);
  const realUserID = props.firebase._getUid();
  const isUserSame = (props.item.id == realUserID); 
  console.log("isUserSame : ",isUserSame);

  async function retrievePrivateUserData(props,userid){

    try{
      const privateDataID = "private" + userid;
      const privateUserDoc = await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).get();
      const privateItem = privateUserDoc._data;
      props.navigation.navigate({
        routeName: 'ExploreTabNavigator',
        params : {userData:privateItem},
        //key : 'user' + userid 
      })
      // [2] Move to top of stack,i.e, pop all screens until the last one
      props.navigation.popToTop();
      // [3] props.navigation.push will move us towards updated ExploreTabNavigator with updated CustomUserHeader
      props.navigation.push('ExploreTabNavigator', {userData:privateItem})
    }
    catch(error){
      console.log("Error in retrievePrivateUserData in FollowingItem: ",error);
    }
  }

        return (
          //<TouchableOpacity  onPress={(()=>dispatch({type:"SET_PODCAST", payload: props.item}))}>
           //PROBLEM -- HAS TO BE FIXED AFTERWARDS
      // Directly navigating to ExploreTabNavigator(props.navigation.navigate) is not updating the UserBookPodcast & UserChapterPodcast
      // Directly pushing ExploreTabNavigator(props.navigation.push) is not updating the CustomUserHeader
      // This is a temporary solution provided which doesn't follow the chain of unique ExploreTabNavigators & unique UserStatsScreen &
      // simply falls back to the last point from which 1st time ExploreTabNavigator was opened.
      // Have to provide a solution which directly passes props to both CustomUserHeader & ExploreTabNavigator(UserBookPodcast & UserChapterPodcast)
      // so that complete chain of user profiles is followed back to the 1st screen.
    
    <View>
      {
        isUserSame ?

        <TouchableOpacity onPress={() => {
          props.navigation.navigate('ProfileTabNavigator');
        }}>
        <View style={{flexDirection:'row', marginLeft: 15,paddingVertical:10}}>
          <View style={{paddingRight:20}}>
            <Image source={{ uri: props.item.displayPicture }} style={{borderRadius:50,width:width/8,height:width/8}}/>
          </View>
          <View style={{alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontWeight:'bold',fontSize:18,paddingRight:5}}>{props.item.name}</Text>
            </View>
            </View>
            {/* </TouchableOpacity> */}
          </TouchableOpacity>

        :
        <TouchableOpacity onPress={() => {
          // [1] props.navigation.navigate shall update the props in CustomUserHeader
          retrievePrivateUserData(props,props.item.id);
          
          }}>
            <View style={{flexDirection:'row', marginLeft: 15,paddingVertical:10}}>
          <View style={{paddingRight:20}}>
            <Image source={{ uri: props.item.displayPicture }} style={{borderRadius:50,width:width/8,height:width/8}}/>
            </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontWeight:'bold',fontSize:18,paddingRight:5}}>{props.item.name}</Text>
            </View>
            </View>
            {/* </TouchableOpacity> */}
          </TouchableOpacity>
     }
      </View>
        );
      
  }, areEqual);

export default withFirebaseHOC(FollowingItem);
