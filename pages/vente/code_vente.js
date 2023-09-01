/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from './header';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';

class CodeVente extends Component {
  state = {
    first: null,
    second: null,
    third: null,
    fourth: null,
    n_of_key: 0,
  };
  getKeyboard(value) {
    if (value >= 0) {
      switch (this.state.n_of_key) {
        case 0:
          this.setState({first: value});
          this.setState({n_of_key: this.state.n_of_key + 1});
          break;
        case 1:
          this.setState({second: value});
          this.setState({n_of_key: this.state.n_of_key + 1});
          break;
        case 2:
          this.setState({third: value});
          this.setState({n_of_key: this.state.n_of_key + 1});
          break;
        case 3:
          this.setState({fourth: value});
          this.setState({n_of_key: this.state.n_of_key + 1});
          break;
        default:
          break;
      }
    } else {
      switch (this.state.n_of_key) {
        case 1:
          this.setState({first: null});
          break;
        case 2:
          this.setState({second: null});
          break;
        case 3:
          this.setState({third: null});
          break;
        case 4:
          this.setState({fourth: null});
          break;
        default:
          break;
      }
      if (this.state.n_of_key > 0) {
        this.setState({n_of_key: this.state.n_of_key - 1});
      }
    }
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Header progress={3} navigation={this.props.navigation} />
        <View style={[styles.banner, boxShadow.depth_2]}>
          <Fontisto
            name="locked"
            size={32}
            color={colors.gray}
            style={[styles.lock, boxShadow.depth_10]}
          />
          <Text style={styles.banner_title}>Saisissez votre code secret</Text>
          <View style={styles.input_container}>
            <Text style={styles.input_item}>
              {this.state.first ? '*' : null}
            </Text>
            <Text style={styles.input_item}>
              {this.state.second ? '*' : null}
            </Text>
            <Text style={styles.input_item}>
              {this.state.third ? '*' : null}
            </Text>
            <Text style={styles.input_item}>
              {this.state.fourth ? '*' : null}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.forgot_link}>Code oublié ?</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.key_container}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(1)}>
              <Text style={styles.key_item}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(2)}>
              <Text style={styles.key_item}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(3)}>
              <Text style={styles.key_item}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(4)}>
              <Text style={styles.key_item}>4</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.key_container}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(5)}>
              <Text style={styles.key_item}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(6)}>
              <Text style={styles.key_item}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(7)}>
              <Text style={styles.key_item}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(8)}>
              <Text style={styles.key_item}>8</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.key_container}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(9)}>
              <Text style={styles.key_item}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(0)}>
              <Text style={styles.key_item}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.getKeyboard(-1)}>
              <Text style={styles.key_item}>
                <Feather name="delete" style={{fontSize: 42}} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingHorizontal: 20, marginTop: 20}}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.button_text}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginTop: -75,
    backgroundColor: 'white',
    minHeight: 150,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  banner_title: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.primary,
    marginTop: 20,
  },
  lock: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: -30,
  },
  input_container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input_item: {
    width: 50,
    height: 50,
    borderWidth: 1,
    marginRight: 10,
    borderColor: colors.secondary,
    marginTop: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 28,
    fontFamily: 'Feather',
  },
  key_container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  key_item: {
    width: 70,
    height: 70,
    borderWidth: 1,
    marginRight: 10,
    borderColor: colors.gray,
    marginTop: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 42,
    color: colors.primary,
    fontFamily: 'Feather',
  },
  forgot_link: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.secondary,
  },

  button: {
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  button_text: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.light,
    textTransform: 'uppercase',
  },
});

export default CodeVente;
