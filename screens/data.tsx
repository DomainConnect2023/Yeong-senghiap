// const testdata = {
//     labels: ["Test1", "Test2"],
//     legend: ["L1", "L2", "L3"],
//     data: [
//       [60, 60, 60],
//       [30, 30, 60]
//     ],
//     barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
// };

export const testdata = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Product',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Customer',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Salesman',
    },
  ];



{/* <PieChart
data={PieData}
textColor="black"
radius={100}
donut
textSize={14}
strokeWidth={2}
strokeColor="black"
innerCircleBorderWidth={2}
innerCircleBorderColor="black"
showText
focusOnPress
showValuesAsLabels
showGradient
showTextBackground
textBackgroundRadius={10}
onPress={(item:any) => [
    AsyncStorage.setItem('productCode', item.key.toString()),
    AsyncStorage.setItem('fromDate', todayDate.toString()),
    AsyncStorage.setItem('toDate', todayDate.toString()),
    navigation.navigate(DetailScreen as never),
    // Snackbar.show({
    //     text: item.value.toString(),
    //     duration: Snackbar.LENGTH_SHORT,
    // }),
]}
// onPress={(item:any) => console.log(item.key)}
/> */}


// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Pressable, TextInput, ProgressBarAndroid, Platform } from "react-native";
// import { BarChart,} from "react-native-chart-kit";
// import Snackbar from 'react-native-snackbar';
// import { useNavigation } from '@react-navigation/native';
// import MainContainer from '../components/MainContainer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
// import { css, datepickerCSS } from '../objects/commonCSS';
// import { BarData, currencyFormat, showData } from '../objects/objects';
// import RNFetchBlob from 'rn-fetch-blob';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';

// const DashboardScreen2 = ({route}: {route: any}) => {
//     const navigation = useNavigation();

//     const getDate = new Date;
//     const [todayDate, setTodayDate] = useState<string | "">(getDate.toISOString().split('T')[0]+" 00:00:00"); // for API

//     // DatePicker
//     const [showPicker, setShowPicker] = useState(false);
//     const [selectedDate, setSelectedDate] = useState(getDate.toDateString());
//     const [selectedIOSDate, setSelectedIOSDate] = useState(new Date());

//     // IOS Date picker modal setup
//     const [datePickerVisible, setDatePickerVisible] = useState(false);
//     const hideIOSDatePicker = () => {
//         setDatePickerVisible(false);
//     };
//     // END IOS Date Picker modal setup

//     const [fetchedData, setFetchedData] = useState<showData[]>([]); // Flatlist with Pie
//     const [BarData, setBarData] = useState<BarData>({ labels: [], datasets: [{ data: [] }] });
//     const [totalWeight, setTotalWeight] = useState<number>(0); // total weight

//     const [dataProcess, setDataProcess] = useState(false); // check when loading data

//     const [stayPage, setStayPage] = useState("product");
//     const [itemID, setItemID] = useState("");
//     const [itemName, setItemName] = useState("");

//     useEffect(()=> { // when starting the page
//         (async()=> {
//             setDataProcess(true);
//             setFetchedData([]);
//             setBarData({ labels: [], datasets: [{ data: [] }] });

//             if(route.params.stayPage=="product"){
//                 const productCode = await AsyncStorage.getItem('productCode');
//                 if(productCode!="" && productCode!=null){
//                     // console.log("run here");
//                     setItemID(productCode);
//                     setStayPage("product");
//                     setTodayDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     setSelectedDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     await fetchProductDetailDataApi(productCode, todayDate);

//                 }else{
//                     setStayPage("product");
//                     setTodayDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     setSelectedDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     await fetchProductDataApi(todayDate);
//                 }
    
//             }else if(route.params.stayPage=="customer"){
//                 const accode = await AsyncStorage.getItem('accode');
//                 if(accode!="" && accode!=null){
//                     setItemID(accode);
//                     setStayPage("customer");
//                     setTodayDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     setSelectedDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     await fetchCustomerDetailDataApi(accode, todayDate);
                    
//                 }else{
//                     setStayPage("customer");
//                     setTodayDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     setSelectedDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     await fetchCustomerDataApi(todayDate);
//                 }

//             }else if(route.params.stayPage=="salesman"){
//                 const salesmancode = await AsyncStorage.getItem('salesmancode');
//                 if(salesmancode!="" && salesmancode!=null){
//                     // setItemID(salesmancode);
//                     // setStayPage("salesman");
//                     // setTodayDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     // setSelectedDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     // await fetchSalesmanDetailDataApi(salesmancode, todayDate);
                    
