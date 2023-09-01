/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  TextInput,
  Appearance,
} from 'react-native';
import {colors} from '../helpers/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import {api_url, public_url} from '../helpers/url';
import Header from './components/header';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {styles} from '../helpers/styles';
import {Button, ChooseCamera} from '../elements';
import {axiosConfig, CODE_PAYS, requestPermission} from '../helpers/util';

const colorScheme = Appearance.getColorScheme();

export default class EditProfil extends Component {
  state = {
    choiceVisible: false,
    profil: this.props.route.params.profil,
    firstname: this.props.route.params.profil.firstname,
    lastname: this.props.route.params.profil.lastname,
    pseudo: this.props.route.params.profil.pseudo,
    email: this.props.route.params.profil.email,
    contact: this.props.route.params.profil.phone.replace(CODE_PAYS, ''),
    errors: [],
    submitting: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="Editer mon profil" navigation={this.props.navigation} />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{flex: 1}}>
            <View style={_styles.photo_wrapper}>
              <View style={{position: 'relative'}}>
                <Image
                  source={
                    this.state.profil.photo
                      ? {
                          uri: public_url(
                            'images/profils/' + this.state.profil.photo,
                          ),
                        }
                      : {uri: public_url('images/avatar.png')}
                  }
                  style={_styles.photo}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={_styles.camera}
                  onPress={() => this.setState({choiceVisible: true})}>
                  <Entypo
                    name="camera"
                    size={28}
                    color={colorScheme === 'dark' ? colors.light : colors.dark}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={_styles.pseudo}>{this.state.profil.pseudo}</Text>
            <View style={_styles.main_container}>
              <View>
                <Text style={_styles.main_title}>Pseudo</Text>
                <TextInput
                  style={[
                    styles.input,
                    _styles.main_input,
                    this.state.errors.includes('pseudo')
                      ? {borderColor: colors.danger}
                      : {},
                  ]}
                  defaultValue={this.state.profil.pseudo}
                  onChangeText={value => this.setState({pseudo: value})}
                />
              </View>
              <View style={{marginTop: 10}}>
                <Text style={_styles.main_title}>Nom</Text>
                <TextInput
                  style={[
                    styles.input,
                    _styles.main_input,
                    this.state.errors.includes('firstname')
                      ? {borderColor: colors.danger}
                      : {},
                  ]}
                  defaultValue={this.state.profil.firstname}
                  onChangeText={value => this.setState({firstname: value})}
                />
              </View>
              <View style={{marginTop: 10}}>
                <Text style={_styles.main_title}>Prénoms</Text>
                <TextInput
                  style={[
                    styles.input,
                    _styles.main_input,
                    this.state.errors.includes('lastname')
                      ? {borderColor: colors.danger}
                      : {},
                  ]}
                  defaultValue={this.state.profil.lastname}
                  onChangeText={value => this.setState({lastname: value})}
                />
              </View>
              <View style={{marginTop: 10}}>
                <Text style={_styles.main_title}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    _styles.main_input,
                    this.state.errors.includes('email')
                      ? {borderColor: colors.danger}
                      : {},
                  ]}
                  defaultValue={this.state.profil.email}
                  onChangeText={value => this.setState({email: value})}
                />
              </View>
              <View style={{marginTop: 10}}>
                <Text style={_styles.main_title}>Contact</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.text, _styles.code_pays]}>
                    {CODE_PAYS}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      _styles.main_input,
                      this.state.errors.includes('contact')
                        ? {borderColor: colors.danger}
                        : {},
                    ]}
                    defaultValue={this.state.contact}
                    onChangeText={value => this.setState({contact: value})}
                  />
                </View>
              </View>
              <View style={{marginTop: 10}}>
                <Text style={_styles.main_title}>Code secret</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{flexDirection: 'row'}}
                  onPress={() => this.props.navigation.navigate('ChangeCode')}>
                  <Entypo name="lock" size={18} color={colors.secondary} />
                  <Text style={_styles.password_link}>
                    Changer mon code secret
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginVertical: 15}}>
                <Button
                  title="Enregistrer les modification"
                  onPress={() => this.submit()}
                  bg={colors.primary}
                  loading={this.state.submitting}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <ChooseCamera
          show={this.state.choiceVisible}
          onCancel={() => this.setState({choiceVisible: false})}
          onCamera={() => this.openCamera()}
          onLibrary={() => this.openLibrary()}
        />
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
          this.uploadPhoto(response.assets[0]);
        }
      });
    }
  }
  openLibrary() {
    this.setState({choiceVisible: false});
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets) {
        this.uploadPhoto(response.assets[0]);
      }
    });
  }
  uploadPhoto(file) {
    let uri = file.uri;
    let type = file.type;
    let name = file.fileName;
    const data = new FormData();
    data.append('photo', {
      name: name,
      type: type,
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
    });
    axios
      .post(api_url('user/changePhoto'), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        console.log(res.data);
        if (res.data.success) {
          this.setState({profil: res.data.user});
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  submit() {
    let inputErrors = [];
    if (this.state.pseudo.trim().length === 0) {
      inputErrors.push('pseudo');
    }
    if (this.state.firstname.trim().length === 0) {
      inputErrors.push('firstname');
    }
    if (this.state.lastname.trim().length === 0) {
      inputErrors.push('lastname');
    }
    // if (this.state.email.trim().length === 0) {
    //   inputErrors.push('email');
    // }
    if (this.state.contact.trim().length === 0) {
      inputErrors.push('contact');
    }
    if (inputErrors.length > 0) {
      this.setState({errors: inputErrors});
      return false;
    }
    this.setState({submitting: true});
    axios
      .post(
        api_url('user/update'),
        {
          pseudo: this.state.pseudo,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          email: this.state.email,
          contact: this.state.contact,
        },
        axiosConfig,
      )
      .then(response => {
        this.props.navigation.navigate('Profil', {
          me: true,
          updatedProfil: response.data.profil,
        });
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({submitting: false});
      });
  }
}

const _styles = StyleSheet.create({
  photo_wrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  camera: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  pseudo: {
    fontSize: 24,
    fontFamily: 'Feather',
    color: colors.gray,
    marginTop: 5,
    textAlign: 'center',
  },
  main_container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  main_title: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.gray,
  },
  main_input: {
    borderColor: colors.gray,
    borderRadius: 5,
    paddingHorizontal: 5,
    fontSize: 18,
  },
  password_link: {
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.secondary,
    marginLeft: 5,
  },
  code_pays: {
    width: 60,
    height: 55,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 5,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
  },
});
