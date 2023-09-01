/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Button,
  Appearance,
} from 'react-native';
import {Button as MButton} from '../../elements';
import {colors} from '../../helpers/colors';
import Header from './header';
import {boxShadow} from '../../helpers/box_shadow';
import axios from 'axios';
import {api_url, public_url} from '../../helpers/url';
import {connect} from 'react-redux';
import {setNumeros} from '../../store/slices/logged_slice';
import {price} from '../../helpers/util';
import {styles} from '../../helpers/styles';

const colorScheme = Appearance.getColorScheme();

class Choix extends Component {
  state = {
    data: this.props.route.params.data,
    selectedNumero: null,
    acceptFraisOperateur: true,
    error: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header navigation={this.props.navigation} />
        <View style={_styles.main_container}>
          <View style={[_styles.content, boxShadow.depth_2]}>
            <View style={{alignItems: 'center'}}>
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
            </View>
            <Text style={_styles.pseudo}>
              {this.props.route.params.contre
                ? 'Paiement'
                : this.state.data.client.pseudo}
            </Text>
            <Text style={_styles.message}>
              {this.props.route.params.contre
                ? 'Vous avez accepté la proposition de ' +
                  this.state.data.client.pseudo +
                  ', Vous pouvez maintenant effectuer le paiement'
                : 'A accepté votre proposition \n vous pouvez maintenant effectuer le paiement'}
            </Text>
            <View style={_styles.input_container}>
              <Text style={_styles.input}>
                {this.state.data.offre.nom_objet.toUpperCase()}
              </Text>
              <Text style={_styles.label}>Désignation</Text>
            </View>
            <View style={_styles.input_container}>
              <Text style={_styles.input}>
                {price(this.state.data.montant)} FCFA
              </Text>
              <Text style={_styles.label}>Prix de l'article</Text>
            </View>
            <Text style={_styles.label_paiement}>Votre moyen de paiement</Text>

            {this.setListNumero()}

            {this.state.error ? (
              <Text style={_styles.text_error}>
                Chosisser une moyen de paiement
              </Text>
            ) : null}
          </View>
          <View style={{flex: 1, marginTop: 15}}>
            <MButton
              title="Suivant"
              onPress={() => this.submit()}
              bg={colors.primary}
            />
          </View>
        </View>
      </View>
    );
  }
  renderListNumero(item) {
    return (
      <View style={_styles.info_container}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: public_url('images/' + item.logo)}}
            style={_styles.info_image}
          />
          <Text style={_styles.info_text}>{item.numero}</Text>
        </View>
        <Pressable
          style={_styles.radio_button}
          onPress={() => this.selectNumero(item)}>
          <View
            style={
              this.state.selectedNumero === item.id
                ? _styles.radio_button_active
                : {}
            }
          />
        </Pressable>
      </View>
    );
  }
  selectNumero(item) {
    this.setState({selectedNumero: item.id});
  }
  setListNumero() {
    if (this.props.logged.numeros.length) {
      return (
        <FlatList
          data={this.props.logged.numeros}
          renderItem={({item}) => this.renderListNumero(item)}
          keyExtractor={(item, index) => index}
          style={_styles.numeros}
        />
      );
    }
    return (
      <View style={_styles.add_numero_wrapper}>
        <Text style={{textAlign: 'center', marginBottom: 10}}>
          Aucune numéro enregistré
        </Text>
        <Button
          title="Ajouter numéro"
          color={colors.primary}
          onPress={() =>
            this.props.navigation.navigate('AddPaiement', {
              initiator: 'paiement',
              data: this.state.data,
            })
          }
        />
      </View>
    );
  }
  submit() {
    this.setState({error: false});
    if (this.state.selectedNumero === null) {
      this.setState({error: true});
      return false;
    }
    this.props.navigation.navigate('ConfirmationPaiement', {
      data: this.state.data,
      idNumero: this.state.selectedNumero,
      acceptFraisOperateur: this.state.acceptFraisOperateur,
    });
  }
  componentDidMount() {
    axios
      .get(api_url('user/getNumeroPaiement'))
      .then(response => {
        this.props.dispatch(setNumeros(response.data));
        if (response.data.length > 0) {
          this.setState({selectedNumero: response.data[0].id});
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
}

const _styles = StyleSheet.create({
  main_container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  content: {
    //minHeight: 300,
    width: '100%',
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    marginTop: -60,
    borderRadius: 20,
    flex: 2,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -30,
  },
  pseudo: {
    fontFamily: 'Feather',
    fontSize: 20,
    color: colors.primary,
    marginTop: 5,
    textAlign: 'center',
  },
  message: {
    color: colors.primary,
    fontFamily: 'Feather',
    fontSize: 17,
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
  label_paiement: {
    fontFamily: 'Feather',
    fontSize: 13,
    color: colors.primary,
    textAlign: 'left',
    marginLeft: 40,
  },
  info_container: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info_text: {
    fontFamily: 'Feather',
    marginLeft: 10,
    color: colors.primary,
    fontSize: 18,
  },
  info_image: {
    width: 24,
    height: 24,
  },
  numeros: {
    paddingHorizontal: 15,
  },
  radio_button: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio_button_active: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  choice_container: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'center',
  },
  choice: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  choice_active: {
    backgroundColor: colors.primary,
  },
  text_choice_active: {
    color: colors.light,
  },
  add_numero_wrapper: {
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  text_error: {
    textAlign: 'center',
    color: colors.danger,
    fontWeight: '700',
  },
});

const mapStateToProps = state => {
  const {logged} = state;
  return {logged};
};

export default connect(mapStateToProps)(Choix);
