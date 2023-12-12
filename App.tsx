import React, {  } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, SafeAreaView } from 'react-native';
import 'react-native-gesture-handler';
import { AuthProvider } from './components/Auth_Provider/Auth_Context';
import { StackNavigator } from './components/Navigator/StackNavigator';

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