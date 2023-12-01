import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './profile';
import DashboardScreen from './dashboard';
import PlanningScreen from './planning';

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
            } else if (route.name === 'Planning') {
                iconName = focused ? 'planet' : 'planet-outline';
            } 

            return <Ionicons  name={iconName ?? ""} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen options={{ unmountOnBlur: true, }} name="Dashboard" component={DashboardScreen} />
        <Tab.Screen options={{ unmountOnBlur: true, }} name="Planning" component={PlanningScreen} />
        {/* <Tab.Screen options={{ unmountOnBlur: true, }} name="Profile" component={ProfileScreen} /> */}
      </Tab.Navigator>
  );
}

export default TabNavigation;
