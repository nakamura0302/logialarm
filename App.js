import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, StatusBar, LogBox, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Alarm from './src/screens/Alarm';
import AlarmCreator from './src/screens/AlarmCreator';
import AlarmRepeat from './src/screens/AlarmRepeat';
import AlarmRing from './src/screens/AlarmRing';

import { Database } from "./api/Database";
import * as Notifications from 'expo-notifications';
import { colors } from './src/util/color-options';
import { createNotificationChannel } from './api/notification';

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs();

const App = () => {
  const [firstScreen, setFirstScreen] = useState(null); // Start with null
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const initialize = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setFirstScreen(userId ? 'home' : 'login'); // Set the initial screen
      setIsLoading(false); // Set loading to false after checking

      Database.createTable().then(res => {
        console.log(res);
      }).catch(error => {
        console.log('Create Alarm database failed: ', error);
      });

      // Handles the notification
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
        console.log('wwwwwwwwwwwwwwwwwwwwwzzzzzzzzzzzzzzzzzzzzzzzzwwwwwwwwwwww', notification)
      });

      createNotificationChannel();
      requestNotificationPermissions();
    };

    initialize();
  }, []);

  async function requestNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        alert('You need to enable notifications in settings!');
      }
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ); // Show loading indicator while checking AsyncStorage
  }

  return (
    <NavigationContainer>
      <StatusBar
        animated={true}
        barStyle="dark-content"
        backgroundColor='white'
        hidden={false}
      />
      <Stack.Navigator initialRouteName={firstScreen} screenOptions={{ navigationBarColor: themes.colors.white, textAlign: 'center' }}>
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="alarm"
          component={Alarm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="alarm-creator"
          component={AlarmCreator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="alarm-repeat"
          component={AlarmRepeat}
          options={{
            title: '繰り返す',
            headerStyle: {
              backgroundColor: colors.white,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              // fontSize:12
            },
            headerTintColor: colors.black,
          }}
        />
        <Stack.Screen
          name="alarm-ring"
          component={AlarmRing}
          options={{
            title: 'アラーム音',
            headerStyle: {
              backgroundColor: colors.white,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerTintColor: colors.black,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const themes = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  colors: { black: '#000', white: 'white' },
});

export default App;
