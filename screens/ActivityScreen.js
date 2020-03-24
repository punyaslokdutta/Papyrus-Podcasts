

import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View,ActivityIndicator,Dimensions} from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {withFirebaseHOC} from '../screens/config/Firebase'
import ActivityItem from './ActivityItem'

var {width, height}=Dimensions.get('window')

class ActivityScreen  extends React.Component {
   
  constructor(props)
  {
    super(props)
    {
      this.state={
        activities : [],
        limit : 8,
        lastVisibleActivity : null,
        loading: false,
        refreshing: false,
        onEndReachedCalledDuringMomentum : true
      };
    }
  }


  componentDidMount = () => {
    try {
      this.retrieveData();
    }
    catch (error) {
      console.log(error);
    }
  };

  retrieveData = async () => {
    try {
      // Set State: Loading
      this.setState({
        loading: true,
      });
      console.log('Retrieving Data in Activity Screen');
      
      const  userid = this.props.firebase._getUid();
      const privateDataID = "private" + userid;

      let activityQuery = await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).collection('Activities')
                                .orderBy('creationTimestamp','desc').limit(this.state.limit).onSnapshot(
                                  (querySnapshot) =>
                                  {
                                    var documentActivities = [];

                                    querySnapshot.forEach(function(doc) {
                                      documentActivities.push(doc.data());
                                  });
                                    //let documentActivities = docs.map(document => document._data);
                                    console.log("Document Activities: ",documentActivities);
                              
                                    //var lastVisible = this.state.lastVisibleActivity;
                                    var lastVisible = documentActivities[documentActivities.length - 1].creationTimestamp;
                              
                                    this.setState({
                                      activities: documentActivities,
                                      lastVisibleActivity: lastVisible,
                                      loading: false
                                    });
                                   }
                                ); 
    }
    catch (error) {
      console.log(error);
    }
  };

  retrieveMoreActivities = async () => {
    try
     {

       {console.log("retrieveMoreActivities starts()")}

     this.setState({
       refreshing: true
        }); 

        //const  userid = this.props.firebase._getUid();
        const  userid = this.props.firebase._getUid();
        const privateDataID = "private" + userid;
        let additionalQuery = 9;
        try{
          additionalQuery = await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).collection('Activities')
                           .orderBy('creationTimestamp','desc')
                           .startAfter(this.state.lastVisibleActivity)
                           .limit(this.state.limit);
       
     // Cloud Firestore: Query Snapshot
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
       
     // Cloud Firestore: Document Data
     let documentData = documentSnapshots.docs.map(document => document.data());
     // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
     if(documentData.length != 0)
     {
        let lastVisibleActivity = documentData[documentData.length - 1].creationTimestamp;
          
        if(this.state.lastVisibleActivity == lastVisibleActivity){
            this.setState({
                    refreshing:false
                });
        }
        else
        {
          this.setState({
              activities: [...this.state.activities, ...documentData],
              //chapterPodcasts: documentData_chapterPodcasts,
              lastVisibleActivity : lastVisibleActivity,
              refreshing:false
            });
        }
     }
     else
     {
       this.setState({
         refreshing:false
     });
     }
     }
     catch(error){
     console.log(error);
     }
   }

   renderData=({item,index})=>
    {
       return(
         <View>
        <ActivityItem activity={item} index={index} navigation={this.props.navigation}/>
        </View>
       )
    }
   
   renderHeader = () => {
     return
     (
      <View>
     <Text>Activities</Text>
     </View>
     )
   }

   renderFooter = () => {
    try {
      if (this.state.refreshing===true) {
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

  onEndReached = ({ distanceFromEnd }) => {
    if(this.state.activities.length > 7)
    {
      if(!this.onEndReachedCalledDuringMomentum){
        this.retrieveMoreActivities()
        this.onEndReachedCalledDuringMomentum = true;
    }
    }
    
  }

  separator = () => <View style={[styles.separator]} />;

  render() {  
    return (
    

      <FlatList 
            nestedScrollEnabled={true}
            data={this.state.activities}
            renderItem={this.renderData}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.creationTimestamp}
            ListHeaderComponent={this.renderFooter}
            ItemSeparatorComponent={this.separator}
            //ListFooterComponent={this.renderFooter}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.01}
            refreshing={this.state.refreshing}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
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
