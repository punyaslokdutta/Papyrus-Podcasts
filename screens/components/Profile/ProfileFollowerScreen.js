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
        limit:10,
        lastVisibleFollower:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true
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
    

    retrieveData = async () => {
      
      this.setState({
        loading: true,
      });
      console.log('IN Profile Follower SCREEN');

      try {
        const userid = this.props.navigation.state.params.id;
        var wholestring = "isUserFollowing." + userid;
        console.log(wholestring);

  
       let profileFollowerDocs = await firestore().collectionGroup('privateUserData').where('followingList','array-contains',userid).orderBy('id')
                                 .limit(this.state.limit).get();
        let FollowerData = profileFollowerDocs.docs.map(document=>document.data());
        var lastVisibleFollower = this.state.lastVisibleFollower;
        if(FollowerData.length != 0)                                            
          lastVisibleFollower = FollowerData[FollowerData.length - 1].id;        
        
        this.setState({
            Followers: FollowerData,
            lastVisibleFollower:lastVisibleFollower
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

    retrieveMoreFollowers = async () => {

      console.log("retrieveMoreProfileFollowers starts()")
      this.setState({
        refreshing: true
         }); 
      try{
         const  userid = this.props.navigation.state.params.id;
         var wholestring = "isUserFollowing." + userid;
         console.log(wholestring);
  
         let additionalProfileFollowers = await firestore().collectionGroup('privateUserData').where('followingList','array-contains',userid)
                                          .orderBy('id').startAfter(this.state.lastVisibleFollower).limit(this.state.limit).get();
        
        let documentData = additionalProfileFollowers.docs.map(document => document.data());
        if(documentData.length != 0)
        {
          let lastVisibleFollower = documentData[documentData.length - 1].id;
          if(this.state.lastVisibleFollower != lastVisibleFollower)
          {
            this.setState({
                Followers: [...this.state.Followers, ...documentData],
                lastVisibleFollower : lastVisibleFollower
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
      if(this.state.Followers.length > (this.state.limit - 1))
      {
        if(!this.onEndReachedCalledDuringMomentum)
        {
          this.retrieveMoreFollowers();
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
  separator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1
  }
});
