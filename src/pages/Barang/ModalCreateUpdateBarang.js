import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import * as BarangsApi from '../../apis/barangApi';


export default class ModalCreateUpdateBarang extends Component {
  constructor(props) {
    super(props);
        this.state = {
            isLoading: true,
            isCreate: true,
            isSubmitting: false,
            KODE: "",
            NAMA: "",
            KATEGORI: "",
            HARGA: ""
        }
  }
    componentDidMount = async () => {
        try {
            const BarangResponse = this.props.idToEditBarangs !== null ? BarangsApi.getById(this.props.idToEditBarangs) : null;
            const Barang = this.props.idToEditBarangs !== null ? (await BarangResponse).data : null;
            
            await this.setData(Barang);

        } catch (e) {
            this.setState({
                isLoading: false,
                isError: true
            })
            console.error(e);
        }
    }

    handleChange = (field, value) => {
        this.setState({
          [field]: value
        })
    }

    setData = async(values) => {
        if (!values) {
            this.setState({
                isLoading: false
            })
            return;
        }

        this.setState({
            isCreate: false,
            KODE: values.KODE ,
            NAMA: values.NAMA,
            KATEGORI: values.KATEGORI,
            HARGA: values.HARGA,
            isLoading: false,
        })
    }
    async handleSubmit(e) {
      let body = {}

      if (this.state.KODE) {
          body.KODE = this.state.KODE
      }
      body.NAMA = this.state.NAMA;

      body.KATEGORI = this.state.KATEGORI;
      body.HARGA = this.state.HARGA;

      this.setState({ isSubmitting: true, response: '' });
      try {
          await BarangsApi.createOrUpdate(body);
          this.setState({
              isSubmitting: false,
          });
      } catch (e) {
          console.log(e)
      }
      this.setState({ isSubmitting: false });
  }
  render() {
    const {idToEditBarangs, show, closeModalCreateUpdateAndRefreshTable, handleChange} = this.props
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
              <Text style={{alignItems:'center'}}>{!idToEditBarangs ? "Create" : "Update"} Barang</Text>
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
            {idToEditBarangs && 
            <View>
              <Text>KODE (not editable)</Text>
              <TextInput
              placeholder="Kode"
              style={styles.TextInput}
              value={idToEditBarangs.toString()}
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
              <Text>Kategori</Text>
              <TextInput
              placeholder="Kategori"
              style={styles.TextInput}
              value={this.state.KATEGORI}
              onChangeText={(e) => {
                this.handleChange("KATEGORI",e)}}
              />
              <Text>HARGA</Text>
              <TextInput
              placeholder="Harga"
              style={styles.TextInput}
              value={this.state.HARGA?.toString()}
              onChangeText={(e) => {
                this.handleChange("HARGA",e)}}
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