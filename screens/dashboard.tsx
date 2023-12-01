import * as React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Image, Animated, BackHandler, ToastAndroid, Platform, Pressable, TextInput } from "react-native";
import { useEffect, useState } from 'react';
import { BarChart, PieChart,} from "react-native-chart-kit";
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import DetailScreen from './detailProduct';
import MainContainer from '../components/MainContainer';
import SearchScreen from './searchScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorDB } from '../objects/colors';
import { ImagesAssets } from '../objects/images';
import LoginScreen from './loginScreen';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import { URLAccess } from '../objects/URLAccess';
import { css, datepickerCSS } from '../objects/commonCSS';
import { CircleColorText, ProductData, PieData, BarData, currencyFormat } from '../objects/objects';
import DateTimePicker from '@react-native-community/datetimepicker';

const DashboardScreen = () => {
    const navigation = useNavigation();

    const getDate = new Date;

    // const currYear = new Date().getFullYear();
    // const currDay = new Date().getDate();
    // const setDate = currYear+"-09-"+currDay;
    // const dummyDate = getDate.toISOString().split('T')[0];

    // const [todayDate, setTodayDate] = useState<string | "">(setDate+" 00:00:00");
    // const [showDate, setShowDate] = useState<string | "">(dummyDate);
    const [todayDate, setTodayDate] = useState<string | "">(getDate.toISOString().split('T')[0]+" 00:00:00"); // for API
    const [showDate, setShowDate] = useState<string | "">(getDate.toISOString().split('T')[0]); // For show Text only

    // DatePicker
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getDate.toDateString());
    const [selectedIOSDate, setSelectedIOSDate] = useState(new Date());

    const [fetchedListData, setFetchedListData] = useState<ProductData[]>([]); // Flatlist with Pie
    const [PieData, setPieData] = useState<PieData[]>([]);
    const [fetchedBarData, setFetchedBarData] = useState<ProductData[]>([]); // Flatlist with Bar
    const [BarData, setBarData] = useState<BarData>({ labels: [], datasets: [{ data: [] }] });
    const [totalWeight, setTotalWeight] = useState<number>(0); // total weight

    const [dataProcess, setDataProcess] = useState(false); // check when loading data
    let colorSelected = 0; // set color use

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
    }, [])

    const toggleSlide = ()=> { // for showing chart use
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
                setSelectedDate(currentDate);
                setTodayDate(currentDate);
                setShowPicker(false);
                setDataProcess(true);
                setIsHidden(true);
                setShowDate(currentDate.toISOString().split('T')[0]);
                AsyncStorage.setItem('fromDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
                AsyncStorage.setItem('toDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
                await fetchDataApi(currentDate.toISOString().split('T')[0]);
            }
        }else{
            tonggleDatePicker();
        }
    }

    const confirmIOSDate = async() => {
        const currentDate=selectedIOSDate;
        setShowDate(currentDate.toISOString().split('T')[0]);
        setTodayDate(currentDate.toISOString().split('T')[0]);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
        AsyncStorage.setItem('fromDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
        AsyncStorage.setItem('toDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
        setDataProcess(true);
        tonggleDatePicker();
        await fetchDataApi(currentDate.toISOString().split('T')[0]);
    }
    const tonggleDatePicker = () => {
        setShowPicker(!showPicker);
    }
    // End Date Picker

    // get data from database
    const fetchDataApi = async(todayDate: any) => {
        var getIPaddress=await AsyncStorage.getItem('IPaddress');
        // await axios.post(URLAccess.reportFunction, 
        await axios.post("https://"+getIPaddress+"/senghiap/mobile/report.php", 
            { "read":"1", "todayDate":todayDate, })
        .then(async response => {
            if(response.data.status=="1"){
                setFetchedListData(response.data.data.map((item: { totalWeight: string; key: any; name: any; }) => ({
                    key: item.key,
                    name: item.name,
                    totalWeight: item.totalWeight,
                    color: colorDB.colors[colorSelected<5 ? colorSelected+=1 : colorSelected]["hex"],
                })));

                colorSelected=0;
                setPieData(response.data.pieData.map(
                    (item: { value: number; key: any; totalWeight: any;}) => ({
                        value: Math.round(item.totalWeight/response.data.totalWeight*100*100)/100,
                        name: "%",
                        totalWeight: item.totalWeight,
                        percentage: item.totalWeight/response.data.totalWeight*100,
                        color: colorDB.colors[colorSelected<5 ? colorSelected+=1 : colorSelected]["hex"],
                    })
                ));

                const convertedData: BarData = {
                    labels: response.data.barData.map((item: { days: any; }) => item.days),
                    datasets: [{
                        data: response.data.barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight),
                    },],
                };
                setBarData(convertedData);

                setFetchedBarData(response.data.barData.map((item: { days: any; key: any; dayTotalWeight: any; dateValue: any }) => ({
                    key: item.key,
                    name: item.days,
                    value: item.dateValue,
                    totalWeight: item.dayTotalWeight,
                    color: "",
                })));

                setTotalWeight(response.data.totalWeight);
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

    const pieChartItem = ({ item }: { item: ProductData }) => {
        return (
            <TouchableOpacity onPress={() => {
                setIsHidden(!isHidden);
                AsyncStorage.setItem('productCode', item.key);
                AsyncStorage.setItem('productName', item.name);
                AsyncStorage.setItem('fromDate', todayDate ?? "");
                AsyncStorage.setItem('toDate', todayDate ?? "");
                // AsyncStorage.setItem('dummyDate', showDate ?? "");
                navigation.navigate(DetailScreen as never);
            }}>
                <View style={css.listItem} key={parseInt(item.key)}>
                    <View style={[css.cardBody]}>
                        <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={css.textHeader}>Product: {item.key} {item.name!="" ? "("+item.name+")" : ""}</Text>
                                <Text style={css.textDescription}>
                                    <CircleColorText color={item.color} />
                                </Text>
                            </View>
                            <Text style={css.textHeader}>Weight: {currencyFormat(parseInt(item.totalWeight))}</Text>
                            </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const barChartItem = ({ item }: { item: ProductData }) => {
        return (
            <TouchableOpacity onPress={() => {
                // if(item.value!="0"){
                //     setDataProcess(true);
                //     setIsHidden(true);
                //     setSelectedDate(item.value);
                //     setTodayDate(item.value);
                //     setShowDate(item.value);
                //     AsyncStorage.setItem('fromDate', item.value),
                //     AsyncStorage.setItem('toDate', item.value),
                //     fetchDataApi(item.value);
                // }else{
                //     Snackbar.show({
                //         text: "Can't choose the zero value on that day.",
                //         duration: Snackbar.LENGTH_SHORT,
                //     });
                // }
            }}>
                <View style={css.listItem} key={parseInt(item.key)}>
                    <View style={[css.cardBody]}>
                        <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={css.textHeader}>{item.name}</Text>
                            </View>
                            <Text style={css.textHeader}>Day of Total Weight: {currencyFormat(parseInt(item.totalWeight))}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
            <View style={[css.mainView,{alignItems: 'center',justifyContent: 'center'}]}>
                <View style={css.HeaderView}>
                    <Text style={css.PageName}>Dashboard</Text>
                </View>
                <View style={{flexDirection: 'row',}}>
                    <View style={css.listThing}>
                        <Ionicons name="search-circle-sharp" size={40} color="#FFF" onPress={()=>navigation.navigate(SearchScreen as never)} />
                    </View>
                    <View style={css.listThing}>
                        <Ionicons name="log-out-outline" size={40} color="#FFF" onPress={()=>{[navigation.navigate(LoginScreen as never)]}} />
                    </View>
                </View>
            </View>

            {/* {isHidden==false ? (
                <View style={[css.row,{backgroundColor:'rgba(0, 0, 0, 0.3)',zIndex: 100}]}>
                    <Text>{showDate}</Text>
                </View>
            ):(
                <View style={[css.row]}>
                    <Text>{showDate}</Text>
                </View>
            )} */}

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
                <Pressable  style={css.pressableCSS} onPress={tonggleDatePicker}>
                <TextInput
                    style={{color: "#000", textAlign: "center", fontSize:18,}}
                    placeholder="Select Date"
                    value={selectedDate.toString().substring(0,10)}
                    onChangeText={setTodayDate}
                    placeholderTextColor="#11182744"
                    editable={false}
                    onPressIn={tonggleDatePicker}
                />
                </Pressable>
            </View>
            ) : (
                <View style={css.row}>
                {showPicker && Platform.OS === 'android' && <DateTimePicker 
                    mode="date"
                    display="calendar"
                    value={getDate}
                    onChange={onChangeDate}
                    style={datepickerCSS.datePicker}
                />}        
                <Pressable style={css.pressableCSS} onPress={tonggleDatePicker} >
                <TextInput
                    style={{color: "#000", textAlign: "center", fontSize:18}}
                    placeholder="Select Date"
                    value={selectedDate.toString().substring(0,10)}
                    onChangeText={setTodayDate}
                    placeholderTextColor="#11182744"
                    editable={false}
                    onPressIn={tonggleDatePicker}
                />
                </Pressable>
            </View>    
            )}
            {/* End Select Date */}

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
                    {fetchedListData.length==0 ? (
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
                    <View style={{alignItems: 'center',justifyContent: 'center',height:Dimensions.get("screen").height/100*30}}>
                        <View style={{width:"85%",alignItems: 'flex-start',justifyContent: 'flex-start'}}>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>Net Weight List:</Text>
                        </View>
                        <View>
                            <FlatList
                            data={fetchedListData}
                            renderItem={pieChartItem}
                            keyExtractor={(item) => item.key}
                            />
                        </View>
                    </View>
                </Animated.View>
                ) : (
                <Animated.View style={[{transform: [{translateY: bounceValue}],padding:15}]}>
                    <View style={{alignItems: 'center',justifyContent: 'center',height:Dimensions.get("screen").height/100*33}}>
                        <View style={{width:"85%",alignItems: 'flex-start',justifyContent: 'flex-start'}}>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>Last 4 Days Review:</Text>
                        </View>
                        <View>
                            <FlatList
                            data={fetchedBarData}
                            renderItem={barChartItem}
                            keyExtractor={(item) => item.key}
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
export default DashboardScreen;