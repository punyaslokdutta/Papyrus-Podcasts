import React, { Component } from 'react';
import {
    AppRegistry, FlatList, StyleSheet, Text, View, Image, Alert,
    Platform, TouchableHighlight, Dimensions,
    TextInput, TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modalbox';
import { Container, Header, Left, Right, Content , Button,Card, CardItem, Thumbnail, Body} from 'native-base';
import StartRecord from '../../../screens/StartRecordScreen'
//import console = require('console');



var screen = Dimensions.get('window');
export default class AddChapterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newChapterName:'',
           newBookName: '',
            newAuthorName: '' ,
        };
      
    }

    showAddModal = () => {
        this.refs.myChapterModal.open();
    }



    render()
    
    {
        return( <Modal
            ref={"myChapterModal"}
            style={{
                justifyContent: 'center',
                borderRadius: Platform.OS === 'ios' ? 30 : 10,
                shadowRadius: 10,
                width: screen.width - 80,
                height: 360
            }}
            position='center'
            backdrop={true}
            onClosed={() => {
                //alert("Modal closed");
            }}
        >

        <View>



        <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 10,
                fontFamily:'sans-serif-light'
            }}>Chapter Name/No:</Text>

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
                    onChangeText={(text) => this.setState({ newChapterName: text })}
                    placeholder="Name/Number of the Chapter"
                    value={this.state.newChapterName}                 
                />
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
                         if (this.state.newBookName.length == 0 || this.state.newAuthorName.length == 0 || this.state.newChapterName.length == 0) {
                            alert("You must enter Chapter, Book & Author's Name");
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
                        //console.log("")
                        this.props.triggerparentupdate ;                      
                        this.refs.myChapterModal.close();  
                       this.props.navigation.navigate('StartRecord')   
                        
                                                              
                    }}>
                   <Text> Save</Text>
                </Button>
                </View>


                </View>
            
        </Modal>
        


        
        
        )
    }



    


}