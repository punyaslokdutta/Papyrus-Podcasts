import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'
import FollowerItem from './FollowerItem';
var {width, height}=Dimensions.get('window')

class UserFollowerScreen extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        Followers:[], 
        limit:12,
        lastVisibleFollower:null,
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
        console.log('IN USER Follower SCREEN');
        // Cloud Firestore: Query
        const userid = this.props.navigation.state.params.id;// props.firebase._getUid();
        var wholestring = "isUserFollowing." + userid;
        console.log(wholestring);

  
        let FollowerQuery =  await firestore().collectionGroup('privateUserData').where('followingList','array-contains',userid).orderBy('id')
                                                .limit(this.state.limit).onSnapshot(
                                                  async(docs) => {
                                                    let FollowerData = docs.docs.map(document=>document.data());
                                                    var lastVisibleFollower = this.state.lastVisibleFollower;                                     
                                                    lastVisibleFollower = FollowerData[FollowerData.length - 1].id;        
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

        {console.log("retrieveMoreBookPodcasts starts()")}

      this.setState({
        refreshing: true
         }); 

         const  userid = this.props.navigation.state.params.id;
         var wholestring = "isUserFollowing." + userid;
         console.log(wholestring);
  
        //  let FollowerQuery = await firestore().collection('users').where(wholestring,'==',true).get();
        //  let FollowerData = FollowerQuery.docs.map(document=>document.data());
         
         let additionalQuery = null;
         try{
           additionalQuery = await firestore().collectionGroup('privateUserData').where('followingList','array-contains',userid).orderBy('id')
                            .startAfter(this.state.lastVisibleFollower)
                            .limit(this.state.limit);
        
          console.log("retrieveMoreUserFollowers afterQuery()") 
        }
        catch(error) {
          console.log(error);
        }

        let documentSnapshots=null;
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
       
      if(this.state.lastVisibleFollower === lastVisibleFollower){
          this.setState({
                  refreshing:false
              });
      }
      else
      {
        this.setState({
            Followers: [...this.state.Followers, ...documentData],
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
        if (this.state.refreshing === true) {
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
      if(this.state.Followers.length > (this.state.limit - 1))
      {
        if(!this.onEndReachedCalledDuringMomentum){
          this.retrieveMoreFollowers()
          this.onEndReachedCalledDuringMomentum = true;
      }
      } 
  }

  separator = () => <View style={[styles.separator]} />;
    
 
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
  

export default withFirebaseHOC(UserFollowerScreen);


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
  separator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1
  }
});
