/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Platform,
  Keyboard,
  ActivityIndicator,
  ScrollView,
  Appearance,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {api_url, public_url} from '../../helpers/url';
import Header from '../components/header';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import axios from 'axios';
import {boxShadow} from '../../helpers/box_shadow';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import moment from 'moment';
import {connect} from 'react-redux';
import {
  setMessageServiceId,
  setScreenMessage,
} from '../../store/slices/screen_slice';
import {pushContent, setContents} from '../../store/slices/message_slice';
import {
  getUnreadMessage,
  longDate,
  requestPermission,
} from '../../helpers/util';
import {styles} from '../../helpers/styles';
import {ChooseCamera} from '../../elements';
import QTWebsocket from '../../helpers/websocket';

const colorScheme = Appearance.getColorScheme();

class Messenger extends Component {
  state = {
    choiceVisible: false,
    data: null,
    message: '',
    loading: true,
    socket: QTWebsocket.getInstance(),
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header
          title={
            this.props.route.params.type === 'ticket'
              ? 'Assistance'
              : 'Reglement de litige'
          }
          navigation={this.props.navigation}
        />
        <View style={_styles.main}>
          <View style={_styles.header}>
            <Text style={_styles.header_text}>
              Ticket N°{this.props.route.params.numero}
            </Text>
            {this.props.route.params.type === 'litige' ? (
              <Text style={[_styles.header_text, {color: colors.danger}]}>
                {this.props.route.params.ref}
              </Text>
            ) : null}
            <Text style={_styles.header_text}>
              {moment(this.props.route.params.created_at).format('DD/MM/YYYY')}
            </Text>
          </View>
          <ScrollView
            ref={scrollView => (this.scrollView = scrollView)}
            keyboardShouldPersistTaps="handled">
            <View style={_styles.body}>
              {this.props.message.contents.map(item => {
                return (
                  <View
                    key={item.id}
                    style={[
                      _styles.message_container,
                      item.sender === 'user'
                        ? _styles.message_container_user
                        : {},
                    ]}>
                    {this.setMessageText(item)}
                    {this.setMessagePieceJointe(item)}
                  </View>
                );
              })}
            </View>
          </ScrollView>
          {this.setLoading()}
        </View>
        {this.setFooterContent()}
        <ChooseCamera
          show={this.state.choiceVisible}
          onCancel={() => this.setState({choiceVisible: false})}
          onCamera={() => this.openCamera()}
          onLibrary={() => this.openLibrary()}
        />
      </View>
    );
  }
  async openCamera() {
    this.setState({choiceVisible: false});
    let isCameraPermitted = await requestPermission.camera();
    let isStoragePermitted = await requestPermission.externalStorage();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera({mediaType: 'photo'}, response => {
        if (response.assets) {
          this.saveFileToState(response.assets[0]);
        }
      });
    }
  }
  openLibrary() {
    this.setState({choiceVisible: false});
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets) {
        this.saveFileToState(response.assets[0]);
      }
    });
  }
  saveFileToState(file) {
    let uri = file.uri;
    let type = file.type;
    let name = file.fileName;
    const data = new FormData();
    data.append('photo', {
      name: name,
      type: type,
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
    });
    this.setState({data: data});
  }
  setLoading() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          style={_styles.loading}
          size="large"
          color={colors.secondary}
        />
      );
    }
    return null;
  }
  setMessageText(item) {
    if (item.message) {
      return (
        <View style={_styles.message_text_container}>
          {item.sender === 'admin' ? (
            <Image
              style={_styles.photo_admin}
              source={require('../../assets/img/avatar.png')}
            />
          ) : null}

          <Text
            style={[
              _styles.message_text,
              item.sender === 'user'
                ? _styles.message_user
                : _styles.message_admin,
            ]}>
            {item.message}
          </Text>
        </View>
      );
    }
    return null;
  }
  setMessagePieceJointe(item) {
    if (item.piece_jointe) {
      return (
        <View
          style={[
            _styles.piece_jointe_container,
            item.sender === 'user'
              ? {flexDirection: 'row'}
              : {flexDirection: 'row-reverse', marginRight: 55},
          ]}>
          <Entypo
            name="share"
            size={24}
            color={colors.primary}
            style={[
              _styles.share_icon,
              item.sender === 'user' ? {marginRight: 5} : {marginLeft: 5},
            ]}
          />
          <View style={{flex: 1}}>
            <Image
              style={[_styles.piece_jointe, {aspectRatio: item.ratioImage}]}
              source={{uri: public_url('piece_jointe/' + item.piece_jointe)}}
            />
          </View>
        </View>
      );
    }
    return null;
  }
  setFooterContent() {
    if (!this.props.route.params.closed) {
      return (
        <View style={[_styles.footer, boxShadow.depth_5]}>
          <Pressable
            style={{marginRight: 5}}
            onPress={() => this.setState({choiceVisible: true})}>
            <Feather name="paperclip" size={24} color={colors.primary} />
          </Pressable>
          <TextInput
            style={_styles.input}
            multiline={true}
            placeholder="Ecrivez..."
            placeholderTextColor={colors.light}
            value={this.state.message}
            onChangeText={value => this.setState({message: value})}
          />
          <Pressable style={{marginLeft: 5}} onPress={() => this.submit()}>
            <Octicons name="paper-airplane" size={28} color={colors.primary} />
          </Pressable>
        </View>
      );
    }
    return (
      <View style={[_styles.footer, boxShadow.depth_5]}>
        <Text style={_styles.closed}>Cette discussion est fermée</Text>
      </View>
    );
  }
  submit() {
    Keyboard.dismiss();
    if (this.state.data === null && this.state.message.trim().length === 0) {
      return false;
    }
    let post = this.state.data;
    if (post === null) {
      post = new FormData();
    }
    post.append('message', this.state.message);
    post.append('idService', this.props.route.params.id);
    axios
      .post(api_url('Messages/add'), post, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        if (res.data.success) {
          this.setState({
            message: '',
            data: null,
          });
          this.state.socket.send(
            JSON.stringify({
              type: 'message',
              to: -1,
              idService: res.data.idService,
              pieceJointe: res.data.last.piece_jointe,
              message: res.data.last.message,
              date_: longDate(res.data.last.date_),
              userId: this.props.logged.id,
            }),
          );
          this.props.dispatch(pushContent(res.data.last));
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  componentDidMount() {
    console.log(this.props.route.params);
    this.props.dispatch(setScreenMessage(true));
    this.props.dispatch(
      setMessageServiceId(Number(this.props.route.params.id)),
    );
    // message/get/serviceId
    axios
      .get(api_url('messages/get/' + this.props.route.params.id))
      .then(response => {
        this.setState({loading: false});
        this.props.dispatch(setContents(response.data));
        this.scrollView.scrollToEnd({animated: true});
        getUnreadMessage();
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 403) {
          this.props.navigation.navigate('Login1');
        }
      });
  }
  componentDidUpdate() {
    this.scrollView.scrollToEnd({animated: true});
  }
  componentWillUnmount() {
    this.props.dispatch(setScreenMessage(false));
    this.props.dispatch(setMessageServiceId(0));
  }
}

const _styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingHorizontal: 15,
  },
  header_text: {
    fontFamily: 'Feather',
    color: colors.primary,
    fontSize: 16,
  },
  body: {
    flex: 1,
    paddingVertical: 10,
    position: 'relative',
    paddingHorizontal: 15,
  },
  message_container: {
    width: '100%',
    marginBottom: 5,
  },
  message_container_user: {
    alignItems: 'flex-end',
  },
  message_text_container: {
    width: '65%',
    flexDirection: 'row',
  },
  message_user: {
    backgroundColor: colors.primary,
  },
  message_admin: {
    backgroundColor: colors.secondary,
  },
  message_text: {
    fontFamily: 'Feather',
    color: colors.light,
    padding: 5,
    borderRadius: 5,
    width: '100%',
  },
  piece_jointe_container: {
    width: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    position: 'relative',
  },
  share_icon: {
    backgroundColor: colors.lightgray,
    padding: 5,
    borderRadius: 50,
    position: 'absolute',
    left: -50,
  },
  piece_jointe: {
    flex: 1,
    width: '100%',
  },
  photo_admin: {
    width: 45,
    height: 45,
    borderRadius: 45,
    marginRight: 10,
  },
  footer: {
    height: 60,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: colors.light,
  },
  closed: {
    fontFamily: 'Feather',
    fontSize: 18,
    textAlign: 'center',
    color: colors.success,
    width: '100%',
  },

  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '105%',
    backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light,
  },
});

const mapStateToProps = state => {
  const {screen, message, logged} = state;
  return {screen, message, logged};
};

export default connect(mapStateToProps)(Messenger);
