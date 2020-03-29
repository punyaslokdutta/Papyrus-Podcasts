

import React, {Component, useState,useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View,ActivityIndicator,Dimensions} from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {withFirebaseHOC} from '../screens/config/Firebase'
import ActivityItem from './ActivityItem'
import { useDispatch } from 'react-redux';

var {width, height}=Dimensions.get('window')

const ActivityScreen = (props) => {
   
  const dispatch = useDispatch();
  var [activities,setActivities] = useState([]);
  const limit = 10;
  var [lastVisibleActivity,setLastVisibleActivity] = useState(null);
  var [loading,setLoading] = useState(false);
  var [refreshing,setRefreshing] = useState(false);
  var [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);



  async function fetchActivities()
  {
    setLoading(true);
       try {       
        console.log('Retrieving Data in Activity Screen');
        
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
                            
                          }
                      ); 

        await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
          numNotifications : 0
        },{merge:true})

        dispatch({type:'ADD_NUM_NOTIFICATIONS',payload: 0})
      }
      catch (error) {
        console.log(error);
      }

       setLoading(false);

  }
  useEffect(
    () => {
      fetchActivities()
       
    },[])

  async function retrieveMoreActivities(){
    
    setRefreshing(true);

    try
     {
       {console.log("retrieveMoreActivities starts()")}
        const  userid = props.firebase._getUid();
        const privateDataID = "private" + userid;
        let additionalQuery = 9;
        try{
          additionalQuery = await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).collection('Activities')
                           .orderBy('creationTimestamp','desc')
                           .startAfter(lastVisibleActivity)
                           .limit(limit);
       
     
      {console.log("retrieveMoreActivities afterQuery()")}
        
       }
       catch(error)
       {
         console.log(error);
       }
       let documentSnapshots=9;
       try{
        documentSnapshots = await additionalQuery.get();
       }
       catch(error)
       {
           console.log(error);
       }
       
     let documentData = documentSnapshots.docs.map(document => document.data());
     if(documentData.length != 0)
     {
        let lastVisible = documentData[documentData.length - 1].creationTimestamp;
          
        if(lastVisibleActivity == lastVisible){
          setRefreshing(false);
        }
        else
        {
          setActivities([...activities, ...documentData]);
          setLastVisibleActivity(lastVisible);
          setRefreshing(false);
        }
     }
     else
     {
        setRefreshing(false);
     }
     }
     catch(error){
        console.log(error);
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
   
   function renderHeader() {
     return
     (
      <View>
     <Text>Activities</Text>
     </View>
     )
   }

   function renderFooter() {
    try {
      if (refreshing == true) {
        return (
          <ActivityIndicator />
        )
      }
      else {
        return null;
      }
    }
    catch (error) {
      console.log(error);
    }
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
      <ActivityIndicator />
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
            keyExtractor={item => item.creationTimestamp}
            ListHeaderComponent={renderFooter}
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
