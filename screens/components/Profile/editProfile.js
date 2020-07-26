import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Button, SafeAreaView, Dimensions, Image, TextInput, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import ImagePicker from 'react-native-image-picker'
import { Block, Text } from '../categories/components/'
import storage, { firebase, FirebaseStorageTypes } from '@react-native-firebase/storage'
//import firebase from '@react-native-firebase/app';
//import {anthology} from '../../../assets/images'
const { width, height } = Dimensions.get('window');
import { theme, mocks } from '../categories/constants/'
import { withFirebaseHOC } from '../../config/Firebase'
import firestore from '@react-native-firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';
//const sharp = require("sharp");


const options = {
  title: 'Change Profile Picture',
  chooseFromLibraryButtonTitle: 'Select from Library'
};
const editProfile = (props) => {

  const userid = props.firebase._getUid();
  var [editing, setEditing] = useState(null);
  var [loading, setLoading] = useState(false);

  var ProfileImage = useSelector(state => state.userReducer.displayPictureURL);
  var introduction = useSelector(state => state.userReducer.introduction);
  var website = useSelector(state => state.userReducer.website);

  console.log("WEBSITE in redux : ",website);
  var [websiteState, setWebsiteState] = useState(website);
  var [introductionState, setIntroductionState] = useState(introduction);

  const privateDataID = "private" + userid;
  const dispatch = useDispatch();
  const [loadingWebsite,setLoadingWebsite] = useState(false);
  const [loadingIntroduction,setLoadingIntroduction] = useState(false);

  async function addIntroToFirestore(introduction)
  {
    console.log("Inside useEffect - introduction : ",introduction);
    try{
      await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
        introduction:  introduction 
      }, { merge: true })
      setLoadingIntroduction(false);
    }
    catch(error){
      console.log(error);
    }
  }

  async function addWebsiteToFirestore(website)
  {
   try{
    await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
      website:  website 
    }, { merge: true })
    setLoadingWebsite(false);
   }
   catch(error){
     console.log(error);
   }
  }

  useEffect(
     () => {
       setLoadingWebsite(true);
      console.log("Inside useEffect - website : ",website);
      addWebsiteToFirestore(website);
    }, [website]
  )

  useEffect(
     () => {
      setLoadingIntroduction(true);
      addIntroToFirestore(introduction);
    }, [introduction]
  )


  function handleEdit(name, text) {

    console.log("IN Handle Edit --> (name,text) --> (",name,"  ",text,") ");

    switch (name) {
      case 'website':
        console.log("Setting websiteState --> ",text);
        setWebsiteState(text);
        break;
      case 'introduction':
        console.log("Setting introductionState --> ",text);
        setIntroductionState(text.slice(0,150));
    }
  }

  function toggleEdit(name)  {

    console.log("In Toggle Edit -- ");
    console.log("WEBSITE STATE : ",websiteState);
    console.log("INTRODUCTION STATE : ",introductionState);
    console.log("Setting Editing to :",name);

    if(websiteState !== null)
      dispatch({ type: 'CHANGE_WEBSITE', payload: websiteState.trim() });
    if(introductionState !== null)
      dispatch({ type: 'ADD_INTRODUCTION', payload: introductionState.trim() });

    if (!editing)
      setEditing(name);
    else {
      setEditing(null);
    }
  }

  function renderEdit(name) {
    var defaultText = null;
    var defaultValue = null;
    var defaultMultilineValue = null;

    console.log("Inside renderEdit --> ");
    console.log("website in REDUX : ",website);
    console.log("introduction in REDUX : ",introduction);
    console.log("editing Value: ",editing);

    switch (name) {
      case 'website':
        defaultText = website;
        defaultValue = "Enter your website";
        defaultMultilineValue = false;
        break;
      case 'introduction':
        defaultText = introduction;
        defaultValue = "Enter your introduction";
        defaultMultilineValue = true;
    }

    if (editing === name) {

      return (
        <TextInput
          placeholder={defaultValue}
          multiline={defaultMultilineValue}
          autoFocus={true}
          //style={{borderColor:"black",borderWidth:1, borderRadius:3}}
          defaultValue={defaultText}
          onChangeText={text => handleEdit(name, text)}
        />
      )
    }
    else 
    {
      return <Text bold style={{paddingBottom:5}}>{defaultText}</Text>
    }
  }

  async function uploadImage () {
    //[TASK] --> upload images from user's local storage to google cloud storage
    ImagePicker.showImagePicker(options, async (response) => {
      //[IMAGE PICKER] --> ImagePicker picks the response object for any image selected or captured by the user
      console.log('Response URI = ', response.uri);
      console.log('Response PATH = ', response.path);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log("Before storageRef.putFile");

        var referencePath = 'users/' + userid + "_" + moment().format() + '.jpg'; 
        var storageRef = storage().ref(referencePath);

        ImageResizer.createResizedImage(response.path, 400, 400, 'JPEG', 100)
          .then(({path}) => {     
          storageRef.putFile(path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
           .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                console.log("snapshot: " + snapshot.state);
                console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);

                if (snapshot.state === firebase.storage.TaskState.RUNNING) {
                  if(loading != true)
                  {
                    setLoading(true);
                  }
                  console.log("Running");
                }

                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  setLoading(false);
                  console.log("Success");
                }
              },
              error => {
                //unsubscribe();
                console.log("image upload error: " + error.toString());
              },
              () => {

                storageRef.getDownloadURL()
                  .then(async (downloadUrl) => {
                    console.log("File available at: " + downloadUrl);
                    
                    dispatch({ type: 'CHANGE_DISPLAY_PICTURE', payload: downloadUrl })
    
                    const privateDataID = "private" + userid;
                    console.log("privateDataID : ",privateDataID);
                    try{
                      await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
                        displayPicture: downloadUrl
                      }, { merge: true })

                      await firestore().collection('users').doc(userid).set({
                        displayPicture: downloadUrl
                      }, { merge: true })
                    }
                    catch(error){
                      console.log(error)
                    }

                    const instance = firebase.app().functions("asia-northeast1").httpsCallable('changeDPInPodcastsAsiaEast');
                    try 
                    {          
                      await instance({ // change in podcast docs created by  user
                        changedDP : downloadUrl
                      });
                    }
                    catch (e) 
                    {
                      console.log(e);
                    }
                  })
                  .catch(err => {
                    console.log("Error in storageRef.getDownloadURL() in editProfile: ",err);
                  })


              }
           )
        })
        .catch(err => {
          console.log(err);
          return Alert.alert(
            'Unable to resize the photo',
            'Check the console for full the error message',
          );
        });
      }

      return null;
      });
  }

  return (

    <KeyboardAvoidingView style={styles.container} enabled>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView
          keyboardShouldPersistTaps='always'
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 1, paddingBottom: theme.sizes.base * 3 }}
        >

          <View style={styles.AppHeader}>

            <View style={{ paddingLeft: width / 12, paddingVertical: height / 20, flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
                <Icon name="times" size={20} style={{ color: 'black' }} />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'san-serif-light', color: 'black', paddingLeft: (width * 7) / 27, paddingRight: (width * 7) / 30, fontSize: 20 }}>Edit Profile</Text>
            </View>

          </View>

          <View style={{ alignItems: 'center' }}>
            <View style={{ paddingVertical: height / 50, flexDirection: 'column' }}>
              <View>
               {
                  loading ? <ActivityIndicator/> : <TouchableOpacity  onPress={uploadImage}>
                    <Image source={{ uri: ProfileImage }} style={{ width: height / 6, height: height / 6, borderRadius: height / 6, borderColor: 'black',
                    borderWidth: 1 }} />
                    </TouchableOpacity>
               }
              </View>
            </View>

          </View>
          <Block style={styles.inputs}>
          <Block>
              <Text>
            {"\n"}
            </Text>
            </Block>
              <Block row space="between"  style={{ flex:1, fontWeight:'400',borderRadius:10,borderColor:"black",borderWidth:1, backgroundColor:'#dddd',fontSize:15,
              paddingTop: 10, paddingHorizontal: 10 }}>
              <Block>
                <Text style={{ marginBottom: 0 }}>Website</Text>
                {renderEdit('website')}
              </Block>
              <TouchableOpacity onPress={() => toggleEdit('website')}>
              <View>
              {
               loadingWebsite ?  
                 <ActivityIndicator/> :
                 (<Text medium primary>
                 {(editing === 'website' ? 'Save  ' : 'Edit  ')}
                 </Text>)
              }
              </View>
              </TouchableOpacity>
            </Block>
            <Block>
              <Text>
            {"\n"}
            </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={{ flex:1, fontWeight:'400',borderRadius:10,borderColor:"black",borderWidth:1, backgroundColor:'#dddd',fontSize:15,
              paddingTop: 10, paddingHorizontal: 10 }}>
              <Block>
                <Text>Introduction (in less than 150 characters)</Text>
                {renderEdit('introduction')}
              </Block>
              <TouchableOpacity onPress={() => toggleEdit('introduction')}>
              <View>
              {
               loadingIntroduction ?  
                 <ActivityIndicator/> :
                 (<Text medium primary>
                 {(editing === 'introduction' ? 'Save  ' : 'Edit  ')}
                 </Text>)
              }
              </View>
              </TouchableOpacity>
            </Block>
          </Block>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>

  );
}

export default withFirebaseHOC(editProfile);

const styles = StyleSheet.create({
  AppHeader:
  {
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    //justifyContent: 'center',
    // alignItems: 'center',
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
  buttonStyle: {
    padding: 10,
    backgroundColor: '#202646',
    borderRadius: 5
  },
  textStyle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center'
  },
  TextInputStyleClass: {

    //textAlign: 'center',
    fontFamily: 'san-serif-light',
    fontStyle: 'italic',
    color: 'black',
    height: height / 6,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    height: height / 6,
    width: (width * 3) / 4,
    paddingLeft: 10,
    paddingRight: 10

  },
  TextInputStyleClass2: {

    //textAlign: 'center',
    fontFamily: 'san-serif-light',
    fontStyle: 'italic',
    color: 'black',
    borderWidth: 2,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    width: (width * 3) / 4,
    paddingLeft: 10,
    height: height / 18,
    paddingRight: 10,

  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  }
});