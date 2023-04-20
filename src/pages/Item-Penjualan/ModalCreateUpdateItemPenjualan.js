import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { Component } from 'react'
import * as itemPenjualanApi from '../../apis/itemPenjualanApi';


export default class ModalCreateUpdateItemPenjualan extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        isCreate: true,
        Penjualans: [],
        isSubmitting: false,
        NOTA: "",
        QTY: "",
        KODE_BARANG: "",

    }
  }

  componentDidMount = async () => {
    try {
        const PenjualanResponse = this.props.idToEditItemPenjualans !== null ? itemPenjualanApi.getById(this.props.idToEditItemPenjualans) : null;
        const Penjualan = this.props.idToEditItemPenjualans !== null ? (await PenjualanResponse).data : null;
        
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
        KODE_BARANG: currentPenjualans.KODE_BARANG,
        NOTA: currentPenjualans.ID_NOTA,
        QTY: currentPenjualans.QTY,
        isLoading: false
    })
  }

  async handleSubmit(e) {
    let body = {}

    if (this.state.NOTA) {
        body.id = this.props.idToEditItemPenjualans
    }
    body.NOTA = this.state.NOTA;

    body.KODE_BARANG = this.state.KODE_BARANG;
    body.QTY = this.state.QTY;

    e.preventDefault();
    e.stopPropagation();

    this.setState({ isSubmitting: true, response: '' });
    try {
        await itemPenjualanApi.createOrUpdate(body);
        this.setState({
            isSubmitting: false,
        });
        this.props.closeModalCreateUpdateAndRefreshTable();
    } catch (e) {
        console.log(e)
    }
    this.setState({ isSubmitting: false });
  }

  render() {
    const {idToEditItemPenjualans, show, closeModalCreateUpdateAndRefreshTable, handleChange} = this.props
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
              <Text style={{alignItems:'center'}}>{!idToEditItemPenjualans ? "Create" : "Update"} Barang</Text>
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
            {idToEditItemPenjualans && 
            <View>
              <Text>ID (not editable)</Text>
              <TextInput
              placeholder="ID"
              style={styles.TextInput}
              value={idToEditBarangs.toString()}
              editable={false}
            />
            </View>}
            <Text>Kode Barang</Text>
              <TextInput
              placeholder="Kode Barang"
              style={styles.TextInput}
              value={this.state.KODE_BARANG?.toString()}
              onChangeText={(e) => {
                this.handleChange("KODE_BARANG",e)}}
              />
              <Text>Nota</Text>
              <TextInput
              placeholder="Nota"
              style={styles.TextInput}
              value={this.state.NOTA}
              onChangeText={(e) => {
                this.handleChange("NOTA",e)}}
              />
              <Text>Qty</Text>
              <TextInput
              placeholder="Qty"
              style={styles.TextInput}
              value={this.state.QTY?.toString()}
              onChangeText={(e) => {
                this.handleChange("QTY",e)}}
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