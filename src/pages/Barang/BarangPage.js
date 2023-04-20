import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import ModalCreateUpdateBarang from './ModalCreateUpdateBarang';
import { Cell, Row, Rows, Table } from 'react-native-table-component';
import { DataTable } from 'react-native-paper';
import * as barangApi from '../../apis/barangApi';

export default class BarangPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showCreateUpdateModal: false,
        idToEditBarangs: null,
        barang: [],
    }
}

  componentDidMount = async() => {
    await this.getBarang();
 }

  getBarang = async() =>{
    try{
      let promise  = await barangApi.getAll();
      let response = await promise.data
      this.setState({
          barang:response
      })
    }catch(e){
      console.log(e)
    }
    
  }

  onDelete = async(value) => {
    try{
      await barangApi.deletebyId(value.KODE)
      this.getBarang();
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

  onPressCreate = () => {
    this.setState({
      showCreateUpdateModal: true,
      idToEditBarangs: null
    })
  }

  handleChange = (fieldname, value) => {
    this.setState({
      [fieldname]: value
    })
  }

  closeModalCreateUpdate = () => {
    this.setState({
        idToEditBarangs: null,
        showCreateUpdateModal: false
    })
}

  closeModalCreateUpdateAndRefreshTable = async() => {
    this.closeModalCreateUpdate()
    this.getBarang();
}
  render() {
    return (
      <View style={styles.container}>
        {this.state.showCreateUpdateModal && <ModalCreateUpdateBarang 
        show={this.state.showCreateUpdateModal} handleChange={(fieldname, value) => this.handleChange(fieldname,value)} 
        closeModalCreateUpdateAndRefreshTable={this.closeModalCreateUpdateAndRefreshTable}
        idToEditBarangs={this.state.idToEditBarangs}/>}
        <Button title='Create' onPress={this.onPressCreate}/>
        <Body barang={this.state.barang} handleChange={(field, value) => this.handleChange(field, value)} dialogDelete={this.dialogDelete}/>  
      </View>
    )
  }
}


class Body extends Component {
  onClickUpdate = async(value) =>{
    await this.props.handleChange("idToEditBarangs", value.KODE)
    this.props.handleChange("showCreateUpdateModal", true)
}
  render() {
    const barang = this.props.barang !== [] ? this.props.barang : []
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>No</DataTable.Title>
          <DataTable.Title>Kode</DataTable.Title>
          <DataTable.Title>Nama</DataTable.Title>
          <DataTable.Title>Kategori</DataTable.Title>
          <DataTable.Title>Harga</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
          <DataTable.Title></DataTable.Title>
        </DataTable.Header>
          {barang.map((data, index)=>{
            return(
        <DataTable.Row key={data.KODE}>
              <DataTable.Cell>{index+1}</DataTable.Cell>
              <DataTable.Cell>{data.KODE}</DataTable.Cell>
              <DataTable.Cell>{data.NAMA}</DataTable.Cell>
              <DataTable.Cell>{data.KATEGORI}</DataTable.Cell>
              <DataTable.Cell>{data.HARGA}</DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity style={[styles.button, styles.buttonEdit]}
            onPress={() => {this.onClickUpdate(data)}} >
                  <Text style={{color:'white'}}>Edit</Text>
                </TouchableOpacity>
              </DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity style={[styles.button, styles.buttonDanger]}
            onPress={() => {this.props.dialogDelete(data)}} >
                  <Text style={{color:'white'}}>Delete</Text>
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