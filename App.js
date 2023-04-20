import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/pages/Home';
import ItemPenjualanPage from './src/pages/Item-Penjualan/ItemPenjualanPage';
import PelangganPage from './src/pages/Pelanggan/PelangganPage';
import PenjualanPage from './src/pages/Penjualan/PenjualanPage';
import BarangPage from './src/pages/Barang/BarangPage';

const Stack = createStackNavigator();
export default class App extends React.PureComponent {
  render(){
    return (
//      <View style={styles.container}>
//        <Text>Open up App.js to start working on your app!</Text>
//        <StatusBar style="auto" />
//      </View> 
      <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name="Home"
                  component={Home}
                />
                <Stack.Screen
                  name="Barang"
                  component={BarangPage}
                />
                <Stack.Screen
                  name="Penjualan"
                  component={PenjualanPage}
                />
                <Stack.Screen
                  name="Pelanggan"
                  component={PelangganPage}
                />
                <Stack.Screen
                  name="Item Penjualan"
                  component={ItemPenjualanPage}
                />
              </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
