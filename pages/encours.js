/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../helpers/colors';
import Header from './components/header';
import Footer from './components/footer';
import axios from 'axios';
import {api_url} from '../helpers/url';
import {styles} from '../helpers/styles';
import {price} from '../helpers/util';

import Entypo from 'react-native-vector-icons/Entypo';

class Encours extends Component {
  state = {
    loading: true,
    data: [],
    states: [],
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="En cours" navigation={this.props.navigation} />
        <View style={_styles.main_container}>
          <SectionList
            sections={this.state.data}
            renderItem={({item}) => this.renderListContent(item)}
            renderSectionHeader={({section}) => (
              <Text style={_styles.date}>{section.date}</Text>
            )}
            keyExtractor={(item, index) => `basicListEntry-${index}`}
          />
          {this.showLoading()}
        </View>
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
  renderListContent(item) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={_styles.list_content}
        onPress={() => this.goToDetail(item)}>
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
          <Text style={_styles.article_state}>
            {this.state.states[Number(item.etat)]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  componentDidMount() {
    axios
      .get(api_url('offre/inprogress'))
      .then(response => {
        this.setState({
          data: response.data.lists,
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
  goToDetail(item) {
    this.props.navigation.navigate('EncoursDetail', {idOffre: item.id});
  }
  showLoading() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      );
    }
    return null;
  }
}
const _styles = StyleSheet.create({
  main_container: {
    flex: 1,
    position: 'relative',
    paddingBottom: 60,
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
    textAlign: 'right',
  },
  article_state: {
    marginTop: 5,
    color: colors.success,
    fontFamily: 'Feather',
    fontSize: 14,
    textAlign: 'right',
  },
});

export default Encours;
