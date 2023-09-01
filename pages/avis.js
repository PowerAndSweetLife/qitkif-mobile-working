/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Pressable,
  TextInput,
} from 'react-native';
import {colors} from '../helpers/colors';
import {api_url, public_url} from '../helpers/url';
import Header from './components/header';
import Entypo from 'react-native-vector-icons/Entypo';
import {styles} from '../helpers/styles';

export default class Avis extends Component {
  state = {
    profil: {
      photo: null,
      pseudo: null,
    },
    submitted: false,
    note: 0,
    comment: null,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header navigation={this.props.navigation} title="Avis" />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{flex: 1}}>
            <View style={_styles.profil_wrapper}>
              <Image
                source={
                  this.state.profil.photo
                    ? {
                        uri: public_url(
                          'images/profils/' + this.state.profil.photo,
                        ),
                      }
                    : {uri: public_url('images/avatar.png')}
                }
                style={_styles.photo}
              />
              <Text style={_styles.pseudo}>
                {this.state.profil.pseudo ?? ''}
              </Text>
            </View>

            <View style={_styles.container}>
              <Text style={_styles.label}>Votre note</Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Pressable onPress={() => this.setNote(1)}>
                  <Entypo
                    name="star"
                    size={32}
                    color={this.state.note > 0 ? colors.gold : colors.gray}
                  />
                </Pressable>
                <Pressable
                  onPress={() => this.setNote(2)}
                  style={{marginLeft: 4}}>
                  <Entypo
                    name="star"
                    size={32}
                    color={this.state.note > 1 ? colors.gold : colors.gray}
                  />
                </Pressable>
                <Pressable
                  onPress={() => this.setNote(3)}
                  style={{marginLeft: 4}}>
                  <Entypo
                    name="star"
                    size={32}
                    color={this.state.note > 2 ? colors.gold : colors.gray}
                  />
                </Pressable>
                <Pressable
                  onPress={() => this.setNote(4)}
                  style={{marginLeft: 4}}>
                  <Entypo
                    name="star"
                    size={32}
                    color={this.state.note > 3 ? colors.gold : colors.gray}
                  />
                </Pressable>
                <Pressable
                  onPress={() => this.setNote(5)}
                  style={{marginLeft: 4, marginBottom: 10}}>
                  <Entypo
                    name="star"
                    size={32}
                    color={this.state.note > 4 ? colors.gold : colors.gray}
                  />
                </Pressable>
              </View>

              <Text style={_styles.label}>Laissez un commentaire</Text>
              <TextInput
                multiline={true}
                style={[_styles.input, {height: 100}]}
                onChangeText={value => this.setState({comment: value})}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                style={_styles.button_submit}
                disabled={this.state.submitted}
                onPress={() => this.submit()}>
                {this.setLoading()}
                <Text style={_styles.btn_text}>Envoyer mon avis</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
  setLoading() {
    if (this.state.submitted) {
      return (
        <ActivityIndicator
          color={colors.light}
          size="small"
          style={{marginRight: 5}}
        />
      );
    }
    return null;
  }
  setNote(note) {
    this.setState({note: note});
  }
  submit() {
    this.setState({submitted: true});
    axios
      .post(
        api_url('avis/add'),
        {
          note: this.state.note,
          comment: this.state.comment,
          idUser: this.props.route.params.id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )
      .then(response => {
        this.setState({note: 0, comment: null});
        this.props.navigation.goBack();
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({submitted: false});
      });
  }
  componentDidMount() {
    axios
      .get(api_url('user/profil/' + this.props.route.params.id))
      .then(response => {
        this.setState({
          profil: response.data.profil,
        });
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
}

const _styles = StyleSheet.create({
  profil_wrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  pseudo: {
    fontSize: 18,
    marginTop: 5,
    fontFamily: 'Feather',
    color: colors.primary,
  },
  container: {
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Feather',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray,
    textAlignVertical: 'center',
    paddingRight: 10,
    fontFamily: 'Feather',
    fontSize: 20,
  },
  button_submit: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: colors.primary,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn_text: {
    fontSize: 17,
    color: colors.light,
    textAlign: 'center',
  },
});
