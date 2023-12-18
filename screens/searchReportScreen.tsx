import * as React from 'react';
import { View, Text, Platform, Pressable, TextInput, ActivityIndicator } from "react-native";
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
import SerachProductDetail from './SearchProductDetail';
import { css, dropdownCSS, datepickerCSS } from '../objects/commonCSS';
import RNFetchBlob from 'rn-fetch-blob';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SelectBarData } from '../objects/objects';
import SearchReport from './searchReport';

const SearchReportScreen = () => {
    const navigation = useNavigation();

    // Date Setup
    const [showFDPicker, setShowFDPicker] = useState(false);
    const [showTDPicker, setShowTDPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [keepFromDateData, setKeepFromDateData] = useState("");
    const [keepToDateData, setKeepToDateData] = useState("");
    // End Date Setup

    // DropDown Setup
    const [dataProcess, setDataProcess] = useState(false);
    const [hideItem, setHideItem] = useState(false);
    const [noDataList, setNoDataList] = useState(false);
    const [fetchedData, setFetchedData] = useState<SelectBarData[]>([]);
    // End DropDown Setup

    const [isItemFocus, setIsItemFocus] = useState("customer");
    const [selectedArr, setSelectedArr] = useState(["all"]);

    // Type Setup
    const [typeCatch, setTypeCatch] = useState("customer");
    // End Type Setup

    // IOS Date picker modal setup
    const [FromdatePickerVisible, setFromDatePickerVisible] = useState(false);
    const [TodatePickerVisible, setToDatePickerVisible] = useState(false);
    const hideIOSDatePicker = () => {
        setFromDatePickerVisible(false);
        setToDatePickerVisible(false);
    };
    // END IOS Date Picker modal setup


    // Set FromDate function 
    const onChangeFromDate = async ({ type }: any, selectedDate: any) => {
        if (type == "set") {
            const currentDate = selectedDate.toISOString().split('T')[0];;
            setDate(selectedDate);
            if (Platform.OS === "android") {
                tonggleFromDatePicker();
                setFromDate(selectedDate.toDateString());
                setKeepFromDateData(currentDate);
                await fetchDataApi(typeCatch, currentDate, keepToDateData);
            }
        } else {
            tonggleFromDatePicker();
        }
    }

    const confirmIOSFromDate = async (date: any) =>
    {
        setFromDate(date.toDateString());
        setKeepFromDateData(date.toISOString().split('T')[0])
        hideIOSDatePicker();
        await fetchDataApi(typeCatch, date.toISOString().split('T')[0], keepToDateData);
    }

    const confirmIOSToDate = async(date: any) =>
    {
        setToDate(date.toDateString());
        setKeepToDateData(date.toISOString().split('T')[0])
        hideIOSDatePicker();
        await fetchDataApi(typeCatch, keepFromDateData, date.toISOString().split('T')[0]);
    }

    const tonggleFromDatePicker = () => {
        if (Platform.OS === 'android') {
            setShowFDPicker(!showFDPicker);
        }
        else if (Platform.OS === 'ios') {
            setFromDatePickerVisible(true);
        }
    }
    //===================================
    // Set ToDate function 
    const onChangeToDate = async ({ type }: any, selectedDate: any) => {
        if (type == "set") {
            const currentDate = selectedDate.toISOString().split('T')[0];;
            setDate(selectedDate);
            if (Platform.OS === "android") {
                tonggleToDatePicker();
                setToDate(selectedDate.toDateString());
                setKeepToDateData(currentDate);
                await fetchDataApi(typeCatch, keepFromDateData, currentDate);
            }
        } else {
            tonggleToDatePicker();
        }
    }

    const tonggleToDatePicker = () => {
        if (Platform.OS === 'android') {
            setShowTDPicker(!showTDPicker);
        }
        else if (Platform.OS === 'ios') {
            setToDatePickerVisible(true);
        }
    }
    // ===============================

    useEffect(() => {
        (async () => {
            setHideItem(true);
            setFetchedData([]);
            await fetchDataApi(typeCatch, keepFromDateData, keepToDateData);
        })();
    }, [])

    const fetchDataApi = async (typeCatch: any, getFromDate: any, getToDate: any) => {
        setDataProcess(true);
        var getIPaddress = await AsyncStorage.getItem('IPaddress');
        if (getToDate != "" && getFromDate != "") {
            setHideItem(false);
            // If is Customer
            typeCatch == "customer" ?
                await RNFetchBlob.config({
                    trusty: true
                }).fetch('POST', "https://" + getIPaddress + "/senghiap/mobile/getData.php", {
                    "Content-Type": "application/json",
                }, JSON.stringify({
                    "readCustomer": "1",
                    "fromDate": getFromDate,
                    "toDate": getToDate
                }),).then((response) => {
                    if (response.json().status == "1") {
                        setFetchedData([{ "label": "All Customer", "value": "all" }]);
                        setFetchedData((prevData) => [...prevData, ...response.json().customerData.map((item: { accode: string; customer: any; }) => ({
                            label: item.customer,
                            value: item.accode,
                        }))]);
                        setNoDataList(false);
                        setDataProcess(false);
                    } else if (response.json().status == "2") {
                        setNoDataList(true);
                        Snackbar.show({
                            text: 'You do not have customer in these days!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                        setDataProcess(false);
                    } else {
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
            // If is Product
            : await RNFetchBlob.config({
                trusty: true
            }).fetch('POST', "https://" + getIPaddress + "/senghiap/mobile/getData.php", {
                "Content-Type": "application/json",
            }, JSON.stringify({
                "readProduct2": "1",
                "fromDate": getFromDate,
                "toDate": getToDate
            }),).then((response) => {
                if (response.json().status == "1") {
                    setFetchedData([{ "label": "All Product", "value": "all" }]);
                    setFetchedData((prevData) => [...prevData, ...response.json().productData.map((item: { itemCode: string; product: any; }) => ({
                        // label: item.product,
                        label: item.itemCode,
                        value: item.itemCode,
                    }))]);
                    setNoDataList(false);
                    setDataProcess(false);
                } else {
                    setNoDataList(true);
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
                    <View style={{ flexDirection: 'row', }}>
                        <View style={css.listThing}>
                            <Ionicons name="arrow-back-circle-outline" size={30} color="#FFF" onPress={() => navigation.goBack()} />
                        </View>
                    </View>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>Customize Report</Text>
                    </View>
                </View>
                <View>
                    {/* Choose Product or Customer */}
                    <View style={[css.row, { paddingTop: 20 }]}>
                        <Text style={css.Title}>Choose Type: </Text>
                        {typeCatch == "customer" ? (
                            <View style={[css.subTitle, css.row]}>
                                <Pressable
                                    style={[css.typeButton, { backgroundColor: "dimgray" }]}
                                    onPress={async () => [setTypeCatch("customer"), await fetchDataApi("customer", keepFromDateData, keepToDateData)]}
                                >
                                    <Text style={css.buttonText}>Customer</Text>
                                </Pressable>

                                <Pressable
                                    style={[css.typeButton, { backgroundColor: "white" }]}
                                    onPress={async () => [setTypeCatch("product"), await fetchDataApi("product", keepFromDateData, keepToDateData)]}
                                >
                                    <Text style={[css.buttonText, { color: "black" }]}>Product</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View style={[css.subTitle, css.row]}>
                                <Pressable
                                    style={[css.typeButton, { backgroundColor: "white" }]}
                                    onPress={async () => [setTypeCatch("customer"), await fetchDataApi("customer", keepFromDateData, keepToDateData)]}
                                >
                                    <Text style={[css.buttonText, { color: "black" }]}>Customer</Text>
                                </Pressable>

                                <Pressable
                                    style={[css.typeButton, { backgroundColor: "dimgray" }]}
                                    onPress={async () => [setTypeCatch("product"), await fetchDataApi("product", keepFromDateData, keepToDateData)]}
                                >
                                    <Text style={[css.buttonText, { color: "white" }]}>Product</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                    {/* End Choose Product or Customer */}

                    {/* From Date */}
                    <View style={css.row}>
                        <Text style={css.Title}>From Date: </Text>
                        {showFDPicker && Platform.OS === "android" && <DateTimePicker
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
                                style={{ color: "#000", }}
                                placeholder="Select From Date"
                                value={fromDate}
                                onChangeText={setFromDate}
                                placeholderTextColor="#11182744"
                                editable={false}
                                onPressIn={tonggleFromDatePicker}
                            />
                        </Pressable>
                    </View>
                    {Platform.OS === "ios" && (<DateTimePickerModal
                        date={date}
                        isVisible={FromdatePickerVisible}
                        mode="date"
                        display='inline'
                        onConfirm={confirmIOSFromDate}
                        onCancel={hideIOSDatePicker}
                    />)}
                    {/* End From Date */}


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
                                style={{ color: "#000", }}
                                placeholder="Select To Date"
                                value={toDate}
                                onChangeText={setFromDate}
                                placeholderTextColor="#11182744"
                                editable={false}
                                onPressIn={tonggleToDatePicker}
                            />
                        </Pressable>
                    </View>
                    {Platform.OS === "ios" && (<DateTimePickerModal
                        date={date}
                        isVisible={TodatePickerVisible}
                        mode="date"
                        display='inline'
                        onConfirm={confirmIOSToDate}
                        onCancel={hideIOSDatePicker}
                    />)}
                    {/* End To Date */}

                    {/* Customer / Product */}
                    {hideItem == true ? (
                        <></>
                    ) : (
                        typeCatch == "customer") ? (
                        dataProcess == true ? (
                            <View style={[css.container]}>
                                <ActivityIndicator size="large" />
                            </View>
                        ) : (
                            noDataList == true ? (
                                <View style={[css.row, { marginBottom: 10, }]}>
                                    <Text style={css.Title}>Customer: </Text>
                                    <TextInput
                                        style={{ color: "#000", width: '60%', }}
                                        placeholder="No Customer"
                                        placeholderTextColor="#11182744"
                                        editable={false}
                                    />
                                </View>
                            ) : (
                                <View style={[css.row, { marginBottom: 10, }]}>
                                    <Text style={css.Title}>Customer: </Text>
                                    <View style={{ width: "60%" }}>
                                        <MultiSelect
                                            style={dropdownCSS.dropdown}
                                            activeColor={"#E5E4E2"}
                                            placeholderStyle={dropdownCSS.placeholderStyle}
                                            selectedTextStyle={dropdownCSS.selectedTextStyle}
                                            inputSearchStyle={dropdownCSS.inputSearchStyle}
                                            iconStyle={dropdownCSS.iconStyle}
                                            search
                                            data={fetchedData}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Customer"
                                            searchPlaceholder="Search..."
                                            value={selectedArr}
                                            onChange={item => {
                                                let checkLastArr = item.slice(-1);
                                                let checkFirstArr = item[0];

                                                if (checkLastArr[0] == "all") {
                                                    setSelectedArr(["all"]);
                                                } else {
                                                    if (checkFirstArr != "all") {
                                                        setSelectedArr(item);
                                                    } else {
                                                        setSelectedArr([checkLastArr[0]]);
                                                    }
                                                }
                                            }}
                                            renderLeftIcon={() => (
                                                <Ionicons
                                                    style={{ marginRight: 5, }}
                                                    color={isItemFocus=="customer" ? 'blue' : 'black'}
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
                        dataProcess == true ? (
                            <View style={[css.container]}>
                                <ActivityIndicator size="large" />
                            </View>
                        ) : (
                            noDataList == true ? (
                                <View style={[css.row, { marginBottom: 10, }]}>
                                    <Text style={css.Title}>Product: </Text>
                                    <TextInput
                                        style={{ color: "#000", width: '60%', }}
                                        placeholder="No Product"
                                        placeholderTextColor="#11182744"
                                        editable={false}
                                    />
                                </View>
                            )
                                : (
                                    <View style={[css.row, { marginBottom: 10, }]}>
                                        <Text style={css.Title}>Product: </Text>
                                        <View style={{ width: "60%" }}>
                                            <MultiSelect
                                                style={dropdownCSS.dropdown}
                                                placeholderStyle={dropdownCSS.placeholderStyle}
                                                selectedTextStyle={dropdownCSS.selectedTextStyle}
                                                inputSearchStyle={dropdownCSS.inputSearchStyle}
                                                iconStyle={dropdownCSS.iconStyle}
                                                search
                                                data={fetchedData}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select Product"
                                                searchPlaceholder="Search..."
                                                value={selectedArr}
                                                onChange={item2 => {
                                                    let checkLastArr = item2.slice(-1);
                                                    let checkFirstArr = item2[0];

                                                    if (checkLastArr[0] == "all") {
                                                        setSelectedArr(["all"]);
                                                    } else {
                                                        if (checkFirstArr != "all") {
                                                            setSelectedArr(item2);
                                                        } else {
                                                            setSelectedArr([checkLastArr[0]]);
                                                        }
                                                    }
                                                }}
                                                renderLeftIcon={() => (
                                                    <Ionicons
                                                        style={{ marginRight: 5, }}
                                                        color={isItemFocus=="product" ? 'blue' : 'black'}
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
                    <View style={[css.row, { paddingTop: 20 }]}>
                        <Pressable
                            style={css.button} onPress={async () => {
                                await AsyncStorage.setItem('fromDate', keepFromDateData);
                                await AsyncStorage.setItem('toDate', keepToDateData);
                                await AsyncStorage.setItem('type', typeCatch);
                                await AsyncStorage.setItem('dataArr', JSON.stringify(selectedArr));

                                (noDataList == false && selectedArr[0] != undefined) ? (
                                    navigation.navigate(SearchReport as never)
                                ) : (
                                    Snackbar.show({
                                        text: 'You do not have any data in these days!',
                                        duration: Snackbar.LENGTH_SHORT,
                                    })
                                )
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

export default SearchReportScreen;