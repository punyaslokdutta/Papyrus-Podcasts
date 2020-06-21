import React,{useState,useEffect} from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity,TouchableNativeFeedback, View,Dimensions } from 'react-native'
import {Button} from 'native-base';
import {withFirebaseHOC} from '../../config/Firebase'
import { Block, Card, Text } from '../categories/components';
import { theme} from '../categories/constants';
import {useSelector,useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome'
import { XAxis,YAxis,LineChart, Grid } from 'react-native-svg-charts'
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';


var {width, height}=Dimensions.get('window')

 

const Profile_StatsScreen = (props) => {

     const userid = props.firebase._getUid();
     const privateUserID = "private" + userid;
     const bookmarksCountArray = useSelector(state=>state.userReducer.bookmarksCountArray);
     const [bookmarksCountArrayState,setBookmarksCountArrayState] = useState(bookmarksCountArray);
     const likesCountArray = useSelector(state=>state.userReducer.likesCountArray);
     const dispatch = useDispatch();

     const name = useSelector(state=>state.userReducer.name);
     const numFollowings = useSelector(state=>state.userReducer.numFollowing);  
     const profilePic = useSelector(state=>state.userReducer.displayPictureURL);
     const introduction = useSelector(state=>state.userReducer.introduction)
     const numFollowers = useSelector(state=>state.userReducer.numFollowers);  
     
     const numCreatedBookPodcasts = useSelector(state=>state.userReducer.numCreatedBookPodcasts);
     const numCreatedChapterPodcasts = useSelector(state=>state.userReducer.numCreatedChapterPodcasts);
     const totalMinutesRecorded = useSelector(state=>state.userReducer.totalMinutesRecorded);
     const totalMinutesRecordedInteger = Math.floor(totalMinutesRecorded);
     
     function union_arrays (x, y) {
      var obj = {};
      console.log("x: ",x);
      console.log("y: ",y);
      for (var i = x.length-1; i >= 0; -- i)
         obj[x[i]] = x[i];
      for (var i = y.length-1; i >= 0; -- i)
         obj[y[i]] = y[i];
      var res = []
      for (var k in obj) {
        if (obj.hasOwnProperty(k))  // <-- optional
          res.push(obj[k]);
      }
      console.log(res);
      return res;
    }

    async function fetchPodcastsAndExtractStats()
    {
        const createdPodcastsArrayDocs = await firestore().collectionGroup('podcasts')
                                        .where('podcasterID','==',userid).get();

        const createdPodcastsData = createdPodcastsArrayDocs.docs.map(document=>document.data());
        const totalUsersLikedArray = createdPodcastsData.map(doc=>doc.numUsersLiked);
        const numPodcastsCreated = createdPodcastsData.length;
        var totalUsersLiked = 0;
        for(var i=0;i<numPodcastsCreated;i++)
            totalUsersLiked = totalUsersLiked + totalUsersLikedArray[i];
        
        var currentTime = moment().format();
        var tempLikesArray = likesCountArray;
        const countLikesItem = {date:currentTime,likesCount:totalUsersLiked}
        tempLikesArray.push(countLikesItem);

        const createdPodcastIDs = createdPodcastsData.map(doc=>doc.podcastID);
        console.log("createdPodcastIDs = ",createdPodcastIDs);
        
        var distinctUsers = [];
        for(var i=0;i<=numPodcastsCreated/10;i++)
        {
            //const 
            const selectedPodcasts = createdPodcastIDs.slice(10*i,Math.min(10*(i+1),numPodcastsCreated));
            if(selectedPodcasts.length == 0)
            {
              continue;
            }
            const distinctUserIDDocs = await firestore().collectionGroup('privateUserData')
                                    .where('podcastsBookmarked','array-contains-any',selectedPodcasts).get();

            const distinctUserIDData = distinctUserIDDocs.docs.map(document=>document.data());
            var distinctUserIDsTemp = distinctUserIDData.map(doc=>doc.id);

            console.log("distinctUserIDsTemp: ",distinctUserIDsTemp);
            distinctUsers = union_arrays(distinctUsers,distinctUserIDsTemp);//.filter(x => distinctUserIDsTemp.includes(x)))
            
            console.log("distinctUsers -- ",i," -- ",distinctUsers);
        }

        const distinctUserIDsCount = distinctUsers.length;
        console.log("distinctUsers: ",distinctUsers);

        var tempBookmarksArray = bookmarksCountArray;
        currentTime = moment().format();
        const countBookmarkItem = {date:currentTime,bookmarkCount:distinctUserIDsCount}
        
        tempBookmarksArray.push(countBookmarkItem);
        
        await firestore().collection('users').doc(userid).collection('privateUserData')
                .doc(privateUserID).set({
                    bookmarksCountArray : firestore.FieldValue.arrayUnion(countBookmarkItem),
                    likesCountArray : firestore.FieldValue.arrayUnion(countLikesItem)
                },{merge:true})
        
        dispatch({type:"SET_LIKES_COUNT_ARRAY",payload:tempLikesArray});
        setBookmarksCountArrayState(tempBookmarksArray);
        dispatch({type:"SET_BOOKMARKS_COUNT_ARRAY",payload:tempBookmarksArray});
    }

    useEffect(() => {
      console.log("likesCountArray = ",likesCountArray);
      if(likesCountArray.length == 0)
      {
          fetchPodcastsAndExtractStats();
      }
      else
      {
          var lastTimeLikesUpdated = moment(likesCountArray[likesCountArray.length - 1].date);
          var endTime = moment(Date.now());
          const timeDifference = endTime.diff(lastTimeLikesUpdated, 'hours');

          console.log("Time Difference(in hrs) = ",timeDifference);
          if(timeDifference >= 2) // Only fetch after 2 hours since last update
              fetchPodcastsAndExtractStats();
      }
      
  },[])

  const countlikesArray = likesCountArray.map(item=>item.likesCount*100);
    const countbookmarksArray = bookmarksCountArrayState.map(item=>item.bookmarkCount*100);
    
    const contentInset = { top: 5, bottom: 5 }

	 return (
      <ScrollView style={styles.rewards} showsVerticalScrollIndicator={false}>
        <View>
  
        <View>
        <View style={{flexDirection:'row',paddingTop:50}}>
   
            <View style={{paddingTop:100, alignItems:'center', justifyContent:'center', flex:3, paddingTop:height/50}}>
              <Image source={{uri: profilePic}}  style={{width:200, height:200,borderRadius:10}}/>
            </View>
           
        </View>
        </View>
        <View style={{paddingTop:50,alignItems:'center',flex:1}}>
        {/* <Button  style={{flex:1, justifyContent:'center', height:height/25, width:width/3, borderRadius:5, backgroundColor:theme.colors.primary}} onPress={()=>props.navigation.navigate('editProfile')}> */}
        <TouchableOpacity onPress={()=>props.navigation.navigate('editProfile')}>
        <Icon size={30} name="pencil-square-o"/>
        </TouchableOpacity>
        {/* </Button> */}

        </View>
        <View style={{ alignItems:'center',flex:1,marginTop:20}}>
       
   <Text  style={{ fontSize:24,  textShadowColor:'black', fontFamily:'Montserrat-Bold', alignItems:'center', justifyContent:'center'}}>{name}</Text>
       

        </View>
        <View style={{justifyContent:'center',alignItems:'center'}}>
        <Text style={{ fontSize:14,  textShadowColor:'black', fontFamily:'Montserrat-Regular', alignItems:'center',
                      justifyContent:'center', padding:20}}>
                   {introduction}
                      </Text>
        </View>
        <View style={{justifyContent:'center',flexDirection:'row'}}>
        <TouchableOpacity onPress={()=>{
          numFollowings!=0 && props.navigation.navigate('ProfileFollowingScreen', { id : userid })
          }}>
        <View style={{justifyContent:'center',alignItems:'center'}}>
          <Text style={{paddingTop:height/20, paddingHorizontal:width/10, fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
            {numFollowings}
          </Text>
         <Text style={{fontFamily:'Montserrat-Regular', paddingHorizontal:width/13}}>Following</Text>
          </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={()=>{
       numFollowers!=0 &&  props.navigation.navigate('ProfileFollowerScreen', { id : userid })
      }}>
            <View style={{justifyContent:'center',alignItems:'center'}}>
            <Text style={{paddingTop:height/20 , paddingHorizontal:width/10,  fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
            {numFollowers}
          </Text>
          <Text style={{fontFamily:'Montserrat-Regular', paddingHorizontal:width/13}}>Followers</Text>
          </View>
          </TouchableOpacity>
       </View>

        

        
        </View>
        {/* <Block flex={false} row center space="between" style={styles.header}> */}
         <View style={{alignItems:'center'}}>

   <Text h3 style={{fontFamily:'Montserrat-Bold'}}>{"\n"}Your Podcast Statistics {"   "}</Text>
        </View>
        {/* </Block> */}
        {renderRewards(numCreatedBookPodcasts,numCreatedChapterPodcasts,totalMinutesRecordedInteger)}
        
    {
      (countbookmarksArray.length !=0 && 
      countbookmarksArray[countbookmarksArray.length - 1] != 0)
      
      ?
    <View>
      <View style={{paddingLeft:width/10,height:height/4,flexDirection:'row'}}>
      <YAxis
              style={{height:height/4}}
              data={countbookmarksArray}
              contentInset={contentInset}
              svg={{
                  //fill: 'black',
                  fontSize: 10
              }}
              //numberOfTicks={20}
              formatLabel={(value) => `${value}`}                  
          />
      <LineChart
         style={{ flex:1,height: height/4,paddingRight:width/10 }}
         data={bookmarksCountArrayState}
         showGrid={true}
         yAccessor={({ item }) => item.bookmarkCount}
         xAccessor={({ item }) => moment(item.date)}
         //gridMin={0}
         //gridMax={15}
         svg={{ strokeWidth:3,stroke: 'rgb(134, 65, 244)' }}
         contentInset={{ top:5, bottom: 5,left:0,right:0 }}
         //yScale={d3Scale.scaleLinear}
     >
         
         <Grid/>
     </LineChart>

     
     </View>
      
     <View style={{paddingTop:10,paddingBottom:20,alignItems:'center',justifyContent:'center'}}>
     <Text style={{fontWeight:'bold'}}> Content Engagement score</Text>
     {/* <Text style={{fontSize:12,paddingHorizontal:35,textAlign:'center'}}>Count of distinct users who have bookmarked your podcasts</Text> */}
     </View>


     <View style={{paddingTop:20,paddingLeft:width/10,height:height/4,flexDirection:'row'}}>
          <YAxis
                 style={{height:height/4}}
                 data={countlikesArray}
                 contentInset={contentInset}
                 svg={{
                     //fill: 'black',
                     fontSize: 10
                 }}
                 //numberOfTicks={20}
                 formatLabel={(value) => `${value}`}
             />
     <LineChart
         style={{ flex:1,height: height/4,paddingRight:width/10 }}
         data={likesCountArray}
         showGrid={true}
         yAccessor={({ item }) => item.likesCount}
         xAccessor={({ item }) => moment(item.date)}
         //gridMin={0}
         //gridMax={15}
         svg={{ strokeWidth:3,stroke: 'green' }}
         contentInset={{ top:5, bottom: 5,left:0,right:0 }}
         //yScale={d3Scale.scaleLinear}
     >
         
         <Grid/>
     </LineChart>

     
     </View>
      
     <View style={{paddingTop:10,alignItems:'center',justifyContent:'center',paddingBottom:height/11 + 48}}>
     <Text style={{fontWeight:'bold',paddingTop:20}}> Gnosis score</Text>
     </View>
      </View>
     :
      <View style={{height:height/2}}>
          <Image style={{height:height/3}} source={{uri:"https://storage.googleapis.com/papyrus-274618.appspot.com/illustrations/graphIllustration.png"}}/>
          <Text style={{fontFamily:'Montserrat-Regular'}}> Upload a podcast to receive analytics on your created podcasts.
            </Text>
      </View>
    }
        
      </ScrollView>
    )
}


function renderRewards(numCreatedBookPodcasts,numCreatedChapterPodcasts,totalMinutesRecordedInteger){
  return (
    <Card shadow style={{ paddingBottom: theme.sizes.base*1 ,paddingVertical: theme.sizes.base * 1}}>       

      <Block row>
        <Block center flex={0.8}>
  <Text size={20} spacing={1} primary>{numCreatedBookPodcasts}</Text>
          <Text spacing={0.7} style={{fontFamily:'Montserrat-Regular'}}>Books</Text>
        </Block>
        
        <Block center flex={0.8}>
  <Text size={20} spacing={1} primary>{numCreatedChapterPodcasts}</Text>
          <Text spacing={0.7} style={{fontFamily:'Montserrat-Regular'}}>Chapters</Text>
        </Block>

        <Block center flex={0.8}>
  <Text size={20} spacing={0.5} primary>{totalMinutesRecordedInteger}</Text>
          <View style={{alignItems:'center', flexDirection:'column'}}>
          <Text style={{fontFamily:'Montserrat-Regular'}}>Minutes</Text>
          
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