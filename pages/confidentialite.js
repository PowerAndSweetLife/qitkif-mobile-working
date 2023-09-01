/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {colors} from '../helpers/colors';
import {api_url} from '../helpers/url';
import Header from './components/header';
import {WebView} from 'react-native-webview';
export default class Confidentialite extends Component {
  // state = {
  //   loading: true,
  //   source: null,
  // };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header
          title="Condition & confidentialité"
          navigation={this.props.navigation}
        />
        <View
          style={{
            flex: 1,
            paddingBottom: 15,
            paddingHorizontal: 15,
            alignItems: 'center',
            position: 'relative',
          }}>
          <WebView
            source={{uri: api_url('confidentialite')}}
            style={{paddingTop: 170, width: Dimensions.get('window').width}}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={styles.button_text}>J'ai compris</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  // showLoading() {
  //   if (this.state.loading) {
  //     return (
  //       <ActivityIndicator
  //         style={styles.loading}
  //         size="large"
  //         color={colors.secondary}
  //       />
  //     );
  //   }
  //   return null;
  // }
  // componentDidMount() {
  //   axios
  //     .get(base_url('confidentialite'))
  //     .then(res => {
  //       this.setState({source: res.data});
  //     })
  //     .finally(() => {
  //       this.setState({loading: false});
  //     });
  // }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
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
    backgroundColor: colors.light,
  },
});
