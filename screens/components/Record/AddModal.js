import React, { Component } from 'react';
import {
    AppRegistry, FlatList, StyleSheet, Text, View, Image, Alert,
    Platform, TouchableHighlight, Dimensions, TouchableOpacity,
    TextInput
} from 'react-native';
import Modal from 'react-native-modalbox';
import { Container, Header, Left, Right, Content , Button,Card, CardItem, Thumbnail, Body} from 'native-base';
import StartRecord from '../../../screens/StartRecordScreen'



var screen = Dimensions.get('window');
export default class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
           newBookName: '',
            newAuthorName: '' ,
            formFilled: 0 
        };
      
    }

    calc=(result)=>{
        this.setState({formFilled: result});
        this.props.callback(this.state.formFilled);
    }

    showAddModal = () => {
        this.refs.myModal.open();
    }


    render()
    
    {
        return( <Modal
            ref={"myModal"}
            style={{
                justifyContent: 'center',
                borderRadius: Platform.OS === 'ios' ? 30 : 10,
                shadowRadius: 10,
                width: screen.width - 80,
                height: 280
            }}
            position='center'
            backdrop={true}
            onClosed={() => {
                //alert("Modal closed");
            }}
        >

        <View >
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 10,
                fontFamily:'sans-serif-light'
            }}>Book :</Text>

            <TextInput
                    style={{
                        height: 40,
                        borderBottomColor: 'gray',
                        marginLeft: 30,
                        marginRight: 30,
                        marginTop: 20,
                        marginBottom: 10,
                        borderBottomWidth: 1,
                        
                    }}           
                    onChangeText={(text) => this.setState({ newBookName: text })}
                    placeholder="Name of the Book"
                    value={this.state.newBookName}                 
                />


                  
                  
                <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 10,
                fontFamily:'sans-serif-light'
            }}>Author :</Text>

            <TextInput
                    style={{
                        height: 40,
                        borderBottomColor: 'gray',
                        marginLeft: 30,
                        marginRight: 30,
                        marginTop: 20,
                        marginBottom: 10,
                        borderBottomWidth: 1,
                        
                    }}           
                    onChangeText={(text) => this.setState({ newAuthorName: text })}
                    placeholder="Name of the Author"
                    value={this.state.newAuthorName}                 
                />
<View style={{paddingLeft:125, paddingTop:5, }}>
<Button bordered dark style={{ justifyContent:'center', height:30, width:80, borderRadius:5 }} 
          
          
                    onPress={() => {
                         if (this.state.newBookName.length == 0 || this.state.newAuthorName.length == 0) {
                            alert("You must enter Book & Author's Name");
                            return;
                        }       
                        //const newKey = this.generateKey(24);
                        /*const newFood = {
                            key: newKey,
                            name: this.state.newFoodName,
                            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/Foods_%28cropped%29.jpg",
                            foodDescription: this.state.newFoodDescription
                        };    
                        flatListData.push(newFood);    
                        this.props.parentFlatList.refreshFlatList(newKey); */  

                        this.calc(1)   ;                         
                        this.refs.myModal.close();  
                        //this.props.navigation.navigate('StartRecord')   
                        
                                                              
                    }}>

                    <Text style={{ fontFamily:'sans-serif-light', color:'black'}}>Save</Text>
                    </Button>
                    </View>
                


                </View>
            
        </Modal>
        


        
        
        )
    }



    


}