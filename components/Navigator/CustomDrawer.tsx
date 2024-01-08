import * as React from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../../screens/profile';
import SettingScreen from '../../screens/setting';
import DashboardScreen from '../../screens/dashboard';
import PlanningScreen from '../../screens/planning';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchScreen from '../../screens/searchScreen';
import DashboardScreen2 from '../../screens/dashboard2';
import TabNavigation from '../../screens/TabNavigation';
import GradingScreen from '../../screens/grading';
import { css } from '../../objects/commonCSS';
import LoginScreen from '../../screens/loginScreen';
import { useAuth } from '../Auth_Provider/Auth_Context';
import { useState } from 'react';
import SearchReportScreen from '../../screens/searchReportScreen';

const Drawer = createDrawerNavigator();
const { setIsSignedIn } = useAuth();

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => setIsSignedIn(false)} />
    </DrawerContentScrollView>
  );
}

export function CustomDrawer() {
  const navigation = useNavigation();
  const [refreshKey, setRefreshKey] = useState(0);
  
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
    drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={TabNavigation} options={{
        headerTitle: 'Dashboard',
        headerRight: () => (
          <View style={css.row}>
            <Ionicons name="search-circle-sharp" size={35} color="#FFF" style={{marginLeft:5,marginRight:5}} onPress={() => navigation.navigate(SearchReportScreen as never)} />
            {/* <Ionicons name="log-out-outline" size={35} color="#FFF" style={{marginLeft:5,marginRight:10}} onPress={() => setIsSignedIn(false)} /> */}
          </View>
        ),
      }} />
      

      <Drawer.Screen name="Grading" component={GradingScreen} options={{
        headerTitle: 'Grading',
        headerRight: () => (
          <View style={css.row}>
            <Ionicons name="search-circle-sharp" size={35} color="#FFF" style={{ marginLeft: 5, marginRight: 5 }} onPress={() => navigation.navigate(SearchScreen as never)} />
            {/* <Ionicons name="log-out-outline" size={35} color="#FFF" style={{ marginLeft: 5, marginRight: 10 }} onPress={() => setIsSignedIn(false)} /> */}
          </View>
        ),
      }} />
      
      {/* <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} /> */}
      {/* <Drawer.Screen name="PreviosDashboard" component={DashboardScreen} options={{
        headerTitle: 'Dashboard',
        headerRight: () => (
          <View>
            <Ionicons name="search-circle-sharp" size={40} color="#FFF" onPress={() => navigation.navigate(SearchScreen as never)} />
          </View>
        ),
      }} /> */}
    </Drawer.Navigator>
  );
}