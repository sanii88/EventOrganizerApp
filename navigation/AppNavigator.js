import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EditEventScreen from '../screens/EditEventScreen';
import FavoriteEventsScreen from '../screens/FavoriteEventsScreen';
import { auth } from '../firebaseConfig';
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={({ navigation }) => ({
            headerRight: () => (
              <Button 
                title="Logout" 
                onPress={() => {
                  auth.signOut();
                  navigation.replace('SignIn');
                }} 
              />
            ),
          })} 
        />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="EditEvent" component={EditEventScreen} />
        <Stack.Screen name="FavoriteEvents" component={FavoriteEventsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
