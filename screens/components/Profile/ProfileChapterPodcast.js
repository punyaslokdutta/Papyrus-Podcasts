import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'

var {width, height}=Dimensions.get('window')



class ProfileChapterPodcast extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        chapterPodcasts:[],
        limit:6,
        lastVisibleChapterPodcast:null,
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
          //refreshing:true
        });
        console.log('Retrieving Data');
        // Cloud Firestore: Query
        const  userid = this.props.firebase._getUid();
        let query3 = await firestore().collectionGroup('Podcasts').where('podcasterID','==',userid);    
        //let documentPodcasts = await query3.where('ChapterName','==',"").orderBy('PodcastID').limit(this.state.limit).get();
        let documentChapterPodcasts = 90;
        try{
         documentChapterPodcasts = await query3.where('isChapterPodcast','==',true).limit(this.state.limit).get();
        //let documentData_podcasts = documentPodcasts.docs.map(document => document.data());
        }
        catch(error)
        {
          console.log(error);
        }
        let documentData_chapterPodcasts = documentChapterPodcasts.docs.map(document => document.data());
        //var lastVisibleBook = this.state.lastVisibleBookPodcast;
  
        var lastVisibleChapter = this.state.lastVisibleChapterPodcast;

        //lastVisibleBook = documentData_podcasts[documentData_podcasts.length - 1].PodcastID;  
        if(documentData_chapterPodcasts.length != 0)            
          lastVisibleChapter = documentData_chapterPodcasts[documentData_chapterPodcasts.length - 1].PodcastID;
        
          this.setState({
            //bookPodcasts: documentData_podcasts,
            chapterPodcasts: documentData_chapterPodcasts,
            //lastVisibleBookPodcast:lastVisibleBook,
            lastVisibleChapterPodcast: lastVisibleChapter,
            loading:false,
            //refreshing:false
            });
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveMoreChapterPodcasts = async () => {
      try
       {
 
       this.setState({
         refreshing: true
          }); 
 
          const  userid = this.props.firebase._getUid();
          let additionalQuery = 9;
          try{
           // let documentChapterPodcasts = await query3.where('isChapterPodcast','==',true).limit(this.state.limit).get();
            additionalQuery = await firestore().collectionGroup('Podcasts')
                             .where('podcasterID','==',userid).where('isChapterPodcast','==',true)
                             .orderBy('PodcastID')
                             .startAfter(this.state.lastVisibleChapterPodcast)
                             .limit(this.state.limit);
         
       // Cloud Firestore: Query Snapshot
          
         }
         catch(error)
         {
           console.log(error);
         }
         let documentSnapshots = 98;
         try{
          documentSnapshots = await additionalQuery.get();
         }
         catch(error)
         {
           console.log(error);
         }
         
       // Cloud Firestore: Document Data
       let documentData = documentSnapshots.docs.map(document => document.data());
       this.setState({
        refreshing:false
    });
       // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
       if(documentData.length != 0)
       {
            let lastVisibleChapter = documentData[documentData.length - 1].PodcastID;
          if(this.state.lastVisibleChapter === lastVisibleChapter)
          {
              this.setState({
                  refreshing:false
              });
          }
          else
          {
            this.setState({
              chapterPodcasts: [...this.state.chapterPodcasts, ...documentData],
              lastVisibleChapterPodcast : lastVisibleChapter,
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
        if (this.state.refreshing === true && this.state.chapterPodcasts.length > 6) {
          return (
            //null
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
      if(this.state.chapterPodcasts.length>5)
      {
      if(!this.onEndReachedCalledDuringMomentum){
          this.retrieveMoreChapterPodcasts()
          this.onEndReachedCalledDuringMomentum = true;
      }
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
      else if(this.state.chapterPodcasts.length != 0)
      {
        return (
        
          <View style = {{paddingBottom:20}}>
              <View>
          {/* {this.state.activeIndex ? this.renderSectionTwo() : this.renderSectionOne()} */}
          <FlatList  nestedScrollEnabled={true}
          data={this.state.chapterPodcasts}
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
  

export default withFirebaseHOC(ProfileChapterPodcast);


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
