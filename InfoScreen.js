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
        {renderGallery()}

        <Block style={styles.product}>
          <Text h2 bold>
            {podcast[0].podcastName}
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Block flex={false} row margin={[theme.sizes.base, 0]}>
            { podcast[0].tags && podcast[0].tags.map(tag => (
              <Text key={`tag-${tag}`} caption gray style={styles.tag}>
                {tag}
              </Text>
            ))}
          </Block>
          </ScrollView>
          <Text gray light height={22}>
            {podcast[0].podcastDescription}
          </Text>

          <TouchableOpacity onPress={() => {props.navigation.navigate('LikersScreen',
              {podcastID:podcast[0].podcastID})}}>
          <View>
            <Text>{"\n"}{numUsersLiked} Likes</Text>
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
                <Text style={{fontSize:15,fontWeight:'bold'}}>{userPrivateDoc.name}{"  "}</Text>
                <Text>{userPrivateDoc.introduction}</Text>
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
               <Text>Chapter</Text> 
               <TouchableOpacity onPress={() => props.navigation.navigate('RecordChapter',{bookID:podcast[0].bookID,chapterID:podcast[0].chapterID})}>
               <Text style={{fontSize:20,fontWeight:'bold'}}>{podcast[0].chapterName} {" "}{"\n"}</Text>
               </TouchableOpacity>
               <Divider margin={[theme.sizes.padding * 0.5, 0]} />
               <Text>Book</Text>
               <TouchableOpacity onPress={() => props.navigation.navigate('RecordBook',{bookID:podcast[0].bookID})}>
               <Text style={{fontSize:20,fontWeight:'bold'}}>{podcast[0].bookName}{" "}</Text>
               </TouchableOpacity>
               </View>
               :
               <View>
               <Text>Book</Text>
               <TouchableOpacity onPress={() => props.navigation.navigate('RecordBook',{bookID:podcast[0].bookID})}>
               <Text style={{fontSize:20,fontWeight:'bold'}}>{podcast[0].bookName}{" "}</Text>
               </TouchableOpacity>
               </View>
             }
           
           </View>
        </Block>
      </ScrollView>
    );
  
}


export default withFirebaseHOC(InfoScreen);

const styles = StyleSheet.create({
  product: {
    paddingHorizontal: theme.sizes.base * 1.5,
    paddingVertical: theme.sizes.padding
  },
  tag: {
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.sizes.base,
    paddingHorizontal: theme.sizes.base*0.5,
    paddingVertical: theme.sizes.base / 2.5,
    marginRight: theme.sizes.base * 0.625
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

