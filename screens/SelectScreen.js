
//Passing Props Child to Parent — Use a callback and states
//React’s one-way data-binding model means that child components cannot send back values to parent components unless explicitly allowed to do so
/*React Context permits to hold state at the root of your component hierarchy, and be able to inject this state easily into very deeply nested components, without the hassle to have to pass down props to every intermediate components.
*/ 
import React, {Component} from 'react';
import { TouchableOpacity,StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableWithoutFeedback} from 'react-native';
import { Container,  Content , Button,Card, CardItem, Thumbnail, Body} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HomeScreen from '../screens/HomeScreen'
import AddModal from '../screens/components/Record/AddModal'
import AddChapterModal from '../screens/components/Record/AddChapterModal'
import StartRecordScreen from '../screens/StartRecordScreen'
import { TagSelect } from 'react-native-tag-select'
import PreviewScreen from '../screens/PreviewScreen'
//import PlayerContext from '../screens/components/PodcastPlayer/PlayerContext'


const { width, height } = Dimensions.get('window');

class SelectScreen extends Component {
  //static contextType = PlayerContext

    constructor(props)
    {
        super(props);
        this.onPressAdd2=this.onPressAdd2.bind(this)
        this.onPressAdd=this.onPressAdd.bind(this)
        this.setLanguage=this.setLanguage.bind(this)
        this.unsetLanguage=this.unsetLanguage.bind(this)
        //this.renderDetailsSection=this.renderDetailsSection.bind(this)
        this.state={
          categoryClicked: '', 
          BookName: '',
          ChapterName: '', 
          AuthorName: '', 
          LanguageSelected:'', 
          eventSource: 'SelectScreen'

          
        }
       

        
    }
    componentDidMount=()=>
    {
    // console.log(this.context)
     //const ctx =this.context.setPodcast(null, this.state.eventSource )
    // console.log(this.context)

    }


    componentDidUpdate=()=>
    {
      //if(this.context.podcast!==null && this.context.eventSource!=='Podcast')
      //{
      //console.log(this.context)
      //const ctx =this.context.setPodcast(null, this.state.eventSource)
      //console.log(this.context)
      //}

    }

    onPressAdd2()
    {
        //console.log(this.ref)
        this.refs.addChapterModal.showAddModal();
       
    }

     onPressAdd()
     {
        this.refs.addModal.showAddModal();


        
     }

     setLanguage(language)
     {
       console.log(language)
       this.setState(
         {
           LanguageSelected:language
         }
       )
     }
     unsetLanguage()
     {
      console.log(this.state.LanguageSelected)
       this.setState(
         {
           LanguageSelected:''
         }
       )
     }

     

     callbackFunction=(data)=>
     {
       if(data.categoryClicked==='Chapter')
       {
       this.setState(
         {
            categoryClicked: data.categoryClicked,
            BookName:data.newBookName,
            ChapterName: data.newChapterName,
            AuthorName: data.newAuthorName

         }  
       )
      }
      else if (data.categoryClicked==='Book'){
        this.setState(
          {
             categoryClicked: data.categoryClicked,
             BookName:data.newBookName,
             ChapterName:'',
             AuthorName: data.newAuthorName
 
          }  
        )

      }
        console.log(data)
       console.log(this.state)
    }   





     
     
  
   
    render() {
      const data = [
        { id: 1, label: 'English' },
        { id: 2, label: 'Hindi' },
        { id: 3, label: 'Bengali' },
        { id: 4, label: 'Telugu' },
        { id: 5, label: 'Marathi' },
        { id: 6, label: 'Tamil' },
        { id: 7, label: 'Mandarin' },
        { id: 8, label: 'Spanish' },
        { id: 9, label: 'Assamese' },
        { id: 10, label: 'Odiya' },

      ];
      
      return (
      
          

        <SafeAreaView style={{flex:1, backgroundColor:'#101010'}}>

        <View style={styles.AppHeader}>
        <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)}>
        <View style={{paddingLeft: width/12 ,paddingVertical:height/20, flexDirection:'row'} }>
          <Icon name="times" size={20} style={{color:'white'}}/>
          <Text style={{fontFamily:'san-serif-light', color:'white', paddingLeft:(width*7)/24, fontSize:20}}>Select</Text>
        </View>
       
        
        

