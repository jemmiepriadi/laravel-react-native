import { Alert, Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import ModalCreateUpdatePenjualan from './ModalCreateUpdatePenjualan';
import { Cell, Row, Rows, Table } from 'react-native-table-component';
import { DataTable } from 'react-native-paper';
import * as penjualanApi from '../../apis/penjualanApi';

export default class PenjualanPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showCreateUpdateModal: false,
        idToEditPenjualans: null,
        penjualan: [],
    }
}

  componentDidMount = async() => {
    await this.getPenjualan();
 }

  getPenjualan = async() =>{
    try{
      let promise  = await penjualanApi.getAll();
      let response = await promise.data
      this.setState({
          penjualan:response
      })
    }catch(e){
      console.log(e)
    }
    
  }

  onPressCreate = async() => {
    this.setState({
      showCreateUpdateModal: true,
      idToEditPenjualans: null
    })
  }

  handleChange = (fieldname, value) => {
    this.setState({
      [fieldname]: value
    })
  }

  onDelete = async(value) => {
    try{
      await penjualanApi.deleteById(value.ID_NOTA)
      this.getPenjualan();
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

  closeModalCreateUpdate = () => {
    this.setState({
        idToEditPenjualans: null,
        showCreateUpdateModal: false
    })
}

  closeModalCreateUpdateAndRefreshTable = async() => {
    this.closeModalCreateUpdate()
    this.getPenjualan();
}
  render() {
    return (
      <View style={styles.container}>
         {this.state.showCreateUpdateModal && <ModalCreateUpdatePenjualan 
        show={this.state.showCreateUpdateModal} handleChange={(fieldname, value) => this.handleChange(fieldname,value)} 
        closeModalCreateUpdateAndRefreshTable={this.closeModalCreateUpdateAndRefreshTable} idToEditPenjualans={this.state.idToEditPenjualans}/>}
        <Button title='Create' onPress={this.onPressCreate}/>
        <Body idToEditPenjualans={this.state.idToEditPenjualans} penjualan={this.state.penjualan} handleChange={(field, value) => this.handleChange(field, value)} dialogDelete={this.dialogDelete}/>  
      </View>
    )
  }
}


class Body extends Component {
  onClickUpdate = async(value) =>{
    await this.props.handleChange("idToEditPenjualans", value.ID_NOTA)
    this.props.handleChange("showCreateUpdateModal", true)
}
  render() {
    const penjualan = this.props.penjualan !== [] ? this.props.penjualan : []
    return (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>No</DataTable.Title>
            <DataTable.Title>ID_Nota</DataTable.Title>
            <DataTable.Title>Tanggal</DataTable.Title>
            <DataTable.Title>Kode Pelanggan</DataTable.Title>
            <DataTable.Title>Subtotal</DataTable.Title>
            <DataTable.Title>Action</DataTable.Title>
            <DataTable.Title></DataTable.Title>
          </DataTable.Header>
            {penjualan.map((data, index)=>{
              return(
          <DataTable.Row key={data.ID_NOTA}>
                <DataTable.Cell>{index+1}</DataTable.Cell>
                <DataTable.Cell>{data.ID_NOTA}</DataTable.Cell>
                <DataTable.Cell>{data.TGL}</DataTable.Cell>
                <DataTable.Cell>{data.KODE_PELANGGAN}</DataTable.Cell>
                <DataTable.Cell>{data.SUBTOTAL}</DataTable.Cell>
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