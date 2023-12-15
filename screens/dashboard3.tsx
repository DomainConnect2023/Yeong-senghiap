import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Image, Animated, BackHandler, ToastAndroid, Platform, Pressable, TextInput, ProgressBarAndroid } from "react-native";
import { BarChart, LineChart, PieChart,} from "react-native-chart-kit";
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DetailScreen from './detailProduct';
import MainContainer from '../components/MainContainer';
import SearchScreen from './searchScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorDB } from '../objects/colors';
import { ImagesAssets } from '../objects/images';
import LoginScreen from './loginScreen';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import { URLAccess } from '../objects/URLAccess';
import { css, datepickerCSS, dropdownCSS } from '../objects/commonCSS';
import { CircleColorText, showData, PieData, BarData, currencyFormat } from '../objects/objects';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNFetchBlob from 'rn-fetch-blob';
import { Dropdown } from 'react-native-searchable-dropdown-kj';

const DashboardScreen3 = () => {
    const navigation = useNavigation();

    const getDate = new Date;
    const [todayDate, setTodayDate] = useState<string | "">(getDate.toISOString().split('T')[0]+" 00:00:00"); // for API
    const [showDate, setShowDate] = useState<string | "">(getDate.toISOString().split('T')[0]); // For show Text only

    // DatePicker
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getDate.toDateString());
    const [selectedIOSDate, setSelectedIOSDate] = useState(new Date());

    const [fetchedListData, setFetchedListData] = useState<showData[]>([]); // Flatlist with Pie
    const [PieData, setPieData] = useState<PieData[]>([]);
    const [fetchedBarData, setFetchedBarData] = useState<showData[]>([]); // Flatlist with Bar
    const [BarData, setBarData] = useState<BarData>({ labels: [], datasets: [{ data: [] }] });
    const [totalWeight, setTotalWeight] = useState<number>(0); // total weight

    const [dataProcess, setDataProcess] = useState(false); // check when loading data
    let colorSelected = 0; // set color use

    const [viewItem, setViewItem] = useState("all");
    const [itemID, setItemID] = useState("");
    const [itemName, setItemName] = useState("");

    // when clicking pie / bar chart use
    const [chooseChart, setChooseChart] = useState("pie");
    const [isHidden, setIsHidden] = useState(true);
    const [ bounceValue, setBounceValue ] = useState(new Animated.Value(300));

    useEffect(()=> { // when starting the page
        (async()=> {
            setDataProcess(true);
            setFetchedListData([]);
            setPieData([]);
            setFetchedBarData([]);
            setBarData({ labels: [], datasets: [{ data: [] }] });
            
            if(await AsyncStorage.getItem('fromDate')!=""){
                setTodayDate(await AsyncStorage.getItem('fromDate') ?? "");
                setShowDate(await AsyncStorage.getItem('fromDate') ?? "");
                setSelectedDate(await AsyncStorage.getItem('fromDate') ?? "");
                await fetchDataApi(await AsyncStorage.getItem('fromDate'));
            }else{
                await fetchDataApi(todayDate);
            }
        })();
    }, []);

    // get data from database
    const fetchDataApi = async(todayDate: any) => {
        var getIPaddress=await AsyncStorage.getItem('IPaddress');

        await RNFetchBlob.config({
            trusty: true
        })
        .fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/report.php",{
                "Content-Type": "application/json",  
            }, JSON.stringify({
                "read":"1", "todayDate":"2023-10-11 00:00:00",
            }),
        ).then((response) => {
            if(response.json().status=="1"){
                setFetchedListData(response.json().data.map((item: { totalWeight: string; key: any; name: any; }) => ({
                    key: item.key,
                    name: item.name,
                    totalWeight: item.totalWeight,
                    color: colorDB.colors[colorSelected<5 ? colorSelected+=1 : colorSelected]["hex"],
                })));

                colorSelected=0;
                setPieData(response.json().pieData.map(
                    (item: { value: number; key: any; totalWeight: any;}) => ({
                        value: Math.round(item.totalWeight/response.json().totalWeight*100*100)/100,
                        name: "%",
                        totalWeight: item.totalWeight,
                        percentage: item.totalWeight/response.json().totalWeight*100,
                        color: colorDB.colors[colorSelected<5 ? colorSelected+=1 : colorSelected]["hex"],
                    })
                ));

                const convertedData: BarData = {
                    labels: response.json().barData.map((item: { days: any; }) => item.days),
                    datasets: [{
                        data: response.json().barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight),
                    },],
                };
                setBarData(convertedData);

                setFetchedBarData(response.json().barData.map((item: { days: any; key: any; dayTotalWeight: any; dateValue: any }) => ({
                    key: item.key,
                    name: item.days,
                    value: item.dateValue,
                    totalWeight: item.dayTotalWeight,
                    color: "",
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

    const fetchProductDataApi = async() => {
        var getIPaddress=await AsyncStorage.getItem('IPaddress');
        var productCode = await AsyncStorage.getItem('productCode');
        var fromDate = await AsyncStorage.getItem('fromDate');
        var toDate = await AsyncStorage.getItem('toDate');
        
        await RNFetchBlob.config({
            trusty: true
        })
        .fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/report.php",{
                "Content-Type": "application/json",  
            }, JSON.stringify({
                "readDetail":"1", 
                "fromDate":fromDate,
                "toDate":toDate,
                "productCode":productCode,
            }),
        ).then((response) => {
            if(response.json().status=="1"){
                setFetchedListData(response.json().data.map((item: { weight: string; accode: any; customer: any; }) => ({
                    accode: item.accode,
                    value: parseInt(item.weight, 10),
                    name: item.customer,
                    weight: item.weight,
                    color: colorDB.colors[colorSelected<5 ? colorSelected+=1 : colorSelected]["hex"],
                })));

                colorSelected=0;
                setPieData(response.json().pieData.map((item: { weight: any; accode: any; customer: any; }) => ({
                    value: Math.round(item.weight/response.json().totalWeight*100*100)/100,
                    name: "%",
                    color: colorDB.colors[colorSelected<5 ? colorSelected+=1 : colorSelected]["hex"],
                    legendFontSize: 14,
                })));

                const convertedData: BarData = {
                    labels: response.json().barData.map((item: { days: any; }) => item.days),
                    datasets: [{
                        data: response.json().barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight),
                    },],
                };
                setBarData(convertedData);

                setFetchedBarData(response.json().barData.map((item: { days: any; key: any; dayTotalWeight: any; dateValue: any }) => ({
                    accode: item.key,
                    value: item.dateValue,
                    name: item.days,
                    weight: item.dayTotalWeight,
                    color: "",
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
            Snackbar.show({
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
            });
        });
    };


    const pieChartItem = ({ item }: { item: showData }) => {
        return (
            <TouchableOpacity onPress={() => {
                setIsHidden(!isHidden);
                AsyncStorage.setItem('productCode', item.key);
                AsyncStorage.setItem('productName', item.name);
                AsyncStorage.setItem('fromDate', todayDate ?? "");
                AsyncStorage.setItem('toDate', todayDate ?? "");
                setViewItem("product");
                setItemName(item.name);
                setItemID(item.key);
                fetchProductDataApi();
                // navigation.navigate('Customer' as never);
            }}>
                <View style={dash.listItem} key={parseInt(item.key)}>
                    <View style={[dash.cardBody]}>
                        <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={dash.textHeader}>Product: {item.key} {item.name!="" ? "("+item.name+")" : ""}</Text>
                                <Text style={dash.textDescription}>
                                    Weight: {currencyFormat(parseInt(item.weight))}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row',}}>
                                <ProgressBarAndroid
                                    style={{width:"70%"}}
                                    styleAttr="Horizontal"
                                    indeterminate={false}
                                    progress={Math.round(parseInt(item.weight)/totalWeight*100)/100}
                                />
                                <Text style={[dash.textDescription,{textAlign:"center"}]}>
                                    {Math.round(parseInt(item.weight)/totalWeight*100)}%
                                </Text>
                            </View>
                            {/* <Text style={dash.textHeader}></Text> */}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
            {dataProcess== true ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View>
                    
                    <View style={dash.row}>    
                        <Pressable style={dash.pressableCSS}>
                        <TextInput
                            style={{
                                color: "#000", 
                                textAlign: "center", 
                                fontSize:14, 
                                fontWeight:"bold", 
                                height:25,
                                padding:0,
                            }}
                            placeholder="Select Date"
                            value={selectedDate.toString().substring(0,10)}
                            onChangeText={setTodayDate}
                            placeholderTextColor="#11182744"
                            editable={false}
                        />
                        </Pressable>
                    </View>  

                    {/* <View style={[dash.row,{margin:10,}]}>              
                        <View style={[dash.selectType, {flex: 1, backgroundColor:"#c8c8dc"}]}>
                            <TouchableOpacity onPress={() => {setChooseType("Product");}}>
                                <Text style={dash.selectText}>Product</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[dash.selectType, {flex: 1}]}>
                            <TouchableOpacity onPress={() => {setChooseType("Customer");}}>
                                <Text style={dash.selectText}>Customer</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[dash.selectType, {flex: 1}]}>
                            <TouchableOpacity onPress={() => {setChooseType("Salesman");}}>
                                <Text style={dash.selectText}>Salesman</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}

                    <View style={[dash.row,{marginTop:15,marginBottom:10}]}>
                        <Text style={{fontSize:20,fontWeight:'bold',textAlign:"center",fontStyle:"italic"}}>
                            {viewItem=="all" ? ("All Product") : (itemName)}
                        </Text>
                    </View>

                    <View style={[dash.row]}>
                        <BarChart
                            data={BarData}
                            width={Dimensions.get("window").width/100*90}
                            height={250}
                            yAxisSuffix=""
                            yAxisLabel=""
                            chartConfig={{
                                backgroundColor: '#1cc910',
                                backgroundGradientFrom: '#eff3ff',
                                backgroundGradientTo: '#efefef',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16, 
                            }}
                        />
                    </View>

                    <View style={[dash.row,{marginTop:15,marginBottom:10}]}>
                        <Text style={{fontSize:20,fontWeight:'bold',textAlign:"center",fontStyle:"italic"}}>
                            Total Weight: {currencyFormat(totalWeight)}
                        </Text>
                    </View>
                    
                    <View style={{alignItems: 'center',justifyContent: 'center',}}>
                        <View>
                        {/* <View style={{height:Dimensions.get("screen").height/100*40}}> */}
                            <FlatList
                                data={fetchedListData}
                                renderItem={pieChartItem}
                                keyExtractor={(item) => item.key}
                            />
                        </View>
                    </View>
                </View>
            )}
            </KeyboardAvoidWrapper>
        </MainContainer>
    );
}

export const dash = StyleSheet.create({
    mainView:{
        width: '100%',
        height: 60, 
        flexDirection: 'row',
        alignItems: 'center', 
        backgroundColor: "#666699",
    },
    HeaderView :{
        flex: 1, 
        padding: 10,
        gap: 4, 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        marginHorizontal: 4,
    },
    PageName: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    listThing: {
        width: 30,
        height: 40, 
        backgroundColor: '#666699', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 20,
        margin: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressableCSS: {
        width: '40%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginTop: 10,
    },
    selectType: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        margin: 3,
    },
    selectText: {
        textAlign: "center",
        padding: 5,
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6E8EA',
        padding: 10,
        borderRadius: 10,
        marginVertical: 2,
        marginHorizontal: 5,
        height: 80,
    },
    cardBody: {
        flexGrow: 1,
        paddingHorizontal: 12,
        width: "95%",
    },
    textHeader: { 
        fontStyle: "italic",
        flex: 1,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
        marginBottom: 4,
        width: "60%",
    },
    textDescription: {
        fontStyle: "italic",
        fontSize: 12,
        marginBottom: 6,
        width: "30%",
        textAlign: "center",
    },
});

export default DashboardScreen3;