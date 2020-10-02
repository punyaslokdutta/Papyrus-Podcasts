import React, { useEffect, useState , useRef} from 'react';
import {View,FlatList,ActivityIndicator,BackHandler,StyleSheet,  SafeAreaView,Image,  TextInput, Dimensions, TouchableOpacity} from 'react-native';
import ItemSeperator from "./components/Explore/ItemSeperator";
import algoliasearch from "algoliasearch";
import {withFirebaseHOC} from './config/Firebase'
import {useSelector,useDispatch} from 'react-redux';
import InviteUserItem from './components/Explore/InviteUserItem';
import LottieView from 'lottie-react-native';
import newAnimation from '../assets/animations/lf30_editor_KtvLMb.json'

import ExtraDimensions from 'react-native-extra-dimensions-android';
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();


var {width, height}=Dimensions.get('window')
const InviteUserScreen=(props)=>
{
    const dispatch=useDispatch();
    const algoliaAPPID = useSelector(state=>state.userReducer.algoliaAPPID);
    const algoliaAPIKey = useSelector(state=>state.userReducer.algoliaAPIKey);
    const searchClient = algoliasearch(
      algoliaAPPID,
      algoliaAPIKey
    );
    const index = searchClient.initIndex('prod_users');

    const [Query, setQuery]=useState(null);

    const [searchQuery,setSearchQuery] = useState(null);
    console.log("Search Query: ",searchQuery);
    const [users,setUsers] = useState([]);
    const [lastPage,setLastPage] = useState(0);
    const [loading,setLoading] = useState(false);
    const [refreshing,setRefreshing] = useState(false);

    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);
    const numHits = 12;

    useEffect( ()=>
        {
            setLoading(true);
            console.log("Inside useEffect of InviteUserScreen")
            if(searchQuery == "" || searchQuery == null)
            {
                setUsers(null)
                setLoading(false);
            }

            searchQuery && index.search(searchQuery,{
                page : 0,
                hitsPerPage : numHits
            }).then(({hits})=>
            {
                setUsers(hits);
                setLoading(false);
                console.log(hits);
            })
            
            
        }, [searchQuery]
    )

    useEffect( ()=>
        {
            setRefreshing(true);
            console.log("Inside useEffect of lastPage")
 
            if(searchQuery == "" || searchQuery == null)
            {
                setUsers(null)
                setRefreshing(false);
            }

            searchQuery && index.search(searchQuery,{
                page : lastPage,
                hitsPerPage : numHits
            }).then(({hits})=>
            {

                (users != undefined) && (users!==null) && (users.length != 0) && (hits.length != 0) && 
                setUsers([...users,...hits]);
                setRefreshing(false);
                console.log(hits);
            })
           // setRefreshing(false);
        }, [lastPage]
    )

    useEffect(
        () => {
          return () => {
            console.log(" back_Button_Press Unmounted");
            dispatch({type:"SET_ALGOLIA_QUERY",payload:"papyrus"})
          };
        }, [])

    function renderDatas({item,index})
    {
      console.log(item)
      if( props.navigation.state.params.inviteeUserIDs.indexOf(item.objectID) == -1)
       return(
         <InviteUserItem 
            user={item} 
            inviteeUserIDs={props.navigation.state.params.inviteeUserIDs}
            channelName={props.navigation.state.params.channelName}
            addUserIDToDiscussion={props.navigation.state.params.addUserIDToDiscussion} 
            index={index} 
            navigation={props.navigation}/> 
       )
      else
        return (
            null
        )
    }

    function onEndReached({ distanceFromEnd }){

        if(!onEndReachedCalledDuringMomentum){
          setLastPage(lastPage+1);
          setOnEndReachedCalledDuringMomentum(true);
        }
        
      }

      
    function renderFooter() {

        if (refreshing == true) {
            return (
            <ActivityIndicator/>
            )
        }
        else{
            return null;
        }     
    }

    function renderUsers() {
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
        if(users === null || users === undefined || users.length == 0)
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
            data={users}
            renderItem={renderDatas}
            //numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.objectID}
            ItemSeparatorComponent={ItemSeperator}
            //ListHeaderComponent={this.renderHeader}
            ListFooterComponent={renderFooter}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.01}
            refreshing={refreshing}
            onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
          /> 
          )
        } 
      }
    }
      return (
        <View style={{paddingTop:20,marginTop:STATUS_BAR_HEIGHT}}>
         <View style={styles.searchBoxContainer}>
          <TextInput
            style={styles.textBox}
            //value={value}
            returnKeyType='search'
            onChangeText={(text)=>{setQuery(text)}}
            onSubmitEditing={()=>{ setSearchQuery(Query) }}
            placeholder="Search users"
            placeholderTextColor={'black'}
            />
        </View>
        {renderUsers()}
        </View>
      )
      
      
}

export default withFirebaseHOC(InviteUserScreen);

const styles = StyleSheet.create({
    searchBoxContainer: {
        width: "100%",
        flexDirection: "row",
        fontFamily:'sans-serif-light'
      },
    textBox: {
        height: 40,
        borderWidth: 1,
        borderColor: "#333",
        padding: 10,
        margin: 10,
        flex: 1,
        fontWeight:'400',
        borderRadius:2,
        backgroundColor:'#dddd',
        fontSize:12,
        fontFamily:'sans-serif-light',
        paddingTop: 7,
        paddingBottom:7,
        paddingHorizontal: 10 
    },
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
