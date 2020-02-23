import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View,Dimensions } from 'react-native'
import {Button} from 'native-base';
import {withFirebaseHOC} from '../../config/Firebase'
import { Block, Card, Text } from '../categories/components';
import { theme} from '../categories/constants';
import {useSelector} from 'react-redux';
var {width, height}=Dimensions.get('window')

 

const Profile_StatsScreen = (props) => {

     const userid = props.firebase._getUid();
     const name = useSelector(state=>state.userReducer.name);
     const numFollowings = useSelector(state=>state.userReducer.numFollowing);  
     const profilePic = useSelector(state=>state.userReducer.displayPictureURL);
     const introduction = useSelector(state=>state.userReducer.introduction)
     const numFollowers = useSelector(state=>state.userReducer.numFollowers);  
     
     const numCreatedBookPodcasts = useSelector(state=>state.userReducer.numCreatedBookPodcasts);
     const numCreatedChapterPodcasts = useSelector(state=>state.userReducer.numCreatedChapterPodcasts);
     const totalMinutesRecorded = useSelector(state=>state.userReducer.totalMinutesRecorded);
   
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
        <Text style={{ fontSize:14, fontWeight:"100",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center',
                      justifyContent:'center', padding:20}}>
                   {introduction}
                      </Text>
        </View>

        <View style={{alignItems:'center',flex:1}}>
        <Button  style={{flex:1, justifyContent:'center', height:height/25, width:width/3, borderRadius:5, backgroundColor:theme.colors.primary}} onPress={()=>props.navigation.navigate('editProfile')}>
        <Text>Edit Profile</Text>
        </Button>

        </View>
        </View>
        {/* <Block flex={false} row center space="between" style={styles.header}> */}
         <View style={{alignItems:'center'}}>

    <Text h3 bold>{"\n"}Your Podcast Statistics</Text>
        </View>
        {/* </Block> */}
        {renderRewards(numCreatedBookPodcasts,numCreatedChapterPodcasts,totalMinutesRecorded)}
        
      </ScrollView>
    )
}


renderRewards = (numCreatedBookPodcasts,numCreatedChapterPodcasts,totalMinutesRecorded) => {
  return (
    <Card shadow style={{ paddingBottom: theme.sizes.base*1 ,paddingVertical: theme.sizes.base * 1}}>       
     
      <Block row>
        <Block center flex={0.8}>
  <Text size={20} spacing={1} primary>{numCreatedBookPodcasts}</Text>
          <Text spacing={0.7}>Books</Text>
        </Block>
        
        <Block center flex={0.8}>
  <Text size={20} spacing={1} primary>{numCreatedChapterPodcasts}</Text>
          <Text spacing={0.7}>Chapters</Text>
        </Block>

        <Block center flex={0.8}>
  <Text size={20} spacing={0.5} primary>{totalMinutesRecorded}</Text>
          <View style={{alignItems:'center', flexDirection:'column'}}>
          <Text>Minutes</Text>
          
          </View>
        </Block>
      </Block>

      <Block color="gray3" style={styles.hLine} />

      
  </Card>
    
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