import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ImagesAssets } from '../objects/images';
import SearchScreen from './searchScreen';
import LoginScreen from './loginScreen';
import { PieChart } from 'react-native-chart-kit';
import { css } from '../objects/commonCSS';
import { WebView } from 'react-native-webview';

const PlanningScreen = () => {
    const navigation = useNavigation();

    useEffect(()=> {
        (async()=> {
            
        })();
    }, [])

    
    return (
        <MainContainer>
            <View style={[css.mainView,{alignItems: 'center',justifyContent: 'center'}]}>
                <View style={css.HeaderView}>
                    <Text style={css.PageName}>Planing</Text>
                </View>
                <View style={{flexDirection: 'row',}}>
                    <View style={css.listThing}>
                        <Ionicons name="log-out-outline" size={40} color="#FFF" onPress={()=>{[navigation.navigate(LoginScreen as never)]}} />
                    </View>
                </View>
            </View>

            {/* <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ flex: 1 }} /> */}
            <WebView source={{uri: 'https://senghiap.com/' }} style={{ flex: 1 }} />
            
        </MainContainer>
    );
}

export default PlanningScreen;