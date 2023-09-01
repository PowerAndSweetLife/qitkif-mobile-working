/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Image,
  FlatList,
  Appearance,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from './header';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {api_url, public_url} from '../../helpers/url';
import {connect} from 'react-redux';
import {
  setCategorie,
  setMessage,
  setNomObjet,
  setRemise,
} from '../../store/slices/achat_slice';
import {styles} from '../../helpers/styles';
import {Button} from '../../elements';

const colorScheme = Appearance.getColorScheme();

class QuestionAchat extends Component {
  state = {
    modalVisible: false,
    categories: [],
    categorieActive: null,
    remiseActive: null,
    name: '',
    message: null,
    errors: {
      categorie: false,
      remise: false,
      name: false,
    },
  };
  selectCategory(type) {
    axios
      .get(api_url('categorie/get/' + type))
      .then(response => {
        console.log(response.data);
        this.setState({categories: response.data.categories});
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
    this.setState({modalVisible: true});
  }
  renderListCategorie(item) {
    return (
      <TouchableOpacity
        style={_styles.modal_items_container}
        onPress={() => this.categorieSelected(item)}>
        <Image
          source={{uri: public_url('images/icon_categorie/' + item.icon)}}
          style={_styles.modal_item_image}
        />
        <Text style={[colors.text, _styles.modal_item_text]}>{item.nom}</Text>
      </TouchableOpacity>
    );
  }
  categorieSelected(item) {
    let errors = this.state.errors;
    errors.categorie = false;
    this.setState({errors: errors});
    this.setState({modalVisible: false, categorieActive: item.type});
    this.props.dispatch(setCategorie(item));
  }
  displayCategorieSelected() {
    if (!this.state.categorieActive) {
      return (
        <View
          style={[
            _styles.response_choix_autre,
            boxShadow.depth_10,
            this.state.errors.categorie ? _styles.submit_error : {},
          ]}>
          <Entypo
            name="dots-three-horizontal"
            size={24}
            color={colors.secondary}
          />
          <Text
            style={[
              _styles.response_choix_title,
              {color: colors.dark, marginLeft: 10},
            ]}>
            Autre
          </Text>
        </View>
      );
    }
    return (
      <View
        style={[
          _styles.response_choix_autre,
          boxShadow.depth_10,
          this.state.errors.categorie ? _styles.submit_error : {},
        ]}>
        <Entypo
          name="dots-three-horizontal"
          size={24}
          color={colors.secondary}
        />
        <Text
          style={[
            _styles.response_choix_title,
            {color: colors.dark, marginLeft: 10},
          ]}>
          {this.props.achat.categorie.nom}
        </Text>
      </View>
    );
  }
  remiseSelected(mode) {
    let errors = this.state.errors;
    errors.remise = false;
    this.setState({errors: errors});
    this.setState({remiseActive: mode});
    if (mode === 'main') {
      mode = 'main propre';
    }
    this.props.dispatch(setRemise(mode));
  }
  resetStateErrors() {
    this.setState({
      errors: {
        categorie: false,
        remise: false,
        name: false,
      },
    });
  }
  setObjectValue(value) {
    if (value.length <= 25) {
      this.setState({name: value});
    } else {
      let oldState = this.state.name;
      this.setState({name: oldState});
    }
  }
  setMessageValue(value) {
    if (value.length <= 100) {
      this.setState({message: value});
    } else {
      let oldState = this.state.message;
      this.setState({message: oldState});
    }
  }
  submit() {
    this.resetStateErrors();
    let fieldsErrrors = this.state.errors;
    let error = false;
    if (this.state.categorieActive === null) {
      fieldsErrrors.categorie = true;
      error = true;
    }
    if (this.state.remiseActive === null) {
      fieldsErrrors.remise = true;
      error = true;
    }
    if (this.state.name.trim() === '') {
      fieldsErrrors.name = true;
      error = true;
    }
    if (error) {
      this.setState({errors: fieldsErrrors});
    } else {
      this.props.dispatch(setNomObjet(this.state.name));
      this.props.dispatch(setMessage(this.state.message));
      this.props.navigation.navigate('Montant', {
        type: this.props.route.params.type,
      });
    }
  }
  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header progress={2} navigation={this.props.navigation} />
          <View style={[_styles.banner, boxShadow.depth_2]}>
            <Text style={_styles.banner_title}>
              Que voulez-vous
              {this.props.route.params.type === 'vente'
                ? ' vendre'
                : ' acheter'}
              ?
            </Text>
            <View style={_styles.response_choix}>
              <TouchableOpacity
                style={[
                  _styles.response_choix_items,
                  boxShadow.depth_10,
                  this.state.categorieActive === 'objet'
                    ? _styles.categorie_active
                    : {},
                  this.state.errors.categorie ? _styles.submit_error : {},
                ]}
                onPress={() => this.selectCategory('objet')}>
                <Text style={_styles.response_choix_title}>Objet</Text>
                <Text style={_styles.response_choix_description}>
                  T-shirt, meuble, ...
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  _styles.response_choix_items,
                  boxShadow.depth_10,
                  this.state.categorieActive === 'service'
                    ? _styles.categorie_active
                    : {},
                  this.state.errors.categorie ? _styles.submit_error : {},
                ]}
                onPress={() => this.selectCategory('service')}>
                <Text style={_styles.response_choix_title}>Services</Text>
                <Text style={_styles.response_choix_description}>
                  Location, ...
                </Text>
              </TouchableOpacity>
            </View>

