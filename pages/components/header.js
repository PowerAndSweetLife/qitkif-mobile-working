/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Appearance,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import axios from 'axios';
import {api_url} from '../../helpers/url';
import {connect} from 'react-redux';

const colorScheme = Appearance.getColorScheme();

class Header extends Component {
  state = {
    menuVisible: false,
    logoutLoading: false,
  };
  render() {
    return (
      <View>
        <View style={[styles.header, boxShadow.depth_2]}>
          {this.goBackButton()}
          <Text style={styles.header_title}>{this.props.title}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{position: 'relative', flexDirection: 'row'}}
            onPress={() =>
              this.setState({menuVisible: !this.state.menuVisible})
            }>
            <FontAwesome name="bars" size={32} color={colors.light} />
            {this.props.unread.notification ? (
              <Text style={styles.badge}>{this.props.unread.notification}</Text>
            ) : null}
          </TouchableOpacity>
          {this.showMenu()}
        </View>
        {this.setLogoutLoading()}
      </View>
    );
  }
  showMenu() {
    if (this.state.menuVisible) {
      return (
        <View style={[styles.menu_container, boxShadow.depth_2]}>
          <TouchableOpacity
            style={styles.menu_item}
            onPress={() => this.gotoProfil()}>
            <FontAwesome
              name="user"
              size={20}
              color={colors.darkgray}
              style={{marginRight: 10}}
            />
            <Text style={styles.menu_item_text}>Mon profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menu_item}
            onPress={() => this.props.navigation.navigate('Compte')}>
            <Fontisto
              name="arrow-swap"
              size={20}
              color={colors.darkgray}
              style={{marginRight: 10}}
            />
            <Text style={styles.menu_item_text}>Mes transactions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menu_item}
            onPress={() => {
              this.props.navigation.navigate('NotificationList');
              this.setState({menuVisible: false});
            }}>
            <FontAwesome
              name="bell"
              size={20}
              color={colors.darkgray}
              style={{marginRight: 10}}
            />
            <Text style={styles.menu_item_text}>Notifications</Text>
            {this.props.unread.notification ? (
              <Text style={styles.badge_inline}>
                {this.props.unread.notification}
              </Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.logout()}
            style={{flexDirection: 'row'}}>
            <FontAwesome
              name="power-off"
              size={20}
              color={colors.darkgray}
              style={{marginRight: 10}}
            />
            <Text style={styles.menu_item_text}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
  gotoProfil() {
    this.props.navigation.navigate('Profil', {me: true});
    this.setState({menuVisible: false});
  }
  logout() {
    this.setState({logoutLoading: true, menuVisible: false});
    axios
      .get(api_url('logout'))
      .then(response => {
        if (response.data.success) {
          this.props.navigation.navigate('Welcome');
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.props.navigation.navigate('Welcome');
        }
      })
      .finally(() => {
        this.setState({logoutLoading: false});
      });
  }
  setLogoutLoading() {
    if (this.state.logoutLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={styles.logout_loading_text}>Déconnexion...</Text>
        </View>
      );
    }
  }
  goBackButton() {
    if (this.props.home === undefined) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.props.navigation.goBack()}>
          <FontAwesome name="arrow-left" color={colors.light} size={32} />
        </TouchableOpacity>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    position: 'relative',
    zIndex: 10,
  },

  header_title: {
    color: colors.light,
    fontFamily: 'Feather',
    fontSize: 18,
  },
  menu_container: {
    position: 'absolute',
    top: 45,
    right: 15,
    minWidth: Dimensions.get('window').width / 2,
    backgroundColor: colorScheme === 'dark' ? colors.dark : 'white',
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? colors.darkgray : colors.light,
    zIndex: 200,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menu_item: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu_item_text: {
    fontFamily: 'Feather',
    fontSize: 17,
  },
  loading_container: {
    position: 'absolute',
    zIndex: 201,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: Dimensions.get('screen').height,
    backgroundColor: '#000000A0',
  },
  logout_loading_text: {
    color: colors.light,
    fontFamily: 'Feather',
    fontWeight: '700',
  },
  badge: {
    fontFamily: 'Feather',
    color: colors.light,
    backgroundColor: colors.danger,
    height: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 5,
    borderRadius: 10,
    marginLeft: -10,
    marginTop: -5,
    fontWeight: '700',
  },
  badge_inline: {
    fontFamily: 'Feather',
    color: colors.light,
    backgroundColor: colors.danger,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 5,
    borderRadius: 5,
    fontWeight: '700',
    height: 15,
    marginLeft: 5,
    fontSize: 12,
  },
});

const mapStateToProps = state => {
  const {unread} = state;
  return {unread};
};

export default connect(mapStateToProps)(Header);
