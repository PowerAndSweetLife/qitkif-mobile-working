/* eslint-disable react-native/no-inline-styles */
import Icon from 'react-native-vector-icons/FontAwesome5';
import React, {Component} from 'react';
import {api_url} from '../helpers/url';
import axios from 'axios';
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import {Text} from '../helpers/my_components';
import {colors} from '../helpers/colors';
import {connect} from 'react-redux';
import {setIdRegister} from '../store/slices/register_slice';
import {styles} from '../helpers/styles';
import {Button} from '../elements';
import {CODE_PAYS} from '../helpers/util';

class Register extends Component {
  state = {
    checked: false,
    firstname: null,
    lastname: null,
    pseudo: null,
    email: null,
    phone: null,
    btnDisabled: false,
    errors: {
      firstname: false,
      lastname: false,
      pseudo: false,
      email: false,
      phone: false,
      accept: false,
    },
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView
          style={{paddingHorizontal: 20}}
          keyboardShouldPersistTaps="handled">
          <View style={_styles.logo_container}>
            <ImageBackground
              source={require('../assets/img/logo.png')}
              style={_styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={_styles.title}>S'inscrire</Text>
          <View style={_styles.form_container}>
            <View>
              <TextInput
                style={[
                  styles.input,
                  _styles.input,
                  this.state.errors.lastname ? styles.input_error : {},
                ]}
                placeholder="Prénom"
                onChangeText={value => this.setState({lastname: value})}
                onSubmitEditing={Keyboard.dismiss}
              />
              {this.state.errors.lastname ? (
                <Text style={styles.text_error}>
                  {this.state.errors.lastname}
                </Text>
              ) : null}
            </View>
            <View style={{marginTop: 15}}>
              <TextInput
                style={[
                  styles.input,
                  _styles.input,
                  this.state.errors.firstname ? styles.input_error : {},
                ]}
                placeholder="Nom"
                onChangeText={value => this.setState({firstname: value})}
              />
              {this.state.errors.firstname ? (
                <Text style={styles.text_error}>
                  {this.state.errors.firstname}
                </Text>
              ) : null}
            </View>
            <View style={{marginTop: 15}}>
              <TextInput
                style={[
                  styles.input,
                  _styles.input,
                  this.state.errors.pseudo ? styles.input_error : {},
                ]}
                placeholder="Pseudo"
                onChangeText={value => this.setState({pseudo: value})}
                s
              />
              {this.state.errors.pseudo ? (
                <Text style={styles.text_error}>
                  {this.state.errors.pseudo}
                </Text>
              ) : null}
            </View>
            <View style={{marginTop: 15}}>
              <TextInput
                style={[
                  styles.input,
                  _styles.input,
                  this.state.errors.email ? styles.input_error : {},
                ]}
                placeholder="Adresse e-mail"
                onChangeText={value => this.setState({email: value})}
              />

              {this.state.errors.email ? (
                <Text style={styles.text_error}>{this.state.errors.email}</Text>
              ) : null}
            </View>
            <View style={{marginTop: 15, flexDirection: 'row'}}>
              <Text
                style={[
                  _styles.input,
                  {
                    textAlignVertical: 'center',
                    borderWidth: 1,
                    color: colors.gray,
                  },
                ]}>
                {CODE_PAYS}
              </Text>
              <View style={{flex: 1, marginLeft: 10}}>
                <TextInput
                  style={[
                    styles.input,
                    _styles.input,
                    this.state.errors.phone ? styles.input_error : {},
                  ]}
                  placeholder="Téléphone"
                  onChangeText={value => this.setState({phone: value})}
                  keyboardType="decimal-pad"
                />
                {this.state.errors.phone ? (
                  <Text style={styles.text_error}>
                    {this.state.errors.phone}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={_styles.condition}>
              <TouchableOpacity
                style={[
                  _styles.checkbox,
                  this.state.errors.accept ? styles.input_error : {},
                ]}
                onPress={() => this.toggleCheck()}>
                {this.setCheckbox()}
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 10}}
                activeOpacity={0.8}
                onPress={() =>
                  this.props.navigation.navigate('Confidentialite')
                }>
                <View style={{flexDirection: 'row'}}>
                  <Text style={_styles.condition_text}>
                    Je déclare avoir lu et compris les{' '}
                  </Text>
                  <Text style={_styles.condition_link}>conditions </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={_styles.condition_link}>générales </Text>
                  <Text style={_styles.condition_text}>
                    d'utilisation ainsi que{' '}
                  </Text>
                  <Text style={_styles.condition_link}>la politique </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={_styles.condition_link}>
                    de confidentialité{' '}
                  </Text>
                  <Text style={_styles.condition_text}>et les accepter</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Button
              title="Suivant"
              onPress={() => this.submit()}
              loading={this.btnDisabled}
              bg={colors.primary}
              style={{marginTop: 10}}
            />
            <View style={_styles.footer}>
              <Text style={styles.text}>Vous avez déjà pas une compte ?</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('Login1')}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  Se connecter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
  setCheckbox() {
    if (this.state.checked) {
      return <Icon name="check" style={_styles.checkbox_icon} />;
    }
    return null;
  }
  toggleCheck() {
    this.setState({checked: !this.state.checked});
  }
  submit() {
    this.setState({btnDisabled: true});
    this.setState({axiosError: false, axiosErrorMessage: null});
    this.setState({
      errors: {
        firstname: false,
        lastname: false,
        pseudo: false,
        email: false,
        phone: false,
        accept: false,
      },
    });
    axios
      .post(
        api_url('register/stepOne'),
        {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          pseudo: this.state.pseudo,
          email: this.state.email,
          phone: this.state.phone,
          accept: this.state.checked,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        console.log(response.data);
        this.setState({btnDisabled: false});
        if (!response.data.success) {
          this.setState({errors: response.data.listErrors});
        } else {
          this.props.dispatch(setIdRegister(response.data.id));
          this.props.navigation.navigate('Register2');
        }
      })
      .catch(error => {
        this.setState({btnDisabled: false});
        this.setState({axiosError: true, axiosErrorMessage: error.message});
      });
  }
}

const _styles = StyleSheet.create({
  logo_container: {
    height: 75,
    marginVertical: 20,
  },
  logo: {
    flex: 1,
  },
  title: {
    fontWeight: '400',
    fontSize: 28,
    color: colors.secondary,
    textAlign: 'center',
    fontFamily: 'Feather',
  },
  form_container: {
    flex: 1,
    marginVertical: 20,
    paddingBottom: 20,
  },
  input: {
    borderColor: colors.secondary,
    height: 45,
    borderRadius: 10,
    marginTop: 3,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
  },
  condition: {
    flexDirection: 'row',
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox_icon: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  condition_text: {
    fontFamily: 'Feather',
    color: colors.gray,
    fontSize: 16,
  },
  condition_link: {
    fontFamily: 'Feather',
    color: colors.secondary,
    fontSize: 16,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  const {register} = state;
  return {register};
};

export default connect(mapStateToProps)(Register);
