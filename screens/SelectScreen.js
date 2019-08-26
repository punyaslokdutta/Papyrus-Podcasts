
//Passing Props Child to Parent — Use a callback and states
//React’s one-way data-binding model means that child components cannot send back values to parent components unless explicitly allowed to do so
/*React Context permits to hold state at the root of your component hierarchy, and be able to inject this state easily into very deeply nested components, without the hassle to have to pass down props to every intermediate components.
*/ 
import React, {Component} from 'react';
import { TouchableOpacity,StyleSheet, Text, View, SafeAreaView} from 'react-native';
import { Container,  Content , Button,Card, CardItem, Thumbnail, Body} from 'native-base';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HomeScreen from '../screens/HomeScreen'
import AddModal from '../screens/components/Record/AddModal'
import AddChapterModal from '../screens/components/Record/AddChapterModal'
import StartRecordScreen from '../screens/StartRecordScreen'





class SelectScreen extends Component {

    constructor(props)
    {
        super(props);
        this.onPressAdd=this.onPressAdd.bind(this)
        this.onPressAdd2=this.onPressAdd2.bind(this)
        this.state={
          formFilled: 0
        }

        this.updateFormFilledState=this.updateFormFilledState.bind(this);
       
        
    }

    updateFormFilledState=()=>
    {
      console.log("Updateformfilled called in selectscreen ");
      this.setState({formFilled: 1})
    }
    shouldComponentUpdate(nextProps, nextState)
    {
      if(nextState.formFilled===1)
      {
        return true;
      }
      return false;
    }

    /*getResponse=(formFilled)=>{
      this.setState({formFilled});
    } */
    onPressAdd2=()=>
    {
        //console.log(this.ref)
        this.refs.addChapterModal.showAddModal();
       
    }

     onPressAdd=()=>{

        this.refs.addModal.showAddModal();


        
     }

     renderSection=()=>
     {

      console.log(this.state.formFilled);
       return(
       <View>
      <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:18, paddingTop:10, paddingLeft:10}}>{this.state.formFilled}</Text>
      </View>)

     }
    



     
     
  
   
    render() {
      
      return (

        <SafeAreaView style={{flex:1, backgroundColor:'#101010'}}>
        <View style={styles.AppHeader}>
        <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)}>
        <View style={{paddingLeft: 15,paddingRight:10 ,paddingVertical:24, flexDirection:'row'} }>
          <Icon name="times" size={20} style={{color:'white'}}/>
          <Text style={{fontFamily:'san-serif-light', color:'white', paddingLeft:130, fontSize:24}}>Select</Text>
        </View>
       
        
        

        </TouchableOpacity>

        </View>
        <View style={{paddingVertical:80} }>
          <Text style={{fontFamily:'sans-serif-light', color:'white', paddingLeft:90, fontSize:18}}>Select the category you want</Text>
          <Text style={{fontFamily:'sans-serif-light', color:'white', paddingLeft:160, fontSize:18}}>to record</Text>
          
        </View>

         <View style={{paddingVertical:60, flexDirection:'row', paddingLeft:80} }>
         <View>
         <TouchableOpacity onPress={this.onPressAdd.bind(this)}  >
         <Icon name="book" size={70} style={{color:'white'}}/>
         </TouchableOpacity>
         <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:18, paddingTop:10, paddingLeft:10}}>Book</Text>
         </View>
         
        


         <View style={{paddingLeft:100}}>
         <TouchableOpacity onPress={this.onPressAdd2.bind(this)}>
         <Icon name="newspaper-o" size={70} style={{color:'white'}}/>
         </TouchableOpacity>
         <Text style={{fontFamily:'sans-serif-light', color:'white', fontSize:18, paddingTop:10, paddingLeft:10}}>Chapter</Text>
         
         </View>

         
         
        </View>


        {this.renderSection()}

<AddModal ref={'addModal'} navigation={this.props.navigation}>
</AddModal>

<AddChapterModal ref={'addChapterModal'} navigation={this.props.navigation} triggerParentUpdate={this.updateFormFilledState.bind(this)} >
    
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
    AppHeader:
  {
 flexDirection:'row',
 backgroundColor: '#101010'
  },
});
