import React, {Component} from 'react';
import {Appearance, Pressable, StyleSheet, View} from 'react-native';
import {colors} from '../helpers/colors';

const colorScheme = Appearance.getColorScheme();

export default class Radio extends Component {
  render() {
    return (
      <Pressable
        style={[_styles.container, this.props.container]}
        onPress={() => this.props.onPress()}>
        {this.props.active ? <View style={_styles.content} /> : null}
      </Pressable>
    );
  }
}

const _styles = StyleSheet.create({
  container: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? colors.light : colors.dark,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: colorScheme === 'dark' ? colors.light : colors.dark,
  },
});
