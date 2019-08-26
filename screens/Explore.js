

import React, {Component} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Platform, StatusBar,TouchableOpacity, ScrollView, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import TrendingPodcast from './components/Explore/TrendingPodcast'
import BrowseBooks from './components/Explore/BrowseBooks';
import TopChapters from './components/Explore/TopChapters';
import Story from './components/Explore/Story'
import CategoryScreen from './CategoryScreen'


class Explore extends React.Component {

    componentWillMount()
    {
        this.startHeaderHeight = 60
        if(Platform.OS=='Android')
        {
            this.startHeaderHeight= StatusBar.currentHeight
        }
    }
   
    render() {
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
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:20}}>
                    <TrendingPodcast ImageUri={require('../assets/davincicode.jpg')}/>
                    <TrendingPodcast ImageUri={require('../assets/chaos.jpg')}/>
                    <TrendingPodcast ImageUri={require('../assets/harrypotter.jpeg')}/>
                    <TrendingPodcast ImageUri={require('../assets/Westeros.jpg')}/>
                </ScrollView>
                <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                <Text style={{fontSize:24, fontWeight:'200', paddingHorizontal: 20, textShadowColor:'black', fontFamily:'sans-serif-light'}}>
                        Browse Books
                    </Text>
            </View> 
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:20}}>
                    <BrowseBooks ImageUri={require('../assets/anthology.jpeg')}/>
                    <BrowseBooks ImageUri={require('../assets/Mystery.jpeg')}/>
                    <BrowseBooks ImageUri={require('../assets/Romance.jpeg')}/>
                    <BrowseBooks ImageUri={require('../assets/anthology.jpeg')}/>
                    <BrowseBooks ImageUri={require('../assets/Mystery.jpeg')}/>
                </ScrollView>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('CategoryScreen')}>
                <View>
                <Text style={{fontSize:10, fontWeight:'200', paddingHorizontal: 100,paddingTop: 5, textShadowColor:'black',fontFamily:'sans-serif-light'}}>View All</Text>
                </View>
                </TouchableOpacity>

                <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                <Text style={{fontSize:24, fontWeight:'200', paddingRight: 20,  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
                        Top Chapters
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:20}}>
                    <TopChapters ImageUri={require('../assets/boggart.jpg')}/>
                    <TopChapters ImageUri={require('../assets/hungergames.jpeg')}/>
                    
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


