import React,{useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { Text, View,FlatList,TouchableOpacity,Dimensions, ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-simple-toast';
import ToggleSwitch from 'toggle-switch-react-native';

import {withFirebaseHOC} from './config/Firebase';
import MusicCategoryItem from './components/Explore/MusicCategoryItem';
import ItemSeperator from './components/Explore/ItemSeperator';

const {width,height} = Dimensions.get('window')

const EditMusicPreferences = (props) => {
    const dispatch = useDispatch();

    const  userid = props.firebase._getUid();
    const privateUserID = "private" + userid;

    const [musicCategoriesState,setMusicCategoriesState] = useState([]);
    const musicPreferences = useSelector(state=>state.userReducer.musicPreferences);
    const isMusicEnabled = useSelector(state=>state.userReducer.isMusicEnabled);

    useEffect(() => {
        dispatch({type:"SET_MUSIC_PREFERENCES_MAP"});
        retrieveAllMusicCategories();
    },[])

    async function retrieveAllMusicCategories()
    {
      try{
        const musicCategories = await firestore().collection('musicCategories').get();
        const musicCategoriesData = musicCategories.docs.map(document=>document.data()); 
        console.log("[EditMusicPreferences] musicCategoriesData: ",musicCategoriesData);
        setMusicCategoriesState(musicCategoriesData);
      }
      catch(error){
        console.log("Error in retrieving musicCategories from firestore",error);
      }
    }

    async function addMusicPreferencesToFirestore()
    {   
        console.log("musicPreferences: ",musicPreferences);
        console.log("musicCategoriesState: ",musicCategoriesState);
        var localMusicPreferences = [];
        for(var i=0;i<musicCategoriesState.length;i++){
            if(musicPreferences[musicCategoriesState[i].musicCategoryName] == true)
                localMusicPreferences.push(musicCategoriesState[i].musicCategoryName);
        }

        if(localMusicPreferences.length == 0){
            alert('Please select atleast 1 category for your background theme');
            return;
        }

        dispatch({type:"SET_MUSIC_PREFERENCES_ARRAY",payload:localMusicPreferences});
        firestore().collection('users').doc(userid).collection('privateUserData').doc(privateUserID).set({
            musicPreferences : localMusicPreferences
        },{merge:true}).then(() => {
            console.log("Added MusicPreferences to user's private document");
            Toast.show('Background music updated');
        }).catch((error) => {
        console.log(error);
        })
    }

    async function modifyMusicPreferenceInDatabase(isOn){
        firestore().collection('users').doc(userid).collection('privateUserData').doc(privateUserID).set({
          musicPlayerEnabled : isOn 
        },{merge:true}).then(() => {
          console.log("Successfully set the musicPlayer preference in database");
        }).catch((error) => {
        console.log("Error in setting musicPlayer preference in database");
        })
      }

    function renderHeader(){
        return (
            <View style={{alignItems:'center',marginBottom:30}}>
            <ToggleSwitch
            isOn={isMusicEnabled}
            onColor="#79cced"
            offColor='#808080'
            labelStyle={{ color: "white", fontWeight: "900" }}
            size="medium"
            onToggle={isOn => {
              console.log("changed to : ", isOn)
              modifyMusicPreferenceInDatabase(isOn);
              dispatch({type:"SET_IS_MUSIC_ENABLED",payload:isOn})
            }}
          />
          </View>
        )
    }

    function renderFooter(){
        return (
          <View style={{alignItems:'center',marginTop:10,marginBottom:20}}>
          <TouchableOpacity onPress={() => {
            addMusicPreferencesToFirestore();
          }} style={{width:width/5,height:width/12,borderColor:'black',borderWidth:1,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:width/20,fontFamily:'Andika-R'}}>Done</Text>
            </TouchableOpacity>
            </View>
        )
    }

    function renderMusicCategoryItems({item,index})
    {
        console.log("[EditMusicPreferences] renderMusicCategoryItems - item : ",item);
        console.log("[EditMusicPreferences] musicPreferences[item.musicCategoryName] = ",musicPreferences[item.musicCategoryName])
        return (       
            <View>      
            <MusicCategoryItem item={item} index={index} selected={musicPreferences[item.musicCategoryName]}/>
            </View>
        )
    }

    if(musicCategoriesState.length == 0)
        return (
            <View style={{alignItems:'center',justifyContent:"center",height:height,width:width}}>
            <ActivityIndicator size={'large'} color={'black'}/>
            </View>
        )
    else
        return (
            <View style={{alignItems:'center',marginTop:30, width:width}}>
            <FlatList
                data={musicCategoriesState}
                renderItem={renderMusicCategoryItems}
                numColumns={2}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={renderHeader}
            /> 
            </View>
        )
}

export default withFirebaseHOC(EditMusicPreferences);