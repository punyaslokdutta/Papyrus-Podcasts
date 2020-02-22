import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'

var {width, height}=Dimensions.get('window')

class UserBookPodcast extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        bookPodcasts:[], 
        //chapterPodcasts:[],
        limit:6,
        lastVisibleBookPodcast:null,
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
        console.log('Retrieving Data IN  UUUSSEEERRRRRRRRR BOOk PODCAST  ...........PPPPPPPPPPPPPPPPP');
        console.log(this.props.navigation.state.params);
        // Cloud Firestore: Query
        const  userid = this.props.navigation.state.params.userData.id;
        
       // {props.navigation.state.routes[1].params.userID}
        //const userid = this.props.use;
        let query3 = await firestore().collectionGroup('Podcasts').where('podcasterID','==',userid);    
        let documentPodcasts = await query3.where('ChapterName','==',"").orderBy('PodcastID').limit(this.state.limit).get();
       // let documentChapterPodcasts = await query3.where('isChapterPodcast','==',true).limit(this.state.limit).get();
        let documentData_podcasts = documentPodcasts.docs.map(document => document.data());
        //let documentData_chapterPodcasts = documentChapterPodcasts.docs.map(document => document.data());
        var lastVisibleBook = this.state.lastVisibleBookPodcast;
        //var lastVisibleChapter = this.state.lastVisibleChapterPodcast;

        lastVisibleBook = documentData_podcasts[documentData_podcasts.length - 1].PodcastID;        
        //lastVisibleChapter = documentData_chapterPodcasts[documentData_chapterPodcasts.length - 1].PodcastID;
         
        this.setState({
        bookPodcasts: documentData_podcasts,
       // chapterPodcasts: documentData_chapterPodcasts,
        lastVisibleBookPodcast:lastVisibleBook,
        //lastVisibleChapterPodcast: lastVisibleChapter,
        loading:false
        });
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveMoreBookPodcasts = async () => {
     try
      {

        {console.log("retrieveMoreBookPodcasts starts()")}

      this.setState({
        refreshing: true
         }); 

         //const  userid = this.props.firebase._getUid();
         const  userid = this.props.navigation.state.params.userData.id;
         let additionalQuery = 9;
         try{
           additionalQuery = await firestore().collectionGroup('Podcasts')
                            .where('podcasterID','==',userid).where('ChapterName','==',"")
                            .orderBy('PodcastID')
                            .startAfter(this.state.lastVisibleBookPodcast)
                            .limit(this.state.limit);
        
      // Cloud Firestore: Query Snapshot
      {console.log("retrieveMoreBookPodcasts afterQuery()")}
         
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
      let lastVisibleBook = documentData[documentData.length - 1].PodcastID;
       
      if(this.state.lastVisibleBookPodcast===lastVisibleBook){
          this.setState({
                  refreshing:false
              });
      }
      else
      {
        this.setState({
            bookPodcasts: [...this.state.bookPodcasts, ...documentData],
            //chapterPodcasts: documentData_chapterPodcasts,
            lastVisibleBookPodcast : lastVisibleBook,
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
        <Podcast podcast={item} index={index} navigation={this.props.navigation}/>
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
      if(this.state.bookPodcasts.length>5)
      if(!this.onEndReachedCalledDuringMomentum){
          this.retrieveMoreBookPodcasts()
          this.onEndReachedCalledDuringMomentum = true;
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
          <FlatList   nestedScrollEnabled={true}
          data={this.state.bookPodcasts}
          renderItem={this.renderData}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.PodcastID}
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
