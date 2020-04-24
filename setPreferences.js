
import React, { useState, useRef, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { TagSelect } from 'react-native-tag-select'
import {withFirebaseHOC} from './screens/config/Firebase'
import {useSelector,useDispatch} from 'react-redux'

const languageData = [
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
  { id: 21, label: 'French' }
];

const { width, height } = Dimensions.get('window');
const setPreferences =(props)=> {

    const dispatch = useDispatch();
    const [bookPreferences, setbookPreferences]=useState({});
    const categoriesSelected = React.createRef(null);
    const languagesSelected = React.createRef(null);
    const fullName=useSelector(state=>state.userReducer.name)
    const [loading,setLoading] = useState(false)
    const [categories,setCategories] = useState([])
    const [categorySelectedMap,setCategorySelectedMap] = useState({})
    const [languageSelectedMap,setLanguageSelectedMap] = useState({})  

    async function createUser(props, fullName,userPreferences,languagePreferences)
    {    
      try
      {
      const user = props.navigation.getParam('user');
      console.log(user);
      const uId=user._user.uid;
      console.log(uId);
      const userName= fullName+"_" + uId.substring(3,9)
      
      const addNewUser= await props.firebase._createNewUser(user,fullName, userName,userPreferences,languagePreferences);
      console.log("User Document created in Firestore from setPreferences");
      }
      catch(error)
      {
      console.log(error);
      }
    }

    async function retrieveCategories()
    {
      try
      {
        setLoading(true);
        const categoryDocs = await firestore().collection('Categories').get();
        const categoryData = categoryDocs.docs.map(document=>document.data())
        const categoryLabels = [];
        var categoryMap = {};
        var i;
        for(i=0;i<categoryData.length;i++)
        {
          const j = i + 1
          const categoryLabel = {
            id : j,
            label : categoryData[i].categoryName
          }
          
          categoryLabels.push(categoryLabel);
          categoryMap[categoryData[i].categoryName] = false;
        }

        setCategorySelectedMap(categoryMap);

        setCategories(categoryLabels);
        setLoading(false)
      }
      catch(error)
      {
        console.log(error)
      }
    }

    useEffect(()=>
    {
      retrieveCategories();
      
      var i;
      var languageMap = {};
      for(i=0;i<languageData.length;i++)
      {
        languageMap[languageData[i].label] = false;
      }
      setLanguageSelectedMap(languageMap);


    }, [])


    useEffect(()=>
      {
        console.log(categoriesSelected)
      }, [categoriesSelected]
    )

    useEffect(()=>
    {
      console.log(languagesSelected)
    }, [languagesSelected]
  )

  function getMapSize(x) {
    var len = 0;
    for (var count in x) {
            len++;
    }

    return len;
}
      
      if( loading == true)
      {
        return (
        <SafeAreaView style={{flex:1, backgroundColor:'#120d02',paddingTop:20,paddingHorizontal:10, alignItems:'center',justifyContent:'center'}}>
        </SafeAreaView>
        )
      }
      else
      {
        return (
          <SafeAreaView style={{flex:1, backgroundColor:'#120d02',paddingTop:20,paddingHorizontal:10, alignItems:'center',justifyContent:'center'}}>
            {/* //,paddingHorizontal:width/8}}> */}
          
          <ScrollView>
          
          <View>  
            {/* style={{alignItems:'center',justifyContent:'center',paddingHorizontal:width/8}}> */}
            <Text style={{fontFamily:'American Typewriter', color:'white', fontSize:24}}>
              Select at least 3 topics for a personalized experience on Papyrus</Text>
          </View>
          <View> 
            {/* style={{paddingVertical:height/40, paddingLeft:width/11}}> */}
            <Text>{"\n"}</Text>
          <TagSelect itemStyle={styles.item}
            itemLabelStyle={styles.label}
            itemStyleSelected={styles.itemSelected}
            itemLabelStyleSelected={styles.labelSelected}
            data={categories}
            max={5}
            ref={categoriesSelected}
            onMaxError={() => {
              alert('Select maximum 5 hashtags, 5 books');
            }}
            onItemPress={(category)=>{
                console.log(category.label)
                var categoryMap = categorySelectedMap;
                categoryMap[category.label] = !categorySelectedMap[category.label]
                console.log(categoryMap);
                setCategorySelectedMap(categoryMap);
                console.log(categorySelectedMap)
           }}
          />
          </View>
  
  
  
          <View>  
            {/* style={{alignItems:'center',justifyContent:'center',paddingHorizontal:width/8}}> */}
            <Text style={{fontFamily:'American Typewriter', color:'white', fontSize:24}}>
          {"\n"}Select languages you are comfortable with</Text>
          </View>
          <View> 
            {/* style={{paddingVertical:height/40, paddingLeft:width/11}}> */}
            <Text>{"\n"}</Text>
          <TagSelect itemStyle={styles.item}
            itemLabelStyle={styles.label}
            itemStyleSelected={styles.itemSelected}
            itemLabelStyleSelected={styles.labelSelected}
            data={languageData}
            max={5}
            ref={languagesSelected}
            onMaxError={() => {
              alert('Select maximum 5 hashtags, 5 books');
            }}
            onItemPress={(language)=>{
              console.log(language.label)
              var languageMap = languageSelectedMap;
              languageMap[language.label] = !languageSelectedMap[language.label]
              console.log(languageMap);
              setLanguageSelectedMap(languageMap);
         }}
          />
           <Text>{"\n"}</Text>
          </View>

          <View style={{paddingHorizontal:width/3, paddingBottom:height/8}}>
          <TouchableOpacity onPress={()=>{
            
            var i;
            var categorySelectedArray = [];
            for(i=0;i<categories.length;i++)
            {
              if(categorySelectedMap[categories[i].label] == true)
                categorySelectedArray.push(categories[i].label);
            }
            if(categorySelectedArray.length<3)
            {
              alert('Please select atleast 2 categories');
              return;
            }
            var languageSelectedArray = [];
            for(i=0;i<languageData.length;i++)
            {
              if(languageSelectedMap[languageData[i].label] == true)
                languageSelectedArray.push(languageData[i].label)
            }
            if(categorySelectedArray.length == 0)
            {
              alert('Please select atleast 1 language');
              return; 
            }
            createUser(props, fullName,categorySelectedArray,languageSelectedArray);

            }} 
            style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}
            >
          <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Next</Text>
          </TouchableOpacity>
          </View>
          </ScrollView>
          </SafeAreaView> 
          
        );
      }
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
