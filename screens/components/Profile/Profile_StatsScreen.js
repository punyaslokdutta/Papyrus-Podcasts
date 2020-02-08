import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View,Dimensions } from 'react-native'
import rgba from 'hex-to-rgba';
import {Button} from 'native-base';
//import Icon from 'react-native-vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// check this lib for more options
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {withFirebaseHOC} from '../../config/Firebase'
import { Block, Badge, Card, Text } from '../categories/components';
import { theme, mocks } from '../categories/constants';
import Icon from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore';
import {useSelector,useDispatch} from 'react-redux';
import ProfileFollowingScreen from '../Profile/ProfileFollowingScreen';
import ProfileFollowerScreen from '../Profile/ProfileFollowerScreen';
//import { theme, mocks } from '../categories/constants';

var {width, height}=Dimensions.get('window')

//////
  renderMonthly = () => {
    return (
      <Card shadow style={{ paddingVertical: theme.sizes.padding * 0.25 }}>
        <Block>
          <Block center>
            <Text h1 primary spacing={1.7}>116</Text>
            <Text spacing={0.7}>Total Listening Time (mins)</Text>
          </Block>

          {/* <Block color="gray3" style={styles.hLine} /> */}
          <Text>{"\n"}</Text>
          <Block row>
            <Block center>
              <Text size={20} spacing={0.6} primary style={{ marginBottom: 3 }}>12</Text>
              <Text body spacing={0.7}>Number of </Text>
              <Text body spacing={0.7}>Book Podcasts</Text>
            </Block>

            <Block flex={false} color="gray3" style={styles.vLine} />

            <Block center>
              <Text size={20} spacing={0.6} primary style={{ marginBottom: 3 }}>30</Text>
              <Text body spacing={0.7}>Number of </Text>
              <Text body spacing={0.7}>Chapter Podcasts</Text>
            </Block>
          </Block>
        </Block>
      </Card>
    )
  }

  renderRewards = (stats) => {
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
            <Text size={20} spacing={0.5} primary>{stats.retention_rate_of_listeners}</Text>
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
                <Text h2 medium>{stats.gnosis_score}</Text>
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

const Profile_StatsScreen = (props) => {

     const stats = useSelector(state=>state.userReducer.stats);
     console.log("INSIDE PROFILE STATS SCREEN\n",stats);
     const name = useSelector(state=>state.userReducer.name);
     const numFollowings = useSelector(state=>state.userReducer.numFollowing);  
     const profilePic = useSelector(state=>state.userReducer.displayPictureURL);
     
     const numFollowers = useSelector(state=>state.userReducer.numFollowers);  
     const userid = props.firebase._getUid();
    //  const totalListenCount =  stats.totalListenCount, 
    //  const book_podcast_listen_count = stats.book_podcast_listen_count, 
    //  const chapter_podcast_listen_count = stats.chapter_podcast_listen_count, 
    //  const Gnosis_Score = stats.gnosis_score,
    //  const Books_recorded_count = stats.Books_recorded_count, 
    //  const Chapter_Recorder_count = stats.Chapter_Recorder_count, 
    //  const Time = stats.Time 	 
	 return (
      <ScrollView style={styles.rewards} showsVerticalScrollIndicator={false}>
        <View>
  
        <View>
        <View style={{flexDirection:'row'}}>
    <TouchableOpacity onPress={()=>props.navigation.navigate('ProfileFollowingScreen', { id : userid })}>
        <View>
          <Text style={{paddingTop:height/20, paddingHorizontal:width/10, fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
            {numFollowings}
          </Text>
         <Text style={{fontFamily:'sans-serif-light', paddingHorizontal:width/13}}>Following</Text>
          </View>
    </TouchableOpacity>
            <View style={{alignItems:'center', justifyContent:'center', flex:3, paddingTop:height/50}}>
              <Image source={{uri: profilePic}}  style={{width:100, height:100, borderRadius:50 }}/>
            </View>
            <TouchableOpacity onPress={()=>props.navigation.navigate('ProfileFollowerScreen', { id : userid })}>
            <View>
            <Text style={{paddingTop:height/20 , paddingHorizontal:width/10,  fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
            {numFollowers}
          </Text>
          <Text style={{fontFamily:'sans-serif-light', paddingHorizontal:width/13}}>Followers</Text>
          </View>
          </TouchableOpacity>
        </View>
        </View>
        <View style={{ alignItems:'center',flex:1,marginTop:20}}>
       
   <Text style={{ fontSize:24, fontWeight:"200",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center', justifyContent:'center'}}>{name}</Text>
       

        </View>
       
        <View>
        <Text style={{ fontSize:14, fontWeight:"100",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center', justifyContent:'center', padding:20}}>I read books on philosophy, economics, computer science, social sciences, geopolitics.</Text>
        </View>

        <View style={{alignItems:'center',flex:1}}>
        <Button  style={{flex:1, justifyContent:'center', height:height/25, width:width/3, borderRadius:5, backgroundColor:theme.colors.primary}} onPress={()=>props.navigation.navigate('editProfile')}>
        <Text>Edit Profile</Text>
        </Button>

        </View>
        </View>
       <Block flex={false} row center style={styles.header}>
       
          <Text h3 bold>Listening Statistics</Text>
        </Block>
        {renderMonthly(stats)}
        {/* <Block flex={false} row center space="between" style={styles.header}> */}
         <View style={{alignItems:'center'}}>

    <Text h3 bold>{"\n"}Your Podcast Statistics</Text>
        </View>
        {/* </Block> */}
        {renderRewards(stats)}
        
      </ScrollView>
    )
}

export default withFirebaseHOC(Profile_StatsScreen);

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