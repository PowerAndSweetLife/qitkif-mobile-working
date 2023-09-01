/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Appearance,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from '../paiement/header';
import {public_url} from '../../helpers/url';
import {styles} from '../../helpers/styles';

const colorScheme = Appearance.getColorScheme();

export default class AttenteLivraison extends Component {
  state = {
    data: this.props.route.params.data,
    loadingShow: false,
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
              A procédé à la mise en livraison de l'article '
              {this.state.data.offre.nom_objet}' vous recevrez le colis d'ici{' '}
              {this.state.data.offre.duree_livraison} h
            </Text>
            <Text style={_styles.reference}>
              Ref transaction: {this.state.data.ref}
            </Text>
            <View style={_styles.action_container}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[_styles.button]}
                onPress={() => this.submit()}>
                <Text style={[_styles.button_text, {color: colors.primary}]}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
  setLoading() {
    if (this.state.loadingShow) {
      return (
        <ActivityIndicator
          style={{marginRight: 10}}
          size="small"
          color={colors.light}
        />
      );
    }
    return null;
  }
  submit() {
    this.props.navigation.navigate('ColisRecu', {
      data: this.state.data,
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
