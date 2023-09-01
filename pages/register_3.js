/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {colors} from '../helpers/colors';
import axios from 'axios';
import {connect} from 'react-redux';
import {api_url} from '../helpers/url';
import {styles} from '../helpers/styles';
import {Keypad} from '../elements';
import {axiosConfig} from '../helpers/util';

class Register3 extends Component {
  state = {
    codeError: false,
    btnDisabled: false,
  };
  setCodeError() {
    if (this.state.codeError) {
      return (
        <Text style={styles.text_error}>
          Veuillez remplir tous les champs !
        </Text>
      );
    }
    return null;
  }
  render() {
    return (
      <View style={[styles.wrapper, _styles.wrapper]}>
        <Text style={_styles.title}>Parfait !</Text>
        <Text style={_styles.subtitle}>Créer maintenant votre code</Text>
        {this.setCodeError()}
        <View style={{marginVertical: 15}}>
          <Keypad
            onSubmit={(code, reset) => this.submit(code, reset)}
            loading={this.props.btnDisabled}
          />
        </View>
      </View>
    );
  }
  submit(code, reset) {
    this.setState({codeError: false});
    if (code.length < 4) {
      this.setState({codeError: true});
      return;
    }
    this.setState({codeError: false, btnDisabled: true});
    axios
      .post(
        api_url('register/stepThree'),
        {
          code: code,
          id: this.props.register.id,
        },
        axiosConfig,
      )
      .then(response => {
        this.setState({btnDisabled: false});
        if (!response.data.success) {
          reset();
          this.setState({codeError: true});
        } else {
          this.props.navigation.navigate('Register4');
        }
      })
      .catch(error => {
        this.setState({btnDisabled: false});
      });
  }
}

const _styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontWeight: '400',
    fontSize: 28,
    color: colors.primary,
    textAlign: 'center',
    fontFamily: 'Feather',
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 20,
    color: colors.secondary,
    textAlign: 'center',
    fontFamily: 'Feather',
  },
});

const mapStateToProps = state => {
  const {register} = state;
  return {register};
};

export default connect(mapStateToProps)(Register3);
