import * as React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Image, Animated, BackHandler, ToastAndroid, Platform, Pressable, TextInput, ProgressBarAndroid } from "react-native";
import { useEffect, useState } from 'react';
import { BarChart, LineChart, PieChart,} from "react-native-chart-kit";
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
import { css, datepickerCSS, dropdownCSS } from '../objects/commonCSS';
import { CircleColorText, ProductData, PieData, BarData, currencyFormat } from '../objects/objects';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNFetchBlob from 'rn-fetch-blob';
import { Dropdown } from 'react-native-searchable-dropdown-kj';

const DashboardScreen2 = () => {
    const navigation = useNavigation();

    const getDate = new Date;
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

    const [chooseType, setChooseType] = useState("Overall");

    // when clicking pie / bar chart use
    const [chooseChart, setChooseChart] = useState("pie");
    const [isHidden, setIsHidden] = useState(true);
    const [ bounceValue, setBounceValue ] = useState(new Animated.Value(300));

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

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

    // get data from database
    const fetchDataApi = async(todayDate: any) => {
        var getIPaddress=await AsyncStorage.getItem('IPaddress');
        
        // await axios.post("https://"+getIPaddress+"/senghiap/mobile/report.php", 
        //     { "read":"1", "todayDate":todayDate, })
        // .then(async response => {
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

    const data = [
        { label: 'All', value: 'all' },
        { label: 'Product 1', value: '1' },
        { label: 'Product 2', value: '2' },
        { label: 'Product 3', value: '3' },
        { label: 'Product 4', value: '4' },
        { label: 'Product 5', value: '5' },
        { label: 'Product 6', value: '6' },
        { label: 'Product 7', value: '7' },
        { label: 'Product 8', value: '8' },
      ];

    const pieChartItem = ({ item }: { item: ProductData }) => {
        return (
            <TouchableOpacity onPress={() => {
                setIsHidden(!isHidden);
                AsyncStorage.setItem('productCode', item.key);
                AsyncStorage.setItem('productName', item.name);
                AsyncStorage.setItem('fromDate', todayDate ?? "");
                AsyncStorage.setItem('toDate', todayDate ?? "");
                navigation.navigate(DetailScreen as never);
            }}>
                <View style={css.listItem} key={parseInt(item.key)}>
                    <View style={[css.cardBody]}>
                        <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={css.textHeader}>Product: {item.key} {item.name!="" ? "("+item.name+")" : ""}</Text>
                                <Text style={css.textDescription}>
                                    Weight: {currencyFormat(parseInt(item.totalWeight))}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row',}}>
                                <ProgressBarAndroid
                                    style={{width:"70%"}}
                                    styleAttr="Horizontal"
                                    indeterminate={false}
                                    progress={Math.round(parseInt(item.totalWeight)/totalWeight*100)/100}
                                />
                                <Text style={[css.textDescription,{width:"30%", textAlign:"center"}]}>
                                    {Math.round(parseInt(item.totalWeight)/totalWeight*100)}%
                                </Text>
                            </View>
                            {/* <Text style={css.textHeader}></Text> */}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <MainContainer>
            {/* <KeyboardAvoidWrapper> */}
            <View style={[dash.mainView,{alignItems: 'center',justifyContent: 'center'}]}>
                <View style={dash.HeaderView}>
                    <Text style={dash.PageName}>Dashboard (Daily Receiving)</Text>
                </View>
                <View style={{flexDirection: 'row',}}>
                    <View style={dash.listThing}>
                        <Ionicons name="search-circle-sharp" size={32} color="#FFF" onPress={()=>navigation.navigate(SearchScreen as never)} />
                    </View>
                    <View style={dash.listThing}>
                        <Ionicons name="log-out-outline" size={32} color="#FFF" onPress={()=>{[navigation.navigate(LoginScreen as never)]}} />
                    </View>
                </View>
            </View>
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
                                height:20,
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

                    <View style={dash.row}>    
                        <Dropdown
                            style={[dropdownCSS.dropdown,{height:35,margin:5,width:"60%"}]}
                            activeColor={"#E5E4E2"}
                            placeholderStyle={dropdownCSS.placeholderStyle}
                            selectedTextStyle={dropdownCSS.selectedTextStyle}
                            inputSearchStyle={dropdownCSS.inputSearchStyle}
                            iconStyle={dropdownCSS.iconStyle}
                            search
                            data={data}
                            labelField="label"
                            valueField="value"
                            placeholder="All Product"
                            searchPlaceholder="Search..."
                            value={value}
                            onChange={item => {
                                setValue(item.value);
                                setIsFocus(false);
                            }}
                            renderLeftIcon={() => (
                                <Ionicons
                                    style={{marginRight: 5,}}
                                    color={"blue"}
                                    name="person-circle-outline"
                                    size={20}
                                />
                            )}
                        /> 
                    </View>

                    {/* {chooseType=="Overall" ? (
                    <View style={[dash.row,{marginLeft:10,marginRight:10,marginTop:5}]}>              
                        <View style={[dash.selectType, {flex: 1, backgroundColor:"#c8c8dc"}]}>
                            <TouchableOpacity onPress={() => {setChooseType("Overall");}}>
                                <Text style={dash.selectText}>Overall</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[dash.selectType, {flex: 1}]}>
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
                    </View>
                    ) : chooseType=="Product" ? (
                    <View style={[dash.row,{marginLeft:10,marginRight:10,marginTop:5}]}>              
                        <View style={[dash.selectType, {flex: 1}]}>
                            <TouchableOpacity onPress={() => {setChooseType("Overall");}}>
                                <Text style={dash.selectText}>Overall</Text>
                            </TouchableOpacity>
                        </View>
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
                    </View>
                    ) : chooseType=="Customer" ? (
                        <View style={[dash.row,{marginLeft:10,marginRight:10,marginTop:5}]}>              
                            <View style={[dash.selectType, {flex: 1}]}>
                                <TouchableOpacity onPress={() => {setChooseType("Overall");}}>
                                    <Text style={dash.selectText}>Overall</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[dash.selectType, {flex: 1}]}>
                                <TouchableOpacity onPress={() => {setChooseType("Product");}}>
                                    <Text style={dash.selectText}>Product</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[dash.selectType, {flex: 1, backgroundColor:"#c8c8dc"}]}>
                                <TouchableOpacity onPress={() => {setChooseType("Customer");}}>
                                    <Text style={dash.selectText}>Customer</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[dash.selectType, {flex: 1}]}>
                                <TouchableOpacity onPress={() => {setChooseType("Salesman");}}>
                                    <Text style={dash.selectText}>Salesman</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : ( // Salesman
                        <View style={[dash.row,{marginLeft:10,marginRight:10,marginTop:5}]}>              
                            <View style={[dash.selectType, {flex: 1}]}>
                                <TouchableOpacity onPress={() => {setChooseType("Overall");}}>
                                    <Text style={dash.selectText}>Overall</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[dash.selectType, {flex: 1}]}>
                                <TouchableOpacity onPress={() => {setChooseType("Product");}}>
                                    <Text style={dash.selectText}>Product</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[dash.selectType, {flex: 1}]}>
                                <TouchableOpacity onPress={() => {setChooseType("Customer");}}>
                                    <Text style={dash.selectText}>Customer</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[dash.selectType, {flex: 1, backgroundColor:"#c8c8dc"}]}>
                                <TouchableOpacity onPress={() => {setChooseType("Salesman");}}>
                                    <Text style={dash.selectText}>Salesman</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )} */}

                    <View style={{alignItems: 'center',justifyContent: 'center'}}>
                        <BarChart
                            data={BarData}
                            width={Dimensions.get("window").width}
                            height={160}
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

                    {/* <View style={dash.row}>
                        <View style={[dash.selectType,{flexDirection:"row",}]}>
                            <Text>Overall</Text>
                            <Text>Product</Text>
                            <Text>Customer</Text>
                            <Text>Salesman</Text>
                        </View>
                    </View> */}

                    <View style={dash.row}>
                        <Text style={{fontSize:16,fontWeight:'bold',textAlign:"center"}}>
                            Total Weight: {totalWeight}
                        </Text>
                    </View>
                    
                    <View style={{alignItems: 'center',justifyContent: 'center',backgroundColor:"gray"}}>
                        <View style={{height:Dimensions.get("screen").height/100*43}}>
                            <FlatList
                                data={fetchedListData}
                                renderItem={pieChartItem}
                                keyExtractor={(item) => item.key}
                            />
                        </View>
                    </View>
                    
                </View>
            )}
            {/* </KeyboardAvoidWrapper> */}
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
        marginTop: 5,
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
});

export default DashboardScreen2;