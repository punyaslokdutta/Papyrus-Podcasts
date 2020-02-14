
import React, { useState, useRef, useEffect} from 'react';
import { TouchableOpacity,StyleSheet, Text, View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import AddModal from '../screens/components/Record/AddModal'
import AddChapterModal from '../screens/components/Record/AddChapterModal'
import { TagSelect } from 'react-native-tag-select'
import PreviewScreen from '../screens/PreviewScreen'
import {useSelector, useDispatch} from 'react-redux'

const { width, height } = Dimensions.get('window');

const SelectScreen =(props)=> {
  const [categoryClicked, setcategoryClicked]=useState(null);
  const [BookName, setBookName]=useState(null);
  const [ChapterName, setChapterName]=useState(null);
  const [AuthorName, setAuthorName]=useState(null);
  const [LanguageSelected, setLanguageSelected]=useState(null);
  const [recordedFilePath, setRecordedFilePath]=useState(null);
  const eventEmitter=useRef(new NativeEventEmitter(NativeModules.ReactNativeRecorder)).current;
  const addModal=React.createRef(null);
  const addChapterModal=React.createRef(null);
  const tagSelected=React.createRef(null);

  //const podcast=useSelector(state=>state.rootReducer.podcast)
  const dispatch=useDispatch();



  /*componentWillMount() {
    // const eventEmitter = new NativeEventEmitter(NativeModules.ReactNativeRecorder);
    // eventEmitter.addListener('abcd', (event) => {
    //    console.log(event.eventProperty) // "someValue"

    // })
  }*/
  useEffect(
    ()=>
    {
       dispatch({type:"SET_PODCAST", payload: null})
    }, [tagSelected]
  )
 

  useEffect(
    () => {
      
      console.log("Inside useEffect - componentDidUpdate of SelectScreen");
      const fileType=".m4a"
      const filePath="/storage/emulated/0/AudioRecorder/"
      var audioFilePath=null;
      eventEmitter.addListener('RecordFile', (event) => {
           audioFilePath=filePath.concat(event.eventProperty,fileType)
          console.log("RecordedFilePath :" +audioFilePath)
          //console.log(props)
          //navigateToPreview()
          
        
       
       //this.props.navigation.navigate('PreviewScreen')

    })
   //setRecordedFilePath(audioFilePath)
    //console.log(recordedFilePath)

    // if(recordedFilePath)
    // {

    // props.navigation.navigate('PreviewScreen', {
    //   BookName: BookName,
    //   ChapterName:ChapterName , 
    //   AuthorName: AuthorName, 
    //   LanguageSelected:LanguageSelected, })}
     
      
    }, [eventEmitter.current])
  

    onPressAdd2=()=>
    {
        //console.log(this.ref)
        addChapterModal.current.showAddModal();
       
    }

     onPressAdd=()=>
     {
        addModal.current.showAddModal();


        
     }

     setLanguage=(language)=>
     {
       console.log(language)
       setLanguageSelected(language);
     }
     unsetLanguage=()=>
     {
      console.log(LanguageSelected)
      setLanguageSelected(null);
     }




     

     callbackFunction=(data)=>
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
       console.log(data)
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
        <View style={{paddingVertical:height/24, alignItems:'center'} }>
          <Text style={{fontFamily:'sans-serif-light', color:'white',  fontSize:14}}>Select the category you want</Text>
          <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14}}>to record/upload</Text>
          
        </View>

         <View style={{paddingVertical:height/20, flexDirection:'row', paddingLeft:width/4} }>
         <View>
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
         
         </View>

         
         
        </View>
        <View style={{paddingVertical:height/24, alignItems:'center'} }>
          <Text style={{fontFamily:'sans-serif-light', color:'white',  fontSize:14}}>Select the Language you want</Text>
          <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14}}>to record/upload with </Text>
          
        </View>
        <View>


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
                         if (BookName === null || AuthorName.length === null || LanguageSelected.length === null) {
                            alert("You must choose Category and Language of your Podcast");
                            return;
                        }   
                        props.navigation.navigate('PreviewScreen', {
          BookName: BookName,
          ChapterName:ChapterName , 
          AuthorName: AuthorName, 
          LanguageSelected:LanguageSelected, }
 )
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
                        NativeModules.ReactNativeRecorder.sampleMethod()
          //               this.props.navigation.navigate('PreviewScreen', {
          // BookName: this.state.BookName,
          // ChapterName:this.state.ChapterName , 
          // AuthorName: this.state.AuthorName, 
          // LanguageSelected:this.state.LanguageSelected, })*/
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
