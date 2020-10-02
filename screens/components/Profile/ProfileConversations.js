import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,RefreshControl, 
  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'
import {useSelector, useDispatch,connect} from "react-redux"

var {width, height}=Dimensions.get('window')

class ProfileConversations extends React.Component {
  static navigationOptions={
      header:null
  }
  constructor(props)
  {
    super(props)
    {
    this.state={
        conversations:[], 
        limit:6,
        lastVisibleConversation:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true,
        scrollPosition: 0
      }
    }
  }
   
  componentDidMount = () => {
    try {
    //   this.didFocusEventListener = this.props.navigation.addListener('didFocus', (route) => {
    //     console.log("PROFILE TAB PRESSED");
    //     this.props.dispatch({type:"CHANGE_SCREEN"});
    //     });
      this.retrieveData();
    }
    catch (error) {
      console.log(error);
    }
  };

  componentWillUnmount = () => {
    // this.didFocusEventListener.remove();
  }
  

  retrieveData = async () => {
    
    this.setState({
      loading: true,
    });

    try {
      console.log('Retrieving Data');
      const  userid = this.props.firebase._getUid();
      await firestore().collection('conversations').where('participants','array-contains',userid)//.where('isChapterPodcast','==',false)
      .orderBy('createdOn','desc').limit(this.state.limit)
          .onSnapshot((querySnapshot) =>
          {
            var documentData_podcasts = [];

            querySnapshot.forEach(function(doc) {
              documentData_podcasts.push(doc.data());
            });
            var lastVisibleConversation = this.state.lastVisibleConversation;
            if(documentData_podcasts.length != 0)
              lastVisibleConversation = documentData_podcasts[documentData_podcasts.length - 1].createdOn;        
            
              console.log("[ProfileConversations] lastVisibleConversation = ",lastVisibleConversation)
              console.log("[ProfileConversations] conversations = ",documentData_podcasts.length)

              this.setState({
                conversations: documentData_podcasts,
              lastVisibleConversation:lastVisibleConversation
            });
          },function(error) {
            console.log("Error in onSnapshot Listener in ProfileConversations: ",error);
          })      
    }
    catch (error) {
      console.log("Error in ProfileConversations in retrieveData: ",error);
    }
    finally {
      this.setState({
        loading: false
      });
    }
  };

  retrieveMoreConversations = async () => {
    
    this.setState({
      refreshing: true
    });

    try{
      console.log("retrieveMoreConversations starts()")
      const  userid = this.props.firebase._getUid();
      let conversations = await firestore().collection('conversations').where('participants','array-contains',userid)//.where('isChapterPodcast','==',false)
                        .orderBy('createdOn','desc').startAfter(this.state.lastVisibleConversation).limit(this.state.limit).get();
                        
      console.log("retrieveMoreConversations afterQuery() this.state.lastVisibleConversation = ",this.state.lastVisibleConversation) 

      console.log("retrieveMoreConversations afterQuery() conversations = ",conversations) 
      let documentData = conversations.docs.map(document => document.data());
      if(documentData.length != 0)   
      {
        let lastVisibleConversation = documentData[documentData.length - 1].createdOn;
        if(this.state.lastVisibleConversation !== lastVisibleConversation)
        {
          this.setState({
            conversations: [...this.state.conversations, ...documentData],
            lastVisibleConversation : lastVisibleConversation,
          });
        }
      }
    }
    catch(error){
    console.log("Error in retrieveMoreConversations: ",error);
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
    //     <View>
    //   <Podcast podcast={item} scrollPosition={this.state.scrollPosition} index={index} navigation={this.props.navigation}/>
    //   </View>
    <View style={{alignItems:'center',justifyContent:'center',width:width - 10,height:height/3,borderColor:'black',borderWidth:0.5,marginLeft:5,marginBottom:10}}>
        <TouchableOpacity onPress={() => {
          console.log("[ProfileCOnversations] [TouchableOpacity] Video pressed");
            this.props.navigation.navigate('VideoScreen',{
                item : item,
                conversations : this.state.conversations,
                scrollIndex : index,
                lastVisibleConversation : this.state.lastVisibleConversation
            });
        }}>
                <Image source={{uri:item.discussionImage}} style={{width:width - 10,height:height/3}}/>
                <View style={{position:'absolute',bottom:5,left:5}}>
                    <Text style={{fontFamily:'Montserrat-Bold',color:'white',fontSize:20}}>{item.discussionTopic}</Text>
                </View>
        </TouchableOpacity>
        </View>
      )
  }

  renderFooter = () => {
    
    if (this.state.refreshing == true) {
      return (
        <ActivityIndicator color='black'/>
      )
    }
    else {
      return null;
    }
  }

  onEndReached = ({ distanceFromEnd }) => {
    if(this.state.conversations.length > (this.state.limit - 1))
    {
      if(!this.onEndReachedCalledDuringMomentum){
        this.retrieveMoreConversations()
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
        <ActivityIndicator color='black'/>
        </View>
      )       
    }
    else if(this.state.conversations.length != 0)
    {
      return (
      
        <View style = {{paddingBottom:height/15,marginTop:20}}>
        <View>
        <FlatList   nestedScrollEnabled={true}
          data={this.state.conversations}
          renderItem={this.renderData}
          //onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.conversationID}
            ListFooterComponent={this.renderFooter}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={this.state.refreshing}
          //onRefresh={() => this.handleRefresh()}
          // refreshControl={
          //   <RefreshControl
          //   refreshing={this.state.loading}
          //   onRefresh={this.handleRefresh}
          //   />
          //  }
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
              this.props.navigation.navigate('VideoChatScreen');
            }} style={{justifyContent:'center',alignItems:'center',
            borderRadius:10,width:width/3.5,height:40,borderWidth:0.5,backgroundColor:'black'}}>
              <Text style={{fontSize:15, fontFamily:'Montserrat-Regular',color:'white'}}>Add Convo</Text>
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
  
  export default connect(null,mapDispatchToProps)(withFirebaseHOC(ProfileConversations))
  


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
