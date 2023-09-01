/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../helpers/colors';
import {styles} from '../helpers/styles';
import axios from 'axios';
import {api_url} from '../helpers/url';
import {axiosConfig} from '../helpers/util';

export default class ForgotCode extends Component {
  state = {
    loading: false,
    message: false,
  };
  render() {
    return (
      <View style={{marginTop: 20, alignItems: 'center'}}>
        {this.setMessage()}
        <TouchableOpacity
          activeOpacity={0.8}
          style={{flexDirection: 'row'}}
          disabled={this.state.loading}
          onPress={() => this.submit()}>
          {this.setLoading()}
          <Text style={[styles.text, _styles.forgot_link]}>Code oublié ?</Text>
        </TouchableOpacity>
      </View>
    );
  }
  setLoading() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          style={{marginRight: 5}}
          size="small"
          color={colors.secondary}
        />
      );
    }
  }
  setMessage() {
    if (this.state.message) {
      return (
        <Text style={[styles.text, {textAlign: 'center'}]}>
          {this.state.message}
        </Text>
      );
    }
    return null;
  }
  submit() {
    this.setState({
      loading: true,
      message: false,
    });
    if (this.props.username) {
      axios
        .post(
          api_url('login/resetCode'),
          {username: this.props.username},
          axiosConfig,
        )
        .then(response => {
          if (response.data.success) {
            this.setState({
              message:
                'Code reinitialisé \n Votre nouveau code a été envoyé par SMS sur votre numéro',
            });
          } else {
            this.setState({
              message: response.data.error,
            });
          }
          this.setState({
            loading: false,
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      axios.get(api_url('user/resetCode')).then(response => {
        this.setState({
          message:
            'Code reinitialisé \n Votre nouveau code a été envoyé par SMS sur votre numéro',
          loading: false,
        });
      });
    }
  }
}

const _styles = StyleSheet.create({
  forgot_link: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.secondary,
  },
});
