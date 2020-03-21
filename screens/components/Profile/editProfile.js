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
  
  async function addIntroToFirestore(introduction)
  {
    console.log("Inside useEffect - introduction : ",introduction);
    await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
      introduction:  introduction 
    }, { merge: true })
  }

  async function addWebsiteToFirestore(website)
  {
   // console.log("Inside useEffect - website : ",{website});
    await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
      website:  website 
    }, { merge: true })
  }

  useEffect(
     () => {
      console.log("Inside useEffect - website : ",website);
      addWebsiteToFirestore(website);
    }, [website]
  )

  useEffect(
     () => {
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
        setIntroductionState(text);
    }
  }

  function toggleEdit(name)  {


    console.log("In Toggle Edit -- ");
    console.log("WEBSITE STATE : ",websiteState);
    console.log("INTRODUCTION STATE : ",introductionState);
    console.log("Setting Editing to :",name);
    dispatch({ type: 'CHANGE_WEBSITE', payload: websiteState });
    dispatch({ type: 'ADD_INTRODUCTION', payload: introductionState });

    if (!editing)
      setEditing(name);
    else {
      setEditing(null);
    }
  }

  function renderEdit(name) {
    var defaultText = null;
    console.log("Inside renderEdit --> ");
    console.log("website in REDUX : ",website);
    console.log("introduction in REDUX : ",introduction);
    console.log("editing Value: ",editing);

    switch (name) {
      case 'website':
        defaultText = website;
        break;
      case 'introduction':
        defaultText = introduction;
    }

    if (editing === name) {

      return (
        <TextInput
          defaultValue={defaultText}
          onChangeText={text => handleEdit(name, text)}
        />
      )
    }
    else 
    {
      return <Text bold>{defaultText}</Text>
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

       // var storageRef_680 = storage().ref('books/10000_5_680x680.jpg');
        var referencePath = 'users/' + userid + "/" + userid + "_" + Date.now() + '.jpg'; 
        var storageRef = storage().ref(referencePath);

        ImageResizer.createResizedImage(response.path, 400, 400, 'JPEG', 100)
      .then(({path}) => {
          //setResizedImagePath(uri);
     
          const unsubscribe = storageRef.putFile(path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
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
              unsubscribe();
              console.log("image upload error: " + error.toString());
            },
            () => {

              storageRef.getDownloadURL()
                .then(async (downloadUrl) => {
                  console.log("File available at: " + downloadUrl);
                  
                  dispatch({ type: 'CHANGE_DISPLAY_PICTURE', payload: downloadUrl })
  
                  const privateDataID = "private" + userid;
                  console.log("privateDataID : ",privateDataID);
                  await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
                    displayPicture: downloadUrl
                  }, { merge: true })
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

        console.log("Before storageRef.putFile");
        // try{
        // await sharp(response.path).resize({ width: 682 }).toFile('./temp_image.jpg');
        // }
        // catch(error)
        // {
        //   console.log(error);
        // }
        

      }

      return null;
    });
  }

  // uploadImage = async () =>
  // {
  

  //   ImagePicker.showImagePicker(options, async(response) => {
  //     console.log('Response URI = ', response.uri);
  //     console.log('Response PATH = ', response.path);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //     } else {
  //       const source = { uri: response.uri };
  //      console.log("Before storageRef.putFile");
  //      this.setState({
  //       ProfileImage: source,
  //     });
  //        var storageRef = storage().ref('books/10000_5.jpg');


  //         console.log("Before storageRef.putFile");
  //        storageRef.putFile(response.path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
  //        .on(
  //            firebase.storage.TaskEvent.STATE_CHANGED,
  //          snapshot => {
  //            console.log("snapshot: " + snapshot.state);
  //            console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
   
  //            if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
  //              console.log("Success");
  //            }
  //          },
  //          error => {
  //            unsubscribe();
  //            console.log("image upload error: " + error.toString());
  //          },
  //          () => {
  //            storageRef.getDownloadURL()
  //              .then((downloadUrl) => {
  //                console.log("File available at: " + downloadUrl);
  //              })
  //          }
  //        )
       
  //     }
  //   });
  // }
   
  return (

    <KeyboardAvoidingView style={styles.container} enabled>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 1, paddingBottom: theme.sizes.base * 3 }}
        >

          <View style={styles.AppHeader}>

            <View style={{ paddingLeft: width / 12, paddingVertical: height / 20, flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
                <Icon name="times" size={20} style={{ color: 'black' }} />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'san-serif-light', color: 'black', paddingLeft: (width * 7) / 35, paddingRight: (width * 7) / 30, fontSize: 20 }}>Edit Profile</Text>
              <TouchableOpacity >
                <Icon name="check" size={20} style={{ color: 'black' }} />
              </TouchableOpacity>
            </View>

          </View>

          <View style={{ alignItems: 'center' }}>
            <View style={{ paddingVertical: height / 50, flexDirection: 'column' }}>
              <View>
               {loading ? <ActivityIndicator/> : <Image source={{ uri: ProfileImage }} style={{ width: height / 6, height: height / 6, borderRadius: height / 6, borderColor: 'black', borderWidth: 1 }} />}
              </View>


              <View style={{ paddingTop: width / 15 }}>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: height / 16, width: height / 6, borderRadius: 15, borderColor: 'black', borderWidth: 1 }}
                  onPress={uploadImage} >
                  <Text style={{ alignItems: 'center', fontFamily: 'sans-serif-light', color: 'black', justifyContent: 'center' }} >Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
          <Block style={styles.inputs}>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Website</Text>
                {renderEdit('website')}
              </Block>
              <Text medium primary onPress={() => toggleEdit('website')}>
                {editing === 'website' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>introduction</Text>
                {renderEdit('introduction')}
              </Block>
              <Text medium primary onPress={() => toggleEdit('introduction')}>
                {editing === 'introduction' ? 'Save' : 'Edit'}
              </Text>
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