

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {Button} from 'native-base';
import editProfile from './components/Profile/editProfile'
import ProfileBookPodcast from './components/Profile/ProfileBookPodcast'
import ProfileChapterPodcast from './components/Profile/ProfileChapterPodcast'

var {width, height}=Dimensions.get('window')
class Profile extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        activeIndex:0,
        loading:false
        // navigation: this.props.navigation,
      }
      }
    
     }
   
     
    segmentClicked=(index)=>{
      this.setState({
      activeIndex : index
      })
      
    }

    // renderSectionOne=()=>
    // {
    //     return (
          
    //       <FlatList
    //       data={this.state.bookPodcasts}
    //       renderItem={this.renderData}
    //       numColumns={2}
    //       showsVerticalScrollIndicator={false}
    //       keyExtractor={item => item.PodcastID}
    //        ListHeaderComponent={this.renderHeader}
    //        ListFooterComponent={this.renderFooter}
    //       onEndReached={this.retrieveMoreBookPodcasts}
    //       onEndReachedThreshold={0.5}
    //       refreshing={this.state.refreshing}
    //     />
        
    //     )
    // }
    // renderSectionTwo=()=>
    // {
    //   return (
          
    //     <FlatList
    //     data={this.state.chapterPodcasts}
    //     renderItem={this.renderData}
    //     numColumns={2}
    //     showsVerticalScrollIndicator={false}
    //     keyExtractor={item => item.PodcastID}
    //     ListHeaderComponent={this.renderHeader}
    //      ListFooterComponent={this.renderFooter}
    //     onEndReached={this.retrieveMoreChapterPodcasts}
    //     onEndReachedThreshold={0.5}
    //     refreshing={this.state.refreshing}
    //   />
    //   )
    // }
 
    render() {
      const { navigation } = this.props;
      return (
         
         <View style = {{paddingBottom:10}}>
           {/* <View>
        <View style={{flexDirection:'row' ,justifyContent:'flex-end'}}>
        <Icon name="user-plus"  size={24} style={{ paddingTop:10, paddingRight: 10}}/>
        </View>
        <View>
        <View style={{flexDirection:'row'}}>
        <View>
          <Text style={{paddingTop:90, paddingLeft:60, fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
            220
          </Text>
         <Text style={{fontFamily:'sans-serif-light', paddingLeft:50}}>Following</Text>
          </View>
         
            <View style={{alignItems:'center', justifyContent:'center', flex:3, paddingTop:60}}>
              <Image source={{ uri: "https://scontent.fdel12-1.fna.fbcdn.net/v/t31.0-8/p960x960/14054441_518163365046457_6005096195143854779_o.jpg?_nc_cat=101&_nc_oc=AQmBj8SY60BCKzMFfvCPGLc1J44zxgFhJqefzYEifezUhkr7pFo29592HYyw6grMQF8&_nc_ht=scontent.fdel12-1.fna&oh=8ff3d0097e442acc84a804041fd0e7ee&oe=5E45429C"}} style={{width:100, height:100, borderRadius:50 }}/>
            </View>
            <View>
            <Text style={{paddingTop:90 , paddingRight:60,  fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
            100
          </Text>
          <Text style={{fontFamily:'sans-serif-light', paddingRight:70}}>Followers</Text>
          </View>

        </View>
        </View>
        <View style={{ paddingHorizontal:105,flex:1,marginTop:20}}>
       
       <Text style={{ fontSize:24, fontWeight:"200",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center', justifyContent:'center'}}>Khaled Housseini</Text>
       

        </View>
       
        <View>
        <Text style={{ fontSize:14, fontWeight:"100",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center', justifyContent:'center', padding:20}}>I read books on philosophy, economics, computer science, social sciences, geopolitics.</Text>
        </View>

        <View style={{ paddingLeft:145,flex:1}}>
        <Button  style={{flex:1, marginTop:10, justifyContent:'center', height:30, width:100, borderRadius:5, backgroundColor:'white'}} onPress={()=>this.props.navigation.navigate('editProfile')}>
        <Text>Edit Profile</Text>
        </Button>

        </View>
        <View style={{paddingTop:30}}>
          <View style={{flexDirection :'row', justifyContent:'space-around', borderTopWidth:1, borderTopColor:'#eae5e5'}}>
          <Button  transparent onPress={()=>this.segmentClicked(0)} active={this.state.activeIndex==0}>
          <Icon name='book' size={20} style={[this.state.activeIndex == 0 ? {color:'black'} : {color:'grey'}]}/>

          </Button>
          <Button transparent onPress={()=>this.segmentClicked(1)} active={this.state.activeIndex==1}>
          <Icon name='newspaper-o' size={20} style={[this.state.activeIndex == 1 ? {color:'black'} : {color:'grey'}]} />
          </Button>

          </View>
      </View>
      </View> */}
         {/* {this.state.activeIndex ? this.renderSectionTwo() : this.renderSectionOne()} */}
         {this.state.activeIndex ? <ProfileChapterPodcast/> : <ProfileBookPodcast/>}
         </View>
      
      );
    }
  }
  

export default Profile;


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
