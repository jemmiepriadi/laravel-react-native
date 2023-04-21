import { Alert, Button, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import ModalCreateUpdatePelanggan from './ModalCreateUpdatePelanggan';
import { Cell, Row, Rows, Table } from 'react-native-table-component';
import { DataTable } from 'react-native-paper';
import * as pelangganApi from '../../apis/pelangganApi';

export default class PelangganPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showCreateUpdateModal: false,
        idToEditPelanggans: null,
        pelanggan: [],
    }
}

  componentDidMount = async() => {
    await this.getPelanggan();
 }

  getPelanggan = async() =>{
    try{
      let promise  = await pelangganApi.getAll();
      let response = await promise.data
      this.setState({
          pelanggan:response
      })
    }catch(e){
      console.log(e)
    }
    
  }

  onPressCreate = () => {
    this.setState({
      showCreateUpdateModal: true,
      idToEditPelanggans: null
    })
  }

  onDelete = async(value) => {
    try{
      await pelangganApi.deleteById(value.ID_PELANGGAN)
      this.getPelanggan();
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
        idToEditPelanggans: null,
        showCreateUpdateModal: false
    })
}

  closeModalCreateUpdateAndRefreshTable = async() => {
    this.closeModalCreateUpdate()
    this.getPelanggan();
}
  render() {
    return (
      <View style={styles.container}>
        {this.state.showCreateUpdateModal && <ModalCreateUpdatePelanggan 
        show={this.state.showCreateUpdateModal} handleChange={(fieldname, value) => this.handleChange(fieldname,value)} 
        closeModalCreateUpdateAndRefreshTable={this.closeModalCreateUpdateAndRefreshTable}
        idToEditPelanggans={this.state.idToEditPelanggans}/>}
        <Button title='Create' onPress={this.onPressCreate}/>
        <Body pelanggan={this.state.pelanggan} handleChange={(field, value) => this.handleChange(field, value)} dialogDelete={this.dialogDelete}/>  
      </View>
    )
  }
}


class Body extends Component {
  onClickUpdate = async(value) =>{
    this.props.handleChange("idToEditPelanggans", value.ID_PELANGGAN)
   this.props.handleChange("showCreateUpdateModal", true)
}
  render() {
    const pelanggan = this.props.pelanggan !== [] ? this.props.pelanggan : []
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>No</DataTable.Title>
          <DataTable.Title>ID_Pelanggan</DataTable.Title>
          <DataTable.Title>Nama</DataTable.Title>
          <DataTable.Title>Domisili</DataTable.Title>
          <DataTable.Title>Jenis Kelamin</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
          <DataTable.Title></DataTable.Title>
        </DataTable.Header>
          {pelanggan.map((data, index)=>{
            return(
        <DataTable.Row key={data.ID_PELANGGAN}>
              <DataTable.Cell>{index+1}</DataTable.Cell>
              <DataTable.Cell>{data.ID_PELANGGAN}</DataTable.Cell>
              <DataTable.Cell>{data.NAMA}</DataTable.Cell>
              <DataTable.Cell>{data.DOMISILI}</DataTable.Cell>
              <DataTable.Cell>{data.JENIS_KELAMIN}</DataTable.Cell>
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