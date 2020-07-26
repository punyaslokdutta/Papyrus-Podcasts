import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import RepostItem from '../Profile/RepostItem'
import {withFirebaseHOC} from '../../config/Firebase'
import {useSelector, useDispatch,connect} from "react-redux"

var {width, height}=Dimensions.get('window')

class UserReposts extends React.Component {
    
    static navigationOptions={
       // header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        reposts:[],
        limit:6,
        lastVisibleRepost:null,
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
          console.log("USER_REPOSTS TAB PRESSED");
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
      
      console.log("[UserPodcasts] Inside retrieveData function");
      this.setState({
        loading: true,
      });
      try {
        const  userID = this.props.navigation.state.params.userData.id;
        const privateUserID = "private" + userID;       
        let documentReposts = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarks')
                             .orderBy('bookmarkedOn','desc').limit(this.state.limit).get();
        let documentData_reposts = documentReposts.docs.map(document => document.data());
        var lastVisibleRepost = this.state.lastVisibleRepost;

        if(documentData_reposts.length != 0)
          lastVisibleRepost = documentData_reposts[documentData_reposts.length - 1].createdOn;        
         
        this.setState({
        reposts: documentData_reposts,
        lastVisibleRepost:lastVisibleRepost
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
     
      console.log("[UserPodcasts] retrieveMoreBookPodcasts starts()")
      this.setState({
        refreshing: true
         }); 

      try{
        const  userID = this.props.navigation.state.params.userData.id;
        const privateUserID = "private" + userID;       
         
        let additionalBookPodcasts = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarks')
        .orderBy('bookmarkedOn','desc').startAfter(this.state.lastVisibleRepost)
        .limit(this.state.limit).get();
        let documentData = additionalBookPodcasts.docs.map(document => document.data());
        if(documentData.length != 0)
        {
          let lastVisibleRepost = documentData[documentData.length - 1].createdOn;
          if(this.state.lastVisibleRepost != lastVisibleRepost)
          {
            this.setState({
                reposts: [...this.state.reposts, ...documentData],
                lastVisibleRepost : lastVisibleRepost
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
      const  userID = this.props.navigation.state.params.userData.id;

       return(
         <View>
        <RepostItem podcast={item} userID={userID} scrollPosition={this.state.scrollPosition} isBookmark={true} index={index} navigation={this.props.navigation}/>
        </View>
       )
    }

    separator = () => {
      return(
        <View style={[styles.separator]} />
      )
    }

    renderFooter = () => {
      
      if (this.state.refreshing == true) {
        return (
          <ActivityIndicator />
        )
      }
      else {
        return <View style={[styles.separator]} />;
      }
    }

    onEndReached = ({ distanceFromEnd }) => {
      if(this.state.reposts.length > (this.state.limit - 1))
      {
        if(!this.onEndReachedCalledDuringMomentum)
        {
            this.retrieveMoreBookPodcasts()
            this.onEndReachedCalledDuringMomentum = true;
        }
      }
  }

   handleScroll = (event) => {
    console.log("In handleScroll : ",event.nativeEvent.contentOffset.y);
    if(Math.abs(this.state.scrollPosition - event.nativeEvent.contentOffset.y) >= height/6)
      this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
    //setScrollPosition(event.nativeEvent.contentOffset.y);
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
      else if(this.state.reposts.length != 0)
      {
        return (
        
          <View style = {{paddingBottom:20}}>
          <View>
          <FlatList   
          nestedScrollEnabled={true}
          data={this.state.reposts}
          renderItem={this.renderData}
          onScroll={this.handleScroll}
          //numColumns={2}
          ItemSeparatorComponent={this.separator}
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

  const mapDispatchToProps = (dispatch) =>{
    return{
       dispatch,
    }}
export default connect(null,mapDispatchToProps)(withFirebaseHOC(UserReposts))

//export default withFirebaseHOC(UserReposts);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  separator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1,
    paddingTop:10
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
