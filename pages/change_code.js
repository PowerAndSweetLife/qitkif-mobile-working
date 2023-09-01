/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import {colors} from '../helpers/colors';
import axios from 'axios';
import Header from './components/header';
import {api_url} from '../helpers/url';
import {styles} from '../helpers/styles';
import {Button} from '../elements';

export default class ChangeCode extends Component {
  state = {
    newCode: '',
    confirmCode: '',
    code: '',
    errors: [],
    errorMessage: null,
    submitting: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="Changer le code" navigation={this.props.navigation} />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={_styles.main_container}>
            <View>
              <Text style={_styles.error_message}>
                {this.state.errorMessage}
              </Text>
              <Text style={_styles.label}>Nouveau code</Text>
              <TextInput
                style={[
                  styles.input,
                  _styles.input,
                  this.state.errors.includes('new')
                    ? {borderColor: colors.danger}
                    : {},
                ]}
                maxLength={4}
                keyboardType="decimal-pad"
                value={this.state.newCode}
                onChangeText={value => this.setValue(value, 'new')}
                secureTextEntry={true}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={_styles.label}>Retapez le code</Text>
              <TextInput
                style={[
                  styles.input,
                  _styles.input,
                  this.state.errors.includes('confirm')
                    ? {borderColor: colors.danger}
                    : {},
                ]}
                maxLength={4}
                keyboardType="decimal-pad"
                value={this.state.confirmCode}
                onChangeText={value => this.setValue(value, 'confirm')}
                secureTextEntry={true}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={_styles.label}>Votre code actuelle</Text>
              <TextInput
                style={[
                  styles.input,
                  _styles.input,
                  this.state.errors.includes('code')
                    ? {borderColor: colors.danger}
                    : {},
                ]}
                maxLength={4}
                keyboardType="decimal-pad"
                value={this.state.code}
                onChangeText={value => this.setValue(value, 'code')}
                secureTextEntry={true}
              />
            </View>
            <View style={{marginVertical: 15}}>
              <Button
                title="Enregistrer les modifications"
                bg={colors.primary}
                onPress={() => this.submit()}
                loading={this.state.submitting}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
  setValue(value, fieldName) {
    let newText = '';
    let numbers = '0123456789';

    for (let i = 0; i < value.length; i++) {
      if (numbers.indexOf(value[i]) > -1) {
        newText = newText + value[i];
      }
    }
    if (fieldName === 'confirm') {
      this.setState({confirmCode: newText});
    } else if (fieldName === 'new') {
      this.setState({newCode: newText});
    } else if (fieldName === 'code') {
      this.setState({code: newText});
    }
  }
  submit() {
    let fieldsErrors = [];
    this.setState({errorMessage: null, errors: []});
    if (this.state.newCode.trim().length === 0) {
      fieldsErrors.push('new');
    }
    if (this.state.confirmCode.trim().length === 0) {
      fieldsErrors.push('confirm');
    }
    if (this.state.code.trim().length === 0) {
      fieldsErrors.push('code');
    }
    if (fieldsErrors.length > 0) {
      this.setState({
        errorMessage: 'Tous les champs sont obligatoire !',
        errors: fieldsErrors,
      });
      return false;
    }
    if (this.state.newCode !== this.state.confirmCode) {
      this.setState({
        errorMessage: 'Les deux codes sont differents !',
        errors: ['new', 'confirm'],
      });
      return false;
    }
    this.setState({submitting: true});
    axios
      .post(
        api_url('user/changeCode'),
        {
          newCode: this.state.newCode,
          code: this.state.code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        if (response.data.success) {
          this.props.navigation.navigate('Profil', {me: true});
        } else {
          this.setState({
            errorMessage: 'Code incorrect !',
            errors: ['code'],
          });
        }
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
  main_container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.gray,
  },
  input: {
    width: '100%',
    borderColor: colors.gray,
    borderRadius: 5,
    paddingHorizontal: 5,
    fontSize: 18,
  },
  error_message: {
    color: colors.danger,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Feather',
  },
});
