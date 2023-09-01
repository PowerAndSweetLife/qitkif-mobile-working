/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Appearance,
  ScrollView,
} from 'react-native';
import {colors} from '../../helpers/colors';
import Header from './header';
import {boxShadow} from '../../helpers/box_shadow';
import {styles} from '../../helpers/styles';
import {price} from '../../helpers/util';
import {Button} from '../../elements';
import axios from 'axios';
import {api_url} from '../../helpers/url';

const colorScheme = Appearance.getColorScheme();

export default class Confirmation extends Component {
  state = {
    data: this.props.route.params.data,
    loading: true,
    fraisOperateur: 0,
    timbre: 0,
    commission: 0,
    commission_vendeur: 0,
    montant_vendeur: 0,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView>
          <Header navigation={this.props.navigation} />
          <View style={_styles.main_container}>
            {this.setLoading()}
            <View style={[_styles.content, boxShadow.depth_2]}>
              <View style={[_styles.photo, boxShadow.depth_10]}>
                <Image
                  source={require('../../assets/img/paiement-securise.png')}
                  style={{width: 40, height: 40}}
                />
              </View>
              <Text style={_styles.title}>Paiement</Text>
              <View style={_styles.input_container}>
                <Text style={_styles.input}>
                  {this.state.data.offre.nom_objet.toUpperCase()}
                </Text>
                <Text style={_styles.label}>Désignation</Text>
              </View>
              <View style={_styles.input_container}>
                <Text style={_styles.input}>
                  {this.state.data.client.pseudo}
                </Text>
                <Text style={_styles.label}>Vendeur</Text>
              </View>
              <View style={_styles.input_container}>
                <Text style={_styles.input}>
                  {price(this.state.data.montant)} FCFA
                </Text>
                <Text style={_styles.label}>Prix de l'article</Text>
              </View>
              {/* <View style={_styles.input_container}>
                <Text style={_styles.input}>{price(this.state.timbre)} FCFA</Text>
                <Text style={_styles.label}>Timbre d'etat</Text>
              </View> */}
              {/* <View style={_styles.input_container}>
                <Text style={_styles.input}>
                  {price(this.state.fraisOperateur)} FCFA
                </Text>
                <Text style={_styles.label}>Frais de l'opérateur</Text>
              </View> */}
              <View style={_styles.input_container}>
                <Text style={_styles.input}>
                  {price(this.state.commission)} FCFA
                </Text>
                <Text style={_styles.label}>Commission</Text>
              </View>

              {/* <View style={_styles.input_container}>
                <Text style={_styles.input}>
                  {price(this.state.commission_vendeur)} FCFA
                </Text>
                <Text style={_styles.label}>Commission vendeur</Text>
              </View>
              <View style={_styles.input_container}>
                <Text style={_styles.input}>
                  {price(this.state.montant_vendeur)} FCFA
                </Text>
                <Text style={_styles.label}>Montant réçu par le vendeur</Text>
              </View> */}

              <View style={_styles.total_container}>
                <Text style={_styles.total_label}>Total à payer</Text>
                <Text style={_styles.total_value}>
                  {price(
                    this.state.data.montant +
                      this.state.timbre +
                      this.state.fraisOperateur +
                      this.state.commission,
                  )}{' '}
                  FCFA
                </Text>
              </View>
            </View>
            <Button
              title="Valider"
              bg={colors.success}
              onPress={() => this.submit()}
              style={{marginTop: 15}}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
  setLoading() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.secondary} />
        </View>
      );
    }
    return null;
  }
  componentDidMount() {
    axios
      .get(api_url('paiement/getConfig'))
      .then(res => {
        this.setState({
          loading: false,
          timbre: res.data.timbre,
          commission:
            (this.state.data.montant * res.data.commission_acheteur) / 100,
          commission_vendeur:
            (this.state.data.montant * res.data.commission_vendeur) / 100,
        });
        let frais = 0;
        if (this.props.route.params.acceptFraisOperateur) {
          frais = (this.state.data.montant * res.data.frais_operateur) / 100;
          this.setState({fraisOperateur: frais});
        }
        this.setState({
          montant_vendeur:
            this.state.data.montant +
            frais -
            (this.state.data.montant * res.data.commission_vendeur) / 100,
        });
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  submit() {
    this.props.navigation.navigate('CodePaiement', {
      data: this.state.data,
      idNumero: this.props.route.params.idNumero,
      montant: this.state.data.montant,
      fraisOperateur: this.state.fraisOperateur,
      commission: this.state.commission,
    });
  }
}

const _styles = StyleSheet.create({
  main_container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  content: {
    minHeight: 300,
    width: '100%',
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    marginTop: -60,
    borderRadius: 20,
    alignItems: 'center',
  },
  photo: {
    width: 66,
    height: 66,
    borderRadius: 33,
    marginTop: -33,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Feather',
    fontSize: 20,
    color: colors.primary,
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  input_container: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    textAlignVertical: 'center',
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: 'Feather',
    fontSize: 20,
    color: colorScheme === 'dark' ? colors.light : colors.dark,
  },
  label: {
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    paddingHorizontal: 10,
    position: 'absolute',
    top: -10,
    color: colors.primary,
    fontSize: 13,
    left: 30,
    fontFamily: 'Feather',
  },
  total_container: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 25,
  },
  total_label: {
    fontFamily: 'Feather',
    color: colors.primary,
    fontSize: 18,
  },
  total_value: {
    color: colors.primary,
    fontFamily: 'Feather',
    fontSize: 24,
  },
});
