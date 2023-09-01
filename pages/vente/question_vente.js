/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from './header';
import Entypo from 'react-native-vector-icons/Entypo';

class QuestionVente extends Component {
  state = {
    modalVisible: false,
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <Header progress={2} navigation={this.props.navigation} />
          <View style={[styles.banner, boxShadow.depth_2]}>
            <Text style={styles.banner_title}>Que voulez-vous vendre ?</Text>
            <View style={styles.response_choix}>
              <TouchableOpacity
                style={[styles.response_choix_items, boxShadow.depth_10]}>
                <Text style={styles.response_choix_title}>Objet</Text>
                <Text style={styles.response_choix_description}>
                  T-shirt, meuble, ...
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.response_choix_items, boxShadow.depth_10]}>
                <Text style={styles.response_choix_title}>Services</Text>
                <Text style={styles.response_choix_description}>
                  Location, ...
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.response_choix_autre, boxShadow.depth_10]}>
              <Entypo
                name="dots-three-horizontal"
                size={24}
                color={colors.secondary}
              />
              <Text
                style={[
                  styles.response_choix_title,
                  {color: colors.dark, marginLeft: 10},
                ]}>
                Autre
              </Text>
            </TouchableOpacity>

            <Text style={styles.banner_title}>
              Comment l'objet sera-t-il remis ?
            </Text>
            <View style={styles.response_choix}>
              <TouchableOpacity
                style={[styles.response_choix_items, boxShadow.depth_10]}>
                <Text style={styles.response_choix_mode}>Main propre</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.response_choix_items, boxShadow.depth_10]}>
                <Text style={styles.response_choix_mode}>Livraison</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Nom de l'objet"
              style={styles.object_field}
            />

            <TextInput
              multiline={true}
              numberOfLines={4}
              style={styles.message_field}
              placeholder="Votre message"
            />

            <TouchableOpacity style={styles.button}>
              <Text style={styles.button_text}>Suivant</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: !this.state.modalVisible});
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modal_body}>
              <Text style={styles.modal_title}>Choisissez une catégorie</Text>
              <TouchableOpacity style={styles.modal_items_container}>
                <Image
                  source={require('../../assets/img/maison.png')}
                  style={styles.modal_item_image}
                />
                <Text style={styles.modal_item_text}>Maison</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modal_items_container}>
                <Image
                  source={require('../../assets/img/multimedia.png')}
                  style={styles.modal_item_image}
                />
                <Text style={styles.modal_item_text}>Multimedia</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modal_items_container}>
                <Image
                  source={require('../../assets/img/fonctionnement.png')}
                  style={styles.modal_item_image}
                />
                <Text style={styles.modal_item_text}>Sport & Loisir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginTop: 20,
  },
  response_choix: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  response_choix_items: {
    backgroundColor: '#FFF',
    width: '45%',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  response_choix_autre: {
    backgroundColor: '#FFF',
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  response_choix_title: {
    fontSize: 17,
    fontFamily: 'Feather',
    fontWeight: '700',
    color: colors.primary,
  },
  response_choix_description: {
    fontFamily: 'Feather',
    color: colors.gray,
  },
  response_choix_mode: {
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.primary,
    marginVertical: 10,
  },
  object_field: {
    borderColor: colors.gray,
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    fontFamily: 'Feather',
    fontSize: 18,
    color: colors.dark,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  message_field: {
    borderColor: colors.gray,
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    fontFamily: 'Feather',
    fontSize: 16,
    color: colors.dark,
    paddingHorizontal: 10,
    marginBottom: 20,
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
  /**
   * Modal
   */
  centeredView: {
    flex: 1,
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  modal_body: {
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  modal_title: {
    fontSize: 16,
    fontFamily: 'Feather',
    color: colors.primary,
    marginBottom: 20,
  },
  modal_items_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
  },
  modal_item_image: {
    width: 30,
    height: 30,
  },
  modal_item_text: {
    flex: 1,
    marginLeft: 20,
    fontFamily: 'Feather',
    fontSize: 18,
    color: colors.dark,
    fontWeight: 'bold',
  },
});

export default QuestionVente;