//                 }else{
//                     setStayPage("salesman");
//                     setTodayDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     setSelectedDate(await AsyncStorage.getItem('fromDate') ?? "");
//                     await fetchSalesmanDataApi(todayDate);
//                 }
//             }
//         })();
//     }, []);

//     const fetchProductDataApi = async(theDate: any) => {
//         setFetchedData([]);
//         setBarData({ labels: [], datasets: [{ data: [] }] });
//         var getIPaddress=await AsyncStorage.getItem('IPaddress');

//         await RNFetchBlob.config({
//             trusty: true
//         }).fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/report.php",{
//                 "Content-Type": "application/json",  
//             }, JSON.stringify({
//                 "read":"1", 
//                 "todayDate":theDate
//             }),
//         ).then(async (response) => {
//             if(await response.json().status=="1"){
//                 setFetchedData(response.json().data.map((item: { totalWeight: string; key: any; name: any; }) => ({
//                     key: item.key,
//                     name: item.name,
//                     weight: item.totalWeight,
//                 })));

//                 const convertedData: BarData = {
//                     labels: response.json().barData.map((item: { days: any; }) => item.days),
//                     datasets: [{
//                         data: response.json().barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight),
//                     },],
//                 };
//                 setBarData(convertedData);

//                 setTotalWeight(response.json().totalWeight);
//                 setDataProcess(false);
//             }else{
//                 Snackbar.show({
//                     text: 'Something is wrong. Can not get the data from server!',
//                     duration: Snackbar.LENGTH_SHORT,
//                 });
//             }
//         }).catch(error => {
//             console.log(error.message+" aaa");
//             Snackbar.show({
//                 text: error.message,
//                 duration: Snackbar.LENGTH_SHORT,
//             });
//         });
//     };

//     const fetchCustomerDataApi = async(theDate: any) => {
//         setFetchedData([]);
//         setBarData({ labels: [], datasets: [{ data: [] }] });
//         var getIPaddress=await AsyncStorage.getItem('IPaddress');

//         await RNFetchBlob.config({
//             trusty: true
//         }).fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/report.php",{
//                 "Content-Type": "application/json",  
//             }, JSON.stringify({
//                 "readCustomer":"1", 
//                 "todayDate":theDate
//             }),
//         ).then(async (response) => {
//             if(await response.json().status=="1"){
//                 setFetchedData(response.json().data.map((item: { totalWeight: string; key: any; name: any; }) => ({
//                     key: item.key,
//                     name: item.name,
//                     weight: item.totalWeight,
//                 })));

//                 const convertedData: BarData = {
//                     labels: response.json().barData.map((item: { days: any; }) => item.days),
//                     datasets: [{
//                         data: response.json().barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight),
//                     },],
//                 };
//                 setBarData(convertedData);

//                 setTotalWeight(response.json().totalWeight);
//                 setDataProcess(false);
//             }else{
//                 Snackbar.show({
//                     text: 'Something is wrong. Can not get the data from server!',
//                     duration: Snackbar.LENGTH_SHORT,
//                 });
//             }
//         }).catch(error => {
//             console.log(error.message+" bbb")
//             Snackbar.show({
//                 text: error.message,
//                 duration: Snackbar.LENGTH_SHORT,
//             });
//         });
//     };

//     const fetchSalesmanDataApi = async(theDate: any) => {
//         setFetchedData([]);
//         setBarData({ labels: [], datasets: [{ data: [] }] });
//         var getIPaddress=await AsyncStorage.getItem('IPaddress');

//         await RNFetchBlob.config({
//             trusty: true
//         }).fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/report.php",{
//                 "Content-Type": "application/json",  
//             }, JSON.stringify({
//                 "readSalesman":"1", 
//                 "todayDate":theDate
//             }),
//         ).then(async (response) => {
//             if(await response.json().status=="1"){
//                 setFetchedData(response.json().data.map((item: { totalWeight: string; key: any; name: any; }) => ({
//                     key: item.key,
//                     name: item.name==null ? "Others" : item.name,
//                     weight: item.totalWeight,
//                 })));

//                 const convertedData: BarData = {
//                     labels: response.json().barData.map((item: { days: any; }) => item.days),
//                     datasets: [{
//                         data: response.json().barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight),
//                     },],
//                 };
//                 setBarData(convertedData);

