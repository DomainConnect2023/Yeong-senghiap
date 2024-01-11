import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './profile';
import DashboardScreen from './dashboard';
import PlanningScreen from './planning';
import DashboardScreen2 from './dashboard2';
import { Dimensions } from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Salesman') {
            iconName = focused ? 'person-circle-sharp' : 'person-circle-outline';
          } else if (route.name === 'Product') {
            iconName = focused ? 'bag-add' : 'bag-add-outline';
          } else if (route.name === 'Customer') {
            iconName = focused ? 'diamond' : 'diamond-outline';
          } 

          return <Ionicons  name={iconName ?? ""} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { 
          // position: "absolute",
          // backgroundColor: 'transparent',
          height: Dimensions.get("screen").height/100*7,
        },
        
      })}
    >

      <Tab.Screen options={{ unmountOnBlur: true, headerStatusBarHeight: 40 }} name="Product" component={DashboardScreen2} initialParams={{stayPage: "product"}} />
      <Tab.Screen options={{ unmountOnBlur: true, headerStatusBarHeight: 40 }} name="Customer" component={DashboardScreen2} initialParams={{stayPage: "customer"}} />
      <Tab.Screen options={{ unmountOnBlur: true, headerStatusBarHeight: 40 }} name="Salesman" component={DashboardScreen2} initialParams={{stayPage: "salesman"}} />
      {/* <Tab.Screen options={{ unmountOnBlur: true, headerStatusBarHeight: 40 }} name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
}

export default TabNavigation;
