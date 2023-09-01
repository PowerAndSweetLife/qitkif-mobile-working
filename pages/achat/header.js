import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../helpers/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

class Header extends Component {
  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.props.navigation.goBack()}>
          <AntDesign name="arrowleft" size={32} color={colors.light} />
        </TouchableOpacity>
        {this.setProgression()}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.props.navigation.navigate('Home')}>
          <Text style={styles.header_title}>Annuler</Text>
        </TouchableOpacity>
      </View>
    );
  }
  setProgression() {
    return (
      <View style={styles.progression}>
        <View
          style={[
            styles.progression_items,
            Number(this.props.progress) >= 1
              ? {backgroundColor: colors.success}
              : {},
          ]}
        />
        <View
          style={[
            styles.progression_items,
            Number(this.props.progress) >= 2
              ? {backgroundColor: colors.success}
              : {},
          ]}
        />
        <View
          style={[
            styles.progression_items,
            Number(this.props.progress) >= 3
              ? {backgroundColor: colors.success}
              : {},
          ]}
        />
        <View
          style={[
            styles.progression_items,
            Number(this.props.progress) >= 4
              ? {backgroundColor: colors.success}
              : {},
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  progression: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  progression_items: {
    width: 35,
    height: 3,
    backgroundColor: colors.light,
    marginHorizontal: 2.5,
  },
  header_title: {
    color: colors.light,
    fontFamily: 'Feather',
    fontSize: 17,
  },
});

export default Header;
