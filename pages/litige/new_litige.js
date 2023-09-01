/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Modal,
  Image,
  Appearance,
} from 'react-native';
import {boxShadow} from '../../helpers/box_shadow';
import {colors} from '../../helpers/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Header from './header';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {api_url} from '../../helpers/url';
import {Button, ChooseCamera} from '../../elements';
import {requestPermission, sendNotification} from '../../helpers/util';
import {styles} from '../../helpers/styles';

const colorScheme = Appearance.getColorScheme();

export default class NewLitige extends Component {
  state = {
    file: null,
    file_uri: null,
    choiceVisible: false,
    objet: '',
    pseudoVendeur: '',
    ref: '',
    message: '',
    loadingVisible: false,
    error_objet: false,
    error_pseudo: false,
    error_ref: false,
    error_message: false,
    success: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header navigation={this.props.navigation} />
          <View style={_styles.main_container}>
            <View style={[_styles.content, boxShadow.depth_2]}>
              <View style={[_styles.image_container, boxShadow.depth_10]}>
                <AntDesign
                  name="exclamationcircle"
                  size={48}
                  color={colors.secondary}
                />
              </View>
              <Text style={_styles.title}>Annoncer un litige</Text>
              <View style={_styles.input_container}>
                <TextInput
                  style={[
                    _styles.input,
                    this.state.error_objet ? {borderColor: colors.danger} : {},
                  ]}
                  onChangeText={value => this.setState({objet: value})}
                />
                <Text style={_styles.label}>Objet</Text>
              </View>
              <View style={_styles.input_container}>
                <Pressable
                  onPress={() =>
                    this.props.navigation.navigate('SelectOffre', {
                      idNotif: this.props.route.params.idNotif,
                    })
                  }>
                  <View pointerEvents="none">
                    <TextInput
                      style={[
                        _styles.input,
                        this.state.error_ref
                          ? {borderColor: colors.danger}
                          : {},
                      ]}
                      editable={false}
                      placeholder="Cliquer ici pour selectionner"
                      value={
                        this.props.route.params &&
                        this.props.route.params.selected
                          ? this.props.route.params.selected.reference
                          : null
                      }
                    />
                  </View>
                </Pressable>
                <Text style={_styles.label}>Ref transaction</Text>
              </View>
              <View style={_styles.input_container}>
                <TextInput
                  style={[
                    _styles.input,
                    this.state.error_pseudo ? {borderColor: colors.danger} : {},
                  ]}
                  editable={false}
                  value={
                    this.props.route.params && this.props.route.params.selected
                      ? this.props.route.params.selected.pseudo
                      : null
                  }
                />
                <Text style={_styles.label}>Pseudo du vendeur</Text>
              </View>
              <View style={[_styles.input_container, {height: 100}]}>
                <TextInput
                  multiline={true}
                  style={[
                    _styles.input,
                    {height: 100},
                    this.state.error_message
                      ? {borderColor: colors.danger}
                      : {},
                  ]}
                  onChangeText={value => this.setState({message: value})}
                />
                <Text style={_styles.label}>Votre message</Text>
              </View>
              {this.state.file ? (
                <View style={{width: '100%'}}>
                  <Image
                    source={{uri: this.state.file_uri}}
                    style={{width: 100, height: 100, marginBottom: 5}}
                  />
                </View>
              ) : null}
              <View style={{width: '100%', flexDirection: 'row'}}>
                <Pressable
                  style={_styles.add_pieceJointe}
                  onPress={() => this.setState({choiceVisible: true})}>
                  <AntDesign
                    name="paperclip"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={_styles.add_pieceJointe_text}>
                    Ajouter une pièce jointe
                  </Text>
                </Pressable>
              </View>
            </View>
            <Button
              bg={colors.primary}
              title="Envoyer"
              onPress={() => this.submit()}
              loading={this.state.loadingVisible}
              style={{marginTop: 20}}
            />
          </View>
        </ScrollView>
        <ChooseCamera
          show={this.state.choiceVisible}
          onCancel={() => this.setState({choiceVisible: false})}
          onCamera={() => this.openCamera()}
          onLibrary={() => this.openLibrary()}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.success}
          onRequestClose={() => {
            this.setState({success: !this.state.success});
          }}>
          <View style={[styles.wrapper, _styles.centeredView]}>
            <View style={[_styles.success_container, boxShadow.depth_10]}>
              <Feather name="check-circle" size={48} color={colors.success} />
              <Text style={_styles.success_title}>Information</Text>
              <Text style={[styles.text, _styles.success_message]}>
                Votre message a été envoyé avec succès {'\n'} nous allons vous
                répondre bientôt
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({success: false});
                  this.props.navigation.navigate('ServiceClient');
                }}
                activeOpacity={0.8}
                style={_styles.success_button}>
                <Text style={{fontSize: 18}}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  async openCamera() {
    this.setState({choiceVisible: false});
    let isCameraPermitted = await requestPermission.camera();
    let isStoragePermitted = await requestPermission.externalStorage();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera({mediaType: 'photo'}, response => {
        if (response.assets) {
          this.saveFileToState(response.assets[0]);
        }
      });
    }
  }
  openLibrary() {
    this.setState({choiceVisible: false});
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets) {
        this.saveFileToState(response.assets[0]);
      }
    });
  }
  saveFileToState(file) {
    let uri = file.uri;
    let type = file.type;
    let name = file.fileName;
    const data = new FormData();
    data.append('photo', {
      name: name,
      type: type,
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
    });
    this.setState({file: data, file_uri: uri});
  }
  submit() {
    let error = false;
    console.log(this.props.route.params);
    if (this.state.objet.trim().length === 0) {
      error = true;
      this.setState({error_objet: true});
    }
    if (this.props.route.params) {
      if (!this.props.route.params.selected) {
        error = true;
        this.setState({error_pseudo: true});
        this.setState({error_ref: true});
      }
    } else {
      error = true;
      this.setState({error_pseudo: true});
      this.setState({error_ref: true});
    }

    if (this.state.message.trim().length === 0) {
      error = true;
      this.setState({error_message: true});
    }

    if (error) {
      return false;
    }
    this.setState({loadingVisible: true});
    let data = this.state.file;
    if (!data) {
      data = new FormData();
    }
    data.append('objet', this.state.objet);
    data.append('idVendeur', this.props.route.params.selected.user_id);
    data.append('ref', this.props.route.params.selected.reference);
    data.append('message', this.state.message);
    data.append('idNotif', this.props.route.params.idNotif);
    axios
      .post(api_url('ServiceClient/add/litige'), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        console.log(res.data);
        sendNotification(this.props.route.params.selected.user_id);
        this.setState({success: true});
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({loadingVisible: false});
      });
  }
}

