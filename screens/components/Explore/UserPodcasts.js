import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList, RefreshControl, Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'
import {useSelector, useDispatch,connect} from "react-redux"

var {width, height}=Dimensions.get('window')

class UserPodcasts extends React.Component {
    
    static navigationOptions={
       // header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        bookPodcasts:[],
        limit:6,
        lastVisibleBookPodcast:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true,
        scrollPosition: 0
      }
      }
    
     }
   
     componentDidMount = () => {
      try {
        this.props.navigation.addListener('didFocus', (route) => {
          console.log("USER_PODCASTS TAB PRESSED");
          this.props.dispatch({type:"CHANGE_SCREEN"});
          });
        this.retrieveData();
      }
      catch (error) {
        console.log(error);
      }
    };
    
     retrieveData = async () => {
      
      console.log("[UserPodcasts] Inside retrieveData function");
      this.setState({
        loading: true,
      });
      try {
        const  userid = this.props.navigation.state.params.userData.id;       
        let documentPodcasts = await firestore().collectionGroup('podcasts').where('podcasterID','==',userid)
                              .orderBy('createdOn','desc').limit(this.state.limit).get();
        let documentData_podcasts = documentPodcasts.docs.map(document => document.data());
        var lastVisibleBookPodcast = this.state.lastVisibleBookPodcast;

        if(documentData_podcasts.length != 0)
          lastVisibleBookPodcast = documentData_podcasts[documentData_podcasts.length - 1].createdOn;        
         
        this.setState({
        bookPodcasts: documentData_podcasts,
        lastVisibleBookPodcast:lastVisibleBookPodcast
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

    retrieveMoreBookPodcasts = async () => {
     
      console.log("[UserPodcasts] retrieveMoreBookPodcasts starts()")
      this.setState({
        refreshing: true
         }); 

      try{
        const  userid = this.props.navigation.state.params.userData.id;
         
         
        let additionalBookPodcasts = await firestore().collectionGroup('podcasts').where('podcasterID','==',userid)
                                        .orderBy('createdOn','desc')
                                        .startAfter(this.state.lastVisibleBookPodcast).limit(this.state.limit).get();
        let documentData = additionalBookPodcasts.docs.map(document => document.data());
        if(documentData.length != 0)
        {
          let lastVisibleBookPodcast = documentData[documentData.length - 1].createdOn;
          if(this.state.lastVisibleBookPodcast != lastVisibleBookPodcast)
          {
            this.setState({
                bookPodcasts: [...this.state.bookPodcasts, ...documentData],
                lastVisibleBookPodcast : lastVisibleBookPodcast
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
        <Podcast podcast={item} scrollPosition={this.state.scrollPosition} index={index} navigation={this.props.navigation}/>
        </View>
       )
    }

   

    renderFooter = () => {
      
      if (this.state.refreshing == true) {
        return (
          <ActivityIndicator />
        )
      }
      else {
        return null;
      }
    }

    onEndReached = ({ distanceFromEnd }) => {
      if(this.state.bookPodcasts.length > (this.state.limit - 1))
      {
        if(!this.onEndReachedCalledDuringMomentum)
        {
            this.retrieveMoreBookPodcasts()
            this.onEndReachedCalledDuringMomentum = true;
        }
      }
  }
  handleRefresh = () => {
    this.retrieveData();
  }

  handleScroll = (event) => {
    console.log("In handleScroll : ",event.nativeEvent.contentOffset.y);
    if(Math.abs(this.state.scrollPosition - event.nativeEvent.contentOffset.y) >= height/6)
      this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
    //setScrollPosition(event.nativeEvent.contentOffset.y);
   }

    render() {
     
      if(this.state.loading)
      {
        return (
          <View style={{paddingTop: height/3}}>
          <ActivityIndicator/>
          </View>
        ) 
      }
      else if(this.state.bookPodcasts.length != 0)
      {
        return (
        
          <View style = {{paddingBottom:20}}>
          <View>
          <FlatList   
          nestedScrollEnabled={true}
          data={this.state.bookPodcasts}
          renderItem={this.renderData}
          onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.podcastID}
          ListFooterComponent={this.renderFooter}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={this.state.refreshing}
          onRefresh={() => this.handleRefresh()}
          refreshControl={
            <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            />
           }
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
        />
        </View>
          </View>
        
        );
      }
      else
      {
        return(
          <View style={{alignItems:'center',paddingTop:height/5}}>
              
          <Image 
          source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/HomeScreen/WhatsApp%20Image%202020-03-29%20at%206.17.51%20PM.jpeg"}}
          style={{height: height/4,width: width/4}}/>
          </View>
        );
        
      }
    }
  }
  
const mapDispatchToProps = (dispatch) =>{
  return{
      dispatch,
  }}

export default connect(null,mapDispatchToProps)(withFirebaseHOC(UserPodcasts))


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
