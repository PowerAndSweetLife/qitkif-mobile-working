/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from './header';
import Entypo from 'react-native-vector-icons/Entypo';

class DetailVente extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Header progress={4} navigation={this.props.navigation} />

        <View style={[styles.banner, boxShadow.depth_2]}>
          <Image
            source={require('../../assets/img/avatar.png')}
            style={styles.photo}
          />
          <View style={styles.star_container}>
            <Entypo name="star" size={24} color={colors.gold} />
            <Entypo name="star" size={24} color={colors.gold} />
            <Entypo name="star" size={24} color={colors.gold} />
            <Entypo name="star" size={24} color={colors.gold} />
            <Entypo name="star" size={24} color={colors.gold} />
          </View>
          <Text style={styles.pseudo}>vous souhaiterez vendre à Marc 21</Text>
          <Text style={styles.article_name_modal}>PS4</Text>
          <Text style={styles.article_prix}>100 000 FCFA</Text>
          <View style={styles.info_container}>
            <Text style={styles.info_text}>Envoyer le :</Text>
            <Text style={styles.info_text}>12/12/2022 à 09:00</Text>
          </View>
          <View style={styles.info_container}>
            <Text style={styles.info_text}>Catégorie :</Text>
            <Text style={styles.info_text}>Multimedia</Text>
          </View>
          <View style={styles.info_container}>
            <Text style={styles.info_text}>Paiement :</Text>
            <Text style={styles.info_text}>+255 10 001 00</Text>
          </View>
          <View style={styles.info_container}>
            <Text style={styles.info_text}>Mode de remise :</Text>
            <Text style={styles.info_text}>Livraison</Text>
          </View>
          <View style={[styles.info_container, {marginTop: 20}]}>
            <Text style={styles.info_text}>Montant :</Text>
            <Text style={styles.info_text}>100 000 FCFA</Text>
          </View>
        </View>
        <View style={styles.main_container}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.button_text}>Envoyer ma proposition</Text>
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
    paddingBottom: 20,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 60,
    position: 'absolute',
    top: -30,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  star_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  pseudo: {
    textAlign: 'center',
    fontFamily: 'Feather',
    fontSize: 17,
    color: colors.primary,
    marginTop: 10,
  },
  article_name_modal: {
    fontSize: 24,
    fontFamily: 'Feather',
    textAlign: 'center',
    marginTop: 10,
    color: colors.dark,
  },
  article_prix: {
    fontFamily: 'Feather',
    fontSize: 24,
    color: colors.primary,
    marginVertical: 10,
  },
  info_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  info_text: {
    fontSize: 17,
    color: colors.dark,
    fontFamily: 'Feather',
  },
  main_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    height: 50,
    backgroundColor: colors.success,
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

export default DetailVente;
