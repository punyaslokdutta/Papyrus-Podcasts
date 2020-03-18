import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'
import FollowingItem from './FollowingItem';
var {width, height}=Dimensions.get('window')

class UserFollowingScreen extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {
      this.state={
        Followings:[], 
        //chapterPodcasts:[],
        limit:6,
        lastVisibleFollowing:null,
        //lastVisibleChapterPodcast:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true,
        // navigation: this.props.navigation,
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
        console.log('IN USER FOLLOWING SCREEN');
        // Cloud Firestore: Query
        const userid = this.props.navigation.state.params.id;// props.firebase._getUid();
        var wholestring = "isUserFollower." + userid;
        console.log(wholestring);

        
        let followingQuery =  await firestore().collection('users').where('followers_list','array-contains',userid).orderBy('id')
                                                .limit(this.state.limit).get();
        let followingData = followingQuery.docs.map(document=>document.data());
        var lastVisibleFollowing = this.state.lastVisibleFollowing;
        //var lastVisibleChapter = this.state.lastVisibleChapterPodcast;

        lastVisibleFollowing = followingData[followingData.length - 1].id;        
        //lastVisibleChapter = documentData_chapterPodcasts[documentData_chapterPodcasts.length - 1].PodcastID;
         
        this.setState({
            Followings: followingData,
       lastVisibleFollowing:lastVisibleFollowing,
        loading:false
        });
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveMoreFollowings = async () => {
     try
      {

        {console.log("retrieveMoreBookPodcasts starts()")}

      this.setState({
        refreshing: true
         }); 

         const  userid = this.props.navigation.state.params.id;
         var wholestring = "isUserFollower." + userid;
         console.log(wholestring);
  
        //  let followingQuery = await firestore().collection('users').where(wholestring,'==',true).get();
        //  let followingData = followingQuery.docs.map(document=>document.data());
         
         let additionalQuery = 9;
         try{
           additionalQuery = await firestore().collection('users').where('followers_list','array-contains',userid).orderBy('id')
                            .startAfter(this.state.lastVisibleFollowing)
                            .limit(this.state.limit);
        
      // Cloud Firestore: Query Snapshot
      {console.log("retrieveMoreUserFollowings afterQuery()")}
         
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
       
      if(this.state.lastVisibleBookPodcast===lastVisibleBook){
          this.setState({
                  refreshing:false
              });
      }
      else
      {
        this.setState({
            Followings: [...this.state.Followings, ...documentData],
            //chapterPodcasts: documentData_chapterPodcasts,
            lastVisibleFollowing : lastVisibleFollowing,
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
        <FollowingItem item={item} index={index} navigation={this.props.navigation}/>
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
      if(this.state.Followings.length>5)
      if(!this.onEndReachedCalledDuringMomentum){
          this.retrieveMoreFollowings();
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
      data={this.state.Followings}
      renderItem={this.renderData}
      //numColumns={2}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.id}
     // ListHeaderComponent={this.renderHeader}
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
  

export default withFirebaseHOC(UserFollowingScreen);


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
