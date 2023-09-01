/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Appearance,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from '../paiement/header';
import {api_url, public_url} from '../../helpers/url';
import axios from 'axios';
import {Button, Confirm} from '../../elements';
import {axiosConfig, sendNotification} from '../../helpers/util';
import {styles} from '../../helpers/styles';
import SelectDropdown from 'react-native-select-dropdown';

const colorScheme = Appearance.getColorScheme();

export default class Livraison extends Component {
  state = {
    data: this.props.route.params.data,
    duration: '24h',
    duration_error: false,
    justification: null,
    justification_error: false,
    loadingVisible: false,
    showConfirm: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header navigation={this.props.navigation} />
        <View style={_styles.main_container}>
          <View style={[_styles.content, boxShadow.depth_2]}>
            <View style={[_styles.photo_container, boxShadow.depth_10]}>
              <Image
                source={{uri: public_url('images/livraison-rapide.png')}}
                style={_styles.photo}
              />
            </View>
            <Text style={_styles.pseudo}>Mise en livraison</Text>
            <View
              style={[
                _styles.input_container,
                this.state.duration_error
                  ? {borderColor: colors.danger}
                  : {borderColor: colors.primary},
              ]}>
              {/* <TextInput
                style={_styles.input}
                onChangeText={value => this.setDuration(value)}
                keyboardType="decimal-pad"
              /> */}
              <SelectDropdown
                data={[
                  '1h',
                  '2h',
                  '4h',
                  '8h',
                  '12h',
                  '24h',
                  '36h',
                  '48h',
                  '72h',
                ]}
                defaultValue={'24h'}
                buttonStyle={_styles.form_input}
                buttonTextStyle={_styles.form_input}
                dropdownStyle={{
                  backgroundColor:
                    colorScheme === 'dark' ? colors.dark : colors.light,
                }}
                rowTextStyle={{
                  color: colorScheme === 'dark' ? colors.light : colors.dark,
                }}
                onSelect={value => this.setDuration(value)}
              />
              <Text style={_styles.label}>Durée du livraison</Text>
            </View>
            <View
              style={[
                _styles.input_container,
                {height: 100},
                this.state.justification_error
                  ? {borderColor: colors.danger}
                  : {borderColor: colors.primary},
              ]}>
              <TextInput
                onChangeText={value => this.setJustification(value)}
                multiline={true}
                style={[_styles.input, {height: 100}]}
              />
              <Text style={_styles.label}>Justification</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Button
              bg={colors.danger}
              title="Annuler"
              onPress={() => this.setState({showConfirm: true})}
              disabled={this.state.loadingVisible}
              style={{width: '45%'}}
            />
            <Button
              bg={colors.primary}
              title="Envoyer"
              onPress={() => this.submit()}
              loading={this.state.loadingVisible}
              style={{width: '50%'}}
            />
          </View>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={[
              _styles.button,
              this.state.loadingVisible ? {opacity: 0.8} : {},
            ]}
            disabled={this.state.loadingVisible ? true : false}
            onPress={() => this.submit()}>
            {this.setLoading()}
            <Text style={_styles.button_text}>ENVOYER</Text>
          </TouchableOpacity> */}
        </View>
        <Confirm
          show={this.state.showConfirm}
          onConfirm={() => this.cancel()}
          onCancel={() => this.setState({showConfirm: false})}
          loading={this.state.cancelling}
        />
      </View>
    );
  }
  setDuration(value) {
    if (value.trim().length === 0) {
      this.setState({duration: null});
    } else {
      this.setState({duration: parseInt(value, 10)});
    }
  }
  setJustification(value) {
    if (value.trim().length === 0) {
      this.setState({justification: null});
    } else {
      this.setState({justification: value});
    }
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
  submit() {
    this.setState({
      duration_error: false,
      justification_error: false,
    });
    let error = false;
    if (this.state.duration === null) {
      this.setState({duration_error: true});
      error = true;
    }
    if (this.state.justification === null) {
      this.setState({justification_error: true});
      error = true;
    }
    if (!error) {
      this.setState({loadingVisible: true});
      axios
        .post(
          api_url('offre/livraison'),
          {
            idOffre: this.state.data.offre.id,
            idNotif: this.state.data.id,
            idClient: this.state.data.client.id,
            duration: this.state.duration,
            justification: this.state.justification,
          },
          {
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
            },
          },
        )
        .then(response => {
          //getUnreadNotification();
          sendNotification(this.state.data.client.id);
          this.props.navigation.navigate('Home');
          if (response.data.success) {
            ToastAndroid.show(
              'Preparation de la livraison enregistré',
              ToastAndroid.LONG,
            );
          } else {
            if (response.data.expired) {
              ToastAndroid.show('Offre expiré!!!', ToastAndroid.LONG);
              this.cancel();
            }
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.props.navigation.navigate('Login1');
          }
        })
        .finally(() => {
          this.setState({loadingVisible: false});
        });
    }
  }
  cancel() {
    this.setState({cancelling: true});
    axios
      .post(
        api_url('offre/cancel'),
        {idOffre: this.state.data.id_offre, idNotif: this.state.data.id},
        axiosConfig,
      )
      .then(res => {
        if (res.data.success) {
          //getUnreadNotification();
          sendNotification(this.state.data.client.id);
          this.props.navigation.navigate('Home');
          ToastAndroid.show("Fermeture de l'offre effectué", ToastAndroid.LONG);
        }
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({cancelling: false, showConfirm: false});
      });
  }
}

const _styles = StyleSheet.create({
  main_container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  content: {
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    minHeight: 200,
    width: '100%',
    alignItems: 'center',
    marginTop: -60,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  photo_container: {
    width: 66,
    height: 66,
    borderRadius: 33,
    marginTop: -33,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
  },
  photo: {
    width: 55,
    height: 55,
  },
  pseudo: {
    fontFamily: 'Feather',
    fontSize: 20,
    color: colors.primary,
    marginTop: 5,
  },
  input_container: {
    width: '100%',
    borderWidth: 1,
    height: 50,
    marginTop: 20,
  },
  label: {
    position: 'absolute',
    top: -12,
    left: 20,
    fontFamily: 'Feather',
    paddingHorizontal: 10,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    color: colors.primary,
  },
  button: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: 10,
    marginTop: 20,
    flexDirection: 'row',
  },
  button_text: {
    fontFamily: 'Feather',
    fontSize: 18,
    color: colors.light,
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
});