//                 setTotalWeight(response.json().totalWeight);
//                 setDataProcess(false);
//             }else{
//                 Snackbar.show({
//                     text: 'Something is wrong. Can not get the data from server!',
//                     duration: Snackbar.LENGTH_SHORT,
//                 });
//             }
//         }).catch(error => {
//             console.log(error.message+" bbb")
//             Snackbar.show({
//                 text: error.message,
//                 duration: Snackbar.LENGTH_SHORT,
//             });
//         });
//     };

//     const fetchProductDetailDataApi = async(productCode: any, theDate: any) => {
//         setFetchedData([]);
//         setBarData({ labels: [], datasets: [{ data: [] }] });
//         var getIPaddress=await AsyncStorage.getItem('IPaddress');
        
//         await RNFetchBlob.config({
//             trusty: true
//         }).fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/report.php",{
//                 "Content-Type": "application/json",  
//             }, JSON.stringify({
//                 "readDetail":"1", 
//                 "fromDate":theDate,
//                 "toDate":theDate,
//                 "productCode":productCode,
//             }),
//         ).then(async (response) => {
//             if(await response.json().status=="1"){
//                 setFetchedData(response.json().data.map((item: { weight: string; accode: any; customer: any; }) => ({
//                     key: item.accode,
//                     value: parseInt(item.weight, 10),
//                     name: item.customer,
//                     weight: item.weight,
//                 })));

//                 const convertedData: BarData = {
//                     labels: response.json().barData.map((item: { days: any; }) => item.days),
//                     datasets: [{
//                         data: response.json().barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight),
//                     },],
//                 };
//                 setBarData(convertedData);

//                 setTotalWeight(response.json().totalWeight);
//                 setDataProcess(false);
//             }else{
//                 Snackbar.show({
//                     text: 'Something is wrong. Can not get the data from server!',
//                     duration: Snackbar.LENGTH_SHORT,
//                 });
//             }
//         }).catch(error => {
//             console.log(error.message+" ccc");
//             Snackbar.show({
//                 text: error.message,
//                 duration: Snackbar.LENGTH_SHORT,
//             });
//         });
//     };

//     const fetchCustomerDetailDataApi = async(accode: any, theDate: any) => {
//         setFetchedData([]);
//         setBarData({ labels: [], datasets: [{ data: [] }] });
//         var getIPaddress=await AsyncStorage.getItem('IPaddress');

//         await RNFetchBlob.config({
//             trusty: true
//         }).fetch('POST', "https://"+getIPaddress+"/senghiap/mobile/report.php",{
//                 "Content-Type": "application/json",  
//             }, JSON.stringify({
//                 "readCustomerDetail":"1", 
//                 "fromDate":theDate,
//                 "toDate":theDate,
//                 "accode":accode,
//             }),
//         ).then(async (response) => {
//             if(await response.json().status=="1"){
//                 setFetchedData(response.json().data.map((item: { weight: string; productCode: any; productName: any;}) => ({
//                     value: parseInt(item.weight, 10),
//                     key: item.productCode,
//                     name: item.productName,
//                     weight: item.weight,
//                 })));

//                 const convertedData: BarData = {
//                     labels: response.json().barData.map((item: { days: any; }) => item.days),
//                     datasets: [
//                         {
//                         data: response.json().barData.map((item: { dayTotalWeight: any; }) => item.dayTotalWeight),
//                         },
//                     ],
//                 };
//                 setBarData(convertedData);

//                 setTotalWeight(response.json().totalWeight);
//                 setDataProcess(false);
//             }else{
//                 Snackbar.show({
//                     text: 'Something is wrong. Can not get the data from server!',
//                     duration: Snackbar.LENGTH_SHORT,
//                 });
//             }
//         }).catch(error => {
//             console.log(error.message+" ddd");
//             Snackbar.show({
//                 text: error.message,
//                 duration: Snackbar.LENGTH_SHORT,
//             });
//         });
//     };

//     const FlatListItem = ({ item }: { item: showData }) => {
//         return (
//             <TouchableOpacity onPress={async () => {

//                 if(stayPage=="product" && itemID!=""){
                    
//                     await AsyncStorage.setItem('productCode', "");
//                     await AsyncStorage.setItem('accode', item.key);
//                     navigation.navigate('Customer' as never);
//                 }else if(stayPage=="customer" && itemID!=""){
                    
//                     await AsyncStorage.setItem('accode', "");
//                     await AsyncStorage.setItem('productCode', item.key);
//                     navigation.navigate('Product' as never);
//                 }else if(stayPage=="salesman" && itemID!=""){
                    
                    
//                 }else{
//                     if(stayPage=="product"){
//                         setDataProcess(true);
//                         setItemName(item.name);
//                         setItemID(item.key);
//                         await AsyncStorage.setItem('productCode', item.key);
//                         await AsyncStorage.setItem('accode', "");
                        
