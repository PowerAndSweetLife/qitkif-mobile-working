/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {colors} from '../helpers/colors';
import Header from './components/header';
import Footer2 from './components/footer_2';
import {api_url, public_url} from '../helpers/url';
import axios from 'axios';
import {styles} from '../helpers/styles';

class Promotion extends Component {
  state = {
    loading: true,
    data: [],
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="News" navigation={this.props.navigation} />
        <View style={_styles.main_container}>
          {this.showLoading()}
          <FlatList
            data={this.state.data}
            renderItem={({item}) => this.renderListContent(item)}
            keyExtractor={(item, index) => index}
          />
        </View>
        <Footer2 navigation={this.props.navigation} />
      </View>
    );
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
  renderListContent(item) {
    return (
      <TouchableOpacity
        style={_styles.items}
        onPress={() =>
          this.props.navigation.navigate('PromotionExterne', {lien: item.lien})
        }>
        <View style={_styles.icon_container}>
          <ImageBackground
            source={{uri: public_url('images/icon_promotion/' + item.icon)}}
            resizeMode="contain"
            style={_styles.icon}
          />
        </View>
        <View style={[_styles.text_container]}>
          <Text style={[styles.text, _styles.text]}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  componentDidMount() {
    axios
      .get(api_url('promotion/getAll'))
      .then(response => {
        this.setState({data: response.data.promotions});
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
  icon_container: {
    height: 35,
    width: 45,
  },
  icon: {
    flex: 1,
  },
  text_container: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Feather',
    // color: colors.dark,
  },
});

export default Promotion;
