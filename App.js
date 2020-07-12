import React from 'react';
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import transactionScreen from './screens/transanctionscreen'
import searchScreen from './screens/searchscreen'
import {createAppContainer} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'

export default class App extends React.Component {
  render(){
  return (<AppContainer/>);
}
}
const TabNavigator = createBottomTabNavigator({
  transaction:{screen:transactionScreen},search:{screen:searchScreen},
},
{defaultNavigationOptions:({navigation})=>({
  tabBarIcon:({})=>{
    const routeName = navigation.state.routeName
    if(routeName==='transaction'){
      return(
        <Image source={require('./assets/book.png')} style={{width:30,height:45}}/>


      );
    }
    else if(routeName==='search'){
      return(
        <Image source={require('./assets/searchingbook.png')} style={{width:30,height:45}}/>
        
      );
    }
  }
})}

);
const AppContainer=createAppContainer(TabNavigator)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
