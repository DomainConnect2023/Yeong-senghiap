import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useEffect, useState } from 'react';
import { AuthStack } from './AuthStack';
import DashboardScreen from '../../screens/dashboard';
import { useAuth } from '../Auth_Provider/Auth_Context';
import LoginScreen from '../../screens/loginScreen';
import { View } from 'react-native';
import { CustomDrawer } from './CustomDrawer';
import { DashboardStack } from './DashboardStack';

export function StackNavigator() {
    const Stack = createNativeStackNavigator();
    const { isSignedIn } = useAuth();
    // const isSignedIn = useState(false);

    const signedInUserScreen =
        (
            <AuthStack />
        )

    const signedOutUserScreen =
        (
            <DashboardStack />
        )
    const screenToDisplay = isSignedIn
        ? signedOutUserScreen
        :  signedInUserScreen
    return (
        <View style={{ flex: 1 }}>
            {screenToDisplay}
        </View>
    );

}