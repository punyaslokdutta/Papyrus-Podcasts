
import React, { useState, useRef, useEffect, useCallback} from 'react';
import { TouchableOpacity,StyleSheet, Text,TextInput,Alert, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EnTypoIcon from 'react-native-vector-icons/Entypo';
import Tooltip from 'react-native-walkthrough-tooltip';
import OpenSettings from 'react-native-open-settings';

import { TagSelect } from 'react-native-tag-select'
import { useDispatch, useSelector} from 'react-redux'
import { theme } from '../categories/constants';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import storage, { firebase, FirebaseStorageTypes } from '@react-native-firebase/storage'
import {withFirebaseHOC} from '../../config/Firebase';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import modalJSON2 from '../../../assets/animations/modal-animation-2.json';
import LottieView from 'lottie-react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();
const { width, height } = Dimensions.get('window');
const addPictureImage = 'https://storage.googleapis.com/papyrus-274618.appspot.com/flips/InsertImageFLip.png';
const AddFlipScreen = (props)=> {
      
    const dispatch = useDispatch();
    const [flipImages,setFlipImages] = useState([]);
    const [flipText,setFlipText] = useState("");
    const [flipTitle,setFlipTitle] = useState("");
    const [uploadedImage,setUploadedImageURL] = useState("");
    const [selectedIndex,setSelectedIndex] = useState(-1);
    const [loadingImage, setLoadingImage] =useState(false);
    const [isModalVisible,setIsModalVisible] = useState(false);
    const [toolTipPictureVisible,setToolTipPictureVisible] = useState(false);
    const [toolTipDescriptionVisible,setToolTipDescriptionVisible] = useState(false);
    const [toolTipTitleVisible,setToolTipTitleVisible] = useState(false);

    const name = useSelector(state=>state.userReducer.name);
    const displayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
    const addFlipWalkthroughDone = useSelector(state=>state.userReducer.addFlipWalkthroughDone);

    const [toolTipFlipVisible,setToolTipFlipVisible] = useState(!addFlipWalkthroughDone);

    const userID = props.firebase._getUid();
    const privateUserID = "private" + userID;
    //const dispatch = 

    useEffect(() => {
      setFlipImages([addPictureImage]);  
    },[])

    useEffect(() => {
      setToolTipFlipVisible(!addFlipWalkthroughDone);
    },[addFlipWalkthroughDone])

    useEffect(() => {
        if(uploadedImage !== null && uploadedImage!== undefined && uploadedImage.length>0)
        {
            var localFlipImages = flipImages;
            localFlipImages[flipImages.length - 1] = uploadedImage;
            localFlipImages.push(addPictureImage);
            setSelectedIndex(localFlipImages.length-2);
            setFlipImages(localFlipImages);
        }
    },[uploadedImage])

    function renderSelectedImage() {
        return (
            <View style={{borderWidth:0,borderColor:'white',width:width,height:width,alignItems:'center',justifyContent:'center'}}>
            <Image 
                source={{uri:flipImages[selectedIndex]}}
                style={{borderWidth:1,borderColor:'white',backgroundColor:'#dddd', width:width-10,height:width*2/2}}/>
            
            </View>
        )
    }

    async function validateAndAddFlipToFirestore(){
      if(flipImages.length == 1)
      {
        alert('Please add a picture for your flip');
        return;
      }

      if(flipText.length == 0)
      {
        alert('Please describe your flip');
        return;
      }

      if(flipTitle.length == 0)
      {
        alert('Please provide a title for your flip');
        return;
      }
      
      setIsModalVisible(true);

      // try{
      //   firestore().collection('flips').add({
      //     flipDescription : flipText,
      //     flipPictures : flipImages.slice(0,flipImages.length - 1),
      //     creatorID : userID,
      //     creatorName : name,
      //     creatorPicture : displayPictureURL,
      //     createdOn : moment().format() 
      //   }).then((docRef) => {
      //     console.log('Text Flip added to firestore with ID',docRef.id);
      //     firestore().collection('flips').doc(docRef.id).set({
      //       flipID : docRef.id
      //     },{merge:true});
      //     Toast.show('Flip posted successfully');
      //   }).catch((err) => {
      //     console.log("Error in adding text flip to firestore :- ",err)
      //     alert('Failed to post flip !!!');
      //   });
      // }
      // catch(error){
      //   console.log(err);
      // } 
      // finally{
      //   setFlipImages([addPictureImage]);
      //   setFlipText("");
      //   props.navigation.navigate('HomeScreen');

      // }
      

    }

    async function setAddFlipWalkthroughInFirestore() {
      firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
        addFlipWalkthroughDone : true
      },{merge:true}).then(() => {
          console.log("AddFlipWalkthrough set in firestore successfully");       
      }).catch((error) => {
          console.log("Error in updating value of AddFlipWalkthrough in firestore");
      })
    }


    function deleteFlipImageIndex(index) {
        console.log("In deleteFlipImageIndex")
        var localFlipImages = flipImages;
        localFlipImages.splice(index,1);
        setFlipImages(localFlipImages);
        setSelectedIndex(selectedIndex-1);
    }

    async function addFlipToFirestore() {
      try{
        firestore().collection('flips').add({
          flipDescription : flipText,
          flipPictures : flipImages.slice(0,flipImages.length - 1),
          creatorID : userID,
          creatorName : name,
          creatorPicture : displayPictureURL,
          createdOn : moment().format() 
        }).then((docRef) => {
          console.log('Text Flip added to firestore with ID',docRef.id);
          firestore().collection('flips').doc(docRef.id).set({
            flipID : docRef.id
          },{merge:true});
          Toast.show('Flip posted successfully');
        }).catch((err) => {
          console.log("Error in adding text flip to firestore :- ",err)
          alert('Failed to post flip !!!');
        });
      }
      catch(error){
        console.log(err);
      } 
      finally{
        setFlipImages([addPictureImage]);
        setFlipText("");
        props.navigation.navigate('HomeScreen');
      }    
    }

    function renderModal() {
      return (
        
        <Modal isVisible={isModalVisible} backdropColor={'white'} style={{backgroundColor:'while'}}>
          <View style={{ backgroundColor:'white',height:width*3/4,borderRadius:10,borderWidth:0.5,borderColor:'black', width:width*3/4,alignSelf:'center' }}>
            <TouchableOpacity style={{ position:'absolute',right:5,top:0 }} onPress={() => setIsModalVisible(false)}>
            <Icon name="times-circle" size={24}/> 
            </TouchableOpacity>
            <LottieView style={{
        width:width/2,paddingLeft:width*3/25,paddingTop:10}} source={modalJSON2} autoPlay loop />
            <View style={{justifyContent:'center',alignItems:'center',textAlign:'center'}}>
              <Text style={{marginHorizontal:5,paddingHorizontal:5,borderWidth:1,borderColor:'#dddd', fontFamily:'Montserrat-SemiBold',fontSize:20,backgroundColor:'white',alignSelf:'center'}}> Add audio to your flip? </Text>
              </View>
              {/* <View style={{alignItems:'center'}}>
                <Text style={{fontSize:30}}> OR </Text>
                </View> */}
                <View style={{position:'absolute',width:width*3/4,bottom:5,flexDirection:'column',alignItems:'center',textAlign:'center',justifyContent:'center'}}>
                 <TouchableOpacity onPress={() => {
                  setIsModalVisible(false);
                  props.navigation.navigate('FlipPreviewScreen',{
                    flipPictures : flipImages.slice(0,flipImages.length-1),
                    flipDescription : flipText,
                    flipTitle : flipTitle,
                    audioFlip : true
                  }); 
                }}
                style={{width:width*3/4,backgroundColor:'#dddd'}}>
                <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:18,backgroundColor:'#dddd',alignSelf:'center'}}> Yes </Text>
                </TouchableOpacity>
                <View style={{height:4}}/>
                <TouchableOpacity onPress={() => {
                  setIsModalVisible(false);
                  props.navigation.navigate('FlipPreviewScreen',{
                    flipPictures : flipImages.slice(0,flipImages.length-1),
                    flipDescription : flipText,
                    flipTitle : flipTitle,
                    audioFlip : false
                  });
                  //addFlipToFirestore();
                }}
                style={{width:width*3/4,backgroundColor:'#dddd'}}>
                <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:18,backgroundColor:'#dddd',alignSelf:'center'}}> No </Text>
                </TouchableOpacity>
                </View>
          </View>
        </Modal>
      )
    }

    function renderAllImages() {
        return (
            <ScrollView 
            horizontal={true}
            >
                {
                   flipImages.map((item, index)=> {
                       if(index == selectedIndex)
                        return(
                            <TouchableOpacity style={{width:width/3,height:width/3,marginHorizontal:10}}>
                            
                            <Image 
                                style={{width:width/3,height:width/3,backgroundColor:'#dddd',borderWidth:2,borderColor:'blue'}}
                                source={{uri:item}}/>
                                <TouchableOpacity 
                                onPress={() => {
                                    deleteFlipImageIndex(index);
                                }}
                                style={{position:'absolute',top:5,right:5}}>
                            <EnTypoIcon name="circle-with-cross" size={25} color='white'/>
                            </TouchableOpacity>
                            </TouchableOpacity>
                        )
                       else if(index != flipImages.length - 1)
                        return (
                            <TouchableOpacity style={{width:width/3,height:width/3,marginHorizontal:10}} 
                              onPress={() => {
                                console.log("Image pressed")
                                    setSelectedIndex(index);
                            }}>
                            <Image
                                style={{width:width/3,height:width/3,backgroundColor:'#dddd',borderWidth:1,borderColor:'white'}} 
                                source={{uri:item}}/>
                                <TouchableOpacity 
                                onPress={() => {
                                    deleteFlipImageIndex(index);
                                }}
                                style={{position:'absolute',top:5,right:5}}>
                                <EnTypoIcon name="circle-with-cross" size={25} color='white'/>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )
                       else
                        return (
                            <TouchableOpacity 
                              onPress={() => {
                                console.log("last image pressed");
                                !loadingImage && uploadImage();
                            }}
                            style={{justifyContent:'center',alignItems:'center',borderColor:'white',borderWidth:1}}>
                                {
                                  //https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg
                                    !loadingImage
                                    ?
                                    <Tooltip
                                      isVisible={toolTipPictureVisible}
                                      content={<View style={{width:width/2}}>
                                      <Image source={{uri:"https://storage.googleapis.com/papyrus-274618.appspot.com/walkthrough/Book-Notes.jpg"}}
                                              style={{height:width/2,width:width/2}}/>
                                      <Text style={{fontFamily:"Montserrat-SemiBold"}}>Add Picture to your flip</Text>
                                      </View>}
                                      onClose={() => {
                                        setToolTipPictureVisible(false);
                                        setToolTipTitleVisible(true);
                                        //setToolTipDescriptionVisible(true);
                                      }}
                                    >
                                    <Image
                                        style={{width:width/3,height:width/3,backgroundColor:'#dddd',borderWidth:1,borderColor:'white',marginHorizontal:10}} 
                                        source={{uri:item}}/> 
                                    </Tooltip>
                                    :
                                    <ActivityIndicator color='black ' size='large' style={{marginVertical:width/8,marginHorizontal:width/8}}/>
                                }
                                  
                            </TouchableOpacity>    
                        )
                    }) 
                }
            </ScrollView>
        )
    }

    async function uploadImage() {

        try{
          ImagePicker.showImagePicker(async (response) => {
            console.log('Response URI = ', response.uri);
            console.log('Response PATH = ', response.path);
      
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
              if(response.error == "Permissions weren't granted")
              {
                Alert.alert(  
                  'Papyrus needs access to your camera and/or storage.',  
                  '',  
                  [  
                      {  
                          text: 'Cancel',  
                          onPress: () => console.log('Cancel Pressed'),  
                          style: 'cancel',  
                      },  
                      {
                          text: 'OK', onPress: () => {
                          OpenSettings.openSettings()
                          console.log('OK Pressed')
                      }},  
                  ]  
              ); 
              }
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = { uri: response.uri };
              console.log("Before storageRef.putFile");
              //console.log("response : ",response);

              //setImageFromURL(false);
              //setPodcastImage(source);
              setLoadingImage(true);
              //filename.split('.').pop();
              var refPath = "flips/images/" + userID + "_" + moment().format() + ".jpg";
              if(response.path.split('.').pop() == "gif")
              {
                if(((response.fileSize/1024)/1024) > 1)
                {
                  setLoadingImage(false);
                  alert("Please upload a GIF file within 1 MB");
                  return;
                }
                refPath = "flips/gifs/" + userID + "_" + moment().format() + ".gif";
                var storageRef = storage().ref(refPath);

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
                        setUploadedImageURL(downloadUrl);
                        setLoadingImage(false);
                      })
                      .catch(err => {
                        console.log("Error in storageRef.getDownloadURL() in uploadImage in PreviewScreen: ",err);
                      })
                  }
                )
              }
              else
              {
                var storageRef = storage().ref(refPath);
                console.log("Before storageRef.putFile");
                console.log("[AddFlipScreen] response.path : ",response.path);
                ImageResizer.createResizedImage(response.path, 720, 720, 'JPEG',100)
              .then(({path}) => {
        
                const unsubscribe=storageRef.putFile(path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
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
                          setUploadedImageURL(downloadUrl);
                          setLoadingImage(false);
                        })
                        .catch(err => {
                          console.log("Error in storageRef.getDownloadURL() in uploadImage in PreviewScreen: ",err);
                        })
                    }
                  )
                  });
              }  
              }
          });
        }
        catch(error){
          console.log("Resizing & Uploading Podcast Image Error: ",error);
        }
      }

    return (
        <SafeAreaView style={{flex:1, backgroundColor:'#FFFFFF',marginTop:STATUS_BAR_HEIGHT}}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
        <View style={{backgroundColor:'#101010',paddingHorizontal:10, paddingVertical:height/50, flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <TouchableOpacity onPress={()=>props.navigation.goBack(null)}>
            <Icon name="arrow-left" size={20} style={{color:'white'}}/>
        </TouchableOpacity>
        <View>
        <Tooltip
          isVisible={toolTipFlipVisible}
          content={<View style={{width:width/1.5,alignItems:'center',justifyContent:"center",}}>
          <Text style={{fontSize:25,fontFamily:'Montserrat-Bold'}}>Flips</Text>
          <Text style={{fontSize:20,fontFamily:'Montserrat-Regular'}}> Flips are like notes that you make while reading books. You can also make audio flips which are basically 140-second podcasts. </Text>
          </View>}
          placement="bottom"
          onClose={() => {
            setToolTipFlipVisible(false);
            setToolTipPictureVisible(true);
          }}
        >
        <Text style={{fontFamily:'Montserrat-Regular', color:'white', fontSize:20}}>Create Flip</Text>
        </Tooltip>
        </View>
        <TouchableOpacity onPress={() =>{
          //renderModal()
          validateAndAddFlipToFirestore();
        }}>
          <Text style={{backgroundColor :'white',color:'black',fontSize:20,paddingHorizontal:10,borderRadius:3,fontFamily:'Montserrat-SemiBold'}}>Next</Text>
          </TouchableOpacity>
        </View>
        {renderSelectedImage()}
        <View style={{height:30}}/>
        {renderModal()}

        {renderAllImages()}
        <View style={{paddingHorizontal:5}}>
        <Tooltip
          isVisible={toolTipTitleVisible}
          content={<View style={{width:width/2}}>
          <Image source={{uri:"https://storage.googleapis.com/papyrus-274618.appspot.com/walkthrough/title-walkthrough.jpg"}}
                  style={{height:width/2,width:width/2}}/>
          <Text style={{fontFamily:"Montserrat-SemiBold"}}>Add Title to your flip</Text>
          </View>}
          onClose={() => {
            setToolTipTitleVisible(false);
            setToolTipDescriptionVisible(true);
          }}
        >
        <TextInput
          value={flipTitle}
          style={{fontFamily:'Montserrat-SemiBold',fontWeight:'normal',fontSize:20,borderWidth:0.5,borderColor:'black'}}
          underlineColorAndroid="transparent"
          placeholder={"Title"}
          placeholderTextColor={"gray"}
          //numberOfLines={6}
          multiline={false}
          onChangeText={(text) => {
              setFlipTitle(text.slice(0,150))
          }}/>
          </Tooltip>
        </View>
        <View style={{paddingHorizontal:5}}>
        <Tooltip
          isVisible={toolTipDescriptionVisible}
          content={<View style={{width:width/2}}>
            <Image source={{uri:"https://storage.googleapis.com/papyrus-274618.appspot.com/walkthrough/tell-a-story-flip.jpg"}}
                    style={{height:width/2,width:width/2}}/>
            <Text style={{fontFamily:"Montserrat-SemiBold",fontSize:20}}>Tell us a story about your flip</Text>
            </View>}
          onClose={() => {
            setToolTipDescriptionVisible(false);
            dispatch({type:"SET_ADD_FLIP_WALKTHROUGH",payload:true});
            setAddFlipWalkthroughInFirestore();
          }}
        >
        <TextInput
          value={flipText}
          style={{fontFamily:'Montserrat-Regular',fontSize:20}}
          underlineColorAndroid="transparent"
          placeholder={"Tell us a story (use # for tags)"}
          placeholderTextColor={"gray"}
          //numberOfLines={6}
          multiline={true}
          onChangeText={(text) => {
              setFlipText(text.slice(0,3000))
          }}/> 
        </Tooltip>
        </View>
        </ScrollView>
        </SafeAreaView> 
       
    );
    
  }

export default withFirebaseHOC(AddFlipScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding:10,
    backgroundColor: '#202646',
    borderRadius:5
    },
    textStyle: {
      fontSize:20,
    color: '#ffffff',
    textAlign: 'center'
    },
    item: {
      borderWidth: 1,
      borderColor: '#333',    
      backgroundColor: 'transparent'
    },
    label: {
      color: 'white',
      fontSize:12
    },
    itemSelected: {
      backgroundColor: '#333',
    },
    labelSelected: {
      color: '#FFF',
    },
    AppHeader:
  {
 flexDirection:'row',
 backgroundColor: '#101010'
  },
});

