/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
  Appearance,
} from 'react-native';
import {colors} from '../../helpers/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {api_url, public_url} from '../../helpers/url';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {connect} from 'react-redux';
import {setNumeros} from '../../store/slices/logged_slice';
import {getStars, requestPermission} from '../../helpers/util';
import {ChooseCamera} from '../../elements';
import {styles} from '../../helpers/styles';

const colorScheme = Appearance.getColorScheme();

class ModePaiement extends Component {
  state = {
    loading: true,
    profil: {
      photo: null,
      pseudo: null,
      email: null,
      phone: null,
      nbre_avis: 0,
      nbre_achat: 0,
      nbre_vente: 0,
    },
    choiceVisible: false,
    stars: [],
  };
  render() {
    return (
      <View style={[styles.wrapper, {position: 'relative'}]}>
        <ScrollView>
          {this.setLoading()}
          <View style={_styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <FontAwesome name="arrow-left" size={24} color={colors.light} />
            </TouchableOpacity>
            {this.props.route.params.me ? (
              <TouchableOpacity
                onPress={() => this.setState({choiceVisible: true})}>
                <Entypo name="camera" size={24} color={colors.light} />
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={_styles.banner}>
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
              {this.props.route.params.updatedProfil
                ? this.props.route.params.updatedProfil.pseudo
                : this.state.profil.pseudo}
            </Text>
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
            <View style={_styles.avis_container}>
              <Text style={[styles.text, _styles.avis_text]}>
                {this.state.profil.nbre_vente} ventes /{' '}
                {this.state.profil.nbre_achat} achat
              </Text>
              <Text style={[styles.text, _styles.avis_text]}>
                {this.state.profil.nbre_avis} Avis
              </Text>
            </View>
            {this.setLinkProfil()}
          </View>
          <View style={_styles.main_container}>
            <Text style={_styles.title}>Information & confidentialité</Text>
            <View style={_styles.info_container}>
              <FontAwesome name="envelope" size={24} color={colors.gold} />
              <Text style={[styles.text, _styles.info_text]}>
                {this.props.route.params.updatedProfil
                  ? this.props.route.params.updatedProfil.email
                  : this.state.profil.email}
              </Text>
            </View>
            <View style={_styles.info_container}>
              <FontAwesome name="phone" size={24} color={colors.secondary} />
              <Text style={[styles.text, _styles.info_text]}>
                {this.props.route.params.updatedProfil
                  ? this.props.route.params.updatedProfil.phone
                  : this.state.profil.phone}
              </Text>
            </View>
            {this.setModePaiement()}
          </View>
        </ScrollView>
        <View style={_styles.footer}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}>
            <Entypo name="home" size={32} color={colors.gray} />
          </TouchableOpacity>
        </View>
        <ChooseCamera
          show={this.state.choiceVisible}
          onCancel={() => this.setState({choiceVisible: false})}
          onCamera={() => this.openCamera()}
          onLibrary={() => this.openLibrary()}
        />
      </View>
    );
  }
  setLoading() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      );
    }
    return null;
  }
  componentDidMount() {
    let url = api_url('user/profil');
    if (!this.props.route.params.me) {
      url = api_url('user/profil/' + this.props.route.params.id);
    }
    axios
      .get(url)
      .then(response => {
        this.setState({
          profil: response.data.profil,
        });
        this.setStarNote(response.data.profil);
        this.props.dispatch(setNumeros(response.data.numeros));
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      })
      .finally(() => {
        this.setState({loading: false});
      });
  }
  async openCamera() {
    this.setState({choiceVisible: false});
    let isCameraPermitted = await requestPermission.camera();
    let isStoragePermitted = await requestPermission.externalStorage();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera({mediaType: 'photo'}, response => {
        if (response.assets) {
          this.uploadPhoto(response.assets[0]);
        }
      });
    }
  }
  openLibrary() {
    this.setState({choiceVisible: false});
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets) {
        this.uploadPhoto(response.assets[0]);
      }
    });
  }
  uploadPhoto(file) {
    let uri = file.uri;
    let type = file.type;
    let name = file.fileName;
    const data = new FormData();
    data.append('photo', {
      name: name,
      type: type,
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
    });
    axios
      .post(api_url('user/changePhoto'), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        if (res.data.success) {
          this.setState({profil: res.data.user});
        }
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  setLinkProfil() {
    if (this.props.route.params.me) {
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('EditProfil', {
              profil: this.props.route.params.updatedProfil
                ? this.props.route.params.updatedProfil
                : this.state.profil,
            })
          }>
          <Text style={_styles.profil_link}>Modifier mon profil</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Avis', {
            id: this.props.route.params.id,
          })
        }>
        <Text style={_styles.profil_link}>Donner un avis</Text>
      </TouchableOpacity>
    );
  }
  setModePaiement() {
    if (this.props.route.params.me) {
      return (
        <View>
          <Text style={[_styles.title, {marginTop: 10}]}>
            Mode de paiement & retrait
          </Text>
          <View>
            {this.props.logged.numeros.map(item => {
              return (
                <View style={_styles.info_container} key={item.id}>
                  <Image
                    source={{uri: public_url('images/' + item.logo)}}
                    style={_styles.info_image}
                  />
                  <Text style={[styles.text, _styles.info_text]}>
                    {item.numero}
                  </Text>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={_styles.add_new}
            onPress={() => this.props.navigation.navigate('AddPaiement')}>
            <FontAwesome name="plus-circle" size={24} color={colors.success} />
            <Text style={[styles.text, _styles.info_text]}>
              Ajouter nouveau
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
  setStarNote(profil) {
    this.setState({stars: getStars(profil)});
  }
}

const _styles = StyleSheet.create({
  header: {
    height: 150,
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  banner: {
    marginHorizontal: 20,
    marginTop: -75,
    backgroundColor: colorScheme === 'dark' ? colors.black : 'white',
    minHeight: 150,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  photo: {
    width: 80,
    height: 80,
    borderRadius: 80,
    position: 'absolute',
    top: -40,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  pseudo: {
    textAlign: 'center',
    fontFamily: 'Feather',
    fontSize: 17,
    color: colors.primary,
    marginTop: 50,
  },
  star_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
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
    fontSize: 17,
  },
  profil_link: {
    textAlign: 'center',
    fontFamily: 'Feather',
    fontSize: 16,
    color: colors.primary,
    marginTop: 10,
  },
  main_container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontFamily: 'Feather',
    fontSize: 18,
    color: colors.primary,
  },
  info_container: {
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
  info_text: {
    marginLeft: 10,
  },
  info_image: {
    width: 24,
    height: 24,
  },
  add_new: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  footer: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: colors.gray,
    borderTopWidth: 1,
  },
});

const mapStateToProps = state => {
  const {logged} = state;
  return {logged};
};

export default connect(mapStateToProps)(ModePaiement);
