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
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from './header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class ChoixAcheteur extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Header progress={1} navigation={this.props.navigation} />
        <View style={[styles.banner, boxShadow.depth_2]}>
          <Text style={styles.banner_title}>
            Faire une proposition de vente
          </Text>
          <Text style={styles.banner_description}>
            Trouvez l'acheteur vie N° téléphone, Email ou identifiant
          </Text>
          <View style={styles.search_container}>
            <TextInput style={styles.search_field} placeholder="Recherche" />
            <TouchableOpacity style={styles.search_icon}>
              <FontAwesome name="search" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.search_result}>
          <FlatList
            data={data}
            renderItem={({item}) => this.renderListContent(item)}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
    );
  }
  renderListContent(item) {
    return (
      <TouchableOpacity activeOpacity={0.6} style={styles.list_content}>
        <View style={styles.user_photo_container}>
          <Image source={item.photo} style={styles.photo} />
        </View>
        <View style={{marginLeft: 10}}>
          <Text style={styles.user_name}>
            {item.firstname} {item.lastname}
          </Text>
          <Text style={styles.user_contact}>{item.telephone}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const data = [
  {
    photo: require('../../assets/img/avatar.png'),
    firstname: 'John',
    lastname: 'Doe',
    telephone: '+255 10 001 01',
    id: 1,
  },
  {
    photo: require('../../assets/img/avatar.png'),
    firstname: 'Anne',
    lastname: 'Marie',
    telephone: '+255 10 001 02',
    id: 1,
  },
];

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginTop: -75,
    backgroundColor: 'white',
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
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.gray,
    textAlign: 'center',
    marginTop: 10,
  },
  search_container: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: 10,
  },
  search_field: {
    borderColor: colors.primary,
    borderWidth: 1,
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
    fontFamily: 'Feather',
    fontSize: 17,
    color: colors.dark,
  },
  user_contact: {
    fontFamily: 'Feather',
    fontSize: 16,
    color: colors.gray,
  },
});

export default ChoixAcheteur;
