/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Appearance,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from './header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {api_url, public_url} from '../../helpers/url';
import {connect} from 'react-redux';
import {setUser} from '../../store/slices/achat_slice';
import {styles} from '../../helpers/styles';

const colorScheme = Appearance.getColorScheme();

class ChoixVendeur extends Component {
  state = {
    query: '',
    data: [],
    showLoading: false,
    loadMore: false,
    page: 1,
    endOfList: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header progress={1} navigation={this.props.navigation} />
        <View style={[_styles.banner, boxShadow.depth_2]}>
          <Text style={_styles.banner_title}>
            Faire une proposition{' '}
            {this.props.route.params ? 'de vente' : "d'achat"}
          </Text>
          <Text style={[styles.text, _styles.banner_description]}>
            Trouvez {this.props.route.params ? "l'acheteur" : 'le vendeur'} via
            N° téléphone, Email ou identifiant
          </Text>
          <View style={_styles.search_container}>
            <TextInput
              style={[styles.input, _styles.search_field]}
              placeholder="Recherche"
              onChangeText={value => this.setState({query: value})}
            />
            <TouchableOpacity
              style={_styles.search_icon}
              onPress={() => this.search()}>
              <FontAwesome name="search" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={_styles.search_result}>
          {this.showLoading()}
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            renderItem={({item}) => this.renderListContent(item)}
            keyExtractor={(item, index) => index}
            onEndReached={() => this.loadMoreData()}
            onEndReachedThreshold={0.1}
            ListFooterComponent={this.footerLoading()}
          />
        </View>
      </View>
    );
  }
  renderListContent(item) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={_styles.list_content}
        onPress={() => this.selected(item)}>
        <View style={_styles.user_photo_container}>
          <Image
            source={
              item.photo
                ? {uri: public_url('images/profils/' + item.photo)}
                : {uri: public_url('images/avatar.png')}
            }
            style={_styles.photo}
          />
        </View>
        <View style={{marginLeft: 10}}>
          <Text style={[styles.text, _styles.user_name]}>{item.pseudo}</Text>
          <Text style={[styles.text, _styles.user_contact]}>
            {item.firstname} {item.lastname}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  showLoading() {
    if (this.state.showLoading) {
      return (
        <View style={[styles.loading, _styles.loading]}>
          <ActivityIndicator size="small" color={colors.secondary} />
        </View>
      );
    }
    return false;
  }
  footerLoading() {
    if (this.state.loadMore) {
      if (this.state.endOfList) {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: 10,
            }}>
            <Text style={{fontFamily: 'Feather'}}>Liste terminé</Text>
          </View>
        );
      }
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 10,
          }}>
          <ActivityIndicator
            size="small"
            color={colors.gray}
            style={{marginRight: 10}}
          />
          <Text style={[styles.text, {fontFamily: 'Feather'}]}>
            Chargement...
          </Text>
        </View>
      );
    }
    return null;
  }
  search() {
    this.setState({showLoading: true, page: 1});
    axios
      .post(
        api_url('user/search'),
        {
          query: this.state.query,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        this.setState({data: response.data.users});
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({showLoading: false});
      });
  }
  loadMoreData() {
    this.setState({loadMore: true, page: this.state.page++});
    axios
      .post(
        api_url('user/loadMore'),
        {
          query: this.state.query,
          page: this.state.page,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        if (response.data.overflow) {
          this.setState({endOfList: true});
        } else {
          this.setState({data: [...this.state.data, ...response.data.users]});
          this.setState({loadMore: false});
        }
      })
      .catch(error => {})
      .finally(() => {
        this.setState({showLoading: false});
      });
  }
  selected(user) {
    this.props.dispatch(setUser(user));
    let type = 'achat';
    if (this.props.route.params) {
      type = 'vente';
    }
    this.props.navigation.navigate('VendeurSelected', {type: type});
  }
}

const _styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginTop: -75,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    minHeight: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner_title: {
    fontSize: 17,
    fontFamily: 'Feather',
    color: colors.primary,
  },
  banner_description: {
    marginTop: 10,
  },
  search_container: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: 10,
  },
  search_field: {
    borderColor: colors.primary,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  search_icon: {
    position: 'absolute',
    top: 22,
    right: 25,
  },
  search_result: {
    flex: 1,
    paddingHorizontal: 20,
    position: 'relative',
  },
  loading: {
    left: 20,
  },
  list_content: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  user_photo_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  user_name: {
    fontSize: 17,
  },
  user_contact: {
    color: colors.gray,
  },
});

const mapStateToProps = state => {
  const {achat} = state;
  return {achat};
};

export default connect(mapStateToProps)(ChoixVendeur);
