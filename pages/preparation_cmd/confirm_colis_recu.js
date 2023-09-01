import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Appearance,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from '../paiement/header';
import {api_url, public_url} from '../../helpers/url';
import axios from 'axios';
import {Confirm} from '../../elements';
import {styles} from '../../helpers/styles';
import {sendNotification} from '../../helpers/util';

const colorScheme = Appearance.getColorScheme();

export default class ConfirmColisRecu extends Component {
  state = {
    data: this.props.route.params.data,
    loadingShow: false,
    submitting: false,
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
            <Text style={_styles.message}>
              A fait livré l'article '{this.state.data.offre.nom_objet}' il y a{' '}
              {this.state.data.offre.duree_livraison} h, est ce que vous l'avez
              reçu ?
            </Text>
            <Text style={_styles.reference}>
              Ref transaction: {this.state.data.ref}
            </Text>
            <View style={_styles.action_container}>
              <TouchableOpacity
                onPress={() => this.setState({showConfirm: true})}
                activeOpacity={0.8}
                style={[_styles.button, {backgroundColor: colors.primary}]}>
                <Text style={[_styles.button_text, {color: colors.light}]}>
                  OUI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.notReceived()}
                activeOpacity={0.8}
                style={[
                  _styles.button,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? colors.dark : colors.light,
                  },
                ]}>
                <Text
                  style={[
                    _styles.button_text,
                    {
                      color:
                        colorScheme === 'dark'
                          ? colors.darkgray
                          : colors.primary,
                    },
                  ]}>
                  NON
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Confirm
          show={this.state.showConfirm}
          onConfirm={() => this.submit()}
          title="Le colis est-il conforme ?"
          onCancel={() => {
            this.setState({showConfirm: false});
            this.props.navigation.navigate('NewLitige', {
              idNotif: this.state.data.id,
            });
          }}
          loading={this.state.submitting}
        />
      </View>
    );
  }
  submit() {
    this.setState({submitting: true});
    axios
      .post(
        api_url('offre/success'),
        {
          idNotif: this.state.data.id,
          idOffre: this.state.data.offre.id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        if (response.data.success) {
          ToastAndroid.show('Offre fermé', ToastAndroid.LONG);
          //getUnreadNotification();
          sendNotification(this.state.data.client.id);
          this.props.navigation.navigate('Home');
        }
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({submitting: false});
      });
  }
  notReceived() {
    this.setState({loadingShow: true});
    axios
      .post(
        api_url('offre/notReceived'),
        {
          idNotif: this.state.data.id,
          idOffre: this.state.data.offre.id,
          idClient: this.state.data.client.id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        if (response.data.expired) {
          this.props.navigation.navigate('NewLitige', {
            idNotif: this.state.data.id,
          });
        } else {
          ToastAndroid.show(
            "La durée de livraison n'est pas encore expiré",
            ToastAndroid.LONG,
          );
          this.props.navigation.navigate('Home');
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({loadingShow: false});
      });
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
  reference: {
    fontFamily: 'Feather',
    fontSize: 18,
    color: colors.gray,
    marginTop: 10,
  },
  action_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 10,
    flexDirection: 'row',
  },
});
