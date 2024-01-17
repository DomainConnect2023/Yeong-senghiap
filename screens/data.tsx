import { ReactElement, JSXElementConstructor, ReactNode } from "react";
import { Text, View } from "react-native";
import { DataSet } from "react-native-gifted-charts/src/utils/types";

export const testbardata = {
  labels: ["Today", "Yesterday", "-3Days", "-4Days", "-5Days"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99],
    },
    // {
    //   data: [50],
    // },
    // {
    //   data: [100],
    // },
  ]
};

export const rundata = [
  {value: 6},
  {value: 6},
  {value: 8},
  {value: 5},
  {value: 5},
  {value: 8},
  {value: 0},
  {value: 8},
  {value: 10},
  {value: 10},
  {value: 12},
  {value: 15},
  {value: 20},
  {value: 22},
  {value: 20},
];

export const ptData = [
  {value: 160, date: '1 Apr 2022'},
  {value: 180, date: '2 Apr 2022'},
  {value: 190, date: '3 Apr 2022'},
  {value: 180, date: '4 Apr 2022'},
  {value: 140, date: '5 Apr 2022'},
  {value: 145, date: '6 Apr 2022'},
  {value: 160, date: '7 Apr 2022'},
  {value: 200, date: '8 Apr 2022'},

  {value: 220, date: '9 Apr 2022'},
  {
    value: 240,
    date: '10 Apr 2022',
    label: '10 Apr',
    labelTextStyle: {color: 'lightgray', width: 60},
  },
  {value: 280, date: '11 Apr 2022'},
  {value: 260, date: '12 Apr 2022'},
  {value: 340, date: '13 Apr 2022'},
  {value: 385, date: '14 Apr 2022'},
  {value: 280, date: '15 Apr 2022'},
  {value: 390, date: '16 Apr 2022'},

  {value: 370, date: '17 Apr 2022'},
  {value: 285, date: '18 Apr 2022'},
  {value: 295, date: '19 Apr 2022'},
  {
    value: 300,
    date: '20 Apr 2022',
    label: '20 Apr',
    labelTextStyle: {color: 'lightgray', width: 60},
  },
  {value: 280, date: '21 Apr 2022'},
  {value: 295, date: '22 Apr 2022'},
  {value: 260, date: '23 Apr 2022'},
  {value: 255, date: '24 Apr 2022'},

  {value: 190, date: '25 Apr 2022'},
  {value: 220, date: '26 Apr 2022'},
  {value: 205, date: '27 Apr 2022'},
  {value: 230, date: '28 Apr 2022'},
  {value: 210, date: '29 Apr 2022'},
  {
    value: 200,
    date: '30 Apr 2022',
    label: '30 Apr',
    labelTextStyle: {color: 'lightgray', width: 60},
  },
  {value: 240, date: '1 May 2022'},
  {value: 250, date: '2 May 2022'},
  {value: 280, date: '3 May 2022'},
  {value: 250, date: '4 May 2022'},
  {value: 210, date: '5 May 2022'},
];

export const testdata = [
  {value: 0},
  {value: 20},
  {value: 18},
  {value: 40},
  {value: 36},
  {value: 60},
  {value: 54},
  {value: 85},
];

export const testflatdata = [
    {
      key: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      value: 'Product',
      name: 'Product',
      amount: '1103',
      color: 'yellow'
    },
    {
      key: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      value: 'Customer',
      name: 'Customer',
      amount: '25923',
      color: 'yellow'
    },
    {
      key: '58694a0f-3da1-471f-bd96-145571efsdf2',
      value: 'Salesman',
      name: 'Salesman',
      amount: '123',
      color: 'yellow'
    },
    {
      key: '58694a0f-3da1-471f-bd96-14dfshsd9d72',
      value: 'AAAA',
      name: 'AAAA',
      amount: '12331',
      color: 'yellow'
    },
    {
      key: '58694a0f-3da1-471f-bddfhd72',
      value: 'BBBB',
      name: 'BBBB',
      amount: '2353',
      color: 'yellow'
    },
    {
      key: '58694a0f-3da1-471f-bd9dfhsdfhsdf1e29d72',
      value: 'CCCC',
      name: 'CCCC',
      amount: '6122',
      color: 'yellow'
    },
    {
      key: '58694a0f-3da1-471f-bd96-1dfhdfhsdfh29d72',
      value: 'DDDD',
      name: 'DDDD',
      amount: '1623',
      color: 'yellow'
    },
];

