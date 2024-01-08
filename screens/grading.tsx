import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Button, ScrollView, RefreshControl, Linking } from "react-native";
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainContainer from '../components/MainContainer';
import { css } from '../objects/commonCSS';
import RNFetchBlob from 'rn-fetch-blob';
import { WebView } from 'react-native-webview-domain';

const GradingScreen = () => {
    const [showURL, setShowURL] = useState('');
    const [dataProcess, setDataProcess] = useState(false); // check when loading data

    useEffect(()=> {
        (async()=> {
            await postAPI();
        })();
    }, [])

    const postAPI = async() => {
        setDataProcess(true);
        
        var getIPaddress=await AsyncStorage.getItem('IPaddress');
        var userCode=await AsyncStorage.getItem('userCode');
        var password=await AsyncStorage.getItem('password');
        var loginGradingURL, loadGradingPageURL: any;

        // console.log(getIPaddress+" "+userCode+" "+password);

        if(getIPaddress=="domainconnect.my/domain_app" || getIPaddress=="192.168.1.121:8080"){
            loginGradingURL="https://192.168.1.165:12345/App/LoginGrading";
            loadGradingPageURL="https://192.168.1.165:12345/Receive/Index?OnlyPendingApprove=true";
        }else{
            loginGradingURL="https://"+getIPaddress+"/App/LoginGrading";
            loadGradingPageURL="https://"+getIPaddress+"/Receive/Index?OnlyPendingApprove=true";
        }

        await RNFetchBlob.config({
            trusty: true
            }).fetch('POST', loginGradingURL,{
                "Content-Type": "application/json",
            },
            JSON.stringify({
                "Code": userCode,
                "Password": password,
            }),
        ).then(async (response) => {
            // console.log(response.json());
            if(response.json().isSuccess==true){
                setShowURL(loadGradingPageURL);
                setDataProcess(false);
            }else{
                setDataProcess(false);
                Snackbar.show({
                    text: response.json().message,
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        }).catch(error => {
            setShowURL("https://senghiap.com/")
            setDataProcess(false);
            console.error(error);
        });

        // setShowURL("https://senghiap.com/")
        // setDataProcess(false);
    }

    return (
        <MainContainer>
            {(dataProcess==true || showURL=="") ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{flexGrow:1}}
                        refreshControl={
                            <RefreshControl
                                refreshing={dataProcess}
                                onRefresh={postAPI}
                            />}
                    >
                    <WebView
                        source={{ uri: showURL }}
                        style={{ flex: 1 }}
                        sharedCookiesEnabled = {true}
                        setSupportMultipleWindows={true}
                        onShouldStartLoadWithRequest={(request) => {
                            if (request.url !== showURL) {
                              Linking.openURL(request.url);
                              return false;
                            }
                      
                            return true;
                        }}
                    />
                    </ScrollView>
                </View>
            )}
        </MainContainer>
    );
}

export default GradingScreen;