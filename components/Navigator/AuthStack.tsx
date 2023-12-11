import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigationScreen from '../../screens/TabNavigation';
import ProfileScreen from '../../screens/profile';
import DetailScreen from '../../screens/detailProduct';
import SettingScreen from '../../screens/setting';
import DashboardScreen from '../../screens/dashboard';
import PlanningScreen from '../../screens/planning';
import SearchScreen from '../../screens/searchScreen';
import SearchCustomerDetail from '../../screens/SearchCustomerDetail';
import SerachProductDetail from '../../screens/SearchProductDetail';
import LoginScreen from '../../screens/loginScreen';
import DetailCustomerScreen from '../../screens/detailCustomer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

  const Drawer = createDrawerNavigator();

  const Stack = createNativeStackNavigator();

  
  export function AuthStack() {
    return (
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{headerShown: false}}>
        <Stack.Screen name="LoginScreen" component={LoginScreen}/>
      </Stack.Navigator>
    );
  }