export const dPoint = () => {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        backgroundColor: 'white',
        borderWidth: 3,
        borderRadius: 7,
        borderColor: '#07BAD1',
      }}
    />
  );
};

export const lcomp = (v: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined) => (
  <Text style={{width: 50, color: 'white', fontWeight: 'bold'}}>{v}</Text>
);

export const latestData = [
  {
    value: 350,
    labelComponent: () => lcomp('22 Nov'),
    customDataPoint: dPoint,
  },
  {
    value: 370,
    hideDataPoint: true,
  },
  {
    value: 460,
    customDataPoint: dPoint,
  },
  {
    value: 500,
    hideDataPoint: true,
  },
  {
    value: 570,
    labelComponent: () => lcomp('24 Nov'),
    customDataPoint: dPoint,
  },
  {
    value: 560,
    hideDataPoint: true,
  },
  {
    value: 590,
    customDataPoint: dPoint,
  },
  {
    value: 490,
    hideDataPoint: true,
  },
  {
    value: 280,
    labelComponent: () => lcomp('26 Nov'),
    customDataPoint: dPoint,
  },
  {
    value: 370,
    hideDataPoint: true,
  },
  {
    value: 350,
    customDataPoint: dPoint,
  },
  {
    value: 460,
    hideDataPoint: true,
  },
  {
    value: 520,
    labelComponent: () => lcomp('28 Nov'),
    customDataPoint: dPoint,
  },
  {
    value: 490,
    hideDataPoint: true,
  },
  {
    value: 370,
    hideDataPoint: true,
  },
  {
    value: 350,
    customDataPoint: dPoint,
  },
  {
    value: 460,
    labelComponent: () => lcomp('28 Nov'),
    customDataPoint: dPoint,
  },
  {
    value: 270,
    hideDataPoint: true,
  },
  {
    value: 350,
    customDataPoint: dPoint,
  },
];

export const testData1 = [
    {value: 0},
    {value: 20},
    {value: 18},
    {value: 40},
    {value: 36},
    {value: 60},
    {value: 54},
    {value: 85},
];

export const testData3 = [
    {value: 0},
    {value: 10},
    {value: 8},
    {value: 58},
    {value: 56},
    {value: 78},
    {value: 74},
    {value: 98},
];