        </TouchableOpacity>

        </View>
        <View style={{paddingVertical:height/24, alignItems:'center'} }>
          <Text style={{fontFamily:'sans-serif-light', color:'white',  fontSize:14}}>Select the category you want</Text>
          <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14}}>to record/upload</Text>
          
        </View>

         <View style={{paddingVertical:height/20, flexDirection:'row', paddingLeft:width/4} }>
         <View>
         <TouchableOpacity onPress={this.onPressAdd}  >
         <Icon name="book" size={50} style={{color:'white'}}/>
         </TouchableOpacity>
         <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14, paddingTop:5}}>Book</Text>
         </View>
         
        


         <View style={{paddingLeft:width/4}}>
         <TouchableOpacity onPress={this.onPressAdd2}>
         <Icon name="newspaper-o" size={50} style={{color:'white'}}/>
         </TouchableOpacity>
         <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14, paddingTop:5}}>Chapter</Text>
         
         </View>

         
         
        </View>
        <View style={{paddingVertical:height/24, alignItems:'center'} }>
          <Text style={{fontFamily:'sans-serif-light', color:'white',  fontSize:14}}>Select the Language you want</Text>
          <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:14}}>to record/upload with </Text>
          
        </View>
        <View>


          </View>

        <View style={{paddingVertical:height/40, paddingLeft:width/11}}>
        <TagSelect itemStyle={styles.item}
          itemLabelStyle={styles.label}
          itemStyleSelected={styles.itemSelected}
          itemLabelStyleSelected={styles.labelSelected}
          data={data}
          max={1}

          ref={(tag) => {
            this.tag = tag;
          }}
          
          onMaxError={() => {
            Alert.alert('Multiple Languages Error', 'You can select only one language while recording a Book or Chapter podcast');
          }}
          //never use setState in render as it will cause re-rendering and infinite loading

          onItemPress={(tag)=>{

             console.log(tag)

             if(this.state.LanguageSelected==='')
             {
                 this.setLanguage(tag.label)
             }
             else{
               this.unsetLanguage()

             }
          }

           
          }
        />
        
        </View>

        <View style={{paddingVertical:height/10, flexDirection:'row', paddingLeft:width/6 }}>
        <View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, backgroundColor:'rgb(22, 33, 25)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }} 
            onPress={() => {
                         if (this.state.BookName.length === 0 || this.state.AuthorName.length === 0 || this.state.LanguageSelected.length === 0) {
                            alert("You must choose Category and Language of your Podcast");
                            return;
                        }   
                        this.props.navigation.navigate('PreviewScreen', {
          BookName: this.state.BookName,
          ChapterName:this.state.ChapterName , 
          AuthorName: this.state.AuthorName, 
          LanguageSelected:this.state.LanguageSelected, }
 )
                         }
            }>
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Upload</Text>
                </TouchableOpacity>
        </View>
        <View style={{paddingLeft:width/12}}>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/20, width:(width*7)/24, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }} 
                 onPress={() => {
                         if (this.state.BookName.length === 0 || this.state.AuthorName.length === 0 || this.state.LanguageSelected.length === 0) {
                            alert("You must choose Category and Language of your Podcast");
                            return;
                        }   
                        this.props.navigation.navigate('PreviewScreen', {
          BookName: this.state.BookName,
          ChapterName:this.state.ChapterName , 
          AuthorName: this.state.AuthorName, 
          LanguageSelected:this.state.LanguageSelected, })
                         }
            }>
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Record</Text>
                </TouchableOpacity>
        </View>
       
                
             
        </View>

       


       

<AddModal ref={'addModal'} navigation={this.props.navigation} parentCallback = {this.callbackFunction} >
</AddModal>

<AddChapterModal ref={'addChapterModal'} navigation={this.props.navigation} parentCallback = {this.callbackFunction} >
    
    </AddChapterModal>
        </SafeAreaView> 
        
      );
    }
  }

export default SelectScreen;


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
      borderColor: '#333',    
      backgroundColor: '#FFF',
    },
    label: {
      color: '#333',
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
