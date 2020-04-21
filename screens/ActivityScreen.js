

import React, {Component, useState,useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View,ActivityIndicator,Dimensions} from 'react-native';

import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {withFirebaseHOC} from '../screens/config/Firebase'
import ActivityItem from './ActivityItem'
import { useDispatch } from 'react-redux';
import { theme } from './components/categories/constants';

var {width, height}=Dimensions.get('window')

const ActivityScreen = (props) => {
   
  const dispatch = useDispatch();
  var [activities,setActivities] = useState([]);
  const limit = 12;
  var [lastVisibleActivity,setLastVisibleActivity] = useState(null);
  var [loading,setLoading] = useState(false);
  var [refreshing,setRefreshing] = useState(false);
  var [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);

  async function fetchActivities()
  {
    console.log('Retrieving Data in Activity Screen');
    setLoading(true);
    try{       
        const  userid = props.firebase._getUid();
        const privateDataID = "private" + userid;
  
         await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).collection('Activities')
                      .orderBy('creationTimestamp','desc').limit(limit).onSnapshot(
                        (querySnapshot) =>
                        {
                          var documentActivities = [];

                          querySnapshot.forEach(function(doc) {
                            documentActivities.push(doc.data());
                        });
                          console.log("Document Activities: ",documentActivities);
                          var lastVisible = null;
                          if(documentActivities.length != 0)
                            lastVisible = documentActivities[documentActivities.length - 1].creationTimestamp;
                    
                          setActivities(documentActivities);
                          setLastVisibleActivity(lastVisible);
                            
                          },function(error) {
                            console.log("Error in onSnapshot Listener in ActivityScreen: ",error);
                          }); 

        try{
          await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
            numNotifications : 0
          },{merge:true})
          dispatch({type:'ADD_NUM_NOTIFICATIONS',payload: 0})
        }
        catch(error){
          console.log(error);
        }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }

  }
  useEffect(
    () => {
      fetchActivities()
       
    },[])

  async function retrieveMoreActivities(){

    console.log("retrieveMoreActivities starts()")
    setRefreshing(true);
    try{   
     const  userid = props.firebase._getUid();
     const privateDataID = "private" + userid;
     let additionalActivities = await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).collection('Activities')
                        .orderBy('creationTimestamp','desc').startAfter(lastVisibleActivity).limit(limit).get();
       
     let documentData = additionalActivities.docs.map(document => document.data());
     if(documentData.length != 0)
     {
        let lastVisible = documentData[documentData.length - 1].creationTimestamp;
        if(lastVisibleActivity != lastVisible && (activities.length < 36))
        {
          setActivities([...activities, ...documentData]);
          setLastVisibleActivity(lastVisible);
        }
     }
    }
    catch(error){
      console.log(error);
    }
    finally {
      setRefreshing(false);
    }
   }

   function renderData({item,index})
    {
       return(
         <View>
        <ActivityItem activity={item} index={index} navigation={props.navigation}/>
        </View>
       )
    }
   
    function renderFooter() {
      
      if(refreshing == true)
        return (
          <ActivityIndicator/>
        ) 
      else
        return null
      
    }

   function renderHeader() {
    return (
      <View style={{flexDirection:'row',backgroundColor:'black',height:height/12,paddingLeft:theme.sizes.padding}}>
        
        <View style={{paddingTop:theme.sizes.padding*3/4}}>
        <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
          <View> 
        <Icon name="bars" size={22} style={{color:'white'}}/>
          </View>
        </TouchableOpacity>
        </View>
        <View>
        <Text style={{paddingTop:theme.sizes.padding/2,color:'white',fontSize:theme.sizes.font*1.7,paddingLeft:theme.sizes.padding/2,paddingRight:5}}> Activities </Text> 
      </View>
      </View>
      );
  }

  function onEndReached({ distanceFromEnd }){
    if(activities.length >=10 && activities.length < 40)
    {
      if(!onEndReachedCalledDuringMomentum){
        retrieveMoreActivities()
        setOnEndReachedCalledDuringMomentum(true);
    }
    }
    
  }

  function separator(){
    return(
      <View style={[styles.separator]} />
    );
  } 

  if(loading == true)
  {

    return (
      <View> 
        {renderHeader()}
      <ActivityIndicator />
      </View>
    )
  }
  else
  {
    return ( 
      <FlatList 
            nestedScrollEnabled={true}
            data={activities}
            renderItem={renderData}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.activityID}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            ItemSeparatorComponent={separator}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.01}
            refreshing={refreshing}
            onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
     />   
   );
  }

  }

export default withFirebaseHOC(ActivityScreen);


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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  separator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1
  }
});
