

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Octicons from 'react-native-vector-icons/Octicons';
import * as theme from '../constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import RecordBook from '../../RecordBook'
var {width, height}=Dimensions.get('window')

const styles = StyleSheet.create({
    flex: {
      flex: 0,
    },
    column: {
      flexDirection: 'column'
    },
    row: {
      flexDirection: 'row'
    },
    header: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: theme.sizes.padding,
      paddingTop: theme.sizes.padding * 1.33,
      paddingBottom: theme.sizes.padding * 0.66,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    
    recommended: {
    },
    recommendedHeader: {
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: theme.sizes.padding,
    },
    recommendedList: {
    },
    recommendation: {
      width: (width - (theme.sizes.padding * 2)) / 2,
      marginHorizontal: 0,
      backgroundColor: theme.colors.white,
      overflow: 'hidden',
      borderRadius: theme.sizes.radius,
      marginVertical: theme.sizes.margin * 0.5,
    },
    recommendationHeader: {
      overflow: 'hidden',
      borderTopRightRadius: theme.sizes.radius,
      borderTopLeftRadius: theme.sizes.radius,
    },
    recommendationOptions: {
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.sizes.padding / 2,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    recommendationTemp: {
      fontSize: theme.sizes.font * 1.25,
      color: theme.colors.white
    },
    recommendationImage: {
      width: (width - (theme.sizes.padding * 2)) / 2,
      height: (width - (theme.sizes.padding * 2)) / 2,
    },
    avatar: {
      width: theme.sizes.padding,
      height: theme.sizes.padding,
      borderRadius: theme.sizes.padding / 2,
    },
    rating: {
      fontSize: theme.sizes.font * 2,
      color: theme.colors.white,
      fontWeight: 'bold'
    },
    shadow: {
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 5,
    },
    dots: {
      width: 10,
      height: 10,
      borderWidth: 2.5,
      borderRadius: 5,
      marginHorizontal: 6,
      backgroundColor: theme.colors.gray,
      borderColor: 'transparent',
    },
    activeDot: {
      width: 12.5,
      height: 12.5,
      borderRadius: 6.25,
      borderColor: theme.colors.black,
    },
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
  });


class ExploreBook extends Component {

    constructor(props)
    {
        super(props)
        {
         state:{
           key: this.props.index
           navigation: this.props.navigation
         }
        }
    }
    openRecordBooks()
    {

      this.props.navigation.navigate('RecordBook', {book:this.props.item.BookID} );

    }
   
    render() {
      const item = this.props.item
      console.log(item)
        return (
          
          // <View style={[
          //   styles.flex, styles.column, styles.recommendation, styles.shadow, 
          //   {marginLeft: theme.sizes.margin },
           
          // ]} key ={this.props.index}>
           <View style={{height:90, width:140, marginLeft:20, borderwidth:4, borderColor:'#dddddd',overflow:'hidden', paddingRight:10,borderRadius:10}}>
           <TouchableOpacity onPress={()=>this.openRecordBooks()}>
           <Image style={{width:130, height:85, resizeMode:'cover',  overflow:'hidden', paddingRight:10}} source={{ uri: item.Book_Pictures_Array["0"] }} />

           </TouchableOpacity>
           </View>
          /* <View style={[ styles.flex, styles.row, styles.recommendationOptions ]}>
            <Icon
              name={'bookmark'}
              color={theme.colors.white}
              size={theme.sizes.font * 1.25}
            />
          </View>
        </View>
            <View style={[styles.flex, styles.column, styles.shadow, { justifyContent: 'space-evenly', padding: theme.sizes.padding / 2 }]}>
              <Text style={{ fontSize: theme.sizes.font * 1.25, fontWeight: '500', paddingBottom: theme.sizes.padding / 4.5, }}>{item.Book_Name}</Text>
              <Text style={{ color: theme.colors.caption }}>{item.Author_Name}</Text>
              <View style={[
                styles.row,
                { alignItems: 'center', justifyContent: 'space-between', marginTop: theme.sizes.margin }
              ]}>
                
                <Text style={{ color: theme.colors.black }}>
                  {item.Book_Rating}
                </Text>
              </View>
            </View>
          </View> */
          );
    }
  }

export default ExploreBook;