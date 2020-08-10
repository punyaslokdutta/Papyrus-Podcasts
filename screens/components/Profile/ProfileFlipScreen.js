import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,RefreshControl, 
  Dimensions,SafeAreaView, ScrollView,ActivityIndicator, ImageBackground} from 'react-native';
import ProfileFlipItem from './ProfileFlipItem';
import {withFirebaseHOC} from '../../config/Firebase'
import {useSelector, useDispatch,connect} from "react-redux"
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import LinearGradient from 'react-native-linear-gradient';


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
                                .orderBy('createdOn','desc').limit(this.state.limit).onSnapshot((querySnapshot) => {
                                  var documentData_flips = [];
                      
                                  querySnapshot.forEach(function(doc) {
                                    documentData_flips.push(doc.data());
                                  });
                                  var lastVisible = this.state.lastVisibleFlip;
                                  if(documentData_flips.length != 0)      
                                    lastVisible = documentData_flips[documentData_flips.length - 1].createdOn; 
                              
                                  this.setState({
                                    flips : documentData_flips,
                                    lastVisibleFlip : lastVisible
                                  })
                                  
                              },function(error) {
                                  console.log("Error in onSnapshot Listener in ProfileFlipScreen: ",error);
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
        }} style={{marginHorizontal:5,marginVertical:5,width:width/2 - 10, height:width*0.75,borderRadius:10}}>
        <ImageBackground source={{uri: item.flipPictures[0]}} 
          style={{width:width/2 - 10, height:width*0.75 }}
          imageStyle={{ borderRadius: 10}}
          >
        <LinearGradient style={{borderRadius:10}} colors={['transparent', 'transparent', 'transparent','transparent','transparent','transparent',  'transparent','transparent','black']} >
              <View style={{width:width/2 - 10, height:width*0.75,borderRadius:20}}>
               
              {
                item.isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/4 - 5 - height/48,top:width*0.75/2 - height/48}}/>

              }
              {
                item.bookName !== undefined && item.bookName !== null &&
<Text style={{color:'white',position:'absolute',fontFamily:'Montserrat-Bold',bottom:2,left:10,fontSize:15}}>
        {item.bookName.slice(0,35)}
        {
          (item.bookName.length > 35)  &&  ".."
        }

      </Text>
              }
               
              </View>
            </LinearGradient>

            </ImageBackground>
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
      return <View style={{marginTop:height/15,marginBottom:height/10,alignItems:'center',justifyContent:"center"}}>
      <Image source={require('../../../assets/images/savedBooks.png')}
             style={{height:width/1.8,width:width/2}}/>
      <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('AddFlipScreen');
          }} style={{justifyContent:'center',alignItems:'center',
          borderRadius:10,width:width/3,height:40,borderWidth:0.5,backgroundColor:'black'}}>
            <Text style={{fontSize:15, fontFamily:'Montserrat-Regular',color:'white'}}>Add Flip</Text>
            </TouchableOpacity>
      {/* {renderHomeBooks()} */}
      </View>
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
          onEndReachedThreshold={0.5}
          refreshing={this.state.refreshing}
          onRefresh={() => this.handleRefresh()}
          refreshControl={
            <RefreshControl
            refreshing={this.state.loading}
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
            
            <View style={{height:height*3/4, alignItems:'center',justifyContent:"center"}}>
        <Image source={require('../../../assets/images/savedBooks.png')}
               style={{height:width/1.8,width:width/2}}/>
        <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('AddFlipScreen');
            }} style={{justifyContent:'center',alignItems:'center',
            borderRadius:10,width:width/3,height:40,borderWidth:0.5,backgroundColor:'black'}}>
              <Text style={{fontSize:15, fontFamily:'Montserrat-Regular',color:'white'}}>Add Flip</Text>
              </TouchableOpacity>
        {/* {renderHomeBooks()} */}
        </View>
           
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
