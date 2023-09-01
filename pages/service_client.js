/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {colors} from '../helpers/colors';
import Header from './components/header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import {api_url} from '../helpers/url';
import {styles} from '../helpers/styles';
import {connect} from 'react-redux';

class ServiceClient extends Component {
  state = {
    loading: true,
    data: [],
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="Service client" navigation={this.props.navigation} />
        <View style={_styles.main_container}>
          {this.setLoading()}
          <FlatList
            data={this.state.data}
            renderItem={({item}) => this.renderListContent(item)}
            keyExtractor={(item, index) => index}
          />
        </View>
        <View style={_styles.footer}>
          <TouchableOpacity
            style={_styles.footer_menu}
            onPress={() => this.assistance()}>
            <MaterialIcons
              name="headset-mic"
              size={20}
              style={_styles.footer_menu_icon}
              color={colors.light}
            />
            <Text style={[_styles.footer_menu_text, {color: colors.secondary}]}>
              Assistance
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  setLoading() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      );
    }
    return null;
  }
  renderListContent(item) {
    return (
      <TouchableOpacity
        style={_styles.items}
        onPress={() => this.openConversation(item)}>
        <View style={_styles.text_container}>
          <Text style={_styles.text_title}>Ticket N° {item.numero}</Text>
          {this.setListText(item)}
          <Text style={_styles.text_content}>{item.objet}</Text>
        </View>
        <View style={_styles.state_container}>
          <Text
            style={Number(item.closed) ? _styles.resolved : _styles.unresolved}>
            {Number(item.closed) ? 'Fermé' : 'Ouvert'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  setListText(item) {
    let self = this.props.logged;
    if (item.type === 'ticket') {
      return (
        <Text style={[_styles.text_title, {fontSize: 14}]}>
          Assistance technique
        </Text>
      );
    }
    let client = null;
    if (item.id_user === self.id) {
      client = item.vendeur.pseudo;
    }
    if (item.id_vendeur === self.id) {
      client = item.acheteur.pseudo;
    }
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[_styles.text_title, {fontSize: 14}]}>LITIGE</Text>
        <Entypo
          name="arrow-long-right"
          size={18}
          style={{marginHorizontal: 15}}
        />
        <Text style={{color: colors.success, fontWeight: '600'}}>{client}</Text>
      </View>
    );
  }
  newLitige() {
    this.props.navigation.navigate('NewLitige');
  }
  assistance() {
    this.props.navigation.navigate('Assistance');
  }
  openConversation(item) {
    this.props.navigation.navigate('Messenger', {
      id: item.id,
      numero: item.numero,
      date: item.created_at,
      closed: item.closed,
      type: item.type,
      ref: item.ref,
    });
  }
  componentDidMount() {
    axios
      .get(api_url('serviceClient/getAll'))
      .then(response => {
        this.setState({data: response.data.lists});
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.props.navigation.navigation('Login1');
        }
      })
      .finally(() => {
        this.setState({loading: false});
      });
  }
}

const _styles = StyleSheet.create({
  main_container: {
    flex: 1,
    position: 'relative',
  },
  items: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
  icon: {
    flex: 1,
  },
  text_container: {
    flex: 1,
    paddingRight: 15,
  },
  text_title: {
    fontFamily: 'Feather',
    color: colors.primary,
    fontSize: 17,
  },
  text_content: {
    fontFamily: 'Feather',
    color: colors.gray,
    fontSize: 16,
  },
  state_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  unresolved: {
    fontFamily: 'Feather',
    color: colors.danger,
  },
  resolved: {
    fontFamily: 'Feather',
    color: colors.success,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footer_menu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer_menu_icon: {
    backgroundColor: colors.secondary,
    padding: 7,
    borderRadius: 24,
  },
  footer_menu_text: {
    fontFamily: 'Feather',
    fontSize: 16,
    marginLeft: 10,
  },
  loading_container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  client_menu_text_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 60,
    borderLeftColor: colors.gray,
    borderLeftWidth: 1,
  },
});

const mapStateToProps = state => {
  const {logged} = state;
  return {logged};
};

export default connect(mapStateToProps)(ServiceClient);
