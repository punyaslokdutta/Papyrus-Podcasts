
import React, { useState, useRef, useEffect, useCallback} from 'react';
import { TouchableOpacity,StyleSheet, Text, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { TagSelect } from 'react-native-tag-select'
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector} from 'react-redux'
import { theme } from '../categories/constants';
import { ScrollView } from 'react-native-gesture-handler';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import ToggleSwitch from 'toggle-switch-react-native';
import LottieView from 'lottie-react-native';
import newAnimation from '../../../assets/animations/lf30_editor_f5ahjf.json'
import Tooltip from 'react-native-walkthrough-tooltip';
import {withFirebaseHOC} from '../../config/Firebase';


const { width, height } = Dimensions.get('window');
const data = [
  { id: 1, label: 'English' },
  { id: 2, label: 'Hindi' },
  { id: 3, label: 'Bengali' },
  { id: 4, label: 'Marathi' },
  { id: 5, label: 'Telugu' },
  { id: 6, label: 'Tamil' },
  { id: 7, label: 'Gujarati' },
  { id: 8, label: 'Urdu' },
  { id: 9, label: 'Kannada' },
  { id: 10, label: 'Odiya' },
  { id: 11, label: 'Malayalam'},
  { id: 12, label: 'Punjabi'},
  { id: 13, label: 'Assamese'},
  { id: 14, label: 'Nepali'},

  { id: 15, label: 'Mandarin'},
  { id: 16, label: 'Spanish'},
  { id: 17, label: 'Arabic'},
  { id: 18, label: 'Malay'},
  { id: 19, label: 'Russian' },
  { id: 20, label: 'Portuguese' },
  { id: 21, label: 'French' },
];

