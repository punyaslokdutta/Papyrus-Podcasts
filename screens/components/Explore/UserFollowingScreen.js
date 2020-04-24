import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'
import FollowingItem from '../Explore/FollowingItem';
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
        limit:11,
        lastVisibleFollowing:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true,
      }
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
      
      this.setState({
        loading: true,
      });
      console.log('IN USER FOLLOWING SCREEN');
      
      try {
       
        const userid = this.props.navigation.state.params.id;
        var wholestring = "isUserFollower." + userid;
        console.log(wholestring);

        let followingQuery =  await firestore().collection('users').where('followersList','array-contains',userid).orderBy('id')
                                                .limit(this.state.limit).get();
        let followingData = followingQuery.docs.map(document=>document.data());
        var lastVisibleFollowing = this.state.lastVisibleFollowing;

        if(followingData.length != 0)
          lastVisibleFollowing = followingData[followingData.length - 1].id;        
         
        this.setState({
            Followings: followingData,
            lastVisibleFollowing: lastVisibleFollowing
        });
      }
      catch (error) {
        console.log(error);
      }
      finally {
        this.setState({
          loading: false
        });
      }
    };

    retrieveMoreFollowings = async () => {
     
      console.log("retrieveMoreBookPodcasts starts()")
      this.setState({
        refreshing: true
      }); 

      try
      {
        const  userid = this.props.navigation.state.params.id;
         var wholestring = "isUserFollower." + userid;
         console.log(wholestring);
  
        let additionalUserFollowings = await firestore().collection('users').where('followersList','array-contains',userid).orderBy('id')
                                        .startAfter(this.state.lastVisibleFollowing).limit(this.state.limit).get();
        
        let documentData = additionalUserFollowings.docs.map(document => document.data());
        if(documentData.length != 0)
        {
          let lastVisibleFollowing = documentData[documentData.length - 1].id;
          if(this.state.lastVisibleFollowing != lastVisibleFollowing)
          {
            this.setState({
                Followings: [...this.state.Followings, ...documentData],
                lastVisibleFollowing : lastVisibleFollowing
              });
          }
        }
      }
      catch(error){
        console.log(error);
      }
      finally {
        this.setState({
          refreshing: false
        });
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
      if(this.state.Followings.length > (this.state.limit - 1))
      {
        if(!this.onEndReachedCalledDuringMomentum){
          this.retrieveMoreFollowings();
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
      data={this.state.Followings}
      renderItem={this.renderData}
      //numColumns={2}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.id}
     // ListHeaderComponent={this.renderHeader}
     ItemSeparatorComponent={this.separator}
       ListFooterComponent={this.renderFooter}
      onEndReached={this.onEndReached}
      onEndReachedThreshold={0.01}
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
  separator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1
  }
});
