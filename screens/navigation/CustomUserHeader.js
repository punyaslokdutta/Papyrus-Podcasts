
import React, {Component,useState,useEffect} from 'react';
import UserBookPodcast from '../components/Explore/UserBookPodcast';
import UserChapterPodcast from '../components/Explore/UserChapterPodcast';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Button, ScrollView} from 'react-native';
import { Block, Text } from '../components/categories/components'
import { theme } from '../components/categories/constants';
import UserStatsScreen from '../components/Explore/UserStatsScreen'
import { withFirebaseHOC } from '../config/Firebase';
import firestore from '@react-native-firebase/firestore';


//const admin = require('firebase-admin')

var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;


retrieveData = async (message,userid,item) => {
   

    try{
      //const  userid =  props.firebase._getUid()
      console.log("USERID")
      console.log(userid)
        console.log(item.id)
        var val = userid
        //const map1 = isUserFollower[userid]; 
       // const wholestring = 'isUserFollower[' + userid + ']';
if(message === 'FOLLOWING')
{
        let addQuery1 = await firestore().collection('users').doc(item.id).set({
                   followers_list : firestore.FieldValue.arrayUnion(userid),
                   isUserFollower : {[val] : true},
               },{ merge:true })
        console.log("IN RETRIEVE DATA")
        //console.log(addQuery1._data);
      }  }
    catch(error){
      console.log(error)
    }
  
};


const CustomUserHeader = (props) => {
    {console.log("Inside Custom Explore user header ..................||||||||||||||||||||||")}
    


    // useEffect(
    //     (message) => {
    //       //const {podcast} =playerGlobalState;
    //        if(message === "Following")
    //        {

    //        }
    //        else
    //        {
               
    //        }
    //     }, [message]
    //   )

    if(props === undefined || props.navigation === undefined || props.navigation.state === undefined || props.navigation.state.routes[1] === undefined || 
        props.navigation.state.routes[1].params === undefined)
        {
            return(
                <Text>FGHJVBJ</Text>
            )        
        }
    else
    {
       var text1 = "Follow+";
       const  userid =  props.firebase._getUid()//props.navigation.state.routes[1].params.userID; 
       const item = props.navigation.state.routes[1].params.userData;
      const wholestring = 'isUserFollower.' + userid;
     const [message,setMessage] = useState(props.navigation.state.routes[1].params.followsOrNot);
     //console.log(userid)

    //  let addQuery1 = await firestore().collection('users').get()
    //    console.log(addQuery1.docs);
//console.log(message)

     console.log("Outside use Effect");
  //    useEffect( (message) => {
  //      console.log("Inside USE EFFECCCCCCCCTTTTTTTTTTTTTTTTTTT")
  //      console.log(message)
   
  //         console.log(message)
  //          console.log("IF MESSAGE IS EQUAL TO FOLLOWING")
  //         //  let addQuery1 = await firestore().collection('users').get()
  //         //  console.log(addQuery1.docs);
          
  // },[]);
     
      return (
        <View>
        <View style={{alignItems:'flex-end',paddingRight:10,paddingTop:10}}>
        <Button title={message} style={{flex:1,alignItems:'flex-end', justifyContent:'flex-end', height:SCREEN_HEIGHT/25, width:SCREEN_WIDTH/3,
                    borderRadius:5, backgroundColor:theme.colors.primary}} onPress={() => {
                      if(message === 'FOLLOW')
                        setMessage('FOLLOWING')
                      else
                        setMessage('FOLLOW')
                        //console.log(userid)
                      retrieveData(message,userid,item);

                    }}></Button>
        </View>
          <View style={{alignItems:'center',justifyContent:'center', flexDirection:'column'}}>
            <View style={{flexDirection:'column'}}>
      <Text h3 >{props.navigation.state.routes[1].params.userData.name}'s</Text>
              <View style = {{alignItems:'center'}}>
              <Text h2 bold>Collections</Text>
              </View>
              </View>
              
              <TouchableOpacity style={{alignItems:'center'}} onPress={() => props.navigation.navigate('UserStatsScreen',{item:props.navigation.state.routes[1].params.userData})}>
              <Image
                  source={{uri : props.navigation.state.routes[1].params.userData.displayPicture}}
                  style={styles.avatar}
                />
                </TouchableOpacity>
              </View>
              </View>
      );
    }
    
  };

  export default withFirebaseHOC(CustomUserHeader);

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
    buttonStyle: {
      padding:10,
      backgroundColor: '#202646',
      borderRadius:5
      },
      textStyle: {
        fontSize:20,
      color: '#ffffff',
      textAlign: 'center'
      },
      drawerimage:
      {
        height: 100, 
        width:100, 
        borderRadius:50, 
  
      }, 
      contentContainer: {
        flexGrow: 1,
      },
      navContainer: {
        height: HEADER_HEIGHT,
        marginHorizontal: 10,
      },
      statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
      },
      navBar: {
        height: NAV_BAR_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
      },
      titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
      },
      header: {
        paddingHorizontal: theme.sizes.base * 2,
        paddingTop: theme.sizes.base * 2.5,
        paddingBottom :theme.sizes.base * 0.5,
      }, 
       avatar: {
      height: theme.sizes.base * 2.2,
      width: theme.sizes.base * 2.2,
      borderRadius: theme.sizes.base * 2.2, 
      
    }
  });