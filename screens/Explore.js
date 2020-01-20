import React, {Component} from 'react';
import SearchScreen from './components/Explore/SearchScreen'
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
import searchIcon from '../assets/searchIcon.png';
class Explore extends React.Component {

  constructor(props)
  {
    super(props)
    {
      //this.renderHeader = this.renderHeader.bind(this);
      this.state={
        storytellers : [],
        podcasts : [],
        books : [],
        chapters : [],
        loading : false
      };
    }
    //const ref = firestore().collection('Books');
  }
   
    componentDidMount = () => {
      try {
        this.startHeaderHeight = 60
        if(Platform.OS=='Android')
        {
            this.startHeaderHeight= StatusBar.currentHeight
        }
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
       
        let userQuery = await firestore().collection('users').where('isTopStoryTeller','==',true).get(); 
        let podcastQuery = await firestore().collectionGroup('Podcasts').where('isTrendingPodcast','==',true).get();
        let bookQuery = await firestore().collectionGroup('Podcasts').where('isShortStory','==',true).get();
        let chapterQuery = await firestore().collectionGroup('Podcasts').where('isClassicNovel','==',true).get();
        
        let documentUsers = userQuery.docs.map(document => document.data());
        let documentPodcasts = podcastQuery.docs.map(document => document.data());
        let documentBooks = bookQuery.docs.map(document => document.data());
        let documentChapters = chapterQuery.docs.map(document => document.data());
        
        this.setState({
          storytellers: documentUsers,
          podcasts: documentPodcasts,
          books: documentBooks,
          chapters: documentChapters,
          // IMP lastVisible: lastVisible,
          loading: false,
        });
      }
      catch (error) {
        console.log(error);
      }
    };

    renderStoryTellers = () =>
    {
      return this.state.storytellers.map((item, index)=>
      {
        return(<Story item={item} index={index} key ={index} navigation={this.props.navigation}/>)
      }) 
    }

    renderSectionStoryTellers = () =>
    {
      return (
        <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
        <View style={{flexDirection:'row' , flexWrap:'wrap',paddingBottom:10}}>{this.renderStoryTellers()}</View>
        </View>
        
      )
    }

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
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SearchScreen')}>
        <View style={{flexDirection:'row',height:this.startHeaderHeight, backgroundColor: 'white', paddingRight: 13, paddingVertical:10}}>
        
            <Text style={{ flex:1, fontWeight:'700',borderRadius:8,backgroundColor:'#dddd',fontSize:15,
              paddingTop: 7, paddingHorizontal: 10 }}>
            
              <Icon style={{paddingHorizontal:10,paddingTop:20 }} name="search" size={20} />
              

              {"  "}Search Books, Chapters, Authors
               </Text> 

        </View>
        </TouchableOpacity>
        </View> 
        </View>
        <ScrollView  scrollEventThrottle={16}>
        <View style={{height:120}}>
        <View style={{flex:1}}>
        <Text style={{fontSize:20, fontWeight:'200', paddingHorizontal: 20, textShadowColor:'black',fontFamily:'sans-serif-light'}}>
                        Top StoryTellers
                    </Text>
        </View>
        <View style={{flex:3,paddingTop:10}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        
        {this.renderSectionStoryTellers()}
        </ScrollView>
        </View>
        
        </View>
            
            <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                    <Text style={{fontSize:20, fontWeight:'normal', paddingHorizontal: 20, textShadowColor:'black',fontFamily:'sans-serif-light'}}>
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
                <Text style={{fontSize:20, fontWeight:'normal', paddingHorizontal: 20, textShadowColor:'black', fontFamily:'sans-serif-light'}}>
                        Short Stories
                    </Text>
            </View> 
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:10}}>
            {this.renderSectionBooks()}
                   
                </ScrollView>
                {/* <TouchableOpacity onPress={()=>this.openCategoryScreen()}>
                <View>
                <Text style={{fontSize:10, fontWeight:'200', paddingHorizontal: 100,paddingTop: 5, textShadowColor:'black',fontFamily:'sans-serif-light'}}>View All</Text>
                </View>
                </TouchableOpacity> */}

                <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                <Text style={{fontSize:20, fontWeight:'normal', paddingHorizontal: 20,  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
                        Classic Novels
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:10}}>
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


