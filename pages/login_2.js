/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {colors} from '../helpers/colors';
import {connect} from 'react-redux';
import {api_url} from '../helpers/url';
import axios from 'axios';
import {setId, setPseudo} from '../store/slices/logged_slice';
import {styles} from '../helpers/styles';
import {ForgotCode, Keypad} from '../elements';
import {axiosConfig, CODE_PAYS} from '../helpers/util';
import QTWebsocket from '../helpers/websocket';

class Login2 extends Component {
  state = {
    btnDisabled: false,
    errorLogin: false,
  };
  render() {
    return (
      <View style={[styles.wrapper, _styles.wrapper]}>
        <Text style={[styles.text, _styles.title]}>Bienvenue !</Text>
        <Text style={[styles.text, {fontSize: 18}]}>
          {CODE_PAYS + this.props.login.username}
        </Text>
        <Text style={[styles.text, _styles.subtitle]}>
          Saisissez votre code ici
        </Text>
        <View style={{marginVertical: 15}}>
          <Keypad
            onSubmit={(code, reset) => this.loginNext(code, reset)}
            loading={this.state.btnDisabled}
          />
        </View>
        {this.setError()}
        <ForgotCode username={this.props.login.username} />
      </View>
    );
  }
  setLoader() {
    if (this.state.btnDisabled) {
      return (
        <ActivityIndicator
          size="small"
          color={colors.light}
          style={{marginRight: 10}}
        />
      );
    }
    return null;
  }
  setError() {
    if (this.state.errorLogin) {
      return (
        <Text
          style={{marginTop: 10, color: colors.danger, fontFamily: 'Feather'}}>
          Identifiant ou code incorrect!
        </Text>
      );
    }
  }
  loginNext(code, reset) {
    this.setState({errorLogin: false, btnDisabled: true});
    axios
      .post(
        api_url('login'),
        {
          code: code,
          username: this.props.login.username,
        },
        axiosConfig,
      )
      .then(response => {
        this.setState({btnDisabled: false});
        if (!response.data.success) {
          this.setState({errorLogin: true, code: ''});
          reset();
        } else {
          this.props.dispatch(setPseudo(response.data.pseudo));
          this.props.dispatch(setId(response.data.id));

          if (!this.props.connection.socket) {
            QTWebsocket.initialize();
          }

          this.props.navigation.navigate('Home', {time: Date.now()});
        }
      })
      .catch(error => {
        this.setState({btnDisabled: false});
        //this.setState({axiosError: true, axiosErrorMessage: error.message});
      })
      .finally(() => {
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
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 18,
    color: colors.secondary,
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const {login, connection, logged} = state;
  return {login, connection, logged};
};

export default connect(mapStateToProps)(Login2);
