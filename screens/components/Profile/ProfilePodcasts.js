import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,RefreshControl, 
  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'
import {useSelector, useDispatch,connect} from "react-redux"

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
        onEndReachedCalledDuringMomentum : true,
        scrollPosition: 0
      }
    }
  }
   
  componentDidMount = () => {
    try {
      this.didFocusEventListener = this.props.navigation.addListener('didFocus', (route) => {
        console.log("PROFILE_PODCASTS TAB PRESSED");
        this.props.dispatch({type:"CHANGE_SCREEN"});
        });
      this.retrieveData();
    }
    catch (error) {
      console.log(error);
    }
  };

  componentWillUnmount = () => {
    this.didFocusEventListener.remove();
  }
  

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
      if(!this.onEndReachedCalledDuringMomentum){
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
      
        <View style = {{marginBottom:0,marginTop:20}}>
        <View>
        <FlatList   nestedScrollEnabled={true}
          data={this.state.bookPodcasts}
          renderItem={this.renderData}
          onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.podcastID}
            ListFooterComponent={this.renderFooter}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={1}
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
        <View style={{alignItems:'center',justifyContent:'center',paddingTop:height/6}}>
            
            <Image source={{uri:'https://storage.googleapis.com/papyrus-274618.appspot.com/illustrations/undraw_speech_to_text_9uir.png'}} style={{height:height/3,width:width/2}}/>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('AddBookReviewScreen');
            }} style={{justifyContent:'center',alignItems:'center',
            borderRadius:10,width:width/3.5,height:40,borderWidth:0.5,backgroundColor:'black'}}>
              <Text style={{fontSize:15, fontFamily:'Montserrat-Regular',color:'white'}}>Add Podcast</Text>
              </TouchableOpacity>
              {/* <Image style={{height:50,width:50,}} source={{uri:require('../../../assets/illustrations/undraw_recording_lywr.png')}}/> */}
        {/* <Image 
        source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/HomeScreen/WhatsApp%20Image%202020-03-29%20at%206.17.51%20PM.jpeg"}}
        style={{height: height/4,width: width/4}}/> */}
        </View>
      );
      
    }
  }
  }
  

  const mapDispatchToProps = (dispatch) =>{
    return{
        dispatch,
    }}
  
  export default connect(null,mapDispatchToProps)(withFirebaseHOC(ProfilePodcasts))
  


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
