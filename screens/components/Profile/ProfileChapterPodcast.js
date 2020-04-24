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
      try {
        console.log('Retrieving Data');
        const  userid = this.props.firebase._getUid();
        await firestore().collectionGroup('podcasts').where('podcasterID','==',userid).   
          where('isChapterPodcast','==',true).orderBy('createdOn','desc').limit(this.state.limit)
            .onSnapshot((querySnapshot) =>
            {
              var documentData_podcasts = [];

              querySnapshot.forEach(function(doc) {
                documentData_podcasts.push(doc.data());
            });
              var lastVisibleChapter = this.state.lastVisibleChapterPodcast;
              if(documentData_podcasts.length != 0)
                lastVisibleChapter = documentData_podcasts[documentData_podcasts.length - 1].createdOn;        

            this.setState({
              chapterPodcasts: documentData_podcasts,
              lastVisibleChapterPodcast: lastVisibleChapter
              });
            },function(error) {
            console.log("Error in onSnapshot Listener in ProfileChapterPodcast: ",error);
          })
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

    retrieveMoreChapterPodcasts = async () => {
      
      this.setState({
          refreshing: true
        }); 

      try{
        const  userid = this.props.firebase._getUid();
        let chapterPodcasts = await firestore().collectionGroup('podcasts').where('podcasterID','==',userid).where('isChapterPodcast','==',true)
                          .orderBy('createdOn','desc').startAfter(this.state.lastVisibleChapterPodcast).limit(this.state.limit).get();
          
        let documentData = chapterPodcasts.docs.map(document => document.data());
        if(documentData.length != 0)
        {
            let lastVisibleChapter = documentData[documentData.length - 1].createdOn;
            if(this.state.lastVisibleChapterPodcast !== lastVisibleChapter)
            {
              this.setState({
                chapterPodcasts: [...this.state.chapterPodcasts, ...documentData],
                lastVisibleChapterPodcast : lastVisibleChapter,
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
      if(this.state.chapterPodcasts.length > (this.state.limit - 1))
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
