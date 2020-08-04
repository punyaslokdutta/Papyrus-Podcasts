import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,RefreshControl, 
  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'
import {useSelector, useDispatch,connect} from "react-redux"

var {width, height}=Dimensions.get('window')

class RepostPodcastsScreen extends React.Component {
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
      const userPreferredPodcasts = await firestore().collectionGroup('podcasts').where('genres','array-contains-any',this.props.userPreferences)//.where('isChapterPodcast','==',false)
      .orderBy('createdOn','desc').limit(this.state.limit).get();

      const userPreferredPodcastsData = userPreferredPodcasts.docs.map(document=>document.data());
      var lastVisibleBook = this.state.lastVisibleBookPodcast;
      if(userPreferredPodcastsData.length != 0)
        lastVisibleBook = userPreferredPodcastsData[userPreferredPodcastsData.length - 1].createdOn;
      this.setState({
          bookPodcasts : userPreferredPodcastsData,
          lastVisibleBookPodcast : lastVisibleBook
      })            
    }
    catch (error) {
      console.log("Error in RepostPodcastsScreen in retrieveData: ",error);
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
      let bookPodcasts = await firestore().collectionGroup('podcasts').where('genres','array-contains-any',this.props.userPreferences)//.where('isChapterPodcast','==',false)
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
        <ActivityIndicator size='large' color='black'/>
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
        <View style={{paddingTop: height/2.5}}>
        <ActivityIndicator size='large' color='black'/>
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
    
  }
  }
  

  const mapDispatchToProps = (dispatch) =>{
    return{
        dispatch,
    }}

    const mapStateToProps = (state) => {
        return{
          podcastRedux: state.rootReducer.podcast,
          userPreferences: state.userReducer.userPreferences
        }}
  
  export default connect(mapStateToProps,mapDispatchToProps)(withFirebaseHOC(RepostPodcastsScreen))
  


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
