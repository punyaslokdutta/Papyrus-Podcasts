import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,RefreshControl, 
  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import FlipItem from '../Home/FlipItem';
import {withFirebaseHOC} from '../../config/Firebase'
import {useSelector, useDispatch,connect} from "react-redux"
import { Button } from '../categories/components';

var {width, height}=Dimensions.get('window')

class ProfileFlipScreenVertical extends React.Component {
  static navigationOptions={
      header:null
  }
  constructor(props)
  {
    super(props)
    {
    this.state={
        flipVerticals:[], 
        limit:6,
        lastVisibleFlip:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true,
        scrollPosition: 0,
        scrollToPosition : 0
      }
    }
  }
   
  componentDidMount = () => {
    try{
        this.retrieveData();
    }
    catch(error){
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
        

        this.setState({
            flipVerticals : this.props.navigation.state.params.flips,
            scrollToPosition : this.props.navigation.state.params.scrollIndex,
            lastVisibleFlip : this.props.navigation.state.params.lastVisibleFlip
        })
        let wait = new Promise((resolve) => setTimeout(resolve, 100)); // Smaller number should work
        wait.then( () => {
        this.flatListRef.scrollToIndex({index:this.props.navigation.state.params.scrollIndex  , animated: false,viewPosition:0});
        });
        //this.goIndex();
    }
    catch (error) {
      console.log("Error in ProfileFlipScreenVertical in retrieveData: ",error);
    }
    finally {
        console.log("this.state.flipVerticals.length : ",this.state.flipVerticals.length);
      this.setState({
        loading: false
      });

    }
  };

  retrieveMoreFlips = async () => {
    
    this.setState({
      refreshing: true
    });

    try{
        console.log('Retrieving More Flips');
        const  userid = this.props.firebase._getUid();
        let flipVerticals = await firestore().collection('flips').where('creatorID','==',userid)
                    .orderBy('createdOn','desc').startAfter(this.state.lastVisibleFlip)
                    .limit(this.state.limit).get();
    
      console.log("retrieveMoreFlips afterQuery()") 
      let documentData = flipVerticals.docs.map(document => document.data());
      if(documentData.length != 0)   
      {
        let lastVisible = documentData[documentData.length - 1].createdOn;
        if(this.state.lastVisibleFlip !== lastVisible)
        {
          this.setState({
            flipVerticals: [...this.state.flipVerticals, ...documentData],
            lastVisibleFlip : lastVisible,
          });
        }
      }
    }
    catch(error){
    console.log("Error in retrieveMoreFlips11: ",error);
    }
    finally {
      this.setState({
        refreshing: false
      });
    }
  }

  renderData = ({item,index}) =>
  {
      return(
        <View style={{padding:2}}>
      <FlipItem item={item} index={index} navigation={this.props.navigation}/>
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
    if(this.state.flipVerticals.length > (this.state.limit - 1))
    {
      if(!this.onEndReachedCalledDuringMomentum){
        this.retrieveMoreFlips()
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
    // if(this.state.loading)
    // {
    //   return (
    //     <View style={{paddingTop: height/3}}>
    //     <ActivityIndicator/>
    //     </View>
    //   )       
    // }
    // else if(this.state.flipVerticals.length != 0)
    {
      return (
      
        <View style={{alignItems:'center'}}>
        <FlatList   
          data={this.state.flipVerticals}
          ref={(ref) => { this.flatListRef = ref; }}
          getItemLayout={(data, index) => (
            {length: width*17/12 + 12 - width/2, index, offset: (width*17/12 + 12 -width/2) * index} 
          )}
          //numColumns={2}
          renderItem={this.renderData}
          //onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.flipID}
          ListFooterComponent={this.renderFooter}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
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
      
      );
    }
    // else
    // {
    //   return(
    //     <View style={{alignItems:'center',paddingTop:height/5}}>
            
    //     <Image 
    //     source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/HomeScreen/WhatsApp%20Image%202020-03-29%20at%206.17.51%20PM.jpeg"}}
    //     style={{height: height/4,width: width/4}}/>
    //     </View>
    //   );
      
    // }
  }
  }
  
  const mapStateToProps = (state) => {
    return{
        renderedREDUX : state.userReducer.renderedREDUX
    }}

  const mapDispatchToProps = (dispatch) =>{
    return{
        dispatch,
    }}
  
  export default connect(mapStateToProps,mapDispatchToProps)(withFirebaseHOC(ProfileFlipScreenVertical))
  


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
