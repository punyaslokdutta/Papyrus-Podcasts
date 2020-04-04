import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,ActivityIndicator} from 'react-native';
import {withFirebaseHOC} from '../../config/Firebase'
import FollowerItem from '../Explore/FollowerItem';
var {width, height}=Dimensions.get('window')

class ProfileFollowerScreen extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        Followers:[], 
        //chapterPodcasts:[],
        limit:6,
        lastVisibleFollower:null,
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
        console.log('IN Profile Follower SCREEN');
        // Cloud Firestore: Query
        const userid = this.props.navigation.state.params.id;// props.firebase._getUid();
        var wholestring = "isUserFollowing." + userid;
        console.log(wholestring);

  
        let FollowerQuery =  await firestore().collectionGroup('privateUserData').where('following_list','array-contains',userid).orderBy('id')
                                                .limit(this.state.limit).onSnapshot(
                                                  async(docs) => {
                                                    let FollowerData = docs.docs.map(document=>document.data());
                                                    var lastVisibleFollower = this.state.lastVisibleFollower;
                                                    //var lastVisibleChapter = this.state.lastVisibleChapterPodcast;
                                            
                                                    lastVisibleFollower = FollowerData[FollowerData.length - 1].id;        
                                                    //lastVisibleChapter = documentData_chapterPodcasts[documentData_chapterPodcasts.length - 1].podcastID;
                                                     
                                                    this.setState({
                                                        Followers: FollowerData,
                                                   lastVisibleFollower:lastVisibleFollower,
                                                    loading:false
                                                    });
                                                  }
                                                );
        
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveMoreFollowers = async () => {
     try
      {

        {console.log("retrieveMoreProfileFollowers starts()")}

      this.setState({
        refreshing: true
         }); 

         const  userid = this.props.navigation.state.params.id;
         var wholestring = "isUserFollowing." + userid;
         console.log(wholestring);
  
        //  let FollowerQuery = await firestore().collection('users').where(wholestring,'==',true).get();
        //  let FollowerData = FollowerQuery.docs.map(document=>document.data());
         
         let additionalQuery = 9;
         try{
           additionalQuery = await firestore().collectionGroup('privateUserData').where('following_list','array-contains',userid).orderBy('id')
                            .startAfter(this.state.lastVisibleFollower)
                            .limit(this.state.limit);
        
      // Cloud Firestore: Query Snapshot
      {console.log("retrieveMoreProfileFollowers afterQuery()")}
         
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
      let lastVisibleFollower = documentData[documentData.length - 1].id;
       
      if(this.state.lastVisibleBookPodcast===lastVisibleBook){
          this.setState({
                  refreshing:false
              });
      }
      else
      {
        this.setState({
            Followers: [...this.state.Followers, ...documentData],
            //chapterPodcasts: documentData_chapterPodcasts,
            lastVisibleFollower : lastVisibleFollower,
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
      if(this.state.Followers.length>5)
      if(!this.onEndReachedCalledDuringMomentum){
        this.retrieveMoreFollowers();
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
      data={this.state.Followers}
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
  

export default withFirebaseHOC(ProfileFollowerScreen);


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
