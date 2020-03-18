import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
//import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'
//import LikerItem from '../PodcastPlayer/LikerItem';
import FollowingItem from '../Explore/FollowingItem';
import FollowerItem from '../Explore/FollowerItem'
var {width, height}=Dimensions.get('window')

class LikersScreen extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {
        this.state = {
            Likers:[], 
            limit:6,
            lastVisibleLiker:null,
            refreshing:false,
            loading:false,
            onEndReachedCalledDuringMomentum : true,
        }
     }
   }
   
     componentDidMount = () => {
      try {
        // Cloud Firestore: Initial Query
        this.retrieveData();
      }
      catch (error) {
        console.log(error);
      }
    };
    

     //retrieve data
     retrieveData = async () => {
      try {
        // Set State: Loading
        this.setState({
          loading: true,
        });
        console.log('IN LikersScreen ');
        // Cloud Firestore: Query
        const podcastId = this.props.navigation.state.params.podcastID;// props.firebase._getUid();
        
        let likersQuery =  await firestore().collection('users').where('podcastsLiked','array-contains',podcastId).orderBy('id')
                                                .limit(this.state.limit).get();
        let likersData = likersQuery.docs.map(document=>document.data());
        var lastVisibleLiker = this.state.lastVisibleLiker;

        lastVisibleLiker = likersData[likersData.length - 1].id;        
         
        this.setState({
            Likers: likersData,
           lastVisibleLiker:lastVisibleLiker,
            loading:false
        });
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveMoreLikers = async () => {
     try
      {

        {console.log("retrieveMoreLikers starts()")}

      this.setState({
        refreshing: true
         }); 

         const podcastId = this.props.navigation.state.params.podcastID;// props.firebase._getUid();

         let additionalQuery = 9;
         try{
//             let likersQuery =  await firestore().collection('users').where('podcastsLiked','array-contains',podcastId).orderBy('id')
//             .limit(this.state.limit).get();
// let likersData = likersQuery.docs.map(document=>document.data());
// var lastVisibleLiker = this.state.lastVisibleLiker;

// lastVisibleLiker = likersData[likersData.length - 1].id;        

           additionalQuery = await firestore().collection('users').where('podcastsLiked','array-contains',podcastId).orderBy('id')
                            .startAfter(this.state.lastVisibleLiker)
                            .limit(this.state.limit);
        
      // Cloud Firestore: Query Snapshot
      {console.log("retrieveMoreLikers afterQuery()")}
         
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
      let lastVisibleFollowing = documentData[documentData.length - 1].id;
       
      if(this.state.lastVisibleLiker===lastVisibleLiker){
          this.setState({
                  refreshing:false
              });
      }
      else
      {
        this.setState({
            Likers: [...this.state.Likers, ...documentData],
            lastVisibleLiker : lastVisibleLiker,
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
        <FollowerItem item={item} index={index} navigation={this.props.navigation}/>
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
      if(this.state.Likers.length>5)
      if(!this.onEndReachedCalledDuringMomentum){
        this.retrieveMoreLikers();
          this.onEndReachedCalledDuringMomentum = true;
      }
      
  }

  separator = () => <View style={[styles.separator,{paddingTop:height/96}]} />;
    
 
  render() {
    const { navigation } = this.props;
    return (
     
       <View style = {{paddingBottom:20}}>
           <View>
               
       <FlatList nestedScrollEnabled={true}
            data={this.state.Likers}
            renderItem={this.renderData}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.separator}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
            refreshing={this.state.refreshing}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
       />
    </View>
       </View>
    
    );
  }
  }
  

export default withFirebaseHOC(LikersScreen);


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
  AppHeader:
  {
 flexDirection:'row',
 backgroundColor: 'white'
  },
});
