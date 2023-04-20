import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import * as PenjualansApi from '../../apis/penjualanApi';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';


export default class ModalCreateUpdatePenjualan extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        isCreate: true,
        Penjualans: [],
        isSubmitting: false,
        TANGGAL: "",
        NOTA: "",
        KODE_PELANGGAN: "",
        SUBTOTAL: "",
        // Penjualan Penjualan properties

    }
  }
  componentDidMount = async () => {
    try {
        const PenjualanResponse = this.props.idToEditPenjualans !== null ? PenjualansApi.getById(this.props.idToEditPenjualans) : null;
        const Penjualan = this.props.idToEditPenjualans !== null ? (await PenjualanResponse).data : null;
        await this.setData(Penjualan);
    } catch (e) {
        this.setState({
            isLoading: false,
            isError: true
        })
        console.error(e);
    }
  }
  setData = async(values) => {
      if (!values) {
          this.setState({
              isLoading: false
          })
          return;
      }
      const currentPenjualans = values
      this.setState({
          isCreate: false,
          TANGGAL: currentPenjualans.TGL,
          SUBTOTAL: currentPenjualans.SUBTOTAL,
          NOTA: currentPenjualans.ID_NOTA,
          KODE_PELANGGAN: currentPenjualans.KODE_PELANGGAN,
          isLoading: false
      })
  }

  async handleSubmit(e) {
    let body = {}

    if (this.state.NOTA) {
        body.ID_NOTA = this.state.NOTA
    }
    body.TGL = this.state.TANGGAL;

    body.KODE_PELANGGAN = this.state.KODE_PELANGGAN;
    body.SUBTOTAL = this.state.SUBTOTAL;

    this.setState({ isSubmitting: true, response: '' });
    try {
        await PenjualansApi.createOrUpdate(body);
        this.setState({
            isSubmitting: false,
        });
        this.props.closeModalCreateUpdateAndRefreshTable();
    } catch (e) {
        console.log(e)
    }
    this.setState({ isSubmitting: false });
  }
  
  handleChange = (fieldname, value) => {
    this.setState({
      [fieldname]: value
    })
  }

  render() {
    const {idToEditPenjualans,show, closeModalCreateUpdateAndRefreshTable, handleChange} = this.props
    const tanggal = moment(this.state.TANGGAL).toDate()
    return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onDismiss={closeModalCreateUpdateAndRefreshTable}
      >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{flex: 1}}></View>
            <View style={{flex:1}}>
              <Text style={{alignItems:'center'}}>{!idToEditPenjualans ? "Create" : "Update"} Penjualan</Text>
            </View>
            <View style={{flex:1}}>
              <Pressable
                style={{ alignSelf:'flex-end'}}
                onPress={() =>handleChange("showCreateUpdateModal", false)}>
                <Text >X</Text>
              </Pressable>
            </View>
          </View>
          <View>
            {idToEditPenjualans && 
            <View>
              <Text>ID Nota (not editable)</Text>
              <TextInput
              placeholder="ID Nota"
              style={styles.TextInput}
              value={idToEditPenjualans.toString()}
              editable={false}
            />
            </View>}
              <Text>Tanggal</Text>
              <RNDateTimePicker
              value={new Date(moment(this.state.TANGGAL).toISOString())}
              dateFormat="d MMM yyyy"
              onConfirm={(date)=>handleChange("TANGGAL", date)}
              mode='date'
              />
              <Text>Kode Pelanggan</Text>
              <TextInput
              placeholder="Kode Pelanggan"
              style={styles.TextInput}
              value={this.state.KODE_PELANGGAN?.toString()}
              onChangeText={(e) => {
                this.handleChange("KODE_PELANGGAN",e)}}
              />
              <Text>Subtotal</Text>
              <TextInput
              placeholder="Subtotal"
              style={styles.TextInput}
              value={this.state.SUBTOTAL?.toString()}
              onChangeText={(e) => {
                this.handleChange("SUBTOTAL",e)}}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() =>this.handleSubmit()}>
                <Text style={{color: '#fff', alignSelf:'center'}}>Submit</Text>
              </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    )
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  submit:{
    alignItems:'center'
  },
  button: {
    alignSelf:'center',
    margin:40,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    alignSelf:'center',
    flex: 1, 
    paddingLeft: 10
  },
  TextInput: {
    height: 40,
    // margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    flex:1,
    marginBottom: 15,
    textAlign: 'center',

  },
});