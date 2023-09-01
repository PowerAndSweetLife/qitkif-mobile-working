/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {Component} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../helpers/colors';
import {api_url} from '../helpers/url';
import Header from './components/header';

import {styles} from '../helpers/styles';
import {Button} from '../elements';

export default class Retrait extends Component {
  state = {
    montant: '',
    selectedNumero: -1,
    listNumeros: [],
    errorMontant: null,
    errorTransaction: null,
    submit: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="Retrait" navigation={this.props.navigation} />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={_styles.main_wrapper}>
            <Text style={_styles.label}>Montant à retirer</Text>
            <TextInput
              style={[
                _styles.input,
                this.state.errorMontant ? {borderColor: colors.danger} : null,
              ]}
              keyboardType="numeric"
              onChangeText={value => this.setState({montant: value})}
            />
            <Text style={_styles.error}>{this.state.errorMontant}</Text>
            <Text style={[_styles.label, {marginTop: 15}]}>
              Numéro de paiement
            </Text>
            {this.setNumeroList()}
            <Text style={[_styles.error, {marginTop: 15}]}>
              {this.state.errorTransaction}
            </Text>
            <View style={{marginVertical: 15}}>
              <Button
                title={this.state.submit ? 'Patientez svp...' : 'Retrait'}
                bg={colors.primary}
                onPress={() => this.submit()}
                loading={this.state.submit}
                disabled={this.state.selectedNumero < 0}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
  componentDidMount() {
    axios
      .get(api_url('user/getNumeroPaiement'))
      .then(res => {
        this.setState({listNumeros: res.data});
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  setNumeroList() {
    if (this.state.listNumeros.length > 0) {
      return this.state.listNumeros.map(item => {
        return (
          <Pressable
            key={item.id}
            onPress={() => this.setState({selectedNumero: item.id})}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <View style={_styles.radio_wrapper}>
              {item.id === this.state.selectedNumero ? (
                <View style={_styles.radio_dot} />
              ) : null}
            </View>
            <Text style={_styles.phone_number}>{item.numero}</Text>
          </Pressable>
        );
      });
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{marginTop: 10}}
        onPress={() =>
          this.props.navigation.navigate('AddPaiement', {initiator: 'retrait'})
        }>
        <Text style={_styles.add_numero}>Ajouter numéro</Text>
      </TouchableOpacity>
    );
  }
  submit() {
    if (this.state.montant.trim().length === 0) {
      this.setState({errorMontant: 'Veuillez indiquer le montant !'});
      return false;
    }
    this.setState({errorTransaction: null, submit: true});
    axios
      .post(
        api_url('paiement/retrait'),
        {
          montant: this.state.montant,
          idNumero: this.state.selectedNumero,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        if (!response.data.success) {
          if (response.data.nopending) {
            this.setState({
              errorTransaction: response.data.transaction.statusMessage,
            });
          } else if (response.data.insuffisant) {
            this.setState({
              errorTransaction: 'Votre solde est insuffisant !',
            });
          } else {
            switch (response.data.transaction.statusCode) {
              case 400:
                this.setState({
                  errorTransaction:
                    'Données incorrectes saisies dans la demande',
                });
                break;
              case 401:
                this.setState({
                  errorTransaction: 'Paramètres non complets',
                });
                break;
              case 402:
                this.setState({
                  errorTransaction:
                    "Le numéro de téléphone de paiement n'est pas correct",
                });
                break;
              case 403:
                this.setState({
                  errorTransaction:
                    "Le numéro de téléphone du dépôt n'est pas correct",
                });
                break;
              case 404:
                this.setState({
                  errorTransaction:
                    "Délai d'expiration dans USSD PUSH/Annulation dans USSD PUSH",
                });
                break;
              case 406:
                this.setState({
                  errorTransaction:
                    "Le numéro de téléphone de paiement obtenu n'est pas pour le portefeuille d'argent mobile",
                });
                break;
              case 460:
                this.setState({
                  errorTransaction:
                    'Le solde du compte de paiement du payeur est faible',
                });
                break;
              case 461:
                this.setState({
                  errorTransaction:
                    "Une erreur s'est produite lors du paiement",
                });
                break;
              case 462:
                this.setState({
                  errorTransaction:
                    "Ce type de transaction n'est pas encore pris en charge, processeur introuvable",
                });
                break;
              case 500:
                this.setState({
                  errorTransaction: response.data.transaction.statusMessage,
                });
                break;
              default:
                break;
            }
          }
        } else {
          ToastAndroid.show('Retrait effectué avec succès', ToastAndroid.LONG);
          this.props.navigation.navigate('Compte', {
            updated: response.data.time,
          });
        }
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({submit: false});
      });
  }
}

const _styles = StyleSheet.create({
  main_wrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.darkgray,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.gray,
    fontSize: 18,
  },
  radio_wrapper: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.darkgray,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio_dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  phone_number: {
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.dark,
    marginLeft: 5,
  },
  add_numero: {
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.secondary,
  },
  error: {
    fontWeight: 'bold',
    color: colors.danger,
    fontFamily: 'Feather',
  },
});
