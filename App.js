/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, Alert, Button} from 'react-native';
import Messaging from '@react-native-firebase/messaging';
import {LineChart, Grid, YAxis, XAxis} from 'react-native-svg-charts';
import HighchartsReactNative from '@highcharts/highcharts-react-native';

const App = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const requestForNotificationPermission = useCallback(async () => {
    const authStatus = await Messaging().requestPermission();
    const enabled =
      authStatus === Messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === Messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await Messaging().getToken();
      setFcmToken(token);
      if (fcmToken) {
        console.log('Your Firebase Token is:', fcmToken);
        // Alert.alert('FCM Token', fcmToken);
      } else {
        console.log('Failed', 'No token received');
      }
    }
  });

  const handleNotificationTapFromBackground = useCallback(() => {
    Messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });
  });

  const handleNotificationTapFromQuit = useCallback(() => {
    Messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
  });

  useEffect(() => {
    requestForNotificationPermission();

    const unsubscribe = Messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, [requestForNotificationPermission]);

  useEffect(() => {
    handleNotificationTapFromBackground();
    handleNotificationTapFromQuit();
  }, [handleNotificationTapFromBackground, handleNotificationTapFromQuit]);

  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];

  const options = {
    chartOptions: {
      credits: {
        enabled: false,
      },
      chart: {
        // renderTo: 'container',
        // defaultSeriesType: 'column',
        // borderWidth: 0,
        // marginLeft: 50,
        // marginRight: 50,
        events: {
          load: function () {
            var points = this.series[0].points;
            console.log(points);
            points[points.length - 1].update({
              marker: {
                enabled: true,
              },
            });
          },

          //     load: function () {
          //       // set up the updating of the chart each second
          //       var series = this.series[0];
          //       setInterval(function () {
          //         var y = Math.random();
          //         series.addPoint(y, true, true);
          //       }, 1000);
          //     },
        },
      },
      data: {
        table: 'datatable',
      },
      title: {
        text: 'Chart',
      },
      plotOptions: {
        series: {
          shadow: false,
          marker: {
            enabled: false,
          },
        },
      },
      xAxis: {
        gridLineWidth: 1,
        // categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        lineColor: '#999',
        lineWidth: 1,
        tickColor: 'gray',
        tickLength: 1,
        title: {
          text: 'Time',
          style: {
            color: '#000',
          },
        },
      },
      yAxis: [
        {
          // allowDecimals: false,
          title: {
            text: 'Value',
          },
          gridLineWidth: 1,
          // lineColor: '#999',
          lineWidth: 1,
          // tickColor: '#666',
          // tickWidth: 1,
          // tickLength: 3,
          // tickInterval: 415 / 20,
          // padding: [10, 10, 10, 10],
          endOnTick: false,
          opposite: true,
          // linkedTo: 0,

          plotLines: [
            {
              color: 'gray',
              width: 2,
              value: 20, // Need to set this probably as a var.
              label: {
                text: '7',
                // verticalAlign: 'middle',
                textAlign: 'left',
                verticalAlign: 'middle',
                style: {
                  color: 'red',
                  fontSize: 20,
                  // marginLeft: 10,
                  borderWidth: 1,
                  backgroundColor: 'red',
                  borderColor: 'red',
                },
                x: 330,
              },
            },
          ],
          accessibility: {
            enabled: true,
          },
          opposite: true,
        },
      ],
      tooltip: {
        formatter: function () {
          return this.x + ', ' + this.y;
        },
      },

      series: [
        {
          showInLegend: false,
          type: 'line',

          data: [
            {x: 10, y: 1, name: 'Test'},
            {x: 20, y: 2},
            {x: 30, y: 3},
            {x: 40, y: 40},
            {x: 50, y: 5},
            {x: 60, y: 6},
            {x: 70, y: 7},
            {x: 80, y: 7},
            {x: 90, y: 100},
            {x: 100, y: 10},
          ],
        },
      ],
    },
  };
  return (
    <View style={styles.container}>
      <HighchartsReactNative
        styles={styles.chart}
        options={options.chartOptions}
      />
      <Button
        title="Refresh"
        onPress={() => {
          setRefresh(!refresh);
        }}
      />
    </View>
    // <View
    //   style={{
    //     flex: 1,
    //     // backgroundColor: 'red',
    //     // alignItems: 'center',
    //     justifyContent: 'center',
    //   }}>
    //   <LineChart
    //     style={{height: 200}}
    //     data={data}
    //     svg={{stroke: 'rgb(134, 65, 244)'}}
    //     numberOfTicks={10}
    //     contentInset={{top: 20, bottom: 20, right: 20, left: 20}}>
    //     {/* <Grid /> */}
    //     <Grid direction="BOTH" />
    //     <YAxis
    //       data={data}
    //       contentInset={{top: 20, bottom: 20}}
    //       svg={{
    //         fill: 'grey',
    //         fontSize: 10,
    //       }}
    //       numberOfTicks={10}
    //       formatLabel={(value) => `${value}ºC`}
    //     />
    //   </LineChart>

    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  chart: {
    height: '50%',
    width: '100%',
    backgroundColor: 'black',
  },
});

export default App;
