/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  FlatList,
  ImageBackground,
  ScrollView,
  Appearance,
} from 'react-native';
import {Button} from '../../elements';
import {colors} from '../../helpers/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {api_url, public_url} from '../../helpers/url';
import {connect} from 'react-redux';
import {setNumeros} from '../../store/slices/logged_slice';
import {styles} from '../../helpers/styles';
import {CODE_PAYS} from '../../helpers/util';

const colorScheme = Appearance.getColorScheme();

class Add extends Component {
  constructor() {
    super();
    this.state = {
      numero: '',
      numeroError: false,
      proprietaire: '',
      proprietaire_prenom: '',
      proprietaireError: false,
      proprietairePrenomError: false,
      operateur: 1,
      submitLoading: false,
      numero_used: false,
      operateurs: [],
    };
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{flex: 1}}>
            <View style={_styles.modal_header}>
              <Pressable onPress={() => this.props.navigation.goBack()}>
                <AntDesign name="arrowleft" color={colors.light} size={24} />
              </Pressable>
              <Pressable onPress={() => this.props.navigation.goBack()}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Feather',
                    color: colors.light,
                  }}>
                  Annuler
                </Text>
              </Pressable>
            </View>
            <View style={_styles.modal_body}>
              <View style={_styles.modal_content}>
                <View style={_styles.modal_image}>
                  <Entypo name="mobile" size={42} color={colors.gray} />
                </View>
                <Text style={_styles.pseudo}>
                  Ajouter un moyen de paiement et de retrait
                </Text>
                <View style={{paddingHorizontal: 10, width: '100%'}}>
                  <Text style={_styles.input_label}>
                    Choisissez l'operateur
                  </Text>
                  <FlatList
                    data={this.state.operateurs}
                    renderItem={({item}) => this.renderListOperateur(item)}
                    keyExtractor={(item, index) => index}
                    horizontal={true}
                    style={{marginTop: 10}}
                  />
                  <TextInput
                    placeholder="Nom du proprietaire de la carte SIM"
                    onChangeText={value => this.setState({proprietaire: value})}
                    style={[
                      _styles.input_field,
                      this.state.proprietaireError
                        ? {borderColor: colors.danger}
                        : {},
                    ]}
                  />
                  <TextInput
                    placeholder="Prénoms du proprietaire de la carte SIM"
                    onChangeText={value =>
                      this.setState({proprietaire_prenom: value})
                    }
                    style={[
                      _styles.input_field,
                      this.state.proprietairePrenomError
                        ? {borderColor: colors.danger}
                        : {},
                    ]}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <Text style={(styles.text, _styles.code_pays)}>
                      {CODE_PAYS}
                    </Text>
                    <TextInput
                      keyboardType="decimal-pad"
                      placeholder="Numéro de téléphone"
                      onChangeText={value => {
                        this.setState({numero: value});
                      }}
                      style={[
                        _styles.input_field,
                        {flex: 1},
                        this.state.numeroError
                          ? {borderColor: colors.danger}
                          : {},
                      ]}
                    />
                  </View>
                  {this.state.numero_used ? (
                    <Text style={_styles.error}>
                      Ce numéro est déjà utilisé
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={_styles.btn_container}>
              <Button
                title="Ajouter"
                bg={colors.primary}
                onPress={() => this.addNumero()}
                loading={this.state.submitLoading}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
  componentDidMount() {
    axios
      .get(api_url('operateur/all'))
      .then(response => {
        console.log(response.data);
        this.setState({operateurs: response.data.operateurs});
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  renderListOperateur(item) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          _styles.logo_operateur,
          this.state.operateur === item.id ? _styles.operateur_selected : {},
        ]}
        onPress={() => this.setState({operateur: item.id})}>
        <ImageBackground
          source={{uri: public_url('images/' + item.logo)}}
          resizeMode="contain"
          style={_styles.info_image}
        />
      </TouchableOpacity>
    );
  }
  addNumero() {
    this.setState({
      numeroError: false,
      proprietaireError: false,
      proprietairePrenomError: false,
      numero_used: false,
      submitLoading: true,
    });
    let error = false;
    if (this.state.numero.trim() === '') {
      this.setState({numeroError: true});
      error = true;
    }
    if (this.state.proprietaire.trim() === '') {
      this.setState({proprietaireError: true});
      error = true;
    }
    if (this.state.proprietaire_prenom.trim() === '') {
      this.setState({proprietairePrenomError: true});
      error = true;
    }
    if (!error) {
      axios
        .post(
          api_url('numeroPaiement/add'),
          {
            proprietaire: this.state.proprietaire,
            proprietaire_prenom: this.state.proprietaire_prenom,
            numero: this.state.numero,
            operateur: this.state.operateur,
          },
          {
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
            },
          },
        )
        .then(response => {
          if (response.data.success) {
            this.setState({
              proprietaireError: false,
              numeroError: false,
              numero_used: false,
            });
            this.props.dispatch(setNumeros(response.data.lists));
            if (this.props.route.params) {
              if (this.props.route.params.initiator === 'paiement') {
                this.props.navigation.navigate('ChoixPaiement', {
                  data: this.props.route.params.data,
                });
              } else if (this.props.route.params.initiator === 'retrait') {
                this.props.navigation.navigate('Retrait');
              }
            } else {
              this.props.navigation.navigate('Profil', {me: true});
            }
          } else {
            this.setState({numero_used: true, numeroError: true});
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.props.navigation.navigate('Login1');
          }
        })
        .finally(() => {
          this.setState({submitLoading: false});
        });
    } else {
      this.setState({submitLoading: false});
    }
  }
}

const _styles = StyleSheet.create({
  modal_header: {
    height: 200,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  modal_body: {
    position: 'relative',
    top: -60,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  modal_image: {
    width: 80,
    height: 80,
    borderRadius: 80,
    position: 'absolute',
    top: -40,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_content: {
    flex: 1,
    backgroundColor: colorScheme === 'dark' ? colors.black : 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderRadius: 10,
    position: 'relative',
    alignItems: 'center',
    paddingBottom: 20,
  },
  pseudo: {
    textAlign: 'center',
    fontFamily: 'Feather',
    fontSize: 17,
    color: colors.primary,
    marginTop: 50,
  },
  input_field: {
    borderColor: colors.secondary,
    borderWidth: 1,
    width: '100%',
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    fontFamily: 'Feather',
    fontSize: 17,
  },
  input_label: {
    fontFamily: 'Feather',
    fontSize: 14,
    color: colors.primary,
    marginTop: 5,
  },
  btn_container: {
    paddingHorizontal: 20,
  },
  error: {
    fontFamily: 'Feather',
    color: colors.danger,
    fontSize: 14,
  },
  info_image: {
    flex: 1,
  },
  logo_operateur: {
    marginRight: 10,
    width: 32,
    height: 32,
    padding: 3,
  },
  operateur_selected: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 5,
  },
  code_pays: {
    width: 55,
    height: 45,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 5,
    marginRight: 5,
  },
});

const mapStateToProps = state => {
  const {logged} = state;
  return {logged};
};

export default connect(mapStateToProps)(Add);
