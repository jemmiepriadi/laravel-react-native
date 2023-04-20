import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';  

export default class Home extends React.Component {
   onPress = (navigate) => {
    this.props.navigation.navigate(navigate)
  }
    render(){
      const list = [{id:0, name:'penjualan', navigate: 'Penjualan'}, {id:1, name:'barang', navigate: 'Barang'}, {id:2, name:'pelanggan', navigate:'Pelanggan'}, {id: 3, name:'item-penjualan', navigate: 'Item Penjualan'}]
      const renderElement = list.map((element) => {
         return (
          <TouchableOpacity key={element.id} onPress={()=>{this.onPress(element.navigate)}}>
            <Text  style={styles.text}>{element.name}</Text>
          </TouchableOpacity>
          )
      })
        return (
            <View style={{flex:1}}>
              <View style={styles.container2}>
                <Text>Click below to navigate each page</Text>
              </View>
              <View style={styles.container}>
                {renderElement}
              </View>
            </View>
            
          );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  container2: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 40,
    color: 'black',
  },
});
