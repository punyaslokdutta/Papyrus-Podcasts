
import React, { useState, useContext, useReducer, useEffect} from 'react';
import {
  View, StyleSheet, Text, Dimensions, TouchableWithoutFeedback,TouchableOpacity
} from 'react-native';
//import { Icon } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome'
import {useDispatch, useSelector} from "react-redux"




const { width,height } = Dimensions.get('window');
export const PLACEHOLDER_WIDTH = width / 3;

const areEqual = (prevProps, nextProps) => true;
 const PlayerControls =React.memo((props)=> {

  //const [playerControlState,setplayerControlState ] =useState(props)
  //copied the props to the state of the component 
  console.log( props);


  /*useEffect(() => {
   // setplayerControlState(props);
  }, []);*/


  
const dispatch=useDispatch();
const paused=useSelector(state=>state.rootReducer.paused);

  
  
   //const { title, onPress } = this.props;
    return (
      
      <TouchableWithoutFeedback onPress={props.onPress} style={{borderColor:'black'}} >
        <View style={styles.container}>
          <View style={styles.placeholder} />
          <Text style={styles.title} numberOfLine={3}>{props.title}</Text>
          {paused && <TouchableOpacity  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
            <Icon name="play" size={24} style={styles.icon}/></TouchableOpacity>}
          {!paused && <TouchableOpacity  onPress={(()=>dispatch({type:"TOGGLE_PLAY_PAUSED"}))}>
            <Icon name="pause" size={24} style={styles.icon}/></TouchableOpacity>}
                <TouchableOpacity onPress={(()=>{dispatch({type:"TOGGLE_PLAY_PAUSED"})
                  dispatch({type:"SET_PODCAST", payload: null})})}>
                <Icon name="times-circle" size={24} style={styles.icon}/>
                </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      
    );
  
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderWidth:0.25, 
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: 8,
  },
  placeholder: {
    width: PLACEHOLDER_WIDTH,
  },
  icon: {
    fontSize: 18,
    color: 'black',
    padding: 8,
    
  },
});

export default PlayerControls
