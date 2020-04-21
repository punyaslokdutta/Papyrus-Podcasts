import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import CatgeoryChapterItem from './components/CategoryChapterItem'
import {withFirebaseHOC} from '../../config/Firebase'


var {width, height}=Dimensions.get('window')

class CategoryChapter extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        chapters:[], 
        limit:5,
        lastVisibleChapter:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true
      }
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
      
      this.setState({
        loading: true,
      });
      console.log('Retrieving Data');
      
      try{
        const genre = this.props.navigation.state.params;
        let documentChapters = await firestore().collectionGroup('chapters').where("genres","array-contains",genre.category)
                              .orderBy('createdOn','desc').limit(this.state.limit).get();
        let documentDataChapters = documentChapters.docs.map(document => document.data());

        var lastVisible = this.state.lastVisibleChapter;
        if(documentDataChapters.length != 0)
          lastVisible = documentDataChapters[documentDataChapters.length - 1].createdOn;        
         
        this.setState({
          chapters: documentDataChapters,
          lastVisibleChapter:lastVisible
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

    retrieveMoreCategoryChapters = async () => {
     
      console.log("retrieveMoreCategoryChapters starts()")
      this.setState({
        refreshing: true
         }); 

      try{
        const genre = this.props.navigation.state.params;
        let categoryChapters = await firestore().collectionGroup('chapters').where('genres','array-contains',genre.category)
                          .orderBy('createdOn','desc').startAfter(this.state.lastVisibleChapter)
                          .limit(this.state.limit).get();

        let documentData = categoryChapters.docs.map(document => document.data());
        if(documentData.length != 0)
        {
          let lastVisibleChapter = documentData[documentData.length - 1].createdOn;
          if(this.state.lastVisibleChapter != lastVisibleChapter)
            {
              this.setState({
                  chapters: [...this.state.chapters, ...documentData],
                  lastVisibleChapter : lastVisibleChapter
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
        <CatgeoryChapterItem chapter={item} index={index} navigation={this.props.navigation}/>
        </View>
       )
    }

   

    renderFooter = () => {
      if (this.state.refreshing == true) {
        return (
          <ActivityIndicator />
        )
      }
      else {
        return null;
      }
    }

    onEndReached = ({ distanceFromEnd }) => {
      if(this.state.chapters.length > (this.state.limit - 1))
      {
        if(!this.onEndReachedCalledDuringMomentum)
        {
          this.retrieveMoreCategoryChapters()
          this.onEndReachedCalledDuringMomentum = true;
        }
      }
  }

  separator = () => <View style={[styles.separator,{paddingTop:height/96}]} />;
   
    render() {
      const { navigation } = this.props;
      return (
       
         <View style = {{paddingBottom:20}}>
             <View>

         <FlatList nestedScrollEnabled={true}
        data={this.state.chapters}
        renderItem={this.renderData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.chapterID}
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
  

export default withFirebaseHOC(CategoryChapter);


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
