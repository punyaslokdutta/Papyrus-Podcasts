

import React, {Component} from 'react';
import { TouchableOpacity,StyleSheet, Text, View, Button} from 'react-native';


class WelcomeScreen extends Component {
   
    render() {
      return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.buttonStyle}
			onPress={() => this.props.navigation.navigate('SignIn')}
		  >
			 <Text style={styles.textStyle}>SignIn</Text>
		  </TouchableOpacity>

      <TouchableOpacity style={styles.buttonStyle}
			onPress={() => this.props.navigation.navigate('SignUp')}
		  >
			 <Text style={styles.textStyle}>SignUp</Text>
		  </TouchableOpacity>
          
          
        </View>
      );
    }
  }

export default WelcomeScreen;


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
});