//                         await fetchProductDetailDataApi(item.key, todayDate);
//                     }else if(stayPage=="customer"){
//                         setDataProcess(true);
//                         setItemName(item.name);
//                         setItemID(item.key);
//                         await AsyncStorage.setItem('accode', item.key);
//                         await AsyncStorage.setItem('productCode', "");
                        
//                         await fetchCustomerDetailDataApi(item.key, todayDate);
//                     }
//                 }
//             }}>
//                 <View style={css.listItem} key={parseInt(item.key)}>
//                     <View style={[css.cardBody]}>
//                         <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
//                             <View style={{flexDirection: 'row',}}>
//                                 <Text style={css.textHeader}>
//                                 { stayPage=="salesman"
//                                 ? ("Salesman: ")
//                                 : stayPage=="product" 
//                                     ? itemID=="" 
//                                         ? ("Product: ") 
//                                         : ("Customer: ") 
//                                     : itemID=="" 
//                                         ? ("Customer: ")
//                                         : ("Product: ")
//                                 } 
//                                 {item.key} {item.name!="" ? "("+item.name+")" : ""}</Text>
//                                 <Text style={css.textDescription}>
//                                     Weight: {currencyFormat(parseInt(item.weight))}
//                                 </Text>
//                             </View>
//                             <View style={{flexDirection: 'row',}}>
//                                 {Platform.OS === 'android' && (
//                                     item.weight==null ? (
//                                     <ProgressBarAndroid
//                                         style={{width:"70%"}}
//                                         styleAttr="Horizontal"
//                                         indeterminate={false}
//                                         progress={0}
//                                     />
//                                     ) : (
//                                     <ProgressBarAndroid
//                                         style={{width:"70%"}}
//                                         styleAttr="Horizontal"
//                                         indeterminate={false}
//                                         progress={Math.round(parseInt(item.weight)/totalWeight*100)/100}
//                                     />
//                                     )
//                                 )}
//                                 <Text style={[css.textDescription,{textAlign:"center"}]}>
//                                     { item.weight==null ? (
//                                         0
//                                     ) : (
//                                         Math.round(parseInt(item.weight)/totalWeight*100)
//                                     )}%
//                                 </Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     // Date Picker
//     const onChangeDate = async ({type}: any, selectedDate: any) => {
//         if(type=="set"){
//             const currentDate=selectedDate;
//             setSelectedIOSDate(currentDate);
//             if(Platform.OS==="android"){
//                 tonggleDatePicker();
//                 setSelectedDate(currentDate);
//                 setTodayDate(currentDate);
//                 setShowPicker(false);
//                 setDataProcess(true);
//                 if(route.params.stayPage=="product"){
//                     if(itemID==""){
//                         await fetchProductDataApi(todayDate);
//                     }else{
//                         await fetchProductDetailDataApi(itemID, todayDate);
//                     }
                    
//                 }else{
//                     if(itemID==""){
//                         await fetchCustomerDataApi(todayDate);
//                     }else{
//                         await fetchCustomerDetailDataApi(itemID, todayDate);
//                     }
//                 }
//             }
//         }else{
//             tonggleDatePicker();
//         }
//     }

//     const confirmIOSDate = async() => {
//         const currentDate=selectedIOSDate;
//         setTodayDate(currentDate.toISOString().split('T')[0]);
//         setSelectedDate(currentDate.toISOString().split('T')[0]);
//         AsyncStorage.setItem('fromDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
//         AsyncStorage.setItem('toDate', currentDate.toISOString().split('T')[0]+" 00:00:00"),
//         setDataProcess(true);
//         setDatePickerVisible(false);
//         if(route.params.stayPage=="product"){
//             if(itemID==""){
//                 await fetchProductDataApi(todayDate);
//             }else{
//                 await fetchProductDetailDataApi(itemID, todayDate);
//             }
            
//         }else{
//             if(itemID==""){
//                 await fetchCustomerDataApi(todayDate);
//             }else{
//                 await fetchCustomerDetailDataApi(itemID, todayDate);
//             }
//         }
//     }
//     const tonggleDatePicker = () => {
//         if (Platform.OS === 'android') {
//             setShowPicker(!showPicker);
//         }
//         else if (Platform.OS === 'ios') {
//             setDatePickerVisible(true);
//         }
//     }
//     // End Date Picker

