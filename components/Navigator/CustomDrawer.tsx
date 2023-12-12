import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../../screens/profile';
import SettingScreen from '../../screens/setting';
import DashboardScreen from '../../screens/dashboard';
import PlanningScreen from '../../screens/planning';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchScreen from '../../screens/searchScreen';

const Drawer = createDrawerNavigator();

export function CustomDrawer() {

  const navigation = useNavigation();
  return (
    <Drawer.Navigator initialRouteName="Dashboard" screenOptions={{
      headerShown: true,
      headerStyle: {
        // backgroundColor: "#f44336"
        backgroundColor: "#666699",
      },
      headerTitleStyle: {color: "#FFF"},
      headerTintColor: '#fff', 
      headerTitleAlign: 'center',
    }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{
        headerTitle: 'Dashboard',
        headerRight: () => (
          <View>
            <Ionicons name="search-circle-sharp" size={40} color="#FFF" onPress={() => navigation.navigate(SearchScreen as never)} />
          </View>
        ),
      }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
      <Drawer.Screen name="Planning" component={PlanningScreen} />
    </Drawer.Navigator>
  );
}