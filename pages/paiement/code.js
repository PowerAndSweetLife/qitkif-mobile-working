/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Appearance,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {api_url} from '../../helpers/url';
import {styles} from '../../helpers/styles';
import {Button, ForgotCode} from '../../elements';
import {getUnreadMessage, sendNotification} from '../../helpers/util';

const colorScheme = Appearance.getColorScheme();

class Code extends Component {
  state = {
    first: null,
    second: null,
    third: null,
    fourth: null,
    n_of_key: 0,
    passwordError: false,
    loadingVisible: false,
    paiementError: null,
  };
  getKeyboard(value) {
    if (value >= 0) {
      switch (this.state.n_of_key) {
        case 0:
          this.setState({first: value});
          this.setState({n_of_key: this.state.n_of_key + 1});
          break;
        case 1:
          this.setState({second: value});
          this.setState({n_of_key: this.state.n_of_key + 1});
          break;
        case 2:
          this.setState({third: value});
          this.setState({n_of_key: this.state.n_of_key + 1});
          break;
        case 3:
          this.setState({fourth: value});
          this.setState({n_of_key: this.state.n_of_key + 1});
          break;
        default:
          break;
      }
    } else {
      switch (this.state.n_of_key) {
        case 1:
          this.setState({first: null});
          break;
        case 2:
          this.setState({second: null});
          break;
        case 3:
          this.setState({third: null});
          break;
        case 4:
          this.setState({fourth: null});
          break;
        default:
          break;
      }
      if (this.state.n_of_key > 0) {
        this.setState({n_of_key: this.state.n_of_key - 1});
      }
    }
  }
  render() {
    return (
      <View style={styles.wrapper}>
        <View style={[_styles.banner, boxShadow.depth_2]}>
          <Fontisto
            name="locked"
            size={32}
            color={colors.gray}
            style={[_styles.lock, boxShadow.depth_10]}
          />
          <Text style={_styles.banner_title}>Saisissez votre code secret</Text>
          <View style={_styles.input_container}>
            <Text style={_styles.input_item}>
              {this.state.first !== null ? '*' : null}
            </Text>
            <Text style={_styles.input_item}>
              {this.state.second !== null ? '*' : null}
            </Text>
            <Text style={_styles.input_item}>
              {this.state.third !== null ? '*' : null}
            </Text>
            <Text style={_styles.input_item}>
              {this.state.fourth !== null ? '*' : null}
            </Text>
          </View>
          {this.setPasswordError()}
          <ForgotCode />
        </View>
        <View>
          <View style={_styles.key_container}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(1)}>
              <Text style={_styles.key_item}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(2)}>
              <Text style={_styles.key_item}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(3)}>
              <Text style={_styles.key_item}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(4)}>
              <Text style={_styles.key_item}>4</Text>
            </TouchableOpacity>
          </View>
          <View style={_styles.key_container}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(5)}>
              <Text style={_styles.key_item}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(6)}>
              <Text style={_styles.key_item}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(7)}>
              <Text style={_styles.key_item}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(8)}>
              <Text style={_styles.key_item}>8</Text>
            </TouchableOpacity>
          </View>
          <View style={_styles.key_container}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(9)}>
              <Text style={_styles.key_item}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(0)}>
              <Text style={_styles.key_item}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(-1)}>
              <Text style={_styles.key_item}>
                <Feather name="delete" style={{fontSize: 42}} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.setPaiementError()}
        <View style={{paddingHorizontal: 20, marginTop: 20}}>
          <Button
            title="Envoyer"
            bg={colors.primary}
            onPress={() => this.submit()}
            loading={this.state.loadingVisible}
          />
        </View>
      </View>
    );
  }
  setPasswordError() {
    if (this.state.passwordError) {
      return <Text style={_styles.error}>Code incorrect !</Text>;
    }
    return null;
  }
  setPaiementError() {
    if (this.state.paiementError) {
      return (
        <View>
          <Text style={_styles.paiement_error}>{this.state.paiementError}</Text>
        </View>
      );
    }
    return null;
  }
  submit() {
    this.setState({
      passwordError: false,
      paiementError: null,
      loadingVisible: true,
    });
    axios
      .post(
        api_url('paiement/run'),
        {
          code:
            this.state.first +
            '' +
            this.state.second +
            '' +
            this.state.third +
            '' +
            this.state.fourth,
          idNumero: this.props.route.params.idNumero,
          montant: this.props.route.params.montant,
          frais: this.props.route.params.fraisOperateur,
          // timbre: TIMBRE_ETAT,
          commission: this.props.route.params.commission,
          idOffre: this.props.route.params.data.offre.id,
          idNotif: this.props.route.params.data.id,
          idClient: this.props.route.params.data.client.id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        if (response.data.success) {
          ToastAndroid.show('Paiement effectué avec succès', ToastAndroid.LONG);
          sendNotification(this.props.route.params.data.client.id);
          //getUnreadMessage();
          this.props.navigation.navigate('Home');
        } else {
          console.log(response.data);
          if (response.data.passwordError) {
            this.setState({
              passwordError: true,
              loadingVisible: false,
              first: null,
              second: null,
              third: null,
              fourth: null,
              n_of_key: 0,
            });
          } else {
            if (response.data.nopending) {
              this.setState({
                paiementError: response.data.transaction.statusMessage,
              });
            } else {
              switch (response.data.transaction.statusCode) {
                case 400:
                  this.setState({
                    paiementError:
                      'Données incorrectes saisies dans la demande',
                  });
                  break;
                case 401:
                  this.setState({
                    paiementError: 'Paramètres non complets',
                  });
                  break;
                case 402:
                  this.setState({
                    paiementError:
                      "Le numéro de téléphone de paiement n'est pas correct",
                  });
                  break;
                case 403:
                  this.setState({
                    paiementError:
                      "Le numéro de téléphone du dépôt n'est pas correct",
                  });
                  break;
                case 404:
                  this.setState({
                    paiementError:
                      "Délai d'expiration dans USSD PUSH/Annulation dans USSD PUSH",
                  });
                  break;
                case 406:
                  this.setState({
                    paiementError:
                      "Le numéro de téléphone de paiement obtenu n'est pas pour le portefeuille d'argent mobile",
                  });
                  break;
                case 460:
                  this.setState({
                    paiementError:
                      'Le solde du compte de paiement du payeur est faible',
                  });
                  break;
                case 461:
                  this.setState({
                    paiementError: "Une erreur s'est produite lors du paiement",
                  });
                  break;
                case 462:
                  this.setState({
                    paiementError:
                      "Ce type de transaction n'est pas encore pris en charge, processeur introuvable",
                  });
                  break;
                case 500:
                  this.setState({
                    paiementError: response.data.transaction.statusMessage,
                  });
                  break;
                default:
                  break;
              }
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({loadingVisible: false});
      });
  }
}

const _styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginTop: 40,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    minHeight: 150,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  banner_title: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.primary,
    marginTop: 20,
  },
  lock: {
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: -30,
  },
  input_container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input_item: {
    width: 50,
    height: 50,
    borderWidth: 1,
    marginRight: 10,
    borderColor: colors.secondary,
    marginTop: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 28,
    fontFamily: 'Feather',
  },
  key_container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  key_item: {
    width: 70,
    height: 70,
    borderWidth: 1,
    marginRight: 10,
    borderColor: colors.gray,
    marginTop: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 42,
    color: colors.primary,
    fontFamily: 'Feather',
  },
  forgot_link: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.secondary,
  },
  error: {
    fontFamily: 'Feather',
    color: colors.danger,
    marginTop: 10,
  },
  paiement_error: {
    textAlign: 'center',
    color: colors.danger,
    fontFamily: 'Feather',
    fontSize: 16,
    marginTop: 15,
  },
});

export default Code;