export const testData2 = [
    {
      value: 350,
      labelComponent: () => lcomp('22 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 370,
      hideDataPoint: true,
    },
    {
      value: 460,
      customDataPoint: dPoint,
    },
    {
      value: 500,
      hideDataPoint: true,
    },
    {
      value: 570,
      labelComponent: () => lcomp('24 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 560,
      hideDataPoint: true,
    },
    {
      value: 590,
      customDataPoint: dPoint,
    },
    {
      value: 490,
      hideDataPoint: true,
    },
    {
      value: 280,
      labelComponent: () => lcomp('26 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 370,
      hideDataPoint: true,
    },
    {
      value: 350,
      customDataPoint: dPoint,
    },
    {
      value: 460,
      hideDataPoint: true,
    },
    {
      value: 520,
      labelComponent: () => lcomp('28 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 490,
      hideDataPoint: true,
    },
    {
      value: 370,
      hideDataPoint: true,
    },
    {
      value: 350,
      customDataPoint: dPoint,
    },
    {
      value: 460,
      labelComponent: () => lcomp('28 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 270,
      hideDataPoint: true,
    },
    {
      value: 350,
      customDataPoint: dPoint,
    },
];

export const testData4 = [
    {value: 0},
    {value: 20},
    {value: -18},
    {value: 40},
    {value: 36},
    {value: -60},
    {value: 54},
    {value: 85},
];

export const testData5 = [
    {value: 160, date: '1 Apr 2022'},
    {value: 180, date: '2 Apr 2022'},
    {value: 190, date: '3 Apr 2022'},
    {value: 180, date: '4 Apr 2022'},
    {value: 140, date: '5 Apr 2022'},
    {value: 145, date: '6 Apr 2022'},
    {value: 160, date: '7 Apr 2022'},
    {value: 200, date: '8 Apr 2022'},

    {value: 220, date: '9 Apr 2022'},
    {
      value: 240,
      date: '10 Apr 2022',
      label: '10 Apr',
      labelTextStyle: {color: 'lightgray', width: 60},
    },
    {value: 280, date: '11 Apr 2022'},
    {value: 260, date: '12 Apr 2022'},
    {value: 340, date: '13 Apr 2022'},
    {value: 385, date: '14 Apr 2022'},
    {value: 280, date: '15 Apr 2022'},
    {value: 390, date: '16 Apr 2022'},

    {value: 370, date: '17 Apr 2022'},
    {value: 285, date: '18 Apr 2022'},
    {value: 295, date: '19 Apr 2022'},
    {
      value: 300,
      date: '20 Apr 2022',
      label: '20 Apr',
      labelTextStyle: {color: 'lightgray', width: 60},
    },
    {value: 280, date: '21 Apr 2022'},
    {value: 295, date: '22 Apr 2022'},
    {value: 260, date: '23 Apr 2022'},
    {value: 255, date: '24 Apr 2022'},

    {value: 190, date: '25 Apr 2022'},
    {value: 220, date: '26 Apr 2022'},
    {value: 205, date: '27 Apr 2022'},
    {value: 230, date: '28 Apr 2022'},
    {value: 210, date: '29 Apr 2022'},
    {
      value: 200,
      date: '30 Apr 2022',
      label: '30 Apr',
      labelTextStyle: {color: 'lightgray', width: 60},
    },
    {value: 240, date: '1 May 2022'},
    {value: 250, date: '2 May 2022'},
    {value: 280, date: '3 May 2022'},
    {value: 250, date: '4 May 2022'},
    {value: 210, date: '5 May 2022'},
];

export const testData6 = [
    {value: 0, dataPointText: '0'},
    {value: 10, dataPointText: '10'},
    {value: 8, dataPointText: '8'},
    {value: 58, dataPointText: '58'},
    {value: 56, dataPointText: '56'},
    {value: 78, dataPointText: '78'},
    {value: 74, dataPointText: '74'},
    {value: 98, dataPointText: '98'},
];

export const testData7 = [
    {value: 0, dataPointText: '0'},
    {value: 20, dataPointText: '20'},
    {value: 18, dataPointText: '18'},
    {value: 40, dataPointText: '40'},
    {value: 36, dataPointText: '36'},
    {value: 60, dataPointText: '60'},
    {value: 54, dataPointText: '54'},
    {value: 85, dataPointText: '85'},
];

export const dataSet: Array<DataSet> = [
    {
      data: testData6,
      color: 'skyblue',
      dataPointsColor: 'blue',
      textColor: 'green',
    },
    {data: testData7, color: 'orange', dataPointsColor: 'red'},
];

export const testData8 = [
    {value: 170},
    {value: 220},
    {value: 170},
    {value: 196},
    {value: 176},
    {value: 141},
    {value: 172},
];

export const testData9 = [
    {left: 30, right: 40, midAxisLabel: '~115'},
    {left: 40, right: 44, midAxisLabel: '~105'},
    {left: 55, right: 57, midAxisLabel: '~95'},
    {left: 94, right: 87, midAxisLabel: '~85'},
    {left: 90, right: 88, midAxisLabel: '~75'},
    {left: 88, right: 86, midAxisLabel: '~65'},
];

export const testData10 = [
    {value: 110},
    {value: 90},
    {value: 100},
    {value: 120},
    {value: 100, label: '2005', showXAxisIndex: true},
    {value: 80},
    {value: 90},
    {value: 110},
    {value: 120},
    {value: 100, label: '2010', showXAxisIndex: true},
    {value: 90},
    {value: 100},
    {value: 88},
    {value: 80},
    {value: 120, label: '2015', showXAxisIndex: true},
    {value: 76},
    {value: 104},
    {value: 112},
];

export const testData11 = [
    0.055, 0.02, 0.1, 0.01, 0.05, 0.06, 0.08, 0.1, 0.08, 0.07, 0.06, 0.025,
    0.04, 0.06, 0.045, 0.09, 0.06, 0.04,
];

export const dataSet2: Array<DataSet> = [
    {
      data: testData1,
      color: 'skyblue',
      dataPointsColor: 'blue',
      textColor: 'green',
      lineSegments: [{startIndex: 2, endIndex: 4, strokeDashArray: [3, 4]}],
    },
    {
      data: testData3,
      color: 'orange',
      dataPointsColor: 'red',
      lineSegments: [
        {startIndex: 0, endIndex: 2, color: 'gray'},
        {startIndex: 4, endIndex: 6, strokeDashArray: [3, 4], color: 'gray'},
      ],
    },
];