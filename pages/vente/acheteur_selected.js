/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from './header';

class AcheteurSelected extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Header progress={1} navigation={this.props.navigation} />
        <View style={[styles.banner, boxShadow.depth_2]}>
          <Image
            source={require('../../assets/img/avatar.png')}
            style={styles.photo}
          />
          <Text style={styles.banner_title}>Marco 001</Text>
          <Text style={styles.banner_description}>Profil verifié</Text>

          <View style={styles.avis_container}>
            <Text style={styles.avis_text}>2 ventes / 1 achat</Text>
            <Text style={styles.avis_text}>0 Avis</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.profil_link}>Profil complet</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.main_container}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.button_text}>Suivant</Text>
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
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.gray,
    marginTop: -35,
    marginBottom: 10,
  },
  banner_title: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.primary,
  },
  banner_description: {
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.gray,
    textAlign: 'center',
  },
  avis_container: {
    alignItems: 'center',
    marginTop: 10,
    borderBottomColor: colors.gray,
    width: '100%',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  avis_text: {
    fontFamily: 'Feather',
    fontSize: 17,
    color: colors.dark,
  },
  profil_link: {
    textAlign: 'center',
    fontFamily: 'Feather',
    fontSize: 16,
    color: colors.primary,
    paddingVertical: 5,
  },
  main_container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  button: {
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_text: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.light,
    textTransform: 'uppercase',
  },
});

export default AcheteurSelected;
