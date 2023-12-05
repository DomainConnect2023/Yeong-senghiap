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

    const [showURL, setShowURL] = useState('');
    const [dataProcess, setDataProcess] = useState(false); // check when loading data

    useEffect(()=> {
        (async()=> {
            setDataProcess(true);
            await postAPI();
        })();
    }, [])

    const postAPI = async() =>
    {
        var getIPaddress=await AsyncStorage.getItem('IPaddress');
        var userCode=await AsyncStorage.getItem('userCode');
        var password=await AsyncStorage.getItem('password');

        await RNFetchBlob.config({
            trusty: true
        }).fetch('POST', 'http://192.168.1.123:43210/App/LoginGrading',{
                "Content-Type": "application/json",
            },
            JSON.stringify({
                "Code": userCode,
                "Password": password,
            }),
        )
        .then(async (response) => {
            if(response.json().isSuccess==true){
                // http://192.168.1.123:43210/Receive/Index?OnlyPendingApprove=true
                setShowURL("http://192.168.1.123:43210/Receive/Index?OnlyPendingApprove=true");
            }else{
                Snackbar.show({
                    text: 'Wrong!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        })
        .catch(error => {
            console.error(error);
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        });
        setDataProcess(false);
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
            {(dataProcess==true && showURL=="") ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <WebView source={{uri: showURL }} style={{ flex: 1 }} />
            )}
            
        </MainContainer>
    );
}

export default PlanningScreen;