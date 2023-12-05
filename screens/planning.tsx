import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ActivityIndicator, FlatList, TouchableOpacity, Pressable } from "react-native";
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
import RNFetchBlob from 'rn-fetch-blob'

const PlanningScreen = () => {
    const navigation = useNavigation();

    useEffect(()=> {
        (async()=> {
            // postAPI();
        })();
    }, [])

    const headers = {
        'Content-Type': 'application/json',
    }

    const postAPI = async() =>
    {
        // await axios.post("https://192.168.0.168:54321/App/Login", {
        //     headers: headers,
        //     "Code": "Abu",
        //     "Password": "12345",
        //     })
        //         .then(response => {
        //             console.log(response.data)
        //         }).catch(error => {
        //             Snackbar.show({
        //                 text: error.message,
        //                 duration: Snackbar.LENGTH_SHORT,
        //             });
        //         });
        await RNFetchBlob.config({
            trusty: true
        })
            .fetch('POST', 'https://192.168.1.197:9981/senghiap/mobile/getData.php',
                {
                    "Content-Type": "application/json",
                    
                },
                JSON.stringify({
                    "login": "1",
                    "username": "lai",
                    "password": "0907",
                }),
                
            )
            .then((response) => {
                console.log(response.json());
            })
            .catch(error => {
                console.error(error);
            });
    }

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

            {/* <Pressable
                style={[css.typeButton,{backgroundColor:"dimgray"}]} 
                onPress={async ()=>[
                await postAPI()
            ]}>
                <Text> test me here</Text>
            </Pressable> */}
            {/* <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ flex: 1 }} /> */}
            <WebView source={{uri: 'https://senghiap.com/' }} style={{ flex: 1 }} />
            {/* <WebView source={{uri: 'https://192.168.0.168:54321' }} style={{ flex: 1 }} /> */}
            
        </MainContainer>
    );
}

export default PlanningScreen;