import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,RefreshControl, 
  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import ProfileFlipItem from './ProfileFlipItem';
import {withFirebaseHOC} from '../../config/Firebase'
import {useSelector, useDispatch,connect} from "react-redux"
import IconAntDesign from 'react-native-vector-icons/AntDesign'


var {width, height}=Dimensions.get('window')

class ProfileFlipScreen extends React.Component {
  static navigationOptions={
      header:null
  }
  constructor(props)
  {
    super(props)
    {
    this.state={
        flips:[], 
        limit:8,
        lastVisibleFlip:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true,
        scrollPosition: 0
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
        
      const profileFlipDocs = await firestore().collection('flips').where('creatorID','==',userid)
                                .orderBy('createdOn','desc').limit(this.state.limit).get();
      const profileFlipData = profileFlipDocs.docs.map(document => document.data());
      var lastVisible = this.state.lastVisibleFlip;
      if(profileFlipData.length != 0)
        lastVisible = profileFlipData[profileFlipData.length - 1].createdOn;

    
      this.setState({
          flips : profileFlipData,
          lastVisibleFlip : lastVisible
      })
    }
    catch (error) {
      console.log("Error in ProfileFlipScreen in retrieveData: ",error);
    }
    finally {
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
        let flips = await firestore().collection('flips').where('creatorID','==',userid)
                    .orderBy('createdOn','desc').startAfter(this.state.lastVisibleFlip)
                    .limit(this.state.limit).get();
    
      console.log("retrieveMoreFlips afterQuery()") 
      let documentData = flips.docs.map(document => document.data());
      if(documentData.length != 0)   
      {
        let lastVisible = documentData[documentData.length - 1].createdOn;
        if(this.state.lastVisibleFlip !== lastVisible)
        {
          this.setState({
            flips: [...this.state.flips, ...documentData],
            lastVisibleFlip : lastVisible,
          });
        }
      }
    }
    catch(error){
    console.log("Error in retrieveMoreFlips: ",error);
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
        <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('ProfileFlipScreenVertical',{flips : this.state.flips,scrollIndex:index,lastVisibleFlip:this.state.lastVisibleFlip})
        }} style={{padding:5}}>
        <Image source={{uri: item.flipPictures[0]}} style={{width:width/2 - 10, height:width*0.75,borderRadius:5 }}/>
              {
                item.isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/4 - 5 - height/48,top:width*0.75/2 - height/48}}/>

              }
      {/* <ProfileFlipItem item={item} index={index} navigation={this.props.navigation}/> */}
      </TouchableOpacity>
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
    if(this.state.flips.length > (this.state.limit - 1))
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
    if(this.state.loading)
    {
      return (
        <View style={{paddingTop: height/3}}>
        <ActivityIndicator/>
        </View>
      )       
    }
    else if(this.state.flips.length != 0)
    {
      return (
      
        <View>
        <FlatList   
          data={this.state.flips}
          numColumns={2}
          renderItem={this.renderData}
          //onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.flipID}
          ListFooterComponent={this.renderFooter}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.01}
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
    else
    {
      return(
        <ScrollView contentContainerStyle={{alignItems:'center',paddingTop:height/15}}>
            
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('AddFlipScreen');
            }} style={{justifyContent:'center',alignItems:'center',
            borderRadius:10,width:width/3.2,height:50,borderWidth:0.5,backgroundColor:'black',marginBottom:30}}>
              <Text style={{fontSize:23, fontFamily:'Montserrat-SemiBold',color:'white'}}>Add Flip</Text>
              </TouchableOpacity>
              <View style={{alignItems:'center',justifyContent:'center',paddingHorizontal:20}}>
          <Text style={{fontFamily:'Montserrat-Bold',fontSize:30}}>What are Flips?{"\n"}</Text>
          <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:15}}>Flips are book notes and highlights which you can share on the go.{"\n"}</Text>
                </View>
              <Image source={{uri:'https://storage.googleapis.com/papyrus-274618.appspot.com/illustrations/Flip-I.jpg'}} style={{height:width/2,width:width/1.8,borderWidth:0,borderColor:'black'}}/>

              <Image source={{uri:'https://storage.googleapis.com/papyrus-274618.appspot.com/illustrations/FLIP-II.jpg'}} style={{height:width/2,width:width/1.8,borderWidth:0,borderColor:'black'}}/>
        {/* <Image 
        source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/HomeScreen/WhatsApp%20Image%202020-03-29%20at%206.17.51%20PM.jpeg"}}
        style={{height: height/4,width: width/4}}/> */}
        </ScrollView>
      );
      
    }
  }
  }
  

  const mapDispatchToProps = (dispatch) =>{
    return{
        dispatch,
    }}
  
  export default connect(null,mapDispatchToProps)(withFirebaseHOC(ProfileFlipScreen))
  


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
