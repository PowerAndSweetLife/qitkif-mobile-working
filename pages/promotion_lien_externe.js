/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Appearance,
} from 'react-native';
import {colors} from '../helpers/colors';
import Header from './components/header';
import {WebView} from 'react-native-webview';
import {styles} from '../helpers/styles';

const colorScheme = Appearance.getColorScheme();

export default class PromotionExterne extends Component {
  state = {
    loading: true,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header title="News" navigation={this.props.navigation} />
        <View
          style={[
            styles.wrapper,
            {
              flex: 1,
              paddingBottom: 15,
              paddingHorizontal: 15,
              alignItems: 'center',
              position: 'relative',
            },
          ]}>
          <WebView
            source={{uri: this.props.route.params.lien}}
            style={[
              styles.wrapper,
              {paddingTop: 170, width: Dimensions.get('window').width},
            ]}
          />
          {this.showLoading()}
        </View>
      </View>
    );
  }
  showLoading() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          style={_styles.loading}
          size="large"
          color={colorScheme === 'dark' ? colors.light : colors.dark}
        />
      );
    }
    return null;
  }
  componentDidMount() {
    axios.get(this.props.route.params.lien).finally(() => {
      this.setState({loading: false});
    });
  }
}

const _styles = StyleSheet.create({
  button: {
    marginTop: 5,
    width: '100%',
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_text: {
    fontFamily: 'Feather',
    textTransform: 'uppercase',
    color: colors.light,
    fontSize: 18,
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: '100%',
    backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light,
  },
});
