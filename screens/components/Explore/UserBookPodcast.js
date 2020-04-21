import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'

var {width, height}=Dimensions.get('window')

class UserBookPodcast extends React.Component {
    
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
      
      console.log("[UserBookPodcast] Inside retrieveData function");
      this.setState({
        loading: true,
      });
      try {
        const  userid = this.props.navigation.state.params.userData.id;       
        let documentPodcasts = await firestore().collectionGroup('podcasts').where('podcasterID','==',userid)
                              .where('isChapterPodcast','==',false).orderBy('createdOn','desc').limit(this.state.limit).get();
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
     
      console.log("[UserBookPodcast] retrieveMoreBookPodcasts starts()")
      this.setState({
        refreshing: true
         }); 

      try{
        const  userid = this.props.navigation.state.params.userData.id;
         
         
        let additionalBookPodcasts = await firestore().collectionGroup('podcasts').where('podcasterID','==',userid).
                                        where('isChapterPodcast','==',false).orderBy('createdOn','desc').
                                        startAfter(this.state.lastVisibleBookPodcast).limit(this.state.limit).get();
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
        <Podcast podcast={item} index={index} navigation={this.props.navigation}/>
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

    render() {
     
      if(this.state.loading)
      {
        return (
          <View style={{paddingTop: height/3}}>
          <ActivityIndicator/>
          </View>
        ) 
      }
      else
      {
        return (
        
          <View style = {{paddingBottom:20}}>
          <View>
          <FlatList   
          nestedScrollEnabled={true}
          data={this.state.bookPodcasts}
          renderItem={this.renderData}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.podcastID}
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
  }
  

export default withFirebaseHOC(UserBookPodcast);


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
