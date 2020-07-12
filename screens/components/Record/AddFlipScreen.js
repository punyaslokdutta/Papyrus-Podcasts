
import React, { useState, useRef, useEffect, useCallback} from 'react';
import { TouchableOpacity,StyleSheet, Text,TextInput, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EnTypoIcon from 'react-native-vector-icons/Entypo';
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
import modalJSON from '../../../assets/animations/modal-microphone.json';
import modalJSON2 from '../../../assets/animations/modal-animation-2.json';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');
const addPictureImage = 'https://storage.googleapis.com/papyrus-274618.appspot.com/icons8-add-image-64.png';
const AddFlipScreen = (props)=> {
      
    const [flipImages,setFlipImages] = useState([]);
    const [flipText,setFlipText] = useState("");
    const [uploadedImage,setUploadedImageURL] = useState("");
    const [selectedIndex,setSelectedIndex] = useState(-1);
    const [loadingImage, setLoadingImage] =useState(false);
    const [isModalVisible,setIsModalVisible] = useState(false);

    const name = useSelector(state=>state.userReducer.name);
    const displayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);

    const userID = props.firebase._getUid();;
    //const dispatch = 

    useEffect(() => {
      setFlipImages([addPictureImage]);  
    },[])

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
          <View style={{ backgroundColor:'white',height:width,borderRadius:10,borderWidth:0.5,borderColor:'black', width:width*3/4,alignSelf:'center' }}>
            <TouchableOpacity style={{ position:'absolute',right:5,top:0 }} onPress={() => setIsModalVisible(false)}>
            <Icon name="times-circle" size={24}/> 
            </TouchableOpacity>
            <LottieView style={{
        width:width/2,paddingLeft:width*3/25,paddingTop:10}} source={modalJSON2} autoPlay loop />
            <View style={{justifyContent:'center',alignItems:'center',textAlign:'center'}}>
              <Text style={{marginHorizontal:5,paddingHorizontal:5,borderWidth:1,borderColor:'#dddd', fontFamily:'Andika-R',fontSize:25,backgroundColor:'white',alignSelf:'center'}}> Add audio to your flip? </Text>
              </View>
              {/* <View style={{alignItems:'center'}}>
                <Text style={{fontSize:30}}> OR </Text>
                </View> */}
                <View style={{marginTop:width/6,flexDirection:'column'}}>
                 <View style={{borderBottomWidth:0.25,width:width*3/4}}/> 
                <Text style={{fontFamily:'Andika-R',fontSize:18,backgroundColor:'white',alignSelf:'center'}}> Yes </Text>
                <View style={{borderWidth:0.25,width:width*3/4}}/> 
                <TouchableOpacity onPress={() => {
                  setIsModalVisible(false);
                  props.navigation.navigate('FlipPreviewScreen',{
                    flipPictures : flipImages.slice(0,flipImages.length-1),
                    flipDescription : flipText
                  });
                  //addFlipToFirestore();
                }}>
                <Text style={{fontFamily:'Andika-R',fontSize:18,backgroundColor:'white',alignSelf:'center'}}> No </Text>
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
                                    !loadingImage
                                    ?
                                    <Image
                                        style={{width:width/3,height:width/3,backgroundColor:'#dddd',borderWidth:1,borderColor:'white',marginHorizontal:10}} 
                                        source={{uri:item}}/> 
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
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = { uri: response.uri };
              console.log("Before storageRef.putFile");
              //setImageFromURL(false);
              //setPodcastImage(source);
              setLoadingImage(true);
              var refPath = "flips/images/" + userID + "_" + moment().format() + ".jpg";
              var storageRef = storage().ref(refPath);
              console.log("Before storageRef.putFile");
      
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
          });
        }
        catch(error){
          console.log("Resizing & Uploading Podcast Image Error: ",error);
        }
      }

    return (
        <SafeAreaView style={{flex:1, backgroundColor:'#FFFFFF',}}>
        <ScrollView >
        <View style={{backgroundColor:'#101010',paddingHorizontal:10, paddingVertical:height/50, flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <TouchableOpacity onPress={()=>props.navigation.goBack(null)}>
            <Icon name="arrow-left" size={20} style={{color:'white'}}/>
        </TouchableOpacity>
        <View>
        <Text style={{fontFamily:'Montserrat-Regular', color:'white', fontSize:20}}>Add Flip</Text>
        </View>
        <TouchableOpacity onPress={() =>{
          //renderModal()
          validateAndAddFlipToFirestore();
        }}>
          <Text style={{backgroundColor :'white',color:'black',fontSize:20,paddingHorizontal:10,borderRadius:3,fontFamily:'Montserrat-Medium'}}>Next</Text>
          </TouchableOpacity>
        </View>
        {renderSelectedImage()}
        <View style={{height:30}}/>
        {renderModal()}

        {renderAllImages()}
        <View style={{paddingHorizontal:5}}>
        <TextInput
          value={flipText}
          style={{fontFamily:'Montserrat-Regular',fontSize:20}}
          underlineColorAndroid="transparent"
          placeholder={"Tell us a story (use # for tags)"}
          placeholderTextColor={"gray"}
          //numberOfLines={1}
          multiline={true}
          onChangeText={(text) => {
              setFlipText(text.slice(0,1000))
          }}/> 
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

