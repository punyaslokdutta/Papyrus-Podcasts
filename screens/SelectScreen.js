
import React, { useState, useRef, useEffect, useCallback} from 'react';
import { TouchableOpacity,StyleSheet, Text, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import AddModal from '../screens/components/Record/AddModal'
import AddChapterModal from '../screens/components/Record/AddChapterModal'
import { TagSelect } from 'react-native-tag-select'
import PreviewScreen from '../screens/PreviewScreen'
import {useSelector, useDispatch} from 'react-redux'
import { withFirebaseHOC } from './config/Firebase';
import { duration } from 'moment';
import SearchTabNavigator from './navigation/SearchTabNavigator'


const { width, height } = Dimensions.get('window');

const SelectScreen =(props)=> {

  var bookSelected = null;
  if(props.navigation.state.params !== undefined)
     bookSelected = props.navigation.state.params.bookItem;
  console.log("[SelectScreen] Book Selected: ",bookSelected);

  const [categoryClicked, setcategoryClicked]=useState(null);
  const [BookName, setBookName]=useState();
  const [ChapterName, setChapterName]=useState(null);
  const [AuthorName, setAuthorName]=useState(null);
  const [LanguageSelected, setLanguageSelected]=useState(null);
  const [bookId, setBookId]=useState(null);

  
  // if(bookSelected != null)
  // {
  //   setBookName(bookSelected.title);
  // }
  //const [recordedFilePath, setRecordedFilePath]=useState(null);
  //const eventEmitter=useRef(new NativeEventEmitter(NativeModules.ReactNativeRecorder)).current;
  const addModal=React.createRef(null);
  const addChapterModal=React.createRef(null);
  const tagSelected=React.createRef(null);
  
  
  const dispatch=useDispatch();


  useEffect(
    ()=>
    {
       dispatch({type:"SET_PODCAST", payload: null})
    }, [tagSelected]
  )
 
  useEffect(
    () =>
    {
      if(bookSelected != null)
      {
        setBookName(bookSelected.title);
        setBookId(bookSelected.bookID);
        setAuthorName(bookSelected.authors[0])
      }
    },[bookSelected]
  )

  // useEffect(
  //   () => {
      
  //     console.log("Inside useEffect - componentDidUpdate of SelectScreen");
  //     const fileType=".m4a"
  //     const filePath="/storage/emulated/0/AudioRecorder/"
  //     var audioFilePath=null;
  //     eventEmitter.addListener('RecordFile', (event) => {
  //          audioFilePath=filePath.concat(event.eventName,fileType)
  //         console.log(props)
  //         console.log("RecordedFilePath :" +audioFilePath)
  //         console.log("timeduration :" , +event.eventDuration)
  //        props.navigation.navigate('PreviewScreen', {  
  //         recordedFilePath: audioFilePath, 
  //         duration:event.eventDuration})
  //   })
       
  //   }, [])
  

    function onPressAdd2()
    {
        addChapterModal.current.showAddModal();  
    }

     function onPressAdd()
     {
        addModal.current.showAddModal();     
     }

     function setLanguage(language)
     {
       setLanguageSelected(language);
       console.log(LanguageSelected)
     }

     function callbackFunction(data)
     {
       if(data.categoryClicked==='Chapter')
       {
       setcategoryClicked(data.categoryClicked);
       setBookName(data.newBookName);
       setChapterName(data.newChapterName);
       setAuthorName(data.newAuthorName);
      }
      else if (data.categoryClicked==='Book'){
        setcategoryClicked(data.categoryClicked);
        setBookName(data.newBookName);
        setChapterName(null);
        setAuthorName(data.newAuthorName);

      }
       //console.log(data)

       //console.log(this.state)
    }   


      const data = [
        { id: 1, label: 'English' },
        { id: 2, label: 'Hindi' },
        { id: 3, label: 'Bengali' },
        { id: 4, label: 'Telugu' },
        { id: 5, label: 'Marathi' },
        { id: 6, label: 'Tamil' },
        { id: 7, label: 'Mandarin' },
        { id: 8, label: 'Spanish' },
        { id: 9, label: 'Assamese' },
        { id: 10, label: 'Odiya' },

      ];
      
      return (
      
          

        <SafeAreaView style={{flex:1, backgroundColor:'#101010'}}>

        <View style={styles.AppHeader}>
        <TouchableOpacity onPress={()=>props.navigation.goBack(null)}>
        <View style={{paddingLeft: width/12 ,paddingVertical:height/20, flexDirection:'row'} }>
          <Icon name="times" size={20} style={{color:'white'}}/>
          <Text style={{fontFamily:'san-serif-light', color:'white', paddingLeft:(width*7)/24, fontSize:20}}>Select</Text>
        </View>

        </TouchableOpacity>

        </View>

         {/* <View style={{paddingVertical:30, paddingBottom: height/10, flexDirection:'column', paddingLeft:width/8, paddingRight:width/8} }> */}
         {/* <View>
         <TouchableOpacity onPress={onPressAdd}  >
         <Icon name="book" size={50} style={{color:'white'}}/>
         </TouchableOpacity>
         <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14, paddingTop:5}}>Book</Text>
         </View>


         <View style={{paddingLeft:width/4}}>
         <TouchableOpacity onPress={onPressAdd2}>
         <Icon name="newspaper-o" size={50} style={{color:'white'}}/>
         </TouchableOpacity>
         <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14, paddingTop:5}}>Chapter</Text>
         
         </View> */}

        <View style={{paddingVertical:30, paddingBottom: height/20, flexDirection:'column', paddingLeft:width/8, paddingRight:width/8} }>
          <TouchableOpacity onPress={()=>{props.navigation.navigate('SearchTabNavigator')}}>
        <View style={{flexDirection:'row',height:height/12, backgroundColor: '#101010', paddingRight: 13, paddingVertical:10, width:((width*7)/8)-10 }}>
        
            <Text style={{ flex:1, fontWeight:'500',borderRadius:20,backgroundColor:'white',fontSize:15,borderColor:'white', 
              paddingTop: 7, paddingHorizontal: 10 }}>
            
              <Icon style={{paddingHorizontal:10,paddingTop:20 }} name="search" size={20} />
              

              {"  "}Search Content, Books, Chapters
               </Text> 

        </View>
        </TouchableOpacity>
        </View> 
      
        <View style={{height:height*2/13,paddingLeft:width/5,paddingRight:width/5}}>
        
          {
            (bookSelected != null) ? 
            <View style={{flexDirection:'row'}}>
            <View>
            <Image style={{width:width/4,height:height*2/13}} source={{uri: bookSelected.bookPictures[0]}}/>
            </View>
            <View style={{paddingLeft:5,flexDirection:'column'}}>
            <Text style={{fontSize:15,color:'white'}}>{bookSelected.title}</Text>
            <Text style={{color:'white'}}>{bookSelected.authors[0]}</Text>
            </View>
             </View>
             :
            <Text>No book/chapter selected</Text>
          }  
         
        
        </View>
    
    
         
         
        

        <View style={{paddingVertical:height/40, paddingLeft:width/11}}>
        <TagSelect itemStyle={styles.item}
          itemLabelStyle={styles.label}
          itemStyleSelected={styles.itemSelected}
          itemLabelStyleSelected={styles.labelSelected}
          data={data}
          max={1}

          ref={tagSelected}
          
          onMaxError={() => {
            alert('Multiple Languages Error', 'You can select only one language while recording a Book or Chapter podcast');
          }}
          //never use setState in render as it will cause re-rendering and infinite loading

          onItemPress={(tag)=>{

             console.log(tag)

             if(LanguageSelected===null)
             {
                 setLanguage(tag.label)
             }
             else{
               setLanguage(null)

             }
          }

           
          }
        />
        
        </View>

        <View style={{paddingVertical:height/10, flexDirection:'row', paddingLeft:width/6 }}>
        <View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }} 
            onPress={() => {
              console.log("[SelectScreen] BookName : ",BookName);

                         if (BookName === null || AuthorName===null|| LanguageSelected ===null) {

                            alert("You must choose Category and Language of your Podcast",BookName);
                            return;
                        }  
                        dispatch({type:'CHANGE_BOOK_ID', payload:bookSelected.bookID})
                        dispatch({type:'CHANGE_BOOK',payload:BookName})
                        dispatch({type:'CHANGE_CHAPTER',payload:ChapterName}) 
                        dispatch({type:'CHANGE_AUTHOR',payload:AuthorName}) 
                        dispatch({type:'CHANGE_LANGUAGE',payload:LanguageSelected}) 

                        NativeModules.ReactNativeRecorder.uploadActivity()
 
                         }
            }>
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Upload</Text>
                </TouchableOpacity>
        </View>
        <View style={{paddingLeft:width/12}}>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }} 
                 onPress={() => {
                         if (BookName === null || AuthorName === null || LanguageSelected ===null) {
                            alert("You must choose Category and Language of your Podcast");
                            return;
                        } 
                        dispatch({type:'CHANGE_BOOK_ID', payload:bookSelected.bookID})
                        dispatch({type:'CHANGE_BOOK',payload:BookName})
                        dispatch({type:'CHANGE_CHAPTER',payload:ChapterName}) 
                        dispatch({type:'CHANGE_AUTHOR',payload:AuthorName}) 
                        dispatch({type:'CHANGE_LANGUAGE',payload:LanguageSelected})      
                        NativeModules.ReactNativeRecorder.sampleMethod()
                         }
            }>
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Record</Text>
          

                </TouchableOpacity>
        </View>     
        </View>
<AddModal ref={addModal} navigation={props.navigation} parentCallback = {callbackFunction} >
</AddModal>

<AddChapterModal ref={addChapterModal} navigation={props.navigation} parentCallback = {callbackFunction} >
    
    </AddChapterModal>
        </SafeAreaView> 
        
      );
    
  }

export default SelectScreen;


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
      backgroundColor: 'transparent',
    },
    label: {
      color: 'white',
      fontSize:9
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
