import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { Component } from 'react'
import * as pelangganApi from '../../apis/pelangganApi';


export default class ModalCreateUpdatePelanggan extends Component {
  constructor(props) {
    super(props);
    this.state = {
        JENIS_KELAMIN: '',
        isCreate: true,
        isSubmitting: false,
        DOMISILI: '',
        NAMA: "",
        ID_PELANGGAN: "",
        isLoading: true,

    }
  }

  componentDidMount = async () => {
    try {
        const PelangganResponse = this.props.idToEditPelanggans !== null ? pelangganApi.getById(this.props.idToEditPelanggans) : null;
        const Pelanggan = this.props.idToEditPelanggans !== null ? (await PelangganResponse).data : null;
        
        await this.setData(Pelanggan);

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

    const currentPelanggans = values ;
    this.setState({
        JENIS_KELAMIN: currentPelanggans.JENIS_KELAMIN,
        DOMISILI: currentPelanggans.DOMISILI,
        NAMA: currentPelanggans.NAMA,
        ID_PELANGGAN: currentPelanggans.ID_PELANGGAN,
        isLoading: false,
        isCreate: false,
    })
  }

  async handleSubmit(e) {
    let body = {}

    if (this.state.ID_PELANGGAN) {
        body.id = this.state.ID_PELANGGAN
    }
    body.NAMA = this.state.NAMA;

    body.DOMISILI = this.state.DOMISILI;
    body.JENIS_KELAMIN = this.state.JENIS_KELAMIN;


    this.setState({ isSubmitting: true, response: '' });
    try {
        await pelangganApi.createOrUpdate(body);
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
    const {idToEditPelanggans, show, closeModalCreateUpdateAndRefreshTable, handleChange} = this.props
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
              <Text style={{alignItems:'center'}}>{!idToEditPelanggans ? "Create" : "Update"} Pelanggan</Text>
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
            {idToEditPelanggans && 
            <View>
              <Text>ID Pelanggan (not editable)</Text>
              <TextInput
              placeholder="ID Pelanggan"
              style={styles.TextInput}
              value={this.state.ID_PELANGGAN.toString()}
              editable={false}
            />
            </View>}
            <Text>Nama</Text>
              <TextInput
              placeholder="Nama"
              style={styles.TextInput}
              value={this.state.NAMA}
              onChangeText={(e) => {
                this.handleChange("NAMA",e)}}
              />
              <Text>Domisili</Text>
              <TextInput
              placeholder="Domisili"
              style={styles.TextInput}
              value={this.state.DOMISILI}
              onChangeText={(e) => {
                this.handleChange("DOMISILI",e)}}
              />
              <Text>Jenis Kelamin</Text>
              <TextInput
              placeholder="Jenis Kelamin"
              style={styles.TextInput}
              value={this.state.JENIS_KELAMIN}
              onChangeText={(e) => {
                this.handleChange("JENIS_KELAMIN",e)}}
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

// const styles =  StyleSheet.create({
//     container: {
//         // flex: 1,
//         // backgroundColor: '#fff'
//         justifyContent:'center',
//         alignItems:'center'
//     }
// })
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