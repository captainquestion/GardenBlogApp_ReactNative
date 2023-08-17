import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import GardenScreen from './GardenScreen';
import BlogScreen from './BlogScreen';
import ProfileScreen from './ProfileScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Garden') {
            iconName = 'ios-leaf';
          } else if (route.name === 'Blog') {
            iconName = 'ios-create';
          } else if (route.name === 'Profile') {
            iconName = 'ios-person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#4CAF50',
        inactiveTintColor: '#81C784',
      }}
    >
      <Tab.Screen 
        name="Garden" 
        component={GardenScreen}
      />
      <Tab.Screen 
        name="Blog" 
        component={BlogScreen}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MainApp" 
        component={MainAppTabs} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
