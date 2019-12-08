

import React, {Component} from 'react';

import * as theme from '../screens/components/constants/theme';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, TextInput, Platform, StatusBar,TouchableOpacity, ScrollView, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import TrendingPodcast from './components/Explore/TrendingPodcast'
import BrowseBooks from './components/Explore/ExploreBook';
import TopChapters from './components/Explore/TopChapters';
import Story from './components/Explore/Story'
import CategoryScreen from './CategoryScreen'
import Podcast from './components/Home/Podcast'
import ExploreBook from './components/Explore/ExploreBook'

class Explore extends React.Component {

  constructor(props)
  {
    super(props)
    {
      //this.renderHeader = this.renderHeader.bind(this);
      this.state={
        books : [],
        podcasts : [],
        chapters : [],
        storytellers : [],
        loading : false
      };
    }
    //const ref = firestore().collection('Books');
  }

    componentWillMount()
    {
        this.startHeaderHeight = 60
        if(Platform.OS=='Android')
        {
            this.startHeaderHeight= StatusBar.currentHeight
        }
    }
   

    componentDidMount = () => {
      try {
        // Cloud Firestore: Initial Query
        this.retrieveData();
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveData = async () => {
      try {
        // Set State: Loading
        this.setState({
          loading: true,
        });
        console.log('Retrieving Data');
        // Cloud Firestore: Query
        
        // IMP let initialQuery_books = await firestore().collection('Books').doc('')

        // let adminBooks = await firestore().collection('Books').doc('DWZoAul5qUavpuNAE4vk').get();
        
        // explore_podcasts = [];
        // let queryPodcasts = adminBooks._data.explorePodcasts;
        // var ind = 0      
        // for(x in queryPodcasts){
        //   let str1 = queryPodcasts[ind];
        //   let query3 = await firestore().collectionGroup('Podcasts').where('PodcastID','==',str1).get();
        //   explore_podcasts[ind] = query3.docs[0]._data;
        //   ind = ind+1;
        //   console.log(query3);
        // }

        // explore_books = [];
        // let queryBooks = adminBooks._data.exploreBooks;
        let bookQuery = await firestore().collection('Books').where('exploreScreen','==',true).get();
        let podcastQuery = await firestore().collectionGroup('Podcasts').where('exploreScreen','==',true).get();
        let chapterQuery = await firestore().collectionGroup('Chapters').where('exploreScreen','==',true).get();
        // var ind = 0      
        // for(x in queryBooks){
        //   let str2 = queryBooks[ind];
        //   let query4 = await firestore().collection('Books').where('BookID','==',str2).get();
        //   explore_books[ind] = query4.docs[0]._data;
        //   ind = ind+1;
        //   console.log(query4);
        // }
        let documentBooks = bookQuery.docs.map(document => document.data());
        let documentPodcasts = podcastQuery.docs.map(document => document.data());
        let documentChapters = chapterQuery.docs.map(document => document.data());
        // Cloud Firestore: Query Snapshot
        // IMP let documentSnapshots_books = await initialQuery_books.get();
        //###let documentSnapshots_podcasts = await initialQuery_podcasts.get();
        // Cloud Firestore: Document Data
        // IMP let documentData_books = documentSnapshots_books.docs.map(document => document.data());
        //###let documentData_podcasts = documentSnapshots_podcasts.docs.map(document => document.data());
        // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
        // IMP let lastVisible = documentData_books[documentData_books.length - 1].id;
        // Set State
        this.setState({
          books: documentBooks,
          podcasts: documentPodcasts,
          chapters: documentChapters,
          // IMP lastVisible: lastVisible,
          loading: false,
        });
      }
      catch (error) {
        console.log(error);
      }
    };
    renderPodcasts=()=>
    {
       return this.state.podcasts.map((item, index)=>
      {
        return(<TrendingPodcast item={item} index={index} key ={index} navigation={this.props.navigation}/>)
      }) 

    }

    renderSectionPodcasts=()=>
    {
      
        return (
          <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
          {/* <View
            style={[
              styles.row,
              styles.recommendedHeader
            ]}
          >
            <Text style={{ fontSize: theme.sizes.font * 1.4 }}>Discover Podcasts</Text>
          </View> */}
          <View style={{flexDirection:'row' , flexWrap:'wrap',paddingBottom:10}}>{this.renderPodcasts()}</View>
          </View>
          
        )
    }
    renderChapters=()=>
    {
       return this.state.chapters.map((item, index)=>
      {
        return(<TopChapters item={item} index={index} key ={index} navigation={this.props.navigation}/>)
      }) 

    }

    renderSectionChapters=()=>
    {
      return (
        <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
        {/* <View
          style={[
            styles.row,
            styles.recommendedHeader
          ]}
        >
          <Text style={{ fontSize: theme.sizes.font * 1.4 }}>Discover Podcasts</Text>
        </View> */}
        <View style={{flexDirection:'row' , flexWrap:'wrap',paddingBottom:10}}>{this.renderChapters()}</View>
        </View>
        
      )
    }
    renderBooks=()=>
    {
       return this.state.books.map((item, index)=>
      {
        return(<ExploreBook item={item} index={index} key ={index} navigation={this.props.navigation}/>)
      }) 

    }

    renderSectionBooks=()=>
    {
      return (
        <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
        {/* <View
          style={[
            styles.row,
            styles.recommendedHeader
          ]}
        >
          <Text style={{ fontSize: theme.sizes.font * 1.4 }}>Discover Podcasts</Text>
        </View> */}
        <View style={{flexDirection:'row' , flexWrap:'wrap',paddingBottom:10}}>{this.renderBooks()}</View>
        </View>
        
      )
    }
  
    render() {
      
      if(this.state.books.length == 0)
      return (
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      );
      else
      return (
        /*<View style={styles.container}>
          <Text>HomeScreen</Text>
        </View>*/

        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
        <View style={styles.AppHeader}>
        <TouchableOpacity onPress={()=>this.props.navigation.toggleDrawer()}>
        <View style={{paddingLeft: 15,paddingRight:10 ,paddingVertical:26} }>
          <Icon name="bars" size={22}/>
        </View>
        </TouchableOpacity>
        <View style={{flex:1, paddingVertical:10}}>
        <View style={{height:this.startHeaderHeight, backgroundColor: 'white', paddingRight: 13, paddingVertical:10}}>
        
            <TextInput  underlineColorAndroid="transparent" placeholder="Search Books, Chapters, Authors" placeholderTextColor="black"  style={{ flex:1, fontWeight:'700',borderRadius:8, backgroundColor:'#dddd',
            elevation:1, paddingHorizontal: 10/*marginTop: Platform.OS=='android'?30:null*/}}
            />
        
        </View>
        </View> 
        </View>
        <ScrollView  scrollEventThrottle={16}>
        <View style={{height:120}}>
        <View style={{flex:1}}>
        <Text style={{fontSize:12, fontWeight:'200', paddingHorizontal: 20, textShadowColor:'black',fontFamily:'sans-serif-light'}}>
                        Top StoryTellers
                    </Text>
        </View>
        <View style={{flex:3}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
       
        <Story ImageUri={require('../assets/khaled.jpeg')} username={'khaled_230'}/>
        <Story ImageUri={require('../assets/dan.jpeg')} username={'Dan_Mos'}/>
        <Story ImageUri={require('../assets/dan2.jpeg')} username={'Cylie_storm'}/>
        <Story ImageUri={require('../assets/dan3.jpeg')} username={'brook_davis'}/>
        <Story ImageUri={require('../assets/dan4.jpeg')} username={'sylvester23'}/>
        <Story ImageUri={require('../assets/dan5.jpeg')} username={'Donzo'}/>
        <Story ImageUri={require('../assets/dan7.jpeg')} username={'Donzo2'}/>
        </ScrollView>
        </View>
        
        </View>
            
            <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                    <Text style={{fontSize:24, fontWeight:'200', paddingHorizontal: 20, textShadowColor:'black',fontFamily:'sans-serif-light'}}>
                        Trending Podcasts
                    </Text>
            </View>   
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:10}}>
                    {/* this.state.podcasts.map((item,key) =>
                    <TrendingPodcast ImageUri={item}/>                        
                    ) */}
                    {this.renderSectionPodcasts()}
                    
                    
                    {/* <TrendingPodcast ImageUri={require('../assets/davincicode.jpg')}/>
                    <TrendingPodcast ImageUri={require('../assets/chaos.jpg')}/>
                    <TrendingPodcast ImageUri={require('../assets/harrypotter.jpeg')}/>
                    <TrendingPodcast ImageUri={require('../assets/Westeros.jpg')}/> */}
                </ScrollView>
                <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                <Text style={{fontSize:24, fontWeight:'200', paddingHorizontal: 20, textShadowColor:'black', fontFamily:'sans-serif-light'}}>
                        Browse Books
                    </Text>
            </View> 
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:20}}>
            {this.renderSectionBooks()}
                   
                </ScrollView>
                {/* <TouchableOpacity onPress={()=>this.openCategoryScreen()}>
                <View>
                <Text style={{fontSize:10, fontWeight:'200', paddingHorizontal: 100,paddingTop: 5, textShadowColor:'black',fontFamily:'sans-serif-light'}}>View All</Text>
                </View>
                </TouchableOpacity> */}

                <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                <Text style={{fontSize:24, fontWeight:'200', paddingHorizontal: 20,  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
                        Top Chapters
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:20}}>
                    {this.renderSectionChapters()}                 
                    {/* <TopChapters ImageUri={require('../assets/boggart.jpg')}/>
                    <TopChapters ImageUri={require('../assets/hungergames.jpeg')}/> */}
                    
                </ScrollView>
            </View> 
            
                
            </ScrollView>

        
        </SafeAreaView>
      );
    }
  }

export default Explore;


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
  AppHeader:
  {
 flexDirection:'row',
 backgroundColor: 'white'
  },
  storie: {
    height: 50,
    width: 50,
    borderRadius: 60,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
}
});


