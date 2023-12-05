import * as React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Pressable, TextInput, ActivityIndicator } from "react-native";
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { MultiSelect } from 'react-native-searchable-dropdown-kj';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchCustomerDetail from './SearchCustomerDetail';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import { URLAccess } from '../objects/URLAccess';
import SerachProductDetail from './SearchProductDetail';
import { css, dropdownCSS, datepickerCSS } from '../objects/commonCSS';
import RNFetchBlob from 'rn-fetch-blob';

interface CustomerData {
    label: string;
    value: string;
}

interface ProductData {
    label: string;
    value: string;
}

const SearchScreen = () => {
    const navigation = useNavigation();

    // Date Setup
    const [showFDPicker, setShowFDPicker] = useState(false);
    const [showTDPicker, setShowTDPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [keepFromDateData, setKeepFromDateData] = useState("");
    const [keepToDateData, setKeepToDateData] = useState("");

    const [dummyFromMonthData, setDummyFromMonthData] = useState("");
    const [dummyToMonthData, setDummyToMonthData] = useState("");
    // End Date Setup

    // DropDown Setup
    const [dataProcess, setDataProcess] = useState(false);
    const [hideItem, setHideItem] = useState(false);
    const [noCustomerDataList, setNoCustomerDataList] = useState(false);
    const [noProductDataList, setNoProductDataList] = useState(false);
    const [fetchedCustomerData, setFetchedCustomerData] = useState<CustomerData[]>([]);
    const [fetchedProductData, setFetchedProductData] = useState<ProductData[]>([]);
    // End DropDown Setup


    const [isCustomerFocus, setIsCustomerFocus] = useState(false);
    const [customerArr, setCustomerArr] = useState(["all"]);

    const [isProductFocus, setIsProductFocus] = useState(false);
    const [productArr, setProductArr] = useState(["all"]);

    // Type Setup
    const [typeCatch, setTypeCatch] = useState("customer");
    // End Type Setup


    // Set FromDate function 
    const onChangeFromDate = async ({type}: any, selectedDate: any) => {
        if(type=="set"){
            const currentDate=selectedDate;
            setDate(currentDate);
            if(Platform.OS==="android"){
                tonggleFromDatePicker();
                setFromDate(currentDate.toDateString());

                setKeepFromDateData(currentDate.toISOString().split('T')[0]);
                setDummyFromMonthData(currentDate.toISOString().substring(5,7));

                await fetchCustomerApi(typeCatch, currentDate.toISOString().split('T')[0], keepToDateData);
            }
        }else{
            tonggleFromDatePicker();
        }
    }
    const confirmIOSFromDate = async() => {
        setFromDate(date.toDateString());
        setKeepFromDateData(date.toISOString().split('T')[0])
        tonggleFromDatePicker();
        await fetchCustomerApi(typeCatch, date, keepToDateData);
    }
    const tonggleFromDatePicker = () => {
        setShowFDPicker(!showFDPicker);
    }
    //===================================
    // Set ToDate function 
    const onChangeToDate = async ({type}: any, selectedDate: any) => {
        if(type=="set"){
            const currentDate=selectedDate;
            setDate(currentDate);
            if(Platform.OS==="android"){
                tonggleToDatePicker();
                setToDate(currentDate.toDateString());

                setKeepToDateData(currentDate.toISOString().split('T')[0]);
                setDummyToMonthData(currentDate.toISOString().substring(5,7));

                await fetchCustomerApi(typeCatch, keepFromDateData, currentDate.toISOString().split('T')[0]);
            }
        }else{
            tonggleToDatePicker();
        }
    }
    const confirmIOSToDate = async() => {
        setToDate(date.toDateString());
        setKeepToDateData(date.toISOString().split('T')[0])
        tonggleToDatePicker();
        await fetchCustomerApi(typeCatch, keepFromDateData, date);
    }
    const tonggleToDatePicker = () => {
        setShowTDPicker(!showTDPicker);
    }
    // ===============================

    useEffect(()=> {
        (async()=> {
            setHideItem(true);
            setFetchedCustomerData([]);
            setFetchedProductData([]);
            await fetchCustomerApi(typeCatch, keepFromDateData, keepToDateData);
        })();
    }, [])

    const fetchCustomerApi = async(typeCatch: any, getFromDate: any, getToDate: any) => {
        setDataProcess(true);
        var getIPaddress=await AsyncStorage.getItem('IPaddress');
        if(getToDate!="" && getFromDate!=""){
            setHideItem(false);
            typeCatch=="customer" ?
                // await axios.post(URLAccess.getDataFunction, {
                // await axios.post("https://"+getIPaddress+"/senghiap/mobile/getData.php", {
                //     "readCustomer":"1",
                //     "fromDate": getFromDate,
                //     "toDate": getToDate
                // }).then(response => {
                await RNFetchBlob.config({
                    trusty: true
                })
                .fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/getData.php",{
                        "Content-Type": "application/json",  
                    }, JSON.stringify({
                        "readCustomer":"1",
                        "fromDate": getFromDate,
                        "toDate": getToDate
                    }),
                ).then((response) => {
                    if(response.json().status=="1"){
                        setFetchedCustomerData([{"label": "All Customer", "value": "all"}]);
                        setFetchedCustomerData((prevData) => [...prevData, ...response.json().customerData.map((item: { accode: string; customer: any; }) => ({
                            label: item.customer,
                            value: item.accode,
                        }))]);
                        setNoCustomerDataList(false);
                        setDataProcess(false);
                    }else if(response.json().status=="2"){
                        setNoCustomerDataList(true);
                        Snackbar.show({
                        text: 'You do not have customer in these days!',
                        duration: Snackbar.LENGTH_SHORT,
                        });
                        setDataProcess(false);
                    }else{
                        Snackbar.show({
                            text: 'Network Error!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    }
                }).catch(error => {
                    Snackbar.show({
                        text: error.message,
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }) 
                //----------------------------------------------------
                // :   await axios.post(URLAccess.getDataFunction, { 
                //     :   await axios.post("https://"+getIPaddress+"/senghiap/mobile/getData.php", { 
                //             "readProduct2":"1",
                //     "fromDate": getFromDate,
                //     "toDate": getToDate
                // }).then(response => {
                : await RNFetchBlob.config({
                    trusty: true
                })
                .fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/getData.php",{
                        "Content-Type": "application/json",  
                    }, JSON.stringify({
                        "readProduct2":"1",
                        "fromDate": getFromDate,
                        "toDate": getToDate
                    }),
                ).then((response) => {
                    if(response.json().status=="1"){
                        setFetchedProductData([{"label": "All Product", "value": "all"}]);
                        setFetchedProductData((prevData) => [...prevData, ...response.json().productData.map((item: {itemCode: string; product: any; }) => ({
                            // label: item.product,
                            label: item.itemCode,
                            value: item.itemCode,
                        }))]);
                        setNoProductDataList(false);
                        setDataProcess(false);
                    }else{
                        setNoProductDataList(true);
                        Snackbar.show({
                            text: 'You do not have any product!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                        setDataProcess(false);
                    }
                }).catch(error => {
                    Snackbar.show({
                        text: error.message,
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        }
    }
    
    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
                <View style={css.mainView}>
                    <View style={{flexDirection: 'row',}}>
                        <View style={css.listThing}>
                            <Ionicons name="arrow-back-circle-outline" size={40} color="#FFF" onPress={()=>navigation.goBack()} />
                        </View>
                    </View>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>Customize Report</Text>
                    </View>
                </View>
                <View>
                    {/* Choose Product or Customer */}
                    <View style={[css.row,{paddingTop:20}]}>
                        <Text style={css.Title}>Choose Type: </Text>
                        {typeCatch=="customer" ? (
                            <View style={[css.subTitle,css.row]}>
                                <Pressable 
                                    style={[css.typeButton,{backgroundColor:"dimgray"}]}
                                    onPress={async () => [setTypeCatch("customer"), await fetchCustomerApi("customer", keepFromDateData, keepToDateData)]}
                                >
                                    <Text style={css.buttonText}>Customer</Text>
                                </Pressable>
        
                                <Pressable 
                                    style={[css.typeButton,{backgroundColor:"white"}]}
                                    onPress={async () => [setTypeCatch("product"), await fetchCustomerApi("product", keepFromDateData, keepToDateData)]}
                                >
                                    <Text style={[css.buttonText,{color:"black"}]}>Product</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View style={[css.subTitle,css.row]}>
                                <Pressable 
                                    style={[css.typeButton,{backgroundColor:"white"}]}
                                    onPress={async () => [setTypeCatch("customer"), await fetchCustomerApi("customer", keepFromDateData, keepToDateData)]}
                                >
                                    <Text style={[css.buttonText,{color:"black"}]}>Customer</Text>
                                </Pressable>

                                <Pressable 
                                    style={[css.typeButton,{backgroundColor:"dimgray"}]}
                                    onPress={async () => [setTypeCatch("product"), await fetchCustomerApi("product", keepFromDateData, keepToDateData)]}
                                >
                                    <Text style={[css.buttonText,{color:"white"}]}>Product</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                    {/* End Choose Product or Customer */}

                    {/* From Date */}
                        <View style={css.row}>
                        <Text style={css.Title}>From Date: </Text>
                        {showFDPicker && Platform.OS === "android" &&<DateTimePicker 
                            mode="date"
                            display="calendar"
                            value={date}
                            onChange={onChangeFromDate}
                            style={datepickerCSS.datePicker}
                        />}
                    
                        <Pressable
                            style={{
                                width: '60%',
                                marginBottom: 10,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                            }}
                            onPress={tonggleFromDatePicker}
                        >
                        <TextInput
                            style={{color: "#000",}}
                            placeholder="Select From Date"
                            value={fromDate}
                            onChangeText={setFromDate}
                            placeholderTextColor="#11182744"
                            editable={false}
                            onPressIn={tonggleFromDatePicker}
                        />
                        </Pressable>
                    </View>
                    {/* End From Date */}

                    <View>
                        {showFDPicker && Platform.OS === "ios" && <DateTimePicker
                            mode="date"
                            display="spinner"
                            value={date}
                            onChange={onChangeFromDate}
                            style={datepickerCSS.datePicker}
                        />}

                        {showFDPicker && Platform.OS === "ios" && (
                            <View
                                style={{ flexDirection: "row", justifyContent: "space-around" }}
                            >
                                <TouchableOpacity
                                    style={[datepickerCSS.cancelButton, { backgroundColor: "#11182711", paddingHorizontal: 20 }]}
                                    onPress={tonggleFromDatePicker}
                                >
                                    <Text style={[datepickerCSS.cancelButtonText, { color: "#075985" }]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[datepickerCSS.cancelButton, { paddingHorizontal: 20 }]}
                                    onPress={confirmIOSFromDate}
                                >
                                    <Text style={[datepickerCSS.cancelButtonText]}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                     {/* To Date */}
                     <View style={css.row}>
                        <Text style={css.Title}>To Date: </Text>
                        {showTDPicker && Platform.OS === "android" && <DateTimePicker 
                            mode="date"
                            display="calendar"
                            value={date}
                            onChange={onChangeToDate}
                            style={datepickerCSS.datePicker}
                        />}

                        <Pressable
                            style={{
                                width: '60%',
                                marginBottom: 10,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                            }}
                            onPress={tonggleToDatePicker}
                        >
                        <TextInput
                            style={{color: "#000",}}
                            placeholder="Select To Date"
                            value={toDate}
                            onChangeText={setFromDate}
                            placeholderTextColor="#11182744"
                            editable={false}
                            onPressIn={tonggleToDatePicker}
                        />
                        </Pressable>
                    </View>
                    {/* End To Date */}

                    {/*IOS To date picker */}
                    <View>
                        {showTDPicker && Platform.OS === "ios" && (<DateTimePicker
                            mode="date"
                            display="spinner"
                            value={date}
                            onChange={onChangeToDate}
                            style={datepickerCSS.datePicker}
                        />)}

                        {showTDPicker && Platform.OS === "ios" && (
                            <View
                                style={{ flexDirection: "row", justifyContent: "space-around" }}
                            >
                                <TouchableOpacity
                                    style={[datepickerCSS.cancelButton, { backgroundColor: "#11182711", paddingHorizontal: 20 }]}
                                    onPress={tonggleToDatePicker}
                                >
                                    <Text style={[datepickerCSS.cancelButtonText, { color: "#075985" }]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[datepickerCSS.cancelButton, { paddingHorizontal: 20 }]}
                                    onPress={confirmIOSToDate}
                                >
                                    <Text style={[datepickerCSS.cancelButtonText]}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    {/*End IOS To date picker */}

                    {/* Customer / Product */}
                    {hideItem==true ? (
                        <></>
                    ): (
                        typeCatch=="customer") ? (
                            dataProcess==true ? (
                            <View style={[css.container]}>
                                <ActivityIndicator size="large" />
                            </View>
                            ) : (   
                                noCustomerDataList==true ? (
                                    <View style={[css.row,{marginBottom: 10,}]}>
                                        <Text style={css.Title}>Customer: </Text>
                                        <TextInput
                                            style={{color: "#000",width: '60%',}}
                                            placeholder="No Customer"
                                            placeholderTextColor="#11182744"
                                            editable={false}
                                        />
                                    </View>
                                ) 
                                : (
                                <View style={[css.row,{marginBottom: 10,}]}>
                                    <Text style={css.Title}>Customer: </Text>
                                    <View style={{width: "60%"}}>
                                        <MultiSelect
                                            style={dropdownCSS.dropdown}
                                            activeColor={"#E5E4E2"}
                                            placeholderStyle={dropdownCSS.placeholderStyle}
                                            selectedTextStyle={dropdownCSS.selectedTextStyle}
                                            inputSearchStyle={dropdownCSS.inputSearchStyle}
                                            iconStyle={dropdownCSS.iconStyle}
                                            search
                                            data={fetchedCustomerData}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Customer"
                                            searchPlaceholder="Search..."
                                            value={customerArr}
                                            onChange={item => {
                                                let checkLastArr = item.slice(-1);
                                                let checkFirstArr = item[0];

                                                if(checkLastArr[0]=="all"){
                                                    setCustomerArr(["all"]);
                                                }else{
                                                    if(checkFirstArr!="all"){
                                                        setCustomerArr(item);
                                                    }else{
                                                        setCustomerArr([checkLastArr[0]]);
                                                    }
                                                }
                                            }}
                                            renderLeftIcon={() => (
                                                <Ionicons
                                                    style={{marginRight: 5,}}
                                                    color={isCustomerFocus ? 'blue' : 'black'}
                                                    name="person-circle-outline"
                                                    size={20}
                                                />
                                            )}
                                            selectedStyle={dropdownCSS.selectedStyle}
                                        /> 
                                    </View>
                                </View>
                                )
                            )
                        ) : (
                            dataProcess==true ? (
                            <View style={[css.container]}>
                                <ActivityIndicator size="large" />
                            </View>
                            ) : (   
                            noProductDataList==true ? (
                                <View style={[css.row,{marginBottom: 10,}]}>
                                    <Text style={css.Title}>Product: </Text>
                                    <TextInput
                                        style={{color: "#000",width: '60%',}}
                                        placeholder="No Product"
                                        placeholderTextColor="#11182744"
                                        editable={false}
                                    />
                                </View>
                            ) 
                            : (
                            <View style={[css.row,{marginBottom: 10,}]}>
                                <Text style={css.Title}>Product: </Text>
                                <View style={{width: "60%"}}>
                                    <MultiSelect
                                        style={dropdownCSS.dropdown}
                                        placeholderStyle={dropdownCSS.placeholderStyle}
                                        selectedTextStyle={dropdownCSS.selectedTextStyle}
                                        inputSearchStyle={dropdownCSS.inputSearchStyle}
                                        iconStyle={dropdownCSS.iconStyle}
                                        search
                                        data={fetchedProductData}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Product"
                                        searchPlaceholder="Search..."
                                        value={productArr}
                                        onChange={item2 => {
                                            let checkLastArr = item2.slice(-1);
                                            let checkFirstArr = item2[0];

                                            if(checkLastArr[0]=="all"){
                                                setProductArr(["all"]);
                                            }else{
                                                if(checkFirstArr!="all"){
                                                    setProductArr(item2);
                                                }else{
                                                    setProductArr([checkLastArr[0]]);
                                                }
                                            }
                                        }}
                                        renderLeftIcon={() => (
                                            <Ionicons
                                                style={{marginRight: 5,}}
                                                color={isProductFocus ? 'blue' : 'black'}
                                                name="list-circle-sharp"
                                                size={20}
                                            />
                                        )}
                                        selectedStyle={dropdownCSS.selectedStyle}
                                    />
                                </View>
                            </View>
                            )
                        )
                    )}
                    {/* End Customer / Product */}

                    {/* Submit Button */}
                    <View style={[css.row,{paddingTop:20}]}>
                        <Pressable 
                            style={css.button} onPress={async ()=>{
                                try {
                                    await AsyncStorage.setItem('fromDate', keepFromDateData);
                                    await AsyncStorage.setItem('toDate', keepToDateData);
                                    await AsyncStorage.setItem('dummyfromMonth', dummyFromMonthData);
                                    await AsyncStorage.setItem('dummytoMonth', dummyToMonthData);
                                    await AsyncStorage.setItem('type', typeCatch);

                                    {
                                        typeCatch=="customer" ? 
                                        await AsyncStorage.setItem('dataArr', JSON.stringify(customerArr)) :
                                        await AsyncStorage.setItem('dataArr', JSON.stringify(productArr))
                                    }

                                    {
                                        typeCatch=="customer" ? 
                                        // || customerArr!=[]
                                            (noCustomerDataList==false && customerArr[0]!=undefined) ?
                                                navigation.navigate(SearchCustomerDetail as never) 
                                            : Snackbar.show({
                                                text: 'You do not have any customer!',
                                                duration: Snackbar.LENGTH_SHORT,
                                            })
                                        : (noProductDataList==false && productArr[0]!=undefined ) ?
                                            navigation.navigate(SerachProductDetail as never)
                                            : Snackbar.show({
                                                text: 'You do not have any product!',
                                                duration: Snackbar.LENGTH_SHORT,
                                            });
                                    }

                                } catch (error) {
                                    Snackbar.show({
                                        text: 'Something is wrong!',
                                        duration: Snackbar.LENGTH_SHORT,
                                    });
                                }
                            }}
                        >
                            <Text style={css.buttonText}>Generate</Text>
                        </Pressable>
                    </View>
                    {/* End Submit Button */}
                </View>
            </KeyboardAvoidWrapper>
        </MainContainer>
    );
}

export default SearchScreen;