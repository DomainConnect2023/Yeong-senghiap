import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, Pressable, TextInput, Platform, StyleSheet } from "react-native";
// import { LineChart,} from "react-native-chart-kit";
import Snackbar from 'react-native-snackbar';
import { useNavigation } from '@react-navigation/native';
import MainContainer from '../components/MainContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css, datepickerCSS } from '../objects/commonCSS';
import { BarData, currencyFormat, showData } from '../objects/objects';
import RNFetchBlob from 'rn-fetch-blob';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ProgressBar } from 'react-native-paper';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import { LineChart, ruleTypes } from 'react-native-gifted-charts';
import { latestData, ptData, rundata, testdata } from './data';
import { clone } from 'react-native-gifted-charts/src/utils';

const DashboardScreen = ({route}: {route: any}) => {
    const navigation = useNavigation();

    const getDate = new Date;
    const [todayDate, setTodayDate] = useState<string | "">(getDate.toISOString().split('T')[0]+" 00:00:00"); // for API

    // DatePicker
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getDate.toDateString());
    const [selectedIOSDate, setSelectedIOSDate] = useState(new Date());

    // IOS Date picker modal setup
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const hideIOSDatePicker = () => {
        setDatePickerVisible(false);
    };
    // END IOS Date Picker modal setup

    const [fetchedData, setFetchedData] = useState<showData[]>([]); // Flatlist
    const [BarData, setBarData] = useState<BarData>({ labels: [], datasets: [{ data: [0] }] });
    const [totalWeight, setTotalWeight] = useState<number>(0); // total weight

    const [dataProcess, setDataProcess] = useState(false); // check when loading data

    const [stayPage, setStayPage] = useState("product");
    const [itemID, setItemID] = useState("");
    const [itemName, setItemName] = useState("");

    useEffect(()=> { // when starting the page 
        (async()=> {
            setDataProcess(true);
            setFetchedData([]);
            setBarData({ labels: [], datasets: [{ data: [] }] });

            if(route.params.stayPage=="product"){
                const productCode = await AsyncStorage.getItem('productCode');
                const productName = await AsyncStorage.getItem('productName') ?? "";
                if(productCode!="" && productCode!=null){
                    setItemID(productCode);
                    setItemName(productName);
                    setStayPage("product");
                    setTodayDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    setSelectedDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    await fetchDataApi(await AsyncStorage.getItem('fromDate'), "product", true, productCode);

                }else{
                    setStayPage("product");
                    setTodayDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    setSelectedDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    await fetchDataApi(await AsyncStorage.getItem('fromDate'), "product", false, "");
                }
    
            }else if(route.params.stayPage=="customer"){
                const accode = await AsyncStorage.getItem('accode');
                const customerName = await AsyncStorage.getItem('customerName') ?? "";
                if(accode!="" && accode!=null){
                    setItemID(accode);
                    setItemName(customerName);
                    setStayPage("customer");
                    setTodayDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    setSelectedDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    await fetchDataApi(await AsyncStorage.getItem('fromDate'), "customer", true, accode);
                    
                }else{
                    setStayPage("customer");
                    setTodayDate(await AsyncStorage.getItem('fromDate') ?? "");
                    setSelectedDate(await AsyncStorage.getItem('fromDate') ?? "");
                    await fetchDataApi(await AsyncStorage.getItem('fromDate'), "customer", false, "");
                }

            }else if(route.params.stayPage=="salesman"){
                const salesmancode = await AsyncStorage.getItem('salesmancode');
                if(salesmancode!="" && salesmancode!=null){
                    setStayPage("salesman");
                    setTodayDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    setSelectedDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    await fetchDataApi(await AsyncStorage.getItem('fromDate'), "salesman", false, "");
                    
                }else{
                    setStayPage("salesman");
                    setTodayDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    setSelectedDate(await AsyncStorage.getItem('fromDate') ?? getDate.toISOString().split('T')[0]+" 00:00:00");
                    await fetchDataApi(await AsyncStorage.getItem('fromDate'), "salesman", false, "");
                }
            }
        })();
    }, []);

    const fetchDataApi = async(theDate: any, type: any, detail: any, code: any) => {
        // console.log(theDate+" "+type+" "+detail+" "+code);
        let params;
        setFetchedData([]);
        setBarData({ labels: [], datasets: [{ data: [] }] });
        var getIPaddress=await AsyncStorage.getItem('IPaddress');

        if(type=="product"){
            if(detail==false){
                params={
                    "read":"1", 
                    "todayDate":theDate
                };
            }else{
                params={
                    "readDetail":"1", 
                    "fromDate":theDate,
                    "toDate":theDate,
                    "productCode":code
                };
            }
            
        }else if(type=="customer"){
            if(detail==false){
                params={
                    "readCustomer":"1", 
                    "todayDate":theDate
                };
            }else{
                params={
                    "readCustomerDetail":"1", 
                    "fromDate":theDate,
                    "toDate":theDate,
                    "accode":code
                };
            }
            
        }else if(type=="salesman"){
            if(detail==false){
                params={
                    "readSalesman":"1", 
                    "todayDate":theDate
                };
            }
        }

        await RNFetchBlob.config({
            trusty: true
        }).fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/report.php",{
                "Content-Type": "application/json",  
            }, JSON.stringify(params),
        ).then(async (response) => {
            if(await response.json().status=="1"){
                setFetchedData(response.json().data.map((item: { weight: string; key: any; name: any; }) => ({
                    key: item.key,
                    name: item.name==null ? "Others" : item.name,
                    weight: item.weight,
                })));

                const WeightArray=(response.json().barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight));
                const MaxWeight = Math.max.apply(Math, WeightArray); // 127415 
                const MaxWeight_Rounded = Math.ceil(MaxWeight / (4 * 5 * 1000)) * (4 * 5 * 1000);
                // const MaxWeight_Rounded = Math.ceil(MaxWeight/100000) * 100000; // 200000 
                
                const convertedData: BarData = {
                    labels: response.json().barData.map((item: { dateValue: any; }) => item.dateValue.substring(2,10)),
                    datasets: [
                        {
                            data: response.json().barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight),
                        },
                        {
                            data: [MaxWeight_Rounded],
                            withDots: false,
                        },
                    ],
                };
                setBarData(convertedData);
                setTotalWeight(response.json().totalWeight);
                setDataProcess(false);
            }else{
                Snackbar.show({
                    text: 'Something is wrong. Can not get the data from server!',
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

    const FlatListItem = ({ item }: { item: showData }) => {
        return (
            <TouchableOpacity onPress={async () => {

                if(stayPage=="product" && itemID!=""){
                    await AsyncStorage.setItem('productCode', "");
                    await AsyncStorage.setItem('accode', item.key);
                    await AsyncStorage.setItem('customerName', item.name);
                    navigation.navigate('Customer' as never);
                }else if(stayPage=="customer" && itemID!=""){
                    await AsyncStorage.setItem('accode', "");
                    await AsyncStorage.setItem('productCode', item.key);
                    await AsyncStorage.setItem('productName', item.name);
                    navigation.navigate('Product' as never);
                }else if(stayPage=="salesman"){
                    if(item.key==null){
                        await AsyncStorage.setItem('salesmancode', "null");
                    }else{
                        await AsyncStorage.setItem('salesmancode', item.key);
                    }
                    await AsyncStorage.setItem('fromDate', todayDate);
                    navigation.navigate("Detail" as never);
                }else{
                    if(stayPage=="product"){
                        setDataProcess(true);
                        setItemName(item.name);
                        setItemID(item.key);
                        await AsyncStorage.setItem('productCode', item.key);
                        await AsyncStorage.setItem('productName', item.name);
                        await AsyncStorage.setItem('accode', "");
                        
                        await fetchDataApi(todayDate,"product",true,item.key);
                    }else if(stayPage=="customer"){
                        setDataProcess(true);
                        setItemName(item.name);
                        setItemID(item.key);
                        await AsyncStorage.setItem('accode', item.key);
                        await AsyncStorage.setItem('customerName', item.name);
                        await AsyncStorage.setItem('productCode', "");
                        await fetchDataApi(todayDate,"customer",true,item.key);
                    }
                }
            }}>
                <View style={css.listItem} key={parseInt(item.key)}>
                    <View style={[css.cardBody]}>
                        <View style={{alignItems: 'flex-start',justifyContent: 'center'}}>
                            <View style={{flexDirection: 'row',}}>
                                <View style={{flexDirection:'column',width:"70%"}}>
                                    <Text style={css.basicTextHeader} numberOfLines={2}>
                                    { stayPage=="salesman"
                                    ? ("Salesman: ")
                                    : stayPage=="product" 
                                        ? itemID=="" 
                                            ? ("Product: ") 
                                            : ("Customer: ") 
                                        : itemID=="" 
                                            ? ("Customer: ")
                                            : ("Product: ")
                                    } 
                                    {item.name!="" ? item.name : item.key}</Text>
                                    {item.weight==null ? (
                                        <ProgressBar
                                        style={{width:"100%", height: 10}}
                                        progress={0}
                                        color={"#8561c5"}
                                    />
                                    ) : (
                                        <ProgressBar
                                            style={{width:"100%", height: 10}}
                                            progress={Math.round(parseInt(item.weight)/totalWeight*100)/100}
                                            color={"#8561c5"}
                                        />
                                    )}
                                </View>
                                <View style={{flexDirection:'column',width:"30%"}}>
                                    <Text style={[css.basicTextDiscription,{verticalAlign:"middle",textAlign:"right"}]}>
                                            Weight: {currencyFormat(parseInt(item.weight))}
                                    </Text>
                                    <Text style={[css.basicTextDiscription,{textAlign:"right"}]}>
                                        { item.weight==null ? (
                                            0
                                        ) : (
                                            (Math.ceil(parseInt(item.weight))/totalWeight*100).toFixed(2)
                                            // Math.round(parseInt(item.weight)/totalWeight*100)
                                        )}%
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Date Picker
    const onChangeDate = async ({type}: any, selectedDate: any) => {
        // console.log(selectedDate);
        setShowPicker(false);
        if(type=="set"){
            const currentDate=selectedDate.toISOString().split('T')[0];
            await AsyncStorage.setItem('fromDate', currentDate+" 00:00:00");
            await AsyncStorage.setItem('toDate', currentDate+" 00:00:00");
            if(Platform.OS==="android"){
                setSelectedDate(selectedDate.toDateString());
                setTodayDate(currentDate);
                setDataProcess(true);
                if(route.params.stayPage=="product"){
                    if(itemID==""){
                        await fetchDataApi(currentDate+" 00:00:00","product",false,"");
                    }else{
                        await fetchDataApi(currentDate+" 00:00:00","product",true,itemID);
                    }
                    
                }else if(route.params.stayPage=="customer"){
                    if(itemID==""){
                        await fetchDataApi(currentDate+" 00:00:00","customer",false,"");
                    }else{
                        await fetchDataApi(currentDate+" 00:00:00","customer",true,itemID);
                    }
                }else if(route.params.stayPage=="salesman"){
                    await fetchDataApi(currentDate+" 00:00:00", "salesman", false, "");
                }
            }
        }
    }

    const confirmIOSDate = async(date: any) => {
        const currentDate=date;
        setTodayDate(currentDate.toISOString().split('T')[0]);
        await AsyncStorage.setItem('fromDate', currentDate+" 00:00:00");
        await AsyncStorage.setItem('toDate', currentDate+" 00:00:00");
        setSelectedDate(date.toDateString());
        setDataProcess(true);
        setDatePickerVisible(false);
        let isDetail= true;
        if(itemID=="")
        {
            isDetail = false;
        }
        await fetchDataApi(todayDate,route.params.stayPage,isDetail,itemID);
    }
    const tonggleDatePicker = () => {
        if (Platform.OS === 'android') {
            setShowPicker(!showPicker);
        }
        else if (Platform.OS === 'ios') {
            setDatePickerVisible(true);
        }
    }
    // End Date Picker

    return (
        <MainContainer>
            {dataProcess== true ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View style={{height:Dimensions.get("screen").height/100*76}}>
                    <View style={styles.firstContainer}>
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
                                    style={datepickerCSS.textInput}
                                    placeholder="Select Date"
                                    value={selectedDate.toString().substring(0,10)}
                                    onChangeText={setTodayDate}
                                    placeholderTextColor="#11182744"
                                    editable={false}
                                    onPressIn={tonggleDatePicker}
                                />
                            </Pressable>
                        </View>    
                        {Platform.OS === "ios" && (<DateTimePickerModal
                            date={selectedIOSDate}
                            isVisible={datePickerVisible}
                            mode="date"
                            display='inline'
                            onConfirm={confirmIOSDate}
                            onCancel={hideIOSDatePicker}
                        />)}
                        {/* End Set Date */}

                        <View style={[{marginTop:5,marginBottom:5}]}>
                            <Text style={[{fontSize:8,color:"red",textAlign:"center",marginBottom:-10}]}>Click to reset*</Text>
                            <TouchableOpacity style={[css.row,{margin:0}]} onPress={async () => {
                                setDataProcess(true);
                                await AsyncStorage.setItem('accode', "");
                                await AsyncStorage.setItem('productCode', "");
                                setItemName("");
                                setItemID("");

                                if(stayPage=="product"){
                                    setStayPage("product");
                                    await fetchDataApi(todayDate,"product",false,"");
                                }else if(stayPage=="customer"){
                                    setStayPage("customer");
                                    await fetchDataApi(todayDate,"customer",false,"");
                                }else if(stayPage=="salesman"){
                                    setStayPage("salesman");
                                    await fetchDataApi(todayDate,"salesman",false,"");
                                }
                            }}>
                                <Text style={[
                                    css.pressableCSS,{
                                        fontSize:16,
                                        fontWeight:'bold',
                                        textAlign:"center",
                                        fontStyle:"italic",
                                        width:Dimensions.get("screen").width/100*50,
                                        padding:5
                                    }]} 
                                numberOfLines={2}>
                                    {stayPage=="product" 
                                    ? itemID=="" 
                                        ? ("All Product") 
                                        : itemName=="" ? (itemID) : (itemName)
                                    : stayPage=="customer"
                                    ? itemID==""
                                        ? ("All Customer")
                                        : itemName=="" ? (itemID) : (itemName)
                                    : itemID==""
                                        ? ("All Salesman")
                                        : itemName=="" ? (itemID) : (itemName)
                                    }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.secondContainer}>
                    {/* <LineChart
                        data={rundata}
                        spacing={22}
                        thickness={5}
                        color="red"
                        hideRules
                        hideDataPoints
                        xAxisThickness={0}
                        yAxisThickness={0}
                        highlightedRange={{
                            from: 5,
                            to: 12,
                            color: 'green',
                        }}
                    /> */}
                    <LineChart
                        areaChart
                        stepChart
                        hideDataPoints
                        isAnimated
                        animationDuration={1200}
                        startFillColor="#0BA5A4"
                        startOpacity={1}
                        endOpacity={0.3}
                        initialSpacing={0}
                        data={testdata}
                        spacing={30}
                        thickness={5}
                        // hideRules
                        // hideYAxisText
                        yAxisColor="#0BA5A4"
                        showVerticalLines
                        verticalLinesColor="rgba(14,164,164,0.5)"
                        xAxisColor="#0BA5A4"
                        color="#0BA5A4"
                        width={Dimensions.get("screen").width/100*95}
                        height={180}
                    />
                        <View style={[css.row,{marginTop:5,marginBottom:5}]}>
                            <Text style={{fontSize:20,fontWeight:'bold',textAlign:"center",fontStyle:"italic"}}>
                                Total Weight: {currencyFormat(totalWeight)}
                            </Text>
                        </View>
                    </View>

                    <FlatList
                        data={fetchedData}
                        renderItem={FlatListItem}
                        keyExtractor={(item) => item.key}
                    />
                </View>
            )}
        </MainContainer>
    );
}

const styles = StyleSheet.create({
    firstContainer: {
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondContainer: {
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DashboardScreen;