import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { css, datepickerCSS } from '../objects/commonCSS';
import { LineChart } from 'react-native-chart-kit';
import { currencyFormat, showData } from '../objects/objects';
import Snackbar from 'react-native-snackbar';
import { ProgressBar } from 'react-native-paper';

const fetchedData: showData[] = [
    {"key": "4757", "name": "SHALAM , 01686339707", "weight": "1240","value":"","color":""}, 
    {"key": "8050F", "name": "SELVAKALAINJAN A/L SUBRAMANIAM", "weight": "750","value":"","color":""}, 
    {"key": "6585B", "name": "JESHURUN MATHEW KUTTY THOMAN", "weight": "516","value":"","color":""}, 
    {"key": "6963BJB", "name": "KUMARAVEL A/L R.SEGARAN 881118-05-5051", "weight": "490","value":"","color":""}, 
    {"key": "3990C", "name": "TARMALINGAM A/L ANGAMUTHU 670601065559", "weight": "400","value":"","color":""}, 
    {"key": "4869BLX", "name": "NN TRADING SERVICE 0123969066A.RAJA", "weight": "335","value":"","color":""}, 
    {"key": "6132D", "name": "MUHAMMAD OSMAN VELU BIN ABDULLAH", "weight": "240","value":"","color":""}, 
    {"key": "2811S", "name": "AHMAD ARSHAD BIN SALAM 790516-01-5975", "weight": "230","value":"","color":""}, 
    {"key": "7995AER", "name": "MALLAIYA A/L NAGURU 741202-08-5005", "weight": "150","value":"","color":""}, 
    {"key": "1690BDG", "name": "TAY KIAN SING 821215105183,0162728189", "weight": "60","value":"","color":""}
];

const FlatListItem = ({ item }: { item: showData }) => {
    return (
        <TouchableOpacity onPress={async () => {}}>
            <View style={css.listItem} key={parseInt(item.key)}>
                <View style={[css.cardBody]}>
                    <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
                        <View style={{flexDirection: 'row',}}>
                            <Text style={css.textHeader}> Testing</Text>
                            <Text style={css.textDescription}>
                                Weight: {currencyFormat(parseInt("101"))}
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
                                     progress={Math.round(parseInt("101")/302*100)/100}
                                     color={"#8561c5"}
                                 />
                             )}
                             <Text style={[css.textDescription,{textAlign:"center"}]}>
                                 { item.weight==null ? (
                                    0
                                ) : (
                                    Math.round(parseInt(item.weight)/101*100)
                                )}%
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const Component1 = () => (
    <View style={styles.component1}>
        <View style={css.row}>
            <Pressable style={css.pressableCSS} >
                <TextInput
                    style={datepickerCSS.textInput}
                    placeholder="Select Date"
                    value={""}
                    placeholderTextColor="#11182744"
                    editable={false}
                />
            </Pressable>
        </View>  
        <View style={[{marginTop:5,marginBottom:5}]}>
            <Text style={[{fontSize:8,color:"red",textAlign:"center",marginBottom:-10}]}>Click to reset*</Text>
            <TouchableOpacity style={[css.row,{margin:0}]} onPress={async () => {}}>
                <Text style={[css.pressableCSS,{fontSize:16,fontWeight:'bold',textAlign:"center",fontStyle:"italic",width:Dimensions.get("screen").width/100*80}]}>
                    Testing Xia
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

const Component2 = () => (
    <View style={styles.component2}>
        <LineChart
            data={{
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100
                    ]
                  }
                ]
            }}
            width={Dimensions.get("window").width/100*95}
            height={180}
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
        <View style={[css.row,{marginTop:5,marginBottom:5}]}>
            <Text style={{fontSize:20,fontWeight:'bold',textAlign:"center",fontStyle:"italic"}}>
                Total Weight: {currencyFormat(33399922)}
            </Text>
        </View>
    </View>
);

const ProfileScreen = () => {
    // Sample data for FlatList
    const data = Array.from({ length: 50 }, (_, index) => ({ key: String(index), value: `Item ${index}` }));

    return (
        <View style={styles.container}>
            <Component1 />
            <Component2 />
            <FlatList
                data={fetchedData}
                renderItem={FlatListItem}
                keyExtractor={(item) => item.key}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    component1: {
        height: '15%', // Adjust the height as needed
        // backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    component2: {
        height: '40%', // Adjust the height as needed
        // backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatList: {
        flex: 1,
        // backgroundColor: 'lightcoral',
    },
});

export default ProfileScreen;
