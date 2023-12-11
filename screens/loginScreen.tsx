import React, { useContext, useEffect, useState } from 'react';
import { Image, Pressable } from 'react-native';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import TabNavigation from './TabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import { URLAccess } from '../objects/URLAccess';
import { ImagesAssets } from '../objects/images';
import { Dropdown } from 'react-native-searchable-dropdown-kj';
import RNFetchBlob from 'rn-fetch-blob';
import { useAuth } from '../components/Auth_Provider/Auth_Context';

type UserData = {
    username: string;
    password: string;
    [key: string]: string;
};

type VPNData = {
    type: string;
    [key: string]: string;
};

interface selectedData {
    label: string;
    value: string;
}

export const [isLoginSuccess, setLoginStatus] = useState<String | null>("");

const LoginScreen = () => {
    const navigation = useNavigation();

    const getDate = new Date;
    const [todayDate, setTodayDate] = useState<string | "">(getDate.toISOString().split('T')[0]+" 00:00:00");
        
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const inputRef = React.createRef<TextInput>();
    const [industrial, setIndustrial] = useState("");
    const [IPaddress, setIPadress] = useState("");

    const [fetchedSelectionData, setFetchedSelectionData] = useState<selectedData[]>([]);

    const { setIsSignedIn } = useAuth();
    // const { isSignedIn } = useAuth();

    useEffect(()=> {
        (async()=> {
            setFetchedSelectionData([]);
            getSelection();
            // changeVPN(industrial);
            if (IPaddress.length === 0) {
                setIPadress(URLAccess.getLiveSiteIP);
            }
        })();
    }, [])
    
    const loginAPI = async() => {
        await RNFetchBlob.config({
            trusty: true
        })
        .fetch('POST', "https://"+IPaddress+"/senghiap/mobile/getData.php",{
                "Content-Type": "application/json",  
            }, JSON.stringify({
                "login": "1",
                "username": username as string,
                "password": password as string,
            }),
        ).then((response) => {
            if(response.json().status=="1"){
                AsyncStorage.setItem('userCode', username);
                AsyncStorage.setItem('password', password);
                AsyncStorage.setItem('IPaddress', IPaddress);
                AsyncStorage.setItem('fromDate', todayDate);
                AsyncStorage.setItem('toDate', todayDate);
                AsyncStorage.setItem('level', response.json().level);
                AsyncStorage.setItem('isLoginSuccess', response.json().status)
                setUserName("");
                setPassword("");
                setIsSignedIn(true);
            }else{
                Snackbar.show({
                    text: 'Login Failed, Please try again!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        })
        .catch(error => {
            console.log(error.message);
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        });
    };

    const changeVPN = async(gotoVPN: string) => {
        const formData = new FormData();
        
        const jsonData: VPNData = {
            "changeVPN": "1",
            "type": gotoVPN as string,
        };

        for (const key in jsonData) {
            formData.append(key, jsonData[key]);
        }
        
        await axios.post(URLAccess.getIPAddress, 
        jsonData).then(async response => {
            if(response.data.status=="1"){
                setIPadress(response.data.VPN);
            }else{
                Snackbar.show({
                    text: 'Wrong VPN!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        }).catch(error => {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        });
    };

    const getSelection = async() => { 
        axios.post(URLAccess.getIPAddress, {"readSelection":"1"})
        .then(async response => {
            if(response.data.status=="1"){
                setFetchedSelectionData((prevData) => [...prevData, ...response.data.data.map((
                    item: { labels: any; values: any; }) => ({
                        label: item.labels,
                        value: item.values,
                    }))
                ]);
            }else{
                Snackbar.show({
                    text: 'Wrong VPN!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        }).catch(error => {
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        });
    };

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
                <View style={styles.container}>
                    <Image
                    source={ImagesAssets.logoImage}
                    style={{width: 250, height: 250, margin:50}}
                    />
                    <View style={styles.subcontainer}>
                        <View style={styles.Icon}>
                            <Ionicons name={"person-circle-sharp" ?? ""} size={40} color={"#EC5800"} />
                        </View>
                        <TextInput
                            style={styles.Input}
                            onSubmitEditing={() => inputRef.current?.focus()}
                            placeholder="User Name"
                            value={username}
                            onChangeText={setUserName}
                        />
                    </View>
                    <View style={styles.subcontainer}>
                        <View style={styles.Icon}>
                            <Ionicons name={"key-sharp" ?? ""} size={40} color={"#EC5800"} />
                        </View>
                        <TextInput
                            style={styles.Input}
                            ref={inputRef}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <View style={styles.subcontainer}>
                        <View style={styles.Icon}>
                            <Ionicons name={"bar-chart" ?? ""} size={40} color={"#EC5800"} />
                        </View>
                        <Dropdown
                            style={styles.dropdown}
                            activeColor={"#E5E4E2"}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            search
                            data={fetchedSelectionData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Industrial"
                            searchPlaceholder="Search..."
                            value={industrial}
                            onChange={async item => {
                                // setTest(item.value);
                                await changeVPN(item.value);
                            }}
                            renderLeftIcon={() => (
                                <Ionicons
                                    style={{marginRight: 5,}}
                                    color={'black'}
                                    name="at-circle-sharp"
                                    size={20}
                                />
                            )}
                        />
                    </View>

                    <Pressable style={styles.button} onPress={()=>loginAPI()}>
                        <Text style={styles.bttnText}>Login</Text>
                    </Pressable>
                </View>
                
            </KeyboardAvoidWrapper>
        </MainContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subcontainer: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    Input: {
        width: '70%',
        height: 70,
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        color: "#000",
    },
    Icon: {
        width:"15%",
        padding:5,
        alignItems:"flex-end",
        marginBottom: 10
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        marginRight: 5,
        marginLeft: 5,
    },
    bttnText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    textInput: { 
        width: "80%", 
        borderRadius: 5, 
        paddingVertical: 8, 
        paddingHorizontal: 16, 
        borderColor: "rgba(0, 0, 0, 0.2)", 
        borderWidth: 1, 
    }, 
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        width: "70%",
        height: 70,
        marginBottom: 10,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default LoginScreen;
