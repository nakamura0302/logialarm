import { React, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, BackHandler } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Alarm from './Alarm';
import MyCalendar from './MyCalendar';
import {AntDesign, Ionicons, MaterialIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomHeader = ({ navigation, title }) => {

  const logout = () => {
    AsyncStorage.clear();
    navigation.push('login');
  }

  return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: 'white' }}>
          <View style={{ paddingLeft: 20 }}>
              <Text></Text>
          </View>
          <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 16 }}>{title}</Text>
          </View>
          <View style={{ justifyContent: 'center', paddingRight: 10 }}>
              <TouchableOpacity onPress={() => logout()}>
                  <Image style={{ width: 20, height: 20 }} source={require('../../assets/logout.png')} />
              </TouchableOpacity>
          </View>
      </View>
  );
};


const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {

  useEffect(() => {
      const backAction = () => {
        // Check if the current screen is the dashboard
        if (navigation.canGoBack() && navigation.getState().routes[navigation.getState().index].name === 'home') {
          // Prevent going back to the dashboard
          BackHandler.exitApp();
          return true; // This prevents the default back action
        }else if (navigation.canGoBack() && navigation.getState().routes[navigation.getState().index].name === 'login'){
          BackHandler.exitApp();
          return true; // This prevents the default back action
        }
        return false; // Allow going back to other screens
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove(); // Clean up the event listener on unmount
    }, [navigation]);

  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let icon;

            if (route.name === 'アラーム') {
              icon = focused
                ? <MaterialIcons name='alarm' size={24} color='black'/>
                : <MaterialIcons name='alarm' size={24} color='gray'/>
            } else if (route.name === 'カレンダー') {
              icon = focused 
                ? <AntDesign name='calendar' size={24} color='black' /> 
                : <AntDesign name='calendar' size={24} color='gray' />
            }

            // You can return any component that you like here!
            return icon;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
            name="カレンダー" 
            component={MyCalendar} 
            options={({ navigation }) => ({
                header: () => <CustomHeader navigation={navigation} title={'カレンダー'}/>,
            })}
        />
        <Tab.Screen 
            name="アラーム" 
            component={Alarm} 
            options={({ navigation }) => ({
                header: () => <CustomHeader navigation={navigation} title={'アラーム'}/>,
            })} 
        />
        
        
      </Tab.Navigator>
  );
}