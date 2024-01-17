import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigationScreen from '../../screens/TabNavigation';
import ProfileScreen from '../../screens/profile';
import SettingScreen from '../../screens/setting';
import DashboardScreen from '../../screens/dashboard';
import PlanningScreen from '../../screens/planning';
import SearchScreen from '../../screens/searchScreen';
import SearchCustomerDetail from '../../screens/SearchCustomerDetail';
import SerachProductDetail from '../../screens/SearchProductDetail';
import DetailCustomerScreen from '../../screens/detailCustomer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomDrawer } from './CustomDrawer';
import GradingScreen from '../../screens/grading';
import SearchReport from '../../screens/searchReport';
import SearchReportScreen from '../../screens/searchReportScreen';
import DetailScreen from '../../screens/detailSalesman';
import HighlightedRange from '../../screens/testscreen';
import ScrollingChartWithPointer from '../../screens/testingscreen';

  const Drawer = createDrawerNavigator();

  const Stack = createNativeStackNavigator();

  
  export function DashboardStack() {
    return (
      <Stack.Navigator initialRouteName="CustomDrawer" screenOptions={{headerShown: false}}>
      <Stack.Screen name = "CustomDrawer" component={CustomDrawer}/>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="DetailCustomerScreen" component={DetailCustomerScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="Planning" component={PlanningScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchCustomerDetail" component={SearchCustomerDetail} />
      <Stack.Screen name="SerachProductDetail" component={SerachProductDetail} />
      <Stack.Screen name="Grading" component={GradingScreen} />
      <Stack.Screen name="SearchReport" component={SearchReport} />
      <Stack.Screen name="SearchReportScreen" component={SearchReportScreen} />
      <Stack.Screen name="Testing" component={HighlightedRange} />
      <Stack.Screen name="Testinga" component={ScrollingChartWithPointer} />
    </Stack.Navigator>
    );
  }