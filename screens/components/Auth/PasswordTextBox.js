import React from 'react';
import {StyleSheet,Dimensions,View} from 'react-native';
import { Item, Input, Icon, Label } from 'native-base';

var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')


class PasswordTextBox extends React.Component {
    state = {
        icon: "eye-off",
        password: true
    };

    _changeIcon() {
        this.setState(prevState => ({
            icon: prevState.icon === 'eye' ? 'eye-off' : 'eye',
            password: !prevState.password
        }));
    }

    render() {
        const { label, icon, onChange } = this.props;
        return (
            <Item style={{backgroundColor:'rgba(255, 255, 255, 0.9)',borderColor:'yellow',borderWidth:1,height:45,width:WIDTH - 55,borderRadius:20}}>
                <Icon active name={icon} style={{color:'black'}}/>
                <Label>{label}</Label>
                <Input secureTextEntry={this.state.password} onChangeText={(e) => onChange(e)} />
                    <Icon name={this.state.icon} style={{color:'black'}} onPress={() => this._changeIcon()} />
            </Item>
        );
    }
}

export default PasswordTextBox;

const styles = StyleSheet.create({
    
    Input:{
      width: WIDTH - 55, 
      height: 45, 
      borderRadius:20, 
      borderColor:'black',
      borderWidth:1,
      fontSize:16, 
      backgroundColor:'rgba(255, 255, 255, 0.9)',
      color:'black', 
      marginHorizontal:25, 
      fontFamily:'sans-serif-light'
    }
    
  });