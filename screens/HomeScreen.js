import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, View,SafeAreaView, TextInput, Platform, StatusBar,TouchableOpacity, ScrollView, Image,Dimensions, Animated,SectionList,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {Container, Content, Card, Button} from 'native-base'
import PodcastPlayer from './PodcastPlayer'
import { FlatList } from 'react-native-gesture-handler';
import BookList from './components/Home/BookList'
import * as theme from '../screens/components/constants/theme';
import Podcast from './components/Home/Podcast'
import firebaseApi from './config/Firebase/firebaseApi'
import {Text} from './components/categories/components';
import {withFirebaseHOC} from '../screens/config/Firebase'

var {width, height}=Dimensions.get('window')
const styles = StyleSheet.create({
  flex: {
    flex: 0,
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding * 1.33,
    paddingBottom: theme.sizes.padding * 0.66,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articles: {
  },
  destinations: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  destination: {
    width: width - (theme.sizes.padding * 2),
    height: width * 0.6,
    marginHorizontal: theme.sizes.margin,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding * 0.66,
    borderRadius: theme.sizes.radius,
  },
  destinationInfo: {
    position: 'absolute',
    borderRadius: theme.sizes.radius,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding / 2,
    bottom: 10,
    left: (width - (theme.sizes.padding * 4)) / (Platform.OS === 'ios' ? 3.2 : 3),
    backgroundColor: theme.colors.white,
    width: width - (theme.sizes.padding * 4),
  },
  recommended: {
  },
  recommendedHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.sizes.padding,
  },
  recommendedList: {
  },
  recommendation: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    marginHorizontal: 8,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    borderRadius: theme.sizes.radius,
    marginVertical: theme.sizes.margin * 0.5,
  },
  recommendationHeader: {
    overflow: 'hidden',
    borderTopRightRadius: theme.sizes.radius,
    borderTopLeftRadius: theme.sizes.radius,
  },
  recommendationOptions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.sizes.padding / 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  recommendationTemp: {
    fontSize: theme.sizes.font * 1.25,
    color: theme.colors.white
  },
  recommendationImage: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    height: (width - (theme.sizes.padding * 2)) / 2,
  },
  avatar: {
    width: theme.sizes.padding,
    height: theme.sizes.padding,
    borderRadius: theme.sizes.padding / 2,
  },
  rating: {
    fontSize: theme.sizes.font * 2,
    color: theme.colors.white,
    fontWeight: 'bold'
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  dots: {
    width: 10,
    height: 10,
    borderWidth: 2.5,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
    borderColor: 'transparent',
  },
  activeDot: {
    width: 12.5,
    height: 12.5,
    borderRadius: 6.25,
    borderColor: theme.colors.active,
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
  AppHeader:
  {
 flexDirection:'row',
 backgroundColor: '#101010', 
  },
  storie: {
    height: 50,
    width: 50,
    borderRadius: 60,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
  }, 
    sideMenuIcon:
  {
    resizeMode: 'center',
    width: 28, 
    height: 28, 
    marginRight: 10,
    marginLeft: 20
    
  },
});

var {width, height}=Dimensions.get('window')

class HomeScreen extends React.Component {
  constructor(props)
  {
    super(props)
    {
      this.state={
        books : [],
        headerPodcasts : [],
        podcasts : [],
        //allPodcasts : [],
        limit : 8,
        initialLimit : 40,
        lastVisibleID:null,
        loading: false,
        refreshing: false,
      };
    }
  }

  static navigationOptions=({navigation})=>({
    title:"Home", 
    drawerIcon:()=> <Icon name="home" size={24} style={{color:'white'}}/>
  });

