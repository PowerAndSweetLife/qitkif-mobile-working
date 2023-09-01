/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {styles} from '../../helpers/styles';
import Header from '../components/header';
import {colors} from '../../helpers/colors';
import axios from 'axios';
import {api_url} from '../../helpers/url';
import {price, shortDate} from '../../helpers/util';

export default class SelectOffre extends Component {
  state = {
    data: [],
    loading: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header
          title="Selectionnez une offre"
          navigation={this.props.navigation}
        />
        {this.showLoading()}
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={this.state.data}
          renderItem={({item}) => this.renderListContent(item)}
          keyExtractor={(item, index) => index}
          style={{padding: 15}}
        />
      </View>
    );
  }
  renderListContent(item) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={_styles.list_item}
        onPress={() => this.selectOffre(item)}>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.text, {color: colors.primary}]}>
              {item.reference}
            </Text>
            <Text style={styles.text}>{item.pseudo}</Text>
          </View>
          <Text style={styles.text}>{item.nom_objet}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.text}>{price(item.montant)} FCFA</Text>
            <Text style={[styles.text, {color: colors.gray, fontSize: 14}]}>
              {shortDate(item.updated_at)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  showLoading() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.secondary} />
        </View>
      );
    }
    return false;
  }
  componentDidMount() {
    axios
      .get(api_url('offre/selectOffre'))
      .then(res => {
        this.setState({data: res.data});
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
  selectOffre(item) {
    this.props.navigation.navigate('NewLitige', {
      selected: item,
      idNotif: this.props.route.params.idNotif,
    });
  }
}

const _styles = StyleSheet.create({
  list_item: {
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
