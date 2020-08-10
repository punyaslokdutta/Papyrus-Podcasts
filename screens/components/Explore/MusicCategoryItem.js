import React, {Component,useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image,Dimensions,TouchableOpacity} from 'react-native';
import * as theme from '../constants/theme'
import { withFirebaseHOC } from '../../config/Firebase';
import { useDispatch } from 'react-redux';


var {width, height}=Dimensions.get('window')
const areEqual = (prevProps, nextProps) => true

  const MusicCategoryItem = (props)=> {
  
    const dispatch = useDispatch();
    var [isMusicCategorySelected,setIsMusicCategorySelected] = useState(false);

    console.log("Inside [MusicCategoryItem]")

    useEffect(() => {
        console.log("[MusicCategoryItem] Inside useEffect - props.selected: ",props.selected);
        props.selected == true && setIsMusicCategorySelected(true);
    },[props.selected])

      return (
          <View style={{height:width/3,width:width/3,marginHorizontal:10,borderColor:'black',borderWidth:1,borderRadius:5,marginBottom:15}}>
        <TouchableOpacity   onPress={() => { 
            console.log("Pressed");  

            if(isMusicCategorySelected)
                dispatch({type:"REMOVE_MUSIC_PREFERENCE",payload:props.item.musicCategoryName})  
            else
                dispatch({type:"ADD_MUSIC_PREFERENCE",payload:props.item.musicCategoryName})
            
            setIsMusicCategorySelected(!isMusicCategorySelected);
          }}>
              <Image source={{uri:props.item.image}}
                  style={{height:width/6,width:width/3 - 2,borderTopRightRadius:5}}/>
                <View style={{alignItems:'center',justifyContent:'center',height:width/6 - 20}}>
                <Text style={{fontFamily:'Andika-R',textAlign:'center'}}> {props.item.musicCategoryName} </Text>
                </View>
                <View>
                { 
                  isMusicCategorySelected == true ?
                  <Image source={require('../../../assets/images/tick.png')} style = {{height: 17, width: 17, resizeMode : 'stretch',}} />
                  :
                  null
                }
                </View>
          </TouchableOpacity>
        </View>
      );
    }
  

export default withFirebaseHOC(MusicCategoryItem);


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
  storie: {
    height: width/4,
    width: width/4,
    borderRadius: 60,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
},
username: {
    alignSelf: 'center',
    fontWeight: '200',
    fontSize: 15,
    fontFamily: 'Andika-R',
    paddingBottom:10
},
shadow: {
  shadowColor: theme.colors.black,
  shadowOffset: {
    width: 0,
    height: 50,
    radius: 69
  },
  shadowOpacity: 5,
  shadowRadius: 20,
  elevation: 30,
  //height: 10
}
});
