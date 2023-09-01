/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ToastAndroid,
  Appearance,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from '../paiement/header';
import {api_url, public_url} from '../../helpers/url';
import axios from 'axios';
import {axiosConfig, price, sendNotification} from '../../helpers/util';
import {Button, Confirm} from '../../elements';
import {styles} from '../../helpers/styles';

const colorScheme = Appearance.getColorScheme();

export default class Validation extends Component {
  state = {
    data: this.props.route.params.data,
    cancelling: false,
    showConfirm: false,
    loading: true,
    config: null,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header navigation={this.props.navigation} />
        <View style={_styles.main_container}>
          <View style={[_styles.content, boxShadow.depth_2]}>
            <Image
              source={
                this.state.data.client.photo
                  ? {
                      uri: public_url(
                        'images/profils/' + this.state.data.client.photo,
                      ),
                    }
                  : {uri: public_url('images/avatar.png')}
              }
              style={_styles.photo}
            />
            <Text style={_styles.pseudo}>{this.state.data.client.pseudo}</Text>
            <Text style={_styles.message}>A effectué le paiement</Text>
            <View style={{width: '100%', alignItems: 'center'}}>
              <View style={_styles.info_container}>
                <Text style={styles.text}>Désignation :</Text>
                <Text style={styles.text}>
                  {this.state.data.offre.nom_objet}
                </Text>
              </View>
              <View style={_styles.info_container}>
                <Text style={styles.text}>Prix de l'article :</Text>
                <Text style={styles.text}>
                  {price(this.state.data.montant)} FCFA
                </Text>
              </View>
              <View style={_styles.info_container}>
                <Text style={styles.text}>Commission :</Text>
                <Text style={styles.text}>{this.getInfoPaiement('frais')}</Text>
              </View>
              <View style={_styles.info_container}>
                <Text style={styles.text}>Total à recevoir :</Text>
                <Text style={styles.text}>
                  {this.getInfoPaiement('receive')}
                </Text>
              </View>
            </View>

            <Text style={_styles.message}>Vous devez preparer la commande</Text>
            <Text style={_styles.message}>Vous avez 30 minutes</Text>
            <View style={_styles.action_container}>
              <Button
                bg={colors.primary}
                title="Valider"
                onPress={() => this.submit()}
                style={{width: 100}}
              />
              <Button
                bg={colors.danger}
                title="Annuler"
                onPress={() => this.setState({showConfirm: true})}
                style={{width: 100, marginLeft: 5}}
              />
            </View>
          </View>
        </View>
        <Confirm
          show={this.state.showConfirm}
          onConfirm={() => this.cancel()}
          onCancel={() => this.setState({showConfirm: false})}
          loading={this.state.cancelling}
        />
      </View>
    );
  }
  submit() {
    this.props.navigation.navigate('LivraisonCommande', {
      data: this.state.data,
    });
  }
  cancel() {
    this.setState({cancelling: true});
    axios
      .post(
        api_url('offre/cancel'),
        {idOffre: this.state.data.id_offre, idNotif: this.state.data.id},
        axiosConfig,
      )
      .then(res => {
        console.log(res.data);
        if (res.data.success) {
          //getUnreadMessage();
          sendNotification(this.state.data.client.id);
          this.props.navigation.navigate('Home');
          ToastAndroid.show("Fermeture de l'offre effectué", ToastAndroid.LONG);
        }
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({cancelling: false, showConfirm: false});
      });
  }
  componentDidMount() {
    axios
      .get(api_url('paiement/getConfig'))
      .then(res => {
        this.setState({config: res.data});
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({loading: false});
      });
  }
  getInfoPaiement(field) {
    if (this.state.loading) {
      return <ActivityIndicator size="small" color={colors.primary} />;
    }
    if (this.state.config === null) {
      return null;
    }
    let frais =
      (this.state.data.montant * this.state.config.commission_vendeur) / 100;
    if (field === 'frais') {
      return price(frais) + ' FCFA';
    } else {
      let receive = this.state.data.montant - frais;
      return price(receive) + ' FCFA';
    }
  }
}

const _styles = StyleSheet.create({
  main_container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  content: {
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    minHeight: 200,
    width: '100%',
    alignItems: 'center',
    marginTop: -60,
    borderRadius: 10,
  },
  photo: {
    width: 66,
    height: 66,
    borderRadius: 33,
    marginTop: -33,
  },
  pseudo: {
    fontFamily: 'Feather',
    fontSize: 20,
    color: colors.primary,
    marginTop: 5,
  },
  message: {
    fontFamily: 'Feather',
    fontSize: 15,
    color: colors.primary,
    marginTop: 5,
    textAlign: 'center',
  },
  action_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  info_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});