const AddBookReviewScreen = (props)=> {

  const animation = useRef();
  var [isBookPodcast,setIsBookPodcast] = useState(true);
  const [bookOpacity,setBookOpacity] = useState(1);
  const [originalOpacity,setOriginalOpacity] = useState(0.5);
  var itemSelected = null;
  var itemPictureURL = null;
  var genres = null;
  const userLanguages = useSelector(state=>state.userReducer.userLanguages);
  itemPictureURL = "https://previews.123rf.com/images/pavelstasevich/pavelstasevich1902/pavelstasevich190200120/124934975-no-image-available-icon-vector-flat.jpg";

  const addBookReviewScreenWalkthroughDone = useSelector(state=>state.userReducer.addBookReviewScreenWalkthroughDone);
  const [toolTipSwitchVisible,setToolTipSwitchVisible] = useState(false);
  const [toolTipLanguageVisible,setToolTipLanguageVisible] = useState(false);
  const [toolTipBookVisible,setToolTipBookVisible] = useState(false);
  const [toolTipUploadVisible,setToolTipUploadVisible] = useState(false);
  const [toolTipRecordVisible,setToolTipRecordVisible] = useState(false);
  const fromRecordBookChapter = useSelector(state=>state.recorderReducer.fromRecordBookChapter);
  const userID = props.firebase._getUid();
  const privateUserID = "private" + userID;
  
  if(props.navigation.state.params !== undefined)
  {
    if (props.navigation.state.params.bookItem === null) //itemSelected is chapterItem
    {
      itemSelected = props.navigation.state.params.chapterItem;
      itemPictureURL = itemSelected.chapterPictures[0];
      genres = itemSelected.genres;
      console.log("[AddBookReviewScreen] Chapter Selected: ",itemSelected);
    }
    else                                                //itemSelected is bookItem
    {
      itemSelected = props.navigation.state.params.bookItem;
      itemPictureURL = itemSelected.bookPictures[0];  
      genres = itemSelected.genres;
      console.log("[AddBookReviewScreen] Book Selected: ",itemSelected);
    }

    if(itemPictureURL === null || itemPictureURL === undefined)            // default picture for NO IMAGE AVAILABLE
      itemPictureURL = "https://previews.123rf.com/images/pavelstasevich/pavelstasevich1902/pavelstasevich190200120/124934975-no-image-available-icon-vector-flat.jpg";
  }
  
  const [bookName, setBookName]=useState(null); ///// Chnage made here
  const [chapterName, setChapterName]=useState(null);
  const [authors, setAuthorName]=useState(null);
  const [languageSelected, setLanguageSelected]=useState(null);
  const tagSelected=React.createRef(null);
  const [languageDataArray,setLanguageDataArray] = useState([]);
  
  const dispatch=useDispatch();

  useEffect( () => {
    var i;
    var tempLangArray = [];
    console.log(userLanguages);
    for(i=0;i<userLanguages.length;i++)
      tempLangArray.push({id:i+1,label:userLanguages[i]});
    
    setLanguageDataArray(tempLangArray);
  },[userLanguages])

  useEffect(() => {
    if(fromRecordBookChapter == true)
    {
      setIsBookPodcast(true);
      dispatch({type:"SET_FROM_RECORD_BOOK_CHAPTER",payload:false})
    }
  },[fromRecordBookChapter])

  useEffect(() => {
    if(isBookPodcast){
      setBookOpacity(1);
      setOriginalOpacity(0.5);
    }
    else{
      setBookOpacity(0.5);
      setOriginalOpacity(1);
    } 
  },[isBookPodcast])

  useEffect(
    ()=>
    {
       dispatch({type:"SET_PODCAST", payload: null});
       dispatch({type:"SET_IS_MUSIC_ENABLED",payload: false});
       dispatch({type:"SET_FLIP_PAUSED",payload:true});
       dispatch({type:"SET_FLIP_ID",payload:null});


       TrackPlayer.destroy();
    }, [tagSelected]
  )
 
  useEffect(() => {
    dispatch({type:"SET_PODCAST", payload: null});
    TrackPlayer.destroy();
    if(addBookReviewScreenWalkthroughDone == false)
    {
      setTimeout(() => {
        setToolTipSwitchVisible(true);
      },500)
    }
  }, [])

  useEffect(
    () =>
    {
      if(itemSelected != null)
      {
        setBookName(itemSelected.bookName)
        itemSelected.chapterName !== null && itemSelected.chapterName !== undefined && setChapterName(itemSelected.chapterName);
        setAuthorName(itemSelected.authors[0])
      }
    },[itemSelected]
  )

    function validate(type)
    {
      if(isBookPodcast == false) // For Original podcasts
      { 
        if(languageSelected === null)
        {
          alert("You must choose language of your Podcast");
          return;
        }
        dispatch({type:"SET_BOOK_PODCAST",payload:false});
      }
      else
      {
        if (bookName === null || authors === null|| languageSelected === null) 
        {
          if(languageSelected === null && bookName !== null)
          {
            alert("You must choose language of your Podcast");
            return;
          }
          if(languageSelected === null && bookName === null)
          {
            alert("You must select Book/Chapter and language of your Podcast");
            return;
          }
          if(languageSelected !== null && bookName === null)  
          {
            alert("You must select Book/Chapter of your Podcast");
            return;
          }
        }  

        if(itemSelected.chapterID !== null && itemSelected.chapterID !== undefined)
        {
          dispatch({type:'CHANGE_CHAPTER_ID', payload:itemSelected.chapterID})
          dispatch({type:'CHANGE_CHAPTER',payload:chapterName}) 
        }
        else
        {
          dispatch({type:'CHANGE_CHAPTER_ID', payload:null})
          dispatch({type:'CHANGE_CHAPTER',payload:null}) 
        }
        dispatch({type:'CHANGE_BOOK_ID', payload:itemSelected.bookID})
        dispatch({type:'CHANGE_BOOK',payload:bookName})
        dispatch({type:'CHANGE_AUTHOR',payload:authors}) 
        dispatch({type:'SET_BOOK_GENRES',payload:genres})
        dispatch({type:"SET_BOOK_PODCAST",payload:true})
      }
      
      dispatch({type:'CHANGE_LANGUAGE',payload:languageSelected}) 
      dispatch({type:"SET_PODCAST", payload: null})

      if(type == "record")
        NativeModules.ReactNativeRecorder.sampleMethod()
      else if(type == "upload")
        NativeModules.ReactNativeRecorder.uploadActivity()
      else
        console.error("type not recognized. type: ",type); 
    } 

    async function setAddBookReviewWalkthroughInFirestore() {
      firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
        addBookReviewScreenWalkthroughDone : true
      },{merge:true}).then(() => {
          console.log("AddBookReviewWalkthrough set in firestore successfully");       
      }).catch((error) => {
          console.log("Error in updating value of AddBookReviewWalkthrough in firestore");
      })
    }

    function setLanguage(language)
    {
      setLanguageSelected(language);
      console.log(languageSelected)
    }

     function renderSelectedBookArea() {
       return (
        <View>
        {
          (itemSelected != null) ? 
          <View style={{flexDirection:'row',paddingRight:width/15,height:height*2/13}}>
          <View>
          <Image style={{width:width/4,height:height*2/13}} source={{uri: itemPictureURL}}/>
          </View>
          <View style={{paddingLeft:5,flexDirection:'column',height:height*2/13}}>
            {
              (itemSelected.chapterName === null || itemSelected.chapterName === undefined)
              ?
              <Text style={{fontSize:15,color:'white'}}>
                 {itemSelected.bookName.slice(0,70)} 
                 {(itemSelected.bookName.length > 70) ? "..." : ""}
              </Text>
              :
              <View>
              <Text style={{fontSize:15,color:'white'}}>
                {itemSelected.chapterName.slice(0,70)} 
                {(itemSelected.chapterName.length > 70) ? "..." : ""}
              </Text>
              <Text style={{fontSize: theme.sizes.font * 0.9,color:'white'}}>
                {itemSelected.bookName.slice(0,70)} 
                {(itemSelected.bookName.length > 70) ? "..." : ""}
              </Text>
              </View>
            }
          

          {
            itemSelected.authors.map((item,index) => (
              (index<=2) &&
              <Text style={{color:'white',fontSize:10}}>
                        {item}
                        </Text>
            ))
          }
          
          </View>
           </View>
           :
           <TouchableOpacity onPress={()=>{
            dispatch({type:"SET_EXPLORE_SCREEN_AS_PREVIOUS_SCREEN", payload:false})
            props.navigation.navigate('SearchBookChapterTabNavigator',{fromExplore:false})
            }}>
           <View style={{flexDirection:'row',width:width*9/16,borderColor:'white',paddingRight:width/15,height:height*2/13 + 3}}>
           <View style={{flexDirection:'row',width:width*9/32 ,borderColor:'white',borderWidth:2,paddingRight:width/15,height:height*2/13 + 3}}>
           <Image style={{width:width/4,height:height*2/13,borderColor:'black',borderWidth:2}} source={{uri: itemPictureURL}}/>
           </View>
           <View style={{paddingLeft:5,flexDirection:'column',width:width*9/25,height:height*2/13}}>
          <Text style={{paddingVertical:height/18,color:'white'}}>No book or chapter selected.{"\n\n"}</Text>
           
           </View>
            </View>
            </TouchableOpacity>
        }
        </View>
       )
     }
      
      return (

        <SafeAreaView style={{flex:1, backgroundColor:'#232930'}}>
        <ScrollView >
        <View style={styles.AppHeader}>
        <View style={{paddingLeft: width/12 ,paddingVertical:height/20, flexDirection:'row'}}>
        <TouchableOpacity onPress={()=>props.navigation.goBack(null)}>
          <Icon name="arrow-left" size={20} color={'white'}/>
          </TouchableOpacity>

          <Text style={{fontFamily:'Montserrat-SemiBold', color:'white', paddingLeft:(width*5)/24, fontSize:20}}>Create Podcast</Text>
        </View>
        </View>
        <View style={{flexDirection:'row',marginTop:20,alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={() => setIsBookPodcast(false)}>
            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:17,paddingRight:20,color:'white',opacity:originalOpacity}}> Original </Text>
            </TouchableOpacity>
            <Tooltip
              isVisible={toolTipSwitchVisible}
              placement="bottom"
              content={
              <View style={{width:width/2}}>
              <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/>
              <Text style={{fontFamily:"Andika-R"}}>Switch between book podcasts & original podcasts</Text>
              </View>}
              onClose={() => {
                setToolTipSwitchVisible(false)
                setToolTipLanguageVisible(true);
              }}
            >
         <ToggleSwitch
          isOn={isBookPodcast}
          onColor="white"
          offColor='#808080'
          labelStyle={{ color: "white", fontWeight: "900" }}
          size="medium"
          onToggle={isOn => {
            console.log("changed to : ", isOn)
            setIsBookPodcast(isOn);
          }}
        />
        </Tooltip>
        <TouchableOpacity onPress={() => setIsBookPodcast(true)}>
        <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:17,paddingLeft:20,color:'white',opacity:bookOpacity}}> Book </Text>
        </TouchableOpacity>
        </View>
        <Tooltip
              isVisible={toolTipLanguageVisible}
              placement="bottom"
              content={
              <View style={{width:width/2}}>
              <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/>
              <Text style={{fontFamily:"Andika-R"}}>Choose 1 language for your podcast</Text>
              </View>}
              onClose={() => {
                setToolTipLanguageVisible(false);
                setToolTipBookVisible(true);
              }}
            >
        <View style={{paddingTop:height/10,paddingBottom:0, alignItems:'center'}}>
        
        <TagSelect itemStyle={styles.item}
          itemLabelStyle={styles.label}
          itemStyleSelected={styles.itemSelected}
          itemLabelStyleSelected={styles.labelSelected}
          data={languageDataArray}
          max={1}
          ref={tagSelected}
          onMaxError={() => {
            alert('Multiple Languages Error', 'You can select only one language while recording a Book or Chapter podcast');
          }}
          onItemPress={(tag)=>{
             console.log(tag)
             if(languageSelected===null)
             {
                setLanguage(tag.label)
             }
             else
             {
                setLanguage(null)
             }
          }}
        />
        </View>
        </Tooltip>
        {
          isBookPodcast 
          &&
          <View style={{paddingVertical:30,paddingBottom: height/20, flexDirection:'column', paddingLeft:width/8, paddingRight:width/8} }>
            <Tooltip
              isVisible={toolTipBookVisible}
              placement="bottom"
              content={
              <View style={{width:width/2}}>
              <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/>
              <Text style={{fontFamily:"Andika-R"}}>Choose a book or chapter for creating a book podcast</Text>
              </View>}
              onClose={() => {
                //setToolTipLanguageVisible(false);
                setToolTipBookVisible(false);
                setToolTipUploadVisible(true);
                
              }}
            >
            <TouchableOpacity onPress={()=>{
              dispatch({type:"SET_EXPLORE_SCREEN_AS_PREVIOUS_SCREEN", payload:false})
              props.navigation.navigate('SearchBookChapterTabNavigator',{fromExplore:false})
              }}>
          <View style={{flexDirection:'row',borderColor:'black',height:height/20,borderRadius:20, backgroundColor: 'white', paddingVertical:height/100, width:width*6/8}}>
          
          <Icon style={{paddingHorizontal:10,paddingTop:0 }} name="search" size={20} color='black'/>
              <Text style={{ flex:1, fontWeight:'500',fontSize:12,color:'black',borderColor:'black'}}> 

                {"  "}Tap here to select book or chapter
                </Text> 

          </View>
          </TouchableOpacity>
          </Tooltip>
          </View> 
          
        }
      {/* <View>
            <LottieView 
            ref={animation}
            style={{width:width/3}} 
            source={newAnimation}
            autoPlay={true}
            loop={true}/>
            </View> */}
        <View style={{height:height*2/13, paddingLeft:width/5,paddingRight:width/5,paddingBottom:height/10}}>
        {
          isBookPodcast ?
          renderSelectedBookArea() :
          <View style={{marginTop:10,marginBottom:10, alignItems:'center'}}>
            <LottieView 
            ref={animation}
            style={{width:width/1.5}} 
            source={newAnimation}
            autoPlay={true}
            loop={true}/>
            </View>
        }
        
        </View>

        

        <View style={{marginTop:height/8, flexDirection:'row', paddingLeft:width/6 }}>
        <Tooltip
              isVisible={toolTipUploadVisible}
              placement="top"
              content={
              <View style={{width:width/2}}>
              <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/>
              <Text style={{fontFamily:"Andika-R"}}>You can upload audio from your local storage</Text>
              </View>}
              onClose={() => {
                setToolTipUploadVisible(false);
                setToolTipRecordVisible(true);
              }}
            >
        <View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center',backgroundColor:'black', height:height/20, width:(width*7)/24, borderRadius:15, borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 0.3 }} 
            onPress={() => validate("upload")}>
            <Text style={{ alignItems: 'center', fontFamily:'Montserrat-SemiBold', color:'white', justifyContent:'center'}} >Upload</Text>
                </TouchableOpacity>
        </View>
        </Tooltip>
        <View style={{paddingLeft:width/12}}>
        <Tooltip
              isVisible={toolTipRecordVisible}
              placement="top"
              content={
              <View style={{width:width/2}}>
              <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/>
              <Text style={{fontFamily:"Andika-R"}}>Record audio for your podcast</Text>
              </View>}
              onClose={() => {
                setToolTipRecordVisible(false);
                dispatch({type:"SET_ADD_BOOK_REVIEW_WALKTHROUGH",payload:true});
                setAddBookReviewWalkthroughInFirestore();
              }}
            >
                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, backgroundColor:'black', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 0.3 }} 
                 onPress={() => validate("record")}>
            <Text style={{ alignItems: 'center', fontFamily:'Montserrat-SemiBold', color:'white', justifyContent:'center'}} >Record</Text>
                </TouchableOpacity>
                </Tooltip>
        </View>     
        </View>
        </ScrollView>
        </SafeAreaView> 
        
      );
    
  }

export default withFirebaseHOC(AddBookReviewScreen);


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
    color: 'white',
    textAlign: 'center'
    },
    item: {
      borderWidth: 0.3,
      borderColor: 'white',    
      backgroundColor: '#232930',

    },
    label: {
      color: 'white',
      fontSize:12
    },
    itemSelected: {
      backgroundColor: 'white',
    },
    labelSelected: {
      color: 'black',
    },
    AppHeader:
  {
 flexDirection:'row',
 backgroundColor: '#232930'
  },
});

