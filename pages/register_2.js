/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../helpers/colors';
import axios from 'axios';
import {connect} from 'react-redux';
import {api_url} from '../helpers/url';
import {Keypad} from '../elements';
import {styles} from '../helpers/styles';
import {axiosConfig} from '../helpers/util';

class Register2 extends Component {
  state = {
    codeError: false,
    btnDisabled: false,
    submitted: false,
  };
  setCodeError() {
    if (this.state.codeError) {
      return <Text style={styles.text_error}>Code incorrect !</Text>;
    }
    return null;
  }
  render() {
    return (
      <View style={[styles.wrapper, _styles.wrapper]}>
        <Text style={_styles.title}>Confirmation !</Text>
        <Text style={_styles.subtitle}>
          Nous avons envoyé un code de 4 chiffres à votre numéro de téléphone,
          mettez le ici
        </Text>
        <View style={{marginVertical: 15}}>
          <Keypad
            onSubmit={(code, reset) => this.submit(code, reset)}
            loading={this.state.submitted}
          />
        </View>
        {this.setCodeError()}
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Text style={[styles.text, {fontSize: 14}]}>
            Vous n'avez pas reçu le code ?
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => this.regenerateCode()}
            disabled={this.state.btnDisabled ? true : false}
            style={{marginLeft: 10}}>
            {this.setLoading()}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  regenerateCode() {
    this.setState({btnDisabled: true});
    axios
      .post(
        api_url('register/regenerateNumero'),
        {
          id: this.props.register.id,
        },
        axiosConfig,
      )
      .then(response => {
        this.setState({btnDisabled: false});
      })
      .catch(error => {
        this.setState({btnDisabled: false});
      });
  }
  setLoading() {
    if (this.state.btnDisabled) {
      return <ActivityIndicator size="small" color={colors.secondary} />;
    }
    return <Text style={_styles.forgot_link}>Renvoyer le code</Text>;
  }
  submit(code, reset) {
    this.setState({codeError: false, submitted: true});
    axios
      .post(
        api_url('register/stepTwo'),
        {
          code: code,
          id: this.props.register.id,
        },
        axiosConfig,
      )
      .then(response => {
        this.setState({submitted: false});
        if (!response.data.success) {
          reset();
          this.setState({codeError: true});
        } else {
          this.props.navigation.navigate('Register3');
        }
      })
      .catch(error => {
        this.setState({submitted: false});
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
  forgot_link: {
    textAlign: 'center',
    fontFamily: 'Feather',
    color: colors.secondary,
  },
});

const mapStateToProps = state => {
  const {register} = state;
  return {register};
};

export default connect(mapStateToProps)(Register2);