            {this.displayCategorieSelected()}

            <Text style={_styles.banner_title}>
              Comment l'objet sera-t-il remis ?
            </Text>
            <View style={_styles.response_choix}>
              <TouchableOpacity
                onPress={() => this.remiseSelected('main')}
                style={[
                  _styles.response_choix_items,
                  boxShadow.depth_10,
                  this.state.remiseActive === 'main'
                    ? _styles.categorie_active
                    : {},
                  this.state.errors.remise ? _styles.submit_error : {},
                ]}>
                <Text style={_styles.response_choix_mode}>Main propre</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.remiseSelected('livraison')}
                style={[
                  _styles.response_choix_items,
                  boxShadow.depth_10,
                  this.state.remiseActive === 'livraison'
                    ? _styles.categorie_active
                    : {},
                  this.state.errors.remise ? _styles.submit_error : {},
                ]}>
                <Text style={_styles.response_choix_mode}>Livraison</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Nom de l'objet"
              style={[
                styles.input,
                _styles.object_field,
                this.state.errors.name ? _styles.submit_error : {},
              ]}
              onChangeText={value => this.setObjectValue(value)}
              value={this.state.name}
            />
            <View
              style={{
                marginBottom: 20,
                width: '100%',
                alignItems: 'flex-end',
                paddingEnd: 5,
              }}>
              <Text style={styles.text}>25 caractères max</Text>
            </View>

            <TextInput
              multiline={true}
              numberOfLines={4}
              style={[styles.input, _styles.message_field]}
              placeholder="Votre message"
              onChangeText={value => this.setMessageValue(value)}
              value={this.state.message}
            />
            <View
              style={{
                marginBottom: 10,
                width: '100%',
                alignItems: 'flex-end',
                paddingEnd: 5,
              }}>
              <Text style={styles.text}>100 caractères max</Text>
            </View>

            <Button
              title="Suivant"
              bg={colors.primary}
              onPress={() => this.submit()}
              style={{marginBottom: 10}}
            />
          </View>
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: !this.state.modalVisible});
          }}>
          <View style={_styles.centeredView}>
            <View style={_styles.modal_body}>
              <TouchableOpacity
                style={_styles.btn_close}
                onPress={() => this.setState({modalVisible: false})}>
                <AntDesign name="close" size={24} color={colors.gray} />
              </TouchableOpacity>
              <Text style={_styles.modal_title}>Choisissez une catégorie</Text>
              <View style={{flex: 1, width: '100%'}}>
                <FlatList
                  data={this.state.categories}
                  renderItem={({item}) => this.renderListCategorie(item)}
                  keyExtractor={(item, index) => index}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const _styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginTop: -85,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    minHeight: 150,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.gray,
    marginTop: -35,
    marginBottom: 10,
  },
  banner_title: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.primary,
    marginTop: 20,
  },
  response_choix: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  response_choix_items: {
    backgroundColor: colorScheme === 'dark' ? '#485460' : '#FFF',
    width: '45%',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  response_choix_autre: {
    backgroundColor: colorScheme === 'dark' ? '#485460' : '#FFF',
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  response_choix_title: {
    fontSize: 17,
    fontFamily: 'Feather',
    fontWeight: '700',
    color: colors.primary,
  },
  response_choix_description: {
    fontFamily: 'Feather',
    color: colors.gray,
  },
  response_choix_mode: {
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.primary,
    marginVertical: 10,
  },
  object_field: {
    borderColor: colors.gray,
    borderRadius: 10,
    fontSize: 18,
    paddingHorizontal: 10,
  },
  message_field: {
    borderColor: colors.gray,
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  /**
   * Modal
   */
  centeredView: {
    flex: 1,
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  modal_body: {
    backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  modal_title: {
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.primary,
    marginBottom: 20,
  },
  modal_items_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 10,
  },
  modal_item_image: {
    width: 30,
    height: 30,
  },
  modal_item_text: {
    flex: 1,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  btn_close: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  categorie_active: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  submit_error: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
});

const mapStateToProps = state => {
  const {achat} = state;
  return {achat};
};

export default connect(mapStateToProps)(QuestionAchat);
