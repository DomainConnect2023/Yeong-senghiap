import { Text, View } from "react-native";
import { css } from "./commonCSS";

export interface showData {
    key: string;
    value: string;
    name: string;
    weight: string;
    color: string;
}

// export interface CustomerData {
//     key: string; //accode
//     value: string;
//     name: string;
//     weight: string;
//     color: string;
// }

export interface SelectBarData {
    label: string;
    value: string;
}

export interface PieData {
    name: string;
    value: number;
    totalWeight: number;
    color: string;
    legendFontSize: number;
}

export interface BarData {
    labels: string[];
    datasets: {
        data: number[];
    }[];
} 

export const CircleColorText = ( {color}: {color: string} ) => {
    return (
      <View style={[css.circle, { backgroundColor: color }]}>
        <Text style={css.text}></Text>
      </View>
    );
};

export function currencyFormat(num: number) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}