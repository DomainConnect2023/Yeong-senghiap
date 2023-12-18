import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { css } from "../objects/commonCSS";
import { BarData, currencyFormat } from "../objects/objects";
import { BarChart } from "react-native-chart-kit";

export type barData = {
    barData: BarData;
};

export type totalWeight = {
    totalWeight: number
};
  
export const BarChartReport = (props: barData) => {
    return (
        <View style={[css.row]}>
            <BarChart
                data={props.barData}
                width={Dimensions.get("window").width/100*90}
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
    );
};

export const TotalWeightContainer = (props: totalWeight) => {
    return (
        <View style={[css.row,{marginTop:5,marginBottom:5}]}>
            <Text style={{fontSize:20,fontWeight:'bold',textAlign:"center",fontStyle:"italic"}}>
                Total Weight: {currencyFormat(props.totalWeight)}
            </Text>
        </View>
    );
};
