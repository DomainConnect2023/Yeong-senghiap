import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart, LineChartBicolor, PopulationPyramid, ruleTypes } from 'react-native-gifted-charts';
import { dataSet, dataSet2, testData1, testData10, testData11, testData2, testData3, testData4, testData5, testData8, testData9 } from './data';
import { LinearGradient, Stop } from 'react-native-svg';

const HighlightedRange = () => {
  const offset = 130;

  const customDataPointComp = (v: number) => {
    const isUp = v + offset > 175;
    const color =
      v + offset > 180 ? '#EA3335' : v + offset > 150 ? '#F5AF22' : '#8B943B';
    return (
      <View style={{height: 16, width: 28, alignItems: 'center'}}>
        <Text
          style={{
            position: 'absolute',
            top: isUp ? -20 : 15,
            color,
            fontWeight: 'bold',
            fontSize: 16,
            fontStyle: 'italic',
          }}>
          {v + offset}
        </Text>
        <View
          style={{
            height: 16,
            width: 16,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: color,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 6,
              width: 6,
              borderRadius: 3,
              backgroundColor: color,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" >
        <View style={styles.components}>
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
            data={testData1}
            spacing={30}
            thickness={5}
            hideRules
            hideYAxisText
            yAxisColor="#0BA5A4"
            showVerticalLines
            verticalLinesColor="rgba(14,164,164,0.5)"
            xAxisColor="#0BA5A4"
            color="#0BA5A4"
          />
        </View>
        <View style={styles.components}>
          <LineChart
            areaChart
            curved
            data={testData1}
            data2={testData3}
            height={250}
            showVerticalLines
            spacing={44}
            initialSpacing={0}
            color1="skyblue"
            color2="orange"
            textColor1="green"
            hideDataPoints
            dataPointsColor1="blue"
            dataPointsColor2="red"
            startFillColor1="skyblue"
            startFillColor2="orange"
            startOpacity={0.8}
            endOpacity={0.3}
            textShiftY={-2}
            textShiftX={-5}
            textFontSize={13}
          />
        </View>
        <View style={styles.components}>
        <LineChartBicolor
          data={testData4}
          areaChart
          color="green"
          colorNegative="red"
          startFillColor="green"
          startFillColorNegative="red"
          showXAxisIndices
        />
        </View>
        <View style={styles.components}>
        <LineChart
          areaChart
          curved
          data={testData1}
          data2={testData3}
          hideDataPoints
          spacing={68}
          color1="#8a56ce"
          color2="#56acce"
          startFillColor1="#8a56ce"
          startFillColor2="#56acce"
          endFillColor1="#8a56ce"
          endFillColor2="#56acce"
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={0}
          noOfSections={4}
          yAxisColor="white"
          yAxisThickness={0}
          rulesType={ruleTypes.SOLID}
          rulesColor="gray"
          yAxisTextStyle={{color: 'gray'}}
          yAxisLabelSuffix="%"
          xAxisColor="lightgray"
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            strokeDashArray: [2, 5],
            pointerColor: 'lightgray',
            radius: 4,
            pointerLabelWidth: 100,
            pointerLabelHeight: 120,
            pointerLabelComponent: (items: { value: any; }[]) => {
              return (
                <View
                  style={{
                    height: 120,
                    width: 100,
                    backgroundColor: '#282C3E',
                    borderRadius: 4,
                    justifyContent: 'center',
                    paddingLeft: 16,
                  }}>
                  <Text style={{color: 'lightgray', fontSize: 12}}>{2018}</Text>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {items[0].value}
                  </Text>
                  <Text style={{color: 'lightgray', fontSize: 12, marginTop: 12}}>
                    {2019}
                  </Text>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {items[1].value}
                  </Text>
                </View>
              );
            },
          }}
        />
        </View>
        <View style={styles.components}>
        <LineChart
          areaChart
          data={testData5}
          rotateLabel
          width={300}
          hideDataPoints
          spacing={10}
          color="#00ff83"
          thickness={2}
          startFillColor="rgba(20,105,81,0.3)"
          endFillColor="rgba(20,85,81,0.01)"
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={0}
          noOfSections={6}
          stepHeight={50}
          height={300}
          maxValue={600}
          yAxisColor="white"
          yAxisThickness={0}
          rulesType={ruleTypes.SOLID}
          rulesColor="gray"
          yAxisTextStyle={{color: 'gray'}}
          yAxisLabelPrefix="hello"
          yAxisTextNumberOfLines={2}
          // yAxisLabelWidth={40}
          // yAxisSide='right'
          xAxisColor="lightgray"
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: 'lightgray',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            // activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items: { value: string; date: string }[]) => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 100,
                    justifyContent: 'center',
                    // marginTop: -30,
                    // marginLeft: -40,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      marginBottom: 6,
                      textAlign: 'center',
                    }}>
                    {items[0].date}
                  </Text>

                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: 'white',
                    }}>
                    <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                      {'$' + items[0].value + '.0'}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
        </View>
        <View style={styles.components}>
        <LineChart
          dataSet={dataSet}
          stepChart
          height={250}
          showVerticalLines
          spacing={44}
          initialSpacing={0}
          dataPointsHeight={6}
          dataPointsWidth={6}
          textShiftY={-2}
          textShiftX={-5}
          textFontSize={13}
        />
        </View>
        <View style={styles.components}>
        <LineChart
          data={testData8}
          noOfSections={5}
          lineGradient
          lineGradientId="ggrd"
          lineGradientComponent={() => {
            return (
              <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={'#EA3335'} />
                <Stop offset="0.5" stopColor={'#F5AF22'} />
                <Stop offset="1" stopColor={'#8B943B'} />
              </LinearGradient>
            );
          }}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisOffset={offset}
          customDataPoint={(item: { value: number; }) => {
            return customDataPointComp(item.value);
          }}
        />
        </View>
        <View style={styles.components}>
          <LineChart
            data={testData1}
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
          />
        </View>
        <View style={styles.components}>
        <LineChart
          data={testData1}
          data2={testData3}
          height={250}
          showValuesAsDataPointsText
          showVerticalLines
          spacing={44}
          initialSpacing={0}
          color1="skyblue"
          color2="orange"
          textColor1="green"
          dataPointsHeight={6}
          dataPointsWidth={6}
          dataPointsColor1="blue"
          dataPointsColor2="red"
          textShiftY={-2}
          textShiftX={-5}
          textFontSize={13}
        />
        </View>
        <View style={styles.components}>
        <PopulationPyramid
          data={testData9}
          yAxisLabelTexts={[
            '0-10',
            '10-20',
            '20-30',
            '30-40',
            '40-50',
            '50-60',
            '60-70',
            '70-80',
            '80-90',
            '90-100',
            '100-110',
            '110-120',
          ].reverse()}
          yAxisLabelFontSize={9}
          showYAxisIndices
          showMidAxis
          midAxisLabelFontSize={10}
          midAxisLabelColor={'gray'}
          leftBarLabelColor={'blue'}
          rightBarLabelColor={'red'}
          midAxisLeftColor={'blue'}
          midAxisRightColor={'red'}
        />
        </View>
        <View style={styles.components}>
          <LineChart
            data={testData10}
            maxValue={140}
            noOfSections={7}
            spacing={16}
            hideDataPoints
            hideRules
            color="orange"
            yAxisColor={'orange'}
            showYAxisIndices
            yAxisIndicesColor={'orange'}
            yAxisIndicesWidth={10}
            secondaryData={testData11.map(v => ({value: v}))}
            secondaryLineConfig={{color: 'blue'}}
            secondaryYAxis={{
              maxValue: 0.2,
              noOfSections: 4,
              showFractionalValues: true,
              roundToDigits: 3,
              yAxisColor: 'blue',
              yAxisIndicesColor: 'blue',
            }}
            xAxisLabelTextStyle={{width: 80, marginLeft: -36}}
            xAxisIndicesHeight={10}
            xAxisIndicesWidth={2}
          />
        </View>

        <View style={styles.components}>
        <LineChart
          areaChart
          curved
          dataSet={dataSet2}
          height={250}
          showVerticalLines
          spacing={44}
          initialSpacing={0}
          hideDataPoints
          startOpacity={0.8}
          endOpacity={0.3}
          textShiftY={-2}
          textShiftX={-5}
          textFontSize={13}
        />
        </View>
        <View style={styles.components}>
          <LineChart
            initialSpacing={0}
            data={testData3}
            spacing={30}
            hideDataPoints
            thickness={5}
            hideRules
            hideYAxisText
            yAxisColor="#0BA5A4"
            showVerticalLines
            verticalLinesColor="rgba(14,164,164,0.5)"
            xAxisColor="#0BA5A4"
            color="#0BA5A4"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  components: {
    flex:1, 
    width:Dimensions.get("screen").width,
  }
  
});

export default HighlightedRange;