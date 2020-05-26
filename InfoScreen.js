import React, { Component, useState,useEffect } from "react";
import firestore from '@react-native-firebase/firestore';
import {
  Dimensions,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity, View
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'

import { Button, Divider, Block, Text } from "./screens/components/categories/components";
import { theme, mocks } from "./screens/components/categories/constants";
import LikersScreen from './screens/components/PodcastPlayer/LikersScreen'
import {useSelector,useDispatch } from 'react-redux'
import { withFirebaseHOC } from "./screens/config/Firebase";

const { width, height } = Dimensions.get("window");

 const InfoScreen=(props)=> {
  
  const realUserID = props.firebase._getUid();
  const podcast=useState(props.navigation.state.params.podcast)
  const numUsersLiked=useSelector(state=>state.rootReducer.numLikes)
  const [userPrivateDoc,setUserPrivateDoc] = useState(null)
  //console.log(podcast[0].podcastPictures)
  const dispatch = useDispatch();
  useEffect(() => {
    fetchUserPrivateDoc(podcast[0].podcasterID)
  },[])

  async function fetchUserPrivateDoc(userID)
  {
    try{
      const privateDataID = "private" + userID;
      const userDocument = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).get();
      console.log("[InfoScreen] userDocument : ", userDocument);
      const userDocumentData = userDocument.data();
      console.log("[InfoScreen] userDocumentData : ", userDocumentData);
      setUserPrivateDoc(userDocumentData);
    }
    catch(error){
      console.log("Error in fetchUserPrivateDoc() in InfoScreen: ",error);
    }
  }

   function renderGallery() {
    const { product } = props;
    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        data={podcast[0].podcastPictures}
        keyExtractor={(item, index) => `${index}`}
        renderItem={( {item} ) => (
          <Image
            source={{uri:item}}
            resizeMode="contain"
            style={{ width, height: height / 2.8 }}
          />
        )}
      />
    );
  }

    const { product } =props;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{backgroundColor:'#212121'}}>
        {renderGallery()}
        </View>
        <Block style={styles.product}>
          <Text h2 style={{fontFamily:'Proxima-Nova-Bold',color:'white'}}>
            {podcast[0].podcastName}
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Block flex={false} row margin={[theme.sizes.base, 0]}>
            { podcast[0].tags && podcast[0].tags.map(tag => (
              <Text key={`tag-${tag}`} caption  style={styles.tag}>
                {tag}
              </Text>
            ))}
          </Block>
          </ScrollView>
          <Text style={{color:'white',fontFamily:'Proxima-Nova-Regular'}} light height={22}>
            {podcast[0].podcastDescription}
          </Text>

          <TouchableOpacity onPress={() => {props.navigation.navigate('LikersScreen',
              {podcastID:podcast[0].podcastID})}}>
          <View style={{paddingTop:10}}>
            {
              numUsersLiked == 1 && <Text style={{fontFamily:'Proxima-Nova-Regular',color:'white'}}>{numUsersLiked} Like</Text>
            }
            {
              numUsersLiked > 1 && <Text style={{fontFamily:'Proxima-Nova-Regular',color:'white'}}>{numUsersLiked} Likes</Text>
            }
            
          </View>
        </TouchableOpacity>

          <Divider margin={[theme.sizes.padding * 0.5,0]} /> 
        
              <TouchableOpacity onPress={() => {
                if(realUserID == userPrivateDoc.id)
                {
                  props.navigation.navigate('ProfileTabNavigator');
                }
                else
                {
                  dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:userPrivateDoc})
                  props.navigation.navigate('ExploreTabNavigator',{userData:userPrivateDoc});
                }
                }}>
              {
                userPrivateDoc !== null && 
                <View style={{flexDirection:'row',paddingRight:theme.sizes.base*1.5}}>
                  <View style={{alignItems:'center',justifyContent:'center'}}>
                <Image source={{uri:userPrivateDoc.displayPicture}} style={{borderRadius:30,width:width/8,height:width/8}}/>
                </View>
                <View style={{paddingLeft:10,flexDirection:'column'}}>
                <Text style={{fontSize:15,fontFamily:'Proxima-Nova-Bold',color:'white'}}>{userPrivateDoc.name}{"  "}</Text>
                <Text style={{fontFamily:'Proxima-Nova-Regular',color:'white'}}>{userPrivateDoc.introduction}</Text>
                </View>
                </View>
              }
              
              </TouchableOpacity>
              
           
           <Divider margin={[theme.sizes.padding * 0.5, 0]} />
           <View style={{flexDirection:'row',paddingBottom:height*2/11}}>
             {
               podcast[0].isChapterPodcast == true 
               ?
               <View>
               <Text style={{color:'white',fontFamily:'Proxima-Nova-Regular'}}>Chapter</Text> 
               <TouchableOpacity onPress={() => props.navigation.navigate('RecordChapter',{bookID:podcast[0].bookID,chapterID:podcast[0].chapterID})}>
               <Text style={{fontSize:20,fontFamily:'Proxima-Nova-Bold',color:'white'}}>{podcast[0].chapterName} {"  "}{"\n"}</Text>
               </TouchableOpacity>
               <Divider margin={[theme.sizes.padding * 0.5, 0]} />
               <Text style={{color:'white',fontFamily:'Proxima-Nova-Regular'}}>Book</Text>
               <TouchableOpacity onPress={() => props.navigation.navigate('RecordBook',{bookID:podcast[0].bookID})}>
               <Text style={{fontSize:20,fontFamily:'Proxima-Nova-Bold',color:'white'}}>{podcast[0].bookName}{"  "}</Text>
               </TouchableOpacity>
               </View>
               :
               <View>
               <Text style={{color:'white',fontFamily:'Proxima-Nova-Regular'}}>Book</Text>
               <TouchableOpacity onPress={() => props.navigation.navigate('RecordBook',{bookID:podcast[0].bookID})}>
               <Text style={{fontSize:20,fontFamily:'Proxima-Nova-Bold',color:'white'}}>{podcast[0].bookName}{" "}</Text>
               </TouchableOpacity>
               </View>
             }
           
           </View>

           {
              (podcast[0].podcasterID == "UoTnf7dgzvQL7GUaPCwIGlXReGS2") &&
              <View>
              <Text style={{fontSize:10}}> This podcast/audiobook is in the public domain.</Text>
              </View>
            }
        </Block>
      </ScrollView>
    );
  
}


export default withFirebaseHOC(InfoScreen);

const styles = StyleSheet.create({
  product: {
    paddingRight: theme.sizes.base * 4,
    paddingLeft: theme.sizes.base * 1.5,
    paddingVertical: theme.sizes.padding,
    backgroundColor:'#212121'
  },
  tag: {
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.sizes.base,
    paddingHorizontal: theme.sizes.base*0.5,
    paddingVertical: theme.sizes.base / 2.5,
    marginRight: theme.sizes.base * 0.625,
    color:'white'
  },
  image: {
    width: width / 3.26,
    height: width / 3.26,
    marginRight: theme.sizes.base
  },
  more: {
    width: 55,
    height: 55
  }
});

