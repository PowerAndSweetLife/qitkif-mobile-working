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
import {colors} from '../../helpers/colors';
import Footer from '../components/footer';
import Header from '../components/header';
import axios from 'axios';
import {api_url} from '../../helpers/url';
import {
  axiosConfig,
  getUnreadNotification,
  longDate,
  state_offre,
} from '../../helpers/util';
import {connect} from 'react-redux';
import {setScreenNotification} from '../../store/slices/screen_slice';
import {styles} from '../../helpers/styles';

class NotificationList extends Component {
  state = {
    data: [],
    filter_active: 'unread',
    notifItem: null,
    loadingVisible: true,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="Notifications" navigation={this.props.navigation} />
        <View style={_styles.list_container}>
          <FlatList
            data={this.state.data}
            renderItem={({item}) => this.renderListContent(item)}
            keyExtractor={(item, index) => index}
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
        style={_styles.list_item}
        onPress={() => this.chooseAction(item)}
        disabled={item.is_read !== 0}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.text, {fontWeight: '700'}]}>{item.ref}</Text>
          {item.is_read !== 0
            ? null
            : this.getButtonText(item.user_action, item.info)}
        </View>
        <Text style={styles.text}>{longDate(item.created_at)}</Text>
        <Text style={styles.text}>{this.setMessage(item)}</Text>
        <Text style={[styles.text, {color: colors.primary}]}>
          Objet : {item.offre.nom_objet.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
  filter_(value) {
    this.setState({filter_active: value});
    this.fetchData(value);
  }
  showLoading() {
    if (this.state.loadingVisible) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      );
    }
  }
  getButtonText(action, info) {
    if (action === 'fermeture') {
      return (
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.text, {color: colors.danger, marginRight: 20}]}>
            {info}
          </Text>
          <Text style={[styles.text, {color: colors.success}]}>
            MARQUER COMME LUE
          </Text>
        </View>
      );
    }
    return <Text style={[styles.text, {color: colors.success}]}>REPONDRE</Text>;
  }
  chooseAction(item) {
    switch (item.user_action) {
      case 'validation':
        this.props.navigation.navigate('WaitValidation', {data: item});
        break;
      case 'validation_contre':
        this.props.navigation.navigate('WaitValidation', {data: item});
        break;
      case 'paiement':
        this.props.navigation.navigate('ChoixPaiement', {data: item});
        break;
      case 'active_paiement':
        this.props.navigation.navigate('ActivePaiement', {data: item});
        break;
      case 'preparation':
        this.props.navigation.navigate('ValidationCommande', {data: item});
        break;
      case 'livraison':
        this.props.navigation.navigate('AttenteLivraison', {data: item});
        break;
      case 'litige':
        this.markAsRead(item.id);
        this.props.navigation.navigate('ServiceClient');
        break;
      default:
        this.markAsRead(item.id);
        break;
    }
  }
  componentDidMount() {
    this.props.dispatch(setScreenNotification(true));
    this.fetchData();
  }
  componentWillUnmount() {
    this.props.dispatch(setScreenNotification(false));
  }
  fetchData(type = 'all') {
    axios
      .get(api_url('notification/lists/' + type))
      .then(response => {
        console.log(response.data);
        this.setState({data: response.data.notifications});
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({loadingVisible: false});
      });
  }
  markAsRead(id) {
    axios
      .post(api_url('notification/markAsRead'), {idNotif: id}, axiosConfig)
      .then(res => {
        this.fetchData();
        getUnreadNotification();
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  setMessage(item) {
    // if (
    //   Number(item.offre.expired) &&
    //   Number(item.etat) === state_offre.CANCEL
    // ) {
    //   return null;
    // }
    // if (
    //   Number(item.offre.etat) === state_offre.CANCEL &&
    //   Number(item.offre.user_cancel) === Number(this.props.logged.id)
    // ) {
    //   return 'Vous avez annulé cette offre';
    // }
    // if (
    //   Number(item.offre.rejected) &&
    //   Number(item.offre.user_reject) === Number(this.props.logged.id)
    // ) {
    //   return 'Vous avez rejeté cette offre';
    // }

    return item.message;
  }
}

const _styles = StyleSheet.create({
  filter_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  filter_active: {
    borderBottomColor: colors.dark,
    borderBottomWidth: 3,
    color: colors.dark,
  },
  filter_text: {
    fontFamily: 'Feather',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.gray,
  },
  list_container: {
    flex: 1,
    position: 'relative',
    marginBottom: 60,
  },
  list_item: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
});

const mapStateToProps = state => {
  const {screen, unread, logged} = state;
  return {screen, unread, logged};
};

export default connect(mapStateToProps)(NotificationList);