    componentDidMount = async () => {
      try {
        this.retrieveData();
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveData = async () => {
      try {
        this.setState({
          loading: true,
        });
        console.log('Retrieving Data');
        const  userid = this.props.firebase._getUid();

        // let userDoc = await firestore().collection('users').doc(userid).get();
        // useDispatch({type:"CHANGE_NAME", payload: userDoc.data.name});
        // useDispatch({type:"CHANGE_USER_NAME", payload: userDoc.data.username});
        // useDispatch({type:"CHANGE_DISPLAY_PICTURE", payload: userDoc.data.displayPicture});

       // dispatch({type:"SET_PODCAST", payload: props.podcast})

        //For books in section list
        let bookDocuments = await firestore().collection('users').doc(userid).collection('privateUserData')
        .doc('privateData').collection('bookRecommendations').get()
        let bookPodcasts = bookDocuments.docs.map(document => document.data());

        //For podcasts in section list
        let headerpodcasts = await firestore().collection('users').doc(userid).collection('privateUserData')
                         .doc('privateData').collection('podcastRecommendations')
                         .orderBy('podcastID').limit(this.state.initialLimit).get()
        
        let documentData_podcasts = headerpodcasts.docs.map(document => document.data());
        var lastVisiblePodcast = this.state.lastVisibleID;
        lastVisiblePodcast = documentData_podcasts[documentData_podcasts.length - 1].podcastID; 

       
        //For Flatlist podcasts
        let mainpodcasts = await firestore().collection('users').doc(userid).collection('privateUserData')
        .doc('privateData').collection('podcastRecommendations')
        .orderBy('podcastID').startAfter(lastVisiblePodcast).limit(this.state.limit).get()

        let podcastsData = mainpodcasts.docs.map(document => document.data());
        lastVisiblePodcast = podcastsData[podcastsData.length - 1].podcastID; 

      this.setState({
            books: bookPodcasts,
            headerPodcasts: documentData_podcasts,
            podcasts: podcastsData,
            lastVisibleID:lastVisiblePodcast,
            loading: false, 
            onEndReachedCalledDuringMomentum : true
          });

      }
      catch (error) {
        console.log(error);
      }
    };

    onEndReached = ({ distanceFromEnd }) => {

      if(!this.onEndReachedCalledDuringMomentum){
        this.retrieveMore();
          this.onEndReachedCalledDuringMomentum = true;
      }
      
    }

    retrieveMore = async () => {
     try
      {
        {console.log("retrieveMoreBookPodcasts starts()")}

      this.setState({
        refreshing: true
         }); 

         const  userid = this.props.firebase._getUid();
         let additionalQuery = 9;
         try{
          additionalQuery = await firestore().collection('users').doc(userid).collection('privateUserData')
          .doc('privateData').collection('podcastRecommendations')
          .orderBy('podcastID').startAfter(this.state.lastVisibleID).limit(this.state.limit);
        
      // Cloud Firestore: Query Snapshot
      {console.log("retrieveMorePodcasts afterQuery()")}
                
         
        }
        catch(error)
        {
          console.log(error);
        }
        let documentSnapshots=9;
        try{
         documentSnapshots = await additionalQuery.get();
        }
        catch(error)
        {
            console.log(error);
        }
        
      // Cloud Firestore: Document Data
      let documentData = documentSnapshots.docs.map(document => document.data());
      // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
      if(documentData.length != 0)
      {
      let lastVisibleBook = documentData[documentData.length - 1].podcastID;
       
      if(this.state.lastVisibleID===lastVisibleBook){
          this.setState({
                  refreshing:false
              });
      }
      else
      {
        this.setState({
            refreshing:false,
             // books: books_data,
           podcasts: [...this.state.podcasts, ...documentData],
           lastVisibleID:lastVisibleBook,
           refreshing: false, 
           onEndReachedCalledDuringMomentum : true
          });

      }
    }
      else
      {
        this.setState({
          refreshing:false
      });
      }
      }
      catch(error){
      console.log(error);
      }
     
     }

    renderMainHeader=()=>
    {
      return(
      <View style={styles.AppHeader}>
         <TouchableOpacity onPress={()=>this.props.navigation.toggleDrawer()}>
        <View style={{paddingLeft: 15,paddingRight:10 ,paddingVertical:18} }>
          <Icon name="bars" size={22} style={{color:'white'}}/>
        </View>
        </TouchableOpacity>
        <View>
        <Text style={{fontFamily:'sans-serif-light', color:'white', paddingLeft:15, fontSize:15, paddingTop:20}}>Papyrus</Text>
        </View>

        </View>
      )
    }
   
    renderSectionBooks=(title)=>
    { 
       
      switch(title) {
        case "A":
          return (<View>
          
          <View style={{backgroundColor:'white'}}>  
          <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Book Podcasts</Text>
          <BookList navigation={this.props.navigation} destinations={this.state.books}/>
          </View>
          </View>)
        case "B":
          return (<View style={{paddingTop:30,paddingBottom:30}}>
            
            <View style={{backgroundColor:'#c9aa88'}}>
            <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Chapter Podcasts</Text>
          <BookList navigation={this.props.navigation} destinations={this.state.books}/>
          </View>
          </View>)
        case "C":
          return (
          <View style={{paddingTop:30,paddingBottom:30}}>
            
            <View style={{backgroundColor:'#99AFD7'}}>
            <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Chapter Podcasts</Text>
          <BookList navigation={this.props.navigation} destinations={this.state.books}/>
          </View>
          </View>)
        case "D":
          return (<View style={{paddingTop:30,paddingBottom:30}}>
            
            <View style={{backgroundColor:'#C76E95'}}>
            <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Chapter Podcasts</Text>
          <BookList navigation={this.props.navigation} destinations={this.state.books}/>
          </View>
          </View>)
        case "E":
          return (<View style={{paddingTop:30,paddingBottom:30}}>
            
            <View style={{backgroundColor:'#C6FC5F'}}>
            <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Chapter Podcasts</Text>
          <BookList navigation={this.props.navigation} destinations={this.state.books}/>
          </View>
          </View>)
        }
    }

    renderData = ({ section, index }) => {
      const numColumns  = 2;
  
      if (index % numColumns !== 0) return null;
  
      const items = [];
  
      for (let i = index; i < index + numColumns; i++) {
        if (i >= section.data.length) {
          break;
        }
        items.push(<Podcast podcast={section.data[i]} key={section.data[i].podcastID}  navigation={this.props.navigation}  />);
      }
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: width/10
          }}
        >
          {items}
        </View>
      );
    };
    
    renderHeader=()=>
    {
      var podcasts1 = this.state.headerPodcasts.slice(0,8);
      var podcasts2 = this.state.headerPodcasts.slice(8,16);
      var podcasts3 = this.state.headerPodcasts.slice(16,24);
      var podcasts4 = this.state.headerPodcasts.slice(24,32);
      var podcasts5 = this.state.headerPodcasts.slice(32,40);
      return(
        // <View><Text>PODCASTS</Text></View>
        <View style={{ paddingBottom:50, marginTop: Platform.OS == 'ios' ? 20 : 30 }}>
          
        <SectionList
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          sections={[
            { title: 'A', data: podcasts1},
            { title: 'B', data: podcasts2 },
            { title: 'C', data: podcasts3 },
            { title: 'D', data: podcasts4 },
            { title: 'E', data: podcasts5 },
          ]}
          keyExtractor={item => item.podcastID}
          renderSectionHeader={({ section }) => (
            <ScrollView>
                
                {console.log("SECTION DATAAAAAAAAAAAAA: ")}
                {console.log(section)}
                {console.log(section.title)}

            {this.renderSectionBooks(section.title)}
            <Text h3 bold style={{paddingLeft: 30,   textShadowColor:'black'}}>Discover Podcasts
            </Text>
            </ScrollView>
          )}
          
          renderItem={this.renderData}
          
        />
        
      </View>
      )
    }
    
    renderDatas=({item,index})=>
    {
       return(
         <View>
        <Podcast podcast={item} index={index} navigation={this.props.navigation}/>
        </View>
       )
    }

    renderFooter = () => {
      try {
        // Check If Loading
        if (this.state.refreshing) {
          return (
            <ActivityIndicator />
          )
        }
        else {
          return null;
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    renderPodcasts=()=>
    {
      return (  
        <FlatList
        data={this.state.podcasts}
        renderItem={this.renderDatas}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.podcastID}
        ListHeaderComponent={this.renderHeader}
         ListFooterComponent={this.renderFooter}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.01}
        refreshing={this.state.refreshing}
        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
      />   
      )
    }

    render() {
      if(this.state.loading === true)
        return <ActivityIndicator/>
      else
        return (
        // <SafeAreaView style={{flex:1, backgroundColor:'#F5FCFF'}}>
        <View>
           {this.renderMainHeader()}
      <View style = {{paddingBottom:50}}>
        {this.renderPodcasts()}
        </View>
        </View>
  // </SafeAreaView> 
      );
    }
  }


export default withFirebaseHOC(HomeScreen);
