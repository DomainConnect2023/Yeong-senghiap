import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, SafeAreaView } from 'react-native';
import TabNavigationScreen from './screens/TabNavigation';
import ProfileScreen from './screens/profile';
import DetailScreen from './screens/detailProduct';
import SettingScreen from './screens/setting';
import DashboardScreen from './screens/dashboard';
import PlanningScreen from './screens/planning';
import SearchScreen from './screens/searchScreen';
import SearchCustomerDetail from './screens/SearchCustomerDetail';
import SerachProductDetail from './screens/SearchProductDetail';
import LoginScreen from './screens/loginScreen';
import DetailCustomerScreen from './screens/detailCustomer';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  LogBox.ignoreAllLogs();
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{headerShown: false}}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="DetailScreen" component={DetailScreen} />
          <Stack.Screen name="DetailCustomerScreen" component={DetailCustomerScreen} />
          <Stack.Screen name="TabNavigation" component={TabNavigationScreen} />
          <Stack.Screen name="Setting" component={SettingScreen} />
          <Stack.Screen name="Planning" component={PlanningScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="SearchCustomerDetail" component={SearchCustomerDetail} />
          <Stack.Screen name="SerachProductDetail" component={SerachProductDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;