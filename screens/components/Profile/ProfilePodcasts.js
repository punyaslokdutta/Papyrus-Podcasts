import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'

var {width, height}=Dimensions.get('window')

class ProfilePodcasts extends React.Component {
  static navigationOptions={
      header:null
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
    
    this.setState({
      loading: true,
    });

    try {
      console.log('Retrieving Data');
      const  userid = this.props.firebase._getUid();
      await firestore().collectionGroup('podcasts').where('podcasterID','==',userid)//.where('isChapterPodcast','==',false)
      .orderBy('createdOn','desc').limit(this.state.limit)
          .onSnapshot((querySnapshot) =>
          {
            var documentData_podcasts = [];

            querySnapshot.forEach(function(doc) {
              documentData_podcasts.push(doc.data());
            });
            var lastVisibleBook = this.state.lastVisibleBookPodcast;
            if(documentData_podcasts.length != 0)
              lastVisibleBook = documentData_podcasts[documentData_podcasts.length - 1].createdOn;        
            
            this.setState({
              bookPodcasts: documentData_podcasts,
              lastVisibleBookPodcast:lastVisibleBook
            });
          },function(error) {
            console.log("Error in onSnapshot Listener in ProfilePodcasts: ",error);
          })      
    }
    catch (error) {
      console.log("Error in ProfilePodcasts in retrieveData: ",error);
    }
    finally {
      this.setState({
        loading: false
      });
    }
  };

  retrieveMoreBookPodcasts = async () => {
    
    this.setState({
      refreshing: true
    });

    try{
      console.log("retrieveMoreBookPodcasts starts()")
      const  userid = this.props.firebase._getUid();
      let bookPodcasts = await firestore().collectionGroup('podcasts').where('podcasterID','==',userid)//.where('isChapterPodcast','==',false)
                        .orderBy('createdOn','desc').startAfter(this.state.lastVisibleBookPodcast).limit(this.state.limit).get();
    
      console.log("retrieveMoreBookPodcasts afterQuery()") 
      let documentData = bookPodcasts.docs.map(document => document.data());
      if(documentData.length != 0)   
      {
        let lastVisibleBook = documentData[documentData.length - 1].createdOn;
        if(this.state.lastVisibleBookPodcast !== lastVisibleBook)
        {
          this.setState({
            bookPodcasts: [...this.state.bookPodcasts, ...documentData],
            lastVisibleBookPodcast : lastVisibleBook,
          });
        }
      }
    }
    catch(error){
    console.log("Error in retrieveMoreBookPodcasts: ",error);
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
      if(!this.onEndReachedCalledDuringMomentum){
        this.retrieveMoreBookPodcasts()
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
  

export default withFirebaseHOC(ProfilePodcasts);


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
