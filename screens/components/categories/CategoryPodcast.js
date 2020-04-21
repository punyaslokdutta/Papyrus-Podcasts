import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import {withFirebaseHOC} from '../../config/Firebase'
import CategoryPodcastItem from './components/CategoryPodcastItem'

var {width, height}=Dimensions.get('window')

class CategoryPodcast extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        podcasts:[], 
        limit:7,
        lastVisiblePodcast:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true
      }
      }
    
     }
   
     componentDidMount = () => {
      try {
        this.retrieveData();
      }
      catch (error) {
        console.log(error);
      }
    };
    

    retrieveData = async () => {
      
      this.setState({
        loading: true,
      });
      console.log('Retrieving Data');
      
      try {  
        const genre = this.props.navigation.state.params;
        let documentPodcasts = await firestore().collectionGroup('podcasts').where('genres','array-contains',genre.category)
                                    .orderBy('createdOn','desc').limit(this.state.limit).get();
        let documentDataPodcasts = documentPodcasts.docs.map(document => document.data());

        var lastVisible = this.state.lastVisiblePodcast;
        if(documentDataPodcasts.length != 0)
          lastVisible = documentDataPodcasts[documentDataPodcasts.length - 1].createdOn;        
         
        this.setState({
          podcasts: documentDataPodcasts,
          lastVisiblePodcast:lastVisible
        });
      }
      catch (error) {
        console.log(error);
      }
      finally {
        this.setState({
          loading: false
        });
      }
    };

    retrieveMoreCategoryPodcasts = async () => {
     
      console.log("retrieveMoreBookPodcasts starts()")
      this.setState({
        refreshing: true
         });
      try{
        const genre = this.props.navigation.state.params;
        let categoryPodcasts = await firestore().collectionGroup('podcasts').where('genres','array-contains',genre.category)
                              .orderBy('createdOn','desc').startAfter(this.state.lastVisiblePodcast)
                              .limit(this.state.limit).get();
        
        let documentData = categoryPodcasts.docs.map(document => document.data());
        if(documentData.length != 0)
        {
          let lastVisible = documentData[documentData.length - 1].createdOn;
          if(this.state.lastVisiblePodcast != lastVisible)
          {
            this.setState({
                podcasts: [...this.state.podcasts, ...documentData],
                lastVisiblePodcast : lastVisible
              });
          }
        }
      }
      catch(error){
        console.log(error);
      }
      finally {
        this.setState({
          refreshing: false
        });
      }
    }

    renderData=({item,index})=>
    {
       return(
         <View>
        <CategoryPodcastItem podcast={item} index={index} navigation={this.props.navigation}/>
        </View>
       )
    }


    renderFooter = () => {
      
      if (this.state.refreshing===true) {
        return (
          <ActivityIndicator />
        )
      }
      else {
        return null;
      }
    }

    onEndReached = ({ distanceFromEnd }) => {
      if(this.state.podcasts.length > (this.state.limit - 1))
      {
        if(!this.onEndReachedCalledDuringMomentum)
        {
          this.retrieveMoreCategoryPodcasts();
          this.onEndReachedCalledDuringMomentum = true;
        }
      }
  }
  separator = () => <View style={[styles.separator,{paddingTop:height/96}]} />;
   
    render() {
      return (
       
         <View style = {{paddingBottom:20}}>
             <View>
                 
         <FlatList nestedScrollEnabled={true}
        data={this.state.podcasts}
        renderItem={this.renderData}
        //numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
       // ListHeaderComponent={this.renderHeader}
       ItemSeparatorComponent={this.separator}
         ListFooterComponent={this.renderFooter}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={this.state.refreshing}
        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
      />
      </View>
         </View>
      
      );
    }
  }
  

export default withFirebaseHOC(CategoryPodcast);


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
  separator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1
  }
});
