import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'

var {width, height}=Dimensions.get('window')

class UserChapterPodcast extends React.Component {
    
    static navigationOptions={
       // header:re
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
        onEndReachedCalledDuringMomentum : true
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
      try {
        this.setState({
          loading: true
        });
        console.log("[UserChapterPodcast] retrieveData");
        const  userid = this.props.navigation.state.params.userData.id;
        let query3 = await firestore().collectionGroup('podcasts').where('podcasterID','==',userid);    
        let documentChapterPodcasts = null;
        try{
         documentChapterPodcasts = await query3.where('isChapterPodcast','==',true).orderBy('createdOn','desc').limit(this.state.limit).get();
        }
        catch(error)
        {
          console.log(error);
        }
        if(documentChapterPodcasts.docs.length == 0)
          {
            this.setState({
              loading:false
              
              });
          }
        let documentData_chapterPodcasts = documentChapterPodcasts.docs.map(document => document.data());
  
        var lastVisibleChapterPodcast = this.state.lastVisibleChapterPodcast;  
        if(documentData_chapterPodcasts.length != 0)      
          lastVisibleChapterPodcast = documentData_chapterPodcasts[documentData_chapterPodcasts.length - 1].createdOn;
        
          this.setState({
            chapterPodcasts: documentData_chapterPodcasts,
            lastVisibleChapterPodcast: lastVisibleChapterPodcast,
            loading:false
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
 
          const  userid = this.props.navigation.state.params.userData.id;
          let additionalQuery = null;
          try{
            additionalQuery = await firestore().collectionGroup('podcasts')
                             .where('podcasterID','==',userid).where('isChapterPodcast','==',true)
                             .orderBy('createdOn','desc')
                             .startAfter(this.state.lastVisibleChapterPodcast)
                             .limit(this.state.limit);
         }
         catch(error)
         {
           console.log(error);
         }
         let documentSnapshots = null;
         try{
          documentSnapshots = await additionalQuery.get();
         }
         catch(error)
         {
           console.log(error);
         }
         
       let documentData = documentSnapshots.docs.map(document => document.data());
       if(documentData.length != 0)
       {
            let lastVisibleChapterPodcast = documentData[documentData.length - 1].createdOn;
          if(this.state.lastVisibleChapterPodcast === lastVisibleChapterPodcast)
          {
              this.setState({
                  refreshing:false
              });
          }
          else
          {
            this.setState({
              chapterPodcasts: [...this.state.chapterPodcasts, ...documentData],
              lastVisibleChapterPodcast : lastVisibleChapterPodcast,
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
        if (this.state.refreshing == true && this.state.chapterPodcasts.length > 6) {
          return (
            <View>
            <ActivityIndicator />
            </View>
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
      if(this.state.chapterPodcasts.length > (this.state.limit - 1))
      {
        if(!this.onEndReachedCalledDuringMomentum){
          this.retrieveMoreChapterPodcasts()
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
          <FlatList  nestedScrollEnabled={true}
          data={this.state.chapterPodcasts}
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
  

export default withFirebaseHOC(UserChapterPodcast);


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
