import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Platform, StatusBar,TouchableOpacity, ScrollView, Image,Dimensions, Animated,SectionList,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {Container, Content, Card, Button} from 'native-base'
import PodcastPlayer from './PodcastPlayer'
import { FlatList } from 'react-native-gesture-handler';
import BookList from './components/Home/BookList'
import * as theme from '../screens/components/constants/theme';
import Podcast from './components/Home/Podcast'
import firebaseApi from './config/Firebase/firebaseApi'
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
        limit : 4,
        lastVisible: null,
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
        let query = await firestore().collection('users').doc(userid).collection('privateUserData').doc('privateData').onSnapshot(
          (doc)=> {
          books_data = doc._data.book_recommendations;
          headerPodcasts_data = doc._data.podcast_recommendations.slice(0,20);
          podcasts_data = doc._data.podcast_recommendations.slice(0,4);
      
        this.setState({
          books: books_data,
          headerPodcasts: headerPodcasts_data,
          podcasts: podcasts_data,
          lastVisible: 0,
          loading: false
        });
      })
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveMore = async () => {
      try
       {
       this.setState({
         refreshing: true,
          }); 
          const  userid = this.props.firebase._getUid();
         
          var index = this.state.lastVisible;
          var minIndex = Math.min(index+4,24);
          try{
            let query = await firestore().collection('users').doc(userid).collection('privateUserData').doc('privateData').onSnapshot(
              (doc)=> {
                podcasts_data = doc._data.podcast_recommendations.slice(index,minIndex);
                let lastVisible = this.state.lastVisible + 4;
 
       this.setState({
         podcasts: [...this.state.podcasts, ...podcasts_data],
         //chapterPodcasts: documentData_chapterPodcasts,
         lastVisible:lastVisible,
         refreshing:false
       });
              });    
         }
         catch(error)
         {
           console.log(error);
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
   
    renderSectionBooks=()=>
    { 
      return (<BookList navigation={this.props.navigation} destinations={this.state.books} />)
    }

    renderData = ({ section, index }) => {
      const numColumns  = 2;
  
      if (index % numColumns !== 0) return null;
  
      const items = [];
  
      for (let i = index; i < index + numColumns; i++) {
        if (i >= section.data.length) {
          break;
        }
        items.push(<Podcast podcast={section.data[i]} index={index} navigation={this.props.navigation} />);
      }
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          {items}
        </View>
      );
    };
    
    renderHeader=()=>
    {
      var podcasts1 = this.state.headerPodcasts.slice(0,4);
      var podcasts2 = this.state.headerPodcasts.slice(4,8);
      var podcasts3 = this.state.headerPodcasts.slice(8,12);
      var podcasts4 = this.state.headerPodcasts.slice(12,16);
      var podcasts5 = this.state.headerPodcasts.slice(16,20);
      return(
        // <View><Text>PODCASTS</Text></View>
        <View style={{ paddingBottom:50, paddingRight:25, marginTop: Platform.OS == 'ios' ? 20 : 30 }}>
          
        <SectionList
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          sections={[
            { title: 'Username Starts with A', data: podcasts1 },
            { title: 'Username Starts with B', data: podcasts2 },
            { title: 'Username Starts with C', data: podcasts3 },
            { title: 'Username Starts with D', data: podcasts4 },
            { title: 'Username Starts with F', data: podcasts5 },
          ]}
          renderSectionHeader={({ section }) => (
            <ScrollView>
                <Text style={{fontSize: theme.sizes.font * 1.4, fontWeight: "bold",paddingHorizontal: 30,paddingTop:20,paddingBottom:10,   textShadowColor:'black',fontFamily:'sans-serif-light'}}>Record Book Podcasts
                </Text>
            {this.renderSectionBooks()}
            <Text style={{fontSize: theme.sizes.font * 1.4,fontWeight: "bold", paddingLeft: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black',fontFamily:'sans-serif-light'}}>Discover Podcasts
            </Text>
            </ScrollView>
          )}
          
          renderItem={this.renderData}
          keyExtractor={(item, index) => index}
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
        data={this.state.podcasts}s
        renderItem={this.renderDatas}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.PodcastID}
        ListHeaderComponent={this.renderHeader}
         ListFooterComponent={this.renderFooter}
        onEndReached={this.retrieveMore}
        onEndReachedThreshold={0.5}
        refreshing={this.state.refreshing}
      />   
      )
    }

    render() {
      if(this.state.loading === true)
        return <ActivityIndicator/>
      else
        return (
        <SafeAreaView style={{flex:1, backgroundColor:'#F5FCFF'}}>
           {this.renderMainHeader()}
      <View style = {{paddingBottom:50}}>
        {this.renderPodcasts()}
        </View>
  </SafeAreaView> 
      );
    }
  }

export default withFirebaseHOC(HomeScreen);