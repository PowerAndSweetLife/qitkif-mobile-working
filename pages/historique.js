/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  ActivityIndicator,
  Appearance,
} from 'react-native';
import {colors} from '../helpers/colors';
import Header from './components/header';
import Footer from './components/footer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {api_url, public_url} from '../helpers/url';
import {styles} from '../helpers/styles';
import {getStars, price, shortDate} from '../helpers/util';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

const colorScheme = Appearance.getColorScheme();

class Historique extends Component {
  state = {
    modalVisible: false,
    loading: true,
    data: [],
    states: [],
    item: null,
    stars: [],
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="Historique" navigation={this.props.navigation} />
        <View style={_styles.main_container}>
          <SectionList
            sections={this.state.data}
            renderItem={({item}) => this.renderListContent(item)}
            renderSectionHeader={({section}) => (
              <Text style={_styles.date}>{section.date}</Text>
            )}
            keyExtractor={(item, index) => `basicListEntry-${index}`}
          />
          {this.state.loading ? this.showLoading() : null}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: !this.state.modalVisible});
          }}>
          <View style={styles.wrapper}>
            <View style={{flex: 1}}>
              <View style={_styles.modal_header}>
                <Pressable onPress={() => this.setState({modalVisible: false})}>
                  <AntDesign name="arrowleft" color={colors.light} size={24} />
                </Pressable>
                <Pressable>
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
                  <Image
                    source={{uri: this.getPhotoClient()}}
                    style={_styles.photo}
                  />
                  <View style={_styles.star_container}>
                    {this.state.stars.map(star => {
                      return (
                        <FontAwesome
                          name={star.name}
                          color={star.color}
                          size={24}
                          style={{marginRight: 5}}
                          key={star.id}
                        />
                      );
                    })}
                  </View>
                  <Text style={_styles.pseudo}>
                    {this.state.item ? this.state.item.client.pseudo : null}
                  </Text>
                  <Text style={_styles.article_name_modal}>
                    {this.state.item ? this.state.item.nom_objet : null}
                  </Text>
                  <View style={_styles.info_container}>
                    <Text style={[styles.text, _styles.info_text]}>Ref :</Text>
                    <Text style={[styles.text, _styles.info_text]}>
                      {this.state.item ? this.state.item.ref : null}
                    </Text>
                  </View>
                  <View style={_styles.info_container}>
                    <Text style={[styles.text, _styles.info_text]}>Date :</Text>
                    <Text style={[styles.text, _styles.info_text]}>
                      {this.state.item
                        ? shortDate(this.state.item.updated_at)
                        : null}
                    </Text>
                  </View>
                  <View style={_styles.info_container}>
                    <Text style={[styles.text, _styles.info_text]}>
                      Montant :
                    </Text>
                    <Text style={[styles.text, _styles.info_text]}>
                      {this.state.item ? price(this.state.item.montant) : null}{' '}
                      FCFA
                    </Text>
                  </View>
                  <View style={_styles.info_container}>
                    <Text style={[styles.text, _styles.info_text]}>
                      Mode de remise :
                    </Text>
                    <Text style={[styles.text, _styles.info_text]}>
                      {this.state.item ? this.state.item.mode_remise : null}
                    </Text>
                  </View>
                  <View style={_styles.info_container}>
                    <Text style={[styles.text, _styles.info_text]}>
                      Catégorie :
                    </Text>
                    <Text style={[styles.text, _styles.info_text]}>
                      {this.state.item ? this.state.item.categorie : null}
                    </Text>
                  </View>
                  <View style={_styles.info_container}>
                    <Text style={[styles.text, _styles.info_text]}>Etat :</Text>
                    <Text style={[styles.text, _styles.info_text]}>
                      {this.state.item
                        ? this.state.states[Number(this.state.item.etat)]
                        : null}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
  renderListContent(item) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={_styles.list_content}
        onPress={() => this.showModal(item)}>
        <View style={{paddingTop: 5}}>
          <View style={_styles.indicator} />
        </View>
        <View style={{marginLeft: 10, flex: 1}}>
          <Text style={_styles.article_name}>{item.nom_objet}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[styles.text, {color: colors.primary, fontWeight: '700'}]}>
              {item.vendeur.pseudo}
            </Text>
            <Entypo
              name="arrow-long-right"
              size={18}
              style={{marginTop: 2, marginHorizontal: 5}}
            />
            <Text
              style={[styles.text, {color: colors.success, fontWeight: '700'}]}>
              {item.acheteur.pseudo}
            </Text>
          </View>
          <Text style={styles.text}>{item.ref}</Text>
        </View>
        <View>
          <Text style={[styles.text, _styles.article_prix]}>
            {price(item.montant)} FCFA
          </Text>
          <Text
            style={[
              _styles.article_state,
              this.state.states[Number(item.etat)] === 'Annuler'
                ? {color: colors.danger}
                : {},
            ]}>
            {this.state.states[Number(item.etat)]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  showLoading() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }
  componentDidMount() {
    axios
      .get(api_url('offre/history'))
      .then(response => {
        this.setState({
          data: response.data.histories,
          states: response.data.states,
        });
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({loading: false});
      });
  }
  showModal(item) {
    this.setState({
      item: item,
      stars: getStars(item.client),
      modalVisible: true,
    });
  }
  getPhotoClient() {
    if (this.state.item) {
      if (this.state.item.client.photo) {
        return public_url('images/profils/' + this.state.item.client.photo);
      }
      return public_url('images/avatar.png');
    }
    return null;
  }
}
const _styles = StyleSheet.create({
  main_container: {
    flex: 1,
    position: 'relative',
  },
  date: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontFamily: 'Feather',
    color: colors.gray,
    borderBottomColor: colors.primary,
    borderBottomWidth: 1,
    fontSize: 16,
  },
  list_content: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  article_name: {
    color: colors.primary,
    fontFamily: 'Feather',
  },
  article_user: {
    marginTop: 5,
    fontSize: 14,
  },
  article_prix: {
    fontFamily: 'Feather',
    textAlign: 'right',
  },
  article_state: {
    marginTop: 5,
    color: colors.success,
    fontFamily: 'Feather',
    fontSize: 14,
    textAlign: 'right',
  },

  /**
   * Modal
   */
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
  modal_content: {
    flex: 1,
    minHeight: 400,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
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
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 60,
    position: 'absolute',
    top: -30,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  star_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  pseudo: {
    textAlign: 'center',
    fontFamily: 'Feather',
    fontSize: 17,
    color: colors.primary,
    marginTop: 10,
  },
  article_name_modal: {
    fontSize: 24,
    fontFamily: 'Feather',
    textAlign: 'center',
    marginTop: 10,
    color: colorScheme === 'dark' ? colors.light : colors.dark,
    marginBottom: 30,
  },
  info_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  info_text: {
    fontSize: 17,
  },
});

export default Historique;