//     return (
//         <MainContainer>
//             {/* <KeyboardAvoidWrapper> */}
//             {dataProcess== true ? (
//                 <View style={[css.container]}>
//                     <ActivityIndicator size="large" />
//                 </View>
//             ) : (
//                 <View>
//                     {/* Set Date */}
//                     <View style={css.row}>
//                         {showPicker && Platform.OS === 'android' && <DateTimePicker 
//                             mode="date"
//                             display="calendar"
//                             value={getDate}
//                             onChange={onChangeDate}
//                             style={datepickerCSS.datePicker}
//                         />}        
//                         <Pressable style={css.pressableCSS} onPress={tonggleDatePicker} >
//                             <TextInput
//                                 style={datepickerCSS.textInput}
//                                 placeholder="Select Date"
//                                 value={selectedDate.toString().substring(0,10)}
//                                 onChangeText={setTodayDate}
//                                 placeholderTextColor="#11182744"
//                                 editable={false}
//                             />
//                         </Pressable>
//                     </View>    
//                     {Platform.OS === "ios" && (<DateTimePickerModal
//                         date={selectedIOSDate}
//                         isVisible={datePickerVisible}
//                         mode="date"
//                         display='inline'
//                         onConfirm={confirmIOSDate}
//                         onCancel={hideIOSDatePicker}
//                     />)}
//                     {/* End Set Date */}

//                     <View style={[{marginTop:5,marginBottom:5}]}>
//                         <Text style={[{fontSize:8,color:"red",textAlign:"center",marginBottom:-10}]}>Click to reset*</Text>
//                         <TouchableOpacity style={[css.row,{margin:0}]} onPress={async () => {
//                             setDataProcess(true);
//                             await AsyncStorage.setItem('accode', "");
//                             await AsyncStorage.setItem('productCode', "");
//                             setItemName("");
//                             setItemID("");

//                             if(stayPage=="product"){
//                                 setStayPage("product");
//                                 await fetchProductDataApi(todayDate);
//                             }else if(stayPage=="customer"){
//                                 setStayPage("customer");
//                                 await fetchCustomerDataApi(todayDate);
//                             }else if(stayPage=="salesman"){
//                                 setStayPage("salesman");
//                                 await fetchSalesmanDataApi(todayDate);
//                             }
//                         }}>
//                             <Text style={[css.pressableCSS,{fontSize:20,fontWeight:'bold',textAlign:"center",fontStyle:"italic",}]}>
//                                 {stayPage=="product" 
//                                 ? itemID=="" 
//                                     ? ("All Product") 
//                                     : (itemID) 
//                                 : stayPage=="customer"
//                                 ? itemID==""
//                                     ? ("All Customer")
//                                     : itemName=="" ? (itemID) : (itemName)
//                                 : itemID==""
//                                     ? ("All Salesman")
//                                     : itemName=="" ? (itemID) : (itemName)
//                                 }
//                             </Text>
//                         </TouchableOpacity>
//                     </View>

//                     <View style={[css.row]}>
//                         <BarChart
//                             data={BarData}
//                             width={Dimensions.get("window").width/100*90}
//                             height={160}
//                             yAxisSuffix=""
//                             yAxisLabel=""
//                             chartConfig={{
//                                 backgroundColor: '#1cc910',
//                                 backgroundGradientFrom: '#eff3ff',
//                                 backgroundGradientTo: '#efefef',
//                                 decimalPlaces: 0,
//                                 color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                                 style: {
//                                     borderRadius: 16,
//                                 },
//                             }}
//                             style={{
//                                 marginVertical: 8,
//                                 borderRadius: 16, 
//                             }}
//                         />
//                     </View>

//                     <View style={[css.row,{marginTop:5,marginBottom:5}]}>
//                         <Text style={{fontSize:20,fontWeight:'bold',textAlign:"center",fontStyle:"italic"}}>
//                             Total Weight: {currencyFormat(totalWeight)}
//                         </Text>
//                     </View>
                    
//                     <View style={{alignItems: 'center',justifyContent: 'center',}}>
//                         {/* <View> */}
//                         <View style={{height:Dimensions.get("screen").height/100*39}}>
//                             <FlatList
//                                 data={fetchedData}
//                                 renderItem={FlatListItem}
//                                 keyExtractor={(item) => item.key}
//                             />
//                         </View>
//                     </View>
//                 </View>
//             )}
//             {/* </KeyboardAvoidWrapper> */}
//         </MainContainer>
//     );
// }

// export default DashboardScreen2;