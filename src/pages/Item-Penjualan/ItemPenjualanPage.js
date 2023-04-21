import { Alert, Button, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import ModalCreateUpdateItemPenjualan from './ModalCreateUpdateItemPenjualan';
import { Cell, Row, Rows, Table } from 'react-native-table-component';
import { DataTable } from 'react-native-paper';
import * as itemPenjualanApi from '../../apis/itemPenjualanApi';

export default class ItemPenjualanPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showCreateUpdateModal: false,
        idToEditItemPenjualans: null,
        itemPenjualan: [],
    }
}

  componentDidMount = async() => {
    await this.getItemPenjualan();
 }

  getItemPenjualan = async() =>{
    try{
      let promise  = await itemPenjualanApi.getAll();
      let response = await promise.data
      this.setState({
          itemPenjualan:response
      })
    }catch(e){
      console.log(e)
    }
    
  }

  onPressCreate = () => {
    this.setState({
      showCreateUpdateModal: true,
      idToEditItemPenjualans: null
    })
  }

  onDelete = async(value) => {
    try{
      await itemPenjualanApi.deleteById(value.id)
      this.getItemPenjualan();
    }
    catch(e){
    }
  }
  
  dialogDelete = (data) => {
    Alert.alert('Delete', "Are you sure you want to delete this?",[
      {
        text: 'Cancel',
        onPress: () => {return},
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => this.onDelete(data) 
      }
    ])
  }

  handleChange = (fieldname, value) => {
    this.setState({
      [fieldname]: value
    })
  }

  closeModalCreateUpdate = () => {
    this.setState({
        idToEditItemPenjualans: null,
        showCreateUpdateModal: false
    })
}

  closeModalCreateUpdateAndRefreshTable = async() => {
    this.closeModalCreateUpdate()
    this.getItemPenjualan();
}
  render() {
    return (
      <View style={styles.container}>
        {this.state.showCreateUpdateModal && <ModalCreateUpdateItemPenjualan 
        show={this.state.showCreateUpdateModal} handleChange={(fieldname, value) => this.handleChange(fieldname,value)} 
        closeModalCreateUpdateAndRefreshTable={this.closeModalCreateUpdateAndRefreshTable}
        idToEditItemPenjualans={this.state.idToEditItemPenjualans}/>}
        <Button title='Create' onPress={this.onPressCreate}/>
        <Body itemPenjualan={this.state.itemPenjualan} handleChange={(field, value) => this.handleChange(field, value)} dialogDelete={this.dialogDelete}/>  
      </View>
    )
  }
}


class Body extends Component {
  onClickUpdate = async(value) =>{
    await this.props.handleChange("idToEditItemPenjualans", value.id)
    this.props.handleChange("showCreateUpdateModal", true)
}
  render() {
    const itemPenjualan = this.props.itemPenjualan !== [] ? this.props.itemPenjualan : []
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>No</DataTable.Title>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title>Nota</DataTable.Title>
          <DataTable.Title>Kode Barang</DataTable.Title>
          <DataTable.Title>Qty</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
          <DataTable.Title></DataTable.Title>
        </DataTable.Header>
          {itemPenjualan.map((data, index)=>{
            return(
        <DataTable.Row key={data.id}>
              <DataTable.Cell>{index+1}</DataTable.Cell>
              <DataTable.Cell>{data.id}</DataTable.Cell>
              <DataTable.Cell>{data.NOTA}</DataTable.Cell>
              <DataTable.Cell>{data.KODE_BARANG}</DataTable.Cell>
              <DataTable.Cell>{data.QTY}</DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity style={[styles.button, styles.buttonEdit]}
            onPress={() => {this.onClickUpdate(data)}} >
                  <Text style={{color:'white'}}>Edit</Text>
                </TouchableOpacity>
              </DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity style={[styles.button, styles.buttonDanger]}
            onPress={() => {this.props.dialogDelete(data)}} >
                  <Text style={{color:'white'}}>{Platform.OS == 'ios' ? 'Delete' : 'Del'}</Text>
                </TouchableOpacity>
              </DataTable.Cell>
        </DataTable.Row>

            )
          })}
      </DataTable>
    )
  }
}

const styles =  StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonEdit: {
    backgroundColor:'blue'
  },
  buttonDanger: {
    backgroundColor: '#FF0000'
  }
})