import * as React from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, Pressable } from "react-native";
import MainContainer from '../components/MainContainer';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import { css } from '../objects/commonCSS';
import { showData, currencyFormat } from '../objects/objects';
import RNFetchBlob from 'rn-fetch-blob';
import { ProgressBar } from 'react-native-paper';

const DetailScreen = () => {
    const navigation = useNavigation();
    const [showDate, setShowDate] = useState<string | "">("");
    const [typeCatch, setTypeCatch] = useState("product");

    // specify product code from Dashboard screen
    const [fetchedData, setFetchedData] = useState<showData[]>([]);
    const [totalWeight, setTotalWeight] = useState<number>(0); // total
    const [dataProcess, setDataProcess] = useState(false); // check when loading data

    useEffect(()=> {
        (async()=> {
            setDataProcess(true);
            if(await AsyncStorage.getItem('fromDate')!=""){
                setShowDate(await AsyncStorage.getItem('fromDate') ?? "");
            }
            await fetchDataApi(typeCatch);
        })();
    }, [])

    const fetchDataApi = async(selectType: any) => {
        let params;
        var getIPaddress=await AsyncStorage.getItem('IPaddress');
        var salesmanCode = await AsyncStorage.getItem('salesmancode');
        var fromDate = await AsyncStorage.getItem('fromDate');

        if(selectType=="product"){
            params={
                "readSalesmanProduct":"1", 
                "fromDate":fromDate,
                "toDate":fromDate,
                "salesmancode":salesmanCode
            };
        }else{
            params={
                "readSalesmanCustomer":"1", 
                "fromDate":fromDate,
                "toDate":fromDate,
                "salesmancode":salesmanCode
            };
        }

        await RNFetchBlob.config({
            trusty: true
        })
        .fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/report.php",{
                "Content-Type": "application/json",  
            }, JSON.stringify(params),
        ).then(async (response) => {
            if(response.json().status=="1"){
                setFetchedData(response.json().data.map((item: { weight: string; key: any; name: any; }) => ({
                    key: item.key,
                    value: parseInt(item.weight, 10),
                    name: item.name,
                    weight: item.weight,
                })));

                setTotalWeight(response.json().totalWeight);
                setDataProcess(false);
            }else{
                Snackbar.show({
                    text: 'Something is wrong. Can not get the data from server!',
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

    const FlatListItem = ({ item }: { item: showData }) => {
        return (
            <TouchableOpacity onPress={async () => {
            }}>
                <View style={css.listItem} key={parseInt(item.key)}>
                    <View style={[css.cardBody]}>
                        <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={css.textHeader}>
                                {typeCatch=="product" ? "Product" : "Customer"}:
                                {item.name!="" ? item.name : item.key}</Text>
                                <Text style={css.textDescription}>
                                    Weight: {currencyFormat(parseInt(item.weight))}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row',}}>
                                {item.weight==null ? (
                                     <ProgressBar
                                     style={{width:250, height: 10}}
                                     progress={0}
                                     color={"#8561c5"}
                                 />
                                 ) : (
                                     <ProgressBar
                                         style={{width:250, height: 10}}
                                         progress={Math.round(parseInt(item.weight)/totalWeight*100)/100}
                                         color={"#8561c5"}
                                     />
                                 )}
                                 <Text style={[css.textDescription,{textAlign:"center"}]}>
                                     { item.weight==null ? (
                                        0
                                    ) : (
                                        Math.round(parseInt(item.weight)/totalWeight*100)
                                    )}%
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <MainContainer>
            <View style={css.mainView}>
                <View style={{flexDirection: 'row',}}>
                    <View style={css.listThing}>
                        <Ionicons 
                        name="arrow-back-circle-outline" 
                        size={30} 
                        color="#FFF" 
                        onPress={()=>[navigation.goBack()]} />
                    </View>
                </View>
                <View style={css.HeaderView}>
                    <Text numberOfLines={2} style={css.PageName}> Salesman Detail: </Text>
                </View>
            </View>
            {dataProcess== true ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
            <View>
                <View style={{alignItems: 'center',justifyContent: 'center',height:Dimensions.get("screen").height/100*5,width:Dimensions.get("screen").width}}>
                    <View style={{flexDirection: "row",margin:10,alignItems: 'center',justifyContent: 'center'}}>
                        <Text style={{fontSize:14,fontWeight:'bold'}}>Date </Text>
                        <Text style={{fontSize:14,fontWeight:'bold',color:"darkred"}}>{showDate.split(' ')[0]} </Text>
                    </View>
                </View>
                <View style={[css.row,{height:Dimensions.get("screen").height/100*5}]}>
                    {typeCatch == "customer" ? (
                        <View style={[css.subTitle, css.row]}>
                            <Pressable
                                style={[css.typeButton, { backgroundColor: "white" }]}
                                onPress={async () => [setDataProcess(true), setTypeCatch("product"), await fetchDataApi("product")]}
                            >
                                <Text style={[css.buttonText, { color: "black" }]}>Product</Text>
                            </Pressable>
                            <Pressable
                                style={[css.typeButton, { backgroundColor: "black" }]}
                                onPress={async () => [setDataProcess(true), setTypeCatch("customer"), await fetchDataApi("customer")]}
                            >
                                <Text style={css.buttonText}>Customer</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={[css.subTitle, css.row]}>
                            <Pressable
                                style={[css.typeButton, { backgroundColor: "black" }]}
                                onPress={async () => [setDataProcess(true), setTypeCatch("product"), await fetchDataApi("product")]}
                            >
                                <Text style={[css.buttonText, { color: "white" }]}>Product</Text>
                            </Pressable>
                            <Pressable
                                style={[css.typeButton, { backgroundColor: "white" }]}
                                onPress={async () => [setDataProcess(true), setTypeCatch("customer"), await fetchDataApi("customer")]}
                            >
                                <Text style={[css.buttonText, { color: "black" }]}>Customer</Text>
                            </Pressable>
                        </View>
                    )}
                </View>

                <View style={{height:Dimensions.get("screen").height/100*68,marginTop:5}}>
                    <View style={[css.row]}>
                        <Text style={{fontSize:20,fontWeight:'bold',textAlign:"center",fontStyle:"italic"}}>
                            Total Weight: {currencyFormat(totalWeight)}
                        </Text>
                    </View>
                    <View style={{alignItems: 'center',justifyContent: 'center',}}>
                        <View>
                            <FlatList
                                data={fetchedData}
                                renderItem={FlatListItem}
                                keyExtractor={(item) => item.key}
                            />
                        </View>
                    </View>
                </View>
            </View>
            )}
        </MainContainer>
    );
}

export default DetailScreen;