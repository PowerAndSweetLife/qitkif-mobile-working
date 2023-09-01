/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from './header';

class MontantVente extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Header progress={3} navigation={this.props.navigation} />
        <View style={[styles.banner, boxShadow.depth_10]}>
          <Text style={styles.banner_title}>Montant de la proposition :</Text>
          <View style={styles.input_container}>
            <TextInput style={styles.input_field} />
            <Text style={styles.curracy}>FCFA</Text>
          </View>
        </View>
        <View style={styles.main_container}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.button_text}>Valider le montant</Text>
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
  input_container: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input_field: {
    borderColor: colors.gray,
    borderWidth: 1,
    flex: 1,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    fontFamily: 'Feather',
    fontSize: 18,
    color: colors.dark,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  curracy: {
    backgroundColor: colors.lightgray,
    height: 50,
    borderTopColor: colors.gray,
    borderRightColor: colors.gray,
    borderBottomColor: colors.gray,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    color: colors.primary,
    fontSize: 18,
    fontFamily: 'Feather',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
  },
  main_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  button_text: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.light,
    textTransform: 'uppercase',
  },
});

export default MontantVente;
