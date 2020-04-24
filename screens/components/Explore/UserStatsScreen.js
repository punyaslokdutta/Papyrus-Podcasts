import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View,Dimensions } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import rgba from 'hex-to-rgba';
import {Button} from 'native-base';
//import Icon from 'react-native-vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// check this lib for more options
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import UserFollowingScreen from './UserFollowingScreen'
import { Block, Badge, Card, Text } from '../categories/components';
import { theme, mocks } from '../categories/constants';
import Icon from 'react-native-vector-icons/FontAwesome'

var {width, height}=Dimensions.get('window')

 class UserStatsScreen extends React.Component {

    constructor(props)
    {
        super(props);
        this.state={
            totalListenCount: this.props.navigation.state.params.item.listened_book_podcasts_count + this.props.navigation.state.params.item.listened_chapter_podcasts_count, 
            numCreatedBookPodcasts: this.props.navigation.state.params.item.numCreatedBookPodcasts, 
            numCreatedChapterPodcasts: this.props.navigation.state.params.item.numCreatedChapterPodcasts, 
            totalListeningTime: this.props.navigation.state.params.item.timespentByUserListening, 
            imageURL: this.props.navigation.state.params.item.displayPicture,
            name: this.props.navigation.state.params.item.name,
            introduction: this.props.navigation.state.params.item.introduction, 
            followersCount: 0,
            followingCount: this.props.navigation.state.params.item.followingCount,
            loading:false
        }
        console.log("In USER STATS SCREEN")
    }
  
    componentDidMount = async () => {
      try {
        this.retrieveData();
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveData = async () => {
      
      this.setState({
        loading: true
      });
      
      try {
        console.log("[UserStatsScreen] Retrieving Data");
        const id_user = this.props.navigation.state.params.item.id;
        const userPublicDoc = await firestore().collection('users').doc(id_user).get();
        
        this.setState({
            followersCount : userPublicDoc._data.followerCount
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

  renderMonthly() {
    return (
      <Card shadow style={{ paddingVertical: theme.sizes.padding * 0.25 }}>
        <Block>
          <Block center>
    <Text h1 primary spacing={1.7}>{this.state.totalListeningTime}</Text>
            <Text spacing={0.7}>Minutes Recorded</Text>
          </Block>

          {/* <Block color="gray3" style={styles.hLine} /> */}
          <Text>{"\n"}</Text>
          <Block row>
            <Block center>
    <Text size={20} spacing={0.6} primary style={{ marginBottom: 3 }}>{this.state.numCreatedBookPodcasts}</Text>
              <Text body spacing={0.7}>Book Podcasts</Text>
            </Block>

            <Block flex={false} color="gray3" style={styles.vLine} />

            <Block center>
              <Text size={20} spacing={0.6} primary style={{ marginBottom: 3 }}>{this.state.numCreatedChapterPodcasts}</Text>
              <Text body spacing={0.7}>Chapter Podcasts</Text>
            </Block>
          </Block>
        </Block>
      </Card>
    )
  }

  
  render() {

    return (
      <ScrollView style={styles.rewards} showsVerticalScrollIndicator={false}>
        <View>
  
        <View style={{paddingTop:50}}>
        <View style={{alignItems:'center', justifyContent:'center', flex:3, paddingTop:height/50}}>
              <Image source={{uri:this.state.imageURL}}  style={{width:200, height:200, borderRadius:10 }}/>
            </View>
        
        </View>
       
        <View style={{ alignItems:'center',flex:1,paddingTop:50}}>
       <Text  style={{ fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center', justifyContent:'center'}}>{this.state.name}</Text>
        </View>

        <View style={{justifyContent:'center',alignItems:'center'}}>
    <Text style={{ fontSize:14, fontWeight:"100",  textShadowColor:'black', fontFamily:'American Typewriter', alignItems:'center', justifyContent:'center', padding:20}}>{this.state.introduction}</Text>
        </View>

        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('UserFollowingScreen', { id : this.props.navigation.state.params.item.id })}>
        <View style={{alignItems:'center'}}>
          <Text style={{paddingTop:height/20, paddingHorizontal:width/10, fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
          {this.state.followingCount}
          </Text>
          <Text style={{fontFamily:'sans-serif-light', paddingHorizontal:width/13}}>Following</Text>
          </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('UserFollowerScreen', { id : this.props.navigation.state.params.item.id })}>
            <View style={{alignItems:'center'}}>
            <Text style={{paddingTop:height/20 , paddingHorizontal:width/10,  fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
            {this.state.followersCount}
          </Text>                                             
          <Text style={{fontFamily:'sans-serif-light', paddingHorizontal:width/13}}>Followers</Text>
          </View>
          </TouchableOpacity>

        </View>

        </View>
       <Block flex={false} row center style={styles.header}>
       
          <Text h3 bold>Podcast Statistics</Text>
        </Block>
        {this.renderMonthly()}
        <Text>{"\n\n"}</Text>
      </ScrollView>
    )
  }
}


export default UserStatsScreen;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.sizes.base * 2,
        paddingTop: theme.sizes.base * 2.0,
        paddingBottom :theme.sizes.base * 1,
        alignItems : 'center',
        justifyContent : 'center'
      },
  rewards: {
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 1,
    height: 1,
  },
  // vertical line
  vLine: {
    marginVertical: theme.sizes.base / 2,
    width: 1,
  },
})
