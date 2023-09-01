/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Appearance,
  Pressable,
} from 'react-native';
import {Button, NumberPad} from '../elements';
import {boxShadow} from '../helpers/box_shadow';
import {colors} from '../helpers/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import {api_url, public_url} from '../helpers/url';
import axios from 'axios';
import {styles} from '../helpers/styles';
import {getStars, price, sendNotification} from '../helpers/util';

const colorScheme = Appearance.getColorScheme();

export default class ModificationOffre extends Component {
  state = {
    modeRemise: ['main propre', 'livraison'],
    offre: this.props.route.params.offre,
    montant: null,
    remise: null,
    message: null,
    loadingVisible: false,
    stars: getStars(this.props.route.params.offre.client),
    showKP: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView style={styles.wrapper} keyboardShouldPersistTaps="handled">
          <View style={_styles.main_container}>
            <View style={[_styles.header, boxShadow.depth_2]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.goBack()}>
                <AntDesign name="arrowleft" size={32} color={colors.light} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('Home')}>
                <Text style={_styles.header_title}>Annuler</Text>
              </TouchableOpacity>
            </View>
            <View style={[_styles.form_container, boxShadow.depth_10]}>
              <Image
                source={
                  this.state.offre.client.photo
                    ? {
                        uri: public_url(
                          'images/profils/' + this.state.offre.client.photo,
                        ),
                      }
                    : {uri: public_url('images/avatar.png')}
                }
                style={_styles.photo}
              />
              <View style={_styles.star_container}>
                {this.state.stars.map(star => {
                  return (
                    <FontAwesome
                      name={star.name}
                      color={star.color}
                      size={24}
                      style={{marginRight: 5}}
                      key={star.id}
                    />
                  );
                })}
              </View>
              <Text style={_styles.form_text}>
                {this.state.offre.client.pseudo} souhaite vous{' '}
                {this.state.offre.offre.action === 'vente'
                  ? 'vendre'
                  : 'acheter'}
              </Text>
              <Text style={[styles.text, _styles.form_article]}>
                {this.state.offre.offre.nom_objet.toUpperCase()}
              </Text>
              <Text style={_styles.form_prix}>
                {price(this.state.offre.montant)} FCFA
              </Text>
              <Text style={[_styles.form_text, {marginBottom: 10}]}>
                Vous pouvez apporter des modifications
              </Text>
              <View style={_styles.form_input_wrapper}>
                <Text style={_styles.form_label}>Mode de remise</Text>
                <SelectDropdown
                  data={this.state.modeRemise}
                  defaultValue={this.state.offre.offre.mode_remise}
                  buttonStyle={_styles.form_input}
                  buttonTextStyle={_styles.form_input}
                  dropdownStyle={{
                    backgroundColor:
                      colorScheme === 'dark' ? colors.dark : colors.light,
                  }}
                  rowTextStyle={{
                    color: colorScheme === 'dark' ? colors.light : colors.dark,
                  }}
                  onSelect={value => this.setState({remise: value})}
                />
              </View>
              <View style={_styles.form_input_wrapper}>
                <Text style={_styles.form_label}>Prix</Text>
                <Pressable
                  onPress={() => this.setState({showKP: true})}
                  style={[_styles.form_input, {paddingHorizontal: 15}]}>
                  <View pointerEvents="none">
                    <TextInput
                      style={[styles.text, {fontSize: 18}]}
                      // defaultValue={this.state.offre.montant.toString()}
                      value={this.state.montant}
                      // onChangeText={value => this.setState({montant: value})}
                      // keyboardType="decimal-pad"
                    />
                  </View>
                </Pressable>
                <Text style={_styles.form_curracy}>FCFA</Text>
              </View>
              <View style={_styles.form_textarea_wrapper}>
                <Text style={_styles.form_label}>
                  Laissez un message{'   '}(100 caractères max)
                </Text>
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  style={[_styles.form_textarea, {paddingHorizontal: 15}]}
                  onChangeText={value => this.setMessageValue(value)}
                  value={this.state.message}
                />
              </View>
            </View>
            <View style={_styles.button_wrapper}>
              <Button
                title="Envoyer la modification"
                bg={colors.success}
                onPress={() => this.submit()}
                loading={this.state.loadingVisible}
              />
            </View>
          </View>
        </ScrollView>
        <NumberPad
          default={this.state.montant}
          onPress={(value, show) =>
            this.setState({montant: value, showKP: show})
          }
          show={this.state.showKP}
        />
      </View>
    );
  }
  setLoading() {
    if (this.state.loadingVisible) {
      return (
        <ActivityIndicator
          size="small"
          color={colors.light}
          style={{marginRight: 10}}
        />
      );
    }
    return null;
  }
  setMessageValue(value) {
    if (value.length <= 100) {
      this.setState({message: value});
    } else {
      let oldState = this.state.message;
      this.setState({message: oldState});
    }
  }
  submit() {
    this.setState({loadingVisible: true});
    axios
      .post(
        api_url('offre/contreProposition'),
        {
          montant: this.state.montant
            ? this.state.montant
            : this.state.offre.montant,
          modeRemise:
            this.state.remise !== null
              ? this.state.remise
              : this.state.offre.offre.mode_remise,
          message: this.state.message,
          idOffre: this.state.offre.offre.id,
          idClient: this.state.offre.client.id,
          idNotif: this.state.offre.id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        console.log(response.data);
        if (response.data.success) {
          ToastAndroid.show('Offre modifié', ToastAndroid.LONG);
          //getUnreadNotification();
          sendNotification(this.state.offre.client.id);
          this.props.navigation.navigate('Home');
        }
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({loadingVisible: false});
      });
  }
}

const _styles = StyleSheet.create({
  main_container: {
    // height: Dimensions.get('window').height,
    flex: 1,
    marginBottom: 10,
  },
  header: {
    height: 150,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header_title: {
    color: colors.light,
    fontFamily: 'Feather',
    fontSize: 17,
  },
  form_container: {
    marginHorizontal: 15,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    marginTop: -60,
    minHeight: 300,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: -35,
  },
  star_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  form_text: {
    fontFamily: 'Feather',
    fontSize: 17,
    color: colors.primary,
    marginTop: 5,
  },
  form_article: {
    fontFamily: 'Feather',
    fontSize: 30,
    marginTop: 5,
    textAlign: 'center',
  },
  form_prix: {
    fontFamily: 'Feather',
    fontSize: 22,
    color: colors.primary,
  },
  form_input_wrapper: {
    borderColor: colors.primary,
    borderWidth: 1,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  form_label: {
    position: 'absolute',
    zIndex: 2,
    top: -12,
    left: 15,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    paddingHorizontal: 10,
    fontFamily: 'Feather',
    color: colors.primary,
  },
  form_input: {
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    fontFamily: 'Feather',
    color: colors.gray,
    textAlign: 'left',
    width: '100%',
    height: 48,
    textAlignVertical: 'center',
    fontSize: 18,
  },
  form_curracy: {
    position: 'absolute',
    right: 15,
    fontSize: 20,
    fontFamily: 'Feather',
    color: colors.primary,
  },
  form_textarea_wrapper: {
    borderColor: colors.primary,
    borderWidth: 1,
    width: '100%',
    height: 120,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  form_textarea: {
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    fontFamily: 'Feather',
    color: colors.gray,
    textAlign: 'left',
    width: '100%',
    height: 118,
    textAlignVertical: 'center',
    fontSize: 16,
  },
  button_wrapper: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
});
