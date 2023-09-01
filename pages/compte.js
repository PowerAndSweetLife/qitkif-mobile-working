/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import moment from 'moment';
import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {colors} from '../helpers/colors';
import {styles} from '../helpers/styles';
import {api_url} from '../helpers/url';
import Header from './components/header';

export default class Compte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      solde: 0,
    };
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Header
          title="Historiques des transactions"
          navigation={this.props.navigation}
        />
        <View style={_styles.main_container}>
          {/* <View style={_styles.solde_wrapper}>
            <Text style={_styles.title}>Solde :</Text>
            <Text style={_styles.montant}>{this.state.solde}</Text>
          </View>
          <View style={_styles.action_wrapper}>
            <TouchableOpacity
              style={[
                _styles.button,
                {backgroundColor: colors.success, marginTop: 25},
              ]}
              activeOpacity={0.8}>
              <Image
                source={require('../assets/img/savings.png')}
                style={_styles.button_icon}
              />
              <Text style={_styles.button_text}>Déposer de l'argent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Retrait')}
              style={[
                _styles.button,
                {backgroundColor: colors.secondary, marginTop: 25},
              ]}
              activeOpacity={0.8}>
              <Image
                source={require('../assets/img/withdraw.png')}
                style={_styles.button_icon}
              />
              <Text style={_styles.button_text}>Rétirer de l'argent</Text>
            </TouchableOpacity>
          </View> */}
          <View style={{flex: 1}}>
            {/* <Text style={_styles.title_history}>
              Historiques des transactions
            </Text> */}
            <FlatList
              data={this.state.transactions}
              renderItem={({item}) => this.renderListContent(item)}
              keyExtractor={(item, index) => index}
            />
          </View>
        </View>
      </View>
    );
  }
  renderListContent(item) {
    if (item.motif === 'vente') {
      return (
        <View style={_styles.history}>
          <Text style={{fontWeight: '700'}}>
            {moment(item.date_).format('DD/MM/YYYY')} à{' '}
            {moment(item.date_).format('HH:mm')}
          </Text>
          <Text>Vous avez reçu un paiement de {item.montant} fcfa</Text>
          <Text>Motif: Vente d'un article</Text>
          <Text>Reference: {item.reference}</Text>
        </View>
      );
    } else if (item.motif === 'achat') {
      return (
        <View style={_styles.history}>
          <Text style={{fontWeight: '700'}}>
            {moment(item.date_).format('DD/MM/YYYY')} à{' '}
            {moment(item.date_).format('HH:mm')}
          </Text>
          <Text>Vous avez fait un paiement de {item.montant} fcfa</Text>
          <Text>Motif: Achat d'un article</Text>
          <Text>Reference: {item.reference}</Text>
        </View>
      );
    } else if (item.motif === 'remboursement') {
      return (
        <View style={_styles.history}>
          <Text style={{fontWeight: '700'}}>
            {moment(item.date_).format('DD/MM/YYYY')} à{' '}
            {moment(item.date_).format('HH:mm')}
          </Text>
          <Text>Vous avez reçu un paiement de {item.montant} fcfa</Text>
          <Text>Motif: Remboursement d'un achat</Text>
          <Text>Reference: {item.reference}</Text>
        </View>
      );
    }
    return (
      <View style={_styles.history}>
        <Text style={{fontWeight: '700'}}>
          {moment(item.date_).format('DD/MM/YYYY')} à{' '}
          {moment(item.date_).format('HH:mm')}
        </Text>
        <Text>Vous avez fait un retrait de {item.montant} fcfa</Text>
      </View>
    );
  }
  getData() {
    axios
      .get(api_url('user/compte'))
      .then(response => {
        this.setState({
          transactions: response.data.transactions,
          solde: response.data.solde,
        });
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate() {
    if (this.props.route.params) {
      if (this.props.route.params.updated) {
        this.getData();
      }
    }
  }
}

const _styles = StyleSheet.create({
  main_container: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    flex: 1,
  },
  action_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  solde_wrapper: {
    borderWidth: 2,
    borderColor: colors.success,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Feather',
    color: colors.darkgray,
  },
  montant: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Feather',
    color: colors.primary,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
  },
  button_icon: {
    width: 35,
    height: 35,
  },
  button_text: {
    fontFamily: 'Feather',
    fontSize: 16,
    color: colors.light,
    marginLeft: 10,
    fontWeight: '700',
  },
  title_history: {
    fontFamily: 'Feather',
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
  },
  history: {
    padding: 5,
    borderWidth: 1,
    borderColor: colors.lightgray,
    borderRadius: 5,
    marginBottom: 10,
  },
});