const _styles = StyleSheet.create({
  main_container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  content: {
    width: '100%',
    minHeight: 200,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    marginTop: -60,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  image_container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: -40,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Feather',
    fontSize: 22,
    color: colors.primary,
    marginTop: 5,
    marginBottom: 15,
  },
  input_container: {
    position: 'relative',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    textAlignVertical: 'center',
    paddingRight: 10,
    fontFamily: 'Feather',
    fontSize: 20,
    color: colorScheme === 'dark' ? colors.light : colors.dark,
  },
  label: {
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    paddingHorizontal: 10,
    position: 'absolute',
    top: -10,
    color: colors.primary,
    fontSize: 13,
    left: 30,
    fontFamily: 'Feather',
  },
  add_pieceJointe: {
    height: 35,
    borderColor: colors.secondary,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  add_pieceJointe_text: {
    fontFamily: 'Feather',
    color: colors.primary,
    marginLeft: 10,
  },
  /**
   * Modal success
   */
  success_container: {
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  success_title: {
    fontFamily: 'Feather',
    fontSize: 20,
    color: colors.success,
    marginTop: 5,
  },
  success_message: {
    fontFamily: 'Feather',
    fontSize: 17,
    textAlign: 'center',
  },
  success_button: {
    paddingHorizontal: 40,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    marginTop: 5,
  },
  centeredView: {
    alignItems: 'center',
  },
});
