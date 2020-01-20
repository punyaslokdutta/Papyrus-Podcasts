import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View,Dimensions } from 'react-native'
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

 class UserStatsScreen  extends React.Component {

    constructor(props)
    {
        super(props);
        this.state={
            totalListenCount: this.props.navigation.state.params.item.listened_book_podcasts_count + this.props.navigation.state.params.item.listened_chapter_podcasts_count, 
            bookPodcastListenCount: this.props.navigation.state.params.item.listened_book_podcasts_count, 
            chapterPodcastListenCount: this.props.navigation.state.params.item.listened_chapter_podcasts_count, 
            totalListeningTime: this.props.navigation.state.params.item.timespent_by_user_listening, 
            imageURL: this.props.navigation.state.params.item.displayPicture,
            name: this.props.navigation.state.params.item.name,
            introduction: this.props.navigation.state.params.item.introduction, 
            followersCount: this.props.navigation.state.params.item.follower_count,
            followingCount: this.props.navigation.state.params.item.following_count
        }
        console.log("In USER STATS SCREENNNNNNNNNNNNNN")
    }
  

  renderMonthly() {
    return (
      <Card shadow style={{ paddingVertical: theme.sizes.padding * 0.25 }}>
        <Block>
          <Block center>
    <Text h1 primary spacing={1.7}>{this.state.totalListeningTime}</Text>
            <Text spacing={0.7}>Total Listening Time (mins)</Text>
          </Block>

          {/* <Block color="gray3" style={styles.hLine} /> */}
          <Text>{"\n"}</Text>
          <Block row>
            <Block center>
    <Text size={20} spacing={0.6} primary style={{ marginBottom: 3 }}>{this.state.bookPodcastListenCount}</Text>
              <Text body spacing={0.7}>Number of </Text>
              <Text body spacing={0.7}>Book Podcasts</Text>
            </Block>

            <Block flex={false} color="gray3" style={styles.vLine} />

            <Block center>
              <Text size={20} spacing={0.6} primary style={{ marginBottom: 3 }}>{this.state.chapterPodcastListenCount}</Text>
              <Text body spacing={0.7}>Number of </Text>
              <Text body spacing={0.7}>Chapter Podcasts</Text>
            </Block>
          </Block>
        </Block>
      </Card>
    )
  }

  renderRewards() {
    return (
      <Card shadow style={{ paddingBottom: theme.sizes.base*1 ,paddingVertical: theme.sizes.base * 1}}>       
        {/* <Block color="gray3" style={styles.hLine} /> */}
        {/* <Text>{"\n"}</Text> */}
        <Card shadow style={{ paddingVertical: theme.sizes.base * 1}}>
        <Block row>
          <Block center flex={0.8}>
            <Text size={20} spacing={1} primary>12</Text>
            <Text spacing={0.7}>Books</Text>
          </Block>
          
          <Block center flex={0.8}>
            <Text size={20} spacing={1} primary>33</Text>
            <Text spacing={0.7}>Chapters</Text>
          </Block>

          <Block center flex={0.8}>
            <Text size={20} spacing={0.5} primary>332</Text>
            <View style={{alignItems:'center', flexDirection:'column'}}>
            <Text>Minutes</Text>
            
            </View>
          </Block>
        </Block>

        <Block color="gray3" style={styles.hLine} />

        <Block style={{ marginBottom: theme.sizes.base * 0.1}}>
          {/* <Block row center style={{ paddingLeft: 6 }}>
  <Text body spacing={0.7}>Retention rate of listeners -> {"\t"}</Text>
            <Text size={20} primary spacing={0.7}>7.4</Text>
          </Block> */}
         <Block center>
            <Text size={20} spacing={0.5} primary>7.4</Text>
            <View style={{alignItems:'center', flexDirection:'column'}}>
            <Text>Retention rate of listeners (%)</Text>
            
            </View>
          </Block>
        </Block>
    </Card>

        {/* <Block color="gray3" style={styles.hLine} /> */}
         
        <Card shadow style={{ paddingVertical: theme.sizes.base * 1}}>
        <Block center style={{paddingBottom:20}}>
          <AnimatedCircularProgress
            size={214} // can use  with * .5 => 50%
            fill={95} // percentage
            lineCap="round" // line ending style
            rotation={120}
            arcSweepAngle={280}
            width={theme.sizes.base}
            tintColor={theme.colors.primary} // gradient is not supported
            backgroundColor={theme.colors.gray3}
            backgroundWidth={theme.sizes.base / 2}
          >
            {() => (
              <Block center middle>
                <Text h2 medium>8.1</Text>
                <Text h3 transform="uppercase">good</Text>
              </Block>
            )}
          </AnimatedCircularProgress>
        </Block>

        <Block center>
          <Text title spacing={1} style={{fontWeight:'italic', marginVertical: 8}}>
            Gnosis Score
          </Text>
        </Block>
        <Block >
          <Text style={{fontWeight:'italic', marginVertical: 8}}>
            * Gnosis Score is calculated monthly based on the 4 factors given below -
        </Text>
        <Text spacing={1}>
             1. Count of your podcast listeners. {"\n"}
             2. Count of likes on your podcasts. {"\n"}
             3. Nature of comments on your podcasts.{"\n"}
             4. Total time spent on the App by listeners listening to your podcasts.
          </Text>
          <Text style={{marginVertical: 8}}>
            * We won't make "Gnosis Score" public and only serves as a self improvement tool.
            

          </Text>

         
        </Block>
        </Card>
      </Card>
    )
  }

  renderChallenges() {
    return (
      <Block>
        <Block style={{
            marginTop: theme.sizes.base,
            marginBottom: theme.sizes.base,
            paddingHorizontal: theme.sizes.base / 3
          }}
        >
          <Text spacing={0.7} transform="uppercase">
            Challenges taken
          </Text>
        </Block>

        <Card row shadow color="gray">
          <Block middle flex={0.4}>
            <Badge color={rgba(theme.colors.white, '0.2')} size={74}>
              <Badge color={rgba(theme.colors.white, '0.2')} size={52}>
                <FontAwesome name="check" color="white" size={theme.sizes.h1} />
              </Badge>
            </Badge>
          </Block>
          <Block middle>
            <Text size={theme.sizes.base} spacing={0.4} medium white>
              Hit zero pedestrians
            </Text>
            <Text size={theme.sizes.base} spacing={0.4} medium white>
              during next trip - $5
            </Text>
          </Block>
        </Card>
      </Block>
    )
  }

  render() {
    return (
      <ScrollView style={styles.rewards} showsVerticalScrollIndicator={false}>
        <View>
  
        <View>
        <View style={{flexDirection:'row'}}>
        <View>
          <Text style={{paddingTop:height/20, paddingHorizontal:width/10, fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
          {this.state.followingCount}
          </Text>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('UserFollowingScreen', { item : this.props.navigation.state.params.item })}><Text style={{fontFamily:'sans-serif-light', paddingHorizontal:width/13}}>Following</Text>
          </TouchableOpacity>
          </View>
    
            <View style={{alignItems:'center', justifyContent:'center', flex:3, paddingTop:height/50}}>
              <Image source={{uri:this.state.imageURL}}  style={{width:100, height:100, borderRadius:50 }}/>
            </View>
            <View>
            <Text style={{paddingTop:height/20 , paddingHorizontal:width/10,  fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
            {this.state.followersCount}
          </Text>                                             
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('UserFollowerScreen', { item : this.props.navigation.state.params.item })}><Text style={{fontFamily:'sans-serif-light', paddingHorizontal:width/13}}>Followers</Text></TouchableOpacity>
          </View>

        </View>
        </View>
        <View style={{ alignItems:'center',flex:1,marginTop:20}}>
       
    <Text style={{ fontSize:24, fontWeight:"200",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center', justifyContent:'center'}}>{this.state.name}</Text>
       

        </View>
       
        <View>
    <Text style={{ fontSize:14, fontWeight:"100",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center', justifyContent:'center', padding:20}}>{this.state.introduction}</Text>
        </View>

        </View>
       <Block flex={false} row center style={styles.header}>
       
          <Text h3 bold>Listening Statistics</Text>
        </Block>
        {this.renderMonthly()}
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
