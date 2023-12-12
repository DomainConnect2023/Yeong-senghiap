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