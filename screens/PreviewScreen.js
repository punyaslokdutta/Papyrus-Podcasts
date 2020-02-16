import React, { Component, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Button, SafeAreaView, Dimensions, Image,  TextInput, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import storage, { firebase } from '@react-native-firebase/storage'
import { withFirebaseHOC } from './config/Firebase/firebaseApi'
import ImagePicker from 'react-native-image-picker'
import TagInput from 'react-native-tags-input';
import { ScrollView } from 'react-native-gesture-handler';
//import * as Progress from 'react-native-progress';

const { width, height } = Dimensions.get('window');


const options = {
  title: 'Select Podcast Cover',
  chooseFromLibraryButtonTitle: 'Select from Library'
};

const initialTags  ={
  tag: '',
  tagsArray: [], 

}
const PreviewScreen = (props) => {

  const [PodcastImage, setPodcastImage] = useState(null);
  const [ChapterName, setChapterName] = useState(props.navigation.getParam('ChapterName'));
  const [BookName, setBookName] = useState(props.navigation.getParam('BookName'));
  const [AuthorName, setAuthorName] = useState(props.navigation.getParam('AuthorName'));
  const [LanguageSelected, setLanguageSelected] = useState(props.navigation.getParam('LanguageSelected'));
  const [recordedFilePath, setrecordedFilePath] = useState(props.navigation.getParam('recordedFilePath'));
  const [Description, setDescription] = useState(null);
  const [PodcastName, setPodcastName]=useState(null);
  const [Tags, setTags]=useState(initialTags);
  const [tagsColor, settagsColor]=useState('#3ca897');
  const [tagsText, settagsText]=useState('#fff');




  function updateTagState(state){
    setTags(state);
  };




  async function uploadAudio(FilePath) {
    var storageRef = storage().ref('podcasts/audio.m4a');
    console.log("Before storageRef.putFile in uploadAudio ");

    FilePath && storageRef.putFile(FilePath)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {

          console.log("snapshot: " + snapshot.state);
          console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            console.log("Success");

          }
        },
        error => {
          //unsubscribe();
          console.log("image upload error: " + error.toString()); 
        },
        () => {
          storageRef.getDownloadURL()
            .then((downloadUrl) => {
              console.log("File available at: " + downloadUrl);
            })
        }
      )



  }



  async function uploadImage() {


    ImagePicker.showImagePicker(options, async (response) => {
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
        setPodcastImage(source)
        var storageRef = storage().ref('podcasts/10000_5.jpg');


        console.log("Before storageRef.putFile");
        const unsubscribe=storageRef.putFile(response.path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
          .on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
              console.log("snapshot: " + snapshot.state);
              console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);

              if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                console.log("Success");
              }
            },
            error => {
              unsubscribe();
              console.log("image upload error: " + error.toString());
            },
            () => {
              storageRef.getDownloadURL()
                .then((downloadUrl) => {
                  console.log("File available at: " + downloadUrl);
                })
            }
          )

      }
    });
  }

  return (
    
    <ScrollView style={{ flex: 1, backgroundColor: '#101010' }}>
      
    <SafeAreaView style={{ flex: 1, backgroundColor: '#101010' }}>
    
     
      <View style={styles.AppHeader}>
        <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
          <View style={{ paddingLeft: width / 12, paddingVertical: height / 20, flexDirection: 'row' }}>
            <Icon name="times" size={20} style={{ color: 'white' }} />
            <Text style={{ fontFamily: 'san-serif-light', color: 'white', paddingLeft: (width * 7) / 35, fontSize: 20 }}>New Podcast</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center' }}>
        <View style={{ paddingVertical: height / 50, flexDirection: 'column' , paddingBottom:width/10}}>
          <TouchableOpacity onPress={uploadImage}>
          <View>
            <Image source={PodcastImage} style={{ width: height / 6, height: height / 6, borderRadius: 20, borderColor: 'white', borderWidth: 1 }} />
          </View>
          </TouchableOpacity>
        </View>
       
      </View>
    
      
      
      
      
      <View style={{ paddingLeft: width / 8, paddingBottom: 10 }}>
        <TextInput
          style={styles.TextInputStyleClass2}
          underlineColorAndroid="transparent"
          placeholder={"Podcast Title" }
          placeholderTextColor={"black"}
          numberOfLines={1}
          multiline={false}
        />
      </View>
      
      
      
      <View style={{ paddingLeft: width / 8 }}>
        <TextInput
          style={styles.TextInputStyleClass}
          underlineColorAndroid="transparent"
          placeholder={"How should your listeners approach this podcast? " }
          placeholderTextColor={"black"}
          numberOfLines={6}
          multiline={true}
        />
      </View>
      <View style={styles.tagcontainer}>
        <TagInput
          updateState={updateTagState}
          tags={Tags}
          placeholder="Tags.." 
          label='Press comma to add a tag'
          labelStyle={{color: '#fff'}}
          leftElement={<Icon name={'tag'}  color={'#000000'}/>}
          leftElementContainerStyle={{marginLeft: 3}}
          containerStyle={{width:(width * 3) / 4}}
          inputContainerStyle={[styles.textInput, {backgroundColor: 'white'}]}
          tagStyle={styles.tag}
          tagTextStyle={styles.tagText}
          keysForTag={','}
          autoCorrect={false}
          />
      </View>
      
      
      



      <View style={{ paddingTop: height / 8, alignItems: 'center' }}>

        <TouchableOpacity onPress={() => {uploadAudio(recordedFilePath) }} style={{ alignItems: 'center', justifyContent: 'center', height: height / 16, width: height / 6, borderRadius: 15, borderColor: 'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}
        >
          <Text style={{ alignItems: 'center', fontFamily: 'sans-serif-light', color: 'white', justifyContent: 'center' }} >Share</Text>
        </TouchableOpacity>
      </View>





      
    
    </SafeAreaView>
    
    </ScrollView>
    
    
    
   
  );
}

export default PreviewScreen;


const styles = StyleSheet.create({
  AppHeader:
  {
    flexDirection: 'row',
    backgroundColor: '#101010'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container2: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'black',
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
  tagcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  textInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    padding: 3,
  }, 
  tag: {
    backgroundColor: 'grey'
  }, 
  tagText: {
    color: 'black'
  },
  
});