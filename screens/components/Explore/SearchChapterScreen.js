import React, { useEffect, useState } from 'react';
import {View,FlatList,ActivityIndicator,BackHandler,StyleSheet,  SafeAreaView,Image,  TextInput, Dimensions, TouchableOpacity} from 'react-native';

import ItemSeperator from "./ItemSeperator";
import algoliasearch from "algoliasearch";
import {withFirebaseHOC} from '../../config/Firebase'
import {useSelector,useDispatch} from 'react-redux';
import SearchChapterItem from './SearchChapterItem';
import LottieView from 'lottie-react-native';
import newAnimation from '../../../assets/animations/lf30_editor_KtvLMb.json';


var {width, height}=Dimensions.get('window')
const SearchChapterScreen=(props)=>
{
    const dispatch=useDispatch();
    const algoliaAPPID = useSelector(state=>state.userReducer.algoliaAPPID);
    const algoliaAPIKey = useSelector(state=>state.userReducer.algoliaAPIKey);

    const searchClient = algoliasearch(
      algoliaAPPID,
      algoliaAPIKey
    );
    const index = searchClient.initIndex('dev_chapters');
    
    const initialAuthors  ={
      tag: '',
      tagsArray: []
    }

    const searchQuery = useSelector(state=>state.userReducer.algoliaQuery)
    const fromExploreScreen = useSelector(state=>state.userReducer.isExplorePreviousScreen)

    console.log("Search Query: ",searchQuery);
    const [chapters,setChapters] = useState([]);
    const [lastPage,setLastPage] = useState(0);
    const [loading,setLoading] = useState(false);
    const [refreshing,setRefreshing] = useState(false);
    const [chapterImage, setChapterImage]=useState(null);
    const [ChapterImageDownloadURL, setChapterImageDownloadURL]=useState(null);
    const [uploadChapterSuccess, setUploadChapterSuccess]=useState(false)
    const [chapterID,setChapterID] = useState(null);
    var [chapterNameState, setChapterNameState] = useState(null);
    
    const [authors, setAuthors]=useState(initialAuthors);

    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);
    const numHits = 10;

    useEffect( ()=>
        {
            setLoading(true);
            console.log("Inside useEffect of SearchChapterScreen")
             setChapterNameState(searchQuery);
            if(searchQuery == "" || searchQuery == null)
            {
                setChapters(null)
                setLoading(false);
            }

            searchQuery && index.search(searchQuery,{
                page : 0,
                hitsPerPage : numHits
            }).then(({hits})=>
            {
                setChapters(hits);
                setLoading(false);
                console.log(hits);
            }).catch(function(error) {
                console.log("Error loading document: ", error);
                //Toast.show("Error: Please try again.")
                setLoading(false)
            });
            
          //   searchQuery && replicaIndex.search(searchQuery,{
          //     page : 0,
          //     hitsPerPage : numHits
          // }).then(({hits})=>
          // {
          //     setChapters(hits);
          //     setLoading(false);
          //     console.log(hits);
          // }).catch(function(error) {
          //     console.log("Error loading document: ", error);
          //     //Toast.show("Error: Please try again.")
          //     setLoading(false)
          // });

        }, [searchQuery]
    )

    useEffect( ()=>
        {
            setRefreshing(true);
            console.log("Inside useEffect of lastPage")
 
            if(searchQuery == "" || searchQuery == null)
            {
                setRefreshing(false);
            }

            searchQuery && index.search(searchQuery,{
                page : lastPage,
                hitsPerPage : numHits
            }).then(({hits})=>
            {

                (chapters != undefined) && (chapters.length != 0) && (hits.length != 0) && 
                     setChapters([...chapters,...hits]);
                setRefreshing(false);
                console.log(hits);
            }).catch(function(error) {
                console.log("Error adding document: ", error);
                //Toast.show("Error: Please try again.")
                setRefreshing(false);

            });
           // setRefreshing(false);
        }, [lastPage]
    )

    useEffect(() => {
      const article = {
        bookName : chapterNameState,
        chapterPictures : [ChapterImageDownloadURL],
        chapterID : chapterID,
        authors : authors.tagsArray
      }

      uploadChapterSuccess && props.navigation.navigate('SelectScreen',{chapterItem:article});
    },[uploadChapterSuccess])

    // useEffect(
    //     () => {
    //       console.log("Inside useEffect - componentDidMount of SearchBookScreen");
    //       BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
    //       return () => {
    //         console.log(" back_Button_Press Unmounted");
    //         BackHandler.removeEventListener("hardwareBackPress",  back_Button_Press);
    //         props.navigation.navigate('Explore');
  
    //       };
    //     }, [back_Button_Press])

    function updateAuthorState(state){
      setAuthors(state);
    };

    function back_Button_Press()
    {
        console.log("Inside BackButton Press");
        dispatch({type:"SET_ALGOLIA_QUERY", payload: null})
        return false;
        //BackHandler.removeEventListener('hardwareBackPress', this.back_Buttton_Press);
    }
    

    function renderDatas({item,index})
    {
        console.log(item)
       return(
           <View>
         <SearchChapterItem chapter={item} index={index} navigation={props.navigation}/>
          </View>
       )
    }

    function onEndReached({ distanceFromEnd }){

        if(!onEndReachedCalledDuringMomentum){
          setLastPage(lastPage+1);
          setOnEndReachedCalledDuringMomentum(true);
        }
        
      }

    function renderFooter() {
        try {
          // Check If Loading
          if (refreshing == true) {
            return (
              <ActivityIndicator/>
            )
          }
          else if (fromExploreScreen == true)
          {
            return (
              <View style={{paddingBottom:height/96}}>
                <View style={[styles.seperator]} />
                </View>
            );
          }
          else 
          {
            return (
              <View style={{paddingBottom:height/96}}>
                <View style={[styles.seperator]} />
                </View>
            );
          }
        }
        catch (error) {
          console.log(error);
        }
      }

      if(loading == true)
      {
        return (
            <View>
            <ActivityIndicator/>
            </View>
          )
      }
      else
      {
        if(chapters.length == 0)
        {
          return (
            <LottieView style={{
            paddingTop:height/6,
            //marginRight:width*0.22,
            height: height*12/24}} source={newAnimation} autoPlay loop />
          )
        }
        else
        {
          return(
          
            <FlatList
            data={chapters}
            renderItem={renderDatas}
            //numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.objectID}
            ItemSeparatorComponent={ItemSeperator}
            //ListHeaderComponent={this.renderHeader}
            ListFooterComponent={renderFooter}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
          /> 
          )
        }
        
}
}

export default withFirebaseHOC(SearchChapterScreen);

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: 'white',
    //borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    //padding: 3,
  }, 
  TextStyle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline'
  },
  tag: {
    backgroundColor: 'grey'
  }, 
  tagText: {
    color: 'black'
  },
  seperator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1
  },
  TextInputStyleClass2: {

    //textAlign: 'center',
    fontFamily: 'san-serif-light',
    fontStyle: 'italic',
    color: 'black',
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    backgroundColor: "white",
    width: (width * 3) / 4,
    //paddingTop: 15,
    paddingLeft: 10,
    height: height / 18,
    paddingRight: 10,

  }
 });
