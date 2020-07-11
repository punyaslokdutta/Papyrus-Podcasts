
import React, { useState, useRef, useEffect, useCallback} from 'react';
import { TouchableOpacity,StyleSheet, Text, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { TagSelect } from 'react-native-tag-select'
import { useDispatch, useSelector} from 'react-redux'
import { theme } from '../categories/constants';
import { ScrollView } from 'react-native-gesture-handler';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';

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

  var itemSelected = null;
  var itemPictureURL = null;
  var genres = null;
  const userLanguages = useSelector(state=>state.userReducer.userLanguages);
  itemPictureURL = "https://previews.123rf.com/images/pavelstasevich/pavelstasevich1902/pavelstasevich190200120/124934975-no-image-available-icon-vector-flat.jpg";


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

  useEffect(
    ()=>
    {
       dispatch({type:"SET_PODCAST", payload: null})
       TrackPlayer.destroy();
    }, [tagSelected]
  )
 
  useEffect(() => {
    dispatch({type:"SET_PODCAST", payload: null});
    TrackPlayer.destroy();
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

     function setLanguage(language)
     {
       setLanguageSelected(language);
       console.log(languageSelected)
     }
      
      return (

        <SafeAreaView style={{flex:1, backgroundColor:'#101010'}}>
        <ScrollView >
        <View style={styles.AppHeader}>
        <View style={{paddingLeft: width/12 ,paddingVertical:height/20, flexDirection:'row'}}>
        <TouchableOpacity onPress={()=>props.navigation.goBack(null)}>
          <Icon name="arrow-left" size={20} style={{color:'white'}}/>
          </TouchableOpacity>

          <Text style={{fontFamily:'san-serif-light', color:'white', paddingLeft:(width*7)/24, fontSize:20}}>Select</Text>
        </View>
        </View>
        <View style={{paddingTop:height/40,paddingBottom:0, alignItems:'center'}}>
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
        <View style={{paddingVertical:10,paddingBottom: height/20, flexDirection:'column', paddingLeft:width/8, paddingRight:width/8} }>
          <TouchableOpacity onPress={()=>{
            dispatch({type:"SET_EXPLORE_SCREEN_AS_PREVIOUS_SCREEN", payload:false})
            dispatch({type:"SET_FROM_SEARCH_CHAPTER_SCREEN",payload:false});
            props.navigation.navigate('SearchBookChapterTabNavigator',{fromExplore:false})
            }}>
        <View style={{flexDirection:'row',height:height/20,borderRadius:20, backgroundColor: 'white', paddingVertical:height/100, width:width*6/8}}>
        
        <Icon style={{paddingHorizontal:10,paddingTop:0 }} name="search" size={20} />
            <Text style={{ flex:1, fontWeight:'500',fontSize:12,borderColor:'white'}}> 

              {"  "}Tap here to select book or chapter
               </Text> 

        </View>
        </TouchableOpacity>
        </View> 
      
        <View style={{height:height*2/13, paddingLeft:width/5,paddingRight:width/5,paddingBottom:height/10}}>
        
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
              dispatch({type:"SET_FROM_SEARCH_CHAPTER_SCREEN",payload:false});
              props.navigation.navigate('SearchBookChapterTabNavigator',{fromExplore:false})
              }}>
             <View style={{flexDirection:'row',width:width*9/16,borderColor:'white',paddingRight:width/15,height:height*2/13 + 3}}>
             <View style={{flexDirection:'row',width:width*9/32 ,borderColor:'white',borderWidth:2,paddingRight:width/15,height:height*2/13 + 3}}>
             <Image style={{width:width/4,height:height*2/13,borderColor:'white',borderWidth:2}} source={{uri: itemPictureURL}}/>
             </View>
             <View style={{paddingLeft:5,flexDirection:'column',width:width*9/25,height:height*2/13}}>
            <Text style={{paddingVertical:height/18,color:'white'}}>No book or chapter selected.{"\n\n"}</Text>
             
             </View>
              </View>
              </TouchableOpacity>
          }  
         
        
        </View>

        

        <View style={{paddingTop:height/10,paddingBottom:height/10, flexDirection:'row', paddingLeft:width/6 }}>
        <View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center',backgroundColor:'rgba(0, 0, 0, 0.7)', height:height/20, width:(width*7)/24, borderRadius:15, borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }} 
            onPress={() => {
              console.log("[AddBookReviewScreen] bookName : ",bookName);
                         
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
                        dispatch({type:'CHANGE_BOOK_ID', payload:itemSelected.bookID})

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


                        dispatch({type:'CHANGE_BOOK',payload:bookName})
                        dispatch({type:'CHANGE_AUTHOR',payload:authors}) 
                        dispatch({type:'CHANGE_LANGUAGE',payload:languageSelected}) 
                        dispatch({type:'SET_BOOK_GENRES',payload:genres})
                        dispatch({type:"SET_PODCAST", payload: null})

                        NativeModules.ReactNativeRecorder.uploadActivity()
 
                         }
            }>
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Upload</Text>
                </TouchableOpacity>
        </View>
        <View style={{paddingLeft:width/12,}}>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }} 
                 onPress={() => {

                         
                         if (bookName === null || authors === null || languageSelected ===null) 
                         {
                          if(languageSelected == null && bookName!=null)
                          {
                            alert("You must choose language of your Podcast");
                            return;
                          }
                          if(languageSelected == null && bookName==null)
                          {
                            alert("You must select Book/Chapter and language of your Podcast");
                            return;
                          }
                          if(languageSelected != null && bookName==null)  
                          {
                            alert("You must select Book/Chapter of your Podcast");
                            return;
                          }
                        } 
                        dispatch({type:'CHANGE_BOOK_ID', payload:itemSelected.bookID})
                        
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

                        dispatch({type:'CHANGE_BOOK',payload:bookName}) 
                        dispatch({type:'CHANGE_AUTHOR',payload:authors}) 
                        dispatch({type:'CHANGE_LANGUAGE',payload:languageSelected})
                        dispatch({type:'SET_BOOK_GENRES',payload:genres})
                        dispatch({type:"SET_PODCAST", payload: null})
      
                        NativeModules.ReactNativeRecorder.sampleMethod()
                         }
            }>
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Record</Text>
                </TouchableOpacity>
        </View>     
        </View>
        </ScrollView>
        </SafeAreaView> 
        
      );
    
  }

export default AddBookReviewScreen;


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

