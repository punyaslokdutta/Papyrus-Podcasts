
import React, { useState, useRef, useEffect} from 'react';
import {StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { TagSelect } from 'react-native-tag-select'
import {withFirebaseHOC} from './screens/config/Firebase'
import {useSelector } from 'react-redux'


const { width, height } = Dimensions.get('window');
const setPreferences =(props)=> {
const [bookPreferences, setbookPreferences]=useState({});
const bookTagSelected=React.createRef(null);
const fullName=useSelector(state=>state.authReducer.fullName)
//const user = props.navigation.getParam('user');
//const podcast=useSelector(state=>state.rootReducer.podcast)
//const dispatch=useDispatch();

async function createUser(props, fullName)
{
  
  try
  {
  const user = props.navigation.getParam('user');

  const addNewUser= await props.firebase._createNewUser(user,fullName);
  console.log("User Document created in Firestore from setPreferences");
  }
  catch(error)
  {
   console.log(error);
  }

}


  useEffect(()=>
    {
    }, [bookTagSelected]
  )
 
      const data = [
        { id: 1, label: '#Psychology' },
        { id: 2, label: '#Health' },
        { id: 3, label: '#Art & History ' },
        { id: 4, label: '#Economics' },
        { id: 5, label: '#Math' },
        { id: 6, label: '#Politics' },
        { id: 7, label: '#Money' },
        { id: 8, label: '#Culture' },
        { id: 9, label: '#Blockchain' },
        { id: 10, label: '#Artificial Intelligence' },
        { id: 11, label: '#History' }, 
        { id: 12, label: '#Self-Improvement'}, 
        { id: 13, label: '#Fiction' }

      ];

      const bookData=[
        { id: 1, label: '#Psychology' },
        { id: 2, label: '#Health' },
        { id: 3, label: '#Art & History ' },
        { id: 4, label: '#Economics' },
        { id: 5, label: '#Math' },
        { id: 6, label: '#Politics' },
        { id: 7, label: '#Money' },
        { id: 8, label: '#Culture' },
        { id: 9, label: '#Blockchain' },
        { id: 10, label: '#Artificial Intelligence' },
        { id: 11, label: '#History' }, 
        { id: 12, label: '#Self-Improvement'}, 
        { id: 13, label: '#Fiction' },
      ]
      
      return (
        <SafeAreaView style={{flex:1, backgroundColor:'#101010'}}>
        <View style={styles.AppHeader}>
        <View style={{paddingLeft: (width)/3 ,paddingVertical:height/100, flexDirection:'row'} }>
   
        </View>
        <TouchableOpacity>
          <Image
            resizeMode="contain"
            source={require('./assets/images/papyrusLogo.png')}
            style={{ width: 100, height: 200 }}
          />
        </TouchableOpacity>
        </View>
        <ScrollView>
        <View>
          <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14, paddingLeft:(width*9)/24}}>Select Tags</Text>
        </View>
        <View style={{paddingVertical:height/40, paddingLeft:width/11}}>
        <TagSelect itemStyle={styles.item}
          itemLabelStyle={styles.label}
          itemStyleSelected={styles.itemSelected}
          itemLabelStyleSelected={styles.labelSelected}
          data={data}
          max={10}
          ref={bookTagSelected}
          onMaxError={() => {
            alert('Select maximum 10 hashtags, 10 books');
          }}
        />
        </View> 
        <View>
          <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14, paddingLeft:(width*9)/24}}>Select Books</Text>
        </View>
        <View style={{paddingVertical:height/40, paddingLeft:width/11}}>
        <TagSelect itemStyle={styles.item}
          itemLabelStyle={styles.label}
          itemStyleSelected={styles.itemSelected}
          itemLabelStyleSelected={styles.labelSelected}
          data={bookData}
          max={5}
          ref={bookTagSelected}
          onMaxError={() => {
            alert('Select maximum 5 hashtags, 5 books');
          }}
        />
        </View>
        <View style={{paddingHorizontal:width/3, paddingBottom:height/8}}>
        <TouchableOpacity onPress={()=>{createUser(props, fullName)}}style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }} >
        <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Next</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
        </SafeAreaView> 
        
      );
    
  }

export default withFirebaseHOC(setPreferences);


const styles = StyleSheet.create({
  
  
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
      borderColor: 'white',    
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
