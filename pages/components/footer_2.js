import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Appearance} from 'react-native';
import {colors} from '../../helpers/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const colorScheme = Appearance.getColorScheme();
class Footer2 extends Component {
  render() {
    return (
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <AntDesign name="arrowleft" size={42} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Home')}>
          <Entypo name="home" size={42} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign
            name="message1"
            size={24}
            style={styles.footer_menu_icon_message}
            color={colors.light}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light,
  },
  footer_menu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer_menu_icon_message: {
    backgroundColor: colors.success,
    padding: 7,
    borderRadius: 5,
  },
});

export default Footer2;
