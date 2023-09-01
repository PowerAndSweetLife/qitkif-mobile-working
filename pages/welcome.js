/* eslint-disable react-native/no-inline-styles */
import Feather from 'react-native-vector-icons/Feather';
import React, {Component} from 'react';
import {
  Appearance,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '../helpers/colors';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {api_url} from '../helpers/url';
import {connect} from 'react-redux';
import {setId, setPseudo} from '../store/slices/logged_slice';
import {styles} from '../helpers/styles';
import {Button} from '../elements';

const colorScheme = Appearance.getColorScheme();

class Welcome extends Component {
  state = {
    accessInternet: true,
    loading: null,
    lastAction: null,
  };
  render() {
    // let now = new Date().getTime();
    // let dlimit = new Date('2023-06-30').getTime();
    // if (now > dlimit) {
    //   return (
    //     <View
    //       style={[
    //         styles.wrapper,
    //         {justifyContent: 'center', alignItems: 'center'},
    //       ]}>
    //       <Text>Periode d'essai expiré</Text>
    //       <Text>Contacter le developpeur</Text>
    //     </View>
    //   );
    // }

    return (
      <View style={[styles.wrapper, _styles.wrapper]}>
        <View style={{width: '100%'}}>
          <Text style={[styles.text, _styles.welcome]}>Bienvenue sur</Text>
          <View style={_styles.logo_container}>
            <ImageBackground
              source={require('../assets/img/logo.png')}
              style={_styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.text, _styles.welcome, {fontSize: 20}]}>
            Sécuriser vos achats et ventes
          </Text>
        </View>
        <View style={{position: 'relative'}}>{this.setContent()}</View>
      </View>
    );
  }
  setContent() {
    if (this.state.accessInternet) {
      return (
        <View style={{marginTop: 15}}>
          <Button
            title="Se connecter"
            bg={colors.primary}
            onPress={() => this.login()}
            loading={this.state.loading === 'login'}
            disabled={this.state.loading !== null}
          />
          <Button
            title="S'inscrire"
            bg={colors.secondary}
            onPress={() => this.register()}
            loading={this.state.loading === 'register'}
            disabled={this.state.loading !== null}
            style={{marginTop: 15}}
          />
        </View>
      );
    }
    return (
      <View style={{alignItems: 'center', marginTop: 35}}>
        <Feather name="wifi-off" size={48} color={colors.gray} />
        <Text style={{marginVertical: 10, fontSize: 16, color: colors.gray}}>
          Verifiez votre connexion internet
        </Text>
        <View style={{marginTop: 10, width: '100%'}}>
          <Button
            title="Actualiser"
            bg={colors.gray}
            onPress={() => this.refresh()}
            loading={this.state.loading !== null}
            disabled={this.state.loading !== null}
          />
        </View>
      </View>
    );
  }
  login() {
    this.setState({loading: 'login', lastAction: 'login'});
    NetInfo.fetch().then(state => {
      if (state.isConnected && state.isInternetReachable) {
        axios
          .get(api_url('user/profil'))
          .then(res => {
            this.props.dispatch(setId(res.data.profil.id));
            this.props.dispatch(setPseudo(res.data.profil.pseudo));
            this.props.navigation.navigate('Home');
            this.setState({loading: null, accessInternet: true});
          })
          .catch(err => {
            if (err.code === 'ERR_NETWORK') {
              this.setState({accessInternet: false, loading: null});
              return false;
            }
            if (err.response.status === 403) {
              this.props.navigation.navigate('Login1');
              this.setState({loading: null});
            }
          });
      } else {
        this.setState({accessInternet: false, loading: null});
      }
    });
  }
  register() {
    this.setState({loading: 'register', lastAction: 'register'});
    NetInfo.fetch().then(state => {
      if (state.isConnected && state.isInternetReachable) {
        axios
          .get(api_url('register'))
          .then(res => {
            if (res.data.success) {
              this.props.navigation.navigate('Register');
              this.setState({loading: null, accessInternet: true});
            }
          })
          .catch(err => {
            if (err.code === 'ERR_NETWORK') {
              this.setState({accessInternet: false, loading: null});
              return false;
            }
          });
      } else {
        this.setState({accessInternet: false, loading: null});
      }
    });
  }
  refresh() {
    this.setState({loading: 'refresh'});
    if (this.state.lastAction === 'login') {
      this.login();
    } else if (this.state.lastAction === 'register') {
      this.register();
    }
  }
}

const _styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    textAlign: 'center',
    fontSize: 28,
    color: colors.primary,
  },
  logo_container: {
    width: '100%',
    height: 75,
    marginVertical: 5,
  },
  logo: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 500,
    alignItems: 'center',
    width: '100%',
    backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light,
    zIndex: 2,
  },
});

const mapStateToProps = state => {
  const {logged} = state;
  return {logged};
};

export default connect(mapStateToProps)(Welcome);
