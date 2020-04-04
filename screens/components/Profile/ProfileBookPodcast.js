import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'

var {width, height}=Dimensions.get('window')

class ProfileBookPodcast extends React.Component {
    
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
        console.log('Retrieving Data');
        // Cloud Firestore: Query
        const  userid = this.props.firebase._getUid();
        let query3 = await firestore().collectionGroup('Podcasts').where('podcasterID','==',userid).   
                      where('chapterName','==',"").orderBy('timestamp','desc').limit(this.state.limit)
                       .onSnapshot((querySnapshot) =>
                        {
                          var documentData_podcasts = [];

                          querySnapshot.forEach(function(doc) {
                            documentData_podcasts.push(doc.data());
                        });
                          var lastVisibleBook = this.state.lastVisibleBookPodcast;
                          if(documentData_podcasts.length != 0)
                            lastVisibleBook = documentData_podcasts[documentData_podcasts.length - 1].podcastID;        
                          
                          this.setState({
                          bookPodcasts: documentData_podcasts,
                          lastVisibleBookPodcast:lastVisibleBook,
                          loading:false
                          });
                        }
        )
        
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

         const  userid = this.props.firebase._getUid();
         let additionalQuery = 9;
         try{
           additionalQuery = await firestore().collectionGroup('Podcasts')
                            .where('podcasterID','==',userid).where('chapterName','==',"")
                            .orderBy('timestamp','desc')
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
      let lastVisibleBook = documentData[documentData.length - 1].podcastID;
       
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
      const { navigation } = this.props;
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
          <FlatList   nestedScrollEnabled={true}
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
  

export default withFirebaseHOC(ProfileBookPodcast);


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
