/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {colors} from '../helpers/colors';
import {setUsername} from '../store/slices/login_slice';
import {Button, Input} from '../elements';
import {styles} from '../helpers/styles';
import {CODE_PAYS} from '../helpers/util';

class Login1 extends Component {
  state = {
    username: '',
    emptyUsername: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={_styles.logo_container}>
            <ImageBackground
              source={require('../assets/img/logo.png')}
              style={_styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={_styles.title}>Se connecter</Text>
          <View style={_styles.form_container}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.text, _styles.index_pays]}>{CODE_PAYS}</Text>
              <Input
                onKeyup={value => this.setState({username: value})}
                onSubmitEditing={() => this.loginNext()}
                keyboard="number-pad"
                placeholder="Votre numéro de téléphone"
                style={[
                  _styles.input,
                  this.state.emptyUsername ? {borderColor: colors.danger} : {},
                ]}
              />
            </View>
            <Button
              title="Suivant"
              onPress={() => this.loginNext()}
              bg={colors.primary}
              style={{marginTop: 15, borderRadius: 5}}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={_styles.register_link}>
                Cliquer ici pour s'inscrire
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
  loginNext() {
    if (this.state.username.length === 0) {
      this.setState({emptyUsername: true});
    } else {
      this.setState({emptyUsername: false});
      this.props.dispatch(setUsername(this.state.username));
      this.props.navigation.navigate('Login2');
    }
  }
}

const _styles = StyleSheet.create({
  logo_container: {
    height: 75,
    marginVertical: 40,
  },
  logo: {
    flex: 1,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Feather',
  },
  form_container: {
    flex: 1,
    marginVertical: 20,
    padding: 20,
  },
  index_pays: {
    width: 60,
    height: 45,
    borderWidth: 0.5,
    borderColor: colors.gray,
    marginRight: 5,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  input: {
    borderWidth: 0.5,
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: 'Feather',
    flex: 1,
  },
  register_link: {
    textAlign: 'right',
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.primary,
  },
});

const mapStateToProps = state => {
  const {login} = state;
  return {login};
};

export default connect(mapStateToProps)(Login1);
