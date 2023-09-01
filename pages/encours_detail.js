/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  Appearance,
  ScrollView,
} from 'react-native';
import {colors} from '../helpers/colors';
import Header from './components/header';
import Footer2 from './components/footer_2';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {api_url} from '../helpers/url';
import {
  axiosConfig,
  price,
  sendNotification,
  state_offre,
} from '../helpers/util';
import {styles} from '../helpers/styles';
import {Button, Confirm} from '../elements';
import {connect} from 'react-redux';

const colorScheme = Appearance.getColorScheme();

class EncoursDetail extends Component {
  state = {
    etat: state_offre.WAIT_VALIDATION,
    offre: {
      nom_objet: null,
      montant: null,
    },
    data: null,
    showConfirm: false,
    submitting: false,
    cancelError: null,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="Détail" navigation={this.props.navigation} />
        <ScrollView style={{marginBottom: 60}}>
          <View style={_styles.article}>
            <Text style={[styles.text, _styles.article_text]}>
              {this.state.offre.nom_objet}
            </Text>
            <Text style={[styles.text, _styles.article_text]}>
              {price(this.state.offre.montant)} FCFA
            </Text>
          </View>
          <View style={_styles.main_container}>
            {this.displayState('Offre')}
            {this.displayState('Paiement')}
            {this.displayState('Préparation de commande')}
            {this.displayState('Mise en livraison')}
            {this.displayState('Livraison')}
            {this.displayState('Cloture')}
          </View>
          <Text style={[styles.text_error, {textAlign: 'center'}]}>
            {this.state.cancelError}
          </Text>

          {this.setAction()}
          <View style={{paddingHorizontal: 30, marginTop: 10}}>
            <Button
              bg={colors.red}
              title="Annuler l'offre"
              onPress={() => this.setState({showConfirm: true})}
              disabled={this.isDisabled()}
            />
          </View>
        </ScrollView>
        <Confirm
          show={this.state.showConfirm}
          onConfirm={() => this.cancelOffre()}
          onCancel={() => this.setState({showConfirm: false})}
          loading={this.state.submitting}
        />
        <Footer2 navigation={this.props.navigation} />
      </View>
    );
  }
  componentDidMount() {
    let id = this.props.route.params.idOffre;
    axios
      .get(api_url('offre/getOne/' + id))
      .then(res => {
        this.setState({
          etat: res.data.offre.etat,
          offre: res.data.offre,
          data: res.data,
        });
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  displayState(name) {
    let progress = 'En attente';
    let mt = 20;
    switch (name) {
      case 'Offre':
        if (this.state.etat >= state_offre.ACCEPTED) {
          progress = 'Accepté';
        }
        mt = 0;
        break;
      case 'Paiement':
        if (this.state.etat >= state_offre.PAY_SUCCESS) {
          progress = 'Effectué';
        }
        break;
      case 'Préparation de commande':
        if (this.state.etat === state_offre.PAY_SUCCESS) {
          progress = 'En Attente';
        } else if (this.state.etat > state_offre.PREPARATION) {
          progress = 'Effectué';
        }
        break;
      case 'Mise en livraison':
        if (this.state.etat >= state_offre.LIVRAISON) {
          progress = 'Effectué';
        }
        break;
      case 'Livraison':
        if (this.state.etat === state_offre.LIVRAISON) {
          progress = 'En cours';
        } else if (this.state.etat > state_offre.LIVRAISON) {
          progress = 'Effectué';
        }
        break;
      case 'Cloture':
        if (this.state.etat === state_offre.CLOSE_SUCCESS) {
          progress = 'Effectué';
        } else if (this.state.etat === state_offre.LITIGE) {
          progress = 'Litige';
        }
        break;
      default:
        break;
    }

    let icon = (
      <View style={_styles.checked}>
        <FontAwesome name="check" size={18} color={colors.light} />
      </View>
    );

    if (progress === 'En attente') {
      icon = <View style={_styles.waiting} />;
    } else if (progress === 'En cours') {
      icon = <View style={_styles.encours} />;
    } else if (progress === 'Litige') {
      icon = <View style={_styles.litige} />;
    }
    return (
      <View style={[_styles.state_container, {marginTop: mt}]}>
        <View>
          {icon}
          {name === 'Cloture' ? <View style={_styles.mask} /> : null}
        </View>
        <View style={{paddingHorizontal: 10}}>
          <Text style={[styles.text, _styles.state_name]}>{name}</Text>
          <Text
            style={
              progress === 'En attente'
                ? _styles.state_value_waiting
                : _styles.state_value
            }>
            {progress}
          </Text>
        </View>
      </View>
    );
  }
  isDisabled() {
    if (
      this.state.etat === state_offre.LIVRAISON &&
      this.state.offre.id_vendeur === this.props.logged.id
    ) {
      return true;
    }
    return false;
  }
  cancelOffre() {
    this.setState({submitting: true, cancelError: null});
    axios
      .post(
        api_url('offre/cancel'),
        {idOffre: this.state.offre.id},
        axiosConfig,
      )
      .then(res => {
        if (res.data.success) {
          ToastAndroid.show("Fermeture de l'offre effectué", ToastAndroid.LONG);
          sendNotification(this.state.data.client.id);
          this.props.navigation.navigate('Home');
        } else {
          this.setState({cancelError: res.data.message});
        }
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({submitting: false, showConfirm: false});
      });
  }
  setAction() {
    let buttonText = null;
    let nextRoute = null;
    switch (this.state.etat) {
      case state_offre.ACCEPTED:
        if (this.state.action === 'vente') {
          return null;
        }
        if (this.state.offre.id_acheteur !== this.props.logged.id) {
          return null;
        }
        buttonText = 'Passer au paiement';
        nextRoute = 'ChoixPaiement';
        break;
      case state_offre.PAY_ACTIVE:
        if (this.state.offre.id_vendeur === this.props.logged.id) {
          return null;
        }
        buttonText = 'Passer au paiement';
        nextRoute = 'ChoixPaiement';
        break;
      case state_offre.ACCEPTED_AND_PAY_ACTIVE:
        if (this.state.offre.id_vendeur === this.props.logged.id) {
          return null;
        }
        buttonText = 'Passer au paiement';
        nextRoute = 'ChoixPaiement';
        break;
      case state_offre.PAY_SUCCESS:
        if (this.state.offre.id_acheteur === this.props.logged.id) {
          return null;
        }
        buttonText = 'Preparer la commande';
        nextRoute = 'ValidationCommande';
        break;
      default:
        return null;
    }
    return (
      <View style={{paddingHorizontal: 30}}>
        <Button
          bg={colors.primary}
          title={buttonText}
          onPress={() =>
            this.props.navigation.navigate(nextRoute, {
              data: this.state.data,
            })
          }
        />
      </View>
    );
  }
}

const _styles = StyleSheet.create({
  article: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomColor: colors.primary,
    borderBottomWidth: 1,
  },
  article_text: {
    fontSize: 20,
  },
  main_container: {
    marginHorizontal: 30,
    marginTop: 30,
    borderLeftWidth: 4,
    borderLeftColor:
      colorScheme === 'dark' ? colors.darkgray : colors.lightgray,
  },
  state_container: {
    flexDirection: 'row',
    marginLeft: -14,
    position: 'relative',
    zIndex: 2,
  },
  checked: {
    backgroundColor: colors.success,
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  encours: {
    backgroundColor: colors.primary,
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  waiting: {
    backgroundColor: colorScheme === 'dark' ? colors.black : 'white',
    width: 25,
    height: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? colors.darkgray : colors.dark,
  },
  litige: {
    backgroundColor: colors.danger,
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  mask: {
    flex: 1,
    width: 25,
    backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light,
  },
  state_name: {
    fontSize: 18,
  },
  state_value: {
    fontFamily: 'Feather',
    color: colors.primary,
  },
  state_value_waiting: {
    fontFamily: 'Feather',
    color: colors.lightgray,
  },
});

const mapStateToProps = state => {
  const {logged} = state;
  return {logged};
};

export default connect(mapStateToProps)(EncoursDetail);
