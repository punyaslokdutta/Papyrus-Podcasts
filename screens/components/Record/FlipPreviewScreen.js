import React, { useState, useRef, useEffect, useCallback} from 'react';
import { TouchableOpacity,StyleSheet,Animated, Text,TextInput, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter, ActivityIndicator} from 'react-native';
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
import { set } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const addPictureImage = 'https://storage.googleapis.com/papyrus-274618.appspot.com/icons8-add-image-64.png';
const FlipPreviewScreen = (props)=> {
          
  var scrollX = new Animated.Value(0);

  const [publishLoading,setPublishLoading] = useState(false);
  const [previewHeaderText,setPreviewHeaderText] = useState("Create Flip");
  const [bookName,setBookName] =useState("");
  const [flipDescription,setFlipDescription] = useState(props.navigation.state.params.flipDescription);
  const name = useSelector(state=>state.userReducer.name);
  const displayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);

  const userID = props.firebase._getUid();

  useEffect(() => {
    props.navigation.state.params.bookName !== undefined &&
    setBookName(props.navigation.state.params.bookName) &&
    setPreviewHeaderText("Edit Flip");
  },[])

  async function validateAndAddFlipToFirestore(){
    if(props.navigation.state.params.flipPictures.length == 0)
    {
      alert('Please add a picture for your flip');
      return;
    }

    if(flipDescription.length == 0)
    {
      alert('Please describe your flip');
      return;
    }

    if(bookName.length == 0)
    {
      alert('Please provide a book related to your flip');
      return;
    }

    try{
      if(props.navigation.state.params.editing === true){
        firestore().collection('flips').doc(props.navigation.state.params.flipID).set({
          flipDescription : flipDescription,
          flipPictures : props.navigation.state.params.flipPictures,
          bookName : bookName,
          lastEditedOn : moment().format() 
        },{merge:true}).then(() => {
          Toast.show('Flip edited successfully');
        }).catch((err) => {
          console.log("Error in editing text flip in firestore :- ",err)
          alert('Failed to post edited flip !!!');
        });
      }
      else{
        firestore().collection('flips').add({
          flipDescription : flipDescription,
          flipPictures : props.navigation.state.params.flipPictures,
          creatorID : userID,
          creatorName : name,
          bookName : bookName,
          creatorPicture : displayPictureURL,
          createdOn : moment().format(),
          lastEditedOn : moment().format(),
          numUsersLiked : 0
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
      }
      catch(error){
        console.log(error);
      } 
      finally{
        props.navigation.navigate('HomeScreen');
      }
  }

  function renderPublishText(){
    if(publishLoading == true)
      return <ActivityIndicator color='black'/>;
    else
      return(
        <TouchableOpacity onPress={() => {
          validateAndAddFlipToFirestore();
        }}>
        <Text style={{ fontFamily:'Montserrat-Regular', borderRadius:10,textAlignVertical: 'center',padding:8,backgroundColor:'black',color:'white',fontSize:15 }} >Publish</Text>
        </TouchableOpacity>
      ) 
  }

  function renderDots () {
    const dotPosition = Animated.divide(scrollX, width);
    return (
      <View style={[ styles.flex, styles.row, styles.dotsContainer ]}>
        {props.navigation.state.params.flipPictures && 
        props.navigation.state.params.flipPictures.map((item, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp'
          });
          return (
            <Animated.View
              key={`step-${item}-${index}`}
              style={[styles.dots, styles.activeDot,{ opacity }]}
            />
          )
        })}
      </View>
    )
  }

    return (
      <ScrollView style={{backgroundColor:'white'}}>
        <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center',paddingHorizontal:10,paddingVertical:5}}>
        <TouchableOpacity onPress={() => {
        props.navigation.goBack(null)
      }}>
      <Icon name="arrow-left" size={20} style={{color:'black'}}/>
      </TouchableOpacity>
      <View>
      <Text style={{ fontFamily: 'Montserrat-Regular', color: 'black',paddingBottom:5, fontSize: 20 }}>
        {previewHeaderText}</Text>
        </View>
        {renderPublishText()}  

          </View>
        <ScrollView
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.998}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }])}
            useNativeDriver={true}
        >
        {
            props.navigation.state.params.flipPictures && 
            props.navigation.state.params.flipPictures.map((img, index) => 
            
            <Image
              key={`${index}-${img}`}
              source={{ uri: img }}
              resizeMode='cover'
              style={{ width:width, height: width }}
            />
            
          )
        }
        </ScrollView>
        <View>
          {
            props.navigation.state.params.flipPictures.length > 1 &&
            renderDots()
          }
          </View>
          <View style={{marginTop:20,alignItems:'center',justifyContent:'center'}} >
            <TextInput
              style={styles.TextInputStyleClass2}
              placeholder={"Which book is this flip related to?"}
              placeholderTextColor={"gray"}
              value={bookName}
              underlineColorAndroid="transparent"
              onChangeText={(text) => {
                setBookName(text);
              }}
              multiline={true}
              numberOfLines={2}
            />
            </View>
            <View style={{marginTop:20,alignItems:'center',justifyContent:'center'}}>
              <TextInput
              style={styles.TextInputStyleClass}
              underlineColorAndroid="transparent"
              //placeholder={"How should your listeners approach this podcast?" }
              //placeholderTextColor={"gray"}
              value={flipDescription}
              onChangeText={(text) => {
                setFlipDescription(text.slice(0,1000));
              }}
              multiline={true}
              numberOfLines={6}
                />
              </View>
      </ScrollView>        
    )
}

export default withFirebaseHOC(FlipPreviewScreen);


const styles = StyleSheet.create({
  flex:{
    flex:0,
  },
  row: {
    flexDirection: 'row'
  },

  TextInputStyleClass: {

    //textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    //fontStyle: 'italic',
    color: 'black',
    height: height / 6,
    paddingBottom:10,
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 3,
    backgroundColor: "white",
    height: height / 6,
    width: (width * 5) / 6,
    paddingLeft: 10,
    paddingRight: 10

  },
  TextInputStyleClass2: {

    //textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    //fontStyle: 'italic',
    fontSize: 17,
    color: 'black',
    borderWidth: 1,
    paddingTop:0,
    marginTop:0,
    paddingBottom:0,
    marginBottom:0,
    borderColor: '#9E9E9E',
    borderRadius: 3,
    backgroundColor: "white",
    width: (width * 5) / 6,
    paddingLeft: 10,
    //height: height / 18,
    paddingRight: 10
  }, 
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
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  dots: {
    width: 5,
    height: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
    borderColor: 'transparent',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 6.25,
    borderColor: theme.colors.active,
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

