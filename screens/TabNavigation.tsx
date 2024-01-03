import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './profile';
import DashboardScreen from './dashboard';
import PlanningScreen from './planning';
import DashboardScreen2 from './dashboard2';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Receiving') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Outgoing') {
            iconName = focused ? 'return-down-forward' : 'return-down-forward-outline';
          } else if (route.name === 'Overall') {
            iconName = focused ? 'home' : 'home-outline';
          } 

          return <Ionicons  name={iconName ?? ""} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >

      <Tab.Screen options={{ unmountOnBlur: true, }} name="Overall" component={DashboardScreen} initialParams={{stayPage: "Overall"}} />
      <Tab.Screen options={{ unmountOnBlur: true, }} name="Receiving" component={DashboardScreen} initialParams={{stayPage: "Receiving"}} />
      <Tab.Screen options={{ unmountOnBlur: true, }} name="Outgoing" component={DashboardScreen} initialParams={{stayPage: "Outgoing"}} />
    </Tab.Navigator>
  );
}

export default TabNavigation;
