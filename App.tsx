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
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </AuthProvider>
  );
}

export default App;