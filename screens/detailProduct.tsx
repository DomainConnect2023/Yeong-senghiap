import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, Animated, Image, Platform, TextInput, Pressable } from "react-native";
import MainContainer from '../components/MainContainer';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import { BarChart, PieChart, } from "react-native-chart-kit";
import { colorDB } from '../objects/colors';
import DetailCustomerScreen from './detailCustomer';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import { css, datepickerCSS } from '../objects/commonCSS';
import { CircleColorText, CustomerData, BarData, PieData, currencyFormat } from '../objects/objects';
import { ImagesAssets } from '../objects/images';
import DateTimePicker from '@react-native-community/datetimepicker';
import DashboardScreen from './dashboard';
import RNFetchBlob from 'rn-fetch-blob';

const DetailScreen = () => {
    const navigation = useNavigation();

    const getDate = new Date;
    const [todayDate, setTodayDate] = useState<string | "">(getDate.toISOString().split('T')[0]+" 00:00:00"); // for API
    const [showDate, setShowDate] = useState<string | "">(""); // show the date
    const [selectedIOSDate, setSelectedIOSDate] = useState(new Date());


    const [showPicker, setShowPicker] = useState(false);

    // specify product code from Dashboard screen
    const [productCode, setProductCode] = useState<string | null>("");
    const [productName, setProductName] = useState<string | null>("");
    const [totalWeight, setTotalWeight] = useState<number>(0);

    const [fetchedData, setFetchedData] = useState<CustomerData[]>([]); // Flatlist with Pie
    const [fetchedBarData, setFetchedBarData] = useState<CustomerData[]>([]); // Flatlist with Bar
    const [BarData, setBarData] = useState<BarData>({ labels: [], datasets: [{ data: [] }] });
    const [PieData, setPieData] = useState<PieData[]>([]);

    const [dataProcess, setDataProcess] = useState(false); // check when loading data
    let colorSelected = 0; // set color use

    const [chooseChart, setChooseChart] = useState("pie");
    const [isHidden, setIsHidden] = useState(true);
    const [ bounceValue, setBounceValue ] = useState(new Animated.Value(300));

    useEffect(()=> {
        (async()=> {
            setDataProcess(true);
            if(await AsyncStorage.getItem('fromDate')!=""){
                setTodayDate(await AsyncStorage.getItem('fromDate') ?? "");
                setShowDate(await AsyncStorage.getItem('fromDate') ?? "");
                // setShowDate(await AsyncStorage.getItem('dummyDate') ?? "");
            }
            setProductCode(await AsyncStorage.getItem('productCode'));
            setProductName(await AsyncStorage.getItem('productName'));
            await fetchDataApi();
        })();
    }, [])

    const toggleSlide = ()=> {    
        var toValue = 600;
        if(isHidden){
            toValue = 0;
        }
        Animated.spring(bounceValue,{
            toValue: toValue,
            velocity: 3,
            tension: 3,
            friction: 6,
            useNativeDriver: true
        }).start();
        setIsHidden(!isHidden);
    }

    // Date Picker
    const onChangeDate = async ({type}: any, selectedDate: any) => {
        if(type=="set"){
            const currentDate=selectedDate;
            setSelectedIOSDate(currentDate);
            if(Platform.OS==="android"){
                // tonggleDatePicker();
                setShowPicker(false);
                setDataProcess(true);
                setIsHidden(true);
                setTodayDate(currentDate);
                setShowDate(currentDate.toISOString().split('T')[0]);
                AsyncStorage.setItem('fromDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
                AsyncStorage.setItem('toDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
                await fetchDataApi();
            }
        }else{
            tonggleDatePicker();
        }
    }

    const confirmIOSDate = async() => {
        const currentDate=selectedIOSDate;
        setShowDate(currentDate.toISOString().split('T')[0]);
        setTodayDate(currentDate.toISOString().split('T')[0]);
        AsyncStorage.setItem('fromDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
        AsyncStorage.setItem('toDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
        setDataProcess(true);
        tonggleDatePicker();
        await fetchDataApi();
    }
    const tonggleDatePicker = () => {
        setShowPicker(!showPicker);
    }
    // End Date Picker

    const fetchDataApi = async() => {
        var getIPaddress=await AsyncStorage.getItem('IPaddress');
        var productCode = await AsyncStorage.getItem('productCode');
        var fromDate = await AsyncStorage.getItem('fromDate');
        var toDate = await AsyncStorage.getItem('toDate');

        // await axios.post(URLAccess.reportFunction, {
        // axios.post("https://"+getIPaddress+"/senghiap/mobile/report.php", {
        //     "readDetail":"1", 
        //     "fromDate":fromDate,
        //     "toDate":toDate,
        //     "productCode":productCode,
        // })
        // .then(async response => {
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
                setFetchedData(response.json().data.map((item: { weight: string; accode: any; customer: any; }) => ({
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

    const pieChartItem = ({ item }: { item: CustomerData }) => {
        return ( 
            <TouchableOpacity onPress={() => {
                setIsHidden(!isHidden);
                AsyncStorage.setItem('accode', item.accode);
                AsyncStorage.setItem('customerName', item.name);
                AsyncStorage.setItem('fromDate', todayDate ?? "");
                AsyncStorage.setItem('toDate', todayDate ?? "");
                navigation.navigate(DetailCustomerScreen as never);
            }}>
                <View style={css.listItem} key={parseInt(item.accode)}>
                    <View style={[css.cardBody,{flexDirection: 'row',paddingHorizontal: 0,}]}>
                        <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={css.textHeader}>Name: {item.name}</Text>
                                <Text style={css.textDescription}>
                                    <CircleColorText color={item.color} />
                                </Text>
                            </View>
                            <Text style={css.textHeader}>Weight: {currencyFormat(parseInt(item.weight))}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const barChartItem = ({ item }: { item: CustomerData }) => {
        return (
            <TouchableOpacity onPress={() => {
                if(item.value!="0"){
                    setDataProcess(true);
                    setIsHidden(true);
                    setTodayDate(item.value);
                    setShowDate(item.value);
                    AsyncStorage.setItem('fromDate', item.value);
                    AsyncStorage.setItem('toDate', item.value);
                    fetchDataApi();
                }else{
                    Snackbar.show({
                        text: "Can't choose the zero value on that day.",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            }}>
                <View style={css.listItem} key={parseInt(item.accode)}>
                    <View style={[css.cardBody]}>
                        <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={css.textHeader}>{item.name}</Text>
                            </View>
                            <Text style={css.textHeader}>Day of Total Weight: {currencyFormat(parseInt(item.weight))}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
            <View style={css.mainView}>
                <View style={{flexDirection: 'row',}}>
                    <View style={css.listThing}>
                        <Ionicons 
                        name="arrow-back-circle-outline" 
                        size={40} 
                        color="#FFF" 
                        onPress={()=>[navigation.navigate("TabNavigation" as never)]} />
                    </View>
                </View>
                <View style={css.HeaderView}>
                    <Text numberOfLines={2} style={css.PageName}> Product Detail: {productName!="" ? "("+productName+")" : ""}</Text>
                </View>
            </View>

            {/* Set Date */}
            {isHidden==false ? (
            <View style={[css.row,{backgroundColor:'rgba(0, 0, 0, 0.3)',zIndex: 100}]}>
                {showPicker && Platform.OS === 'android' && <DateTimePicker 
                    mode="date"
                    display="calendar"
                    value={getDate}
                    onChange={onChangeDate}
                    style={datepickerCSS.datePicker}
                />}
                <Pressable style={css.pressableCSS} onPress={tonggleDatePicker}>
                <TextInput
                    style={{color: "#000", textAlign: "center", fontSize:18}}
                    placeholder="Select Date"
                    value={showDate.toString().substring(0,10)}
                    onChangeText={setTodayDate}
                    placeholderTextColor="#11182744"
                    editable={false}
                    onPressIn={tonggleDatePicker}
                />
                </Pressable>
            </View>
            ) : (
                <View style={css.row}>
                {showPicker && Platform.OS === 'android' &&<DateTimePicker 
                    mode="date"
                    display="calendar"
                    value={getDate}
                    onChange={onChangeDate}
                    style={datepickerCSS.datePicker}
                />}
            
                <Pressable style={css.pressableCSS} onPress={tonggleDatePicker}>
                <TextInput
                    style={{color: "#000", textAlign: "center", fontSize:18}}
                    placeholder="Select Date"
                    value={showDate.toString().substring(0,10)}
                    onChangeText={setTodayDate}
                    placeholderTextColor="#11182744"
                    editable={false}
                    onPressIn={tonggleDatePicker}
                />
                </Pressable>
            </View>    
            )}
                <View>
                    {showPicker && Platform.OS === "ios" && <DateTimePicker
                        mode="date"
                        display="spinner"
                        value={selectedIOSDate}
                        onChange={onChangeDate}
                        style={datepickerCSS.datePicker}
                    />}
                    {showPicker && Platform.OS === "ios" && (
                        <View
                            style={{ flexDirection: "row", justifyContent: "space-around" }}
                        >
                            <TouchableOpacity
                                style={[datepickerCSS.cancelButton, { backgroundColor: "#11182711", paddingHorizontal: 20 }]}
                                onPress={tonggleDatePicker}
                            >
                                <Text style={[datepickerCSS.cancelButtonText, { color: "#075985" }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[datepickerCSS.cancelButton, { paddingHorizontal: 20 }]}
                                onPress={confirmIOSDate}
                            >
                                <Text style={[datepickerCSS.cancelButtonText]}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            {/* End Select Date */}

            {dataProcess== true ? (
            <View style={[css.container]}>
                <ActivityIndicator size="large" />
            </View>
            ) : (
                isHidden==false ? (
                <TouchableOpacity onPress={async ()=>toggleSlide()}>
                    <View style={{backgroundColor: 'rgba(0, 0, 0, 0.3)',zIndex: 100}}>
                        {chooseChart=="pie" ? (
                        <View style={{alignItems: 'center',justifyContent: 'center'}}>
                            <View>
                            <PieChart
                                data={PieData}
                                width={Dimensions.get("window").width}
                                height={200}
                                accessor={"value"}
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                center={[5, 0]}
                                absolute
                                chartConfig={{
                                    backgroundColor: "#e26a00",
                                    backgroundGradientFrom: "#fb8c00",
                                    backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "4",
                                        stroke: "#ffa726"
                                    }
                                }}
                            />
                            </View>
                            <View style={{margin:10,alignItems: 'center',justifyContent: 'center'}}>
                                <Text style={{fontSize:18,fontWeight:'bold'}}>Total Weight: {currencyFormat(totalWeight)}</Text>
                            </View>
                        </View>
                        ) : (
                        <View style={{alignItems: 'center',justifyContent: 'center'}}>
                            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.3)',zIndex: 100}}>
                                <BarChart
                                    data={BarData}
                                    width={Dimensions.get("window").width}
                                    height={200}
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
                        </View>
                        )}
                    </View>
                </TouchableOpacity>
                ) : (
                <View>
                    {fetchedData.length==0 ? (
                    <View style={{alignItems: 'center',justifyContent: 'center'}}>
                        <Image
                            source={ImagesAssets.noData}
                            style={{width: Dimensions.get("window").width/100*80, height: 200}}
                        />
                        <Text style={{fontSize:16,margin:30}}>Today No data yet</Text>
                    </View>
                    ) : (
                    <TouchableOpacity onPress={async ()=>[setChooseChart("pie"),toggleSlide()]}>
                        <View style={{alignItems: 'center',justifyContent: 'center'}}>
                            <PieChart
                                data={PieData}
                                width={Dimensions.get("window").width}
                                height={200}
                                accessor={"value"}
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                center={[5, 0]}
                                absolute
                                chartConfig={{
                                    backgroundColor: "#e26a00",
                                    backgroundGradientFrom: "#fb8c00",
                                    backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 0, 
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "4",
                                        stroke: "#ffa726"
                                    }
                                }}
                            />
                            <View style={{margin:10,alignItems: 'center',justifyContent: 'center'}}>
                                <Text style={{fontSize:18,fontWeight:'bold'}}>Total Weight: {currencyFormat(totalWeight)}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={async ()=>[setChooseChart("bar"),toggleSlide()]}>
                        <View style={{alignItems: 'center',justifyContent: 'center'}}>
                            <View>
                                <BarChart
                                    data={BarData}
                                    width={Dimensions.get("window").width}
                                    height={300}
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
                        </View>
                    </TouchableOpacity>
                </View>
                )
            )}
            </KeyboardAvoidWrapper>
            {isHidden==false ? (
                chooseChart=="pie" ? (
                <Animated.View style={[{transform: [{translateY: bounceValue}],padding:15}]}>
                    <View style={{alignItems: 'center',justifyContent: 'center',height:Dimensions.get("screen").height/100*35}}>
                        <View style={{width:"85%",alignItems: 'flex-start',justifyContent: 'flex-start'}}>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>Net Weight List:</Text>
                        </View>
                        <View>
                            <FlatList
                                data={fetchedData}
                                renderItem={pieChartItem}
                                keyExtractor={(item) => item.accode}
                            />
                        </View>
                    </View>
                </Animated.View>
                ) : (
                <Animated.View style={[{transform: [{translateY: bounceValue}],padding:15}]}>
                    <View style={{alignItems: 'center',justifyContent: 'center',height:Dimensions.get("screen").height/100*40}}>
                        <View style={{width:"85%",alignItems: 'flex-start',justifyContent: 'flex-start'}}>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>Last 4 Days Review:</Text>
                        </View>
                        <View>
                            <FlatList
                                data={fetchedBarData}
                                renderItem={barChartItem}
                                keyExtractor={(item) => item.accode}
                            />
                        </View>
                    </View>
                </Animated.View>
                )
            ) : (
                <Animated.View style={[{transform: [{translateY: bounceValue}],height:0}]}></Animated.View>
            )}
        </MainContainer>
    );
}

export default DetailScreen;